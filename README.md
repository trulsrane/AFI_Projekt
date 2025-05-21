# AFI_Projekt

# 📄 Kompilering av säkerhetsdatablad i PDF-format

Ett FastAPI-baserat API som analyserar säkerhetsdatablad i PDF-format och hämtar ut strukturerad information med hjälp av **Google Gemini API**.

## 🛠️ Funktioner

✅ Extraherar produktdata från PDF:er  
✅ Integrerar med Google Gemini 2.0 Flash API  
✅ Strukturerar data enligt Pydantic-modell  
✅ Returnerar data i JSON-format
✅ Stöd för filuppladdning via API  

## 📥 Installation

### 1️⃣ Klona projektet
```
git clone git clone https://github.com/trulsrane/AFI_Projekt.git
cd ditt-repo-namn
```
2️⃣ Skapa och aktivera virtuellt miljö
Windows (PowerShell):
````
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
````
OBS! Att ändra execution policy behövs inte alltid.
Mac/Linux:
````
python3 -m venv venv
source venv/bin/activate
````
3️⃣ Installera beroenden
````
pip install -r requirements.txt
````
4️⃣ Lägg till din API-nyckel
Skapa en .env-fil i projektmappen:
````
GEMINI_API_KEY=din-api-nyckel-här
````
🚀 Starta projektet
````
uvicorn main:app --reload
````
Gå in på följande för att testa endpoints:

📑 Swagger UI: http://127.0.0.1:8000/docs

📖 ReDoc: http://127.0.0.1:8000/redoc


MIT License © 2025 Truls Rane
