# DEFENSIQ

### An Evolutionary Framework for Ransomware Defense Optimization

Documentation site for the final-year project of **Team 42**, Department of Computer Science and Engineering, Amrita Vishwa Vidyapeetham, Coimbatore.

**Live site:** https://final-year-project-documentation-po.vercel.app
**Repository:** https://github.com/parvathy2907/DEFENSIQ

---

## Contents

- [Project at a glance](#project-at-a-glance)
- [Team](#team)
- [The framework](#the-framework)
- [Key notation](#key-notation)
- [Site map](#site-map)
- [Technology](#technology)
- [Repository structure](#repository-structure)
- [Design system](#design-system)
- [Getting started](#getting-started)
- [Writing and editing content](#writing-and-editing-content)
- [Search](#search)
- [Deployment](#deployment)
- [Third-party assets](#third-party-assets)

---

## Project at a glance

Ransomware defense depends on more than detecting a malicious binary. Defenders also need to understand what a sample does, judge which defenses address that behavior, and choose a combination of defenses that leaves the least risk behind.

DEFENSIQ turns observed ransomware behavior into a recommended set of defenses:

- **Observe:** samples run in Cuckoo Sandbox, and their reports are reduced to triggered behavioral signatures.
- **Score:** each signature gets an impact score.
- **Map:** each signature is mapped through MITRE ATT&CK techniques and mitigations to candidate MITRE D3FEND defenses.
- **Optimize:** a Cooperative Co-Evolutionary Algorithm (CCEA) searches the candidate pools for the combination that minimizes the remaining severity.

| | |
|---|---|
| Samples collected | ≈ 3,000 (VirusShare, VirusTotal) |
| Candidate dataset | 17 samples · 2,823 rows |
| Impact scale | A_k ∈ [1, 35] |
| Reduced severity | RS ∈ [0, 10] |
| Academic years | 2025–26 (Phase 1) · 2026–27 (Phase 2) |
| Research cluster | Knowledge Engineering & Semantic Computing |

## Team

| Role | Name |
|---|---|
| Guide | Ms. Rohini S, Assistant Professor, CSE |
| Co-guide | Dr. Gowtham R, Associate Professor, CSE |
| Members | Guru D · Parvathy Krishna A · Shivanesh M C · Vijeya Varshini G · Vimal Sabari S B |

## The framework

The architecture has four stages. The full diagram is on the [System Architecture](https://final-year-project-documentation-po.vercel.app/methodology/architecture/) page.

### I. Behavioural data acquisition
- Builds a malware corpus of about 3,000 samples from VirusShare and VirusTotal.
- Validates the samples and removes duplicates using SHA-256 hashes and AV-engine class labels.
- Runs each sample in Cuckoo Sandbox (host scheduler and isolated guest VM).
- Parses the JSON reports into API, registry, file and network behavior.
- Reduces each sample `h` to its set of triggered signatures `S_h`.

### II. Impact quantification and ATT&CK–D3FEND mapping
- Places each signature in an impact band, then refines it with mutual information, which gives an impact score `A_k ∈ [1, 35]`.
- Maps each signature to an ATT&CK technique, the technique to a mitigation, and the mitigation to a pool `P_k` of D3FEND defenses. For example: `T1129 → M1038 → D3-EAL, D3-PSEP`.
- Together these form the candidate dataset `D` (17 samples, 2,823 rows).

### III. Cooperative co-evolutionary defense optimisation (CCEA)
1. **Population initialisation:** one sub-population per signature.
2. **Selection and variation:** one collaborator from each sub-population forms a candidate combination `C`.
3. **Fitness evaluation:** the **Reduced_Severity** module returns `RS ∈ [0, 10]` with a FULL / PARTIAL / NONE label. It runs in one of two modes:
   - *CSV mode*, which reads a pre-computed RS table;
   - *LLM mode*, which uses Gemini 2.5 Flash-Lite.

   Fitness is `F(C) = (IS − RA) / IS`.
4. **Credit assignment:** fitness is credited to each collaborator, updating its history `H(d)` and usage count `c(d)`.
5. **Elitist replacement:** keeps the best `C*` and `F*`, plus a stagnation counter `n`.
6. **Termination:** stops when (coverage ∧ `n ≥ τ`) or `g = G_max`.

### IV. Output and evaluation
- The optimal defense strategy `C*` with fitness `F*`, using one D3FEND defense per signature.
- The Malware Severity Score before and after: `MSS_before = IS`, `MSS_after = RA(C*)`.
- A comparison of the CCEA against a greedy baseline that uses the same pools and RS source.
- Statistical validation with the Shapiro–Wilk normality test and the Wilcoxon signed-rank test (α = 0.05).

## Key notation

| Symbol | Meaning |
|---|---|
| `h` | A ransomware sample |
| `S_h = {σ_1, …, σ_N}` | Triggered signatures of sample `h` |
| `A_k ∈ [1, 35]` | Impact score of signature `σ_k` |
| `t_k` | ATT&CK technique mapped to `σ_k` |
| `P_k` | Pool of candidate D3FEND defenses for `σ_k` |
| `C = {d_1, …, d_N}` | Candidate defense combination, one defense per signature |
| `RS(σ_k, d_k) ∈ [0, 10]` | Reduced severity of `σ_k` after applying `d_k` |
| `IS` | Initial severity: RMS of normalized impact scores |
| `RA` | Residual aggregate: RMS of `RS / 10` |
| `F(C) = (IS − RA) / IS` | Collaborative fitness of combination `C` |
| `C*`, `F*` | Best combination found and its fitness |

## Site map

The site has a home page and 19 documentation pages in five groups. Each group has its own accent color in the light theme.

| Group | Pages (`src/content/docs/…`) |
|---|---|
| **A · Project Overview** | `overview/introduction` · `overview/problem-objectives` · `overview/utility-security` |
| **B · Related Work & Research Gap** | `research/literature-review` · `research/gap-contributions` |
| **C · System & Methodology** | `methodology/evolution` (Phase 1 → Phase 2) · `methodology/architecture` · `methodology/cuckoo-sandbox` · `methodology/dataset` · `methodology/signature-extraction` · `methodology/impact-quantification` · `methodology/attack-mapping` · `methodology/d3fend-mapping` · `methodology/residual-severity` · `methodology/ccea` |
| **D · Evaluation** | `evaluation/evaluation-plan` |
| **E · Discussion & Resources** | `resources/limitations-future-work` · `resources/references` · `resources/project-team` |

## Technology

| Layer | Tool |
|---|---|
| Static site framework | [Astro](https://astro.build) 7 |
| Documentation theme | [Starlight](https://starlight.astro.build) 0.42 |
| Content | MDX (Markdown with components) |
| Search | [Pagefind](https://pagefind.app) (static, client-side) |
| Images | `sharp` for build-time optimization |
| Hosting | [Vercel](https://vercel.com) |

## Repository structure

```
.
├── astro.config.mjs          # Site config: title, logo, sidebar, component overrides, social link
├── package.json
├── public/
│   ├── favicon.svg
│   ├── fonts/                # Self-hosted Helvetica-metric web fonts + license
│   ├── images/               # Architecture diagrams (light and dark), Amrita logos
│   └── pagefind/             # Search index (generated by `npm run build`)
└── src/
    ├── assets/               # Site logo (light and dark variants)
    ├── components/           # Custom Astro components and Starlight overrides
    ├── content/docs/         # All pages, one .mdx file per page
    ├── content.config.ts     # Content collection definition
    └── styles/custom.css     # Design tokens and all site styling
```

### Components

| Component | Purpose |
|---|---|
| `AcademicCover.astro` | Home page: title, project details card, key facts, architecture at a glance, stages, groups, team |
| `PageTitle.astro` | Page heading with a colored group label (overrides Starlight's `PageTitle`) |
| `ThemeSwitch.astro` | Light / Dark / Auto segmented control (overrides `ThemeSelect`) |
| `ThemeProvider.astro` | Applies the saved theme before first paint; light by default (overrides `ThemeProvider`) |
| `Search.astro` | Header search field and Pagefind dialog (overrides `Search`) |
| `CustomFooter.astro` | Footer with institution, academic details and source-code link (overrides `Footer`) |
| `WorkflowDiagram.astro` | Figure frame with title, status and caption |
| `DataTable.astro`, `MetricCard.astro`, `SectionCard.astro`, `StatusBadge.astro`, `PageIntro.astro`, `ReferenceItem.astro`, `FigurePlaceholder.astro` | Content building blocks used inside the MDX pages |

## Design system

### Themes
- **Light (default):** a cool paper background with deep teal as the primary accent and violet as the secondary. Each documentation group has its own color.
- **Dark:** a Swiss-poster style with a black background, white type and a single red-orange accent (`#FF4D21`).
- **Auto:** follows the operating-system setting.

The choice is saved in `localStorage` under `starlight-theme` and applied before the page paints, so pages don't flash between themes.

All colors are defined as CSS custom properties at the top of `src/styles/custom.css`, once per theme. The main ones are:
- `--dq-ink`: page background
- `--dq-panel`: cards and other raised surfaces
- `--dq-line`: hairlines and borders
- `--dq-text`, `--dq-muted`, `--dq-bright`: body, secondary and heading text
- `--dq-signal`: the primary accent
- `--dq-g-a` … `--dq-g-e`: group colors

Severity colors (red, orange, yellow, green) are used only for meaning.

### Typography
All text uses **Helvetica**. The `DQ Helvetica` font family uses the reader's installed Helvetica Neue or Helvetica when it is available. Otherwise it loads the self-hosted **TeX Gyre Heros**, a Helvetica-metric typeface, from `public/fonts/`, so the site looks the same on every platform. Code uses the system monospace font.

### Architecture diagram
The architecture figure appears in two versions:
- `public/images/architecture.png`: the original drawing, shown in the light theme.
- `public/images/architecture-dark.png`: a recolored copy of the same drawing, shown in the dark theme.

The content of the two images is identical; only the colors differ.

## Getting started

**Requirements:** Node.js 22.23 or later and npm 9.6 or later (required by Astro 7).

```bash
git clone https://github.com/parvathy2907/DEFENSIQ.git
cd DEFENSIQ
npm install
npm run dev
```

The development server runs at http://localhost:4321 and reloads when files change.

| Command | Action |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the static site into `dist/`, generate the Pagefind index and copy it to `public/pagefind/` |
| `npm run preview` | Serve the production build locally |

## Writing and editing content

### Edit a page
Every page is an `.mdx` file in `src/content/docs/`. Each one starts with front matter:

```mdx
---
title: System Architecture
description: Four-stage architecture of the framework.
---

import WorkflowDiagram from '../../../components/WorkflowDiagram.astro';

Page content in Markdown…
```

### Add a page
1. Create the `.mdx` file in the folder for its group, for example `src/content/docs/methodology/new-page.mdx`.
2. Add it to the `sidebar` array in `astro.config.mjs` under the matching group:
   ```js
   { label: 'New Page', slug: 'methodology/new-page' }
   ```
3. Run `npm run build` to refresh the search index.

### References
- The site uses **one master reference list**, numbered in order of first citation, on the References page.
- Every page cites with the same numbers, for example `[1]`.
- Technical resources such as tools and datasets are labelled **TR-1 to TR-5**.
- When adding a source, append it to the master list and reuse its number on every page that cites it.

### Images
- Place images in `public/images/` and reference them as `/images/<file>`.
- Diagrams that need a dark-theme version use the `img-light` / `img-dark` class pair inside a `.dq-diagram` figure.

## Search

Search runs fully client-side with Pagefind. `npm run build` indexes every page and writes the index to `public/pagefind/`, so search also works in the development server. Run a build after changing content so the index stays current.

## Deployment

The site deploys on Vercel from the `main` branch:

1. Import the repository in Vercel.
2. Framework preset: **Astro** (detected automatically).
3. Build command: `npm run build`. Output directory: `dist`.

Every push to `main` triggers a new production deployment. If the site moves to a different address, update `site` in `astro.config.mjs`.

## Third-party assets

- **TeX Gyre Heros** web fonts: © GUST e-foundry, distributed under the GUST Font License (`public/fonts/LICENSE-TeX-Gyre-Heros.txt`).
- **MITRE ATT&CK®** and **MITRE D3FEND™** are trademarks of The MITRE Corporation. Technique, mitigation and defense identifiers are used for reference.
- The Amrita Vishwa Vidyapeetham logo belongs to the university and is used to identify the institution.

---

Team 42 · Department of Computer Science and Engineering · Amrita Vishwa Vidyapeetham, Coimbatore
