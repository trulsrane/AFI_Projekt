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
from pypdfium2 import PdfDocument  # Beh�vs f�r PyMuPDF4LLM ibland
import pymupdf4llm
from PDFHandler import PDFHandler

# Nya paket
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
import io

load_dotenv()

# lagt till f�r att k�ra CORS ladda in med: pip install middleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Till�t �terkomst till backend fr�n frontend med CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # �ndra till 3000, jag k�r p� 3001
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
    # Spara till en tempor�r fil
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Extrahera text fr�n hela PDF:en
    text = pymupdf4llm.to_markdown(tmp_path)

    return {
        "filename": file.filename,
        "extracted_text": text
    }

@app.post("/test/uploadfile/")
async def create_upload_file(file: UploadFile):
    contents = await file.read()  # L�ser in filens inneh�ll som bytes
    text = contents.decode("utf-8", errors="ignore")  # Dekodar till str�ng
    return {
        "filename": file.filename,
        "content": text
    }

@app.get("/")
def root():
    return {"Hello": "World"}


# Test f�r att skapa pdf av json ladda in: pip install reportlab
@app.post("/generate-pdf/")
async def generate_pdf(request: Request):
    
    # H�mtar JSON-data fr�n frontend
    data = await request.json()

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    margin = 50
    line_spacing = 14
    y = height - margin

    # Skapar en footer med watermark
    def draw_footer():
        footer_text = "Created by MIT Solutions, (C) 2025"
        c.setFont("Helvetica-Oblique", 8)
        c.setFillColorRGB(0.6, 0.6, 0.6)
        text_width = c.stringWidth(footer_text, "Helvetica-Oblique", 8)
        c.drawString((width - text_width) / 2, 20, footer_text)
        c.setFillColorRGB(0, 0, 0)

    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y, "Compiled data")
    y -= line_spacing * 2

    c.setFont("Helvetica", 10)

    # L�ser in nyckelv�rden 
    for key, value in data.items():
        if y < margin:
            draw_footer()
            c.showPage()
            y = height - margin
            c.setFont("Helvetica", 10)

        c.setFont("Helvetica-Bold", 10)
        c.drawString(margin, y, f"{key}:")
        y -= line_spacing
        c.setFont("Helvetica", 10)

        # �r nyckelv�rden en lista, skapa den
        if isinstance(value, list):
            for item in value:
                wrapped_lines = simpleSplit(str(item), "Helvetica", 10, width - 2 * margin)
                for line in wrapped_lines:
                    if y < margin:
                        draw_footer()
                        c.showPage()
                        y = height - margin
                        c.setFont("Helvetica", 10)
                    c.drawString(margin + 10, y, f"- {line}")
                    y -= line_spacing
        # F�r subv�rden
        elif isinstance(value, dict):
            for subkey, subvalue in value.items():
                subtext = f"{subkey}: {subvalue}"
                wrapped_lines = simpleSplit(subtext, "Helvetica", 10, width - 2 * margin)
                for line in wrapped_lines:
                    if y < margin:
                        draw_footer()
                        c.showPage()
                        y = height - margin
                        c.setFont("Helvetica", 10)
                    c.drawString(margin + 10, y, line)
                    y -= line_spacing
        # F�r resten
        else:
            wrapped_lines = simpleSplit(str(value), "Helvetica", 10, width - 2 * margin)
            for line in wrapped_lines:
                if y < margin:
                    draw_footer()
                    c.showPage()
                    y = height - margin
                    c.setFont("Helvetica", 10)
                c.drawString(margin + 10, y, line)
                y -= line_spacing

        y -= line_spacing

    draw_footer()
    c.save()
    buffer.seek(0)

    # Skicka PDF som en stream tillbaka till frontend
    return StreamingResponse(buffer, media_type="application/pdf")
