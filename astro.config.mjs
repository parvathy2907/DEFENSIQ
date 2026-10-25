// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://final-year-project-documentation-po.vercel.app',
  integrations: [
    starlight({
      title: 'DEFENSIQ',
      description: 'An Evolutionary Framework for Ransomware Defense Optimization — Team 42, Department of Computer Science and Engineering, Amrita Vishwa Vidyapeetham, Coimbatore.',
      logo: {
        dark: './src/assets/logo-dark.svg',
        light: './src/assets/logo-light.svg',
        alt: 'DEFENSIQ shield logo',
      },
      social: [
        { icon: 'github', label: 'Source code on GitHub', href: 'https://github.com/parvathy2907/DEFENSIQ' },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#EEF3F8' } },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/CustomFooter.astro',
        Search: './src/components/Search.astro',
        ThemeSelect: './src/components/ThemeSwitch.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        PageTitle: './src/components/PageTitle.astro',
      },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: 'A · Project Overview',
          items: [
            { label: 'Project Home', link: '/' },
            { label: 'Introduction & Background', slug: 'overview/introduction' },
            { label: 'Problem Statement & Objectives', slug: 'overview/problem-objectives' },
            { label: 'Utility & Security Problems', slug: 'overview/utility-security' },
          ],
        },
        {
          label: 'B · Related Work & Research Gap',
          items: [
            { label: 'Literature Review', slug: 'research/literature-review' },
            { label: 'Research Gap & Contributions', slug: 'research/gap-contributions' },
          ],
        },
        {
          label: 'C · System & Methodology',
          items: [
            { label: 'Phase 1 → Phase 2', slug: 'methodology/evolution' },
            { label: 'System Architecture', slug: 'methodology/architecture' },
            { label: 'Cuckoo Sandbox & Malware Analysis', slug: 'methodology/cuckoo-sandbox' },
            { label: 'Dataset Construction', slug: 'methodology/dataset' },
            { label: 'Behavioral Signature Extraction', slug: 'methodology/signature-extraction' },
            { label: 'Signature Impact Quantification', slug: 'methodology/impact-quantification' },
            { label: 'MITRE ATT&CK Mapping', slug: 'methodology/attack-mapping' },
            { label: 'MITRE D3FEND Mapping', slug: 'methodology/d3fend-mapping' },
            { label: 'Reduced Severity (CSV / LLM)', slug: 'methodology/residual-severity' },
            { label: 'Cooperative Co-Evolutionary Algorithm', slug: 'methodology/ccea' },
          ],
        },
        {
          label: 'D · Evaluation',
          items: [
            { label: 'Evaluation Methodology', slug: 'evaluation/evaluation-plan' },
          ],
        },
        {
          label: 'E · Discussion & Resources',
          items: [
            { label: 'Limitations & Future Work', slug: 'resources/limitations-future-work' },
            { label: 'References & Technical Resources', slug: 'resources/references' },
            { label: 'Team & Project Information', slug: 'resources/project-team' },
          ],
        },
      ],
    }),
  ],
});
