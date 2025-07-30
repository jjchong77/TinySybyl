from fastapi import FastAPI
from pydantic import BaseModel
from llama_cpp import Llama
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify "http://localhost:19006" for stricter security)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Load model path ===
#MODEL_PATH = "/home/jjchong77/Desktop/Llama-3.2-3B-Instruct-Q4_K_L.gguf"  # check path
model_name="Llama-3.2-3B-Instruct-Q3_K_XL.gguf"
current_dir = Path(__file__).parent
MODEL_PATH = str(current_dir / "models" / model_name)
# Adjust parameters based on resources available (ex: RAM/VRAM:)
llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=2048,
    n_threads=os.cpu_count() or 4,
    n_gpu_layers=35  # 0 if CPU-only. Used 35 for testing purposes with a gpu.
)

class Prompt(BaseModel):
    input: str

# === POST endpoint ===
@app.post("/generate")
async def generate_text(prompt: Prompt):
    response = llm(prompt.input, max_tokens=1000)
    return {"response": response["choices"][0]["text"]}

