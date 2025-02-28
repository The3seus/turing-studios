from flask import Flask, request, send_file, jsonify
import torch
from diffusers import AnimateDiffPipeline, DDIMScheduler, MotionAdapter
from diffusers.utils import export_to_gif
from moviepy.editor import ImageSequenceClip
import tempfile
import os
import numpy as np
from PIL import Image
import random

app = Flask(__name__)

# Load the MotionAdapter and the Stable Diffusion model with the AnimateDiffPipeline
adapter = MotionAdapter.from_pretrained("guoyww/animatediff-motion-adapter-v1-5-2", torch_dtype=torch.float16)
pipeline = AnimateDiffPipeline.from_pretrained("emilianJR/epiCRealism", motion_adapter=adapter, torch_dtype=torch.float16)
scheduler = DDIMScheduler.from_pretrained(
    "emilianJR/epiCRealism",
    subfolder="scheduler",
    clip_sample=False,
    timestep_spacing="linspace",
    beta_schedule="linear",
    steps_offset=1,
)
pipeline.scheduler = scheduler
pipeline.enable_vae_slicing()
pipeline.enable_model_cpu_offload()

@app.route('/generate', methods=['POST'])
def generate_animation():
    data = request.json
    prompt = data.get('prompt')
    negative_prompt = "bad quality, worse quality, low resolution"
    num_frames = data.get('num_frames', 16)  # Default to 16 if not provided
    guidance_scale = 7.5
    num_inference_steps = data.get('num_inference_steps', 50)  # Default to 50 if not provided
    width = data.get('width', 512)  # Default width if not provided
    height = data.get('height', 512)  # Default height if not provided
    fps = data.get('fps', 8)  # Default frames per second if not provided

    # Generate a random seed
    random_seed = random.randint(0, 2**32 - 1)
    generator = torch.Generator("cpu").manual_seed(random_seed)

    try:
        # Generate the video frames
        output = pipeline(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_frames=num_frames,
            guidance_scale=guidance_scale,
            num_inference_steps=num_inference_steps,
            generator=generator,
        )
        frames = output.frames[0]

        # Resize frames to the desired resolution and convert to numpy arrays
        frames_np = [np.array(frame.resize((width, height), Image.ANTIALIAS)) for frame in frames]

        # Convert frames to MP4
        with tempfile.TemporaryDirectory() as tmpdir:
            gif_path = os.path.join(tmpdir, 'animation.gif')
            export_to_gif(frames, gif_path)

            # Convert GIF to MP4 using moviepy
            clip = ImageSequenceClip(frames_np, fps=fps)
            mp4_path = os.path.join(tmpdir, 'animation.mp4')
            clip.write_videofile(mp4_path, codec='libx264')

            return send_file(mp4_path, mimetype='video/mp4')
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9700)
