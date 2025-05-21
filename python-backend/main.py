from GeminiHandler import GeminiHandler
from fastapi import FastAPI, HTTPException, UploadFile, File
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

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/process-pdf-and-analyze/")
async def process_pdf_and_analyze(file: UploadFile = File(...)):
    text = await PDFHandler.extract_text_from_pdf(file)
    gemini = GeminiHandler()
    ai_response = await gemini.analyze_text(text)
    return {"SDB": ai_response}

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

@app.post("/test/uploadfile/")
async def create_upload_file(file: UploadFile):
    contents = await file.read()  # Läser in filens innehåll som bytes
    text = contents.decode("utf-8", errors="ignore")  # Dekodar till sträng
    return {
        "filename": file.filename,
        "content": text
    }

@app.get("/")
def root():
    return {"Hello": "World"}