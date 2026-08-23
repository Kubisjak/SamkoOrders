# Little Apps — Feasibility Brief & Operating Plan

*Working name (naming decision in §6). A platform where any parent describes what their child is learning and gets a custom, private app — built by Claude Code, live at a link, installable on the family iPad — without knowing what hosting is.*

*v2 — August 2026. Grounded in the SamkoOrders repository as the proof-of-concept case study. Companion documents: [`launch-plan.md`](launch-plan.md) (full task list), [`angles.md`](angles.md) (running log of strategic angles). All market figures are order-of-magnitude estimates unless sourced; the method is shown so they can be challenged.*

---

## 0. Executive summary

- **Thesis.** AI made generating a child's app nearly free; it did not make *shipping* one easy. Parents can't and don't want to think about repos, hosting, links, or installs — they want the outcome on the iPad by bedtime. We sell the outcome: a private, personalized, no-tracking app for exactly one child, plus the service loop that keeps improving it as the parent watches the child play.
- **Proof.** SamkoOrders: ~3,600 lines, zero dependencies, $0/month static PWA on GitHub Pages, installed on one iPad, refined through 9 observed-play iterations. One real app, one real kid, zero infrastructure.
- **Position.** "Handmade software for your child." The comparable is a personalized book or an hour of tutoring, not a $2.99 app. Privacy is both the pitch and the compliance strategy.
- **Wedge markets.** Three candidate beachheads: gift/keepsake buyers, heritage-language diaspora families, special-needs/speech-delay families. Launch the story globally; let conversion and retention data pick the beachhead.
- **Business model.** Gift app ~$39 one-time; Family Studio ~$19/month (app shelf + unlimited "fix what confused my kid" + the app grows with the child). Token cost per app ~$5–30. Margins are software-like; the scarce input is founder attention, which stages 0–1 are designed to measure.
- **Venture math (the Polsia lesson).** Wrappers raise on traction, not technology: Polsia raised $30M at $250M with ~$10M ARR and zero employees. The same sequencing applies here — near-zero burn, solo + Claude Code operations, and the venture question defers itself until ~$1M ARR with strong week-3 retention. Raise from evidence or don't raise at all.
- **Next 90 days.** Stage 0: extract the factory kit and generate three demo apps (numbers, letters, colors). Stage 1: 10 paying concierge families. Kill-gate: ≥6 of 10 families still playing in week 3.

## 1. Verdict

**Weak as a slide-deck venture bet. Strong — and cheap to validate — as a product, with a real venture path if retention shows up.** The technical moat is thin (every AI vendor is converging on "prompt → hosted mini-app"), the incumbents include a free and excellent Khan Academy Kids, and the platform we build on could absorb the wedge. But the wedge is real: generation is commoditized while *delivery* is not; unit economics round to zero; the privacy positioning is genuinely differentiated in a market parents distrust; and the founder is the product's first successful user. Polsia's raise (§17) demonstrates that "it's just a wrapper" stops being an objection the moment a retention curve exists. Build the validation stages; let ten families decide.

## 2. The insight

Any parent with a Claude subscription can already *generate* a decent kids' app. Almost none of them can *ship* one. The questions that stop them are not creative or pedagogical — they are logistical:

- Where does the code live?
- How does it become a link my kid can open?
- How does it get on the iPad home screen so it feels like a real app?
- When my kid gets confused by a button, how do I get it fixed?

These are packaging problems, not technology problems, and SamkoOrders demonstrates the packaging is nearly free. The gap between "Claude Code can do this" and "a tired parent at 9pm gets it done" is the entire company.

## 3. Evidence: the SamkoOrders case study

SamkoOrders is a play-restaurant order pad built for one specific child, entirely by Claude Code sessions: five emoji categories, a kitchen with order tickets, an ice-cream counter that draws the cone in SVG as it's built, a card-terminal pay flow with synthesized sound.

| Fact | Value |
|---|---|
| Lines of code / tracked files | ~3,600 / 17 |
| Dependencies · build steps · backend · accounts · tracking | 0 · 0 · none · none · none |
| Hosting cost | $0/month (GitHub Pages, 30-line workflow) |
| Commits to v1 / observed-play refinements after | 1 / 9 |
| Languages | Slovak-first, English toggle; kid-facing UI is emoji-only |
| Co-play | Two kids share one iPad (waiter tab / kitchen tab) |

**Delivery costs $0.** Static PWA (manifest + service worker), installable to the home screen, runs fullscreen and offline like a native app. Sound synthesized with WebAudio; visuals are emoji and code-drawn SVG.

**The value came from iteration, not generation.** v1 landed in one commit; the nine that followed were driven by watching the child play: touch targets grown; menu items pinned in place because he navigates spatially, not by reading; a remove control rebuilt because it was "a small grey pill labelled with a word he cannot read"; audio fixed to survive the iPhone silent switch. **The product is the loop: parent observes → reports in plain language → fixed by tonight.**

**Privacy by construction.** No backend, no analytics, no network calls; state in localStorage. Not a compliance exercise — simply the easiest way to build — and exactly what parents say they want and can't find.

**Personalization is real but artisanal.** Child's name hardcoded across six files; content in one editable file. Parameterizing it into a template is straightforward, well-understood work.

## 4. Market

*Method shown; treat every number as an estimate to be challenged.*

- **Ceiling (top-down).** Roughly 130M children are born per year worldwide; ages 3–9 is therefore on the order of **900M children**. The relevant subset — households with a tablet/smartphone and a habit of paying for children's content — is plausibly 10–20% of that: an order of **100–180M children**. This number is only useful as proof the ceiling is not the constraint.
- **Proof of the price point (comparable).** Wonderbly (né Lost My Name) built a real company on personalized children's *books* at ~$30–40 per unit, reportedly selling millions of copies — evidence that "made for exactly one child" is a repeatable gift purchase at our target price, in physical form. We are the same purchase in interactive form.
- **Bottom-up SOM (what actually matters).** The 3-year target that proves the business: **~5,000 paying families** — e.g. 3,000 Family Studio subscriptions (~$19/mo) + 2,000 gift apps/yr (~$39) ≈ **$760k ARR**, operable by one person + AI. The venture gate (§17) sits at roughly double that.
- **Niches are deep, not thin.** Slovak/Czech diaspora alone is millions of people across the US/UK/DACH; every diaspora repeats the pattern. Speech-and-language-delay families are several percent of every birth cohort and dramatically underserved by mass apps.

## 5. Positioning & brand

**Positioning statement.** For modern parents who feel queasy about generic, engagement-optimized screen time, **[Brand]** is a workshop that handmakes a private app for your child — their name, their language, their obsessions — with no ads, no tracking, and no agenda, and keeps improving it as you watch them play. Unlike mass-market kids' apps, it is made for exactly one child: yours.

**Category language (own it, repeat it):** *bespoke play-apps* · *handmade software for children* · "an app of one's own."

**Messaging pillars**
1. **Made for exactly one child.** Their name on the door, their obsessions inside, their language throughout.
2. **Nothing is watching.** No ads, no tracking, no autoplay, no dark patterns. Screen time that isn't watching back.
3. **It grows with them.** Tell us what confused them at dinner; it's fixed by bedtime. Mastered counting to ten? This week the shop sells things that cost twenty.
4. **Yours forever.** A folder of files the family owns — a keepsake: *the restaurant your son ran when he was four.*

**Brand personality.** A toymaker's workshop, not a tech startup: warm, craftsmanlike, specific, honest. Proof devices over adjectives — the origin story, the "care receipts" (human-readable notes of what we changed and why, born from the SamkoOrders commit log), and later, real retention numbers.

**Voice rules.** Lead with "handmade" (AI is the workshop tool, not the hero). Never overclaim learning outcomes ("teaches reading in 30 days" — never). Never fear-monger about other apps; state what we don't do and stop. The founder's own child stays a nickname with no face, no surname — if we wouldn't expose our own child, families can believe we won't expose theirs.

**Tagline candidates.** *An app of one's own.* · *Made for exactly one kid: yours.* · *Handmade software for small people.* · SK: *Appka len pre neho. Len pre ňu.*

## 6. Name & domain

**Criteria.** Pronounceable across languages (worldwide ambition); ≤3 syllables; kid-warm but parent-trustworthy; works as a subdomain scheme (`samko.____`); registrable without a fight; clean trademark screen in classes 9/41/42.

**DNS probe (2026-08-23).** "No DNS record" is a *positive signal only* — availability and price must be verified at a registrar; a name can be registered yet unresolved.

| Candidate | Probe | Notes |
|---|---|---|
| **tapka.app** | no DNS record | **Front-runner.** *Tap* (the toddler's only gesture) + *-ka* (Slavic diminutive); Slovak/Czech for "little paw." 5 letters, globally pronounceable, founder-authentic. `tapka.com` is taken → assess confusion + TM before committing. `samko.tapka.app` reads well. |
| littleapps.family | no DNS record | Warm, descriptive, English-first. Long as a subdomain base. Good secondary/redirect if the brand stays "Little Apps." |
| littleapps.kids | no DNS record | .kids (DotKids Foundation) enforces kid-safe content policy — restrictive but perfectly on-brand. |
| hravo.app | no DNS record | Slovak *hravo* = "playfully, with ease." Distinctive; harder for non-Slavic mouths. |
| kidlet.app | no DNS record | Cute, English-only cleverness; kidlet.com taken. |
| appsformykid.com | no DNS record | Pure SEO-descriptive; fine as a landing/campaign domain, weak as a brand. |
| littleapps.com, appka.com/.app, onelittleapp.com | resolve (taken) | Out, or acquisition money we shouldn't spend. |

**Recommendation.** Decide between **Tapka** (distinctive brand, global, needs TM screen) and **Little Apps on .family/.kids** (instantly legible, less ownable). Buy the runner-up domains anyway (~$50/yr total insurance), plus the .sk for the home market. Register matching handles (X, Instagram, TikTok, GitHub org, LinkedIn page) the same day the name is chosen. Run a knockout trademark search (EUIPO + USPTO, classes 9/41/42) before spending on brand assets.

## 7. Competition

| Who | Threat | Why it doesn't kill the idea |
|---|---|---|
| **Khan Academy Kids** (free, excellent) | Owns "learning outcomes for free" | Never position on outcomes alone. Mass-produced; will never contain your child's name, dinosaur obsession, or grandmother's language. |
| **Claude Artifacts / ChatGPT apps** | Vendors converging on prompt → hosted mini-app | General-purpose, session-shaped, no kid-UX craft, no install story parents understand, no iteration protocol, no gift ritual. The real long-term risk — treated in §21. |
| **Lovable / Bolt / v0** | "Anyone can build an app" | Built for people who want to *be builders*. Parents want the outcome. No curriculum framing, no child-safety defaults. |
| **Toca Boca / Pok Pok** | Premium, design-led, no-ads kids' subscriptions — closest in ethos | Still mass-produced and English-first. Pok Pok validates that parents pay ~$60/yr for calm, ad-free play. We add the one thing they structurally can't: *your* child inside the app. |
| **Wonderbly** (personalized books) | Owns the personalized-gift shelf | Not a competitor — the proof of purchase behavior and the frame to borrow ("made for exactly one child"), in a medium that can't do interaction or iteration. |
| **Ello, AI-reading toys/apps** | "AI + kids" mindshare and inevitable safety scandals | We are anti-engagement, no-data by construction — positioned to benefit from every story about creepy AI kids' products, if we hold the line loudly. |
| **Kids' app subscriptions** (ABCmouse et al.) | Incumbent spend | The distrusted incumbent this product defines itself against. |

## 8. The moat (such as it is)

No technology moat. The defensible assets are craft, service, and relationships:

1. **Encoded kid-UX knowledge.** The rulebook generic builders don't have: emoji-first, zero reading required, huge touch targets, positional stability (kids navigate spatially), offline-first, synthesized audio, one action per screen, sibling co-play on one device. Every family served adds rules; the corpus compounds.
2. **The iteration service.** "Tell us what confused your kid; it's fixed by tonight" is a service promise a chat window doesn't reliably deliver. Productized loop + care receipts.
3. **Templates over blank pages.** Proven skeletons keep the quality floor high, variance low, token cost low, and output auditable.
4. **Channel relationships horizontal vendors won't build:** speech-language therapists, heritage weekend schools, grandparent gifting rituals.
5. **Eventually, the corpus.** Family-to-family remixing ("the counting game the Nováks made, re-skinned for your daughter") — a network asset with no horizontal equivalent.

## 9. Strategy

**Why now.** (1) Generation cost collapsed — Claude Code turns an evening into an app. (2) Parental backlash against engagement-optimized content is at an all-time high. (3) iOS PWA support finally makes "add to home screen" feel native. (4) The wrapper-with-traction path is proven fundable (Polsia). (5) The heritage-language gap is untouched.

**Beachhead logic.** Three candidate first markets, all reachable with the same product:

| Beachhead | Why strong | Why risky |
|---|---|---|
| **Gift/keepsake buyers** (incl. grandparents) | Proven price point (Wonderbly), ritual solved by the gift card (§14), largest pool | Occasion-driven, seasonal; retention lives with the receiving family |
| **Heritage-language diaspora** | Zero competition, tight communities, cheap distribution, founder authenticity (SK/CZ first) | Each community is small; must repeat the playbook per diaspora |
| **Special-needs / speech-delay families** | Highest willingness to pay, genuine 10× value vs. generic apps, therapist channel | Sensitivity: no clinical claims ever; slower, trust-based sales |

**Decision rule:** launch the *story* globally (it travels regardless of niche), sell the first 10 concierge slots to whoever converts, and double down where week-3 retention and referrals actually show up. Working hypothesis: heritage-language diaspora first, special-needs second — but the data outranks the hypothesis.

**Category creation.** We are not "an app builder" and not "edtech." We are a **workshop for bespoke play-apps** — closer to a personalized-gift brand with a software engine than to a SaaS. All language, pricing, and packaging follow from that frame.

**Openness as strategy.** Open-source the factory kit (template + kid-UX rulebook — it descends from an already-public repo). Parents won't self-serve it; developers who remix it become evangelists; the public repo is the trust proof ("no tracking — see for yourself") and the AEO anchor (§12). Revenue lives in the service: build-for-me, hosting, the loop, the gift ritual.

**Platform posture.** Anthropic showcase potential is real (this is the best kind of Claude Code story) — pursue co-marketing, never dependency: keep the pipeline model-portable, the output vendor-neutral static files.

## 10. Go-to-market

**Founder-led, story-first.** The origin story is the launch asset: *"I built a restaurant app for my 4-year-old so he'd play waiter with me. Ten commits later, strangers asked me to build one for their kids."*

**Launch sequence**
1. **Publish the story + open-source the kit** (blog post on the product domain, mirrored to LinkedIn — the existing build-in-public system and audience are the warm channel).
2. **Show HN + Product Hunt** with the kit and the demo apps (numbers, letters, colors). Tech parents are the ideal early adopters: they *could* DIY, which is exactly why they'll respect paying not to.
3. **Founding Families offer:** 10 concierge slots, paid, delivered within 72h, "fixed by tonight" loop included. Scarcity is honest (solo operator).
4. **Drip the proof:** one case study per family (with consent, no faces) — the app, the care receipts, what changed by week 3.
5. **Press:** the solo-founder-plus-AI angle is currently press magnetic (Polsia coverage proves the appetite). Pitch tech press (TechCrunch/The Verge) with the global story; Slovak media (Živé.sk, Forbes SK) with the local-hero story.

**Channels, ranked by hypothesis**

| Channel | Hypothesis | Cost |
|---|---|---|
| LinkedIn (existing audience) | Warmest; tech parents; direct concierge conversions | Time |
| Show HN / Product Hunt | Story + open kit = front page plausible; spiky but list-building | Time |
| Diaspora communities (SK/CZ weekend schools, FB groups) | Highest conversion per impression; slow, human | Time |
| Grandparent gifting | Highest WTP; needs the gift-card ritual + SEO; grows via word-of-mouth | Low |
| Speech-language therapists | B2B2C multiplier; one therapist = many families | Time, trust |
| Parenting newsletters/podcasts | Mid-funnel credibility | $ or barter |
| TikTok/IG (screen-recording only, no kids' faces) | Scalable if a format hits; consent-clean b-roll only | Time |

**Built-in referral: the colophon loop.** Every app ends with a parent-gated colophon — "Handmade for Samko" — and one action: *make one for another kid* (one-click remix as a gift). The product is the referral channel.

**What we don't do at launch:** paid ads (nothing to amortize them against), influencer kids (consent minefield), app-store presence (§15).

## 11. Marketing & content engine

- **Workshop notes** — a weekly build-in-public newsletter/post: one family's (anonymized) request, the care receipt, the lesson added to the rulebook.
- **Care receipts as ritual** — every iteration ships with a human-readable note of what changed and why. Families share these; they are the brand.
- **Template gallery** — every template is a public landing page with a playable demo (the Canva model). This is simultaneously product, SEO surface, and proof.
- **The rulebook as content** — "18 things we know about 4-year-olds and touch targets" is infinitely quotable and only we can write it.
- **Consent policy for all assets:** screen recordings and hands only; never a child's face or full name; written release for anything family-specific.

## 12. SEO & discoverability

- **Technical:** static pages, no JS frameworks → perfect Core Web Vitals by default. Product domain: marketing site + gallery. **Family subdomains are `noindex` always** — privacy promise and thin-content hygiene in one.
- **Three keyword layers:** (1) brand; (2) category terms we're coining (low volume today — we define the words the market will search tomorrow); (3) **programmatic long-tail from the gallery:** `{topic} app for a {age}-year-old` × language × interest ("counting game for a dinosaur-obsessed 3-year-old"). Each gallery page is a real, playable demo — programmatic SEO without thin content.
- **The heritage goldmine:** queries like "slovenské hry pre deti v zahraničí" have essentially zero competition and perfectly qualified intent. Build one landing page per language community as demand appears.
- **AEO (answer-engine optimization).** The first query is increasingly asked to an AI assistant: "can someone make a custom app for my kid?" Being the canonical answer requires: the public kit repo, press mentions, structured data + llms.txt, and consistent category language assistants can quote. Measure by periodically asking the major assistants and logging what they recommend.

## 13. Product roadmap (staged, each stage a kill-gate)

**Stage 0 — the factory kit** *(days, ~$0)*. Extract SamkoOrders into a starter template + Claude Code skill: static-PWA skeleton, deploy workflow, kid-UX rulebook, single config (name/language/content/palette), iteration protocol. Prove it with three demo apps: **numbers & counting** (Samko's actual next step), **letters & reading** (stretches the template into text), **colors & shapes** (pure generalization test).
*Gate: one session + template → a good app for a different child on a different topic in under an hour.*

**Stage 1 — concierge MVP** *(weeks, low $100s)*. Landing page + intake form (child's first name/nickname, age, language(s), topic, current obsession) → headless Claude Agent SDK build → deploy to `childname.<domain>` (Cloudflare Pages) → parent gets link + QR + install instructions + gift-card PDF. Feedback via chat thread (WhatsApp/email at this scale) triggers rebuild-and-redeploy with a care receipt. **10 paying families, human-reviewed, charged from day one.**
*Gate: do strangers pay, and are the apps still opened in week 3? Abandonment, not generation quality, decides everything.*

**Stage 2 — productized platform** *(only if Stage 1 retention holds)*. Self-serve intake, template gallery, weekly-episode subscriptions (the app grows on schedule), family-to-family remixing, archival "graduation" export, billing, possibly one launcher app. Not designed in detail until Stage 1 says so.

## 14. Pricing & packaging

*Hypotheses to test in Stage 1 — anchor to gifts and tutoring, never to the App Store.*

| SKU | Price (test) | Contains |
|---|---|---|
| **Gift App** | $39 one-time | One custom app, 2 refinement rounds, gift-card PDF with QR ("This certifies that Ema is getting an app of her own"), install support |
| **Family Studio** | $19/mo or $190/yr | The family app shelf, unlimited "fix what confused my kid," the app grows with the child (weekly-episode evolutions), sibling variants |
| **Founding Family** | $149 once, 10 slots | Stage-1 concierge: everything above for year one, direct line to the founder, name on the workshop wall (with consent) |
| Therapist / school pack | later | Per-practice licensing once the special-needs channel is validated |

**Guarantee:** *if your kid doesn't play with it in the first week, full refund.* It kills gift risk and disciplines our quality bar.
**Rails:** use a merchant of record (Paddle or Lemon Squeezy) — global VAT/sales-tax handled for ~5%, the correct trade for a solo operator.

## 15. Architecture

- **One static PWA per child/family** (folder or repo per family). No per-app backend, database, or accounts — the cost, privacy, and reliability story at once.
- **Platform backend only for orchestration:** intake, Agent SDK build pipeline, deploy hooks, feedback thread, billing. The kids' apps never talk to it.
- **Hosting:** Cloudflare Pages for the platform (per-child subdomains, free tier, instant deploys). GitHub Pages remains the DIY/export path — families can take their folder and leave, which is a selling point, and the hedge against any single host or Apple-policy wobble (apps must always work in a plain browser tab, never installed-only).
- **Generation:** template + skill + bounded customization prompt; never blank-page. Auditable output; automated lint before deploy: no network calls, no external links, no forms, no third-party assets, vocabulary screen.
- **Model portability:** the pipeline speaks to Claude first but is architected so the templates and rulebook (the real IP) are model-agnostic.

**The App Store: skip it, probably forever.** Per-child native apps mean a developer account and days-long review per tweak, Apple Kids Category rules, and 4.2.x template-app rejections — the "fixed by tonight" promise dies in review. The PWA install is ~95% of the perceived value at zero friction. At most, one launcher app at Stage 2+, and even that risks container rejection.

## 16. Trust, safety & legal

*The stance: we win by being the product that has nothing to hide. Everything below is cheap because of the architecture.*

- **Children's privacy:** COPPA (US), GDPR/GDPR-K (EU), UK Age Appropriate Design Code. Exposure is minimal by construction: no child accounts, no tracking, no profiling, device-local state. The one piece of child-related data we hold is what the parent tells us (first name/nickname, age, interests) — minimize it (nicknames welcome), delete on request, and it ships *into the family's own app files*.
- **Accessibility:** the European Accessibility Act applies to consumer digital services from June 2025. Treat as product advantage — accessible design *is* kid-UX (contrast, target size, no reading required).
- **EU AI Act:** minimal-risk category (no biometrics, no profiling, no manipulation of children — the anti-engagement stance again doubles as compliance). Keep a one-page assessment on file.
- **IP policy (the Paw Patrol problem):** requests for branded characters will come weekly. Policy: never — we build "inspired-by" generics (a brave rescue puppy, not *that* puppy). Documented, explained kindly at intake.
- **Content review pipeline:** template-bounded generation + automated lint + human review of every app at concierge scale; moderation gate before any family-to-family remix is ever shared.
- **Terms:** the family owns their app folder (assignment or broad irrevocable license); we retain the right to fold anonymized *patterns* (not content) back into templates. Parent is the customer and data controller of a static site.
- **Marketing consent:** written release per family; screen-and-hands footage only; the founder's own child stays a nickname with no face — publicly stated as a principle.
- **Entity & tax:** run under the existing company initially or incorporate fresh (founder decision, week 1); merchant of record makes global VAT a non-issue either way.

## 17. The VC route (the Polsia lesson)

**The comp.** Polsia — an AI operations platform run by a solo founder with zero employees — raised **$30M at a ~$250M valuation** (May 2026, Sound Ventures, True Ventures, Vaynerfund et al.) on **~$10M ARR**. Nobody priced the codebase; they priced the revenue curve. "It's just a wrapper" is a technical observation, not a business one — **traction converts the wrapper objection into irrelevance.**

**What the comp proves for us:** (1) solo + AI can *operate* a real product company, which means near-zero burn while validating; (2) the raise-worthy asset is the retention curve, which our kill-gates are already designed to produce; (3) part of Polsia's valuation is narrative premium ("the AI ran the fundraise") — discount comps accordingly, but note our narrative ("a dad, an AI, and ten thousand children's apps") is at least as tellable.

**What the comp does *not* prove:** B2C parents ≠ B2B ops budgets. Polsia replaces a cost center with legible ROI; we sell an emotional purchase with lower ARPU and outgrow-churn. The venture case therefore *requires* the subscription (family shelf + weekly episodes + siblings + gifting), not one-off $39 apps.

**Decision framework:**
- **Don't raise** below ~$50k MRR — burn is ~$0, so capital buys nothing but dilution and board meetings.
- **Raise-ready** at roughly: **$1M+ ARR, W3 kid-retention >50%, referral/gift coefficient >0.5, ≥2 beachheads repeating.** At that point this is a Polsia-shaped story with a warmer market.
- **Either outcome is a win:** the identical operating plan serves a $400k/yr solo lifestyle business and a venture story — the only difference is what we do after the retention curve exists.

## 18. Financial sketch *(all estimates; validate in Stages 0–1)*

- **Unit costs:** $5–30 tokens per app incl. iterations; hosting ~$0 → $20/mo; domains ~$50/yr; MoR fees ~5%; the real cost is founder minutes per family (target: <2h concierge → <15min productized).
- **Break-even:** effectively immediate — fixed costs are a domain and a Cloudflare plan. The investment is founder time (~10–15h/week during Stage 1).
- **Scenarios (36-month horizon):**
  - *Lifestyle:* 200 Family Studio subs + trickle of gifts ≈ **$50–60k ARR**, a few hours a week. Fine outcome.
  - *Real business:* 3,000 subs + 2,000 gifts/yr ≈ **$760k ARR**, still solo + AI. Good outcome.
  - *Venture gate:* ~$1M+ ARR with the §17 metrics → raise or keep compounding; founder's choice from strength.
- **What we spend nothing on until data says otherwise:** paid acquisition, native apps, hiring, offices, tooling beyond Claude Code + Cloudflare + a MoR.

## 19. Operating model

- **The team is one human + Claude Code**, run like Polsia: build sessions (apps from templates), marketing sessions (the existing LinkedIn system), support triage sessions, and this doc system as the company's memory. Every repeatable operation becomes a skill/runbook in git.
- **SLA, stated honestly:** requests before 18:00 CET are live by 22:00 CET; otherwise next evening. "Fixed by tonight" is the brand — defined, not vague. Vacation mode is announced, not hidden (workshop, not factory).
- **Bus factor:** everything — templates, rulebook, briefs, runbooks — lives in git; any competent operator + Claude Code could run the workshop from the repo alone. That is the continuity plan.
- **First hire trigger:** >20 active families or the SLA breaking twice in a month; the role is kid-UX reviewer / community, not engineering.

## 20. KPIs & measurement

**North star: W3 — the share of delivered apps still being played in week 3.** Target ≥60% (kill-gate at 6/10 in Stage 1).

The no-tracking promise makes this deliberately hard to measure — resolve by stage, never by quiet telemetry: (a) concierge: ask the parent weekly (we talk to all 10 anyway); (b) later: local-only stats *shown to the parent in the app*, shareable by choice; (c) scale: explicitly opt-in, documented, aggregate-only heartbeat. Accept noisier data as the cost of the trust position — trust is the product.

| Stage | Funnel & quality metrics |
|---|---|
| Acquisition | story views → waitlist → paid (by channel) |
| Delivery | time-to-live (target ≤72h), refinement rounds to "kid gets it" (target ≤2) |
| Retention | W1 / W3 / W8 play (parent-reported), subscription churn, "graduation" vs. abandonment |
| Love | referral & gift coefficient, unprompted word-of-mouth, refund rate (<5%), care-receipt shares |

## 21. Risk register

| Risk | L×I | Mitigation |
|---|---|---|
| **Platform absorption** — Artifacts et al. ship "app for my kid, hosted" natively | High × High | Speed while the window is open; moat in craft, ritual, channels (therapists, diaspora, grandparents), brand trust; model-portable pipeline; the horizontal vendor validates the category we already occupy |
| **Quality variance** — one bad app destroys gift-level pricing | Med × High | Templates only; automated lint; human review at concierge scale; refund guarantee as forcing function |
| **Trust incident** — one creepy-content screenshot goes viral | Low × Existential | Bounded generation, review pipeline, no-external-anything lint, public open kit, instant response plan; our architecture makes the *category's* scandals (AI toys that record audio) our marketing |
| **Abandonment** — the honest killer of kids' products | High × High | W3 as north star; the loop is the retention mechanism; weekly episodes; graduation export converts churn into a keepsake moment |
| **Willingness to pay** | Med × High | Gift framing, grandparent channel, charge from family #1, kill-gate at 10 families |
| **Apple PWA policy wobble** (2024 EU DMA episode) | Low × High | Apps always work in a browser tab; Android unaffected; families own portable folders |
| **Founder bus-factor / burnout** | Med × Med | Everything in git; honest SLA; workshop-not-factory pacing; hire trigger defined |
| **Token cost spikes / model access** | Low × Med | Template-bounded prompts keep spend low; multi-model portability |
| **Copycats** | High × Low | Inevitable and fine — the moat was never the idea; ship the brand, the rulebook depth, and the relationships faster |

## 22. Open questions (founder decisions, week 1)

1. **Name:** Tapka vs. Little Apps (§6) — decide after the trademark knockout search.
2. **Entity:** run under the existing company vs. incorporate fresh.
3. **Open-source the kit:** recommended yes (§9) — confirm comfort with it.
4. **First market emphasis:** global-English story with SK/CZ diaspora follow-up (recommended) vs. Slovak-first launch.
5. **Time budget:** honest hours/week for Stage 1 — the SLA and slot count derive from it.
6. **Public use of the origin story:** confirm the boundary (nickname only, no face, no surname — recommended and reversible-proof).

## 23. Validation plan

1. **Stage 0** (this month): build the kit; generate numbers/letters/colors apps for real children in the founder's circle. *Kill if the template doesn't generalize without hand-surgery.*
2. **Stage 1** (weeks 2–8): landing page + 10 paying Founding Families from the personal network + one launch (HN/PH). Track paid conversion, refinement rounds, **week-3 play rate** (parent-reported).
3. **Decision** (week ~10): **≥6/10 families playing in week 3 + unprompted referrals → Stage 2.** Below → open-source everything, keep the workshop as a story and a side service, stop investing.

---

*Case study source: this repository — [SamkoOrders](https://github.com/Kubisjak/SamkoOrders), live at [kubisjak.github.io/SamkoOrders](https://kubisjak.github.io/SamkoOrders/). Polsia figures: [The SaaS News](https://www.thesaasnews.com/news/polsia-raises-30m-other/), [AIN](https://en.ain.ua/2026/05/25/ai-startup-polsia-with-no-employees-raised-30m-in-funding/), [Pulse2](https://pulse2.com/polsia-30-million-at-250-million-valuation-raised-for-ai-operations-platform/), [GTMnow](https://gtmnow.com/gtm-192-inside-the-company-that-raised-30m-at-a-250m-valuation-with-0-employees-ben-cera-polsia/).*
