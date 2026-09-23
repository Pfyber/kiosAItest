/* Info zaslon SCKR – nastavitve.
   Vsako vrednost lahko povoziš s parametrom v URL-ju z enakim imenom, npr.
   index.html?schoolRss=https://sckr.si/gim/?format=feed%26type=rss&switchHour=13 */
window.CONFIG = {
  proxy: "https://sckr-proxy.luka-colaric.workers.dev/?url=",            // prefix for cross-origin fetches, e.g. "https://my-proxy/?url=".
                        // Empty = fetch directly (kiosk Chromium with --disable-web-security).
  schoolRss: "https://sckr.si/sts/?format=feed&type=rss",
  afternoonRss: "https://sckr.si/iod/?format=feed&type=rss",
  generalRss: [         // RTV feeds for the regular news (lighter topics), merged
    "https://img.rtvslo.si/feeds/01.xml",   // Slovenija
    "https://img.rtvslo.si/feeds/09.xml",   // Znanost in tehnologija
    "https://img.rtvslo.si/feeds/03.xml",   // Šport
    "https://img.rtvslo.si/feeds/05.xml",   // Kultura
    "https://img.rtvslo.si/feeds/06.xml"    // Zabava in slog
  ],
  easistent: "https://urniki.easistent.com/nadomescanja/df205daa2f7114245e3f4550746c2dec11f80538",
  switchHour: 14,       // event mode on: only afternoonRss (if it has current items)
  eventsOffHour: 6,     // event mode off the next morning
  afternoonMaxDays: 14, // event items older than this are ignored (0 = no limit)
  manualModeMinutes: 10, // tap on the logo switches regular/event news; back to automatic after this (0 = until reload)
  lat: 46.2389, lon: 14.3556, place: "Kranj",
  logoColors: ["#A7CE39 ", "#FCB040 ", "#41C8F3 ", "#085EA9 ", "#EC3A98 "],

  /* Extra options (all optional) */
  logo: "logo.svg",     // SVG file shown in the header
  schoolName: "ŠC KRANJ", // shown top right above the weather
  namedays: "godovi.txt", // today's name days in the footer ("" = off)
  schoolBadge: "STŠ",   // source badges on the news card
  afternoonBadge: "IO",
  generalBadge: "RTV",
  schoolMax: 10,        // max. items per feed
  generalMax: 10,       // RTV items per pass (a new batch every pass through the news)
  generalDays: 2,       // RTV items from today and yesterday only
  afternoonMax: 10,
  subsDate: "",         // "YYYY-MM-DD" = show substitutions for this day instead of today (testing)

  /* Bell schedule for the "current lesson" line under the date (Mon–Fri).
     1.–7. ura from the school timetable; 8.–17. continue the same pattern
     (45 min lesson + 5 min break) – check them against the real schedule. */
  lessons: [
    "7:15-8:00", "8:05-8:50", "8:55-9:40", "9:45-10:30", "10:35-11:20", "11:25-12:10", "12:15-13:00",
    "13:05-13:50", "13:55-14:40", "14:45-15:30", "15:35-16:20", "16:25-17:10", "17:15-18:00", "18:05-18:50",
    "18:55-19:40", "19:45-20:30", "20:35-21:20"
  ],
  lessonsFrom: "6:00",  // show "1. ura čez …" from this time in the morning

  /* Seasonal themes (colour accent, decoration and a few animated shapes). Shown automatically
     from "from" to "to", inclusive. Dates: "MM-DD", or relative to the moving feasts
     "easter±N" / "pust±N" (pust = Shrove Tuesday). A range may wrap over New Year.
     The first matching entry wins. A tap on "ŠC KRANJ" cycles through all themes by hand.
     Available: winter, christmas, presern, valentine, pust, april, easter, summer, welcome, halloween. */
  themes: [
    { name: "winter",    from: "12-01",    to: "12-19" },    // snow + lights
    { name: "christmas", from: "12-20",    to: "01-02" },    // snow, lights, greeting
    { name: "pust",      from: "pust-4",   to: "pust" },     // Friday before → Shrove Tuesday
    { name: "presern",   from: "02-06",    to: "02-08" },    // Prešernov dan
    { name: "valentine", from: "02-13",    to: "02-14" },
    { name: "april",     from: "04-01",    to: "04-01" },    // April Fools' Day
    { name: "easter",    from: "easter-6", to: "easter+1" }, // week before → Easter Monday
    { name: "summer",    from: "06-23",    to: "06-24" },    // last school days
    { name: "welcome",   from: "09-01",    to: "09-01" },    // first school day
    { name: "halloween", from: "10-19",    to: "10-31" }     // school week before the autumn break
  ],
  theme: "",            // force a theme for testing ("halloween"), or "off"; "" = by date

  /* School holidays for the footer countdown – update every school year.
     start: first free day (countdown runs to 00:00 that day), or "YYYY-MM-DDTHH:MM"
            to count to e.g. the end of the last lesson before the break.
     end:   last free day (the break lasts until the end of that day). */
  holidays: [
    { name: "Jesenske počitnice",   start: "2026-10-26", end: "2026-10-30" },
    { name: "Novoletne počitnice",  start: "2026-12-28", end: "2026-12-31" },
    { name: "Zimske počitnice",     start: "2027-02-22", end: "2027-02-26" },
    { name: "Prvomajske počitnice", start: "2027-04-28", end: "2027-04-30" },
    { name: "Poletne počitnice",    start: "2027-06-28", end: "2027-08-31" }
  ]
};
