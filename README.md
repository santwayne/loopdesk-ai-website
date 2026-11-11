# Loopdesk AI — website

Marketing site for **Loopdesk AI**, the AI front desk + growth manager for Canadian local businesses, by Wayne E Solutions.

Plain static HTML, CSS and JS. No build step, no framework.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| How it works | `how-it-works.html` |
| AI Growth Manager | `growth-manager.html` |
| Features | `features.html` |
| Pricing | `pricing.html` |
| Industries | `industries.html` |
| FAQ | `faq.html` |
| Free trial form | `free-trial.html` |
| Demo line | `demo.html` |
| About | `about.html` |
| Team | `team.html` |
| Contact form | `contact.html` |
| Thank you (after a form) | `thank-you.html` |
| Privacy / Terms | `privacy.html`, `terms.html` |
| Not found | `404.html` |

Shared files live in `assets/`: `styles.css`, `site.js`, the logo (`logo.png`, `logo-small.png`) and icons (`favicon.png`, `apple-touch-icon.png`, `icon-512.png`).

## Run locally

```bash
npx serve .
```

Then open http://localhost:3000.

## Deploy

Any static host works: Vercel, Netlify, GitHub Pages, S3/CloudFront or Nginx on EC2. Point the domain (`loopdesk.ca` / `loopdeskai.com`) at it. Set `404.html` as the not-found page if the host asks.

## Settings (top of `assets/site.js`)

- **`LEAD_ENDPOINT`**: where the trial and contact forms send submissions (JSON POST). **Empty for now.** Until it is set, visitors still see the thank-you page, but their details are not sent anywhere. Set it to a Formspree URL, your backend or another endpoint once the lead email is ready.
- **`DEMO_NUMBER`**: the live demo line, e.g. `"+1 (437) 555-0199"`. When set, the demo page shows a tap-to-call number instead of the "request the demo line" message.

## Editing

The header and footer are repeated in every page. If you change a nav link or footer link, change it in every `.html` file.

Plans and prices (C$149 / C$249 / C$549, setup C$299, overage C$0.75 per call and C$0.05 per text) appear on the home page, the pricing page, the free-trial plan dropdown, the FAQ and the terms page.
