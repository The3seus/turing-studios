# Text-2-Video API (Experimental)

This is an **experimental** API for text-to-video generation using Stable Diffusion and AnimateDiff. It is implemented with Flask and leverages **Hugging Face Diffusers** to generate short animations based on textual prompts.

⚠️ **Note:** This API has been used only once or twice and is not production-ready.

---

## 🚀 Features
- Generates short videos from text prompts.
- Uses **AnimateDiff** for motion generation.
- Outputs **MP4** format videos.
- Customizable parameters: number of frames, resolution, FPS, and inference steps.
- Uses **CPU offloading** for efficiency.

---

## 📦 Dependencies
Ensure you have the required dependencies installed:

```bash
pip install flask torch diffusers moviepy numpy pillow
```

---

## 🛠️ Setup & Run

1. Clone the repository:

   ```bash
   git clone our_repo
   cd text-2-vid
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the API:

   ```bash
   python app.py
   ```

   The API will start on **`http://0.0.0.0:9700`**.

---

## 📡 API Usage

### **Generate Animation**
**Endpoint:**  
`POST /generate`

**Request Body (JSON):**
```json
{
  "prompt": "A futuristic city with flying cars",
  "num_frames": 16,
  "num_inference_steps": 50,
  "width": 512,
  "height": 512,
  "fps": 8
}
```

**Response:**  
- Returns an **MP4 video** generated from the text prompt.

---

## ⚙️ Configuration Options
| Parameter           | Type  | Default | Description |
|---------------------|-------|---------|-------------|
| `prompt`           | `str` | **Required** | Text prompt for video generation. |
| `num_frames`       | `int` | 16 | Number of frames in the animation. |
| `num_inference_steps` | `int` | 50 | Number of inference steps for generation. |
| `width`            | `int` | 512 | Width of the video. |
| `height`           | `int` | 512 | Height of the video. |
| `fps`              | `int` | 8 | Frames per second of the video. |

---

## 🛑 Known Issues & Limitations
- The API is **experimental** and may not always produce high-quality results.
- Currently, **GPU acceleration is not implemented**, so performance might be slow.
- Generated videos are **short** (default: 16 frames).
- **Motion quality can be inconsistent**, depending on the prompt.

---

## 📌 Future Improvements
- Implement **GPU acceleration** for faster processing.
- Support for **longer videos**.
- Improve **motion consistency and quality**.

---

## 🤝 Contributing
If you'd like to contribute, feel free to fork the project, make changes, and submit a pull request!

---

## 📝 License
MIT License.  
Feel free to use and modify this code, but remember that it's **not production-ready**.

---

🚀 **Happy Video Generation!** 🚀