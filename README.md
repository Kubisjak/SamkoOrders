# 🍽️ Samko's Restaurant

A play-restaurant order pad for a kid with an iPad. Tap the food, send the order
to the kitchen, cook it, ring the bell.

No account, no server, no build step — it is plain HTML, CSS and JavaScript, and
everything is saved on the device itself.

## How it works

**Order tab** — pick a table (each one has an animal so it works without
reading), pick a category, then tap food tiles to add them. Every tap adds one
portion and pops a `×2`, `×3` badge on the tile. The ticket on the right totals
it up in play coins, and **Send to kitchen** fires it off with a little fanfare.

**Kitchen tab** — every sent order arrives as a card and moves through
*New → Cooking → Ready → Served*, one button at a time. Hitting **It's ready!**
rings a bell and throws confetti. The chef icon carries a badge with the number
of orders still outstanding.

Two people can play at once on one iPad by passing it back and forth between the
tabs — one takes orders, one cooks.

### Other bits

- 🇸🇰 / 🇬🇧 button in the corner switches between Slovak and English.
- 🔊 button mutes the sounds, which are synthesised in the browser — there are no
  audio files to download.
- Orders survive a refresh, a locked screen, and a closed tab.
- Works with no internet at all once it has been opened once.

## Open it

It is deployed to GitHub Pages on every push to `main`:

**https://kubisjak.github.io/SamkoOrders/**

> [!NOTE]
> Pages needs to be switched on once for the deploy to work:
> **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Put it on the iPad home screen

Open the link in Safari → Share → **Add to Home Screen**. It then launches
fullscreen with no browser chrome, which stops small fingers from wandering off
into other tabs.

### Run it locally

No tooling required — open `index.html` in a browser and it works.

To exercise the offline mode and the home-screen install you need a real server,
because service workers do not run from `file://`:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Changing the menu

Everything Samko can order lives in [`js/menu.js`](js/menu.js). Adding a dish is
one line:

```js
{ id: 'pretzel', emoji: '🥨', name: { sk: 'Praclík', en: 'Pretzel' }, price: 3 }
```

`id` must be unique and is what gets saved, so avoid renaming ids once orders
exist — anything referring to a missing id is quietly dropped on load. Prices are
whole numbers on purpose, so counting the coins stays easy.

The tables at the bottom of the same file work the same way; add or remove
entries to change how many tables the restaurant has.

## Layout of the code

| Path | What it does |
| --- | --- |
| `index.html` | Page skeleton — both views and the tab bar |
| `css/styles.css` | All styling, including the iPad-specific touch handling |
| `js/menu.js` | The menu and table data |
| `js/store.js` | State plus its mirror in `localStorage` |
| `js/i18n.js` | Slovak and English interface strings |
| `js/sound.js` | WebAudio sound effects |
| `js/app.js` | Rendering and event wiring |
| `sw.js` | Service worker for offline use |
| `tools/make_icons.py` | Regenerates the icon PNGs (stdlib only, no Pillow) |

Lists are updated by key rather than rebuilt, so the pop and slide animations
only fire for genuinely new items instead of replaying on every tap.

### After changing the icon

`icons/icon.svg` is the source of truth for the artwork, and the PNGs are
generated to match:

```sh
python3 tools/make_icons.py
```

CI fails if the committed PNGs drift from what the script produces.

### After changing any file the app loads

Bump `CACHE_NAME` in [`sw.js`](sw.js) so returning devices pick up the new
version instead of serving the old one from cache.
