# Major Project

An integrated media-verification workspace for detecting manipulated media and
checking potentially misleading claims. The workspace contains several
standalone applications and one integrated dashboard:

- **Multi-model Deepfake Detection** - the main React/Vite dashboard and
  FastAPI backend for video, image, text, authentication, and fact-checking
  workflows.
- **DeepFocus Runnable Hugging Face** - a lightweight video/image detector that
  does not require the original private DeepFocus checkpoints.
- **Tathya Fact-Checking System** - an agentic, multi-source claim
  verification application with a Streamlit UI and FastAPI API.
- **Fake News Audio Detector** - a multimodal audio pipeline combining
  transcription, claim verification, and acoustic deepfake analysis.
- **clerk-react** - a small standalone Vite/React authentication UI prototype.

The projects are kept in one workspace for experimentation and comparison.
They do not share one dependency environment. Install and run each component
from its own directory.

> **Important:** Model predictions and fact-checking results are decision
> support, not proof. Review source evidence and borderline results manually.
> The deepfake models can produce false positives and false negatives,
> especially for content outside their training distribution.

### Poster architecture diagram

The poster-ready vector architecture diagram is available at
[ARCHITECTURE_DIAGRAM.svg](./ARCHITECTURE_DIAGRAM.svg). It shows the main
DeepGuard dashboard, Clerk-managed authentication, the separate audio service,
the Tathya fact-checking service, local/runtime processing state, external
evidence providers, and the unified decision-support output. MongoDB and SQL
database components are intentionally not shown because they are not used in
the deployed project architecture.

## Contents

- [Workspace layout](#workspace-layout)
- [Recommended integrated setup](#recommended-integrated-setup)
- [Application guides](#application-guides)
  - [Multi-model Deepfake Detection](#1-multi-model-deepfake-detection)
  - [DeepFocus Runnable Hugging Face](#2-deepfocus-runnable-hugging-face)
  - [Tathya Fact-Checking System](#3-tathya-fact-checking-system)
  - [Fake News Audio Detector](#4-fake-news-audio-detector)
  - [clerk-react prototype](#5-clerk-react-prototype)
- [API summary](#api-summary)
- [Testing and builds](#testing-and-builds)
- [Configuration and secrets](#configuration-and-secrets)
- [Troubleshooting](#troubleshooting)
- [Limitations and responsible use](#limitations-and-responsible-use)

## Workspace layout

```text
Major Project/
├── README.md
├── clerk-react/                                  # Standalone Vite/React prototype
└── Major Project/
    ├── Multi-model-Deepfake-Detection-Project-main/
    │   ├── backend/                              # Main FastAPI API
    │   ├── src/                                  # Main React/Vite dashboard
    │   ├── public/
    │   ├── RUN_INSTRUCTIONS.md
    │   └── package.json
    ├── DeepFocus_Runnable_HuggingFace/
    │   └── multi-signal-deepfake-detection-main/
    │       ├── backend/                          # FastAPI detector
    │       ├── frontend/                         # Next.js dashboard
    │       ├── requirements.txt
    │       └── run_all.ps1
    ├── Tathya-Fact-Checking-System-main/
    │   ├── fact_check_system/                    # Agent, tools, schemas, API
    │   ├── app.py                                # Streamlit UI
    │   └── requirements.txt
    └── fake-news-audio-detector-main/
        └── fake-news-audio-detector-main/
            ├── backend/                          # FastAPI audio pipeline
            ├── frontend/                         # React/Vite dashboard
            ├── tests/
            └── docker-compose.yml
```

Commands below use Windows PowerShell. In every case, replace the starting
directory with the absolute path to this workspace if your copy is elsewhere.

## Recommended integrated setup

The main dashboard can expose deepfake, text, and fact-checking features. The
audio detector can run beside it as a separate service.

### 1. Main backend

Open a terminal:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main\backend"
.\venv311\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

If the local `venv311` environment is not available, create a virtual
environment and install `requirements.txt`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Authentication is handled by Clerk in the frontend. No MongoDB or SQL
database is required for the project setup described here.

### 2. Main frontend

Open a second terminal:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main"
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open the URL printed by Vite, normally
<http://127.0.0.1:5173>.

### 3. Optional audio backend

Open a third terminal:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

The audio frontend can be started separately:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main\frontend"
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

The audio project’s default Vite port is 5173, so port 5174 avoids a conflict
with the main dashboard.

## Application guides

### 1. Multi-model Deepfake Detection

**Location:** `Major Project\Multi-model-Deepfake-Detection-Project-main`

This is the primary integrated application. Its frontend is React 19 with
Vite. Its backend is FastAPI and includes:

- Clerk-managed user authentication and sessions;
- video/GIF/WebP deepfake prediction;
- text prediction;
- fact-checking routes;
- task/result polling for asynchronous checks;
- optional integration with the Tathya fact-checking package.

#### Backend endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Backend liveness |
| `POST` | `/signup` | Legacy backend route; not used by Clerk authentication |
| `POST` | `/signin` | Legacy backend route; not used by Clerk authentication |
| `POST` | `/predict` | Analyze an uploaded video, GIF, or WebP |
| `POST` | `/predict-text` | Analyze text |
| `POST` | `/fact-check` | Start a fact-checking workflow |
| `POST` | `/check` | Start a claim check |
| `GET` | `/results/{task_id}` | Read a task result |

Interactive OpenAPI documentation is available at
<http://127.0.0.1:8000/docs> when the backend is running.

#### Main dependencies

- Python: FastAPI, Uvicorn, TensorFlow, OpenCV, NumPy, PyMongo, and
  `python-dotenv`
- Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Clerk

#### Optional Tathya integration

The backend looks for the Tathya project at a sibling path by default. If the
workspace is moved or the Tathya directory is elsewhere, set:

```powershell
$env:TATHYA_PROJECT_DIR = "C:\path\to\Tathya-Fact-Checking-System-main"
```

The Tathya service and this backend both default to port 8000. Run only one
service on that port, or assign one of them a different port and update the
frontend/API URL configuration.

### 2. DeepFocus Runnable Hugging Face

**Location:** `Major Project\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main`

This version replaces the original unavailable DeepFocus checkpoint files with
the accessible Hugging Face model `Hemg/Deepfake-Detection`. On first startup,
the model is downloaded and cached locally, so internet access is required for
the first run.

#### Setup

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Start the backend:

```powershell
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

In another terminal, start the Next.js frontend:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main\frontend"
npm install
npm run dev
```

Open <http://localhost:3000>. Health and API documentation are available at
<http://localhost:8000/health> and <http://localhost:8000/docs>.

The included `run_all.ps1` starts both services in separate PowerShell
windows:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main"
.\run_all.ps1
```

To select another compatible Hugging Face model:

```powershell
$env:HF_DEEPFAKE_MODEL = "Hemg/Deepfake-Detection"
```

#### DeepFocus endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Service and model status |
| `GET` | `/health` | Health and model-load status |
| `POST` | `/analyze/video` | Analyze a video or animated image |
| `POST` | `/analyze/image` | Analyze a still image or animated image |

The detector samples frames and aggregates visual deepfake probabilities. It
does not establish the provenance or truth of arbitrary real-world footage.

### 3. Tathya Fact-Checking System

**Location:** `Major Project\Tathya-Fact-Checking-System-main`

Tathya is an agentic fact-checking system. It decomposes claims, selects
research tools, gathers evidence, and returns a verdict, confidence score,
explanation, intermediate steps, and source attribution. Available tools
include search providers, NewsAPI, Wikidata, web scraping, and fallback search
providers depending on configuration.

#### Setup

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Tathya-Fact-Checking-System-main"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and configure the API keys required by your chosen providers.
Never commit `.env` or paste real keys into source code.

Run the API:

```powershell
python -m uvicorn fact_check_system.api.main:app --reload --host 127.0.0.1 --port 8002
```

Run the Streamlit UI in another terminal:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Tathya-Fact-Checking-System-main"
$env:TATHYA_API = "http://127.0.0.1:8002/check"
streamlit run app.py
```

The Streamlit UI normally opens at <http://localhost:8501>. The API exposes
`POST /check` and the UI polls `GET /results/{task_id}` for completion.

#### Environment variables

The provided `.env.example` documents:

- `GROQ_API_KEY`, `GROQ_MODEL`, and `GROQ_PARSER_MODEL`;
- `GEMINI_API_KEY` and `GEMINI_MODEL`;
- `TAVILY_API_KEY` or `TAVILY_API_KEY2`;
- `NEWS_API_KEY`;
- optional Azure OpenAI settings;
- confidence thresholds.

See `ENV_SETUP_GUIDE.md` in the Tathya directory for provider account setup
and detailed troubleshooting.

### 4. Fake News Audio Detector

**Location:** `Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main`

This application analyzes an uploaded audio/video file in two dimensions:

1. **Content credibility:** Faster-Whisper transcription, VAD, claim
   extraction, web/Wikipedia evidence retrieval, NLI stance analysis, and a
   synthesized credibility label.
2. **Audio authenticity:** waveform decoding, spectral and pitch features,
   dynamic-range analysis, and vocoder-artifact indicators.

#### Local setup

Backend:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Frontend:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main\frontend"
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

#### Audio API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` or `/api/health` | Liveness and configuration |
| `POST` | `/api/audio/upload` | Upload an audio/video file |
| `GET` | `/api/audio/{id}/stream` | Stream uploaded media |
| `POST` | `/api/analyze` | Start an analysis job |
| `GET` | `/api/analyze/{job_id}/status` | Poll job progress |
| `GET` | `/api/analyze/{job_id}` | Retrieve the completed report |

Supported upload formats include `.mp3`, `.wav`, `.m4a`, and `.mp4`. The
backend validates file content and stores data under its configured storage
directory.

#### Docker

From the audio project directory:

```powershell
docker compose up --build
```

The compose file maps the backend to port 8000 and the frontend to port 5173.
Use the local setup commands instead when those ports are already occupied by
the main application.

Useful environment settings include `DATABASE_URL`, `WHISPER_MODEL_SIZE`,
`WHISPER_DEVICE`, `WHISPER_COMPUTE_TYPE`, `SEARCH_API_PROVIDER`,
`SEARCH_API_KEY`, `AUDIO_STORAGE_PATH`, and `MAX_UPLOAD_SIZE_MB`.

### 5. clerk-react prototype

**Location:** `clerk-react`

This is a separate Vite/React/TypeScript UI prototype using React and
`@clerk/react`. It has its own `package.json` and should be run independently:

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\clerk-react"
npm install
npm run dev
```

Build and preview:

```powershell
npm run build
npm run preview
```

If Clerk-backed authentication is enabled in the UI, configure the publishable
key using the environment convention expected by the source code. Do not
commit Clerk secrets.

## API summary

The workspace contains multiple APIs with overlapping default ports. Use the
following arrangement to run them together:

| Component | Default service port | Suggested combined-workspace port |
| --- | ---: | ---: |
| Multi-model backend | 8000 | 8000 |
| Multi-model frontend | 5173 | 5173 |
| DeepFocus backend | 8000 | 8003 |
| DeepFocus frontend | 3000 | 3000 |
| Tathya API | 8000 | 8002 |
| Tathya Streamlit UI | 8501 | 8501 |
| Audio backend | 8000 | 8001 |
| Audio frontend | 5173 | 5174 |

When changing a port, update the corresponding frontend/API environment
setting or command-line option. Do not run multiple services on the same port.

## Testing and builds

Run commands from the relevant project directory.

### Main frontend

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Multi-model-Deepfake-Detection-Project-main"
npm run build
```

### DeepFocus frontend

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main\frontend"
npm run lint
npm run build
```

### Tathya

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\Tathya-Fact-Checking-System-main"
pytest -q
```

### Audio detector

```powershell
Set-Location "C:\Users\ashwi\Downloads\Major Project\Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main"
pytest tests/ -v
```

The audio test suite covers upload validation, transcription/VAD, claim
extraction, evidence verification, acoustic feature calculations, and live
pipeline integration. Live integration tests may need network access and model
downloads.

### Main backend smoke check

With the main backend running:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health
```

With DeepFocus running:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health
```

The same port is used by default, so stop one backend before checking the
other, or use the alternate port selected for your setup.

## Configuration and secrets

- Copy `.env.example` to `.env` only inside the application that owns it.
- Do not commit `.env`, API keys, database passwords, model tokens, or
  authentication secrets.
- Configure Clerk publishable/authentication settings in the frontend.
- Tathya requires provider credentials for the configured LLM/search tools.
- DeepFocus downloads its Hugging Face model on first use.
- The audio detector stores uploaded media and temporary analysis state locally
  and supports optional search provider configuration.
- Uploaded files and generated results may contain sensitive personal or
  biometric information. Keep local upload directories out of public hosting.

## Troubleshooting

### Port already in use

Identify the conflicting process and either stop it or pass a different
`--port` value to Uvicorn/Vite. The applications intentionally have
independent defaults and cannot all use port 8000 or 5173 simultaneously.

### Model loading or Hugging Face errors

Ensure the first run has internet access, enough disk space for model caches,
and a supported Python/PyTorch environment. Check `/health` for the recorded
startup error before submitting an analysis.

### Tathya authentication or search errors

Confirm `.env` is named exactly `.env`, keys are assigned without placeholder
text, and the selected provider is available. Provider quotas and network
failures can prevent evidence collection.

### Frontend cannot reach a backend

Start the backend first, confirm its health endpoint, and check that the
frontend points to the same host and port. Browser CORS settings and a backend
running on a different port are common causes.

### Audio model is slow on CPU

Whisper and acoustic processing are computationally intensive. Use a smaller
Whisper model, configure CPU-friendly compute settings, or provide a supported
GPU environment.

## Limitations and responsible use

- A classifier confidence score is not a probability that a media file is
  definitively fake or real.
- Frame sampling can miss brief manipulations, cuts, overlays, or audio/video
  inconsistencies.
- Fact-checking depends on the availability, quality, freshness, and
  independence of retrieved sources.
- Automated verdicts should not be used alone for legal, employment,
  moderation, medical, financial, or public-safety decisions.
- Obtain permission before processing recordings, faces, voices, or other
  personal data, and apply appropriate retention and access controls.

## Project-specific documentation

The original guides remain useful for implementation details:

- `Major Project\Multi-model-Deepfake-Detection-Project-main\RUN_INSTRUCTIONS.md`
- `Major Project\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main\README_RUNNABLE.md`
- `Major Project\DeepFocus_Runnable_HuggingFace\multi-signal-deepfake-detection-main\RUN_PROJECT.md`
- `Major Project\Tathya-Fact-Checking-System-main\ENV_SETUP_GUIDE.md`
- `Major Project\fake-news-audio-detector-main\fake-news-audio-detector-main\README.md`
