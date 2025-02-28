from flask import Flask, request, send_file, jsonify
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import export_to_video
import torch
import os
from PIL import Image
import logging

# Initialize logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logging.info(f"Using device: {device}")

@app.route('/animate', methods=['POST'])
def animate():
    video_path = "output.mp4"  # Set video path
    logging.info("Received /animate request")

    if 'image' not in request.files:
        logging.error("No image part in the request")
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        logging.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    try:
        # Load and preprocess the image
        logging.info("Loading and preprocessing the image")
        image = Image.open(file.stream)
        image = image.convert("RGB")  # Ensure the image is in RGB format
        logging.info(f"Image mode: {image.mode}, size: {image.size}")
        image = image.resize((1024, 576))  # Resize to the desired dimensions

        # Load the model
        logging.info("Loading the model...")
        model_id = "stabilityai/stable-video-diffusion-img2vid-xt"
        pipeline = StableVideoDiffusionPipeline.from_pretrained(
            model_id, 
            torch_dtype=torch.float16, 
            variant="fp16"
        ).to(device)
        logging.info("Model loaded successfully.")

        # Generate video frames
        logging.info("Generating video frames")
        generator = torch.manual_seed(42)
        result = pipeline(image, decode_chunk_size=8, generator=generator)
        frames = result.frames[0]

        # Export frames to video
        logging.info("Exporting frames to video")
        export_to_video(frames, video_path, fps=7)

        # Send the video file as a response
        logging.info("Sending video file as response")
        return send_file(video_path, mimetype='video/mp4')
    except Exception as e:
        logging.error(f"Error during processing: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(video_path):
            logging.info("Removing temporary video file")
            os.remove(video_path)
        # Clear the cache to conserve GPU memory
        logging.info("Clearing GPU cache")
        torch.cuda.empty_cache()
        del pipeline  # Explicitly delete the pipeline
        torch.cuda.empty_cache()

if __name__ == '__main__':
    logging.info("Starting Flask app")
    app.run(host='0.0.0.0', port=9000)

