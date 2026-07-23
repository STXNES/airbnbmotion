import urllib.request
import urllib.parse
import ssl

ssl_context = ssl._create_unverified_context()
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

query = '"vacation rental management" orlando email'
url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
req = urllib.request.Request(url, headers=HEADERS)

try:
    with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
        print("Status Code:", response.status)
        html = response.read().decode('utf-8', errors='ignore')
        print("HTML length:", len(html))
        print("First 1000 chars of HTML:")
        with open('05-SCRIPTS/Scraper/ddg_response.html', 'w', encoding='utf-8') as out: out.write(html)
except Exception as e:
    print("Error:", e)
