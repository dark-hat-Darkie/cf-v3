---
name: launch-readiness-caveats
description: Launch state of the codeflee marketing site — domain assumption, unverified case-study content, and required production env vars.
metadata:
  type: project
---

Launch-readiness pass done 2026-06-01 on the cf-v3 (CodeFlee) marketing site.

- **Domain**: assumed production domain is `https://codeflee.com` (inferred from `hello@codeflee.com` + unsubscribe copy). Used as the fallback in code (layout metadataBase, robots, sitemap, blog, cron). NOT confirmed by the user — verify before launch.
- **Production env vars must be set in Vercel** (empty in local `.env.local`): `SITE_URL`, `SITE_NAME`, `BLOB_READ_WRITE_TOKEN` (admin media uploads), `CRON_SECRET` (now the required auth path for `/api/cron/publish-scheduled`), `ADMIN_*` (admin bootstrap), and `RESEND_API_KEY` (required for the contact form to send — see below).
- **Contact form now sends real email** (wired 2026-06-03). `components/Contact.tsx` calls server action `submitContactAction` in `app/actions/contact.ts`, which uses the Resend REST helper `lib/email/send.server.ts` (no SDK dep), validated by `lib/validation/contact.ts`. Has a honeypot (`company` field) + zod validation; `reply_to` = submitter email. Target is `CONTACT_TO_EMAIL` (default `shakil.cse19@gmail.com`); sender is `CONTACT_FROM_EMAIL` (default `onboarding@resend.dev` = Resend test mode, only delivers to the Resend account owner). **For production: set `RESEND_API_KEY` and switch `CONTACT_FROM_EMAIL` to a verified-domain sender** (e.g. `"CodeFlee <hello@codeflee.com>"`). Without `RESEND_API_KEY` the form shows a friendly error and logs server-side.
- **Unverified case-study content** in `lib/case-studies-data.ts`: hero stats, outcome metrics, testimonials, years, live URLs, and tech stacks are owner-drafted **first drafts**, not verified facts (factwatch/flipper/tripking show invented-looking numbers; testimonials attributed to generic roles). The broken `TODO(owner)`/`—` placeholders were stripped and the scoreboard hides when a study has no real metrics (iqqra), but the plausible-looking drafts remain — an integrity risk the owner must confirm or remove before going live.
