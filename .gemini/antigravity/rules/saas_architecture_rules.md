# Rules & Business Architecture for Altus Studio (Vertical Agent SaaS)

This document contains the strict product and business rules for the **Altus Studio SaaS Platform** (`saas-app/`).

## 1. Zero Financial Risk Policy (Prepaid Billing Only)
- **Rule:** The system MUST NEVER trigger paid API calls (Kling AI / Veo 3 / MiniMax) without pre-verified user credit balance or active Stripe subscription.
- **Rule:** Credit allocation is strictly capped per plan tier (e.g. Starter 10 videos/mo, Pro 35 videos/mo).
- **Rule:** Free seconds/unlimited generation controls are strictly forbidden to prevent API cost overruns.

## 2. API Selection & Rendering Specs
- **Primary Video Engine:** Kling AI / MiniMax Hailuo (~$0.03/sec) for high-volume Image-to-Video generation.
- **Secondary Video Engine:** Google Veo 3 via AI Studio API for ultra-high-definition exports.
- **Video Standard:** 15-second property walk-throughs composed of 3 cinematic 5-second clips.

## 3. UI/UX Design Standards (Estilo Vercel / Linear / Claude)
- **Palette:** Dark background `#0a0a0c`, subtle borders `rgba(255,255,255,0.08)`, gold/brass accents `#d4af37`.
- **Typography:** Modern Google Fonts (Inter / Outfit / Plus Jakarta Sans).
- **Components:** Glassmorphism, smooth CSS micro-animations, real-time skeleton loaders during video rendering.
- **Mobile First:** Fully responsive video player and studio controls.

## 4. Specialized SaaS Agent Roles
When working on `saas-app/`, delegate or adopt these roles:
- **`saas_product_designer`**: Enforces UI/UX design standards and real-time studio layout.
- **`saas_billing_engineer`**: Enforces Stripe subscriptions, credit usage meters, and prepaid security.
- **`saas_video_api_integrator`**: Manages HTTP rendering webhooks, video queue processing, and cloud storage links.
