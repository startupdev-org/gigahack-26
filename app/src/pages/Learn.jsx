import Shell from '../components/Shell.jsx';
import { TIPS } from '../data.js';

/* Not a tutorials tab. Six things people get wrong, and why — the rest of
   the teaching happens at the moment of the decision, on the scan page. */
export default function Learn(){
  return (
    <Shell tagline="Six things worth unlearning">
      <main className="page">
        <div>
          <div className="eyebrow">Learn</div>
          <h1 style={{ marginTop:10 }}>Most sorting advice is out of date.</h1>
        </div>
        <p className="lede">
          These are the six questions that change what someone actually does. Everything else
          is explained where it matters — next to the item being thrown away.
        </p>
        <div className="cards">
          {TIPS.map(t => (
            <div className="card tip" key={t.q}>
              <span className="tag">{t.tag}</span>
              <q>{t.q}</q>
              <p>{t.a}</p>
            </div>
          ))}
        </div>
      </main>
    </Shell>
  );
}
