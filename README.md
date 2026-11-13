# Welcome to the Porchfest Walkabout App

## Summary
Porchfest Walkabout is a mobile app for Ithaca's [Porchfest](https://www.porchfest.org/) music festival. While you walk around Ithaca during the festival window, it uses your location and the performance schedule to tell you which band is plaing on the porch nearest to you. This app allows festival-goers the freedom to wander where the music takes them and easily find out what performers they're enjoying.

Read more about Porchfest [here](https://en.wikipedia.org/wiki/Porchfest), and sign up to be a volunteer at Ithaca Porchfest [here](https://www.porchfest.org/volunteer/)!

## Project status

This project is in development. Version 1, designed for Ithaca Porchfest only, is set for deployment to the Google Play Store in December 2026. For more info on versions, look [here](#versions-and-roadmap).

- Current features: 
   - location permission and tracking while in app
   - nearest-band detection
   - band screen
   - before- and after-festival screens
   - demo mode
- In progress:
   - location tracker that updates every few feet
   - details on band screen
   - post-festival walkabout overview
- Future features:
   - "bookmark" favorite bands
   - post-festival automatic Spotify playlist creation
   - multi-town selection

## Versions and roadmap

| Version | What's new | Status |
| --- | --- | --- |
| v1 |Designed for Ithaca Porchfest, the app uses location tracking to display name of closest band, with simple before- and after-festival screens. | Complete |
| v2 | This ithaca app displays porch address, band name, and set duration when close to a porch, as well as a simple chronological overview of bands visited on the after-festival screen. | ToDo |
| v3 | Users can "bookmark" bands as they hear them, and the after-festival overview will show all bands heard, with bookmarked bands marked accordingly. The after-festival overview also includes an options to download the band overview and make a Spotify playlist containing music from your visited bands. | ToDo |
| v4 | The opening screen contains a dropdown option, allowing users to choose from all towns that participate in Porchfest. (This requires implementation of a data collection/data management system, which is yet to be chosen.) | ToDo | 

## Background and credits

I started this app as my senior year project at Ithaca College (Fall 2026) under the mentorship of Prof. Doug Turnbull. I designed the layout, engineered the interactions, chose tools and frameworks, and wrote the front-end and data pipeline. The development of this app was part mobile development exploration, part local-music passion project, and part agentic experimentation. LLMs were utilized in researching and selecting the right framework and architecture for this app, and comments in the code show where LLMs contributed.

## Requirements

- Node.js 22.13 or newer (includes npm): https://nodejs.org
- Git
- Ways to view the app:
   - web browser (easiest)
   - Android phone with Expo Go for SDK 57 (see Quick start)
   - Android emulator from Android Studio
- Python3 (only if you want to refresh the festival data)

## Quick start

1. Clone the repo and install packages:

```bash
git clone https://github.com/codemasterfrankie/porchfest-walkabout-app.git
cd porchfest-walkabout-app
npm install
```

2. Start the dev server:

```bash
npx expo start
```

You should see a QR code and a list of keyboard shortcuts. To open the app:
- in a browser: press `w` (most reliable)
- on Android phone: install the correct version of Expo Go, then scan QR code
- in Android emulator: press `a` (requires Android Studio)

Expo Go version note: this project uses Expo SDK 57. The Expo Go app in the Play Store uses a new SDK and will not open this project. Install the SDK 57 version of Expo Go or open the app in a browser.

## Demo mode

Because Porchfest happens one day a year (in Ithaca 2026: September 20, 12 - 6pm), the app has a demo mode that uses made up times and locations.

In src/app/index.tsx:
- `DEMO_MODE = true` uses `DEMO_TIME` and `DEMO_COORDS` instead of your device's real time and location.
- Try different scenarios by commenting in different `DEMO_TIME` or `DEMO_COORD` options.
- Set `DEMO_MODE = false` to use your real time and location.
- Outside of the festival window, you'll see the "see you next year" screen

## How the app works

1. The app initially asks for location permission and monitors your device's location.
2. It checks the current time against the festival time window. Before the festival window, a "coming soon" screen will be displayed. After the festival window, a "see you next year" screen will show.
3. During the festival window, the app looks through it's data to find every performer that is playing right now (each performance is assumed to last 60 minutes) and measures your distance to each porch.
- If the closest porch is within 50 meters, it shows that band's name and details on the screen.
- The constants for festival times, set length and max distance to a porch are at the top of src/app/index.tsx.

## Project structure

```bash
src/
app/ # screens and navigation (Expo Router, one file per route)
_layout.tsx # app shell shared by every screen
index.tsx # home screen: location, time, and nearest-band logic
components/ # screens shown my index.tsx (BandScreen, ComingSoonScreen, SeeYouNextYearScreen)
data/
porches.ts # GENERATED festival schedule, don't edit by hand
utils/
distance.ts # calculates distance in meters between two sets of coordinates
scripts/ # Python pipeline that builds porches.ts
assets/ # icons and splash images
app.json # Expo config: app names, icons, permissions
```

## Refreshing festival data

The schedule found in `src/data/porches.ts` is built for the Ithaca Porchfest website in three steps. When the schedule changes (i.e. is updated a few weeks before the festival), you can update the app's data via the following:

1. Set up python (just do one time):
```bash
cd src/scripts
python3 -m venv venv
source venv/bin/activate # windows: venv\Scripts\activate
pip install -r requirements.txt
```
2. Run the scripts from inside `src/scripts` in order:
```bash
python scrape.py # from Ithaca Porchfest website, creates performers.json
python geocode.py # from performers.json, adds coordinates and creates performers_geo.json
python make_porches.py # writes ../data/porches.ts
```
- `geocode.py` uses OpenStreetMap's free Nominatim service, which allows one request per second. The first run will be slow. Results are cached in `geocode_cache.json`, so later runs will be faster.
- For a new year/date/time, update the URL in `scrape.py` and `FESTIVAL_DAY`, `FESTIVAL_START`, and `FESTIVAL_END` in `src/app/index.tsx`.
- `scrapeJ.py` is experimental and is not part of the python pipeline.
- note: `scrape.py` and `geocode.py` write into whatever folder the programmer is currently in, so `cd src/scripts` first. `make_porches.py` can be run from anywhere.

## Contributing

1. Ask to be added as a collaborator, or fork the repo!
2. Pull the latest `master`, then create a branch for one change: `git checkout -b feature/short-description` (or `fix/...`).
3. Make small commits with clear messages ("add set time to BandScreen").
4. Before pushing, make sure the app still starts, and run `npm run lint`.
5. Push your branch and open a pull request into master. Describe what changed and how you tested it.
6. Someone ense reviews and merges. Don't push directly to master. Ideas and bigs should go into GitHub Issues. Check the issues list for open work!

## Troubleshooting
- The Expo Go app says the project is incompatible: see the Expo Go version note in [Quick start](#quick-start)
- App always shows the "see you next year page": demo mode is off and the festival is over (see [Demo mode](#demo-mode))
- Location never loads in the browser: allow location access in the browser's site settings
- Something weird happens after switching branches: run `npm install` again, then `npx expo start -c` (clears the cache)

## License

MIT License

Copyright (c) 2026 Jaden Rieck

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
