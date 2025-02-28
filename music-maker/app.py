from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from fastapi.responses import FileResponse
import tempfile
import uvicorn
import os
import scipy.io.wavfile
import torch
from transformers import pipeline
from pydub import AudioSegment

app = FastAPI()

class MusicRequest(BaseModel):
    prompt: str
    duration: int
    output_format: str = "wav"  # Default to 'wav' if not specified

# Disable tokenizers parallelism warning
os.environ["TOKENIZERS_PARALLELISM"] = "false"

@app.post("/generate-music/")
async def generate_music(request: MusicRequest, background_tasks: BackgroundTasks):
    if request.duration <= 0:
        raise HTTPException(status_code=400, detail="Duration must be greater than zero")

    if request.output_format not in ["wav", "mp3"]:
        raise HTTPException(status_code=400, detail="Invalid format. Supported formats: 'wav', 'mp3'")

    synthesiser = None  # Initialize synthesiser to None
    
    try:
        # Load the model
        device = 0 if torch.cuda.is_available() else -1
        synthesiser = pipeline("text-to-audio", model="facebook/musicgen-large", device=device)
        print(f"Model loaded successfully on {'CUDA' if device == 0 else 'CPU'}")

        # Generate the music
        music = synthesiser(request.prompt, forward_params={"do_sample": True, "max_length": request.duration * 50})

        # Write the music to a temporary WAV file
        tmpfile = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        scipy.io.wavfile.write(tmpfile.name, rate=music["sampling_rate"], data=music["audio"])

        # Convert to MP3 if requested
        if request.output_format == "mp3":
            mp3file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
            AudioSegment.from_wav(tmpfile.name).export(mp3file.name, format="mp3")
            os.remove(tmpfile.name)  # Remove the WAV file after converting
            tmpfile.name = mp3file.name  # Use the MP3 file for response

        # Add the temporary file to background tasks to delete it after sending the response
        background_tasks.add_task(delete_file, tmpfile.name)

        # Return the file response
        return FileResponse(tmpfile.name, media_type=f"audio/{request.output_format}", filename=f"musicgen_out.{request.output_format}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating music: {e}")
    finally:
        # Clean up and unload the model
        if synthesiser is not None:
            del synthesiser
        torch.cuda.empty_cache()

def delete_file(path: str):
    os.remove(path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

