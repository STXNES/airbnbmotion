import os
import re
import csv
import time
import random
from pathlib import Path
from urllib.parse import urljoin

try:
    import requests
    from bs4 import BeautifulSoup
    import dns.resolver
except ImportError as e:
    import sys
    print(f"Faltan librerias. Executable: {sys.executable}. Error: {e}")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[2]
INBOX_FOLDER = ROOT / "01-PIPELINE"
OUTPUT_FILE = INBOX_FOLDER / "altus_prospects.csv"

INBOX_FOLDER.mkdir(parents=True, exist_ok=True)

TARGETS = [
    {"city": "Tamarindo", "state": "Guanacaste", "country": "Costa Rica", "keywords": ['"real estate agency" tamarindo contact email', '"property management" tamarindo real estate']},
    {"city": "Manuel Antonio", "state": "Puntarenas", "country": "Costa Rica", "keywords": ['"luxury real estate" "manuel antonio" contact', '"real estate broker" "manuel antonio"']},
    {"city": "Nosara", "state": "Guanacaste", "country": "Costa Rica", "keywords": ['"real estate" nosara contact email', '"property management" nosara realtor']},
    {"city": "Santa Teresa", "state": "Puntarenas", "country": "Costa Rica", "keywords": ['"real estate agency" "santa teresa" contact', '"luxury homes" "santa teresa" email']},
    {"city": "Papagayo", "state": "Guanacaste", "country": "Costa Rica", "keywords": ['"luxury real estate" papagayo contact', '"realtor" papagayo costa rica']},
    {"city": "Jaco", "state": "Puntarenas", "country": "Costa Rica", "keywords": ['"real estate broker" jaco contact email', '"property management" jaco real estate']},
    {"city": "Escazú", "state": "San José", "country": "Costa Rica", "keywords": ['"bienes raices" escazu contacto correo', '"agencia inmobiliaria" escazu']},
    {"city": "Dominical", "state": "Puntarenas", "country": "Costa Rica", "keywords": ['"real estate agency" dominical email', '"property management" dominical costa rica']},
    {"city": "Las Catalinas", "state": "Guanacaste", "country": "Costa Rica", "keywords": ['"real estate" "las catalinas" email', '"luxury real estate" "las catalinas"']},
    {"city": "Cancún", "state": "Quintana Roo", "country": "México", "keywords": ['"bienes raices" cancun contacto email', '"agencia inmobiliaria" cancun correo']},
    {"city": "Playa del Carmen", "state": "Quintana Roo", "country": "México", "keywords": ['"bienes raices" "playa del carmen" email', '"real estate agency" "playa del carmen"']},
    {"city": "Tulum", "state": "Quintana Roo", "country": "México", "keywords": ['"luxury real estate" tulum email', '"bienes raices" tulum contacto']},
    {"city": "Los Cabos", "state": "Baja California Sur", "country": "México", "keywords": ['"real estate broker" "los cabos" email', '"luxury real estate" "cabo san lucas"']},
    {"city": "Puerto Vallarta", "state": "Jalisco", "country": "México", "keywords": ['"real estate agency" "puerto vallarta" email', '"bienes raices" "puerto vallarta"']},
    {"city": "San Miguel de Allende", "state": "Guanajuato", "country": "México", "keywords": ['"real estate" "san miguel de allende" email', '"bienes raices" "san miguel de allende"']},
    {"city": "Madrid", "state": "Madrid", "country": "España", "keywords": ['"agencia inmobiliaria" madrid contacto email', '"bienes raices" madrid correo']},
    {"city": "Barcelona", "state": "Cataluña", "country": "España", "keywords": ['"agencia inmobiliaria" barcelona contacto email', '"luxury real estate" barcelona']},
    {"city": "Marbella", "state": "Málaga", "country": "España", "keywords": ['"luxury real estate" marbella email', '"agencia inmobiliaria" marbella contacto']},
    {"city": "Mallorca", "state": "Islas Baleares", "country": "España", "keywords": ['"real estate agency" mallorca email', '"agencia inmobiliaria" mallorca']},
    {"city": "Ibiza", "state": "Islas Baleares", "country": "España", "keywords": ['"luxury real estate" ibiza email', '"agencia inmobiliaria" ibiza contacto']},
    {"city": "Punta Cana", "state": "La Altagracia", "country": "República Dominicana", "keywords": ['"real estate agency" "punta cana" email', '"bienes raices" "punta cana"']},
    {"city": "Ciudad de Panamá", "state": "Panamá", "country": "Panamá", "keywords": ['"bienes raices" "ciudad de panama" contacto', '"real estate broker" panama email']},
    {"city": "Medellín", "state": "Antioquia", "country": "Colombia", "keywords": ['"agencia inmobiliaria" medellin contacto email', '"bienes raices" medellin']},
    {"city": "Cartagena", "state": "Bolívar", "country": "Colombia", "keywords": ['"bienes raices" cartagena contacto email', '"real estate agency" cartagena']},
    {"city": "Orlando", "state": "FL", "country": "United States", "keywords": ['"real estate agency" orlando email', '"realtor" orlando property']},
    {"city": "Miami", "state": "FL", "country": "United States", "keywords": ['"luxury real estate" miami contact', '"real estate broker" miami email']},
    {"city": "Tampa", "state": "FL", "country": "United States", "keywords": ['"real estate agency" tampa email', '"luxury realtor" tampa']},
    {"city": "Fort Lauderdale", "state": "FL", "country": "United States", "keywords": ['"real estate broker" "fort lauderdale" email', '"property management" "fort lauderdale"']},
    {"city": "Naples", "state": "FL", "country": "United States", "keywords": ['"luxury real estate" naples fl email', '"real estate agency" naples fl']},
    {"city": "Sarasota", "state": "FL", "country": "United States", "keywords": ['"real estate agency" sarasota email', '"luxury realtor" sarasota']},
    {"city": "San Diego", "state": "CA", "country": "United States", "keywords": ['"real estate broker" "san diego" email', '"luxury realtor" "san diego"']},
    {"city": "Lake Tahoe", "state": "CA", "country": "United States", "keywords": ['"real estate agency" "lake tahoe" contact', '"luxury real estate" "lake tahoe" info']},
    {"city": "Los Angeles", "state": "CA", "country": "United States", "keywords": ['"luxury real estate" "los angeles" email', '"real estate broker" "los angeles"']},
    {"city": "Palm Springs", "state": "CA", "country": "United States", "keywords": ['"real estate agency" "palm springs" email', '"realtor" "palm springs"']},
    {"city": "Santa Barbara", "state": "CA", "country": "United States", "keywords": ['"luxury real estate" "santa barbara" email', '"real estate agency" "santa barbara"']},
    {"city": "Austin", "state": "TX", "country": "United States", "keywords": ['"real estate agency" austin email', '"luxury realtor" austin tx']},
    {"city": "Dallas", "state": "TX", "country": "United States", "keywords": ['"real estate broker" dallas tx email', '"luxury real estate" dallas']},
    {"city": "Houston", "state": "TX", "country": "United States", "keywords": ['"real estate agency" houston email', '"realtor" houston tx']},
    {"city": "Aspen", "state": "CO", "country": "United States", "keywords": ['"luxury real estate" aspen email', '"realtor" aspen luxury']},
    {"city": "Vail", "state": "CO", "country": "United States", "keywords": ['"real estate agency" vail co email', '"luxury real estate" vail']},
    {"city": "Breckenridge", "state": "CO", "country": "United States", "keywords": ['"real estate agency" breckenridge email', '"property management" breckenridge']},
    {"city": "Maui", "state": "HI", "country": "United States", "keywords": ['"real estate agency" maui contact email', '"realtor" maui property']},
    {"city": "Honolulu", "state": "HI", "country": "United States", "keywords": ['"real estate agency" honolulu email', '"luxury realtor" honolulu']},
    {"city": "Scottsdale", "state": "AZ", "country": "United States", "keywords": ['"luxury real estate" scottsdale email', '"real estate broker" scottsdale']},
    {"city": "Sedona", "state": "AZ", "country": "United States", "keywords": ['"real estate agency" sedona contact', '"luxury realtor" sedona email']},
    {"city": "Las Vegas", "state": "NV", "country": "United States", "keywords": ['"real estate agency" "las vegas" email', '"luxury realtor" "las vegas"']},
    {"city": "Park City", "state": "UT", "country": "United States", "keywords": ['"luxury real estate" "park city" contact', '"real estate broker" "park city"']},
    {"city": "Charleston", "state": "SC", "country": "United States", "keywords": ['"real estate agency" charleston sc email', '"luxury realtor" charleston']},
    {"city": "Myrtle Beach", "state": "SC", "country": "United States", "keywords": ['"real estate agency" "myrtle beach" email', '"property management" "myrtle beach"']},
    {"city": "Nashville", "state": "TN", "country": "United States", "keywords": ['"real estate agency" nashville email', '"luxury realtor" nashville']},
    {"city": "Gatlinburg", "state": "TN", "country": "United States", "keywords": ['"real estate agency" gatlinburg contact', '"property management" gatlinburg realtor']},
    {"city": "Atlanta", "state": "GA", "country": "United States", "keywords": ['"real estate agency" atlanta email', '"luxury realtor" atlanta ga']},
    {"city": "Whistler", "state": "BC", "country": "Canada", "keywords": ['"real estate broker" whistler contact', '"luxury real estate" whistler']},
    {"city": "Vancouver", "state": "BC", "country": "Canada", "keywords": ['"luxury real estate" vancouver email', '"real estate agency" vancouver']}
]

random.shuffle(TARGETS)

HEADERS_LIST = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
]

EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
EXCLUDE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', 'email.com', 'example.com', 'yourdomain.com')

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
    user_part = email_lower.split('@')[0]
    if len(user_part) > 28:
        return False
    return True

def verify_mx_record(email):
    domain = email.split('@')[-1]
    if domain in ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']:
        return True
    try:
        records = dns.resolver.resolve(domain, 'MX')
        return len(records) > 0
    except Exception:
        return False

def search_duckduckgo(query):
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
        if response.status_code != 200:
            response = requests.get(url, params={'q': query}, headers=headers, timeout=10)

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

def extract_hero_image(url, html):
    if not html:
        return ""
    try:
        soup = BeautifulSoup(html, 'html.parser')

        og_img = soup.find('meta', attrs={'property': 'og:image'}) or soup.find('meta', attrs={'name': 'og:image'})
        if og_img and og_img.get('content'):
            img_url = og_img['content'].strip()
            if img_url and not img_url.startswith('data:'):
                return urljoin(url, img_url)

        tw_img = soup.find('meta', attrs={'property': 'twitter:image'}) or soup.find('meta', attrs={'name': 'twitter:image'})
        if tw_img and tw_img.get('content'):
            img_url = tw_img['content'].strip()
            if img_url and not img_url.startswith('data:'):
                return urljoin(url, img_url)

        keywords = ['hero', 'banner', 'catalog', 'property', 'listing', 'slider', 'featured', 'header', 'main']
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or ''
            src = src.strip()
            if not src or src.startswith('data:') or src.lower().endswith(('.svg', '.ico')):
                continue
            alt_attr = str(img.get('alt', '')).lower()
            class_attr = ' '.join(img.get('class', [])) if isinstance(img.get('class'), list) else str(img.get('class', '')).lower()
            id_attr = str(img.get('id', '')).lower()
            combined = f"{alt_attr} {class_attr} {id_attr} {src.lower()}"
            if any(kw in combined for kw in keywords):
                return urljoin(url, src)

        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or ''
            src = src.strip()
            if not src or src.startswith('data:'):
                continue
            src_lower = src.lower()
            if any(ext in src_lower for ext in ['.jpg', '.jpeg', '.webp', '.png']):
                if not any(bad in src_lower for bad in ['logo', 'icon', 'avatar', 'badge', 'pixel', 'footer', 'spinner', 'loading']):
                    return urljoin(url, src)
    except Exception as e:
        print(f"  [WARNING] Error al extraer hero image de {url}: {e}")
    return ""

def get_website_data(url):
    print(f"  [CRAWL] Visitando: {url}")
    emails = set()
    hero_image = ""
    headers = {'User-Agent': random.choice(HEADERS_LIST)}
    try:
        response = requests.get(url, headers=headers, timeout=8, verify=False)
        if response.status_code == 200 and response.text:
            emails.update(extract_emails_from_html(response.text))
            hero_image = extract_hero_image(url, response.text)
    except Exception:
        pass

    if not emails:
        contact_url = url.rstrip('/') + '/contact'
        try:
            response = requests.get(contact_url, headers=headers, timeout=8, verify=False)
            if response.status_code == 200 and response.text:
                emails.update(extract_emails_from_html(response.text))
                if not hero_image:
                    hero_image = extract_hero_image(contact_url, response.text)
        except Exception:
            pass

    return list(emails), hero_image

def get_website_emails(url):
    emails, _ = get_website_data(url)
    return emails

def clean_company_name(domain):
    domain = domain.replace("https://", "").replace("http://", "").replace("www.", "")
    domain = domain.split('/')[0]
    name = domain.split('.')[0]
    return name.title()

def main():
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
                emails, image_url = get_website_data(url)
                
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
                        "State": state,
                        "Country": target.get("country", ""),
                        "Image_URL": image_url
                    })
                    print(f"  [LEAD APROBADO] {email} ({company_name}) | Image: {image_url[:50]}")
                    
                time.sleep(random.uniform(1, 3))
                
        if len(prospects) >= 35:
            print("\n[INFO] Se ha alcanzado un buen número de leads en esta ejecución.")
            break

    if not prospects:
        print("\n[WARNING] No se encontraron prospectos nuevos en esta ejecución.")
        return

    file_exists = OUTPUT_FILE.exists()
    fieldnames = ["Company", "Email", "Website", "City", "State", "Country", "Image_URL"]
    
    with open(OUTPUT_FILE, mode="a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerows(prospects)
        
    print(f"\n[SUCCESS] Se guardaron {len(prospects)} prospectos en {OUTPUT_FILE.name}.")
    print("============================================================")

if __name__ == "__main__":
    main()
