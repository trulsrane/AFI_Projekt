import pymupdf4llm
import tempfile
from fastapi import UploadFile
import os

class PDFHandler:
    @staticmethod
    async def extract_text_from_pdf(file: UploadFile) -> str:
        try:
            # Spara filen till en temporär plats
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(await file.read())
                tmp_path = tmp.name

            # Testa läsa filen som binär säkerhett
            if not os.path.exists(tmp_path):
                raise FileNotFoundError("Tempfile could not be created.")

            # Extrahera text med pymupdf4llm
            text = pymupdf4llm.to_markdown(tmp_path)

            print(text)
            return text

        except Exception as e:
            print("Something went wrong in PDFHandler: {e}")
            return "Error extracting text."

        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)