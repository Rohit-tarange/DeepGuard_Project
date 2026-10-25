# DeepFocus Runnable Version (No Original Checkpoints Required)

The original DeepFocus repository expects large private `.pth`/`.pkl` checkpoint files that are not included in Git. This modified version removes that dependency and uses the accessible Hugging Face model `Hemg/Deepfake-Detection`.

## What changed

- Removed the startup dependency on the missing `final/` directory.
- Added `backend/hf_video_detector.py`.
- Video analysis samples frames across the whole video and aggregates frame-level fake probabilities.
- Added `/health` so you can see whether the model loaded.
- The model is downloaded automatically from Hugging Face on first startup.
- Frontend terminology was changed so it no longer claims that the missing 4-CNN + BiLSTM checkpoints are being used.

## Setup on Windows

Use Python 3.10 or 3.11.

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Start backend:

```powershell
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Check:

- http://localhost:8000/health
- http://localhost:8000/docs

Start frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Optional model selection

You can change the Hugging Face model without changing Python code:

```powershell
$env:HF_DEEPFAKE_MODEL="Hemg/Deepfake-Detection"
```

The first run requires internet access to download the model. After it is cached locally, inference can run from the local cache.

## Important limitation

This is a **runnable research/demo detector**, not a forensic guarantee. The selected pretrained model is an image deepfake classifier and is not trained to prove that arbitrary accident, sports, news, natural-scene, or out-of-context videos are authentic. The video endpoint samples frames and aggregates visual deepfake signals. A high confidence score is not the same thing as a guaranteed high real-world accuracy.
