# TARA — prototype frontend

React + Vite. This is a **look-and-feel prototype**: the layout, the flow and the copy are
real, but every number is a placeholder. No pricing, no EPR model, no spec engine yet.

```bash
npm install
npm run dev      # http://localhost:5173
```

## Pages

| Route | What it shows |
|---|---|
| `/` | Simple landing — sign in / register |
| `/login` | Mock B2B sign-in (demo: `demo@tara.md` / `demo123`) |
| `/register` | Mock company registration — stored in this browser only |
| `/dashboard` | Buyer overview — main statistics (**auth required**) |
| `/dashboard/orders` | Full order list |
| `/dashboard/info` | Packaging disclosure + context |
| `/dashboard/settings` | Account preferences |
| `/configure` | Material → form → finish → run → review (**auth required**) |
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
