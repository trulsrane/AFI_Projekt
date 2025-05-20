from GeminiHandler import GeminiHandler
import FastAPI, HTTPException, File, UploadFile
import shutil
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests
from typing import Annotated
import pymupdf as fitz
import tempfile
from pypdfium2 import PdfDocument  # Behövs för PyMuPDF4LLM ibland
import pymupdf4llm
from PDFHandler import PDFHandler

load_dotenv()

URL = "http"

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/process-pdf-and-analyze/")
async def process_pdf_and_analyze(file: UploadFile = File(...)):
    text = await PDFHandler.extract_text_from_pdf(file)
    gemini = GeminiHandler()
    ai_response = await gemini.analyze_text(text)
    return {"recipes": ai_response}

@app.post("/test/process-pdf/")
async def process_pdf(file: UploadFile = File(...)):
    text = await PDFhandler.extract_text_from_pdf(file)

    # Här kan du t.ex. anropa Gemini direkt också om du vill:
    # result = GeminiHandler.analyze_text(text)

    return {"status": "PDF processed, text printed to console."}

@app.post("/test/extract-pdf4llm/")
async def extract_pdf4llm(file: UploadFile = File(...)):
    # Spara till en temporär fil
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Extrahera text från hela PDF:en
    text = pymupdf4llm.to_markdown(tmp_path)

    return {
        "filename": file.filename,
        "extracted_text": text
    }

@app.post("/test/extract-pdf/")
async def extract_pdf(file: UploadFile = File(...)):
    # Spara till en temporär fil
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Läs in PDF och extrahera text
    doc = fitz.open(tmp_path)
    extracted_text = ""
    for page in doc:
        extracted_text += page.get_text()

    doc.close()

    return {
        "filename": file.filename,
        "extracted_text": extracted_text
    }

@app.post("/test/files/")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}


@app.post("/test/uploadfile/")
async def create_upload_file(file: UploadFile):
    contents = await file.read()  # Läser in filens innehåll som bytes
    text = contents.decode("utf-8", errors="ignore")  # Dekodar till sträng
    return {
        "filename": file.filename,
        "content": text
    }

@app.post("/test/analyze")
def analyze_text(input: TextInput):
    headers = {
        "Content-Type": "application/json"
        }

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": input.text
                    }
                ]
            }
        ]
    }

    response = requests.post(URL, headers=headers, json=payload)

    if response.status_code != 200:
        return {"error": response.text}

    data = response.json()

    # Plocka ut text-svaret
    try:
        result = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        result = "No response from the model."

    return {"response": result}

@app.get("/")
def root():
    return {"Hello": "World"}