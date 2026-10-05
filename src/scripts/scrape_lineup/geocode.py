"""
Add latitude/longitude to every performer in performers.json.

Install:  pip install geopy
Run:      python geocode.py        (after scrape.py has made performers.json)
Output:   performers_geo.json  (same records + "lat" and "lon")

Uses OpenStreetMap's free Nominatim service. Its rules: max 1 request per second
and a descriptive user agent. Many bands share a porch, so each unique address
is only looked up once, and results are cached in geocode_cache.json so re-runs
are instant.
"""

import json
import os
from urllib.parse import unquote_plus

from geopy.extra.rate_limiter import RateLimiter
from geopy.geocoders import Nominatim

CACHE_FILE = "geocode_cache.json"


def clean_address(performer: dict) -> str:
    # The Google Maps link holds a tidy full address ("435 N Geneva St, Ithaca, NY"),
    # which avoids notes like "(backyard on short st)" in the display text.
    url = performer.get("map_url", "")
    if "/place/" in url:
        return unquote_plus(url.split("/place/", 1)[1]).strip("/")
    return f"{performer['address']}, Ithaca, NY"


def main():
    with open("performers.json", encoding="utf-8") as f:
        performers = json.load(f)

    cache = {}
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, encoding="utf-8") as f:
            cache = json.load(f)

    geolocator = Nominatim(user_agent="porchfest-ithaca-student-app")
    geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1.1)

    addresses = sorted({clean_address(p) for p in performers})
    todo = [a for a in addresses if a not in cache]
    print(f"{len(addresses)} unique porches, {len(todo)} to look up (~{len(todo)} sec)")

    for addr in todo:
        loc = geocode(addr)
        cache[addr] = [loc.latitude, loc.longitude] if loc else None
        print(("OK   " if loc else "MISS ") + addr)

    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2)

    missing = []
    for p in performers:
        coords = cache.get(clean_address(p))
        p["lat"], p["lon"] = coords if coords else (None, None)
        if not coords:
            missing.append(p["address"])

    with open("performers_geo.json", "w", encoding="utf-8") as f:
        json.dump(performers, f, indent=2, ensure_ascii=False)

    print(f"\nSaved performers_geo.json. {len(missing)} without coordinates.")
    for a in sorted(set(missing)):
        print("  -", a, "(add it to geocode_cache.json by hand as [lat, lon])")


if __name__ == "__main__":
    main()