# from google import genai
# from pydantic import BaseModel

# class Recipe(BaseModel):
#     recipe_name: str
#     ingredients: list[str]

# client = genai.Client(api_key="GOOGLE_API_KEY")
# response = client.models.generate_content(
#     model="gemini-2.0-flash",
#     contents="List a few popular cookie recipes, and include the amounts of ingredients.",
#     config={
#         "response_mime_type": "application/json",
#         "response_schema": list[Recipe],
#     },
# )
# # Use the response as a JSON string.
# print(response.text)

# # Use instantiated objects.
# my_recipes: list[Recipe] = response.parsed

from google import genai
from pydantic import BaseModel, Field
from typing import Optional
import os

class SafetyDataSheet(BaseModel):
    product_name: str = Field(..., description="Produktens namn")
    supplier: str = Field(..., description="Leverantörens namn")
    article_number: str = Field(..., description="Artikelnummer")
    usage_area: str = Field(..., description="Användningsområde")
    note: Optional[str] = Field(None, description="Anmärkning")
    sdb_version: str = Field(..., description="Versionsnummer för säkerhetsdatabladet")
    sdb_date: str = Field(..., description="Datum för säkerhetsdatabladet")
    classification: str = Field(..., description="Klassificering och H-fraser")

model_name = "gemini-2.0-flash-001"
system_instruction = "Du är en expert på kemi och ska hitta följande uppgifter från säkerhetsdatabladet: Produktnamn, Leverantör, Artikelnummer ,Användningsområde, Anmärkning, SDB Versionsnummer, SDB Datum, Klassificering / H-fraser med förklaring (finns i avsnitt 16 och presenteras normalt sätt såhär: Hxxx {förklaring} vid fler H-fraser separera endast med kommatecken ','"

# # Create a cached content object
# cache = client.caches.create(
#     model=model_name,
#     config=types.CreateCachedContentConfig(
#         system_instruction=system_instruction,
#         contents=[text],
#         generation_config=types.GenerationConfig(
#             response_mime_type="application/json",
#             response_schema=list[SafetyDataSheet],
#             temperature=0.1,
#         )
#     )
# )

# print(f"{cache=}")

class GeminiHandler:
    def __init__(self):
        api_key = "GEMINI_API_KEY"
        if not api_key:
            raise ValueError("GEMINI_API_KEY saknas i environment-variablerna.")
        self.client = genai.Client(api_key=api_key)

    async def analyze_text(self, text: str):
        try:
            response = self.client.models.generate_content(
                model=model_name,
                contents=system_instruction + text,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": list[SafetyDataSheet],
                    "temperature": 0.1,
                },
            )
            return response.parsed  # <-- den här returnerar Python-objekt redo för FastAPI:s JSON-respons
            print("------Svar från Gemini:------")
            print(response.text)  # <-- den här returnerar JSON-sträng
            print("------Slut Gemini------")

        except Exception as e:
            print(f"Något gick fel i GeminiHandler: {e}")
            return []
