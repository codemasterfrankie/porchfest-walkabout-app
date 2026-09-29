from curl_cffi import requests as cf_requests
from bs4 import BeautifulSoup

# below mimics a real browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",   
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;1=0.9"
}
url = "https://www.porchfest.org/2026-performers/"
res = cf_requests.get(
    url,
    impersonate = "chrome120",
    headers = headers)

soup = BeautifulSoup(res.content, 'html.parser')

content = soup.find('div', class_='strong')
if content:
    for para in content.find.all('p'):
        print(para.text.strip())
    else:
        print("nothing found")

