# Loopdesk AI — website

Marketing site for **Loopdesk AI**, the AI front desk + growth manager for Canadian local businesses, by Wayne E Solutions.

The whole site is one self-contained file: `index.html` (HTML, CSS and JS inline; fonts load from Google Fonts). No build step.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Any static host works: Vercel, Netlify, GitHub Pages, S3/CloudFront or Nginx on EC2. Point the domain (`loopdesk.ca` / `loopdeskai.com`) at it.

## Before going live

1. **Trial form.** The form currently tries to save through the Claude artifact database (`window.claude`), which does not exist on a normal host. On a hosted site it shows a "copy your details" fallback instead of saving. Connect it to a real endpoint (backend API, Formspree/email, Google Sheet or WhatsApp) in the `form.addEventListener("submit", ...)` block near the end of `index.html`. The hidden `#admin` table section only works inside the artifact and can be removed.
2. **Demo line.** Set `DEMO_NUMBER` in the script (e.g. `"+1 (437) 555-0199"`) once the demo number is live. The "Hear the demo line" button and trial text update automatically.

## Content to keep in sync

Plans and prices (C$149 / C$249 / C$549, setup C$299, overage C$0.75 per call and C$0.05 per text) appear in the plans section, the trial form plan dropdown and the FAQ.
