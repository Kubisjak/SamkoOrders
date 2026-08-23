# Launch Plan — Task & Project List

*Companion to [`feasibility-brief.md`](feasibility-brief.md). Everything needed to go from this repo to a launched, paying, validated product. Solo operator + Claude Code; effort sizes are S (<2h), M (half-day–day), L (multi-day). Check boxes as tasks complete; every task has an acceptance test so "done" is unambiguous.*

**Phase gates:** A ships the factory kit → B ships the paid concierge offer → C validates with 10 families → D is conditional on the C gate. Don't start B before A's gate passes; don't build D on hope.

---

## Phase A — Foundation & factory kit (weeks 0–2)

### A1. Company & identity decisions

- [ ] **A1.1 — Decide the name** (S) — Finalists: **By Bedtime** (bybedtime.app) vs. **KidApp Studio** (kidapp.studio). Run the knockout trademark search (EUIPO + USPTO, classes 9/41/42 — explicitly including TinyTap's marks), check what bybedtime.com hosts, and say the winner out loud in EN/SK/DE. *Done when: one name chosen, search notes saved to docs/.*
- [ ] **A1.2 — Buy domains** (S, needs A1.1) — Primary + runner-up + .sk + the SEO satellites (appformykid.com, customkidsapps.com, kidsownapp.com). Verify at registrar (DNS probe ≠ availability). *Done when: domains resolve to a parking page you control.*
- [ ] **A1.3 — Register handles** (S, needs A1.1) — GitHub org, LinkedIn page, X, Instagram, TikTok, YouTube — same day, even if unused. *Done when: all secured with the brand name.*
- [ ] **A1.4 — Entity & banking decision** (M) — Existing company vs. new entity; open the account path for the merchant of record. *Done when: decision written in docs/, MoR onboarding started.*
- [ ] **A1.5 — Merchant of record account** (M, needs A1.4) — Paddle or Lemon Squeezy; test-mode checkout working. *Done when: a $1 test purchase completes end-to-end.*
- [ ] **A1.6 — Brand one-pager** (M, needs A1.1) — Positioning statement, 4 messaging pillars, voice rules, tagline choice, "never say" list (from brief §5). *Done when: docs/brand.md exists and a stranger could write on-brand copy from it.*

### A2. The factory kit (the core asset)

- [ ] **A2.1 — Extract the starter template** (L) — New public repo: the SamkoOrders skeleton generalized — PWA shell (manifest, service worker with versioned cache), store/localStorage pattern, WebAudio sound kit, i18n scaffold, emoji-first component patterns. Child name/language/theme/content in **one config file**. *Done when: changing only the config yields a renamed, re-themed, re-worded app.*
- [ ] **A2.2 — Write the kid-UX rulebook** (M) — Codify the SamkoOrders lessons: touch targets, positional stability, zero required reading, one action per screen, sibling co-play, offline-first, audio without asset files, iOS silent-switch handling. *Done when: rulebook.md in the kit repo; every rule traceable to an observed behavior.*
- [ ] **A2.3 — Author the Claude Code skill** (L, needs A2.1–A2.2) — SKILL.md that takes an intake (name, age, language, topic, obsession) and drives: clone template → customize → lint → deploy → return link. Includes the iteration protocol ("parent reports in plain words → minimal diff → care receipt"). *Done when: a fresh Claude Code session with only the skill + intake produces a deployed app.*
- [ ] **A2.4 — Safety lint script** (M, needs A2.1) — Automated check on every build: no network calls, no external links/assets, no forms/inputs collecting data, no third-party scripts, vocabulary screen on all strings, service-worker cache bumped. *Done when: lint passes on demo apps and fails on seeded violations.*
- [ ] **A2.5 — Deploy pipeline** (M, needs A1.2) — Cloudflare Pages project; script that ships a built app to `childname.<domain>` with TLS, `noindex`, and a QR code generated per app. *Done when: a test app is live on a child subdomain in <5 minutes from command.*
- [ ] **A2.6 — Install & gift assets** (M, needs A2.5) — One-page "add to home screen" instructions (EN/SK, screenshots per iOS/Android) + printable gift-card PDF template with QR ("This certifies that ___ is getting an app of her own"). *Done when: a non-technical adult installs a test app from the PDF alone, unassisted.*

### A3. Prove the factory (the Stage-0 gate)

- [ ] **A3.1 — Demo app: numbers & counting** (M, needs A2.3) — For Samko; builds on the coin-counting mechanic. *Done when: live, lint-clean, and Samko plays it more than once.*
- [ ] **A3.2 — Demo app: letters & reading** (M, needs A2.3) — Stretches the template into text-bearing UI. *Done when: live, lint-clean, tested with one real child.*
- [ ] **A3.3 — Demo app: colors & shapes** (M, needs A2.3) — Pure generalization test, minimal new mechanics. *Done when: live and lint-clean in under one session.*
- [ ] **A3.4 — 🚦 GATE A review** (S, needs A3.1–A3.3) — Honest write-up: did one session + template produce a good app for a different child/topic in <1 hour? Log time, token cost, and hand-surgery incidents. *Done when: go/no-go recorded in docs/. No-go = fix the kit, not the ambition.*

### A4. Legal & trust baseline

- [ ] **A4.1 — Privacy policy & terms** (M, needs A1.1) — Plain-language: what we collect (parent email; child nickname/age/interests supplied by the parent), where it lives, deletion on request; family owns the app folder; anonymized *patterns* may improve templates. *Done when: reviewed once by a lawyer or vetted template service; published.*
- [ ] **A4.2 — IP/character policy** (S) — The "Paw Patrol answer": inspired-by generics only, written kindly for intake and FAQ. *Done when: published on the site FAQ.*
- [ ] **A4.3 — Marketing consent kit** (S) — Release form for family case studies; house rule codified: screens and hands only, nicknames only, founder's child included. *Done when: form + rule in docs/, linked from runbooks.*
- [ ] **A4.4 — Compliance memo** (M) — One page each: COPPA, GDPR-K, UK AADC, EAA accessibility, EU AI Act minimal-risk rationale. Not for show — it's the checklist the lint and intake enforce. *Done when: docs/compliance.md exists; every claim maps to an enforced control.*

---

## Phase B — Sellable offer & launch assets (weeks 2–5)

### B1. Website & funnel

- [ ] **B1.1 — Landing page** (L, needs A1.6, A2.6) — Static, fast, bilingual EN/SK. Origin story, the 4 pillars, live demo links (the three apps), pricing, Founding Families offer, FAQ (privacy, IP policy, guarantee, SLA). *Done when: live on the product domain; Lighthouse ≥95 across the board.*
- [ ] **B1.2 — The magic order flow** (M) — Five minutes, five questions: child nickname, age, language(s), topic, current obsession (plus device + timezone); consent checkboxes baked in; ends at checkout and the promise — *"your app arrives by bedtime."* Tally/Typeform first, custom later; the parent never sees anything resembling a builder. *Done when: a stranger can go from landing page to paid order in under 5 minutes, and submissions arrive somewhere durable with a notification.*
- [ ] **B1.3 — Checkout** (M, needs A1.5) — Gift App $39 / Founding Family $149 live via MoR; refund flow tested. *Done when: real card purchase + refund both verified.*
- [ ] **B1.4 — Delivery runbook (Wizard-of-Oz)** (M, needs A2.3, A2.5) — The end-to-end script behind the self-serve front: paid order → build session → lint → **hidden human review inside the delivery window** → deploy → delivery email (link, QR, install PDF, care receipt #0) → calendar the W1/W3 check-ins. The parent experiences self-serve magic; the founder is the invisible quality gate. *Done when: dry-run delivers a full order to a friendly tester inside the promised window with zero improvisation.*
- [ ] **B1.5 — Feedback channel** (S) — One thread per family (email or WhatsApp Business), template replies, SLA reminder automation. *Done when: a test "he keeps tapping the wrong thing" message flows to a fix, redeploy, and care receipt.*
- [ ] **B1.6 — Waitlist** (S, needs B1.1) — Email capture for beyond-10 demand; simple, no marketing automation yet. *Done when: signups land in a list you can export.*

### B2. Content & PR assets

- [ ] **B2.1 — The origin-story post** (M) — The launch essay: "I built a restaurant app for my 4-year-old…" — with the care-receipt excerpts. Product-domain blog + LinkedIn adaptation via the existing posting system. *Done when: drafted, consent-checked, scheduled.*
- [ ] **B2.2 — Public trust page + demo gallery** (M, needs A2.4, A3.x, A4.1) — The closed-source trust substitute: a plain-language page explaining the privacy architecture (no network calls, no tracking, files the family owns and can export — "view source and check"), plus the three demo apps as playable public pages. This is the AEO anchor; the factory stays proprietary. *Done when: trust page + gallery live and linked from the landing page.*
- [ ] **B2.3 — Show HN + Product Hunt drafts** (M, needs B2.1, B2.2) — Titles, first comment (HN), gallery + maker comment (PH); launch-day checklist and reply playbook. *Done when: both drafted and a launch date is set.*
- [ ] **B2.4 — Press kit + pitch list** (M) — One-pager, screenshots, founder photo, the Polsia-adjacent angle ("a dad, an AI, and an app workshop"); 10 outlets: global tech (TechCrunch, The Verge), parenting newsletters, Slovak media (Živé.sk, Forbes SK). *Done when: kit page live; 10 personalized pitches drafted.*
- [ ] **B2.5 — Demo video/GIFs** (M, needs A3.x) — 30–60s screen recordings per demo app (hands and screens only). *Done when: three clips exported in web + social formats.*
- [ ] **B2.6 — Workshop-notes #1** (S) — First issue of the weekly build-in-public note; establish the format (one request, one care receipt, one rulebook lesson). *Done when: published and cross-posted.*

### B3. Measurement & ops

- [ ] **B3.1 — KPI sheet** (S) — One spreadsheet: funnel (views → order started → completed → paid, plus **self-serve rate**: paid with zero human contact), delivery (time-to-live vs. the promise, refinement rounds), retention (W1/W3/W8 parent-reported), love (referrals, refunds). *Done when: every metric has a column and an owner ritual (weekly fill-in).*
- [ ] **B3.2 — Check-in scripts** (S) — The W1 and W3 parent questions (2 minutes, human, no forms-feeling): "Did they open it this week? What confused them? What did they show someone?" *Done when: scripted and calendared into the delivery runbook.*
- [ ] **B3.3 — Site analytics, privacy-sane** (S, needs B1.1) — Cookieless page analytics on the *marketing site only* (e.g. a privacy-first counter); never on family apps. *Done when: live and disclosed in the privacy policy.*
- [ ] **B3.4 — Support & vacation policy** (S) — Publish the honest SLA (before 18:00 CET → live by 22:00 CET) and workshop-closure notices. *Done when: on the FAQ.*

---

## Phase C — Concierge launch & validation (weeks 5–10)

- [ ] **C1 — Soft launch to the warm network** (S, needs B1.x) — LinkedIn origin post + direct notes to likely first families; open 10 Founding slots. *Done when: posted; ≥3 slots claimed or lessons logged.*
- [ ] **C2 — Show HN launch** (M, needs B2.3) — Ship it; spend the day in the thread. *Done when: launched, replies handled, traffic and conversions logged.*
- [ ] **C3 — Product Hunt launch** (M, needs B2.3) — Same, PH edition (separate day). *Done when: launched and logged.*
- [ ] **C4 — Press pitches out** (S, needs B2.4) — All 10, personalized, timed to launch week. *Done when: sent; responses tracked.*
- [ ] **C5 — Deliver families 1–3** (L, needs B1.4) — Full concierge runbook, extra care; capture time + token cost per app precisely. *Done when: 3 live apps, ≤72h each, care receipts sent, W1/W3 check-ins calendared.*
- [ ] **C6 — First case study** (M, needs C5, A4.3) — With consent: the request, the app (anonymized), the receipts, the W3 verdict. *Done when: published; family approved the final cut.*
- [ ] **C7 — Deliver families 4–10** (L) — Push on variety: at least one non-SK/EN language, one grandparent gift, one special-needs family if demand appears. *Done when: 10 delivered or demand shortfall documented honestly.*
- [ ] **C8 — Diaspora channel probe** (M) — 3 SK/CZ weekend schools / diaspora groups approached with the gift offer. *Done when: conversations logged; ≥1 partnership or a documented no.*
- [ ] **C9 — Therapist channel probe** (M) — 3 speech-language therapists shown the concept (no clinical claims, play-material framing). *Done when: structured notes on fit, objections, willingness to refer.*
- [ ] **C10 — Weekly-episode experiment** (M, needs C5) — For ≥3 families, ship a scheduled evolution ("the shop now sells things that cost twenty") and observe effect on W3+ play. *Done when: 3 episodes shipped; effect noted per family.*
- [ ] **C11 — Colophon remix test** (M) — Add "make one for another kid" to delivered apps; count taps → gift conversions. *Done when: live in ≥5 apps; conversion logged.*
- [ ] **C12 — Weekly KPI + angles review** (S, recurring) — Fill B3.1; add any new angle to docs/angles.md; adjust one thing max per week (concierge scale = small n, don't thrash). *Done when: 6 consecutive weekly entries exist.*
- [ ] **C13 — 🚦 GATE C review (the decision)** (M, needs C5–C12) — Against the pre-committed bar: **≥6/10 families playing in week 3, plus unprompted referrals, plus evidence strangers order self-serve (paid with zero human contact) → Phase D. Below → wind down gracefully, keep it as a story and a side service, stop investing.** *Done when: the decision memo is written and — either way — published as a workshop note.*

---

## Phase D — Scale decisions (month 3+, conditional on Gate C)

*Deliberately sketched, not detailed — designing this before Gate C is procrastination with extra steps.*

- [ ] **D1 — Self-serve pipeline** (L) — Intake → build → lint → human-spot-check → deploy without founder keystrokes; founder reviews, not assembles.
- [ ] **D2 — Template gallery + programmatic SEO** (L) — Every template a playable public demo page; topic × age × language long-tail; heritage-language landing pages per community with demand.
- [ ] **D3 — Family Studio subscription mechanics** (L) — App shelf, sibling variants, scheduled episodes, graduation/archive export (the churn-to-keepsake moment).
- [ ] **D4 — Remix marketplace with moderation gate** (L) — Family-to-family sharing; human review before anything is public.
- [ ] **D5 — AEO program** (M) — llms.txt, structured data, quarterly "ask the assistants" audit; press flywheel.
- [ ] **D6 — Raise/no-raise memo** (M) — Against §17 thresholds ($1M ARR, W3 >50%, referral >0.5, 2 repeating beachheads); Polsia-comp deck only if raising serves the plan.
- [ ] **D7 — First-hire decision** (S) — Trigger: >20 active families or 2 SLA breaches/month; role: kid-UX reviewer/community, not engineering.
- [ ] **D8 — Trust deepening** (M) — Third-party privacy/security attestation of the pipeline; publish the audit summary on the trust page (built in B2.2). The closed factory earns external verification instead of open source.

---

## Standing weekly rhythm (from Phase B onward)

| Ritual | Cadence | Output |
|---|---|---|
| Deliveries & fixes | Daily window (the SLA) | Live apps, care receipts |
| Parent check-ins (W1/W3) | As calendared | Retention data in the KPI sheet |
| Workshop notes | Weekly | One published note |
| KPI + angles review | Weekly | Updated sheet; angles.md entries |
| Rulebook update | Weekly | New rules from observed play |

## Explicitly deferred (decided non-goals for now)

Paid ads · native/App Store apps · a custom web app for intake (forms are fine) · **open-sourcing the factory (decided: closed — the output apps are the open part)** · multi-model orchestration · hiring · localization beyond EN/SK marketing (family apps are any-language already) · investor conversations before Gate C evidence.
