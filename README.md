# DEFENSIQ — An Evolutionary Framework for Ransomware Defense Optimization

Project documentation site for **An Evolutionary Framework for Ransomware Defense Optimization**, Team 42, Department of Computer Science and Engineering, Amrita Vishwa Vidyapeetham, Coimbatore.

- **Guide:** Ms. Rohini S (Assistant Professor, CSE)
- **Co-guide:** Dr. Gowtham R (Associate Professor, CSE)
- **Team:** Guru D · Parvathy Krishna A · Shivanesh M C · Vijeya Varshini G · Vimal Sabari S B
- **Academic years:** 2025–26 (Phase 1) · 2026–27 (Phase 2)

## The framework

The framework turns observed ransomware behavior into a recommended set of defenses in four stages:

1. **Behavioural data acquisition:** about 3,000 samples are validated, de-duplicated (SHA-256) and run in Cuckoo Sandbox; JSON reports are parsed into triggered signatures.
2. **Impact quantification and ATT&CK–D3FEND mapping:** MAGIC gives each signature an impact score A_k in [1, 35]; each signature is mapped to an ATT&CK technique, its mitigations and a pool of D3FEND defenses, forming a candidate dataset of 17 samples and 2,823 rows.
3. **Cooperative co-evolutionary defense optimisation (CCEA):** one sub-population per signature, collaborative fitness F(C) = (IS − RA) / IS using reduced severity RS in [0, 10] from a pre-computed table or Gemini 2.5 Flash-Lite, credit assignment and elitist replacement.
4. **Output and evaluation:** the optimal defense strategy C*, the Malware Severity Score before and after, comparison with a greedy baseline, and Shapiro–Wilk and Wilcoxon signed-rank tests (α = 0.05).

## Site structure

19 pages in five groups, plus the home page:

| Group | Pages |
|---|---|
| A · Project Overview | Introduction & Background · Problem Statement & Objectives · Utility & Security Problems |
| B · Related Work & Research Gap | Literature Review · Research Gap & Contributions |
| C · System & Methodology | Phase 1 → Phase 2 · System Architecture · Cuckoo Sandbox · Dataset Construction · Signature Extraction · Impact Quantification · ATT&CK Mapping · D3FEND Mapping · Reduced Severity · CCEA |
| D · Evaluation | Evaluation Methodology |
| E · Discussion & Resources | Limitations & Future Work · References & Technical Resources · Team & Project Information |

Content lives in `src/content/docs/` as MDX. The sidebar is defined in `astro.config.mjs`.

## Design

A security-operations style with two themes: a deep indigo-slate dark theme (the default) and a cool paper light theme, switchable from the header. Teal is the primary accent and violet the secondary. Typefaces: Chakra Petch (headings), IBM Plex Sans (body), IBM Plex Mono (labels and data), loaded from Google Fonts. All colors are defined as tokens at the top of `src/styles/custom.css`, once per theme.

## References

The site uses one reference list, numbered in order of first citation, on the References page. Every page cites with the same numbers. Technical resources are labelled TR-1 to TR-5.

## Run locally

Requires Node.js 18 or later.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/, with the Pagefind search index
npm run preview
```

## Deploy on Vercel

Import the repository in Vercel. The framework preset is detected as Astro; the build command is `npm run build` and the output directory is `dist`. If the site is deployed at a different address, update `site` in `astro.config.mjs` to that URL.
