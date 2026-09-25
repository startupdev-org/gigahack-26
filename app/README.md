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
| `/` | The idea in one screen — one pack's passport, seen from four sides |
| `/configure` | Material → form → finish → run → review. Illegal combinations are refused with a reason |
| `/take-back` | Scan an item, get a verdict, fill the cup. Deposit items are deliberately sent away |
| `/learn` | Six counterintuitive things, instead of a tutorials tab nobody opens |
| `/report` | A company's verified disclosure — explicitly not a certificate |

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
