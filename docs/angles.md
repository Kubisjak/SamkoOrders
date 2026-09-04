# Angles Log

A running log of strategic angles discovered while working on the Little Apps platform idea. Each entry: the angle, why it matters, and its status. New entries get a date; nothing gets deleted — parked ideas stay visible.

Status legend: **adopted** (folded into the brief/launch plan) · **testing** (has a task in the launch plan) · **parked** (revisit later).

---

## 2026-08-23

### 1. Open-source the factory kit — the kit *is* the marketing
Give the starter template + kid-UX rulebook away publicly (it's derived from an already-public repo). Parents won't self-serve it anyway — they're paying for "don't make me think." Developers who remix it become evangelists and press; the repo becomes the SEO/AEO anchor and the trust signal ("look, nothing is hidden — no tracking, it's all right here"). Revenue stays in the service: build-for-me, hosting, the fix-it-by-tonight loop. **Status: adopted → REJECTED 2026-08-23** (founder decision — see the second-session update below; replaced by #17 closed factory / open output).

### 2. The colophon referral loop
Every delivered app ends with a small parent-gated colophon page: "Handmade for Samko · [Brand]" plus one action — *"Make one for another kid"* → a one-click remix flow (same app, new name/language/obsessions) as a gift. The product is the referral channel; a gifted app arrives already personalized, which is a better ad than any ad. **Status: adopted** (GTM; Stage 1 backlog).

### 3. Special-needs / speech-therapy beachhead
For children with speech delays, autism, or ADHD, generic apps fail hardest and parents' willingness to pay is highest (an AAC communication board app costs $200+ and still isn't about *their* child). A custom app built around one child's interests, triggers, and level is 10× more valuable here than for typical learners — and SamkoOrders is literally an interest-led pretend-play app, the pattern therapists already use. Distribution via speech-language therapists (B2B2C) is a channel horizontal AI vendors will never build. Needs care: no clinical claims, position as play material a parent/therapist directs. **Status: testing** (candidate beachhead; validate in concierge cohort).

### 4. Heritage-language diaspora beachhead
Diaspora families (Slovak kid in Boston, Ukrainian kid in Munich, Vietnamese kid in Melbourne) want the child playing in grandma's language; the quality free tier (Khan Kids etc.) is English-first and will never serve "slovenská appka pre deti v zahraničí." Long-tail SEO competition: near zero. Communities are tight (weekend schools, diaspora Facebook groups) so distribution is cheap and word-of-mouth is strong. Founder authenticity: the seed app is Slovak-first. **Status: testing** (candidate beachhead; SK/CZ diaspora first).

### 5. The keepsake / time-capsule frame
Wonderbly proved personalized children's *books* are a repeatable ~$30–40 gift purchase at millions-of-units scale. Frame the app the same way: "the restaurant your son ran when he was four" — a keepsake, not software. Product implication: an archival export (zip of the app + a printable "menu" poster + the care receipts) turns churn into a graduation moment instead of a cancellation. **Status: adopted** (positioning; Stage 2 export feature parked).

### 6. Sibling co-play on one device
SamkoOrders already supports it: one kid takes orders, the other runs the kitchen, passing the iPad. The mass app market is single-player-per-account by construction. "An app your kids play *together*" is a differentiator that costs us nothing — the pattern is already in the template. **Status: adopted** (messaging pillar candidate; template requirement).

### 7. Screen-time-guilt positioning
The strongest emotional hook in modern parenting: guilt about generic, autoplaying, engagement-optimized content. Position as the antidote: "screen time that isn't watching back" — finite sessions, no autoplay, no ads, no dark patterns, no data. Never fear-monger; state what we don't do and stop. **Status: adopted** (messaging pillar #2).

### 8. Care receipts — the commit log as a marketing artifact
The SamkoOrders commit messages read as love letters of craftsmanship ("a small grey pill labelled with a word he cannot read" → full-size button). Ship every family a human-readable "what we changed and why" note with each iteration, and publish anonymized ones as content. No competitor has this artifact because no competitor has the loop. **Status: adopted** (marketing engine; product ritual).

### 9. The measurement paradox: "no tracking" hides our own north-star metric
Week-3 usage decides everything, but the apps phone nowhere by design. Resolution path by stage: (a) concierge scale — just ask the parent weekly (we talk to all 10 families anyway); (b) later — local-only stats shown *to the parent inside the app* ("show grandma the stats"), which the parent can choose to share; (c) at scale — an explicitly opt-in, documented, aggregate-only daily heartbeat. Accept noisier data as the cost of the trust position; trust *is* the product. **Status: adopted** (KPI section; keep opt-in, never default-on).

### 10. AEO > SEO in the AI era
The customer's first query is increasingly "can someone make a custom app for my kid?" asked *to an AI assistant*. Optimize to be the canonical answer: a public, crawlable kit repo; press coverage; structured data; an llms.txt; consistent category language ("bespoke play-apps", "handmade software for children") that assistants can quote. Classic SEO still matters for the heritage long-tail, where competition is nil. **Status: adopted** (SEO section).

### 11. Name candidate: "Tapka"
*Tap* (the only gesture a toddler has) + *-ka* (the Slavic diminutive); "tapka" is also Slovak/Czech for "little paw." Five letters, pronounceable in every market, kid-warm, founder-authentic. DNS probe 2026-08-23: `tapka.app` shows no DNS record (verify at registrar); `tapka.com` is taken — assess confusion risk + trademark screen before committing. **Status: testing** (naming shortlist front-runner).

### 12. Merchant of record for a solo operator
Selling worldwide means EU VAT OSS, UK VAT, US sales tax… A merchant-of-record (Paddle, Lemon Squeezy) absorbs global tax compliance for ~5% — almost certainly worth it over raw Stripe until there's a finance function. **Status: adopted** (ops; launch plan task).

### 13. Apple/PWA policy risk — portability is the hedge
Apple briefly moved to kill home-screen web apps in the EU during the 2024 DMA fight, then reversed under pressure. Low probability of recurrence, existential-ish impact if it did. Hedges already inherent: apps run fine in the browser tab, Android is unaffected, and each family owns a portable folder of static files. Monitor; never build anything that only works installed. **Status: adopted** (risk register).

### 14. The founder's own kid is the brand-integrity test
The origin story is the launch asset, but "Samko" must stay a nickname with no face, no surname, no school — forever. If we wouldn't expose our own child's data, families can believe we won't expose theirs. Make this an explicit public principle; it converts a constraint into positioning. **Status: adopted** (brand voice; consent policy).

### 15. The weekly-episode model
The subscription's justification is that the app *grows with the child*: "she mastered counting to ten, so this week the shop added prices up to twenty." Small scheduled evolutions (a new dish, a new letter, a harder level) are cheap to generate from the template and give the family a reason to keep the app on the home screen — retention mechanics without dark patterns. **Status: adopted** (pricing/product; Stage 1 experiment).

### 16. The grandparent gift card
Gifting a link feels cheap; gifting a box doesn't. A printable/printed card — "This certificate entitles Ema to an app of her own" — with a QR code and three questions the grandparent answers with the parent (name, language, current obsession). Solves the "digital gifts have no ritual" problem and opens the highest-WTP channel. **Status: adopted** (pricing SKU; Stage 1 asset).

---

## 2026-08-23 (second session — naming round two, and the closed-source decision)

### Update to #1 (open-source the kit): **rejected** — founder decision
Kubo's call: keep the factory closed. His thesis: parents *will* self-serve when the product is targeted at them and setup feels like magic — so the kit's openness isn't needed as a trust or distribution crutch, and giving away the machine only feeds copycats. Each function the open kit served is replaced: **trust** → the output apps are inherently inspectable static files + a public trust page (#17); **distribution** → template gallery, press story, the still-public SamkoOrders origin repo; **AEO anchor** → trust page + gallery. Status of #1 changes from adopted to **rejected**; nothing else in the log is rewritten.

### 17. Closed factory, open output
The resolution of the trust-vs-secrecy tension: every delivered app is plain readable HTML/JS the family owns and can export — "your child's app contains no network calls; view source and check." The *output* is open by nature; only the factory (templates, rulebook, skill, pipeline) is proprietary. Trust preserved, moat kept. **Status: adopted** (strategy §9; trust §16; launch plan B2.2).

### 18. The name as the SLA — "By Bedtime"
Naming round two surfaced a promise-name: **By Bedtime** (`bybedtime.app` unresolved at probe; bybedtime.com taken — inspect before committing). "Tell us about your kid at breakfast. The app is ready by bedtime." The name is simultaneously the brand, the pitch, and the delivery commitment — a forcing function on operations and a real risk (vacations, growth spikes). Promise-names compound PR ("the company literally named after its delivery time") but punish misses. **Status: testing** (naming finalist A; KidApp Studio is finalist B).

### 19. Wizard-of-Oz self-serve — self-service *ordering*, not self-service *building*
The synthesis of "parents won't build" and "parents will self-serve": the parent's entire experience is a five-minute order form and a delivery email — never an editor, never code. At Stage 1 a human silently reviews every generated app inside the delivery window; the parent experiences full self-serve magic while quality stays hand-checked. Stage 2 removes the human gradually (flagged apps only, then spot checks). Also fixes the funnel metric: "paid with zero human contact" becomes measurable from day one. **Status: adopted** (roadmap §13; runbook B1.4; KPIs).

### 20. TinyTap exists — competitor and trademark landmine
`tinytap.com` resolves: TinyTap is an established "create games for kids" platform. Three consequences: (a) added to the competition table — they prove demand for kid-specific creation, and they're a *builder* (parents assemble games in their editor, inside their subscription), which sharpens our done-for-you wedge; (b) trademark caution for all tap-derived names, including round-one favorite Tapka; (c) their positioning gives us the contrast line: "TinyTap gives you an editor. We give you the app." **Status: adopted** (competition §7; naming criteria §6).

---

## 2026-09-04

### 21. The curriculum is the product's spine — mechanics × content × difficulty
Implemented in the MVP: apps are no longer generated per-topic but assembled from a **curriculum catalog** — a learning goal (first counting, counting to 10, first adding, name letters, alphabet, colors & shapes, memory, patterns) is a path of units, each binding a reusable game *mechanic* to a *difficulty slice*, and the child climbs the path adaptively (four-in-a-row advances, misses never demote). Strategic consequences: (a) "any app for any kid" becomes a data problem, not a code problem — new goals are catalog entries, new subjects are new mechanic+content packs; (b) the catalog maps naturally onto real early-learning frameworks (ISCED 0 / štátny vzdelávací program / Montessori scope-and-sequence), which is a partnership and credibility surface (kindergartens, therapists); (c) the weekly-episode subscription gets its engine for free — an episode is just the next units of the path; (d) the order flow's curriculum step, filtered by age, quietly demonstrates expertise no generic app builder shows. The moat deepens: competitors can copy a game, but the accumulated catalog of goal-paths tuned by real kids' play is the compounding asset. **Status: adopted** (implemented in the template engine; catalog growth is now a standing workstream).

---

*Add new angles above this line with a date header. An angle is worth logging if it changes who we sell to, what they pay for, how they find us, or what could kill us.*
