# Medical AI - Smart Healthcare Assistant

Medical AI is a comprehensive, full-stack healthcare platform powered by Artificial Intelligence. Designed to bridge the gap between patients and healthcare professionals, it features an intelligent disease prediction engine, a conversational medical chatbot, and a seamless appointment booking system.

## 🚀 Features

### For Patients
* **Symptom Checker & Disease Prediction**: Enter your symptoms to receive an AI-driven preliminary diagnosis powered by Mistral AI.
* **Medical Chatbot**: Converse with an intelligent healthcare agent capable of answering general medical queries and remembering chat history.
* **Find & Book Doctors**: Browse doctors by specialization, view their availability, and seamlessly book appointments.
* **Patient Dashboard**: Track your upcoming and past medical appointments.

### For Doctors
* **Doctor Portal**: Dedicated login and registration for healthcare professionals.
* **Manage Appointments**: View and update the status (confirm/cancel) of patient appointments.
* **Customizable Availability**: Manage working hours, available days, and consultation fees.

### General
* **Secure Authentication**: End-to-end user and doctor authentication with encrypted passwords (bcrypt).
* **Containerized Deployment**: Fully Dockerized environment for the database, backend, and frontend for easy "plug and play" setup.

## 🛠️ Tech Stack

* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Backend**: Python 3.10, FastAPI, SQLAlchemy
* **AI & NLP**: Langchain, Langgraph, Mistral AI API
* **Database**: PostgreSQL (via Docker), SQLite (Local Dev)
* **Infrastructure**: Docker, Docker Compose, Uvicorn (ASGI server)

## 📁 Project Structure

```
FYP/
├── Backend/               # FastAPI Application
│   ├── main.py            # Entry point for the backend server
│   ├── models.py          # SQLAlchemy Database Models
│   ├── database.py        # Database connection and session management
│   ├── agents/            # Langchain & Langgraph Agent Logic
│   ├── prediction/        # Mistral AI Symptom Prediction logic
│   ├── alembic/           # Database migrations
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Docker configuration for backend
├── Frontend/              # Vanilla JS/HTML/CSS Web Client
│   ├── index.html         # Landing Page
│   ├── auth.html          # Patient Authentication
│   ├── doctor.html        # Doctor Dashboard & Authentication
│   ├── app.js             # Patient portal logic
│   ├── doctor.js          # Doctor portal logic
│   └── Dockerfile         # Nginx Docker configuration for frontend
├── docker-compose.yml     # Multi-container orchestration
└── deployment_guide.md    # Guide for deploying to production
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose
* [Python 3.10+](https://www.python.org/downloads/) (if running locally without Docker)
* A valid **Mistral API Key**

## 🏗️ Setup & Installation

### Option 1: Running via Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd FYP
   ```

2. **Configure Environment Variables:**
   Create a `.env` file inside the `Backend` folder and add your Mistral API key:
   ```env
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```

3. **Start the containers:**
   From the root folder (`FYP/`), run:
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   * **Frontend**: `http://localhost:5500`
   * **Backend API Docs (Swagger)**: `http://localhost:8001/docs`

### Option 2: Running Locally (Without Docker)

1. **Setup Backend:**
   ```bash
   cd Backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Run Backend Server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **Run Frontend:**
   Use any live server extension (like VS Code Live Server) or Python's built-in HTTP server:
   ```bash
   cd ../Frontend
   python -m http.server 5500
   ```

## 🌍 API Endpoints Overview

* **Authentication**: `/signup`, `/login`, `/doctor/signup`, `/doctor/login`
* **AI Features**: 
  * `POST /predict`: Submit symptoms for disease prediction.
  * `POST /chat`: Interact with the medical chatbot.
* **Appointments**:
  * `GET /doctors`: Fetch list of available doctors.
  * `POST /book-appointment`: Book an appointment slot.
  * `GET /my-appointments`: Retrieve a patient's appointments.
  * `GET /doctor/appointments/{doctor_id}`: Retrieve a doctor's appointments.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
