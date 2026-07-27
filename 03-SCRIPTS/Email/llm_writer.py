import os
import json
import random
import time
from pathlib import Path

# Configuramos Gemini
import google.generativeai as genai
from google.api_core import exceptions

# Cargar configuración desde 05-CONFIG
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CONFIG_FILE = PROJECT_ROOT / "05-CONFIG" / "email_credentials.json"

API_KEY = None
try:
    with open(CONFIG_FILE, "r") as f:
        config = json.load(f)
        API_KEY = config.get("GEMINI_API_KEY")
except FileNotFoundError:
    pass

if API_KEY:
    genai.configure(api_key=API_KEY)
    
    # Modelo a usar
    generation_config = {
      "temperature": 0.7,
      "top_p": 0.95,
      "top_k": 40,
      "max_output_tokens": 150,
      "response_mime_type": "text/plain",
    }
    model = genai.GenerativeModel(
      model_name="gemini-1.5-flash",
      generation_config=generation_config,
    )
else:
    model = None


def generate_icebreaker(company, city, is_latam=False):
    """
    Usa la API de Gemini para generar una línea inicial de correo altamente personalizada.
    Maneja límites de cuota (Rate limits) devolviendo un mensaje genérico.
    """
    
    default_en = f"I noticed you are managing some beautiful real estate properties in {city}."
    default_es = f"Noté que tienen un excelente portafolio de bienes raíces en {city}."
    
    fallback = default_es if is_latam else default_en
    
    if not model:
        print("[LLM WARNING] No GEMINI_API_KEY found in 05-CONFIG/email_credentials.json. Using fallback.")
        return fallback

    if is_latam:
        prompt = f"""
        Actúas como Axell, fundador de una agencia que hace videos con inteligencia artificial para bienes raíces.
        Escribe UNA SOLA oración corta e informal (icebreaker) para un correo frío dirigido a la agencia '{company}' en la ciudad '{city}'.
        La oración debe felicitar su portafolio o mencionar que destacan en {city}. 
        No te presentes a ti mismo, solo di algo agradable sobre ellos. 
        Ejemplo: "He estado viendo sus propiedades recientes en {city} y la verdad me ha impresionado mucho la calidad de su portafolio."
        Solo devuelve la oración, sin comillas ni saludos.
        """
    else:
        prompt = f"""
        Act as Axell, founder of an AI video agency for real estate.
        Write a SINGLE, short, casual opening sentence (icebreaker) for a cold email to the real estate agency '{company}' in '{city}'.
        The sentence should compliment their portfolio or mention they stand out in {city}.
        Do not introduce yourself, just say something nice about them.
        Example: "I've been looking at your recent listings in {city} and I'm really impressed by the quality of your portfolio."
        Return ONLY the sentence, no quotes, no greetings.
        """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip().replace('"', '').replace("'", "")
        if not text:
            return fallback
        return text
        
    except exceptions.ResourceExhausted:
        print("[LLM WARNING] Rate limit exceeded (Free Tier). Using fallback icebreaker.")
        return fallback
    except Exception as e:
        print(f"[LLM ERROR] {e}. Using fallback icebreaker.")
        return fallback

if __name__ == "__main__":
    # Test
    print("Testing LLM...")
    res = generate_icebreaker("Altus Luxury Homes", "Miami", False)
    print("EN:", res)
    res_es = generate_icebreaker("Inmobiliaria Del Sol", "Madrid", True)
    print("ES:", res_es)
