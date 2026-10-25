# How to Run the Project (Frontend & Backend)

This guide provides step-by-step instructions on how to start both the backend and frontend servers for this project. You will need to open **two separate terminal windows** to run them simultaneously.

## 1. Starting the Backend

The backend is built with FastAPI and runs on Python.

### Steps:
1. Open your first terminal (Command Prompt or PowerShell).
2. Navigate to the project root directory (if you aren't there already):
   ```bash
   cd c:\Users\ashwi\OneDrive\Desktop\Major_Project
   ```
3. Activate the Python virtual environment:
   ```bash
   # On Windows Command Prompt:
   .venv\Scripts\activate.bat
   
   # On Windows PowerShell:
   .\.venv\Scripts\Activate.ps1
   ```
   *(Ensure you use `.venv` because it has the correct Python version required for TensorFlow)*
4. Navigate into the backend directory:
   ```bash
   cd backend
   ```
5. Configure MongoDB before starting the API. Copy `backend\.env.example` to
   `backend\.env` and set `MONGODB_URI` to the same MongoDB/Atlas connection
   string used by Compass. Keep `MONGODB_DB=Deepfake_Detection_Project` to use
   the database shown in the project screenshot.
6. Install backend dependencies (if you haven't already):
   ```bash
   pip install -r requirements.txt
   ```
7. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   The backend should now be running at `http://127.0.0.1:8000`. Leave this terminal open.

---

## 2. Starting the Frontend

The frontend is a React application powered by Vite.

### Steps:
1. Open a **second, new terminal** window.
2. Navigate to the project root directory:
   ```bash
   cd c:\Users\ashwi\OneDrive\Desktop\Major_Project
   ```
3. Install the Node modules/dependencies (only needed the first time, or if packages changed):
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend should now be running, typically at `http://localhost:5173`. The terminal will display the exact local URL. Leave this terminal open.

---

## Running Both Simultaneously via a Script (Optional)

If you prefer to start both with a single double-click on Windows, you can create a file named `run_project.bat` in the project root folder with the following contents:

```bat
@echo off
echo Starting Backend...
start cmd /k "cd /d %~dp0 && .venv\Scripts\activate && cd backend && uvicorn main:app --reload"

echo Starting Frontend...
start cmd /k "cd /d %~dp0 && npm run dev"
```
Double-clicking `run_project.bat` will then automatically open two new command prompt windows and start both the frontend and backend servers.


1) Run Backend:
PS C:\Users\ashwi\Downloads\Major Project> Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main\backend"; .\venv311\Scripts\python.exe -m uvicorn main:app --reload

2) Run Frontend:
PS C:\Users\ashwi\Downloads\Major Project> Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main"; npm run dev

backend :
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main\backend"; $env:MONGODB_URI="mongodb://127.0.0.1:27017"; $env:MONGODB_DB="Deepfake_Detection_Project"; .\venv311\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000

frontend :
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main"; npm run dev -- --host 127.0.0.1 --port 5173


# Terminal 1 — Main Backend
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main\backend"
$env:MONGODB_URI="mongodb://127.0.0.1:27017"
$env:MONGODB_DB="Deepfake_Detection_Project"
.\venv311\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000

# Terminal 2 — Audio Backend
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main\backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001

# Terminal 3 — Frontend
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main"
npm run dev -- --host 127.0.0.1 --port 5173