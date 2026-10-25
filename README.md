<div align="center">

# DEFENSIQ

### An Evolutionary Framework for Ransomware Defense Optimization

Final-year project · **Team 42** · Department of Computer Science and Engineering
Amrita Vishwa Vidyapeetham, Coimbatore

**[Live documentation](https://final-year-project-documentation-po.vercel.app)** · **[Source code](https://github.com/parvathy2907/DEFENSIQ)**

</div>

---

DEFENSIQ turns observed ransomware behavior into a recommended combination of defenses. Samples are run in a sandbox, their behavior is reduced to triggered signatures, and each signature is scored for impact. Each signature is then mapped through MITRE ATT&CK to candidate MITRE D3FEND defenses, and a Cooperative Co-Evolutionary Algorithm (CCEA) searches for the combination that leaves the least severity behind.

This repository contains the project's documentation website. The first part of this README summarizes the research. The second part explains how the site is built, run and maintained.

## Contents

**Part I: The project**
1. [Project at a glance](#1-project-at-a-glance)
2. [Team](#2-team)
3. [Background and motivation](#3-background-and-motivation)
4. [Problem statement](#4-problem-statement)
5. [Research objectives](#5-research-objectives)
6. [Research gaps and contributions](#6-research-gaps-and-contributions)
7. [System architecture](#7-system-architecture)
8. [Stage I: Behavioural data acquisition](#8-stage-i-behavioural-data-acquisition)
9. [Stage II: Impact quantification and ATT&CK–D3FEND mapping](#9-stage-ii-impact-quantification-and-attckd3fend-mapping)
10. [Stage III: Cooperative co-evolutionary defense optimisation](#10-stage-iii-cooperative-co-evolutionary-defense-optimisation)
11. [Stage IV: Output and evaluation](#11-stage-iv-output-and-evaluation)
12. [From Phase 1 to Phase 2](#12-from-phase-1-to-phase-2)
13. [Scope, assumptions and limitations](#13-scope-assumptions-and-limitations)
14. [Future work](#14-future-work)
15. [Key notation](#15-key-notation)
16. [References](#16-references)

**Part II: The documentation site**
17. [Site map](#17-site-map)
18. [Technology](#18-technology)
19. [Repository structure](#19-repository-structure)
20. [Design system](#20-design-system)
21. [Getting started](#21-getting-started)
22. [Writing and editing content](#22-writing-and-editing-content)
23. [Search](#23-search)
24. [Deployment](#24-deployment)
25. [Third-party assets](#25-third-party-assets)

---

# Part I: The project

## 1. Project at a glance

| | |
|---|---|
| **Title** | An Evolutionary Framework for Ransomware Defense Optimization |
| **Samples collected** | ≈ 3,000 (VirusShare, VirusTotal and samples provided by the guide) |
| **Analysis environment** | Cuckoo Sandbox (host scheduler + isolated guest VM) |
| **Impact scale** | A_k ∈ [1, 35] (MAGIC impact quantification) |
| **Knowledge bases** | MITRE ATT&CK (Enterprise) and MITRE D3FEND |
| **Reduced severity** | RS ∈ [0, 10], from a pre-computed table or Gemini 2.5 Flash-Lite |
| **Optimizer** | Cooperative Co-Evolutionary Algorithm (CCEA) |
| **Candidate dataset** | 17 samples · 2,823 rows |
| **Evaluation** | CCEA vs. greedy baseline; Shapiro–Wilk and Wilcoxon signed-rank tests (α = 0.05) |
| **Academic years** | 2025–26 (Phase 1) · 2026–27 (Phase 2) |
| **Research cluster** | Knowledge Engineering & Semantic Computing |

## 2. Team

| Role | Name |
|---|---|
| Guide | Ms. Rohini S, Assistant Professor, Department of CSE |
| Co-guide | Dr. Gowtham R, Associate Professor, Department of CSE |
| Members | Guru D · Parvathy Krishna A · Shivanesh M C · Vijeya Varshini G · Vimal Sabari S B |

## 3. Background and motivation

Ransomware is malware that restricts access to files or systems, usually by encrypting data, and then demands payment to restore access. Early ransomware either locked the system or encrypted files. Modern campaigns add **double extortion**, where data is stolen before it is encrypted and the attackers threaten to publish it. Some go further with **triple or multiple extortion**, adding DDoS attacks or contacting the victim's customers and partners.

A ransomware incident moves through a lifecycle. The site groups the fourteen MITRE ATT&CK Enterprise tactics into seven stages:

| Stage | Lifecycle stage | ATT&CK tactics |
|:---:|---|---|
| 1 | Preparation | Reconnaissance (TA0043), Resource Development (TA0042) |
| 2 | Initial Access | Initial Access (TA0001) |
| 3 | Execution & Persistence | Execution (TA0002), Persistence (TA0003) |
| 4 | Escalation & Evasion | Privilege Escalation (TA0004), Defense Evasion (TA0005) |
| 5 | Credentials & Discovery | Credential Access (TA0006), Discovery (TA0007) |
| 6 | Spread & Control | Lateral Movement (TA0008), Command and Control (TA0011) |
| 7 | Theft & Impact | Collection (TA0009), Exfiltration (TA0010), Impact (TA0040) |

Recovery inhibition (T1490) and data encryption (T1486) both fall under the Impact tactic. Not every incident follows this order, and some stages may be missing.

Dynamic analysis shows *what* a sample does. It does not say which defenses would contain that behavior, how much severity each defense would leave, or which **combination** of defenses works best across all of the observed behaviors. DEFENSIQ is built to answer those questions in a structured, repeatable way.

## 4. Problem statement

> **As registered in Phase 1:** To develop an evolutionary decision-making framework capable of dynamically identifying optimal defense strategies against evolving ransomware attacks.

Ransomware uses varied behaviors and evasion techniques, which makes it hard to choose an effective defense strategy. A defense that works against one behavior may do little against another. Evaluating every possible defense combination by hand is impractical. The project therefore needs a structured approach that can:

- extract behavioral signatures;
- link them to relevant defenses;
- estimate the severity left after a defense is applied;
- use those estimates to guide the choice of defenses.

Here, **optimal** means the combination with the highest fitness that the search finds under the defined fitness function. The search is heuristic, so the result is the best combination found, not a proven global optimum.

## 5. Research objectives

**Objective 1: Construct a comprehensive attack dataset capturing ransomware behavior patterns**
1. Analyze ransomware samples in an automated testbed environment and generate comprehensive analysis reports.
2. Parse the analysis reports to understand the ransomware attack plans in terms of the signatures triggered by each sample.

**Objective 2: Develop a defense dataset based on existing defense mechanisms**
1. Investigate the attack plans to identify the Tactics, Techniques, and Procedures (TTPs) they use through TTP analysis.
2. Systematically map existing defense mechanisms to the corresponding adversarial techniques using the MITRE ATT&CK and D3FEND knowledge bases.

**Objective 3: Develop an evolutionary decision-making framework for selecting optimal defense strategies against dynamically evolving ransomware attacks**
1. Represent attack plans and defense mechanisms as inputs to the decision-making framework.
2. Design and develop a co-evolutionary method that maps defense mechanisms against specific attack patterns.

**Deliverables committed in Phase 1:**
1. a ground-truth attack dataset;
2. a ground-truth defense dataset with the source of every mapping recorded;
3. an evolutionary framework that recommends a defense combination for an observed attack.

## 6. Research gaps and contributions

| Research gap | Core challenge | Addressed by |
|---|---|---|
| Attack–defense evaluation | Mapping a technique to a candidate defense does not show that the defense is effective. | ATT&CK–D3FEND mapping and residual-severity assessment |
| Impact and residual severity | A behavior's initial impact does not represent the severity left after mitigation. | Signature impact quantification and RS estimation |
| Defense-combination search | The candidate spaces are too large to evaluate exhaustively. | CCEA-based optimization |
| LLM reliability | Severity estimates need validation before the optimizer can use them. | Structured-output validation and benchmark evaluation |

These gaps describe the specific integration this project addresses. Earlier work does cover attack mapping, impact quantification, evolutionary algorithms and LLM evaluation, but individually.

**Key contributions:**
1. Integration of dynamic malware analysis with behavioral signature processing.
2. A standardized attack–defense representation using ATT&CK and D3FEND.
3. Integration of signature impact quantification with residual severity.
4. Attack–defense assessment through a Reduced_Severity module (CSV or LLM mode).
5. CCEA-based optimization of defense combinations.
6. Experimental evaluation of both the severity estimation and the optimization.

## 7. System architecture

The framework has four stages. The full diagram is on the [System Architecture](https://final-year-project-documentation-po.vercel.app/methodology/architecture/) page (`public/images/architecture.png`).

```
 I. Behavioural Data        II. Impact Quantification     III. Cooperative Co-Evolutionary      IV. Output and
    Acquisition                 & ATT&CK–D3FEND Mapping        Defense Optimisation (CCEA)          Evaluation
 ┌──────────────────┐       ┌──────────────────────┐      ┌───────────────────────────────┐     ┌────────────────────┐
 │ Malware corpus   │       │ Impact scores        │      │ Population initialisation     │     │ Optimal strategy   │
 │ Validation/dedup │ σ_k → │ A_k ∈ [1,35]         │ P_k, │ Selection & variation  ──► C  │ C*→ │ C*, F*             │
 │ Cuckoo Sandbox   │       │ σ_k → t_k (ATT&CK)   │ A_k  │ Fitness (Reduced_Severity RS) │     │ MSS before / after │
 │ JSON report parse│       │ t_k → mitigation     │ ───► │ Credit assignment             │     │ CCEA vs. greedy    │
 │ Triggered S_h    │       │ → D3FEND pool P_k    │      │ Elitist replacement           │     │ Statistical tests  │
 └──────────────────┘       └──────────────────────┘      │ Termination check ─(no)─┐     │     └────────────────────┘
                                                          └─────────────────────────┴─────┘
```

## 8. Stage I: Behavioural data acquisition

**Dataset construction**

| Step | Detail |
|---|---|
| Collection | ≈ 3,000 samples from VirusShare, VirusTotal and the project guide |
| Validation | VirusTotal information |
| De-duplication | SHA-256 hashing |
| Classification | Available malware-class labels and online AV-engine scanning; every sample keeps its identifier and class label so each report can be traced back to it |
| Behavioral analysis | Cuckoo Sandbox |
| Output | JSON analysis reports |

**Cuckoo Sandbox.** A host machine schedules tasks and collects results. Each sample runs in an isolated guest virtual machine. The analysis moves through five steps: sample submission → task scheduling → sample execution → telemetry collection → analysis completion. Reports are parsed into API, registry, file and network behavior.

**Signature extraction.** Each sample `h` is reduced to its set of triggered signatures `S_h = {σ_1, …, σ_N}`. Each signature keeps the following attributes:

| Attribute | Description |
|---|---|
| Signature ID / name | Identifier and name of the triggered behavioral signature |
| Severity score `V_x` | Cuckoo's own severity value, the input to MAGIC impact scoring (not the same as `A_k`) |
| Mark count | Count of marked events or related metadata, where available |
| Associated APIs | API names linked to the behavior, where available |
| Behavioral evidence | Relevant execution actions or indicators from the report |

## 9. Stage II: Impact quantification and ATT&CK–D3FEND mapping

### Signature impact quantification (MAGIC)

Impact scoring follows the MAGIC method [15] in two passes.

**Pass 1: initial severity assignment.** Each signature is placed into one of four bands, based on its Cuckoo severity `V_x` and how often it occurs in the repository. It is then ranked within that band on the score range **[1, 35]**.

| Band | Category | Typical behavior |
|:---:|---|---|
| B1 | Low | Minor telemetry, non-damaging diagnostics, low-risk probing |
| B2 | Medium | Evasion, persistence, defense modification attempts |
| B3 | High | Unpacking, process hollowing, privilege escalation, disabling security controls |
| B4 | Critical | Mass encryption, shadow-copy deletion, active extortion |

**Pass 2: mutual-information refinement.** This pass uses signature co-occurrence across the repository:
1. Compute the mutual information between signatures.
2. Aggregate it into a weight `W_x` for each signature.
3. Compare `W_x` with a dynamic threshold.
4. Update the score where the threshold condition is met.

The result is the refined impact score **A_k ∈ [1, 35]**.

### ATT&CK technique mapping

Signatures are mapped from the behavior they describe, not merely from an API name or a signature name.

| Signature / behavior | ATT&CK technique | Tactic |
|---|---|---|
| Deleting volume shadow copies to block recovery | T1490 Inhibit System Recovery | Impact |
| Encrypting files to make data inaccessible | T1486 Data Encrypted for Impact | Impact |
| Suspended process → memory unmapped → malicious code → resumed | T1055.012 Process Hollowing | Defense Evasion; Privilege Escalation |

### D3FEND candidate defenses

Each technique is linked to an ATT&CK mitigation. The mitigation leads to a pool `P_k` of D3FEND defensive techniques, and the source of every mapping is recorded.

| Step | Example |
|---|---|
| Signature behavior | Loads code through shared modules |
| ATT&CK technique | T1129 Shared Modules |
| ATT&CK mitigation | M1038 Execution Prevention |
| D3FEND pool `P_k` | D3-EAL Executable Allowlisting, D3-PSEP Process Segment Execution Prevention |

The output of Stage II is the **candidate dataset D**: one row `(h, σ_k, d, A_k)` for every sample, signature and candidate defense. It currently holds **17 samples and 2,823 rows**.

## 10. Stage III: Cooperative co-evolutionary defense optimisation

### Representation

- **Attack side:** fixed to the signatures actually observed for the sample, each with its impact score `A_k`.
- **Defense side:** one sub-population per signature, whose members are the candidate defenses in `P_k`.
- **Candidate solution:** a combination `C = {d_1, …, d_N}` with exactly one defense per signature.

The method is *cooperative* co-evolution because the sub-populations are scored together, through the fitness of the combination they form [17].

### Selection and variation

Each generation builds one candidate combination by choosing a collaborator from every sub-population:
1. **Untried first:** if `P_k` has a defense with usage count `c(d) = 0`, choose it. This guarantees every candidate is evaluated at least once.
2. **Exploration:** otherwise, with probability `p_e = 0.25`, choose a random defense.
3. **Best credited:** otherwise, choose the defense with the highest mean fitness history `H(d)`.
4. **Mutation:** with probability `p_m = 0.20`, swap the choice for a different random defense from the same pool.

Because each combination takes exactly one defense per signature, exploration and mutation replace crossover.

### Reduced_Severity module

The module returns, for every signature–defense pair, `RS(σ_k, d_k) ∈ [0, 10]` and a mitigation label (`FULL`, `PARTIAL` or `NONE`).

| Mode | Source of RS | Used for |
|---|---|---|
| **CSV mode** | A pre-computed RS table, one row per signature–defense pair | Fast, exactly repeatable runs, and the CCEA-vs-greedy comparison |
| **LLM mode** | Gemini 2.5 Flash-Lite (`gemini-2.5-flash-lite`), given structured attack and defense evidence | Pairs not yet in the table, and studies of the LLM's estimates |

In LLM mode the model returns structured JSON, which is validated against a schema before use. The fields are:
- `evaluation_id`, `signature_name`, `defense_name`
- `impact_score`, `residual_severity` (an integer 0–10), `mitigation_label`
- `remaining_attack_capability`, `justification`, `uncertainty_flag`

Estimates are benchmarked with:
- Quadratic Weighted Kappa;
- normalized MAE (MAE / 10);
- exact-match accuracy and Accuracy@±1;
- macro-averaged F1 on the mitigation labels.

### Fitness evaluation

```text
AM_k  = ε + (1 − ε) · (A_k − 1) / (A_max − 1)     normalized impact         ∈ [0.03, 1]
RM_k  = RS_k / RS_max                              normalized reduced sev.   ∈ [0, 1]
IS    = sqrt( (1/N) · Σ_k AM_k² )                  impact severity  (MSS_before)
RA(C) = sqrt( (1/N) · Σ_k RM_k² )                  residual severity (MSS_after for C*)
F(C)  = (IS − RA(C)) / IS                          collaborative fitness
```

`F(C) = 1` means no severity remains. `F(C) = 0` means the defenses leave as much normalized severity as the original impact. The root mean square weights high-severity signatures more heavily than a plain average would.

### Credit assignment, replacement and termination

```text
for each d in C:
    H(d) ← H(d) ∪ { F(C) }     # fitness history
    c(d) ← c(d) + 1             # usage count
```

Elitist replacement keeps the best combination `C*` and its fitness `F*`. A stagnation counter `n` counts the generations without improvement. The search stops when **(every candidate has been covered ∧ n ≥ τ) or g = G_max**.

### Parameters

| Parameter | Symbol | Value |
|---|:---:|---:|
| Random seed | — | 42 |
| Maximum generations | G_max | 100 |
| Exploration probability | p_e | 0.25 |
| Mutation probability | p_m | 0.20 |
| Patience | τ | 20 |
| Minimum improvement | δ | 10⁻⁸ |
| Minimum normalized impact | ε | 0.03 |
| Maximum impact score | A_max | 35 |
| Maximum reduced severity | RS_max | 10 |

## 11. Stage IV: Output and evaluation

**Outputs for each evaluated sample**

| Output | Definition | Purpose |
|---|---|---|
| Optimal defense strategy | `C*`, one D3FEND defense per triggered signature, with fitness `F*` | The recommended defense combination |
| MSS_before | `IS` | The sample's severity with no defenses |
| MSS_after | `RA(C*)` | The severity left with the recommended defenses |
| Fitness `F*` | `(IS − RA(C*)) / IS` | The fraction of severity removed |

**Greedy baseline.** CCEA is compared with a greedy method that uses the same pools `P_k`, the same RS source and the same fitness definition. Because the inputs are identical, any difference comes from the search itself.

**Statistical validation.** Each comparison is paired per sample: CCEA against greedy, and MSS_before against MSS_after.

| Test | Question | Decision rule |
|---|---|---|
| Shapiro–Wilk | Are the paired differences normally distributed? | Normality rejected if p < 0.05 |
| Wilcoxon signed-rank | Do the paired results differ systematically? | Significant if p < 0.05 |

**Further analyses:**
- seed stability;
- convergence over generations;
- how the recommendations change between CSV and LLM mode.

**Case study.** The evaluation includes a case study: HOPLIGHT, the malware associated with the BeagleBoyz / APT38 group, followed through every stage from triggered signatures to `C*` and MSS before and after.

## 12. From Phase 1 to Phase 2

| | Phase 1 design | Phase 2 design (current) |
|---|---|---|
| Attack side | Population of attack plans | Observed signatures with impact score `A_k` (1–35) |
| Defense side | Population of defense plans | One D3FEND candidate pool `P_k` per signature |
| Scoring | Impact evaluation | `RS ∈ [0, 10]` from the Reduced_Severity module, combined into `F(C)` |
| Operators | Selection, crossover, mutation | Untried-first, exploration, best-credited, mutation; credit assignment; elitist replacement |
| Co-evolution | Attack and defense populations evolve against each other | Cooperative: defense pools are scored together |
| Output | Optimal defense strategy | Best combination found, `C*`, with `F*` |
| Evaluation | Not specified | MSS before/after; CCEA vs. greedy; Shapiro–Wilk and Wilcoxon |

## 13. Scope, assumptions and limitations

The framework supports the analysis and selection of defense strategies. It does not replace malware detection, endpoint protection, backups or incident response.

| Area | Main limitations |
|---|---|
| Dataset | Sample size and representativeness, class imbalance, temporal drift, source bias |
| Sandbox | Only behavior observed in the configured run, anti-analysis and evasion, execution time limits, a Windows guest VM only |
| Mapping | ATT&CK technique inference, gaps in ATT&CK–D3FEND coverage, granularity mismatch |
| Residual severity | Depends on input evidence, prompt and model sensitivity, limits of reference labels |
| Optimization | Search-space growth, dependence on seeds, fitness-function assumptions; a recommendation is not a deployment |

All results are limited to the evaluated samples, environment and configuration.

## 14. Future work

- **Broader datasets:** more ransomware families, collection periods and platforms, plus a check of temporal stability.
- **Sandbox coverage:** study how environment, timeouts and anti-evasion measures affect the extracted signatures.
- **Mapping validation:** expert-reviewed benchmark cases and version-pinned ATT&CK and D3FEND tracking.
- **RS reliability:** prompt-sensitivity studies, repeated-run stability, cross-model benchmarks.
- **Stronger baselines:** compare CCEA over many seeds with random, greedy and exhaustive search on small instances.
- **Cross-platform telemetry:** Linux eBPF and the macOS Endpoint Security Framework.
- **Reinforcement learning:** multi-agent RL evaluated against CCEA.
- **Defense orchestration:** connect recommendations to endpoint policy and SDN firewalls, with human-in-the-loop safeguards.

## 15. Key notation

| Symbol | Meaning |
|---|---|
| `h` | A ransomware sample |
| `S_h = {σ_1, …, σ_N}` | Triggered signatures of sample `h` |
| `V_x` | Cuckoo severity of a signature (input to MAGIC) |
| `A_k ∈ [1, 35]` | Impact score of signature `σ_k` |
| `t_k` | ATT&CK technique mapped to `σ_k` |
| `P_k` | Pool of candidate D3FEND defenses for `σ_k` |
| `D` | Candidate dataset of `(h, σ_k, d, A_k)` rows |
| `C = {d_1, …, d_N}` | Candidate defense combination |
| `RS(σ_k, d_k) ∈ [0, 10]` | Reduced severity of `σ_k` under `d_k` |
| `IS`, `RA(C)` | RMS of normalized impact / of normalized reduced severity |
| `F(C)` | Collaborative fitness `(IS − RA) / IS` |
| `H(d)`, `c(d)` | Fitness history and usage count of defense `d` |
| `n`, `τ`, `G_max` | Stagnation counter, patience, generation limit |
| `C*`, `F*` | Best combination found and its fitness |

## 16. References

1. CISA, *#StopRansomware Guide*, Sept. 2023.
2. M. Egele, T. Scholte, E. Kirda and C. Kruegel, "A survey on automated dynamic malware-analysis techniques and tools," *ACM Computing Surveys*, 44(2), 2012.
3. B. A. S. Al-Rimy, M. A. Maarof and S. Z. M. Shaid, "Crypto-ransomware early detection model using novel incremental bagging with enhanced semi-random subspace selection," *Future Generation Computer Systems*, 101, 2019.
4. G. Ramesh and A. Menen, "Automated dynamic approach for detecting ransomware using finite-state machine," *Decision Support Systems*, 138, 2020.
5. H. Hu, Y. Liu, C. Chen, H. Zhang and Y. Liu, "Optimal decision making approach for cyber security defense using evolutionary game," *IEEE TNSM*, 17(3), 2020.
6. U. Urooj, M. A. B. Maarof and B. A. S. Al-Rimy, "A proposed adaptive pre-encryption crypto-ransomware early detection model," *CRC 2021*.
7. K. Albulayhi and Q. A. Al-Haija, "Early-stage malware and ransomware forecasting in the short-term future using regression-based neural network technique," *CICN 2022*.
8. M. U. Rehman, R. Akbar, M. Omar and A. R. Gilal, "A systematic literature review of ransomware detection methods and tools for mitigating potential attacks," Springer, 2023.
9. T. M. H. Mohamed, B. A. S. Al-Rimy and S. A. Almalki, "A ransomware early detection model based on an enhanced joint mutual information feature selection method," *ETASR*, 14(4), 2024.
10. M. Gazzan and F. T. Sheldon, "An incremental mutual information-selection technique for early ransomware detection," *Information*, 15(4), 2024.
11. S. Gulmez, A. Gorgulu Kakisim and I. Sogukpinar, "XRan: Explainable deep learning-based ransomware detection using dynamic analysis," *Computers & Security*, 139, 2024.
12. J. Lee, J. Kim, H. Jeong and K. Lee, "A machine learning-based ransomware detection method for attackers' neutralization techniques using format-preserving encryption," *Sensors*, 25(8), 2025.
13. B. E. Strom et al., "MITRE ATT&CK: Design and philosophy," The MITRE Corporation, 2020.
14. P. E. Kaloroumakis and M. J. Smith, "Toward a knowledge graph of cybersecurity countermeasures," The MITRE Corporation, 2021.
15. S. Rohini, G. Ramesh and A. R. Nair, "MAGIC: Malware behaviour analysis and impact quantification through signature co-occurrence and regression," *Computers & Security*, 139, 2024.
16. T. Bartz-Beielstein, J. Branke, J. Mehnen and O. Mersmann, "Evolutionary algorithms," *WIREs Data Mining and Knowledge Discovery*, 4, 2014.
17. X. Ma et al., "A survey on cooperative co-evolutionary algorithms," *IEEE Transactions on Evolutionary Computation*, 23(3), 2019.
18. N. O. Jaffal, M. Alkhanafseh and D. Mohaisen, "Large language models in cybersecurity: A survey of applications, vulnerabilities, and defense techniques," *AI*, 6(9), 2025.
19. A. Walker, M. F. Amjad and S. Sengupta, "Cuckoo's malware threat scoring and classification: Friend or foe?," *IEEE CCWC*, 2019.

The full list, including technical resources TR-1 to TR-5, is on the [References](https://final-year-project-documentation-po.vercel.app/resources/references/) page.

---

# Part II: The documentation site

## 17. Site map

The site has a home page and 19 documentation pages in five groups.

| Group | Pages (`src/content/docs/…`) |
|---|---|
| **A · Project Overview** | `overview/introduction` · `overview/problem-objectives` · `overview/utility-security` |
| **B · Related Work & Research Gap** | `research/literature-review` · `research/gap-contributions` |
| **C · System & Methodology** | `methodology/evolution` · `methodology/architecture` · `methodology/cuckoo-sandbox` · `methodology/dataset` · `methodology/signature-extraction` · `methodology/impact-quantification` · `methodology/attack-mapping` · `methodology/d3fend-mapping` · `methodology/residual-severity` · `methodology/ccea` |
| **D · Evaluation** | `evaluation/evaluation-plan` |
| **E · Discussion & Resources** | `resources/limitations-future-work` · `resources/references` · `resources/project-team` |

## 18. Technology

| Layer | Tool |
|---|---|
| Static site framework | [Astro](https://astro.build) 7 |
| Documentation theme | [Starlight](https://starlight.astro.build) 0.42 |
| Content | MDX (Markdown with components) |
| Search | [Pagefind](https://pagefind.app) (static, client-side) |
| Images | `sharp` for build-time optimization |
| Hosting | [Vercel](https://vercel.com) |

## 19. Repository structure

```
.
├── astro.config.mjs          # Site config: title, logo, sidebar, component overrides, GitHub link
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

| Component | Purpose |
|---|---|
| `AcademicCover.astro` | Home page: title, project details, key facts, architecture, stages, groups, team |
| `PageTitle.astro` | Page heading with a group label (overrides `PageTitle`) |
| `ThemeSwitch.astro` | Light / Dark / Auto segmented control (overrides `ThemeSelect`) |
| `ThemeProvider.astro` | Applies the saved theme before first paint; light by default |
| `Search.astro` | Header search field and Pagefind dialog |
| `CustomFooter.astro` | Footer with institution, academic details and source-code link |
| `WorkflowDiagram.astro` | Figure frame with title, status and caption |
| `DataTable`, `MetricCard`, `SectionCard`, `StatusBadge`, `PageIntro`, `ReferenceItem`, `FigurePlaceholder` | Content building blocks used in the MDX pages |

## 20. Design system

- **Light (default):** a cool paper background, a deep teal primary accent and violet secondary accent, with a color for each group.
- **Dark:** a Swiss-poster style with a black background, white type and a single red-orange accent (`#FF4D21`).
- **Auto:** follows the operating-system setting.

**How themes and styles work:**
- **Saved theme:** the choice is stored in `localStorage` (`starlight-theme`) and applied before first paint.
- **Colors:** every color is a CSS custom property defined once per theme at the top of `src/styles/custom.css`.
- **Typography:** all text uses Helvetica. The installed Helvetica Neue or Helvetica is used when available; otherwise the site loads the self-hosted TeX Gyre Heros, a Helvetica-metric typeface.
- **Architecture diagram:** `architecture.png` is shown in the light theme and `architecture-dark.png` in the dark theme. The content is identical; only the colors differ.

## 21. Getting started

**Requirements:** Node.js 22.23+ and npm 9.6+.

```bash
git clone https://github.com/parvathy2907/DEFENSIQ.git
cd DEFENSIQ
npm install
npm run dev        # http://localhost:4321
```

| Command | Action |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build into `dist/` and regenerate the Pagefind index |
| `npm run preview` | Serve the production build locally |

## 22. Writing and editing content

- **Edit a page:** every page is an `.mdx` file in `src/content/docs/` with `title` and `description` front matter.
- **Add a page:**
  1. Create the file in the folder for its group.
  2. Add `{ label, slug }` to the matching `sidebar` group in `astro.config.mjs`.
  3. Run `npm run build`.
- **References:**
  - One master list, numbered in order of first citation, with technical resources labelled TR-1 to TR-5.
  - Reuse the same number on every page that cites a source.
- **Images:**
  - Put files in `public/images/` and reference them as `/images/<file>`.
  - For diagrams that need a dark version, use the `img-light` / `img-dark` pair inside a `.dq-diagram` figure.

## 23. Search

Pagefind indexes every page during `npm run build` and writes the index to `public/pagefind/`, so search also works in the development server. Rebuild after content changes.

## 24. Deployment

The site deploys on Vercel from `main`:
- **Framework preset:** Astro.
- **Build command:** `npm run build`.
- **Output directory:** `dist`.

Every push to `main` triggers a production deployment. If the domain changes, update `site` in `astro.config.mjs`.

## 25. Third-party assets

- **TeX Gyre Heros:** © GUST e-foundry, GUST Font License (`public/fonts/LICENSE-TeX-Gyre-Heros.txt`).
- **MITRE ATT&CK® and MITRE D3FEND™:** trademarks of The MITRE Corporation. Their identifiers are used for reference.
- **Amrita Vishwa Vidyapeetham logo:** belongs to the university and is used to identify the institution.

---

<div align="center">
Team 42 · Department of Computer Science and Engineering · Amrita Vishwa Vidyapeetham, Coimbatore
</div>
