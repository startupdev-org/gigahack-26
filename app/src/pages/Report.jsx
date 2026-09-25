import Shell from '../components/Shell.jsx';
import { COMPANY } from '../data.js';

/* Deliberately not a certificate. A self-issued sustainability label is
   worth nothing and, under EU Directive 2024/825, is not even allowed.
   What Moldova is missing is an audited denominator — so we publish the
   numbers and say where each one came from. */
export default function Report(){
  return (
    <Shell tagline="Declared, and where it came from"
           meta={{ k:'Reporting period', v:COMPANY.period }}>
      <main className="page">
        <div>
          <div className="eyebrow">Verified disclosure · not a certificate</div>
          <h1 style={{ marginTop:10 }}>{COMPANY.name}</h1>
        </div>
        <p className="lede">
          We do not award a badge. We publish what this company placed on the market, how much
          came back, and which part of that we can evidence from primary order data rather
          than a self-declaration.
        </p>

        <div className="cards">
          {COMPANY.deltas.map(d => (
            <div className="card" key={d.k}>
              <div className="eyebrow">{d.k}</div>
              <div className="v num" style={{ fontSize:32, fontWeight:800, letterSpacing:'-.035em' }}>{d.v}</div>
              <p>{d.s}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="eyebrow">Recovery against the national target</div>
          <p style={{ marginBottom:6 }}>
            The bar is what came back. The upright line is the Moldovan target for that stream.
            Progress against last year is the number that counts — a 100% threshold nobody
            reaches would reward only the companies that were already small and already clean.
          </p>
          {COMPANY.streams.map(s => (
            <div className="stream" key={s.material}>
              <div className="row">
                <b>{s.material}</b>
                <span className="n">{s.achieved}% recovered · target {s.target}%</span>
              </div>
              <div className="bar">
                <i style={{ width:Math.min(100, s.achieved) + '%',
                            background:s.achieved >= s.target ? '#3F7A4F' : 'var(--accent)' }} />
                <span className="tgt" style={{ left:Math.min(100, s.target) + '%' }} />
              </div>
              <div className="foot">{s.declared}% of this company's tonnage placed on the market</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="eyebrow">Basis</div>
          <p>
            {COMPANY.verified}. Where a pack was configured through TARA we know its material and
            gram weight exactly, so its contribution is measured. The remaining SKUs are the
            company's own declaration and are marked as such — which is the whole difference,
            because in 2024 Moldovan producers declared 24,474 t of plastic against an estimated
            52,610 t actually placed on the market.
          </p>
          <p className="fine">
            Prototype. The figures on this page are placeholders; the methodology is the point.
          </p>
        </div>
      </main>
    </Shell>
  );
}
