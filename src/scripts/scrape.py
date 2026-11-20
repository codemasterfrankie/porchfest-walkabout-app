"""
Description: scrapes the Ithaca Porchfest 2026 performers page into clean, structured json

Install:  pip install requests beautifulsoup4
Run:      python scrape.py
Output:   performers.json (a list of dicts, one per performer)
"""
# finds each performer through google maps link

import json
import re
import requests
from bs4 import BeautifulSoup

URL = "https://www.porchfest.org/2026-performers/" # Ithaca specific
TIME_RE = re.compile(r"\d{1,2}:\d{2}\s*[AP]M", re.I) #?

"""
Description: fetch_html uses the website url to receive the text of that web page
param: url, a string
return: a string, the text of the response
"""
def fetch_html(url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0 (porchfest-scraper)"} # A browser-like User-Agent avoids some sites blocking the default python one
    resp = requests.get(url, headers=headers, timeout=20)
    resp.raise_for_status()
    return resp.text

"""
Description: parse_performers creates a list of porchfest performers
param: html (string)
return: list (dictionary)
"""
def parse_performers(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    performers = []

    # Every performer has exactly one Google Maps link for their porch address.
    # Use that as the "anchor" and look at the paragraph that contains it.
    for map_link in soup.select('a[href*="google.com/maps"]'):
        block = map_link.find_parent("p") or map_link.parent
        # Performer name is the bold text; if it's wrapped in a link, that's their website
        name_tag = block.find(["strong", "b"])
        name = name_tag.get_text(strip=True) if name_tag else None
        site_tag = name_tag.find_parent("a") if name_tag else None
        website = site_tag["href"] if site_tag else None

        # Turn <br> into newlines so we can split the block into lines:
        #   line 0: name   line 1: "4:00 PM • address"   rest: description
        for br in block.find_all("br"):
            br.replace_with("\n")
        lines = [ln.strip() for ln in block.get_text().split("\n") if ln.strip()]

        time_match = TIME_RE.search(block.get_text())
        address_line_idx = next(
            (i for i, ln in enumerate(lines) if map_link.get_text(strip=True) in ln), 1
        )
        description = " ".join(lines[address_line_idx + 1:])

        performers.append({
            "name": name,
            "time": time_match.group(0) if time_match else None,
            "address": map_link.get_text(strip=True),
            "map_url": map_link["href"],
            "website": website,
            "description": description,
        })

    return performers


def main():
    html = fetch_html(URL)
    performers = parse_performers(html)

    with open("performers.json", "w", encoding="utf-8") as file:
        json.dump(performers, file, indent=2, ensure_ascii=False)

    print(f"Found {len(performers)} performers. First one:")
    print(json.dumps(performers[0], indent=2, ensure_ascii=False) if performers else "none")


if __name__ == "__main__":
    main()