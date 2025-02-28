# for gpu

import torch
from flask import Flask, request, jsonify, send_from_directory
import os
import tempfile
import re
import logging
import soundfile as sf
from pydub import AudioSegment
from transformers import AutoTokenizer
from parler_tts import ParlerTTSForConditionalGeneration

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Set the cache directory to the local current directory
local_cache_dir = os.path.abspath('./local_cache')
os.makedirs(local_cache_dir, exist_ok=True)
os.environ['XDG_CACHE_HOME'] = local_cache_dir
os.environ['TORCH_HOME'] = local_cache_dir

app = Flask(__name__)

def preprocess_text(text):
    """
    Preprocess the input text to improve TTS output quality.
    This includes sentence splitting, punctuation correction, and whitespace normalization.
    """
    logger.debug(f"Preprocessing text: {text}")
    
    # Normalize whitespace
    text = ' '.join(text.split())
    
    # Add punctuation if missing at the end of sentences
    if not re.match(r'.*[.!?]$', text):
        text += '.'
    
    # Ensure proper spacing after punctuation
    text = re.sub(r'([.!?])(\w)', r'\1 \2', text)
    
    # Split text into sentences for better TTS handling
    sentences = re.split(r'(?<=[.!?]) +', text)
    
    logger.debug(f"Split text into sentences: {sentences}")
    return sentences

def add_pause_for_punctuation(sentence_audio, sentence):
    """
    Add a brief pause after commas in the sentence to improve prosody in the combined audio.
    """
    if ',' in sentence:
        pause = AudioSegment.silent(duration=200)  # 200 ms pause
        sentence_audio += pause
    return sentence_audio

@app.route('/generate_speech', methods=['POST'])
def generate_speech():
    logger.debug("Received request for /generate_speech")
    data = request.json
    text = data.get('text')
    description = data.get('description', 'A clear and natural speech.')

    if not text:
        logger.error("Missing 'text' in the request")
        return jsonify({"error": "Missing 'text' in the request"}), 400

    try:
        # Initialize the Parler-TTS model and tokenizer on demand
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")
        
        model = ParlerTTSForConditionalGeneration.from_pretrained("parler-tts/parler-tts-large-v1").to(device)
        tokenizer = AutoTokenizer.from_pretrained("parler-tts/parler-tts-large-v1")

        # Limit GPU memory usage to 5 GB
        if device == "cuda":
            total_memory_gb = torch.cuda.get_device_properties(0).total_memory / 1e9
            max_memory_gb = 15.0
            torch.cuda.set_per_process_memory_fraction(max_memory_gb / total_memory_gb)

        # Preprocess the input text
        sentences = preprocess_text(text)

        # Prepare to concatenate audio segments
        combined_audio = AudioSegment.silent(duration=0)

        for sentence in sentences:
            # Tokenize the description and text prompt for each sentence
            inputs = tokenizer(description, return_tensors="pt", padding=True).to(device)
            prompt_inputs = tokenizer(sentence, return_tensors="pt", padding=True).to(device)

            # Ensure attention masks are correctly handled
            inputs['attention_mask'] = inputs['input_ids'].ne(tokenizer.pad_token_id).to(device)
            prompt_inputs['attention_mask'] = prompt_inputs['input_ids'].ne(tokenizer.pad_token_id).to(device)

            # Generate speech for the sentence
            generation = model.generate(**inputs, prompt_input_ids=prompt_inputs['input_ids'], 
                                        prompt_attention_mask=prompt_inputs['attention_mask'])
            
            if isinstance(generation, tuple):
                generation = generation[0]

            audio_arr = generation.cpu().numpy().squeeze()  # Move output to CPU immediately

            # Save the sentence audio to a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav', dir=local_cache_dir) as temp_file:
                sentence_output_path = temp_file.name
                sf.write(sentence_output_path, audio_arr, model.config.sampling_rate)

            # Load the generated audio
            sentence_audio = AudioSegment.from_wav(sentence_output_path)
            
            # Add a pause for commas to improve prosody
            sentence_audio = add_pause_for_punctuation(sentence_audio, sentence)

            # Concatenate the sentence audio to the combined audio
            combined_audio += sentence_audio

            # Clean up the temporary file
            os.remove(sentence_output_path)

        # Save the combined audio to a final file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav', dir=local_cache_dir) as temp_file:
            combined_output_path = temp_file.name
            combined_audio.export(combined_output_path, format="wav")

        # Clear cache and unload the model to free up memory
        del model
        torch.cuda.empty_cache()

        # Return the generated combined audio file
        directory = os.path.abspath(local_cache_dir)
        filename = os.path.basename(combined_output_path)
        logger.info(f"Generated combined audio file at {combined_output_path}")
        return send_from_directory(directory, filename, as_attachment=True)
    except Exception as e:
        logger.error(f"Error in /generate_speech: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting the Flask server...")
    app.run(host='0.0.0.0', port=7000)

