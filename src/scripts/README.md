## How to Refresh Porchfest Data

run scrape.py, geocode.py, and make_porches.py in that order.

scrape.py will generates performers.json from ithaca's porchfest website.

geocode.py reads performers.json and recreates it to include the coordinates, then saves the address lookups in geocode_cache.json.

make_porches.py reads performers_geo.json and makes src/data/porches.ts (the file actually used in the app).

note: scrape.py and geocode.py write into whatever folder the programmer is currently in, so cd into src/scripts first. make_porches.py can be run from anywhere.