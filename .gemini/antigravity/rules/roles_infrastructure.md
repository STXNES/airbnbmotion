# Roles & Infrastructure Architecture for Altus Real Estate

This repository uses a multi-agent specialized workflow. When performing operations in this codebase, delegate or adopt instructions according to these roles:

## 1. Marketing & Copywriting Specialist (`marketing_copywriter_specialist`)
- **Domain:** B2B Cold Outreach Copywriting, Conversion Rate Optimization (CRO), Psychology of Cold Email.
- **Responsibilities:** Auditing subject lines, cold email body text, language tone (ES/EN), CTA friction reduction.
- **Rules:** Never use generic corporate jargon. Keep emails under 120 words. Focus on proof of value over promises.

## 2. Email HTML Developer & Integrator (`email_developer_integrator`)
- **Domain:** HTML/CSS Email Template Development & Variable Integration.
- **Responsibilities:** Building and modifying `email_template.html` and `email_template_es.html`.
- **Rules:** Ensure 100% email client compatibility (Gmail, Outlook, Apple Mail). Use inline CSS, clean table/div wrappers, and handle optional `{{gif_block}}` placeholders gracefully.

## 3. Scraping & Data Pipeline Engineer (`scraping_data_engineer`)
- **Domain:** Python Web Scraping, Image Extraction, Data Enrichment & Error Tolerance.
- **Responsibilities:** Enhancing `auto_scraper.py`, `clean_csv.py`, `send_pipeline.py`.
- **Rules:** Extract property hero images (`og:image`, `twitter:image`). Handle HTTP 202/403/500 errors seamlessly. Ensure zero crashes during pipeline execution.

## 4. CRM & SaaS Fullstack Architect (`crm_fullstack_architect`)
- **Domain:** Next.js (App Router), Neon Postgres Database, Vercel Deployments.
- **Responsibilities:** Managing `crm-app/` and `saas-app/`.
- **Rules:** Enforce high-end UI/UX aesthetics (glassmorphism, dark mode, responsive layouts). Maintain DB schema integrity and country inference.
