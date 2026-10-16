from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def home_endpoint():
    return {
        "name": "SnapToStack Backend Engine",
        "tagline": "Snap a mockup. Ship the full stack.",
        "model": "Google DeepMind Gemma 4",
        "status": "online",
        "endpoints": {
            "websocket": "/ws/generate",
            "rest": "/api/generate"
        }
    }

@router.get("/health")
async def health_endpoint():
    return {"status": "ok"}
