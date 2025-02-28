# Background Music Generation API 🎵  

This API generates **background music** for videos using **Facebook's MusicGen model**. Built with **FastAPI**, it allows users to create music tracks from text prompts with customizable duration and output formats.  

---

## 🚀 Features  
- **Text-to-Music Generation** using **MusicGen-Large**.  
- Supports **WAV and MP3** output formats.  
- **Configurable duration** for generated tracks.  
- Automatically **cleans up temporary files** after serving responses.  
- Runs on **GPU if available**, otherwise falls back to CPU.  

---

## 📦 Installation  

1. **Clone the repository:**  
   ```bash
   git clone <your-repo-url>
   cd music-generation-api
   ```

2. **Install dependencies:**  
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the API:**  
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

   The API will start on **`http://0.0.0.0:8000`**.  

---

## 📡 API Usage  

### **Generate Background Music**  
**Endpoint:**  
`POST /generate-music/`  

**Request Body (JSON):**  
```json
{
  "prompt": "A relaxing ambient melody with soft piano",
  "duration": 10,
  "output_format": "mp3"
}
```  

**Response:**  
- Returns a **WAV or MP3 audio file** generated based on the prompt.  

---

## ⚙️ Configuration Options  

| Parameter          | Type   | Default | Description |
|--------------------|--------|---------|-------------|
| `prompt`          | `str`  | **Required** | Text prompt describing the music. |
| `duration`        | `int`  | **Required** | Duration of the generated music (in seconds). |
| `output_format`   | `str`  | `"wav"` | Output format: `"wav"` or `"mp3"`. |

---

## 🛑 Known Issues & Limitations  
- **Longer durations may slow down processing.**  
- **Quality may vary** depending on the prompt complexity.  
- **Temporary files are automatically deleted** after serving responses.  

---

## 🔥 Future Improvements  
- **Support for different music styles and instruments.**  
- **Real-time streaming of generated music.**  
- **Fine-tuning options for music variation.**  

---

## 🤝 Contributing  
Contributions are welcome! Fork the project, make changes, and submit a pull request.  

---

## 📝 License  
MIT License. Feel free to use and modify this API as needed.  

🎶 **Enjoy Creating Music!** 🎶