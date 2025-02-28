from flask import Flask, request, send_file, jsonify
from diffusers import StableDiffusion3Pipeline
import torch
import os
from PIL import Image
import logging
import time
import gc

# Initialize logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

model_id = "stabilityai/stable-diffusion-3-medium-diffusers"
device = "cuda" if torch.cuda.is_available() else "cpu"

# Function to limit GPU memory usage
def limit_gpu_memory(max_memory_gb):
    total_memory_gb = torch.cuda.get_device_properties(0).total_memory / 1e9
    fraction = max_memory_gb / total_memory_gb
    torch.cuda.set_per_process_memory_fraction(fraction)
    logging.info(f"GPU memory limited to {max_memory_gb} GB out of {total_memory_gb} GB")

def load_model():
    try:
        logging.info("Loading model pipeline...")
        pipe = StableDiffusion3Pipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16
        )
        logging.info("Model pipeline loaded successfully.")
        pipe = pipe.to(device)
        return pipe
    except Exception as e:
        logging.error(f"Error loading model: {e}")
        raise

def unload_model(pipe):
    try:
        del pipe
        torch.cuda.empty_cache()
        torch.cuda.synchronize()
        gc.collect()
        logging.info("Model pipeline unloaded successfully.")
    except Exception as e:
        logging.error(f"Error unloading model: {e}")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    image_path = None

    if not data or 'prompt' not in data:
        return jsonify({"error": "No prompt provided"}), 400

    prompt = data['prompt']
    negative_prompt = data.get('negative_prompt', "")
    num_inference_steps = int(data.get('num_inference_steps', 28))
    guidance_scale = float(data.get('guidance_scale', 7.0))

    try:
        # Add delay to ensure GPU is released from previous API
        logging.info("Waiting for 10 seconds before loading the model...")
        time.sleep(10)

        # Limit GPU memory usage
        limit_gpu_memory(20)

        # Clear any remaining cache
        torch.cuda.empty_cache()
        torch.cuda.synchronize()
        gc.collect()

        pipe = load_model()

        # Generate image using the prompt
        result = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale
        )
        image = result.images[0]

        # Save the image to a file
        image_path = "generated_image.png"
        image.save(image_path)

        # Send the image file as a response
        return send_file(image_path, mimetype='image/png')
    except Exception as e:
        logging.error(f"Error during processing: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the generated image file and unload the model
        try:
            if image_path and os.path.exists(image_path):
                os.remove(image_path)
                logging.info("Generated image file removed successfully.")
        except Exception as file_error:
            logging.error(f"Error removing image file: {file_error}")
        
        try:
            if 'pipe' in locals():
                unload_model(pipe)
        except Exception as unload_error:
            logging.error(f"Error unloading model: {unload_error}")

        # Ensure proper cleanup
        time.sleep(10)  # Ensure GPU is released by adding delay after unloading

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9500)

