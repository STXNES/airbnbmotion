import os
import re
import csv
import time
import random
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
    import dns.resolver
except ImportError:
    print("Faltan librerias. Asegurate de instalar: pip install requests beautifulsoup4 dnspython")
    import sys
    sys.exit(1)

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

# Randomizar el orden de las ciudades para explorar nuevas siempre
random.shuffle(TARGETS)

HEADERS_LIST = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
]

# Expresión regular para detectar correos
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
EXCLUDE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', 'email.com', 'example.com', 'yourdomain.com')

# Filtros para evitar correos basura
BLOCKLIST_WORDS = [
    'sentry', 'wixpress', 'wix', 'cloudflare', 'github', 'git', 'reply', 'noreply', 'bounce',
    'example', 'domain', 'test', 'mysite', 'placeholder', 'yourdomain', 'uservoice', 'thryv',
    'yellowpages', 'tripadvisor', 'airbnb', 'vrbo', 'booking', 'wix-press', 'duckduckgo'
]

def is_valid_lead_email(email_str):
    email_lower = email_str.lower().strip()
    if any(email_lower.endswith(ext) for ext in EXCLUDE_EXTENSIONS):
        return False
    if any(word in email_lower for word in BLOCKLIST_WORDS):
        return False
    # Evitar correos super largos (posibles hashes de imágenes)
    user_part = email_lower.split('@')[0]
    if len(user_part) > 28:
        return False
    return True

def verify_mx_record(email):
    """Verifica si el dominio del correo tiene un registro MX válido."""
    domain = email.split('@')[-1]
    # Lista blanca de dominios que sabemos que funcionan
    if domain in ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']:
        return True
        
    try:
        records = dns.resolver.resolve(domain, 'MX')
        return len(records) > 0
    except Exception:
        # Si DNS falla (Timeout, NoAnswer, NXDOMAIN), asumimos que el correo no existe o rebotará
        return False

def search_duckduckgo(query):
    """Busca en DuckDuckGo HTML Version para evadir captchas y extraer links orgánicos."""
    url = "https://html.duckduckgo.com/html/"
    headers = {
        'User-Agent': random.choice(HEADERS_LIST),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    data = {'q': query}
    
    links = []
    try:
        response = requests.post(url, headers=headers, data=data, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            for a in soup.find_all('a', class_='result__url'):
                href = a.get('href', '')
                if href and 'duckduckgo' not in href and 'yahoo' not in href:
                    if href.startswith('//'):
                        href = 'https:' + href
                    elif not href.startswith('http'):
                        href = 'https://' + href
                    links.append(href)
        else:
            print(f"  [ERROR] DuckDuckGo HTTP {response.status_code}")
    except Exception as e:
        print(f"  [ERROR] Al buscar en DuckDuckGo '{query}': {e}")
    
    return list(set(links))

def extract_emails_from_html(html_content):
    found = set()
    for email in EMAIL_REGEX.findall(html_content):
        email_lower = email.lower().strip()
        if is_valid_lead_email(email_lower):
            found.add(email_lower)
    return found

def get_website_emails(url):
    """Visita una web e intenta extraer correos."""
    print(f"  [CRAWL] Visitando: {url}")
    emails = set()
    headers = {'User-Agent': random.choice(HEADERS_LIST)}
    
    try:
        response = requests.get(url, headers=headers, timeout=8, verify=False)
        emails.update(extract_emails_from_html(response.text))
    except Exception:
        pass

    # Si no hay, intentar con /contact
    if not emails:
        contact_url = url.rstrip('/') + '/contact'
        try:
            response = requests.get(contact_url, headers=headers, timeout=8, verify=False)
            emails.update(extract_emails_from_html(response.text))
        except Exception:
            pass

    return list(emails)

def clean_company_name(domain):
    domain = domain.replace("https://", "").replace("http://", "").replace("www.", "")
    domain = domain.split('/')[0]
    name = domain.split('.')[0]
    return name.title()

def main():
    # Suprimir warnings de InsecureRequestWarning
    try:
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    except:
        pass

    print("============================================================")
    print("INICIANDO SCRAPING AUTOMÁTICO DE PROSPECTOS (DUCKDUCKGO)")
    print("============================================================")
    
    prospects = []
    
    for target in TARGETS:
        city = target["city"]
        state = target["state"]
        print(f"\n[SEARCH] Buscando en: {city}, {state}...")
        
        for keyword in target["keywords"]:
            print(f"  [QUERY] {keyword}")
            urls = search_duckduckgo(keyword)
            time.sleep(random.uniform(2, 4))
            
            for url in urls[:5]:
                emails = get_website_emails(url)
                
                for email in emails:
                    if not verify_mx_record(email):
                        print(f"  [DNS FILTER] Se descartó '{email}' (Registro MX no existe o inválido)")
                        continue
                        
                    company_name = clean_company_name(url)
                    prospects.append({
                        "Company": company_name,
                        "Email": email,
                        "Website": url,
                        "City": city,
                        "State": state
                    })
                    print(f"  [LEAD APROBADO] {email} ({company_name})")
                    
                time.sleep(random.uniform(1, 3))
                
        # Detenerse si ya superamos 35 leads
        if len(prospects) >= 35:
            print("\n[INFO] Se ha alcanzado un buen número de leads en esta ejecución.")
            break

    if not prospects:
        print("\n[WARNING] No se encontraron prospectos nuevos en esta ejecución.")
        return

    file_exists = OUTPUT_FILE.exists()
    
    with open(OUTPUT_FILE, mode="a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["Company", "Email", "Website", "City", "State"])
        if not file_exists:
            writer.writeheader()
        writer.writerows(prospects)
        
    print(f"\n[SUCCESS] Se guardaron {len(prospects)} prospectos en {OUTPUT_FILE.name}.")
    print("============================================================")

if __name__ == "__main__":
    main()
