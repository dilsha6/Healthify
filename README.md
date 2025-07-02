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
   Visit (https://dilsha6.github.io/Healthify/)

## Backend

- The backend (Python FastAPI) handles file uploads and OCR extraction.
- Make sure the backend is running at `http://localhost:8000/api/v1/upload`.

## Customization

- Update health parameter extraction logic in `backend/utils/ocr_parser.py`.
- Tweak UI/UX in `frontend/src/components/UploadForm.jsx` and `Login.jsx`.

---

Built with love for better health
![image](https://github.com/user-attachments/assets/533db12b-b90c-4e63-b300-e330c8fc92c0)
![image](https://github.com/user-attachments/assets/0777ae19-3a7e-4525-a841-77c2e0f987bc)
![image](https://github.com/user-attachments/assets/f7bc8e35-9241-4582-b1de-36cc1a707b88)
![image](https://github.com/user-attachments/assets/586d9e43-186f-4ce1-8af1-540e6f25f46b)



