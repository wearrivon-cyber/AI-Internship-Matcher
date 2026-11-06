AI Internship Matcher

Developed by Internlytic Technologies

A full-stack AI-powered internship matching platform designed to help students discover suitable career opportunities based on their skills, educational background, and professional interests.

🌐 Project Links

- Live Demo: https://wearrivon-cyber.github.io/AI-Internship-Matcher/
- GitHub Repository: https://github.com/wearrivon-cyber/AI-Internship-Matcher

✨ Key Features

- CV Upload & Parsing: Extract skills from PDF, DOCX, and TXT resumes.
- Manual Skills Input: Enter skills and career interests manually.
- Student Profile Management: Create and save student profiles.
- Internship Matching: Recommend programmes based on profile alignment.
- Skill Gap Analysis: Identify matching and missing skills.
- Eligibility Assessment: Evaluate educational eligibility.
- Internship Catalogue: Browse programme previews across career tracks.
- Responsive Dashboard: Navigate through a clean, user-friendly interface.

🛠️ Technology Stack

Component| Technologies
Frontend| React, Vite, JavaScript, CSS
Backend| Python, FastAPI
Database| SQLite
API Communication| Axios
Document Processing| PyPDF, python-docx
Version Control| Git, GitHub

🧠 Matching Algorithm

The application uses a transparent, rule-based matching approach.

Matching Score:

- 80% — Required Skill Coverage
- 20% — Interest Overlap

Educational eligibility is evaluated separately from the matching score.

The system also identifies skills that students may need to strengthen.

📁 Project Structure

AI-Internship-Matcher/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   ├── data/
│   ├── tests/
│   └── requirements.txt
│
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── PRESENTATION_OUTLINE.md
│   ├── TESTING_CHECKLIST.md
│   └── GITHUB_AND_DEPLOYMENT.md
│
├── README.md
└── .gitignore

⚙️ Local Installation & Setup

Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

1. Clone the Repository

git clone https://github.com/wearrivon-cyber/AI-Internship-Matcher.git
cd AI-Internship-Matcher

2. Backend Setup

cd backend
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Backend API:

"http://127.0.0.1:8000"

API Documentation:

"http://127.0.0.1:8000/docs"

3. Frontend Setup

Open a separate terminal:

cd frontend
npm install
npm run dev

Open the local development URL displayed in the terminal.

🚀 Deployment Information

The frontend is published through GitHub Pages.

The backend currently runs locally and is not deployed as a public API service. Therefore, CV parsing, live matching requests, and profile saving require the backend to be running locally.

The public website provides a frontend demonstration and illustrative internship programme catalogue.

🧪 Testing

The project includes backend testing for matching functionality.

Testing documentation is available in the "docs/" directory.

📚 Project Documentation

Additional documentation includes:

- Project Overview
- Presentation Outline
- Testing Checklist
- GitHub and Deployment Guide

⚠️ Important Notice

The internship catalogue contains illustrative programme previews for demonstration and testing purposes. These are not verified live vacancies or confirmed recruitment opportunities.

Application information will be provided when officially available.

👩‍💻 Author

Developed as an AI & ML Internship Project

Organization: Internlytic Technologies

GitHub: https://github.com/wearrivon-cyber

---

Building clearer pathways between student skills and career opportunities.