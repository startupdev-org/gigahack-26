/* ═══════════════════════════════════════════════════════════════════════
   MOCK DATA — shape of the product, not its arithmetic.
   Every number below is a placeholder. The real spec engine, pricing and
   EPR model land later; nothing here should be quoted.
   ═══════════════════════════════════════════════════════════════════════*/

export const MATERIALS = [
  { id:'rpet',  name:'Recycled PET',         short:'rPET',    word:'rPET',
    accent:'#40708C', swatch:'#8FB6CC', pcrDefault:50, grade:'B',
    blurb:'Mechanical recycling reliably produces food-grade resin for PET — and only for PET.',
    note:'Moldova sets no recycled-content mandate. Regulation (EU) 2025/40 asks 30% in contact-sensitive PET from 2030.',
    forms:['tray','clamshell','pot'] },
  { id:'pp',    name:'Mono-material PP',     short:'Mono-PP', word:'MONO-PP',
    accent:'#4C565F', swatch:'#98A2AB', pcrDefault:10, grade:'B',
    blurb:'Stiff enough for high-speed filling lines while staying recyclable in a standard PP stream.',
    note:'Capped at 10% recycled — food-grade recycled PP barely exists, and Moldova imports every tonne of it.',
    forms:['pouch','pot','tray','hotbox'] },
  { id:'fibre', name:'Moulded fibre',        short:'Fibre',   word:'FIBRE',
    accent:'#6E7A62', swatch:'#BFBBA6', pcrDefault:80, grade:'A',
    blurb:'Grease resistance by refining the fibre mat — densified, with no coating chemistry at all.',
    note:'Moldova has no PFAS limit in food-contact fibre. Export it to the EU and an untreated claim will not hold.',
    forms:['tray','hotbox','clamshell'] },
  { id:'kraft', name:'Recycled kraft board', short:'Kraft',   word:'KRAFT',
    accent:'#8A6A43', swatch:'#C4A277', pcrDefault:80, grade:'A',
    blurb:'The lowest-fee substrate in the assortment, and the only one carrying zero virgin plastic.',
    note:'Moldova recovered 9% of its paper and board in 2024 against a 20% target — the easiest stream, uncollected.',
    forms:['shipper','mailer','hotbox'] },
  { id:'pe',    name:'Mono-material PE film',short:'Mono-PE', word:'MONO-PE',
    accent:'#5B6B72', swatch:'#A9B6BA', pcrDefault:20, grade:'C',
    blurb:'The lightest option per unit by a wide margin — and the hardest to recover.',
    note:'Moldova has no film reprocessing capacity. Every tonne collected is exported or landfilled.',
    forms:['pouch','flowwrap'] }
];

export const FORMS = {
  shipper:  { name:'Shipping case',  word:'SHIPPER',   desc:'Double-wall transit case for palletised distribution.' },
  mailer:   { name:'Wing mailer',    word:'MAILER',    desc:'Flat-packed e-commerce mailer, tape-free wing closure.' },
  tray:     { name:'Sealed tray',    word:'TRAY',      desc:'Rigid tray with peelable lidding film. Meat, fish, ready meals.' },
  clamshell:{ name:'Clamshell',      word:'CLAMSHELL', desc:'Hinged single-piece pack. Soft fruit, bakery, salads.' },
  pot:      { name:'Tapered pot',    word:'POT',       desc:'Nestable pot with a heat-sealed membrane. Dairy, desserts.' },
  pouch:    { name:'Stand-up pouch', word:'POUCH',     desc:'Gusseted pouch with a reclosable notch. Dry goods, snacks.' },
  hotbox:   { name:'Vented hot box', word:'HOT BOX',   desc:'Counter-service box with engineered steam venting.' },
  flowwrap: { name:'Flow wrap',      word:'FLOW WRAP', desc:'Horizontal fin-sealed pillow pack. Bakery, produce.' }
};

/* Explicit refusals. Discovering an incompatibility at audit instead of at
   design time is what costs money — so the configurator says no, with a reason. */
export const BLOCKS = {
  'rpet|hotbox':    'Recycled PET authorisations exclude oven and microwave use, and PET softens from roughly 60 °C.',
  'rpet|pouch':     'A pouch needs a sealant layer PET cannot provide alone. A laminate would be multi-material.',
  'rpet|shipper':   'Transit cases at this weight are a fibre application.',
  'rpet|mailer':    'Rigid PET does not fold. A plastic mailer would be film, not sheet.',
  'rpet|flowwrap':  'Flow wrap needs a flexible web. PET sheet at tray gauge cannot run on a horizontal wrapper.',
  'pp|shipper':     'Moulded PP transit cases are a returnable-crate application, outside single-trip packaging.',
  'pp|mailer':      'PP sheet does not crease reliably enough for a wing closure.',
  'pp|clamshell':   'PP lacks the clarity retail expects for soft fruit.',
  'pp|flowwrap':    'Possible as cast PP, but it runs slower than PE on existing lines.',
  'fibre|pouch':    'Moulded fibre cannot form a hermetic gusseted pouch.',
  'fibre|pot':      'A fibre pot needs a polymer liner, which blocks the fibre recycling stream.',
  'fibre|flowwrap': 'Flow wrap needs a flexible web. Moulded fibre is a rigid formed substrate.',
  'fibre|shipper':  'Structurally possible, but corrugated kraft is lighter and cheaper. Use kraft.',
  'fibre|mailer':   'Moulded fibre cannot be flat-packed, losing the whole logistics advantage.',
  'kraft|tray':     'Uncoated kraft has no liquid barrier for raw protein.',
  'kraft|clamshell':'Board clamshells fail the moisture test over a full shelf life.',
  'kraft|pot':      'A board pot needs a polymer liner, which blocks the fibre recycling stream.',
  'kraft|pouch':    'Kraft pouches need a barrier laminate — multi-material.',
  'kraft|flowwrap': 'Paper flow wrap runs only on modified lines.',
  'pe|tray':        'PE film has no rigidity. A tray needs a formed sheet.',
  'pe|clamshell':   'Film cannot hold a hinge or a closure geometry.',
  'pe|pot':         'PE film cannot be thermoformed to pot rigidity at this gauge.',
  'pe|hotbox':      'PE softens well below hot-hold temperature. It fails at the counter.',
  'pe|shipper':     'A film shipper offers no stacking strength.',
  'pe|mailer':      'Possible, but it drops the pack to the lowest recyclability grade.'
};

/* `ink` is how much of the face the flood colour itself covers. Natural is
   the bare substrate, so it costs nothing; graphite is a full flood of
   carbon black, which is the one pigment an NIR sorter cannot see through. */
export const FINISHES = [
  { id:'natural',  name:'Natural',  word:'NATURAL',  hex:'#C6A87E', ink: 0 },
  { id:'bone',     name:'Bone',     word:'BONE',     hex:'#E4DFD4', ink: 8 },
  { id:'sage',     name:'Sage',     word:'SAGE',     hex:'#96A188', ink:30 },
  { id:'clay',     name:'Clay',     word:'CLAY',     hex:'#B2705A', ink:34 },
  { id:'ocean',    name:'Ocean',    word:'OCEAN',    hex:'#4B7186', ink:40 },
  { id:'graphite', name:'Graphite', word:'GRAPHITE', hex:'#3C4241', ink:62, carbon:true }
];

export const RUNS = [
  { id:'pooled',   name:'Pooled production run', tag:'Recommended', lead:'14–18 days',
    desc:'Joins the next shared run. Clears the recycled-resin minimum a single buyer cannot reach alone.' },
  { id:'dedicated',name:'Dedicated run',          tag:'',            lead:'6–8 days',
    desc:'Your order runs alone. Faster, and priced accordingly.' },
  { id:'express',  name:'Express dedicated',      tag:'',            lead:'3–4 days',
    desc:'Priority scheduling and expedited freight.' }
];

/* ── Size ─────────────────────────────────────────────────────
   External millimetres. `ref` is the size each form was drawn at, so the
   drawing follows the sliders from there. `fill` is how much of the bounding
   box is usable volume, `skin` how much of its surface is actually material
   — a tray has no lid of its own, a clamshell has two halves.
   Ranges are the working limits of each format, not arbitrary slider ends. */
export const SIZES = {
  shipper:  { ref:{ L:400, W:300, H:250 }, min:{ L:220, W:160, H: 90 }, max:{ L:600, W:400, H:420 },
              fill:.95, skin:1.00, note:'A 1200 × 800 pallet is what caps the footprint — not the press.' },
  mailer:   { ref:{ L:330, W:250, H: 60 }, min:{ L:180, W:120, H: 20 }, max:{ L:420, W:320, H:120 },
              fill:.90, skin:1.00, note:'Depth is the gusset. Above 60 mm the carrier reprices it as a parcel.' },
  tray:     { ref:{ L:190, W:140, H: 45 }, min:{ L:110, W: 90, H: 20 }, max:{ L:280, W:220, H: 90 },
              fill:.72, skin:.62,  note:'The sealing tool sets the flange, so on a real line the footprint moves in steps.' },
  clamshell:{ ref:{ L:180, W:130, H: 75 }, min:{ L:110, W: 90, H: 40 }, max:{ L:260, W:190, H:120 },
              fill:.66, skin:1.05, note:'One piece, hinged — the lid mirrors the base, so you pay for the height twice.' },
  pot:      { ref:{ L: 95, W: 95, H:110 }, min:{ L: 60, W: 60, H: 50 }, max:{ L:140, W:140, H:180 },
              fill:.70, skin:.70,  round:true,
              note:'Round, so length and width are one number: the rim diameter.' },
  pouch:    { ref:{ L: 70, W:160, H:230 }, min:{ L: 40, W:100, H:140 }, max:{ L:120, W:240, H:340 },
              fill:.62, skin:.78,  note:'Length is the bottom gusset. Take it away and the pouch will not stand.' },
  hotbox:   { ref:{ L:230, W:170, H: 75 }, min:{ L:140, W:110, H: 40 }, max:{ L:320, W:240, H:140 },
              fill:.80, skin:1.10, note:'Counter service — it has to sit on a standard hot-hold shelf.' },
  flowwrap: { ref:{ L: 60, W:110, H:200 }, min:{ L: 30, W: 60, H: 90 }, max:{ L:110, W:190, H:300 },
              fill:.58, skin:.85,  note:'The web width on the wrapper caps the girth. Length is free.' }
};

/* Indicative grammage, g/m² of finished pack — a plausible middle of each
   substrate, not a supplier figure. The point of TARA is that the real number
   comes off the order, which is what makes the POM tonnage primary data
   instead of an estimate. Until the spec engine lands, this stands in. */
export const GRAMMAGE = { rpet:460, pp:360, fibre:320, kraft:600, pe:90 };

/* ── Print ──────────────────────────────────────────────────
   What goes on the face. Held here because it is part of the specification
   — the sorter reads ink coverage, so artwork is an engineering input. */
export const PRINT = {
  fields:[
    { key:'title',    label:'Brand',       max:16, placeholder:'RODNIC' },
    { key:'subtitle', label:'Subtitle',    max:32, placeholder:'Tomatoes in their own juice' },
    { key:'note',     label:'Small print', max:36, placeholder:'400 g · mono-material' }
  ],
  defaults:{ title:'RODNIC', subtitle:'Tomatoes in their own juice', note:'400 g · mono-material', panel:true },
  /* Above this, near-infrared identification starts to fail. */
  limit:60
};

/* Placeholder figures — wired to nothing. Replace with the real engine. */
export const MOCK_SPEC = {
  unitPrice:'0.00', moq:'—', lead:'—', virgin:'0.0', pcr:'0', grade:'A', tax:'0'
};

/* ── Take-back ─────────────────────────────────────────────────────────
   Three verdicts, and the first is a refusal. Moldova's deposit system
   (SDA, HG 379/2025) covers beverages from 2027 at 2 lei a pack. Competing
   with it would be pointless, so this page targets only what it misses. */
export const VERDICTS = {
  deposit : { word:'DEPOSIT',   badge:'Deposit return',   accent:'#2F6C8F', cta:'Take to the SDA machine' },
  takeback: { word:'TAKE BACK', badge:'TARA take-back',   accent:'#4F7A4A', cta:'Add to my return' },
  home    : { word:'KERBSIDE',  badge:'Home recycling',   accent:'#8A6A43', cta:'Keep at home' }
};

export const BINS = {
  yellow:{ name:'Yellow — plastic & metal',  hex:'#E3B341' },
  blue  :{ name:'Blue — paper & card',       hex:'#3E6F9E' },
  green :{ name:'Green — glass',             hex:'#4C7A50' },
  none  :{ name:'In-store collection point', hex:'#4F7A4A' }
};

export const ITEMS = [
  { id:'bottle', name:'PET water bottle', sub:'1.5 L beverage', shape:'pot', tone:'#8FB6CC',
    verdict:'deposit', bin:'none', deposit:'2 lei', worth:0,
    why:'This will carry a deposit once the SDA starts in 2027. The machine at the store entrance refunds it in full. We deliberately do not take it — duplicating a working system helps nobody.' },
  { id:'pot', name:'Yoghurt pot', sub:'Polypropylene, 400 g', shape:'pot', tone:'#98A2AB',
    verdict:'takeback', bin:'none', worth:3,
    why:'No deposit, and food-grade recycled polypropylene barely exists. Collected here, pots stay a single clean polymer stream worth recycling back into packaging.' },
  { id:'tray', name:'Meat tray', sub:'rPET with film lid', shape:'tray', tone:'#A9B8C2',
    verdict:'takeback', bin:'none', worth:3,
    why:'The tray is recyclable PET but the lidding film is a different polymer. We separate them here — something no sorting line in Moldova currently does.' },
  { id:'film', name:'Flow wrap film', sub:'Mono-material PE', shape:'flowwrap', tone:'#A9B6BA',
    verdict:'takeback', bin:'none', worth:5,
    why:'Flexible film is the weakest stream in Europe and Moldova has no reprocessing capacity for it at all. It is also the easiest to contaminate — one greasy wrapper devalues a whole bale.' },
  { id:'clam', name:'Fruit clamshell', sub:'Recycled PET', shape:'clamshell', tone:'#B6C4CC',
    verdict:'takeback', bin:'none', worth:2,
    why:'Technically recyclable, but routinely mis-sorted as film because clamshells flatten. Brought here, they go back into tray stock.' },
  { id:'mailer', name:'Cardboard mailer', sub:'Recycled kraft board', shape:'mailer', tone:'#C4A277',
    verdict:'home', bin:'blue', worth:0,
    why:'Board is the one stream that works almost anywhere. Bringing this to us would add a car journey for no environmental gain. Flatten it and use the paper bin.' },
  { id:'hotbox', name:'Hot food box', sub:'Moulded fibre', shape:'hotbox', tone:'#BFBBA6',
    verdict:'home', bin:'blue', worth:1, conditional:true,
    why:'Clean, the paper bin is right. Greasy, it ruins a paper bale — bring it to us and we route it to composting. This is the one item where the answer genuinely depends on its condition.' }
];

export const CITIES = [
  { id:'chisinau', name:'Chișinău',   note:'Three-bin sorting is rolling out by sector. Glass at street points.' },
  { id:'balti',    name:'Bălți',      note:'Dry recyclables collected together; no separate glass round.' },
  { id:'cahul',    name:'Cahul',      note:'Mixed collection only. Drop-off points at two supermarkets.' },
  { id:'orhei',    name:'Orhei',      note:'Pilot separate collection in the city centre.' },
  { id:'comrat',   name:'Comrat',     note:'No separate collection yet — take-back points are the only route.' }
];

export const GOAL = 20;

/* ── Learn ──────────────────────────────────────────────────────────────
   Counterintuitive beats comprehensive. Nobody reads a general guide. */
export const TIPS = [
  { q:'A greasy pizza box is still cardboard, right?',
    a:'No. Grease and food residue contaminate a whole paper bale at the mill, so one box can downgrade a tonne of otherwise clean fibre. Tear off the clean lid, recycle that, compost the base.',
    tag:'Paper' },
  { q:'Why is black plastic a problem?',
    a:'Optical sorters identify polymers by bouncing near-infrared light off them. Carbon black absorbs that light, so a black tray is invisible to the machine and ends up in residual waste, no matter what it is made of.',
    tag:'Sorting' },
  { q:'Should I take the cap off the bottle?',
    a:'Leave it on. Loose caps are too small for sorting screens and fall through to residual. Attached, they are recovered with the bottle. This reverses the advice most people were given ten years ago.',
    tag:'Plastic' },
  { q:'Does rinsing actually matter?',
    a:'Yes, but a quick rinse is enough — it does not need to be dishwasher clean. Residue grows mould in a bale over weeks of storage, and mouldy material is rejected outright.',
    tag:'Habits' },
  { q:'Is compostable packaging automatically better?',
    a:'Only where industrial composting exists to receive it. Put in a recycling stream it is a contaminant, and in landfill it behaves like anything else. Moldova has almost no industrial composting capacity.',
    tag:'Materials' },
  { q:'Why does a pack say recyclable when my city will not take it?',
    a:'Recyclable describes the material in principle. Whether it is actually recycled depends on local collection and a buyer for the output. Those are three different questions and only the first is printed on the pack.',
    tag:'Labels' }
];

/* ── Company report ─────────────────────────────────────────────────────
   Not a certificate. Moldova's real problem is that the packaging figure a
   producer declares is never audited: in 2024, 52,610 t of plastic went on
   the market and 24,474 t were declared. We publish the numbers instead. */
export const COMPANY = {
  name:'Rodnic Foods SRL',
  period:'Q1–Q3 2026',
  verified:'Primary data — 34 of 41 SKUs configured through TARA',
  streams:[
    { material:'Plastic',        declared:18.4, target:25, achieved:22.1 },
    { material:'Paper & board',  declared:41.7, target:40, achieved:44.3 },
    { material:'Glass',          declared: 9.2, target:40, achieved:17.8 },
    { material:'Metal',          declared: 2.1, target:40, achieved:12.4 }
  ],
  deltas:[
    { k:'Virgin plastic',        v:'−18%', s:'against the same period in 2025' },
    { k:'SKUs at grade A or B',  v:'34 / 41', s:'up from 21 of 39' },
    { k:'Mono-material share',   v:'71%',  s:'multi-material laminates retired' },
    { k:'Coverage of this report', v:'83%', s:'by tonnage placed on the market' }
  ]
};

/* ── AI review ──────────────────────────────────────────────────────────
   Mocked. The point of the real one is that the rules engine computes and
   the model only explains — never the other way round. */
export const AI_FINDINGS = [
  { severity:'high',
    title:'The lidding film is a different polymer from the tray',
    body:'A PET tray under a PE lid is a two-material pack, so it is sorted as a reject. Specifying a mono-PET peelable lid keeps the whole pack in one stream.',
    effect:'Recyclability C → A' },
  { severity:'medium',
    title:'Ink coverage above 60% slows optical sorting',
    body:'Heavy pigment interferes with near-infrared identification. Dropping to a two-colour design on an unprinted base recovers the read.',
    effect:'Sorting yield +11 pts' },
  { severity:'low',
    title:'The pack is 14% heavier than the format needs',
    body:'Wall thickness is uniform where it only needs reinforcement at the rim. Standard tooling can take it down without a stiffness penalty.',
    effect:'Material −14%' }
];
