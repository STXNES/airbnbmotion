import os
import json
import random
import time
import requests
from pathlib import Path

# Cargar configuración desde 05-CONFIG
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CONFIG_FILE = PROJECT_ROOT / "05-CONFIG" / "email_credentials.json"

GROK_API_KEY = None
GEMINI_API_KEY = None

try:
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        config = json.loads(f.read(), strict=False)
        GROK_API_KEY = config.get("GROK_API_KEY") or config.get("GROQ_API_KEY")
        GEMINI_API_KEY = config.get("GEMINI_API_KEY")
except FileNotFoundError:
    pass

# Intentamos configurar Gemini como respaldo secundario si existe la librería
genai_model = None
if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        genai_model = genai.GenerativeModel("gemini-2.0-flash")
    except Exception:
        pass


def generate_icebreaker(company, city, is_latam=False):
    """
    Genera una línea inicial de correo (Icebreaker) usando Grok (Groq Llama-3.3 70B)
    o Gemini como respaldo secundario.
    """
    default_en = f"I noticed you are managing some beautiful real estate properties in {city}."
    default_es = f"Noté que tienen un excelente portafolio de bienes raíces en {city}."
    fallback = default_es if is_latam else default_en

    if is_latam:
        prompt = f"""
        Actúas como Axell, fundador de una agencia que crea videos con inteligencia artificial para bienes raíces.
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

    # 1. INTENTO CON GROK / GROQ (Súper rápido y sin rate-limits)
    if GROK_API_KEY:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {GROK_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 100,
                "temperature": 0.7
            }
            r = requests.post(url, headers=headers, json=payload, timeout=8)
            if r.status_code == 200:
                text = r.json()['choices'][0]['message']['content'].strip().replace('"', '').replace("'", "")
                if text:
                    print(f"  [GROK LLM] Icebreaker generado con éxito para {company}.")
                    return text
            else:
                print(f"[GROK LLM WARNING] HTTP {r.status_code}: {r.text}")
        except Exception as e:
            print(f"[GROK LLM ERROR] {e}")

    # 2. INTENTO CON GEMINI (Respaldo secundario)
    if genai_model:
        try:
            response = genai_model.generate_content(prompt)
            text = response.text.strip().replace('"', '').replace("'", "")
            if text:
                print(f"  [GEMINI LLM] Icebreaker generado con éxito para {company}.")
                return text
        except Exception as e:
            print(f"[GEMINI LLM WARNING] {e}")

    # 3. FALLBACK POR DEFECTO
    print("[LLM INFO] Usando frase por defecto en Python.")
    return fallback


if __name__ == "__main__":
    # Test
    print("Testing Grok LLM Engine...")
    res_es = generate_icebreaker("Inmobiliaria Zucaes", "Escazú", True)
    print("ES Result:", res_es)
    res_en = generate_icebreaker("Altus Luxury Homes", "Miami", False)
    print("EN Result:", res_en)
