import urllib.request
import urllib.parse
import ssl
from html.parser import HTMLParser

ssl_context = ssl._create_unverified_context()
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

query = '"vacation rental management" orlando email'
url = f"https://www.ask.com/web?q={urllib.parse.quote(query)}"
req = urllib.request.Request(url, headers=HEADERS)

class AskLinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            attrs_dict = dict(attrs)
            href = attrs_dict.get('href', '')
            # Enlaces de resultados orgánicos de Ask.com suelen tener class="algo" y son directos
            # Vamos a capturar todos los links http que no sean de ask.com
            if href.startswith('http') and 'ask.com' not in href and 'google.com' not in href:
                self.links.append(href)

try:
    with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
        print("Status Code:", response.status)
        html = response.read().decode('utf-8', errors='ignore')
        print("HTML length:", len(html))
        parser = AskLinkParser()
        parser.feed(html)
        print("Found links count:", len(parser.links))
        print("Sample links:", parser.links[:5])
except Exception as e:
    print("Error:", e)
