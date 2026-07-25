import os
import re
import csv
import urllib.request
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path
import time
import ssl
import random

# Desactivar verificación SSL para evitar errores de certificados vencidos en sitios web pequeños de prospectos
ssl_context = ssl._create_unverified_context()

ROOT = Path(__file__).resolve().parents[2]
INBOX_FOLDER = ROOT / "01-INBOX"
OUTPUT_FILE = INBOX_FOLDER / "airbnb_prospects.csv"

# Asegurar que existe la carpeta 01-INBOX
INBOX_FOLDER.mkdir(parents=True, exist_ok=True)

# Listas de ciudades premium y palabras clave para prospectar
TARGETS = [
    # Costa Rica
    {"city": "Tamarindo", "state": "Guanacaste", "keywords": ['"vacation rentals" tamarindo contact email', '"property management" tamarindo airbnb']},
    {"city": "Manuel Antonio", "state": "Puntarenas", "keywords": ['"luxury rentals" "manuel antonio" contact', '"vacation rental management" "manuel antonio"']},
    {"city": "Nosara", "state": "Guanacaste", "keywords": ['"villas" nosara contact email', '"property management" nosara airbnb']},
    {"city": "Santa Teresa", "state": "Puntarenas", "keywords": ['"vacation rentals" "santa teresa" contact', '"beach house rentals" "santa teresa" email']},
    {"city": "Papagayo", "state": "Guanacaste", "keywords": ['"luxury villas" papagayo contact', '"property management" papagayo costa rica']},
    {"city": "Jaco", "state": "Puntarenas", "keywords": ['"condo rentals" jaco contact email', '"property management" jaco airbnb']},

    # EE.UU. & Internacional
    {"city": "Orlando", "state": "FL", "keywords": ['"vacation rental management" orlando email', '"property management" orlando airbnb']},
    {"city": "Miami", "state": "FL", "keywords": ['"luxury vacation rentals" miami contact', '"vacation rental management" miami email']},
    {"city": "Gatlinburg", "state": "TN", "keywords": ['"cabin rentals" gatlinburg contact', '"property management" gatlinburg cabin']},
    {"city": "San Diego", "state": "CA", "keywords": ['"vacation rental management" "san diego" email', '"airbnb management" "san diego"']},
    {"city": "Lake Tahoe", "state": "CA", "keywords": ['"vacation rental management" "lake tahoe" contact', '"cabin rentals" "lake tahoe" info']},
    {"city": "Whistler", "state": "BC", "keywords": ['"chalet rentals" whistler contact', '"vacation rental management" whistler']},
    {"city": "Aspen", "state": "CO", "keywords": ['"luxury vacation rentals" aspen email', '"property management" aspen luxury']},
    {"city": "Maui", "state": "HI", "keywords": ['"vacation rental management" maui contact email', '"condo rentals" maui airbnb']},
    {"city": "Park City", "state": "UT", "keywords": ['"luxury vacation rentals" "park city" contact', '"chalet management" "park city"']},
    {"city": "Sedona", "state": "AZ", "keywords": ['"vacation rental management" sedona contact', '"cabin rentals" sedona email']}
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Expresión regular robusta para detectar correos válidos
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
EXCLUDE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', 'email.com', 'example.com', 'yourdomain.com')

# Filtros para evitar correos de error (Wix/Sentry), placeholders y servicios externos de listados
BLOCKLIST_WORDS = [
    'sentry', 'wixpress', 'wix', 'cloudflare', 'github', 'git', 'reply', 'noreply', 'bounce',
    'example', 'domain', 'test', 'mysite', 'placeholder', 'yourdomain', 'uservoice', 'thryv',
    'yellowpages', 'tripadvisor', 'airbnb', 'vrbo', 'booking', 'wix-press'
]

def is_valid_lead_email(email_str):
    email_lower = email_str.lower().strip()
    if any(email_lower.endswith(ext) for ext in EXCLUDE_EXTENSIONS):
        return False
    if any(word in email_lower for word in BLOCKLIST_WORDS):
        return False
    # Filtro de longitud para descartar hashes largos de sentry (ej. hashes de wixpress de 32+ caracteres)
    user_part = email_lower.split('@')[0]
    if len(user_part) > 28:
        return False
    return True

# Parser de enlaces orgánicos de Yahoo Search
class YahooLinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            attrs_dict = dict(attrs)
            href = attrs_dict.get('href', '')
            # Yahoo encapsula los resultados en URLs de redirección que contienen RU=
            if 'RU=' in href:
                try:
                    parts = href.split('RU=')
                    if len(parts) > 1:
                        # Extraer y decodificar la URL de destino real
                        target = parts[1].split('/')[0]
                        decoded_url = urllib.parse.unquote(target)
                        if decoded_url.startswith('http') and 'yahoo.com' not in decoded_url and 'bing.com' not in decoded_url:
                            self.links.append(decoded_url)
                except Exception:
                    pass

def search_yahoo(query):
    """Realiza una búsqueda en Yahoo Search y extrae las URLs resultantes."""
    url = f"https://search.yahoo.com/search?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
            html = response.read().decode('utf-8', errors='ignore')
            parser = YahooLinkParser()
            parser.feed(html)
            return list(set(parser.links))
    except Exception as e:
        print(f"  [ERROR] Al buscar en Yahoo '{query}': {e}")
        return []

def extract_emails_from_html(html_content):
    """Extrae todos los correos electrónicos únicos y válidos del código HTML de una página."""
    found = set()
    for email in EMAIL_REGEX.findall(html_content):
        email_lower = email.lower().strip()
        if is_valid_lead_email(email_lower):
            found.add(email_lower)
    return found

def get_website_emails(url):
    """Visita una web e intenta extraer correos. Si no halla en la home, intenta con /contact."""
    print(f"  [CRAWL] Visitando: {url}")
    emails = set()
    
    # 1. Intentar con la página principal (Home)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=6, context=ssl_context) as response:
            html = response.read().decode('utf-8', errors='ignore')
            emails.update(extract_emails_from_html(html))
    except Exception:
        return list(emails)

    # 2. Si no hay correos, intentar con la ruta de contacto común
    if not emails:
        contact_url = url.rstrip('/') + '/contact'
        try:
            req = urllib.request.Request(contact_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=5, context=ssl_context) as response:
                html = response.read().decode('utf-8', errors='ignore')
                emails.update(extract_emails_from_html(html))
        except Exception:
            pass

    return list(emails)

def clean_company_name(url_str):
    """Limpia el dominio para generar un nombre de compañía legible."""
    name = url_str.replace('https://', '').replace('http://', '').replace('www.', '')
    name = name.split('/')[0].split('.')[0]
    return name.replace('-', ' ').replace('_', ' ').title()

def main():
    print("=" * 60)
    print("INICIANDO SCRAPING AUTOMÁTICO DE PROSPECTOS PREMIUM (YAHOO)")
    print("=" * 60)
    
    scraped_leads = []
    seen_emails = set()
    
    # Mezclar las ciudades para buscar en orden aleatorio en cada ejecución y obtener leads nuevos
    random.shuffle(TARGETS)
    
    # Buscar objetivos de forma balanceada
    for target in TARGETS:
        city = target["city"]
        state = target["state"]
        print(f"\n[SEARCH] Buscando en: {city}, {state}...")
        
        for query in target["keywords"]:
            print(f"  [QUERY] {query}")
            links = search_yahoo(query)
            
            # Procesar links encontrados
            for link in links[:8]: # Procesamos máximo 8 enlaces por query para ser eficientes
                try:
                    # Extraer dominio base
                    parsed_url = urllib.parse.urlparse(link)
                    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                    
                    emails = get_website_emails(base_url)
                    for email in emails:
                        if email not in seen_emails:
                            seen_emails.add(email)
                            company = clean_company_name(base_url)
                            scraped_leads.append({
                                "Company": company,
                                "Email": email,
                                "Website": base_url,
                                "City": city,
                                "State": state
                            })
                            print(f"    [LEAD] Lead Encontrado: {company} | {email}")
                except Exception:
                    continue
                
                # Pequeño retardo entre sitios para no saturar
                time.sleep(1)
                
            # Detenerse si ya recolectamos suficientes leads para evitar ciclos largos (Límite: 40 leads nuevos)
            if len(scraped_leads) >= 40:
                break
        
        if len(scraped_leads) >= 40:
            print("\n[INFO] Límite de 40 nuevos prospectos alcanzado para esta ejecución.")
            break

    # Escribir los resultados en el archivo airbnb_prospects.csv en 01-INBOX
    if scraped_leads:
        with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["Company", "Email", "Website", "City", "State"])
            writer.writeheader()
            for lead in scraped_leads:
                writer.writerow(lead)
        print(f"\n[SUCCESS] Scraping completado con éxito. Se guardaron {len(scraped_leads)} prospectos en {OUTPUT_FILE}")
    else:
        print("\n[WARNING] No se encontraron prospectos nuevos en esta ejecución.")

if __name__ == "__main__":
    main()
