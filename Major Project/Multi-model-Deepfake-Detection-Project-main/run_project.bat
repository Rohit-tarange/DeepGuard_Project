@echo off
title DeepGuard AI Launcher
echo ===================================================
echo   Starting DeepGuard Backend & Frontend Servers
echo ===================================================

echo Starting Backend Server (FastAPI on port 8000)...
start "DeepGuard Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\venv311\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Starting Frontend Server (Vite on port 5173)...
start "DeepGuard Frontend (React/Vite)" cmd /k "cd /d %~dp0 && npm run dev"

echo ===================================================
echo Done! Both servers are starting in separate windows.
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:8000
echo ===================================================
