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
  logoColors: ["#FFFFFF", "#F5B700", "#6FA8FF", "#7ED3A4", "#FF8A7A"],

  /* Extra options (all optional) */
  logo: "logo.svg",     // SVG file shown top right in the header
  schoolBadge: "STŠ",   // source badges on the news card
  afternoonBadge: "IO",
  generalBadge: "RTV",
  schoolMax: 10,        // max. items per feed
  generalMax: 10,       // RTV items per pass (a new batch every pass through the news)
  generalDays: 2,       // RTV items from today and yesterday only
  afternoonMax: 10,
  subsDate: "",         // "YYYY-MM-DD" = show substitutions for this day instead of today (testing)

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
