# 🎨 Turing Studio Frontend (🚧 Incomplete & Not Functioning)  

This is the **React-based frontend** for the **Turing Studio** AI video generation platform.  
⚠️ **Note:** The frontend is currently **unfinished and non-functional**.  
I've been using **Postman** to generate videos instead of finishing this—maybe one day I'll stop being lazy and actually complete it. 🤷‍♂️  

---

## 🚀 Features (Planned)  
- User-friendly **interface** for text-to-video generation.  
- **Form input** for video descriptions and customization.  
- **Preview** of generated images, scripts, and voiceovers.  
- **Progress tracking** while AI components are being created.  
- **Final video playback** with download options.  

---

## 📦 Installation  

### **1️⃣ Clone the Repository**
```bash
git clone <your-repo-url>
cd turing-studio
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Run the Development Server**
```bash
npm start
```
The frontend should be available at **`http://localhost:3000`**, but…  
💀 **It doesn’t actually work yet.**  

---

## 📡 API Integration (TODO)  

Right now, the backend API is working fine via **Postman**, but at some point, this frontend will need to communicate with it.  

### **1️⃣ Generate Video**
🔹 **Backend API Endpoint:**  
`POST http://localhost:5000/generate-video`  

🔹 **Request Body (JSON):**  
```json
{
  "description": "A futuristic city with neon lights",
  "voiceOverTranscript": "In the year 2050, technology has changed everything."
}
```

🔹 **Expected Response:**  
- Video script, images, and audio files.  

---

### **2️⃣ Combine Final Video**
🔹 **Backend API Endpoint:**  
`POST http://localhost:5000/combine-video`  

🔹 **Request Body (JSON):**  
```json
{
  "videoId": "unique_video_id",
  "musicPrompt": "Epic cinematic music",
  "platform": "youtube"
}
```

🔹 **Expected Response:**  
- Returns the final **MP4 video** with music and voiceover.  

---

## 🛑 Known Issues  
✅ **The backend works fine.**  
❌ **The frontend doesn’t.**  
❌ No UI for generating videos.  
❌ No error handling.  
❌ No API connection.  

---

## 🔥 Future Plans (If I Ever Finish It)  
- Actually make this frontend **work**.  
- Implement **Redux** for state management.  
- Add **loading indicators** for long API requests.  
- Display generated images, videos, and voiceover previews.  
- Add **download options** for final videos.  

---

## 📜 Dependencies  

Current dependencies that exist but **aren't being used**:  
```json
"dependencies": {
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.24.0",
  "antd": "^5.19.0",
  "replicate": "^0.31.0"
}
```
This means:  
- I planned to use **React Router** but haven’t added routes.  
- **Ant Design** is here, but no UI components exist.  
- **Replicate AI** is installed, but I forgot why. 🤔  

---

## 🤝 Contributing  
Feel free to fork this repo and **finish what I started**.  
Or just use Postman like me. 😆  

---

## 📝 License  
MIT License. Use it however you want.  

🎬 **Turing Studio—Frontend That Might Work One Day™** 🚀