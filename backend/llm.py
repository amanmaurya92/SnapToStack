import io
import re
import asyncio
import base64
from typing import AsyncGenerator, Optional
from PIL import Image

from config import GEMINI_API_KEY, DEFAULT_MODEL
from prompts.gemma_prompts import SYSTEM_PROMPT, get_screenshot_prompt
from sample_data import SAMPLE_DASHBOARD_CODE, SAMPLE_LANDING_CODE

# Try to import google genai
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


def decode_base64_image(image_data_uri: str) -> Image.Image:
    """Decodes data:image/png;base64,... into a PIL Image."""
    if "," in image_data_uri:
        image_data = image_data_uri.split(",", 1)[1]
    else:
        image_data = image_data_uri
    image_bytes = base64.b64decode(image_data)
    return Image.open(io.BytesIO(image_bytes))


def clean_markdown_code(raw_text: str) -> str:
    """Extracts raw code from markdown code fences if present."""
    match = re.search(r"```(?:tsx|jsx|html|javascript|typescript)?\n(.*?)```", raw_text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return raw_text.strip()


async def stream_gemma_code(
    image_data_uri: str,
    stack: str = "react-tailwind",
    api_key: Optional[str] = None,
    model_name: Optional[str] = None,
) -> AsyncGenerator[str, None]:
    """
    Streams generated code from Gemma 4 via the Gemini API.
    Gracefully falls back to offline simulation if no API key is provided or offline.
    """
    effective_key = api_key or GEMINI_API_KEY
    effective_model = model_name or DEFAULT_MODEL

    # If we have an API key and the Google GenAI SDK is available, call live Gemma 4
    if effective_key and GENAI_AVAILABLE:
        try:
            client = genai.Client(api_key=effective_key)
            pil_image = decode_base64_image(image_data_uri)
            prompt = get_screenshot_prompt(stack=stack)

            # Gemma 4 multimodal call via Gemini API
            # Models: 'gemma-4', 'gemini-2.5-flash', or user requested
            response_stream = client.models.generate_content_stream(
                model=effective_model,
                contents=[
                    types.Content(
                        role="user",
                        parts=[
                            types.Part.from_text(text=SYSTEM_PROMPT + "\n\n" + prompt),
                            types.Part.from_bytes(data=pil_image.tobytes(), mime_type="image/png"),
                        ]
                    )
                ]
            )

            buffer = ""
            for chunk in response_stream:
                if chunk.text:
                    buffer += chunk.text
                    yield chunk.text
                    await asyncio.sleep(0.01)
            return
        except Exception as e:
            print(f"Warning: Gemma API call encountered an error: {e}. Falling back to simulation.")
            yield f"\n// [SnapToStack Notification]: Live Gemma 4 API returned: {e}\n// Serving high-fidelity compiler fallback:\n\n"

    # Offline / Demo fallback stream (Simulates streaming realistic code with micro-delays)
    fallback_code = SAMPLE_DASHBOARD_CODE if "dashboard" in image_data_uri.lower() else SAMPLE_LANDING_CODE
    chunks = re.split(r"(\s+)", fallback_code)
    for c in chunks:
        yield c
        await asyncio.sleep(0.008)
