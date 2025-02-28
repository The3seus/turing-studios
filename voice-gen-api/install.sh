#!/bin/bash

# Update and install system dependencies
sudo apt-get update && sudo apt-get install -y \
    build-essential \
    libsndfile1

# Create a conda environment if conda is installed
if command -v conda &> /dev/null
then
    conda create -n coqui_tts python=3.9 -y
    conda activate coqui_tts
fi

# Install Python dependencies
pip install -r requirements.txt
