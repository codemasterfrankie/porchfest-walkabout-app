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

porches = []

for map_link in soup.select('a[href*="google.com/maps"]'):
        block = map_link.find_parent("p") or map_link.parent # gets every block of porch information

        # replace all br elements with a newline character
        for br in block.find_all("br"):
            br.replace_with("/n")
        
        for dot in block.find_all("•"):
            dot.replace_with("/n")

        lines = []
        for ln in block.get_text().split("/n"): # for each line, add to lines
            lines.append(ln.strip())
        # so each line is equal to a porch, we just split the lines by commas to get porch info

        # going to find the name element
        name_el = block.select_one("strong") # sets the name tag
        if name_el:
            name = name_el.get_text(strip=True)
        else:
            name = None
        
        

        # find the time
        # get the address
        # get the google maps url
        # get the description



        
        



