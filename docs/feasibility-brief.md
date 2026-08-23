# Little Apps — Feasibility Brief

*Working name. A platform where any parent describes what their child is learning and gets a custom, private app — built by Claude Code, live at a link, installable on the family iPad — without knowing what hosting is.*

*Prepared August 2026. Grounded in the SamkoOrders repository as the proof-of-concept case study.*

---

## Verdict

**Weak as a venture-scale bet. Strong — and cheap to validate — as a product.** The technical moat is thin (every AI vendor is converging on "prompt → hosted mini-app"), the incumbents include a free and excellent Khan Academy Kids, and the platform you'd build on could absorb the wedge. But the wedge itself is real: generation is commoditized while *delivery* is not, the unit economics round to zero, the privacy positioning is genuinely differentiated in a market parents distrust, and the founder is the product's first successful user. This can be tested end-to-end for roughly the cost of a nice dinner. Build the validation stages; defer the venture question until real families have paid and — more importantly — are still using their apps in week three.

---

## 1. The insight

Any parent with a Claude subscription can already *generate* a decent kids' app. Almost none of them can *ship* one. The questions that stop them are not creative or pedagogical — they are logistical:

- Where does the code live?
- How does it become a link my kid can open?
- How does it get on the iPad home screen so it feels like a real app?
- When my kid gets confused by a button, how do I get it fixed?

These are packaging problems, not technology problems, and SamkoOrders demonstrates that the packaging is nearly free.

## 2. Evidence: the SamkoOrders case study

SamkoOrders is a play-restaurant order pad built for one specific child, entirely by Claude Code sessions. The facts that matter for the platform thesis:

**Delivery costs $0 and requires no infrastructure.**
~3,600 lines across 17 files. Zero dependencies, no build step, no framework. A static PWA (manifest + service worker) hosted free on GitHub Pages via a 30-line workflow, live at a public link, installable to the iPad home screen where it runs fullscreen and offline like a native app. Sound is synthesized in-browser with WebAudio — no audio files. Visuals are emoji and code-drawn SVG — no image assets beyond icons. The entire "where do I host it" problem that stops parents is already solved by this pattern.

**The value came from iteration, not generation.**
Version 1 landed in a single commit. The nine commits that followed over two weeks are all refinements driven by watching the child actually play: touch targets grown because small ones failed; menu items pinned in place because he navigates spatially, not by reading; a remove-scoop control rebuilt because it was "a small grey pill labelled with a word he cannot read"; audio fixed to survive the iPhone's silent switch. **The generation of v1 is the easy part. The product is the loop: parent observes the child → reports what happened in plain language → app is fixed by tonight.**

**Privacy by construction.**
No backend, no accounts, no analytics, no network calls. State lives in localStorage on the device. This wasn't a compliance exercise — it's just the simplest way to build — and it happens to be exactly what parents say they want and can't find.

**Personalization is real but currently artisanal.**
The child's name is hardcoded in six-plus files; content lives in one editable file; the UI is deliberately emoji-only because the child can't read yet. Turning this into a parameterized template is straightforward, well-understood work.

## 3. Positioning

**"Handmade software for your child."** Their name, their obsessions, their pace. No ads, no tracking, no engagement optimization, no subscription hostage-taking. Yours forever — it's a folder of files the family owns.

The mental comparable must not be a $2.99 App Store game. It is:

- a **personalized children's book** (~$30, bought as a gift, kept for years), or
- an **hour of tutoring** ($50+, bought for outcomes).

The emotional buyer is a parent (or grandparent — gifting is a natural channel) who wants to give a child something made *for them*, not something optimized to extract time from them.

**Privacy is also the compliance strategy.** With no child accounts, no data collection, and device-local state, the COPPA/GDPR-K surface is minimal by construction. The parent is the customer, the account holder, and the data controller of a static website. This should be a marketed feature, not fine print.

## 4. Competition

| Who | Threat | Why it doesn't kill the idea |
|---|---|---|
| **Khan Academy Kids** (free, genuinely excellent) | Owns "learning outcomes for free" | Never position on outcomes alone. It's mass-produced; it will never contain your child's name, their dinosaur obsession, or their grandmother's language. |
| **Claude Artifacts / ChatGPT apps** | The vendors are converging on prompt → hosted mini-app | General-purpose, session-shaped, no kid-UX craft, no install story parents understand, no iteration protocol. But this is the real long-term risk — see §7. |
| **Lovable / Bolt / v0** | "Anyone can build an app" | Built for people who want to *be builders*. Parents don't; they want the outcome. No curriculum framing, no child-safety defaults. |
| **Kids' app subscriptions** (ABCmouse et al.) | Incumbent spend | These are the distrusted incumbent this product defines itself against. |

## 5. The moat (such as it is)

There is no technology moat. The defensible assets are craft and service:

1. **Encoded kid-UX knowledge.** The SamkoOrders commit log is a starter rulebook that generic builders don't have: emoji-first, zero reading required, huge touch targets, positional stability (kids navigate spatially), offline-first, synthesized audio, one-action-per-screen. Every family served adds rules. This becomes the template library and the skill layer.
2. **The iteration service.** "Tell us what confused your kid; it's fixed by tonight" is a service promise, not a feature. Chat-with-a-model doesn't deliver it reliably; a productized loop does.
3. **Templates over blank pages.** Generation starts from proven, tested app skeletons, so the quality floor is high and token cost is low. Blank-page competitors have high variance.
4. **Eventually, the corpus.** Shared/remixed apps between families ("the counting game the Nováks made, re-skinned for your daughter") is a network asset no vendor platform will bother to build for this niche.

## 6. Product roadmap (staged, each stage a kill-gate)

### Stage 0 — The factory kit *(days of work, ~$0)*

Extract SamkoOrders into a **starter template + Claude Code skill**: the static-PWA skeleton, the deploy workflow, the kid-UX rulebook, a single config for name/language/content, and the iteration protocol. Prove the factory claim by generating three apps from it:

- **Numbers & counting** — the stated goal for Samko; builds on the coin-counting already in the restaurant app.
- **Letters & reading** — deliberately stretches the template: introduces text where SamkoOrders avoids it.
- **Colors & shapes** — the simplest generalization test; new content, minimal new mechanics.

*Gate: can one Claude Code session + template produce a good app for a different child on a different topic in under an hour?*

### Stage 1 — Concierge MVP *(weeks of work, low hundreds of dollars)*

A landing page and an intake form: child's first name, age, language(s), topic, and what they love right now. Behind it, a headless **Claude Agent SDK** session builds from the template, deploys to **`childname.yourdomain.app`** (Cloudflare Pages — free tier, proper subdomains, instant deploys), and the parent receives a link, a QR code, and add-to-home-screen instructions. Feedback arrives through a simple chat thread and triggers a rebuild-and-redeploy.

Serve the **first 10 families semi-manually** (concierge style — a human watches every generation). Charge from day one.

*Gate: do strangers pay, and are the apps still being opened in week 3? Abandonment, not generation quality, is the metric that decides everything.*

### Stage 2 — Platform *(only if Stage 1 retention holds)*

Template gallery, family-to-family remixing, self-serve iteration, billing, possibly a single "launcher" app. Not worth designing in detail until Stage 1 says so.

## 7. Architecture sketch

- **One static PWA per app** (repo or folder per family). No per-app backend, database, or accounts — this is the cost, privacy, and reliability story all at once.
- **Platform backend only for orchestration**: intake, the Agent SDK build pipeline, deploy hooks, the feedback thread, billing. The kids' apps never talk to it.
- **Hosting**: Cloudflare Pages for the platform (subdomains per child, free tier, no per-site ceremony). GitHub Pages remains the DIY/export path — families can always take their folder and leave, which is a selling point.
- **Generation**: templates + skill + a bounded customization prompt, not blank-page generation. Quality floor high, token spend low, output auditable.

### The App Store: skip it, probably forever

Per-child native apps are a dead end: a developer account and review cycle per app, Apple's Kids Category rules, and guideline 4.2.x rejections for template/container apps. Every iteration would wait days for review instead of shipping tonight. The PWA home-screen install delivers ~95% of the perceived value ("it's an app on the iPad") at zero friction. The only native artifact ever worth considering is one launcher app for all families — a Stage 2+ question at most, and even that risks container-app rejection.

## 8. Unit economics *(estimates, to be validated in Stage 0/1)*

- **Cost per app**: on the order of **$5–30 in tokens** including the initial build and a handful of iterations, assuming template-based generation. Hosting ~$0 at this scale; a domain ~$10–20/yr.
- **Pricing hypotheses**: **$29–49 one-time** per app (personalized-gift framing), or **$15–25/month** per family for apps-on-demand plus unlimited "fix what confused my kid" iterations. The subscription matches where the value actually lives (the loop), but the one-time gift is the easier first sale — Stage 1 should test both.
- Gross margins are software-like in either case; the scarce input at concierge scale is human attention per family, which is exactly what Stages 0–1 are designed to measure.

## 9. Risks

| Risk | Mitigation |
|---|---|
| **Platform absorption** — Claude Artifacts (or an OpenAI equivalent) ships "make an app for my kid, hosted" natively | Accept that the wedge is time-limited. Compete on kid-UX craft, curriculum framing, the iteration service, and trust — things a horizontal vendor won't specialize in. Move fast precisely because the window may close. |
| **Quality variance** — one bad generated app destroys gift-level pricing | Templates, not blank pages; concierge review of every app in Stage 1; the skill encodes hard rules (touch targets, no reading, positional stability). |
| **Willingness to pay** — parents anchored to free/cheap apps | Gift framing and gifting channels (grandparents); charge from the first family; if 10 concierge families won't pay, stop. |
| **Abandonment** — the honest killer of kids' products | Make week-3 usage the explicit success metric. The iteration loop is also the retention mechanism: an app that adapts to the child keeps its place on the home screen. |
| **Trust/safety** — anything involving children invites scrutiny | No child data by construction; parent-owned output; human review at concierge stage; publish the privacy posture prominently. |

## 10. Validation plan

1. **Stage 0** (this month): build the kit; generate the three demo apps (numbers, letters, colors) for real children in the founder's circle. Kill if the template doesn't generalize without hand-surgery.
2. **Stage 1** (next 4–8 weeks): landing page + 10 paying concierge families sourced from personal network and one parenting community. Track: paid conversion, iterations requested per family, **week-3 open rate**.
3. **Decision**: ≥6 of 10 families still using their app in week 3 and unprompted word-of-mouth referrals → invest in Stage 2. Below that → keep it as an open-source kit and a great story, and stop.

---

*Case study source: this repository — [SamkoOrders](https://github.com/Kubisjak/SamkoOrders), live at [kubisjak.github.io/SamkoOrders](https://kubisjak.github.io/SamkoOrders/).*
