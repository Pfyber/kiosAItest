# Info zaslon SCKR

A static info screen for a portrait school hallway display (1080×1920, scales to any
portrait screen). Plain HTML/CSS/JS: no backend, no build step, no dependencies.

| File | Purpose |
|---|---|
| `index.html` | The screen: layout, styles and all the code |
| `config.js` | Settings (feeds, proxy, holidays, …) |
| `logo.svg` | School logo, recoloured every minute |
| `facts/` | "Ali veš?" facts |
| `godovi.txt` | Name days for every day of the year, shown in the footer |
| `proxy/cloudflare-worker.js` | The CORS proxy; runs on Cloudflare, not on GitHub Pages |
| `design/Info zaslon SCKR.html` | The original static design prototype, for reference |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

Not in the repository (see `.gitignore`): `example.html`, a local copy of the eAsistent
page for offline testing. It contains teacher names, so it must never be published.

## Running

The page must be served over HTTP. Opening it as `file://` does not work.

```
python -m http.server 8000
# open http://localhost:8000/
```

Any static hosting works too (GitHub Pages, Netlify, a school web server, …).

### Kiosk and the proxy

The school RSS feeds, RTV and eAsistent do not send CORS headers, so a normal browser
blocks them. There are two options.

1. **Kiosk Chromium without web security** (leave `proxy: ""`):
   ```
   chromium --kiosk --disable-web-security --user-data-dir=/tmp/kiosk http://localhost:8000/
   ```
2. **A CORS proxy**: set `proxy` in `config.js` to a prefix. The target URL is appended
   URL-encoded, e.g. `proxy: "https://my-proxy.example/?url="`.

### GitHub Pages + Yodeck (step by step)

Yodeck shows the page in a normal browser, so option 2 (a proxy) is needed.

1. **GitHub Pages.** Push this folder to a GitHub repository (`index.html` must be at
   the top level). Then open Settings → Pages and set Source to "Deploy from a branch",
   branch `main`, folder `/ (root)`. The site appears at
   `https://<user>.github.io/<repo>/` after a minute or two, and updates after each push.
2. **Proxy (Cloudflare Worker, free).** Sign up at dash.cloudflare.com and open
   Workers & Pages → Create → Worker. Name it, e.g. `sckr-proxy`, and deploy. Then choose
   Edit code, replace everything with `proxy/cloudflare-worker.js`, and deploy again.
   Test it in a browser:
   `https://sckr-proxy.<account>.workers.dev/?url=https%3A%2F%2Fsckr.si%2Fsts%2F%3Fformat%3Dfeed%26type%3Drss`
   should show the RSS XML.
3. **Connect them.** In `config.js` on GitHub set
   `proxy: "https://sckr-proxy.<account>.workers.dev/?url=",` and commit.
4. **Yodeck.** Add a new "Web Page" app with the GitHub Pages URL, and put it in the
   playlist of the portrait screen.

The worker only forwards to `sckr.si`, `img.rtvslo.si` and `urniki.easistent.com`. To add
another site, add it to `ALLOWED_HOSTS` in the worker. One screen makes roughly 2,100
requests a day, well within the free plan of 100,000.

Weather (Open-Meteo) allows CORS and never goes through the proxy. Local files (facts,
logo, `example.html`) are also loaded directly.

## Configuration

Edit `config.js`, or override any value with a URL parameter of the same name:

```
index.html?switchHour=13
index.html?schoolRss=https://sckr.si/gim/?format=feed%26type=rss
index.html?lat=46.36&lon=14.09&place=Bled
index.html?logoColors=FFFFFF,F5B700,6FA8FF
```

- Encode `&` inside a URL value as `%26`.
- Encode `#` as `%23`, or leave it out for colours (`F5B700` works).
- Lists such as `logoColors` are comma-separated.

| Key | Meaning |
|---|---|
| `proxy` | Prefix for cross-origin fetches (see above) |
| `schoolRss` | School news, shown first in the regular news |
| `afternoonRss` | Event feed, shown alone during event mode |
| `generalRss` | List of RTV feeds, merged into one pool and alternating with the school news: school, RTV, school, … |
| `generalDays` | RTV items from the last N calendar days only (default 2 = today and yesterday) |
| `easistent` | Public eAsistent substitutions URL |
| `switchHour` | Hour (Europe/Ljubljana) when event mode turns on (default 14) |
| `eventsOffHour` | Hour when event mode turns off the next morning (default 6) |
| `afternoonMaxDays` | Event items older than this many days are ignored (default 14, `0` = no limit) |
| `manualModeMinutes` | After a tap on the logo, return to the automatic schedule after this many minutes (default 10, `0` = until the next reload) |
| `lat`, `lon`, `place` | Weather location and the name shown |
| `logoColors` | Logo colours, cycled once per minute |
| `logo` | Logo file (default `logo.svg`) |
| `schoolName` | Text top right above the weather (default `ŠC KRANJ`) |
| `namedays` | Name-day file for the footer (default `godovi.txt`, `""` = off) |
| `schoolBadge`, `afternoonBadge`, `generalBadge` | Source labels on the news card (`STŠ`, `IO`, `RTV`) |
| `schoolMax`, `afternoonMax` | Max. items per feed |
| `generalMax` | Max. RTV items per pass through the news (each pass shows a new batch) |
| `subsDate` | `YYYY-MM-DD`: show substitutions for that day instead of today (testing) |
| `themes` | Seasonal themes by date (see below) |
| `theme` | Force a theme (e.g. `christmas`) or `off`; empty = by date |

### Offline test of the substitutions

```
index.html?easistent=example.html&subsDate=2026-09-23
```

`example.html` shows 23. 9. 2026. Without `subsDate`, the screen correctly shows
"Danes ni nadomeščanj." on every other day. The file is local only (ignored by git).
To make a fresh one, save the eAsistent substitutions page as `example.html`.

## Logo colours

Change `logoColors` in `config.js`. Any number of colours works; they loop, one per
minute, with a 1 s fade. The fade is off when the system asks for reduced motion.

To replace the logo, overwrite `logo.svg`. It is inlined, all fills and strokes become
the current colour (`fill="none"` stays), and it is cropped to the drawing automatically.

## Facts ("Ali veš?")

1. Create a `.txt` file in `facts/`, UTF-8, one fact per line. Empty lines and lines
   starting with `#` are ignored.
2. Add its file name on a new line in `facts/files.txt`. Static hosting cannot list a
   folder, so only files listed there are loaded.

A random fact is shown every 30 s. No fact repeats until all have been shown.

## Name days ("God: …")

In the footer, between "Ali veš?" and the holiday countdown, a section "Danes goduje"
shows today's name days from `godovi.txt`, one line per day of the year:

```
09-23 Pij, Tekla
09-24 Anton
```

- The names come from the Slovenian church calendar (Wikipedia "Koledar svetnikov",
  katoliska-cerkev.si), completed from the folk calendar. At most three common names
  per day.
- On a day with no names (e.g. `12-25`, a feast day) the section is hidden.
- To correct a day, edit its line. Lines starting with `#` are ignored.

## Holiday countdown

The footer shows a countdown to the next school holiday, to the second, for example
"JESENSKE POČITNICE ČEZ 32 dni 06:24:24". During a holiday it counts down to its end
("… ŠE 2 dneva …"). After the last holiday in the list, the countdown hides itself.

Update the list in `config.js` every school year:

```js
holidays: [
  { name: "Jesenske počitnice", start: "2026-10-26", end: "2026-10-30" },
  …
]
```

- `start` is the first free day. The countdown runs to 00:00 that day. To count to
  the end of the last lesson instead, use a time, e.g. `"2026-10-23T13:30"`.
- `end` is the last free day. The holiday lasts until the end of that day.
- All times are Slovenian time, including the switch between summer and winter time.

## Current lesson (under the date)

On school days the header shows the current lesson and how long until the next bell.
On the right are the start and end time of the lesson (or of the next one):

- during a lesson: "3. ura · še 28 min" … "8:55–9:40"
- during a break: "Odmor · še 3 min" … "4. ura 9:45–10:30"
- in the morning, from `lessonsFrom` (6:00): "1. ura čez 35 min" … "7:15–8:00"
- the last minute counts in seconds ("še 40 s")

The bar under it spans one lesson plus the break after it. The lighter part at its end
is the break, so students see it coming. During the break the yellow fill runs into it.

Nothing is shown on weekends, during the `holidays`, or after the last lesson.
The bell times are in `config.js`, one `"start-end"` string per lesson:

```js
lessons: ["7:15-8:00", "8:05-8:50", …],
```

1.–7. ura come from the school timetable. 8.–17. continue the same 45 + 5 minute
pattern until 21:20. Check them against the real schedule.

## Seasonal themes

A theme adds a colour accent and a few small animated shapes on a transparent layer
above the screen. Only transform and opacity animate, so it stays smooth on a small
player. On screens set to reduced motion, the colours change but nothing moves.

| Theme | Default dates | What happens |
|---|---|---|
| `winter` Zima | 12-01 → 12-19 | red accents, snow falls, twinkling lights under the header |
| `christmas` Božič in novo leto | 12-20 → 01-02 | snow, lights, gold stars, greeting banner |
| `pust` Pust | pust-4 → pust | purple accents, confetti, carnival masks and balloons, banner |
| `presern` Prešernov dan | 02-06 → 02-08 | gold stars, verse banner from Zdravljica |
| `valentine` Valentinovo | 02-13 → 02-14 | pink accents, hearts float up, banner |
| `april` Prvi april | 04-01 | logo upside down, parts of the screen wobble now and then |
| `easter` Velika noč | easter-6 → easter+1 | pastel accents, eggs peek in from the edges, a bunny hops across, banner |
| `summer` Zadnji šolski dan | 06-23 → 06-24 | beach balls bounce, confetti, "Lepe počitnice!" |
| `welcome` Prvi šolski dan | 09-01 | balloons, confetti, "Dobrodošli v novem šolskem letu!" |
| `halloween` Noč čarovnic | 10-19 → 10-31 | orange accents, bats, ghosts along the edges, a spider on a thread |

- **By date:** `themes` in `config.js` lists when each theme is on. Dates are `MM-DD`
  (inclusive, a range may wrap over New Year) or relative to the moving feasts:
  `easter±N` and `pust±N` (pust = Shrove Tuesday, 47 days before Easter). The screen
  calculates Easter itself, so these need no yearly update. The first matching entry wins.
  ```js
  { name: "easter", from: "easter-6", to: "easter+1" },
  ```
- **By hand:** tap "ŠC KRANJ". Each tap cycles samodejno → each theme → izklopljeno. A
  short label under the name shows the choice. After `manualModeMinutes` it returns to
  samodejno.
- **Testing:** `index.html?theme=halloween` forces a theme, `?theme=off` turns them off.

A new theme uses the same engine: one entry in `THEMES` (and any new shape in `SPRITES`)
in `index.html`, plus a date range in `config.js`.

## How the data is loaded

| Part | Source | Refresh |
|---|---|---|
| School news | `schoolRss` | every 10 min |
| RTV news | `generalRss` (5 feeds) | every 5 min |
| Event feed | `afternoonRss` | every 5 min in event mode, hourly otherwise |
| Substitutions | eAsistent | every 5 min |
| Weather | Open-Meteo | every 15 min |
| Whole page | reload | once a day at 04:00 |

**Event mode.** From `switchHour` (14:00) to `eventsOffHour` (06:00 the next morning)
the screen shows only `afternoonRss`, if it has items from the last `afternoonMaxDays`
days. If it has none, the regular news keep running. The event feed is checked every
5 minutes, and the screen switches as soon as a current item appears. When new items
arrive in the same mode, the rotation continues without jumping back to the start.

**RTV rotation.** The RTV feeds are merged without duplicates and limited to today and
yesterday. Each pass through the regular news pairs every school item with a new RTV
item, taking the newest ones not shown yet. Fresh RTV items therefore appear on the next
pass, and the same ten are not repeated every time. When all have been shown, it starts
over with the newest.

**Manual switch.** Click or tap the logo to switch between regular news and the event
feed at any time. In manual event mode the event feed is shown even if its items are
older than `afternoonMaxDays`. After `manualModeMinutes` the screen returns to the
automatic schedule by itself.

A failed fetch keeps the last good data on screen. Errors are only logged to the console.

**eAsistent.** The public page loads its list via XHR from
`/nadomescanja/<hash>/<YYYY-MM-DD>/seznam`, which returns JSON with an HTML fragment.
The screen calls that endpoint for today's date and parses the "Nadomeščanja po
razredih" table. The selectors it relies on are documented above `parseEasistent()` in
`index.html`. Teacher names are shortened to "Priimek I.".

The sample day had no room-only change, so that case is detected by a heuristic. A row
counts as a room change when the substitute is the absent teacher themself, or when the
cell or note mentions "učilnic…". Check it the first time a real room change appears.
