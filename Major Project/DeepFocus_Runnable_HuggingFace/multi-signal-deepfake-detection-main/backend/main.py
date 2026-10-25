import shutil
import uuid
import logging
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

try:
    from .hf_video_detector import HFVideoDetector
except ImportError:
    from hf_video_detector import HFVideoDetector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DeepFocus - Runnable Deepfake Detection API",
    version="2.0.0",
    description="Lightweight frame-based deepfake detection using an accessible Hugging Face pretrained model.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# The first startup downloads the model from Hugging Face automatically.
video_detector = None
startup_error = None

try:
    video_detector = HFVideoDetector()
except Exception as exc:
    startup_error = str(exc)
    logger.exception("Could not load Hugging Face detector")


@app.get("/")
def root():
    return {
        "message": "DeepFocus API is running",
        "mode": "huggingface-lightweight",
        "model_loaded": video_detector is not None,
        "startup_error": startup_error,
    }


@app.get("/health")
def health():
    return {
        "status": "ok" if video_detector is not None else "degraded",
        "model_loaded": video_detector is not None,
        "model": getattr(video_detector, "model_id", None),
        "device": str(getattr(video_detector, "device", "unknown")),
        "startup_error": startup_error,
    }


@app.post("/analyze/video")
async def analyze_video_endpoint(file: UploadFile = File(...)):
    is_video_type = file.content_type and (
        file.content_type.startswith("video/") or 
        file.content_type in ["image/gif", "image/webp"] or
        (file.filename and file.filename.lower().endswith((".gif", ".webp", ".mp4", ".avi", ".mov", ".mkv")))
    )
    if not is_video_type:
        raise HTTPException(status_code=400, detail="Uploaded file must be a video or animated GIF/WebP.")
    if video_detector is None:
        raise HTTPException(
            status_code=503,
            detail=("Deepfake model could not be loaded. Check internet access and Hugging Face model download. "
                    f"Startup error: {startup_error}"),
        )

    file_id = str(uuid.uuid4())
    ext = Path(file.filename or "video.mp4").suffix or ".mp4"
    temp_path = UPLOAD_DIR / f"{file_id}{ext}"
    try:
        with temp_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = video_detector.analyze_video(str(temp_path))
        return result
    except Exception as exc:
        logger.exception("Video analysis failed")
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        try:
            temp_path.unlink(missing_ok=True)
        except Exception:
            pass


@app.post("/analyze/image")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    if not file.content_type or not (file.content_type.startswith("image/") or file.content_type.startswith("video/")):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image or GIF.")
    if video_detector is None:
        raise HTTPException(status_code=503, detail=f"Model not loaded: {startup_error}")

    file_id = str(uuid.uuid4())
    ext = Path(file.filename or "image.jpg").suffix or ".jpg"
    temp_path = UPLOAD_DIR / f"{file_id}{ext}"
    try:
        with temp_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Check if file is an animated GIF/WebP or multi-frame image
        frames = video_detector.sample_image_or_gif(str(temp_path))
        if len(frames) > 1:
            # Run multi-frame analysis for animated GIFs
            return video_detector.analyze_video(str(temp_path))

        # Single static image fallback
        from PIL import Image
        import numpy as np
        import cv2
        image = np.array(Image.open(temp_path).convert("RGB"))
        frame = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        score = video_detector.predict_frames([frame])[0]
        
        # Threshold 0.50 for static images and AI art
        label = "Fake" if score >= 0.50 else "Real"
        confidence = score if label == "Fake" else 1.0 - score
        return {
            "label": label,
            "confidence": float(confidence),
            "final_score": float(score),
            "forensic_report": {
                "ai_consensus": {"ensemble_score": float(score), "models": {"huggingface_deepfake_model": float(score)}},
                "forensic_artifacts": {"overall_mismatch": 0.0, "dct_anomaly": 0.0},
                "metadata": {"decision_source": "Hugging Face pretrained model", "model_id": video_detector.model_id},
                "interpretation": {"label": label, "confidence": float(confidence), "needs_manual_review": confidence < 0.80},
            },
            "model": video_detector.model_id,
        }
    except Exception as exc:
        logger.exception("Image analysis failed")
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        try:
            temp_path.unlink(missing_ok=True)
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
