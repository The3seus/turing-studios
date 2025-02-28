import subprocess
import logging
from flask import jsonify

logger = logging.getLogger(__name__)

def list_speakers():
    try:
        result = subprocess.run(
            ["tts", "--model_name", "multilingual/multi-dataset/xtts_v2", "--list_speaker_idxs"],
            capture_output=True, text=True, check=True
        )
        speakers = result.stdout.splitlines()
        logger.info(f"Speakers: {speakers}")
        return jsonify({"speakers": speakers})
    except subprocess.CalledProcessError as e:
        logger.error(f"Error in /list_speakers: {e}")
        return jsonify({"error": str(e)}), 500
