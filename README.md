# 🍽️ Samko's Restaurant

A play-restaurant order pad for a kid with an iPad. Tap the food, send the order
to the kitchen, cook it, ring the bell.

No account, no server, no build step — it is plain HTML, CSS and JavaScript, and
everything is saved on the device itself.

## How it works

**Order tab** — pick a category, then tap food tiles to add them. Every tap adds
one portion and pops a `×2`, `×3` badge on the tile. The menu has the screen to
itself; the order lives in the **basket bar** along the bottom, which shows what
has been ordered as a row of pictures plus the running total in play coins.
**Send to kitchen** fires it off with a little fanfare.

Tapping the basket opens the full ticket — itemised lines, quantity steppers,
the table picker and Clear. Those are all things a grown-up needs occasionally
and a child never does, so they stay folded away rather than competing with the
food. The ⚙️ button in the corner hides sound and language for the same reason.

**Kitchen tab** — every sent order arrives as a card and moves through
*New → Cooking → Ready → Served*, one button at a time. Hitting **It's ready!**
rings a bell and throws confetti. The chef icon carries a badge with the number
of orders still outstanding.

Two people can play at once on one iPad by passing it back and forth between the
tabs — one takes orders, one cooks.

### The ice cream counter

The **Zmrzlina** tab is not a grid of items but a little counter. Tap flavours to
stack up to three scoops; the cone beside them is drawn live from the actual
choices, so a scoop of Šmolková really is Smurf blue. The finished cone goes onto
the ticket as a single line and keeps its drawing all the way through the kitchen
and onto the receipt.

Taking a scoop off is meant to cost about what putting one on costs, so there are
two equally obvious ways: the big **Zlož guľu** button under the cone, or tapping
the scoop itself — the top one carries a small ✕ to say so.

The vessel (cone, big cone or cup) is chosen from a chip under the drawing that
rolls out when tapped and folds away again once picked. The drawing already shows
which vessel is in use, so the chooser does not need to sit there while flavours
are being picked.

Identical cones stack into one line; different ones stay separate.

Flavours live in `js/menu.js` under `MENU.iceCream`, each with an icon and the
two colours that make a scoop look round:

```js
{ id: 'mango', emoji: '🥭', name: { sk: 'Mangová', en: 'Mango' },
  colour: '#ffcb61', shade: '#e8a733' }
```

`colour` is the body of the scoop, `shade` its underside. Vessels and the
three-scoop limit are configured in the same block.

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
| `index.html` | Page skeleton — both views, the basket bar and the sheets |
| `css/styles.css` | All styling, including the iPad-specific touch handling |
| `js/menu.js` | The menu, tables, ice cream flavours, and order-line helpers |
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
