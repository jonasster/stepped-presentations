/* ── Motoren. Alt på skærmen udledes af (si, n) — aldrig muteret fremad. ──── */

const $ = id => document.getElementById(id);
const stage = $('stage'), deckEl = $('deck');
const phaseEl = $('phase'), clockEl = $('clock'), countEl = $('count'), progress = $('progress');
const bNext = $('bNext'), bPrev = $('bPrev'), bAll = $('bAll');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s == null ? '' : s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* ── lærredets faste mål: alle tal nedenfor lever i dette rum ────────────── */
const W = 1920, H = 1080, PAD = 130;
const USABLE = W - PAD * 2;                 /* 1660 */

/* organisationsdiagrammernes eget rum */
const OW = 1040, OH = 540;

/* ── fælles byggeklodser ─────────────────────────────────────────────────── */
function head(s){
  return `<header class="slide-head">
    <p class="kicker">${esc(s.phase)}</p>
    <h2>${esc(s.title)}</h2>
    ${s.lede ? `<p class="lede">${esc(s.lede)}</p>` : ''}
  </header>`;
}

/* kompakt trinliste — venstre spalte på alle todelte slides */
function stepList(s){
  return `<ol class="tight">` + s.steps.map((x, i) => `
    <li class="rv trow" data-i="${i}">
      <b class="num">${i + 1}</b>
      <div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>
    </li>`).join('') + `</ol>`;
}

/* belastningsmåler: tre prikker, så man kan skimme tyngden uden at læse */
function load(n){
  return `<span class="load" title="arbejdsbelastning ${n} af 3">` +
    [1,2,3].map(i => `<i class="${i <= n ? 'f' : ''}"></i>`).join('') + `</span>`;
}

/* en besked kan rumme et citat, flere afsnit, et linkkort og en punktliste */
function msgBody(m){
  const q = m.quote ? `<div class="m-quote">
      <p class="mq-meta">${esc(m.quote.by)} · ${esc(m.quote.when)}</p>
      <p>${esc(m.quote.t)}</p></div>` : '';
  const paras = (Array.isArray(m.t) ? m.t : [m.t])
    .map(x => `<p class="m-body">${esc(x)}</p>`).join('');
  const link = m.link ? `<div class="m-link">
      <p class="ml-t">${esc(m.link.t)}</p><p class="ml-d">${esc(m.link.d)}</p></div>` : '';
  const list = m.links ? `<ul class="m-links">` +
    m.links.map(l => `<li>${esc(l)}</li>`).join('') + `</ul>` : '';
  return q + paras + link + list;
}

/* ── layout-tegnere, én pr. kind ─────────────────────────────────────────── */
const render = {

  /* 1 · forsiden: teksten til venstre, de tre huse der skifter til højre */
  title(s){
    return `<div class="t-grid">
      <div class="t-text">
        <p class="kicker">${esc(s.phase)}</p>
        <h1>${esc(DECK.title)}</h1>
        <p class="lede t-lede">${esc(DECK.lede)}</p>
        <p class="t-meta">${esc(DECK.meta)}</p>
      </div>
      <div class="t-anim">${villageAnim()}</div>
    </div>`;
  },

  /* vandret række kort */
  cards(s){
    const n = s.steps.length, gap = 26;
    const w = Math.round((USABLE - gap * (n - 1)) / n);
    return head(s) + `<div class="body cards" style="--gap:${gap}px">` +
      s.steps.map((x, i) => `
        <article class="rv card" data-i="${i}" style="width:${w}px">
          <b class="num">${String(i + 1).padStart(2, '0')}</b>
          <h3>${esc(x.t)}</h3>
          <p>${esc(x.d)}</p>
        </article>`).join('') + `</div>`;
  },

  /* hvem der står og taler: et kort cv til venstre, fire nørderier der kører
     til højre. Bevægelsen siger noget her: de fire ting samler jeg faktisk på */
  about(s){
    /* eget hoved, så portrættet kan stå ved siden af navnet */
    return `<header class="slide-head me-head">
      <div>
        <p class="kicker">${esc(s.phase)}</p>
        <h2>${esc(s.title)}</h2>
        <p class="lede">${esc(s.lede)}</p>
      </div>
      <img class="me-face" src="${esc(s.avatar)}" alt="">
    </header>
    <div class="body me">
      <div class="me-cols">` + s.steps.map((x, i) => `
        <section class="rv me-block" data-i="${i}">
          <p class="me-lab">${esc(x.t)}</p>
          <ul>` + x.items.map(it => `<li>${esc(it)}</li>`).join('') + `</ul>
        </section>`).join('') + `</div>
      <div class="me-anim">${nerdAnim()}</div>
    </div>`;
  },

  /* taltavler: tallet først, forklaringen under. Ét tal ad gangen */
  facts(s){
    const n = s.steps.length, gap = 40;
    const w = Math.round((USABLE - gap * (n - 1)) / n);
    return head(s) + `<div class="body facts" style="--gap:${gap}px">` +
      s.steps.map((x, i) => `
        <article class="rv fact" data-i="${i}" style="width:${w}px">
          <b>${esc(x.t)}</b>
          <p>${esc(x.d)}</p>
        </article>`).join('') + `</div>`;
  },

  /* tidslinje: knuderne har hver sin epokefarve */
  timeline(s){
    const n = s.steps.length, X0 = 300, X1 = 1620, AY = 660;
    const col = (X1 - X0) / (n - 1);
    const xOf = i => Math.round(X0 + i * col);
    return head(s) + `<div class="body scene">
      <div class="axis" style="left:${X0}px;width:${X1 - X0}px;top:${AY}px"></div>` +
      s.steps.map((x, i) => `
        <div class="rv tknot ${x.c}" data-i="${i}" style="left:${xOf(i)}px;top:${AY}px"></div>
        <div class="rv tname ${x.c}" data-i="${i}" style="left:${xOf(i)}px;top:${AY - 46}px;width:${Math.round(col)}px">${esc(x.t)}</div>
        <div class="rv ttime ${x.c}" data-i="${i}" style="left:${xOf(i)}px;top:${AY + 38}px">${esc(x.d)}</div>`
      ).join('') + `</div>`;
  },

  /* en epoke: trin til venstre, organisationsdiagram til højre */
  era(s){
    return head(s) + `<div class="body split">
      <div class="col-steps">${stepList(s)}</div>
      <div class="scene-box">${ORG[s.org]()}</div>
    </div>`;
  },

  /* tre spalter side om side, én pr. epoke, med pile imellem */
  shift(s){
    const n = s.steps.length, gap = 74;
    const w = Math.round((USABLE - gap * (n - 1)) / n);
    return head(s) + `<div class="body shift" style="--gap:${gap}px">` +
      s.steps.map((x, i) => `
        <article class="rv scol ${x.c}" data-i="${i}" style="width:${w}px">
          <p class="s-era">${esc(x.era)}</p>
          <p class="s-home">${esc(x.home)}</p>
          <h3>${esc(x.t)}</h3>
          <p class="s-ex"><b>En typisk tirsdag</b>${esc(x.d)}</p>
        </article>` +
        (i < n - 1 ? `<div class="rv sarrow" data-i="${i + 1}">→</div>` : '')
      ).join('') + `</div>`;
  },

  /* regnskabet: tab til venstre, gevinst til højre, rækkerne i fortælleorden */
  ledger(s){
    const cell = side => s.steps.map((x, i) =>
      x.side !== side ? '' : `
        <div class="rv lrow" data-i="${i}">
          <h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
        </div>`).join('');
    return head(s) + `<div class="body ledger">
      <section class="lcol minus"><p class="lhead">Mistet</p>${cell('tab')}</section>
      <section class="lcol plus"><p class="lhead">Vundet</p>${cell('gevinst')}</section>
    </div>`;
  },

  /* landskabet: seks bunker med antal, afsløret én ad gangen */
  landscape(s){
    return head(s) + `<div class="body landscape">` +
      s.steps.map((x, i) => `
        <article class="rv pile" data-i="${i}">
          <div class="pile-top">
            <h3>${esc(x.t)}</h3>
            <b class="pile-n">${x.n}</b>
          </div>
          <div class="dots">${Array.from({length:x.n},(_,k)=>`<i style="--i:${k}"></i>`).join('')}</div>
          <p>${esc(x.d)}</p>
        </article>`).join('') + `</div>
      <p class="rv lfoot" data-i="${s.steps.length - 1}">Arbejdsbelastning:
        <span>${load(1)} lille</span><span>${load(2)} mellem</span><span>${load(3)} stor</span></p>`;
  },

  /* et tema: pointerne øverst, de faktiske opgavekort nedenunder */
  tasks(s){
    const pts = `<div class="tpoints" style="grid-template-columns:repeat(${s.steps.length},1fr)">`
      + s.steps.map((x, i) => `
      <div class="rv tpoint" data-i="${i}">
        <h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
      </div>`).join('') + `</div>`;
    const cols = Math.min(4, Math.max(2, s.cards.length));
    const n = s.cards.length;
    const grid = `<div class="tgrid${n <= 2 ? ' wide' : n <= 4 ? ' roomy' : ''}"
                       style="grid-template-columns:repeat(${cols},1fr)">` + s.cards.map(c => `
      <article class="rv tcard" data-i="${c.g}">
        <h3>${esc(c.t)}</h3>
        <p class="tw">${esc(c.w)}</p>
        <p class="tf"><span>${esc(c.dl)}</span>${load(c.l)}</p>
      </article>`).join('') + `</div>`;
    return head(s) + `<div class="body tasks">${pts}${grid}</div>`;
  },

  /* under produktion: én spalte pr. fakultet, så fordelingen er det man ser */
  micros(s){
    const n = s.steps.length, gap = 40;
    const w = Math.round((USABLE - gap * (n - 1)) / n);
    return head(s) + `<div class="body micros" style="--gap:${gap}px">` +
      s.steps.map((x, i) => `
        <section class="rv mcol" data-i="${i}" style="width:${w}px">
          <div class="m-head"><h3>${esc(x.t)}</h3><b>${x.items.length}</b></div>
          <p class="m-note">${esc(x.d)}</p>
          <ul>` + x.items.map((it, k) => `
            <li style="--i:${k}">${esc(it)}</li>`).join('') + `</ul>
        </section>`).join('') + `</div>`;
  },

  /* en rigtig tråd, ord for ord. Beskederne til venstre, pointen til højre */
  thread(s){
    const msgs = s.steps.map((x, i) => x.msgs.map(m => `
      <div class="rv msg ${m.who}" data-i="${i}">
        <p class="m-meta">${esc(m.by)} · ${esc(m.when)}</p>
        ${msgBody(m)}
      </div>`).join('')).join('');
    return head(s) + `<div class="body convo">
      <div class="thread">
        ${s.note ? `<p class="t-note">${esc(s.note)}</p>` : ''}
        ${msgs}
      </div>
      <div class="tnotes">` + s.steps.map((x, i) => `
        <div class="rv tnote" data-i="${i}">
          <b class="num">${String(i + 1).padStart(2, '0')}</b>
          <h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
        </div>`).join('') + `</div></div>`;
  },

  /* systemprompten: dokumentets form til venstre, det den siger til højre */
  promptdoc(s){
    return head(s) + `<div class="body pdoc-wrap">
      <aside class="pdoc">
        <p class="pd-head">${esc(s.doc.head)}</p>
        <ol class="pd-list">` + s.doc.sections.map(x => `<li>${esc(x)}</li>`).join('') + `</ol>
      </aside>
      <div class="pquotes">` + s.steps.map((x, i) => `
        <div class="rv pq" data-i="${i}">
          <blockquote>${esc(x.q)}${x.alt ? `<span>${esc(x.alt)}</span>` : ''}</blockquote>
          <p>${esc(x.d)}</p>
        </div>`).join('') + `</div></div>`;
  },

  /* afleveringen: to opgaver de kan vælge at følge med i */
  handover(s){
    const n = s.steps.length, gap = 60;
    const w = Math.round((USABLE - gap * (n - 1)) / n);
    return head(s) + `<div class="body offer" style="--gap:${gap}px">` +
      s.steps.map((x, i) => `
        <article class="rv ocard" data-i="${i}" style="width:${w}px">
          <p class="o-tag">Mulighed ${i + 1}</p>
          <h3>${esc(x.t)}</h3>
          <p class="o-what">${esc(x.d)}</p>
          <p class="o-see"><b>I får at se</b>${esc(x.see)}</p>
        </article>`).join('') + `</div>
      <p class="rv ofoot" data-i="${s.steps.length - 1}">${esc(s.foot)}</p>`;
  },

  /* servicetjekket: fire kasser på en linje, med pile */
  flow(s){
    const n = s.steps.length, gap = 64;
    const w = Math.round((USABLE - gap * (n - 1)) / n);
    return head(s) + `<div class="body flow" style="--gap:${gap}px">` +
      s.steps.map((x, i) => `
        <article class="rv fbox" data-i="${i}" style="width:${w}px">
          <b class="num">${String(i + 1).padStart(2, '0')}</b>
          <h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
        </article>` +
        (i < n - 1 ? `<div class="rv farrow" data-i="${i + 1}">→</div>` : '')
      ).join('') + `</div>`;
  },

  /* opsamlingen: hele dækket som otte tætte blokke og én linje til sidst */
  summary(s){
    return head(s) + `<div class="body sum">
      <div class="sum-grid">` + s.steps.map((x, i) => `
        <article class="rv sblock${x.c ? ' ' + x.c : ''}" data-i="${i}">
          <div class="s-art">${sumArt(x.art)}</div>
          <p class="s-lab">${esc(x.lab)}</p>
          <h3>${esc(x.t)}</h3>
          <p class="s-sub">${esc(x.d)}</p>
        </article>`).join('') + `</div>
      <p class="rv sum-end" data-i="${s.steps.length - 1}">${esc(s.end)}</p>
    </div>`;
  },

  /* slutbilledet: tre linjer, stort sat, og et spørgsmålstegn til sidst */
  close(s){
    return head(s) + `<div class="body close">` +
      s.steps.map((x, i) => `
        <div class="rv crow" data-i="${i}">
          <h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
        </div>`).join('') +
      `<p class="rv cq" data-i="${s.steps.length - 1}">Spørgsmål?</p></div>`;
  }
};


/* fire små evighedsmaskiner: et ur der går, et tastatur der skrives på,
   et LEGO-tårn der bygger sig selv, og en server med lys i. Alle fire
   kører hele tiden, fordi de ikke peger på et trin men på en person. */
function nerdAnim(){
  /* ur */
  const CX = 150, CY = 112, R = 86;
  let marks = '';
  for (let i = 0; i < 12; i++){
    const a = i * Math.PI / 6, s = i % 3 === 0 ? 58 : 64;
    marks += `<line class="w-mark${i % 3 === 0 ? ' big' : ''}"
      x1="${(CX + Math.sin(a) * s).toFixed(1)}" y1="${(CY - Math.cos(a) * s).toFixed(1)}"
      x2="${(CX + Math.sin(a) * 71).toFixed(1)}" y2="${(CY - Math.cos(a) * 71).toFixed(1)}"/>`;
  }
  const watch = `<g class="tile">
    <circle class="w-case" cx="${CX}" cy="${CY}" r="${R}"/>
    <circle class="w-face" cx="${CX}" cy="${CY}" r="${R - 9}"/>
    ${marks}
    <line class="w-hand w-hour" x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - 40}"/>
    <line class="w-hand w-min"  x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - 58}"/>
    <line class="w-hand w-sec"  x1="${CX}" y1="${CY + 14}" x2="${CX}" y2="${CY - 66}"/>
    <circle class="w-pin" cx="${CX}" cy="${CY}" r="4.5"/>
  </g>`;

  /* tastatur: tolv taster, trykket ned i forskudt rækkefølge */
  let keys = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++){
    const i = r * 4 + c;
    keys += `<g class="key" style="--d:${(i * 0.31).toFixed(2)}s">
      <rect x="${362 + c * 66}" y="${62 + r * 38}" width="58" height="30" rx="6"/>
      <rect class="cap" x="${368 + c * 66}" y="${66 + r * 38}" width="46" height="18" rx="4"/>
    </g>`;
  }
  const board = `<g class="tile">
    <rect class="kb" x="350" y="50" width="280" height="130" rx="12"/>
    ${keys}
  </g>`;

  /* LEGO: fire klodser der falder ned og lander oven på hinanden */
  let bricks = '';
  for (let i = 0; i < 4; i++){
    const y = 420 - i * 34, x = 85;
    let studs = '';
    for (let k = 0; k < 4; k++)
      studs += `<rect class="stud" x="${x + 10 + k * 34}" y="${y - 7}" width="22" height="9" rx="3"/>`;
    bricks += `<g class="brick b${i}" style="--d:${(i * 1.15).toFixed(2)}s">
      ${studs}<rect x="${x}" y="${y}" width="150" height="32" rx="4"/></g>`;
  }
  const lego = `<g class="tile">
    <rect class="plate" x="40" y="452" width="240" height="16" rx="4"/>
    ${bricks}
  </g>`;

  /* server: tre enheder med lys der blinker i hver sin takt */
  let units = '';
  for (let i = 0; i < 3; i++){
    const y = 302 + i * 55;
    units += `<g class="unit">
      <rect x="382" y="${y}" width="216" height="44" rx="6"/>
      <circle class="led" cx="400" cy="${y + 22}" r="5" style="--d:${(i * 0.7).toFixed(2)}s"/>
      <circle class="led alt" cx="416" cy="${y + 22}" r="5" style="--d:${(i * 0.7 + 1.1).toFixed(2)}s"/>
      <line class="vent" x1="470" y1="${y + 14}" x2="586" y2="${y + 14}"/>
      <line class="vent" x1="470" y1="${y + 22}" x2="586" y2="${y + 22}"/>
      <line class="vent" x1="470" y1="${y + 30}" x2="586" y2="${y + 30}"/>
    </g>`;
  }
  const server = `<g class="tile">
    <rect class="rack" x="370" y="290" width="240" height="175" rx="10"/>
    ${units}
  </g>`;

  return `<svg class="nerd" viewBox="0 0 660 520" aria-hidden="true">
    ${watch}${board}${lego}${server}
    <text class="n-cap" x="150" y="243" text-anchor="middle">mekaniske ure</text>
    <text class="n-cap" x="490" y="243" text-anchor="middle">tastaturer</text>
    <text class="n-cap" x="160" y="503" text-anchor="middle">lego</text>
    <text class="n-cap" x="490" y="503" text-anchor="middle">hjemmeserver</text>
  </svg>`;
}

/* Otte små modeller til opsamlingen. Hver enkelt genkalder det slide den
   opsummerer, så billedet bærer pointen og teksten kun sætter navn på. */
function sumArt(k){
  const V = (inner) => `<svg class="sa" viewBox="0 0 340 110" aria-hidden="true">${inner}</svg>`;
  const pil = (x1, x2, y) =>
    `<path class="sa-hair" d="M ${x1} ${y} L ${x2 - 9} ${y}"/>
     <path class="sa-head" d="M ${x2 - 10} ${y - 5} L ${x2} ${y} L ${x2 - 10} ${y + 5} Z"/>`;

  if (k === 'lokalt')                    /* alting foregår inde i det samme hus */
    return V(`<rect class="sa-face" x="66" y="10" width="208" height="90" rx="11"/>
      <rect class="sa-acc" x="86" y="30" width="72" height="24" rx="5"/>
      <rect class="sa-dim" x="170" y="30" width="84" height="24" rx="5"/>
      <rect class="sa-dim" x="86" y="64" width="84" height="24" rx="5"/>
      <rect class="sa-dim" x="182" y="64" width="72" height="24" rx="5"/>`);

  if (k === 'tvaers'){                   /* ét center, fire fakulteter */
    const X = [28, 102, 176, 250];
    return V(`<rect class="sa-acc" x="140" y="4" width="60" height="24" rx="6"/>` +
      X.map(x => `<path class="sa-hair" d="M 170 28 L ${x + 31} 76"/>`).join('') +
      X.map(x => `<rect class="sa-face" x="${x}" y="76" width="62" height="26" rx="6"/>`).join(''));
  }

  if (k === 'teknisk'){                  /* inde i ITS, og stadig ud til fakulteterne */
    const C = [31, 103, 175, 247], B = [40, 139, 238];
    return V(`<rect class="sa-box" x="16" y="4" width="308" height="40" rx="9"/>` +
      C.map((x, i) => `<rect class="${i ? 'sa-dim' : 'sa-acc'}" x="${x}" y="13" width="62" height="22" rx="5"/>`).join('') +
      B.map(x => `<path class="sa-hair" d="M 62 44 L ${x + 31} 80"/>`).join('') +
      B.map(x => `<rect class="sa-face" x="${x}" y="80" width="62" height="24" rx="6"/>`).join(''));
  }

  if (k === 'regnskab'){                /* én linje klippet over, fire nye knyttet */
    const SAT = [[178,10],[286,10],[178,82],[286,82]];
    return V(`<rect class="sa-face" x="18" y="8" width="62" height="26" rx="6"/>
      <rect class="sa-face" x="18" y="76" width="62" height="26" rx="6"/>
      <path class="sa-hair" d="M 49 34 L 49 44"/><path class="sa-hair" d="M 49 66 L 49 76"/>
      <path class="sa-cut" d="M 39 45 L 59 65"/><path class="sa-cut" d="M 59 45 L 39 65"/>
      <path class="sa-split" d="M 136 6 L 136 104"/>` +
      /* linjerne først, så knuderne kan lægge sig ovenpå og ikke krydses igennem */
      SAT.map(([x, y]) => `<path class="sa-hair" d="M 254 55 L ${x + 20} ${y + 14}"/>`).join('') +
      SAT.map(([x, y]) => `<rect class="sa-dim" x="${x}" y="${y}" width="40" height="28" rx="6"/>`).join('') +
      `<rect class="sa-acc" x="226" y="41" width="56" height="28" rx="6"/>`);
  }

  if (k === 'moeder'){                   /* lederen: før hver gang, nu hver fjerde */
    const dot = (y, ring) => [0,1,2,3,4,5,6,7].map(i => {
      const x = 74 + i * 33;
      return (ring(i) ? `<circle class="sa-ring-o" cx="${x}" cy="${y}" r="13"/>` : '') +
             `<circle class="sa-dot" cx="${x}" cy="${y}" r="6.5"/>`;
    }).join('');
    return V(`<text class="sa-tag" x="8" y="34">FØR</text>${dot(29, () => true)}
      <text class="sa-tag" x="8" y="87">NU</text>${dot(82, i => i % 4 === 0)}`);
  }

  if (k === 'bunker'){                   /* syv bunker, og hvor tyngden ligger */
    const N = [6, 7, 13, 4, 6, 2, 5];
    return V(N.map((v, i) =>
      `<rect class="${v === 13 ? 'sa-acc' : 'sa-dim'}" x="34" y="${5 + i * 15}"
             width="${Math.round(v / 13 * 276)}" height="9" rx="4.5"/>`).join(''));
  }

  if (k === 'case')                      /* en besked der bliver til en instruktion */
    return V(`<rect class="sa-face" x="8" y="24" width="118" height="58" rx="12"/>
      <path class="sa-tail" d="M 30 82 L 30 98 L 50 82 Z"/>
      <rect class="sa-dim" x="24" y="40" width="86" height="7" rx="3.5"/>
      <rect class="sa-dim" x="24" y="56" width="58" height="7" rx="3.5"/>
      ${pil(138, 172, 55)}
      <rect class="sa-acc" x="182" y="20" width="150" height="70" rx="10"/>
      <rect class="sa-on" x="198" y="36" width="118" height="6" rx="3"/>
      <rect class="sa-on" x="198" y="52" width="94" height="6" rx="3"/>
      <rect class="sa-on" x="198" y="68" width="112" height="6" rx="3"/>`);

  if (k === 'fremad'){                   /* spredt og omskifteligt bliver til et fast sæt */
    const spredt = [[12,16,-14],[54,40,9],[24,72,17],[74,8,6],[96,56,-11],[62,88,13]];
    const fast = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) fast.push([214 + c * 34, 32 + r * 34]);
    return V(spredt.map(([x,y,r]) =>
        `<rect class="sa-dim" x="${x}" y="${y}" width="20" height="20" rx="4"
               transform="rotate(${r} ${x+10} ${y+10})"/>`).join('') +
      pil(150, 196, 55) +
      fast.map(([x,y]) => `<rect class="sa-acc" x="${x}" y="${y}" width="24" height="24" rx="4"/>`).join(''));
  }
  return '';
}

/* ── forsidens loop: en markør der flytter mellem tre huse ───────────────── */
/* En lille isometrisk landsby. CDUL flytter fra hus til hus, og markøren tager
   husets farve, fordi det er hele dækkets præmis: det er rammen omkring
   afdelingen der afgør hvad opgaven er. */
function villageAnim(){
  const CY = 300, A = 76, T = A + 24;
  const HUS = [
    { cx:150, h:92,  navn:"HUM",     aar:"2020" },
    { cx:360, h:116, navn:"IAS PBL", aar:"2023" },
    { cx:570, h:140, navn:"ITS",     aar:"2026" }
  ];

  /* en kasse i 2:1-isometri: tagflade plus to sider */
  const kasse = (cx, h) => {
    const b = A / 2, ty = CY - h;
    return {
      top:   `${cx},${ty-b} ${cx+A},${ty} ${cx},${ty+b} ${cx-A},${ty}`,
      left:  `${cx-A},${ty} ${cx},${ty+b} ${cx},${CY+b} ${cx-A},${CY}`,
      right: `${cx+A},${ty} ${cx},${ty+b} ${cx},${CY+b} ${cx+A},${CY}`
    };
  };
  /* vinduesbånd med samme skævhed som den flade de ligger på */
  const baand = (cx, h) => {
    const b = A / 2, ty = CY - h;
    let out = '';
    for (let y = 24; y + 13 < h - 12; y += 29){
      out += `<polygon class="rude" points="${cx-A},${ty+y} ${cx},${ty+b+y} ${cx},${ty+b+y+13} ${cx-A},${ty+y+13}"/>`
           + `<polygon class="rude" points="${cx+A},${ty+y} ${cx},${ty+b+y} ${cx},${ty+b+y+13} ${cx+A},${ty+y+13}"/>`;
    }
    return out;
  };

  const byen = HUS.map((x, i) => {
    const k = kasse(x.cx, x.h);
    return `<g class="bld b${i}">
      <polygon class="grund" points="${x.cx},${CY-T/2} ${x.cx+T},${CY} ${x.cx},${CY+T/2} ${x.cx-T},${CY}"/>
      <polygon class="flade" points="${k.top}"/>
      <polygon class="flade" points="${k.left}"/>
      <polygon class="flade" points="${k.right}"/>
      <polygon class="skygge lys" points="${k.left}"/>
      <polygon class="skygge dyb" points="${k.right}"/>
      ${baand(x.cx, x.h)}
      <text class="v-navn" x="${x.cx}" y="382" text-anchor="middle">${x.navn}</text>
      <text class="v-aar"  x="${x.cx}" y="408" text-anchor="middle">${x.aar}</text>
    </g>`;
  }).join('');

  return `<svg class="vil" viewBox="0 0 720 450" aria-hidden="true">
    ${byen}
    <g class="mover">
      <rect x="-62" y="-26" width="124" height="52" rx="10"/>
      <text x="0" y="8" text-anchor="middle">CDUL</text>
    </g>
  </svg>
  <p class="t-anim-cap">samme rolle · nyt hus</p>`;
}

/* ── de tre organisationsdiagrammer ──────────────────────────────────────── */
/* Hvert diagram tegner det samme spørgsmål: hvor sidder CDUL, og hvordan når
   vi ud til fakulteterne? Kun svaret skifter. */

const facBox = (x, y, w, h, name) => `
  <g class="fac"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>
  <text class="fl" x="${x + w / 2}" y="${y + 38}" text-anchor="middle">${name}</text></g>`;

const ORG = {

  /* 2020–2022 · ét navngivet center, fem adresser */
  hum(){
    const FAC = ['HUM', 'SAMF', 'ENG', 'TECH', 'SUND'];
    const FW = 176, FGAP = 20, FX = 40, FY = 330, FH = 155;
    const fx = i => FX + i * (FW + FGAP);
    let out = '';

    /* det spredte center foroven: stiplet, fordi det ikke har en adresse */
    out += `<g class="hub ghost"><rect x="400" y="30" width="240" height="86" rx="14"/>
      <text class="hl" x="520" y="76" text-anchor="middle">CDUL</text>
      <text class="hs2" x="520" y="102" text-anchor="middle">decentraliseret</text></g>`;

    FAC.forEach((f, i) => {
      out += facBox(fx(i), FY, FW, FH, f);
      out += `<path class="fan dash" style="--d:${(i * .08).toFixed(2)}s" d="M 520 116 L ${fx(i) + FW / 2} ${FY}"/>`;
      const cx = fx(i) + 18;
      out += `<g class="chip${i === 0 ? ' me' : ''}">
        <rect x="${cx}" y="410" width="140" height="44" rx="9"/>
        <text x="${cx + 70}" y="438" text-anchor="middle">CDUL</text></g>`;
    });

    /* hvor jeg selv sad */
    out += `<path class="tick" d="M 128 485 L 128 498"/>
      <g class="mepill"><rect x="78" y="498" width="100" height="38" rx="9"/>
      <text x="128" y="524" text-anchor="middle">mig</text></g>`;

    return `<svg class="org" viewBox="0 0 ${OW} ${OH}" aria-hidden="true">${out}</svg>`;
  },

  /* 2023–2026 · ét center med én adresse, og rækkevidde på tværs */
  ias(){
    const FAC = ['SSH', 'ENG', 'TECH', 'SUND'];
    const FW = 200, FGAP = 40, FX = 60, FY = 350, FH = 100;
    const fx = i => FX + i * (FW + FGAP);
    let out = '';

    out += `<g class="hub"><rect x="380" y="30" width="280" height="76" rx="14"/>
      <text class="hl" x="520" y="78" text-anchor="middle">IAS PBL</text></g>`;
    out += `<path class="spine" d="M 520 106 L 520 150"/>`;
    out += `<g class="hub cdul"><rect x="400" y="150" width="240" height="76" rx="14"/>
      <text class="hl" x="520" y="198" text-anchor="middle">CDUL</text></g>`;

    FAC.forEach((f, i) => {
      out += facBox(fx(i), FY, FW, FH, f);
      out += `<path class="fan" style="--d:${(i * .09).toFixed(2)}s" d="M 520 226 L ${fx(i) + FW / 2} ${FY}"/>`;
    });

    out += `<path class="tick" d="M 360 188 L 400 188"/>
      <g class="mepill"><rect x="258" y="169" width="100" height="38" rx="9"/>
      <text x="308" y="195" text-anchor="middle">mig</text></g>`;
    out += `<text class="cap" x="520" y="500" text-anchor="middle">tværgående · institutionelt</text>`;

    return `<svg class="org" viewBox="0 0 ${OW} ${OH}" aria-hidden="true">${out}</svg>`;
  },

  /* april 2026 → · inde i it-organisationen, og linjen bagud er klippet over */
  its(){
    const FAC = ['SSH', 'ENG', 'TECH', 'SUND'];
    const FW = 200, FGAP = 40, FX = 60, FY = 372, FH = 100;
    const fx = i => FX + i * (FW + FGAP);
    const UNITS = [
      ['CDUL', ''], ['Moodle App.', 'Management'],
      ['IT-infra-', 'struktur'], ['IT-', 'sikkerhed'], ['UX-team', '']
    ];
    const CW = 136, CGAP = 16, CX = 148;
    const cx = i => CX + i * (CW + CGAP);
    let out = '';

    out += `<g class="its-box"><rect x="140" y="20" width="760" height="180" rx="16"/>
      <text class="itl" x="164" y="62">ITS · IT Service</text></g>`;

    UNITS.forEach((u, i) => {
      out += `<g class="unit${i === 0 ? ' cdul' : ''}">
        <rect x="${cx(i)}" y="90" width="${CW}" height="84" rx="10"/>
        ${u[1]
          ? `<text x="${cx(i) + CW / 2}" y="128" text-anchor="middle">${u[0]}</text>
             <text x="${cx(i) + CW / 2}" y="152" text-anchor="middle">${u[1]}</text>`
          : `<text class="big" x="${cx(i) + CW / 2}" y="140" text-anchor="middle">${u[0]}</text>`}
      </g>`;
    });

    FAC.forEach((f, i) => {
      out += facBox(fx(i), FY, FW, FH, f);
      out += `<path class="fan" style="--d:${(i * .09).toFixed(2)}s" d="M ${cx(0) + CW / 2} 174 L ${fx(i) + FW / 2} ${FY}"/>`;
    });

    /* den overklippede linje til det gamle hus */
    out += `<g class="cut">
      <rect x="20" y="258" width="150" height="68" rx="12"/>
      <text x="95" y="300" text-anchor="middle">IAS PBL</text>
      <path class="cutline" d="M 100 258 L 128 232"/>
      <path class="cutline" d="M 156 208 L 184 182"/>
      <path class="snip" d="M 134 214 L 152 232"/>
      <path class="snip" d="M 134 232 L 152 214"/>
    </g>`;

    out += `<text class="cap" x="560" y="518" text-anchor="middle">tættere på systemerne · længere fra forskerne</text>`;

    return `<svg class="org" viewBox="0 0 ${OW} ${OH}" aria-hidden="true">${out}</svg>`;
  }
};

/* ── byg alle slides én gang ─────────────────────────────────────────────── */
deckEl.innerHTML = SLIDES.map((s, i) =>
  `<section class="slide k-${s.kind}${s.lede ? ' has-lede' : ''}${s.accent ? ' ' + s.accent : ''}"
            id="sl-${s.id}" data-si="${i}">
     ${render[s.kind](s)}
   </section>`).join('');

/* springbræt: en oversigt man kan hoppe fra, fordi et interview sjældent
   bevæger sig i den rækkefølge man har planlagt */
const indexEl = $('index');
indexEl.innerHTML = `<p class="ix-head">Indhold</p><div class="ix-grid">` +
  SLIDES.map((s, i) => `
    <button class="ix-row${s.core ? ' core' : ''}" type="button" data-go="${i}">
      <b>${String(i + 1).padStart(2, '0')}</b>
      <span class="ix-t">${esc(s.title || DECK.title)}</span>
      <span class="ix-p">${esc(s.phase)}</span>
    </button>`).join('') +
  `</div><p class="ix-hint">Klik på et punkt, eller tryk <b>O</b> / <b>Esc</b> for at lukke ·
    <b>→</b> næste · <b>←</b> tilbage · <b>↓ ↑</b> hel slide · <b>V</b> vis alt ·
    <b>R</b> forfra · <b>F</b> fuldskærm · <b>D</b> lys eller mørk<br>Prikken markerer den korte rute: de slides
    der bærer fortællingen, hvis klokken løber fra dig.</p>`;

/* Lys eller mørk. Dækket starter altid lyst, medmindre man selv har valgt om:
   en præsentation skal se ens ud hver gang man åbner den, også på en fremmed
   maskine der står i mørkt tema. Valget huskes, hvis browseren tillader det. */
function setTheme(t){
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('cdul-tema', t); } catch {}
}
function toggleTheme(){
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}
try {
  const gemt = localStorage.getItem('cdul-tema');
  if (gemt) document.documentElement.dataset.theme = gemt;
} catch {}

/* fuldskærm: et tastetryk tæller som den brugerhandling browseren kræver */
function toggleFull(){
  const d = document;
  if (d.fullscreenElement) d.exitFullscreen?.();
  else d.documentElement.requestFullscreen?.().catch(() => {});
}

function toggleIndex(on){
  indexEl.classList.toggle('open', on === undefined ? !indexEl.classList.contains('open') : on);
}
indexEl.addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if (!b) return;
  si = +b.dataset.go; n = reduced ? lastStep(si) : -1;
  toggleIndex(false); apply();
});

const slides = [...deckEl.querySelectorAll('.slide')];
const revealables = slides.map(el => [...el.querySelectorAll('.rv')]);

/* ── trinmaskinen ────────────────────────────────────────────────────────── */
let si = 0, n = -1;

const lastStep = i => SLIDES[i].steps.length - 1;
const BEATS = SLIDES.reduce((a, s) => a + s.steps.length + 1, 0);
const beatsBefore = i => SLIDES.slice(0, i).reduce((a, s) => a + s.steps.length + 1, 0);

function apply(){
  si = Math.max(0, Math.min(si, SLIDES.length - 1));
  n  = Math.max(-1, Math.min(n, lastStep(si)));

  slides.forEach((el, i) => {
    el.classList.toggle('is-active', i === si);
    el.classList.toggle('done', i === si && n === lastStep(i) && n > -1);
    if (i === si) revealables[i].forEach(p => {
      p.classList.toggle('on', +p.dataset.i <= n);
      p.classList.toggle('now', +p.dataset.i === n);
    });
  });

  const s = SLIDES[si];
  phaseEl.textContent = s.phase;
  clockEl.textContent = s.clock ? `min. ${s.clock}` : '';
  countEl.textContent = `${si + 1} / ${SLIDES.length}`;
  progress.style.width = ((beatsBefore(si) + n + 2) / BEATS * 100) + '%';

  rememberPlace();
}

/* Så et nedbrud, en genindlæsning eller en sovende maskine ikke koster pladsen
   i dækket. Skrivningen er forsinket, fordi browseren struber history-kald: at
   holde piletasten nede ville ellers ramme loftet og tabe de sidste skridt.
   replaceState kaster desuden på file:// i nogle browsere, deraf try/catch. */
let placeTimer;
function rememberPlace(){
  clearTimeout(placeTimer);
  placeTimer = setTimeout(() => {
    try { history.replaceState(null, '', `#${si}.${n}`); } catch {}
  }, 400);
}

function next(){ n < lastStep(si) ? n++ : (si < SLIDES.length - 1 && (si++, n = reduced ? lastStep(si) : -1)); apply(); }
function prev(){ n > -1 ? n-- : (si > 0 && (si--, n = lastStep(si))); apply(); }
function goSlide(d){ si += d; n = reduced ? lastStep(si) : -1; apply(); }

addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === ' ' || k === 'PageDown'){ e.preventDefault(); next(); }
  else if (k === 'ArrowLeft' || k === 'PageUp'){ e.preventDefault(); prev(); }
  else if (k === 'ArrowDown'){ e.preventDefault(); goSlide(1); }
  else if (k === 'ArrowUp'){ e.preventDefault(); goSlide(-1); }
  else if (k === 'r' || k === 'R'){ n = -1; apply(); }
  else if (k === 'v' || k === 'V'){ n = lastStep(si); apply(); }
  else if (k === 'f' || k === 'F'){ e.preventDefault(); toggleFull(); }
  else if (k === 'o' || k === 'O'){ e.preventDefault(); toggleIndex(); }
  else if (k === 'd' || k === 'D'){ toggleTheme(); }
  else if (k === 'Escape'){ toggleIndex(false); }
  else if (k === 'Home'){ si = 0; n = -1; apply(); }
});

bNext.onclick = next; bPrev.onclick = prev;
$('bIndex').onclick = () => toggleIndex();
$('bFull').onclick  = toggleFull;
$('bTheme').onclick = toggleTheme;
bAll.onclick  = () => { n = lastStep(si); apply(); };

/* ── skalér lærredet ─────────────────────────────────────────────────────── */
function fitStage(){
  stage.style.transform =
    `translate(-50%,-50%) scale(${Math.min(innerWidth / W, innerHeight / H)})`;
}
addEventListener('resize', fitStage);
fitStage();

/* dybt link ved indlæsning: #slide.trin — apply() holder det opdateret undervejs */
const m = /^#(\d+)(?:\.(-?\d+))?$/.exec(location.hash);
if (m){ si = +m[1]; n = m[2] === undefined ? -1 : +m[2]; }
apply();
