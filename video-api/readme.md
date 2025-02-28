# Text-to-Video API  

This is the **main** API for generating short videos from text prompts using **Stable Diffusion** and **AnimateDiff**. The API is built with Flask and utilizes **Hugging Face Diffusers** to create animations.  

---

## 🚀 Features  
- **Text-to-Video Generation** using **AnimateDiff**.  
- Outputs **MP4** videos from textual descriptions.  
- **Configurable parameters**: frames, resolution, FPS, and inference steps.  
- **Efficient model handling** with CPU offloading.  

---

## 📦 Installation  

1. **Clone the repository:**  
   ```bash
   git clone <your-repo-url>
   cd text-to-video-api
   ```

2. **Install dependencies:**  
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the API:**  
   ```bash
   python app.py
   ```

   The API will start on **`http://0.0.0.0:9700`**.  

---

## 📡 API Usage  

### **Generate Video**  
**Endpoint:**  
`POST /generate`  

**Request Body (JSON):**  
```json
{
  "prompt": "A cyberpunk city with neon lights",
  "num_frames": 16,
  "num_inference_steps": 50,
  "width": 512,
  "height": 512,
  "fps": 8
}
```  

**Response:**  
- Returns an **MP4 video** based on the text prompt.  

---

## ⚙️ Configuration Options  

| Parameter            | Type  | Default | Description |
|----------------------|-------|---------|-------------|
| `prompt`            | `str` | **Required** | Text prompt for video generation. |
| `num_frames`        | `int` | 16 | Number of frames in the animation. |
| `num_inference_steps` | `int` | 50 | Number of inference steps. |
| `width`             | `int` | 512 | Width of the output video. |
| `height`            | `int` | 512 | Height of the output video. |
| `fps`               | `int` | 8 | Frames per second. |

---

## 🛑 Known Issues & Limitations  
- **GPU acceleration is not enabled**, which may slow down processing.  
- Motion quality can vary depending on the prompt.  
- Generates only **short clips** (default: 16 frames).  

---

## 🔥 Future Improvements  
- **Enable GPU acceleration** for faster generation.  
- Support for **longer video outputs**.  
- Improve **motion smoothness and quality**.  

---

## 🤝 Contributing  
Contributions are welcome! Fork the project, make changes, and submit a pull request.  

---

## 📝 License  
MIT License. Feel free to use and modify this API as needed.  

🚀 **Happy Video Generation!** 🚀