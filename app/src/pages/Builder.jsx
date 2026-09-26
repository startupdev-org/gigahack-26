import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashShell, Arrow, BigWord } from '../components/Shell.jsx';
import Product, { applyTones } from '../components/Product.jsx';
import { useAuth } from '../auth.jsx';
import { MATERIALS, FORMS, BLOCKS, FINISHES, RUNS, SIZES, GRAMMAGE, PRINT, AI_FINDINGS } from '../data.js';

const STEPS = [
  { n:'01', label:'Material' },
  { n:'02', label:'Form' },
  { n:'03', label:'Size' },
  { n:'04', label:'Finish' },
  { n:'05', label:'Print' },
  { n:'06', label:'Run' },
  { n:'07', label:'Review' }
];

/* Steps whose options are a strip of chips, so the arrows can cycle them. */
const CHIPS = [0, 1, 3, 5];

const AXES = [
  { key:'L', label:'Length', hint:'front to back' },
  { key:'W', label:'Width',  hint:'across the face' },
  { key:'H', label:'Height', hint:'standing' }
];

const PRESETS = [
  { id:'compact',  name:'Compact',  f:.74 },
  { id:'standard', name:'Standard', f:1   },
  { id:'large',    name:'Large',    f:1.3 }
];

/* The drawing is axonometric, so depth reads partly across the page and
   partly up it. These two weights are the projection's own, measured off
   the shipping case, and they are what makes length visible at all. */
const DEPTH_X = .38, DEPTH_Y = .232;

/* Raw ratios run away from the frame at the ends of the sliders, so soften
   them and stop. The pack still changes proportion; it just stays on stage. */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
function scaleOf(shape, d){
  const r = SIZES[shape].ref;
  const soften = s => Math.pow(s, .55);
  return {
    sx: clamp(soften((d.W + d.L * DEPTH_X) / (r.W + r.L * DEPTH_X)), .72, 1.26),
    sy: clamp(soften((d.H + d.L * DEPTH_Y) / (r.H + r.L * DEPTH_Y)), .72, 1.30)
  };
}

/* Coverage is an area, not a colour count — which is why the flood finish
   is in it. Everything here is indicative until the spec engine lands. */
function coverageOf(finish, art){
  return Math.min(100, Math.round(
    finish.ink
    + (art.panel ? 16 : 0)
    + art.title.trim().length    * 1.05
    + art.subtitle.trim().length * .42
    + art.note.trim().length     * .22
  ));
}

export default function Builder(){
  const { placeOrder } = useAuth();
  const navigate = useNavigate();
  const [step, setStep]         = useState(0);
  const [matIdx, setMatIdx]     = useState(0);
  const [form, setForm]         = useState(null);
  const [finIdx, setFinIdx]     = useState(0);
  const [run, setRun]           = useState('pooled');
  const [dims, setDims]         = useState(SIZES[MATERIALS[0].forms[0]].ref);
  const [art, setArt]           = useState(PRINT.defaults);
  const [guard, setGuard]       = useState(null);
  const [swapping, setSwapping] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const material = MATERIALS[matIdx];
  const finish   = FINISHES[finIdx];
  const shape    = form || material.forms[0];
  const size     = SIZES[shape];

  useEffect(() => { applyTones(finish.hex, material.accent); }, [finish, material]);

  // A material change can invalidate the chosen form — fall back to a legal one.
  useEffect(() => {
    if (form && !material.forms.includes(form)) setForm(material.forms[0]);
  }, [material, form]);

  // Dimensions belong to a format, so a new form arrives at its own reference.
  useEffect(() => { setDims(SIZES[shape].ref); }, [shape]);

  // A refusal message must not outlive the step that produced it.
  useEffect(() => { setGuard(null); }, [step]);

  const swap = fn => {
    setSwapping(true);
    setTimeout(() => { fn(); setSwapping(false); }, 190);
  };

  const setAxis = (key, raw) => setDims(d => {
    const v = clamp(Math.round(raw), size.min[key], size.max[key]);
    return size.round && key !== 'H' ? { ...d, L:v, W:v } : { ...d, [key]:v };
  });

  const preset = f => setDims(Object.fromEntries(
    AXES.map(a => [a.key, clamp(Math.round(size.ref[a.key] * f), size.min[a.key], size.max[a.key])])
  ));

  const { sx, sy } = scaleOf(shape, dims);

  const litres   = dims.L * dims.W * dims.H * size.fill / 1e6;
  const area     = 2 * (dims.L * dims.W + dims.L * dims.H + dims.W * dims.H) / 1e6 * size.skin;
  const grams    = area * GRAMMAGE[material.id];
  const coverage = coverageOf(finish, art);
  const overInk  = coverage > PRINT.limit;

  const volume = litres < 1
    ? { v:Math.round(litres * 1000), u:'ml' }
    : { v:litres.toFixed(litres < 10 ? 1 : 0), u:'L' };
  const weight = grams < 10 ? grams.toFixed(1) : Math.round(grams);

  const word = [
    material.word,
    FORMS[shape].word,
    `${volume.v} ${volume.u}`,
    finish.word,
    (art.title.trim() || 'PRINT').toUpperCase(),
    'RUN',
    ''
  ][step];

  const options = useMemo(() => {
    if (step === 0) return MATERIALS.map((m, i) => ({
      key:m.id, label:m.name, sub:m.short, swatch:m.swatch, on:i === matIdx,
      pick:() => swap(() => setMatIdx(i))
    }));
    if (step === 1) return Object.keys(FORMS).map(k => {
      const blocked = !material.forms.includes(k);
      return {
        key:k, label:FORMS[k].name, sub:blocked ? 'not available' : FORMS[k].word.toLowerCase(),
        on:k === shape, blocked,
        pick:() => blocked
          ? setGuard({ form:FORMS[k].name, reason:BLOCKS[`${material.id}|${k}`] })
          : swap(() => { setForm(k); setGuard(null); })
      };
    });
    if (step === 3) return FINISHES.map((f, i) => ({
      key:f.id, label:f.name, sub:`${f.ink}% ink`, swatch:f.hex, on:i === finIdx,
      pick:() => swap(() => setFinIdx(i))
    }));
    if (step === 5) return RUNS.map(r => ({
      key:r.id, label:r.name, sub:r.lead, on:r.id === run,
      pick:() => setRun(r.id)
    }));
    return [];
  }, [step, matIdx, finIdx, form, run, material, shape]);

  const cycle = dir => {
    const live = options.filter(o => !o.blocked);
    if (!live.length) return;
    const at = Math.max(0, live.findIndex(o => o.on));
    live[(at + dir + live.length) % live.length].pick();
  };

  function buildPacket(){
    return {
      material: material.id,
      materialName: material.name,
      form: shape,
      formName: FORMS[shape].name,
      finish: finish.id,
      finishName: finish.name,
      finishHex: finish.hex,
      run,
      runName: RUNS.find(r => r.id === run).name,
      dims: { ...dims },
      print: { ...art },
      title: art.title.trim() || 'Custom pack',
      subtitle: art.subtitle.trim() || FORMS[shape].name,
      quantity: 1000,
      weight,
      coverage,
      volume,
      grade: material.grade
    };
  }

  function orderPack(){
    if (ordering) return;
    setOrdering(true);

    const packet = buildPacket();
    const result = placeOrder(packet);

    if (!result.ok) {
      console.error('Order failed:', result.error);
      setOrdering(false);
      return;
    }

    navigate('/dashboard/orders');
  }

  const hint = [
    FORMS[shape].desc,
    FORMS[shape].desc,
    size.note,
    `${finish.name} lays down about ${finish.ink}% coverage before a word is printed.`,
    `${coverage}% of the printable face is carrying ink.`,
    RUNS.find(r => r.id === run).desc,
    ''
  ][step];

  const pitch = [
    <>Every pack starts with its material. <em>That choice sets what shape is legal.</em></>,
    <>{material.blurb}</>,
    <>Size is the first cost. <em>Headspace is material you buy, freight you pay for and tonnage you answer for.</em></>,
    <>Colour is not decoration — <em>heavy ink coverage is what stops a sorting machine reading the polymer.</em></>,
    <>What you print is part of the specification. <em>The sorter reads the face before any shopper does.</em></>,
    <>{RUNS.find(r => r.id === run).desc}</>,
    <>This is the specification that travels with the pack. <em>Place the order to add it to your dashboard.</em></>
  ][step];

  const notice = guard
    ? { tone:'no', head:'Not available.',
        body:<><strong>{guard.form}</strong> in {material.short} — {guard.reason}</> }
    : overInk && (step === 3 || step === 4)
      ? { tone:'warn', head:'Allowed, but —',
          body:<>ink coverage is <strong>{coverage}%</strong>, over the {PRINT.limit}% where near-infrared
            identification starts to fail{finish.carbon ? ', and carbon black is invisible to the sorter at any coverage' : ''}. The
            pack still runs; it is the sorting line that loses it.</> }
      : null;

  return (
    <DashShell>
      <div className="configure-wrap">
      <div className="steps" role="tablist" aria-label="Configuration steps">
        {STEPS.map((s, i) => (
          <button key={s.n} role="tab" aria-selected={i === step}
            className={'step' + (i === step ? ' on' : '')}
            disabled={i > 1 && !form}
            onClick={() => swap(() => setStep(i))}>
            <span className="n">{s.n}</span>{s.label}
          </button>
        ))}
      </div>

      <main className="stage">
        {word && <BigWord text={word} swapping={swapping} />}
        {CHIPS.includes(step) && (
          <>
            <button className="arrow prev" aria-label="Previous option" onClick={() => cycle(-1)}>
              <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button className="arrow next" aria-label="Next option" onClick={() => cycle(1)}>
              <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        {step === 6
          ? <Review material={material} shape={shape} finish={finish} run={run}
                    dims={dims} art={art} coverage={coverage} volume={volume} weight={weight} />
          : <Product shape={shape} swapping={swapping} sx={sx} sy={sy} art={art} />}
      </main>

      <p className="hint">{hint}</p>

      <div className="notice-slot" aria-live="polite">
        {notice && (
          <p className={'guard ' + notice.tone}>
            <span className="x">{notice.head}</span> {notice.body}
          </p>
        )}
      </div>

      <div className="controls">
        {options.length > 0 && (
          <div className="rail">
            {options.map(o => (
              <button key={o.key} className={'opt' + (o.on ? ' on' : '')} onClick={o.pick}
                aria-disabled={!!o.blocked}
                style={o.blocked ? { opacity:.34, textDecoration:'line-through' } : undefined}>
                {o.swatch && <span className="sw" style={{ background:o.swatch }} />}
                <span className="t"><b>{o.label}</b>{o.sub && <small>{o.sub}</small>}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="tuner">
            {AXES.map(a => {
              const locked = size.round && a.key === 'W';
              const lo = size.min[a.key], hi = size.max[a.key];
              return (
                <label className="dim" key={a.key}>
                  <span className="row">
                    <span className="k">{a.label}<i>{locked ? 'follows length' : a.hint}</i></span>
                    <span className="v num">{dims[a.key]}<u>mm</u></span>
                  </span>
                  <input type="range" min={lo} max={hi} step="5" value={dims[a.key]}
                    disabled={locked}
                    style={{ '--p':`${(dims[a.key] - lo) / (hi - lo) * 100}%` }}
                    onChange={e => setAxis(a.key, +e.target.value)} />
                  <span className="ends num"><span>{lo}</span><span>{hi}</span></span>
                </label>
              );
            })}
            <div className="dim">
              <span className="row"><span className="k">Start from<i>then adjust</i></span></span>
              <div className="chips">
                {PRESETS.map(p => (
                  <button key={p.id} className="chip" onClick={() => preset(p.f)}>{p.name}</button>
                ))}
              </div>
              <span className="ends"><span>Reference is {size.ref.L} × {size.ref.W} × {size.ref.H} mm</span></span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="tuner">
            {PRINT.fields.map(f => (
              <label className="dim field" key={f.key}>
                <span className="row">
                  <span className="k">{f.label}</span>
                  <span className="v num sm">{art[f.key].length}/{f.max}</span>
                </span>
                <input type="text" value={art[f.key]} maxLength={f.max} placeholder={f.placeholder}
                  onChange={e => setArt({ ...art, [f.key]:e.target.value })} />
              </label>
            ))}
            <div className="dim">
              <span className="row"><span className="k">Printed panel<i>a flood block behind the type</i></span></span>
              <div className="chips">
                <button className={'chip' + (art.panel ? ' on' : '')}
                  aria-pressed={art.panel}
                  onClick={() => setArt({ ...art, panel:!art.panel })}>
                  {art.panel ? 'On' : 'Off'}
                </button>
              </div>
              <span className="ends"><span>Coverage {coverage}% · limit {PRINT.limit}%</span></span>
            </div>
          </div>
        )}
      </div>

      <footer>
        <div className="spec">
          <div className="label">Live specification</div>
          <div className="grid">
            <Cell k="Dimensions"    v={`${dims.L}×${dims.W}×${dims.H}`} u="mm" />
            <Cell k="Volume"        v={volume.v}   u={volume.u} />
            <Cell k="Est. weight"   v={weight}     u="g" />
            <Cell k="Ink coverage"  v={coverage}   u="%" over={overInk} />
            <Cell k="Lead time"     v={RUNS.find(r => r.id === run).lead} />
            <Cell k="Recyclability" v={<span className={'grade g-' + material.grade}>{material.grade}</span>} />
          </div>
          <p className="fine">
            {material.note} <br />
            Volume, weight and coverage are computed from the geometry against an indicative
            grammage — the real figures come off the supplier's spec. Pricing, minimum order
            and the EPR model are not wired up yet.
          </p>
        </div>
        <div className="pitch">
          <p>{pitch}</p>
          <div className="cta-row">
            {step > 0 && <button className="back" onClick={() => swap(() => setStep(step - 1))}>Back</button>}
            {step < 6 ? (
              <button className="cta"
                onClick={() => swap(() => { if (!form) setForm(material.forms[0]); setStep(Math.min(step + 1, 6)); })}>
                {['Choose a form','Set the size','Choose a finish','Add the print','Choose a run','Review the pack'][step]}
                <Arrow />
              </button>
            ) : (
              <button className="cta" disabled={ordering} onClick={orderPack}>
                {ordering ? 'Placing order…' : 'Place order'}
                <Arrow />
              </button>
            )}
          </div>
        </div>
      </footer>
      </div>
    </DashShell>
  );
}

function Cell({ k, v, u, over }){
  return (
    <div className="cell">
      <div className="k">{k}</div>
      <div className={'v num' + (over ? ' over' : '')}>{v}{u && <span className="u">{u}</span>}</div>
    </div>
  );
}

/* The AI review is the entry point back into the configurator, not a chat
   bolted onto the side. In the real thing the rules engine computes the
   numbers and the model only writes the explanation. */
function Review({ material, shape, finish, run, dims, art, coverage, volume, weight }){
  const facts = [
    ['Dimensions',   `${dims.L} × ${dims.W} × ${dims.H} mm`],
    ['Volume',       `${volume.v} ${volume.u}`],
    ['Est. weight',  `${weight} g`],
    ['Ink coverage', `${coverage}%`]
  ];
  const printed = [art.title, art.subtitle, art.note].map(s => s.trim()).filter(Boolean);

  return (
    <div className="review">
      <div>
        <div className="eyebrow">Specification</div>
        <h2>
          {FORMS[shape].name} in {material.short}, {finish.name.toLowerCase()} — {RUNS.find(r => r.id === run).name.toLowerCase()}
        </h2>
      </div>

      <div className="facts">
        {facts.map(([k, v]) => (
          <div className="cell" key={k}>
            <div className="k">{k}</div>
            <div className="v num">{v}</div>
          </div>
        ))}
      </div>

      {printed.length > 0 && (
        <p className="printed">
          <span className="label">Printed</span>
          {printed.map((line, i) => <span key={i}>{line}</span>)}
        </p>
      )}

      <div className="card">
        <div className="eyebrow">Automated review</div>
        {AI_FINDINGS.map(f => (
          <div className="finding" key={f.title}>
            <div className="top">
              <span className={'sev sev-' + f.severity} />
              <b>{f.title}</b>
            </div>
            <p>{f.body}</p>
            <span className="effect">{f.effect}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
