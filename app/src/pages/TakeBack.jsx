import { useEffect, useState } from 'react';
import Shell, { Arrow, BigWord } from '../components/Shell.jsx';
import Product, { applyTones } from '../components/Product.jsx';
import { ITEMS, VERDICTS, BINS, CITIES, GOAL } from '../data.js';

export default function TakeBack(){
  const [i, setI]         = useState(0);
  const [city, setCity]   = useState(CITIES[0].id);
  const [points, setPts]  = useState(0);
  const [added, setAdded] = useState(() => new Set());
  const [swapping, setSw] = useState(false);

  const item    = ITEMS[i];
  const verdict = VERDICTS[item.verdict];
  const bin     = BINS[item.bin];
  const place   = CITIES.find(c => c.id === city);
  const isAdded = added.has(item.id);

  useEffect(() => { applyTones(item.tone, verdict.accent); }, [item, verdict]);

  const go = d => {
    setSw(true);
    setTimeout(() => { setI((i + d + ITEMS.length) % ITEMS.length); setSw(false); }, 190);
  };

  const add = () => {
    if (item.verdict !== 'takeback' || isAdded) return;
    setAdded(new Set(added).add(item.id));
    setPts(Math.min(GOAL, points + item.worth));
  };

  const fill = Math.round(points / GOAL * 100);

  return (
    <Shell tagline="Scan it · sort it · return it"
           meta={{ k:'Your returns', v:added.size, u:'this month' }}>
      <main className="stage">
        <BigWord text={verdict.word} swapping={swapping} />
        <button className="arrow prev" aria-label="Previous item" onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button className="arrow next" aria-label="Next item" onClick={() => go(1)}>
          <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        <Product shape={item.shape} swapping={swapping} />
        <div className="ticker">{item.name} · {item.sub}</div>
      </main>

      <div className="verdict">
        <span className="badge" style={{ background:verdict.accent }}>
          {verdict.badge}{item.deposit ? ` · ${item.deposit}` : ''}
        </span>
        <p className="why">{item.why}</p>
        <p className="fine">
          {item.verdict === 'home'
            ? <>In {place.name}: {bin.name}. {place.note}</>
            : <>In {place.name}: {place.note}</>}
        </p>
      </div>

      <footer>
        <div className="spec">
          <div className="cup">
            <div className="glass" style={{ '--fill': fill + '%' }} />
            <div>
              <div className="n"><span>{points}</span><span> / {GOAL}</span></div>
              <div className="msg">
                {points >= GOAL
                  ? 'Full. Your reward is waiting at any collection point.'
                  : 'Hard-to-recover items fill this faster. Film and polypropylene count for more than board, because nobody else collects them.'}
              </div>
            </div>
          </div>
          <p className="fine">
            Points stay provisional until the return is confirmed at a collection point — a
            barcode identifies a product, not an individual item, so a scan alone cannot be trusted.
          </p>
        </div>

        <div className="pitch">
          <div style={{ display:'grid', gap:5 }}>
            <span className="label">Your city</span>
            <select value={city} onChange={e => setCity(e.target.value)} aria-label="Select your city"
              style={{ padding:'9px 13px', border:'1px solid var(--hair)', borderRadius:999, background:'var(--panel)' }}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="cta" onClick={add} disabled={item.verdict !== 'takeback' || isAdded}>
            {isAdded ? 'Added to your return' : verdict.cta}
            <Arrow />
          </button>
        </div>
      </footer>
    </Shell>
  );
}
