# AFI_Projekt

## 📦 Installation

git clone https://github.com/trulsrane/AFI_Projekt.git
cd AFI_projekt
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
## 📥 Installation

### 1️⃣ Klona projektet
```
git clone https://github.com/ditt-användarnamn/ditt-repo-namn.git
cd ditt-repo-namn
```
2️⃣ Skapa och aktivera virtuellt miljö
Windows (PowerShell):
````
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
````
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
📑 Swagger UI: http://127.0.0.1:8000/docs
📖 ReDoc: http://127.0.0.1:8000/redoc


MIT License © 2025 Truls Rane
