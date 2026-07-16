# Minds Aligned — the door

The public front door for Minds Aligned: manifesto landing page, SOMA Auth
sign-in (magic link + Google), a waitlist, and a one-time acknowledgment
email. Nothing else — the product lives behind a separate gate, later.

Live: https://minds-aligned-door.netlify.app

## What this is (and isn't)

- **Is:** landing page ("The artifacts are the evidence."), sign-in,
  "Noted. You're on the list." page, `ma_waitlist` row per signup,
  one acknowledgment email per person.
- **Isn't:** a dashboard, a product, or a newsletter machine. The three
  promises on the landing page are the product spec.

## Stack

- Next.js 14 (App Router) + `@supabase/ssr` — **server-side** session gating
  via `middleware.ts` (the old door's client-only gate was a hole; this one
  checks the JWT on the server).
- SOMA Auth: shared Supabase project `omfwcodoimjmbrhssvfl`, magic link +
  Google OAuth. OTP metadata `site_name: "Minds Aligned"`.
- Waitlist: `public.ma_waitlist` (RLS: each user can only touch their own
  row). Upserted server-side on first authenticated visit.
- Acknowledgment email: Resend HTTP API from `lib/acknowledge.ts`.
  **TODO(resend-key):** stubbed until `RESEND_API_KEY` is set in Netlify env
  (the estate's key lives encrypted in Supabase SMTP settings and can't be
  read back). Rows written while stubbed have `acknowledged_at IS NULL` —
  backfill by querying those and calling the sender once the key lands.
- soma-feedback chip vendored at `public/vendor/soma-feedback/`,
  `data-site="minds-aligned"`.

## Env

| var | purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | shared SOMA Auth project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (public by design) |
| `RESEND_API_KEY` | acknowledgment email (optional; stub without it) |
| `ACK_FROM_EMAIL` | sender, default `Minds Aligned <legends@mike-wolf.com>` |

## Dev

```
npm install
npm run dev   # :3500
```

## Deploy

Netlify (`@netlify/plugin-nextjs`), site `minds-aligned-door`. After deploy:

```
python3 ~/Projects/SOMA/tools/ship/soma-ship-check.py https://minds-aligned-door.netlify.app --fix
```

## Provenance

Built 2026-07-16 by Dee (Claude, Fable 5) on Mike's approval; landing copy is
Drew's approved draft, verbatim. Replaces the INTOO-flavored momentum-demo
landing as the public front door (Momentum/Meridian naming and INTOO visual
identity are banned here). The separate `eldrgeek/minds-aligned` repo
(minds-aligned-soma.netlify.app) is the earlier hub experiment — different
artifact, untouched.
