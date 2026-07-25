# Paper Manufacturing Grade Change Automation System

An AI-assisted paper machine grade change system that predicts optimal target machine parameters (`NextBasisWeight`, `NextStockFlow`, `NextSteamPressure`, `NextMachineSpeed`, `NextMoisture`, `NextAsh`, `NextFillerFlow`) based on current machine sensor readings and target grade.

---

## 🏗️ Architecture & Tech Stack

- **AI Model**: Scikit-Learn `RandomForestRegressor` (`grade_change_ai.pkl`)
- **AI Microservice**: Python FastAPI (Port `8000`)
- **Backend Gateway**: Java 17 Spring Boot (Port `8080`)
- **Frontend Dashboard**: React + Vite + Lucide Icons (Port `5173`)

```
React Frontend (5173) ──► Spring Boot Backend (8080) ──► FastAPI Microservice (8000) ──► grade_change_ai.pkl
```

---

## 🐳 Option 1: Deploy with Docker Compose (Recommended)

You can launch the entire 3-tier system in production mode using a single command:

```bash
docker compose up --build
```

This will automatically build and start:
1. `paper-ai-fastapi` on port `8000`
2. `paper-backend-springboot` on port `8080`
3. `paper-frontend-react` on port `80` (and `5173`)

Access the app at **`http://localhost`** or **`http://localhost:5173`**.

---

## 💻 Option 2: Run Locally (Development Mode)

Open **3 separate terminal windows**:

### Terminal 1: Python FastAPI AI Microservice
```bash
python -m uvicorn fastapi_app:app --host 127.0.0.1 --port 8000
```

### Terminal 2: Spring Boot Backend Gateway
```bash
cd backend
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

### Terminal 3: React Frontend Dashboard
```bash
cd frontend
npm run dev
```

Open browser at **`http://localhost:5173`**.
