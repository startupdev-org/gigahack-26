import { Link } from 'react-router-dom';
import Shell from '../components/Shell.jsx';

/* One object seen from four sides. The pack's passport is created in the
   configurator, read by whoever throws it away, and totalled in the report. */
const SURFACES = [
  { n:'01', t:'Specify the pack', p:'Material, form, finish and run — with the illegal combinations refused at design time rather than discovered at audit.', to:'/configure', cta:'Open the configurator' },
  { n:'02', t:'Get it reviewed',  p:'An automated pass over the finished specification returns quantified changes, not advice. It hands the revision straight back to the configurator.', to:'/configure', cta:'See a review' },
  { n:'03', t:'Take it back',     p:'The pack carries a code. Scanned at end of life it says exactly where this item goes in this city — and refuses the ones the deposit system already handles.', to:'/take-back', cta:'Try a scan' },
  { n:'04', t:'Report the totals',p:'Every pack ordered here is a known weight of a known material, so the annual figure is measured rather than estimated.', to:'/report', cta:'View a report' }
];

export default function Home(){
  return (
    <Shell tagline="Packaging, specified">
      <main className="page hero">
        <div>
          <div className="eyebrow">Republic of Moldova</div>
          <h1 style={{ marginTop:10 }}>Packaging that is specified once and accounted for twice.</h1>
        </div>
        <p className="lede">
          A company configures a pack here, so we know its exact material and weight. The
          consumer scans that same pack when it is empty. The company's yearly declaration is
          then a sum of real orders instead of an estimate nobody audits.
        </p>

        <div className="figures">
          <Fig v="52,610 t" k="Plastic packaging put on the Moldovan market in 2024" />
          <Fig v="24,474 t" k="…and the amount producers actually declared" />
          <Fig v="6%" k="Real plastic recovery rate, against a reported 12.7%" />
          <Fig v="2027" k="When the 2-lei deposit system starts, covering beverages only" />
        </div>
        <p className="fine">
          Figures from the UNDP study on packaging waste management in the Republic of Moldova,
          May 2026, and HG 379/2025. Everything else in this prototype is placeholder content.
        </p>

        <div className="flow">
          {SURFACES.map(s => (
            <div className="node" key={s.n}>
              <span className="n">{s.n}</span>
              <b>{s.t}</b>
              <p>{s.p}</p>
              <Link to={s.to}>{s.cta} →</Link>
            </div>
          ))}
        </div>
      </main>
    </Shell>
  );
}

function Fig({ v, k }){
  return <div className="figure"><div className="v">{v}</div><div className="k">{k}</div></div>;
}
