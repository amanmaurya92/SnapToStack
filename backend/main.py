import os
import sys
import argparse
import asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS, HOST, PORT
from routes.home import router as home_router
from routes.generate_code import router as generate_router
from llm import stream_gemma_code, clean_markdown_code

app = FastAPI(
    title="SnapToStack API",
    description="Snap a mockup. Ship the full stack. Powered by Google DeepMind Gemma 4.",
    version="1.0.0"
)

# CORS setup for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home_router)
app.include_router(generate_router)


def run_cli(image_path: str, output_path: str = "output.tsx", stack: str = "react-tailwind"):
    """CLI runner implementing the Agent Skill Open Standard workflow."""
    import base64
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at {image_path}")
        sys.exit(1)

    print(f"📸 Ingesting {image_path} with Gemma 4...")
    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
        data_uri = f"data:image/png;base64,{encoded}"

    async def execute():
        accumulated = ""
        async for chunk in stream_gemma_code(data_uri, stack=stack):
            accumulated += chunk
            sys.stdout.write(chunk)
            sys.stdout.flush()

        cleaned = clean_markdown_code(accumulated)
        with open(output_path, "w", encoding="utf-8") as out:
            out.write(cleaned)
        print(f"\n\n✨ Successfully generated component -> {output_path}")

    asyncio.run(execute())


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SnapToStack: Visual Mockup to Code Compiler")
    parser.add_argument("--image", type=str, help="Path to image file for CLI mode")
    parser.add_argument("--output", type=str, default="output.tsx", help="Output file path for generated code")
    parser.add_argument("--stack", type=str, default="react-tailwind", help="Target stack (e.g. react-tailwind)")
    parser.add_argument("--port", type=int, default=PORT, help="Port to run backend on")
    args = parser.parse_args()

    if args.image:
        run_cli(args.image, args.output, args.stack)
    else:
        print(f"🚀 Starting SnapToStack Backend on http://{HOST}:{args.port}")
        uvicorn.run("main:app", host=HOST, port=args.port, reload=True)
