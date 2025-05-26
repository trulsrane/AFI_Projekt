from GeminiHandler import GeminiHandler
from fastapi import FastAPI, HTTPException, UploadFile, File, Request
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

# Nya paket
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
import io

load_dotenv()

# lagt till för att köra CORS ladda in med: pip install middleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Tillåt återkomst till backend från frontend med CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # ändra till 3000, jag kör på 3001
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# Test för att skapa pdf av json ladda in: pip install reportlab

@app.post("/generate-pdf/")
async def generate_pdf(request: Request):
    data = await request.json()

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    margin = 50
    line_spacing = 14
    y = height - margin

    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y, "Compiled data")
    y -= line_spacing * 2

    c.setFont("Helvetica", 10)

    for key, value in data.items():
        if y < margin:
            c.showPage()
            y = height - margin
            c.setFont("Helvetica", 10)

        # Rubrik/key
        c.setFont("Helvetica-Bold", 10)
        c.drawString(margin, y, f"{key}:")
        y -= line_spacing

        # Värde/text med radbrytningar
        c.setFont("Helvetica", 10)
        wrapped_lines = simpleSplit(str(value), "Helvetica", 10, width - 2 * margin)

        for line in wrapped_lines:
            if y < margin:
                c.showPage()
                y = height - margin
                c.setFont("Helvetica", 10)
            c.drawString(margin + 10, y, line)
            y -= line_spacing

        y -= line_spacing  # Extra mellanrum mellan block

    c.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf")