# Shega Generations

Next.js 14 App Router platform for Shega Generations, backed by Sanity CMS.
Light mode, procedural tibeb-pattern SVGs (no raster imagery required for
the design system itself), horizontal scroll-snap rails, and reveal-on-scroll
animation via Framer Motion.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; pages work with none of it set
npm run dev
```

Every page renders fully with placeholder content (`lib/demoData.ts`) even
with zero environment variables set. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`
and `NEXT_PUBLIC_SANITY_DATASET` once your Sanity project exists, and real
content will replace the placeholders automatically, field for field.

Sanity Studio is embedded at `/studio` once you run `sanity dev` or deploy
the studio (see `sanity.config.ts`). Content editors add real images there;
no code changes needed on the frontend.

## What is real vs. stubbed here

**Real, production-track:**
- All Sanity schemas (including `donationRecord`), App Router pages, GROQ queries, the onboarding API (`/api/onboarding/apply`), and payment processing endpoints (`/api/payments/initialize`, `/api/payments/verify`, `/api/payments/webhook`) with Zod validation, rate limiting, honeypot protection, and write-scoped Sanity client.
- The donation portal (`/donate`) supports both local Ethiopian payments (**Chapa**, covering Telebirr, CBE Birr, cards) and global payments (**Stripe**). When live provider keys (`CHAPA_SECRET_KEY`, `STRIPE_SECRET_KEY`) are set in `.env`, transactions route directly to live payment rails; when absent, an interactive Sandbox Simulation mode processes payments end-to-end for testing.
- The Tibeb pattern system, horizontal rails, countdown card, and gallery filter are fully functional.

**External Provider Configurations:**
- Email sending uses Resend (`lib/email.ts`).
- Rate limiting uses Upstash Redis (`lib/rateLimit.ts`).
- Local ETB Payments use Chapa (`lib/chapa.ts`).
- Global USD Payments use Stripe (`lib/stripe.ts`).

## Security model, specifically

1. **Two Sanity clients, never one.** `sanity/lib/client.ts` is
   CDN-cached, read-only, and safe to import anywhere, including client
   components. `sanity/lib/writeClient.ts` is marked `server-only` and
   uses a token scoped in the Sanity dashboard to `create` on
   `studentApplication` alone. If that token leaks, the blast radius is
   "someone can create fake applications," not "someone can rewrite your
   homepage."
2. **Server-side validation is the actual boundary.** The Zod schema in
   the API route is authoritative. Anything the browser sends is
   re-validated field by field: region and interest are enums, not free
   text, phone numbers are pattern-checked, and string lengths are capped
   to stop payload-size abuse.
3. **Rate limiting fails closed in production.** If Upstash isn't
   configured, the endpoint refuses all requests rather than silently
   accepting unlimited traffic. It only fails open in
   `NODE_ENV=development` so you can test the form locally.
4. **A honeypot field (`website`) catches indiscriminate bots** that fill
   every input on a form without reading the DOM. Real applicants never
   see or fill it; it's visually hidden, not just empty by default.
5. **Security headers** (`next.config.js`) block MIME sniffing, disallow
   framing, and restrict `Permissions-Policy` on camera/mic/geolocation
   platform-wide.

## Scalability notes

- All read paths use Sanity's CDN (`useCdn: true`), so page loads don't
  hit origin on every request.
- Horizontal rails and the gallery grid do client-side filtering only on
  data already fetched server-side; there's no N+1 fetch pattern as
  content grows. If the gallery exceeds a few hundred items, paginate the
  GROQ query in `sanity/lib/queries.ts` before it becomes a payload
  problem.
- The onboarding API is stateless and horizontally scalable as-is; the
  only shared state is the Upstash rate limit counter, which is designed
  for exactly this.

## Honest gaps you still need to close

- No admin auth review flow described for `assessmentStatus` beyond
  Sanity Studio's own role permissions, if you need a dedicated review
  dashboard outside Studio, that's a separate build.
- No i18n routing yet; `preferredLocale` is captured and used for the
  email only. If you want the site itself in Amharic, that's a
  `next-intl` integration, a different scope than what was asked for here.
