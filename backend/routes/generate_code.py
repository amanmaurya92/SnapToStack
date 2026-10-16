import json
import traceback
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from typing import Optional

from llm import stream_gemma_code, clean_markdown_code

router = APIRouter()


class GenerateRequest(BaseModel):
    image: str
    stack: Optional[str] = "react-tailwind"
    apiKey: Optional[str] = None
    model: Optional[str] = "gemma-4"


class GenerateResponse(BaseModel):
    code: str
    stack: str
    model: str


@router.post("/api/generate", response_model=GenerateResponse)
async def generate_code_endpoint(request: GenerateRequest):
    """
    HTTP REST endpoint: Supports CLI tools and external Agent Skills.
    """
    try:
        full_code = ""
        async for chunk in stream_gemma_code(
            image_data_uri=request.image,
            stack=request.stack or "react-tailwind",
            api_key=request.apiKey,
            model_name=request.model or "gemma-4",
        ):
            full_code += chunk

        cleaned = clean_markdown_code(full_code)
        return GenerateResponse(
            code=cleaned,
            stack=request.stack or "react-tailwind",
            model=request.model or "gemma-4"
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/ws/generate")
async def websocket_generate_code(websocket: WebSocket):
    """
    WebSocket endpoint: Streams code tokens live to the SnapToStack React frontend.
    """
    await websocket.accept()
    print("[SnapToStack] WebSocket client connected.")

    try:
        data = await websocket.receive_json()
        image = data.get("image", "")
        stack = data.get("stack", "react-tailwind")
        api_key = data.get("apiKey", None)
        model = data.get("model", "gemma-4")

        if not image:
            await websocket.send_json({"type": "error", "value": "No image provided."})
            await websocket.close()
            return

        # Status 1: Initializing
        await websocket.send_json({
            "type": "status",
            "value": "Ingesting visual layout with Google Gemma 4..."
        })

        accumulated_code = ""
        # Stream chunks
        async for chunk in stream_gemma_code(
            image_data_uri=image,
            stack=stack,
            api_key=api_key,
            model_name=model
        ):
            accumulated_code += chunk
            await websocket.send_json({
                "type": "chunk",
                "value": chunk
            })

        # Send final cleaned code and status
        cleaned_code = clean_markdown_code(accumulated_code)
        await websocket.send_json({
            "type": "setCode",
            "value": cleaned_code
        })
        await websocket.send_json({
            "type": "status",
            "value": "Compilation Complete! Ready to preview."
        })

    except WebSocketDisconnect:
        print("[SnapToStack] WebSocket client disconnected.")
    except Exception as e:
        print(f"[SnapToStack] Error in WebSocket generation: {e}")
        try:
            await websocket.send_json({"type": "error", "value": str(e)})
        except Exception:
            pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
