# Healthify

Healthify is a modern health report analyzer built with React and Vite. Effortlessly upload your medical reports (PDF or image), extract key health parameters using AI-powered OCR, and get instant insights—all in a beautiful, user-friendly interface.

## Features

- ⚡ Fast, responsive React + Vite frontend
- 📄 Upload PDF or image health reports
- 🤖 AI-powered extraction of health parameters
- 🩺 Instant insights: flags abnormal values, highlights what needs attention
- 🎨 Clean, modern UI with animated health-themed effects
- 🔒 Simple login/auth flow for a real user experience

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```

3. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

## Backend

- The backend (Python FastAPI) handles file uploads and OCR extraction.
- Make sure the backend is running at `http://localhost:8000/api/v1/upload`.

## Customization

- Update health parameter extraction logic in `backend/utils/ocr_parser.py`.
- Tweak UI/UX in `frontend/src/components/UploadForm.jsx` and `Login.jsx`.

---

Built with  for better health
