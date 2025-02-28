# Text-to-Image API  

This API generates high-quality images from text prompts using **Stable Diffusion 3**. The images created by this API are optimized for use in video generation.  

---

## 🚀 Features  
- Generates **high-quality** images from text descriptions.  
- Uses **Stable Diffusion 3 Medium** for image synthesis.  
- Includes **GPU memory management** to optimize performance.  
- Supports **negative prompts** for better control over outputs.  
- Configurable inference steps and guidance scale.  

---

## 📦 Installation  

1. **Clone the repository:**  
   ```bash
   git clone <your-repo-url>
   cd text-to-image-api
   ```

2. **Install dependencies:**  
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the API:**  
   ```bash
   python app.py
   ```

   The API will start on **`http://0.0.0.0:9500`**.  

---

## 📡 API Usage  

### **Generate Image**  
**Endpoint:**  
`POST /generate`  

**Request Body (JSON):**  
```json
{
  "prompt": "A futuristic city at sunset",
  "negative_prompt": "blurry, low quality",
  "num_inference_steps": 28,
  "guidance_scale": 7.0
}
```  

**Response:**  
- Returns a **PNG image** generated from the text prompt.  

---

## ⚙️ Configuration Options  

| Parameter            | Type  | Default | Description |
|----------------------|-------|---------|-------------|
| `prompt`            | `str` | **Required** | Text prompt for image generation. |
| `negative_prompt`   | `str` | "" | Elements to avoid in the image. |
| `num_inference_steps` | `int` | 28 | Number of inference steps. |
| `guidance_scale`    | `float` | 7.0 | Controls adherence to the prompt. |

---

## 🛑 Known Issues & Limitations  
- **GPU memory is limited** to optimize stability.  
- A **10-second delay** is added before loading/unloading the model.  
- Images are **not stored** permanently—they are deleted after use.  

---

## 🔥 Future Improvements  
- **Optimize GPU memory handling** for better performance.  
- Allow users to specify **image resolution**.  
- Support for **batch image generation**.  

---

## 🤝 Contributing  
Contributions are welcome! Fork the project, make changes, and submit a pull request.  

---

## 📝 License  
MIT License. Feel free to use and modify this API as needed.  

🚀 **Happy Image Generation!** 🚀