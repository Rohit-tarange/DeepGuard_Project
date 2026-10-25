# DeepFocus Project - Run Command

Dependencies install hone ke baad project root se sirf ye command run karein:

```powershell
.\run_all.ps1
```

Project root:

```text
C:\Users\ashwi\Downloads\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main
```

Run Bakend: 
cd c:\Users\ashwi\Downloads\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main
.\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

Run Frontend: 
cd c:\Users\ashwi\Downloads\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main\frontend
npm run dev


