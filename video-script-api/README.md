# 🎥 Text-to-Video Generation API  

This is the **main Node.js API** that generates **AI-powered videos** from text descriptions. It integrates multiple AI models to generate **video scripts, images, voiceovers, animations, background music, and final video compositions**.  

---

## 🚀 Features  
- **Fully automated video creation** from a text prompt.  
- **AI-generated scripts** using OpenAI GPT-4o or Ollama (Llama 3).  
- **DALL·E-3 image generation** or alternative **Stable Diffusion** models.  
- **Text-to-Speech voiceover** with cloned voices.  
- **AI-generated background music** for dynamic soundtracks.  
- **Image-to-video animation** to bring still images to life.  
- **Final video composition** including narration, music, and visuals.  

---

## 📦 Installation  

### **1️⃣ Clone the Repository**
```bash
git clone <your-repo-url>
cd text-to-video-api
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Install System Dependencies (if needed)**  
If you encounter an issue with `gl` or `editly`, install these missing dependencies:

```bash
sudo apt-get update
sudo apt-get install libxi-dev libxext-dev build-essential
```

Then, set the environment variable:

```bash
export PKG_CONFIG_PATH=/usr/lib/pkgconfig:/usr/share/pkgconfig:/usr/local/lib/pkgconfig
```

Now, retry installing the required package:

```bash
npm install editly
```

### **4️⃣ Set Up Environment Variables**
- Copy `.env.example` to `.env` and fill in API keys for OpenAI, local AI models, and other services.  

### **5️⃣ Run the API**
```bash
node app.js
```
The API will start on **`http://localhost:5000`**.  

### **6️⃣ (Optional) Run Ollama API for Local AI Processing**
If you want to use **Llama 3** instead of OpenAI:
```bash
node app_ollama.js
```

---

## 📡 API Usage  

### **1️⃣ Generate Video Components**  
**Endpoint:**  
`POST /generate-video`  

**Request Body (JSON):**  
```json
{
  "description": "A futuristic city at sunset with flying cars",
  "voiceOverTranscript": "In the year 2050, humanity has transformed cities into breathtaking landscapes of neon and innovation."
}
```  

**Response:**  
- Returns **video script, image prompts, generated images, voice-over audio, and animated videos**.  

---

### **2️⃣ Combine Final Video**  
**Endpoint:**  
`POST /combine-video`  

**Request Body (JSON):**  
```json
{
  "videoId": "unique_video_id",
  "musicPrompt": "Epic orchestral background music",
  "platform": "youtube"
}
```  

**Response:**  
- Returns the final **MP4 video** with narration, music, and animations.  

---

## 🔗 How It Works  

1️⃣ **Generate AI Video Script**  
   - Uses **GPT-4o** (or **Llama 3 with Ollama**) to create a concise and engaging script.  

2️⃣ **Generate Image Prompts**  
   - AI **breaks down the script into scenes** and generates **detailed image descriptions**.  

3️⃣ **Generate Images**  
   - Uses **DALL·E-3** (or **Stable Diffusion**) to create images for each scene.  

4️⃣ **Animate Images into Video Clips**  
   - Converts images into **short video animations**.  

5️⃣ **Generate AI Voiceover**  
   - Uses **text-to-speech** with cloned voices for narration.  

6️⃣ **Generate Background Music**  
   - AI **composes music** to match the video theme.  

7️⃣ **Combine Everything into Final Video**  
   - The system **edits and synchronizes** narration, music, and animations.  

---

## ⚙️ Configuration Options  

| Parameter             | Type    | Default | Description |
|-----------------------|--------|---------|-------------|
| `description`        | `str`  | **Required** | Text prompt for video generation. |
| `voiceOverTranscript` | `str`  | **Required** | AI-generated or user-provided narration. |
| `skipAnimation`      | `bool` | `false` | If `true`, only generates images without video animations. |
| `musicPrompt`        | `str`  | `"epic orchestral"` | Style of background music. |
| `platform`           | `str`  | `"youtube"` | Output format (e.g., TikTok, YouTube). |

---

## 🛑 Known Issues & Limitations  
- **Processing time** may vary depending on the length of the video.  
- **Stable Diffusion** (if used) can be **slower than DALL·E-3** for image generation.  
- **Ollama Llama-3 model** must be **run separately** if using local AI processing.  

---

## 🔥 Future Improvements  
- **Enable longer videos** beyond current time limits.  
- **Better motion animation** for images.  
- **Customizable voice styles** for narration.  
- **Multi-speaker dialogue support**.  

---

## 📜 Required Dependencies  

This API requires the following dependencies to function properly:

```json
{
  "name": "video-script-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Samuel Paniagua",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.7.2",
    "axios-retry": "^4.4.1",
    "cors": "^2.8.5",
    "delay": "^6.0.0",
    "dotenv": "^16.4.5",
    "editly": "^0.14.2",
    "express": "^4.19.2",
    "firebase-admin": "^12.2.0",
    "fluent-ffmpeg": "^2.1.3",
    "openai": "^4.52.2"
  }
}
```

If `editly` fails to install, follow these steps:

```bash
sudo apt-get update
sudo apt-get install libxi-dev libxext-dev build-essential
export PKG_CONFIG_PATH=/usr/lib/pkgconfig:/usr/share/pkgconfig:/usr/local/lib/pkgconfig
npm install editly
```

---

## 🤝 Contributing  
Contributions are welcome! Fork the project, make changes, and submit a pull request.  

---

## 📝 License  
MIT License. Feel free to use and modify this API as needed.  

🎬 **Create AI-Generated Videos with Ease!** 🚀  

**Author: Samuel Paniagua**