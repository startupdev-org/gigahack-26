# TARA — prototype frontend

React + Vite. This is a **look-and-feel prototype**: the layout, the flow and the copy are
real, but every number is a placeholder. No pricing, no EPR model, no spec engine yet.

```bash
npm install
cp .env.example .env   # add your Supabase URL + anon key
# Run supabase/schema.sql once in the Supabase SQL Editor
npm run dev            # http://localhost:5173
```

## Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. **Project Settings → API** — copy Project URL and `anon` `public` key into `app/.env`
3. **SQL Editor** — paste and run `supabase/schema.sql` (creates `profiles`, `orders`, RLS, signup trigger)
4. **Authentication → Providers → Email** — keep email sign-in and sign-up enabled. With “Confirm email” on, registration shows a check-your-inbox screen; with it off, registration signs the user in immediately.
5. If confirmation is on, set **Authentication → URL Configuration → Site URL** to the app URL so confirmation links return to the app.
6. Restart `npm run dev`, then register an account

If `orders` already exists but `profiles` is missing, run only
`supabase/ensure_profiles.sql` in the SQL Editor. It creates the profile table,
signup trigger, and missing profile rows for existing accounts.

Auth, profiles and orders all go through Supabase. Packaging content in `src/data.js` stays mock.

## Pages

| Route | What it shows |
|---|---|
| `/` | Simple landing — sign in / register |
| `/login` | Supabase email/password sign-in |
| `/register` | Create buyer account + profile |
| `/dashboard` | Buyer overview — main statistics (**auth required**) |
| `/dashboard/orders` | Orders from Supabase |
| `/dashboard/info` | Packaging disclosure + context |
| `/dashboard/settings` | Profile saved to Supabase |
| `/builder` | Product builder — place order writes to Supabase |
| `/take-back` | Consumer scan tool (linked from Information) |
| `/learn` | Six counterintuitive sorting tips |
| `/report` | Full company disclosure page |

## Where the content comes from

All mock content lives in `src/data.js`. The Moldovan figures quoted on `/` and `/report`
are real and sourced from the UNDP *Study on Packaging Waste Management in the Republic of
Moldova* (May 2026) and HG 379/2025 (deposit system, 2 lei, live 2027). Everything else —
prices, lead times, the company's own numbers — is invented and marked as such in the UI.

## Still to build

- The spec engine: gram weight, recycled content, recyclability grade, packaging tax
- Pricing, minimum order quantity and real lead times
- The passport object that links the three surfaces together
- Wiring the automated review to the rules engine rather than to fixed text

The earlier static prototype is still at `../index.html` and `../take-back.html`.
