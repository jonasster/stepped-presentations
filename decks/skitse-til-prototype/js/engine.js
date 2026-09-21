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

/* ── fælles byggeklodser ─────────────────────────────────────────────────── */
function head(s){
  return `<header class="slide-head">
    <p class="kicker">${esc(s.phase)}</p>
    <h2>${esc(s.title)}</h2>
    ${s.lede ? `<p class="lede">${esc(s.lede)}</p>` : ''}
  </header>`;
}

/* kompakt trinliste — brugt af alle todelte slides */
function stepList(s){
  return `<ol class="tight">` + s.steps.map((x, i) => `
    <li class="rv trow" data-i="${i}">
      <b class="num">${i + 1}</b>
      <div>
        <h3>${esc(x.t)}</h3>
        ${x.cmd ? `<code>${esc(x.cmd)}</code>` : ''}
        <p>${esc(x.d)}</p>
      </div>
    </li>`).join('') + `</ol>`;
}

/* ── layout-tegnere, én pr. kind ─────────────────────────────────────────── */
const render = {

  /* 1 · forsiden: tekst til venstre, en prototype der bygger sig selv til højre */
  title(s){
    return `<div class="t-grid">
      <div class="t-text">
        <p class="kicker">${esc(s.phase)}</p>
        <h1>${esc(DECK.title)}</h1>
        <p class="lede t-lede">${esc(DECK.lede)}</p>
        <p class="t-meta">${esc(DECK.meta)}</p>
        <p class="t-keys">→ næste · ← tilbage · ↓ næste slide · F vis alt</p>
      </div>
      <div class="t-anim">${protoAnim()}</div>
    </div>`;
  },

  /* skærmbillede til højre, trin til venstre */
  shot(s){
    return head(s) + `<div class="body split">
      <div class="col-steps">${stepList(s)}</div>
      <figure class="shotfig">
        <img src="${esc(s.shot)}" alt="">
        <figcaption>${esc(s.shotCap)}</figcaption>
      </figure>
    </div>`;
  },

  /* otte felter, otte minutter */
  crazy8(s){
    return head(s) + `<div class="body split">
      <div class="col-steps">${stepList(s)}</div>
      <div class="scene-box">${crazyGrid()}</div>
    </div>`;
  },

  /* tre skærme med pile imellem */
  screens(s){
    return head(s) + `<div class="body split">
      <div class="col-steps">${stepList(s)}</div>
      <div class="scene-box">${threeScreens()}</div>
    </div>`;
  },

  /* vandret række kort, 3 eller 4 */
  cards(s){
    const n = s.steps.length;
    const gap = 24, w = Math.round((USABLE - gap * (n - 1)) / n);
    return head(s) + `<div class="body cards" style="--gap:${gap}px">` +
      s.steps.map((x, i) => `
        <article class="rv card" data-i="${i}" style="width:${w}px">
          <b class="num">${i + 1}</b>
          <h3>${esc(x.t)}</h3>
          <p>${esc(x.d)}</p>
        </article>`).join('') + `</div>`;
  },

  /* nummereret liste i fuld bredde */
  steps(s){
    return head(s) + `<div class="body steps">` +
      s.steps.map((x, i) => `
        <div class="rv srow" data-i="${i}">
          <b class="num">${i + 1}</b>
          <div class="scol">
            <h3>${esc(x.t)}</h3>
            ${x.cmd ? `<code>${esc(x.cmd)}</code>` : ''}
          </div>
          <p>${esc(x.d)}</p>
        </div>`).join('') + `</div>`;
  },

  /* casen: ét indrammet brief med fire rækker */
  brief(s){
    return head(s) + `<div class="body brief">
      <p class="brief-tag">Spor A</p>` +
      s.steps.map((x, i) => `
        <div class="rv brow" data-i="${i}">
          <h3>${esc(x.t)}</h3>
          <p>${esc(x.d)}</p>
        </div>`).join('') + `</div>`;
  },

  /* tre prompts, stablet, med den rigtige ordlyd i mono */
  prompts(s){
    return head(s) + `<div class="body prompts">` +
      s.steps.map((x, i) => `
        <div class="rv prow" data-i="${i}">
          <div class="phead"><h3>${esc(x.t)}</h3><span>${esc(x.d)}</span></div>
          <code>${esc(x.p)}</code>
        </div>`).join('') + `</div>`;
  },

  /* tidslinje: otte knuder på én akse */
  timeline(s){
    const n = s.steps.length, X0 = 250, X1 = 1670, AY = 640;
    const col = (X1 - X0) / (n - 1);
    const xOf = i => Math.round(X0 + i * col);
    return head(s) + `<div class="body scene">
      <div class="axis" style="left:${X0}px;width:${X1 - X0}px;top:${AY}px"></div>` +
      s.steps.map((x, i) => `
        <div class="rv tknot" data-i="${i}" style="left:${xOf(i)}px;top:${AY}px"></div>
        <div class="rv tname" data-i="${i}" style="left:${xOf(i)}px;top:${AY - 40}px;width:${Math.round(col)}px">${esc(x.t)}</div>
        <div class="rv ttime" data-i="${i}" style="left:${xOf(i)}px;top:${AY + 34}px">${esc(x.d)}</div>`
      ).join('') + `</div>`;
  },

  /* kurven: detaljeringsgrad mod villighed til at lave om */
  curve(s){
    const X = 130, Y = 470, CW = 900, CH = 470;
    const p = `M 70 70 C 300 110, 420 300, 860 400`;
    return head(s) + `<div class="body scene">
      <svg class="cv" viewBox="0 0 ${CW} ${CH}" width="${CW}" height="${CH}"
           style="left:${X}px;top:${Y}px" aria-hidden="true">
        <line class="ax" x1="70" y1="40" x2="70" y2="420"/>
        <line class="ax" x1="70" y1="420" x2="880" y2="420"/>
        <path class="cvline rv" data-i="0" d="${p}"/>
        <circle class="cvdot rv lo" data-i="0" cx="70" cy="70" r="11"/>
        <circle class="cvdot rv hi" data-i="1" cx="860" cy="400" r="11"/>
        <text class="cvlab rv" data-i="0" x="96" y="76">skitse</text>
        <text class="cvlab rv hiy" data-i="1" x="846" y="352" text-anchor="end">færdigt design</text>
      </svg>
      <p class="cvaxis y" style="left:${X - 6}px;top:${Y + 210}px">villighed til at lave om</p>
      <p class="cvaxis x" style="left:${X + 70}px;top:${Y + 432}px">detaljeringsgrad</p>
      <div class="cvnotes" style="left:${X + CW + 40}px;top:${Y - 10}px">` +
      s.steps.map((x, i) => `
        <div class="rv cvnote" data-i="${i}">
          <h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
        </div>`).join('') + `</div></div>`;
  },

  /* byggeloopet: fire trin på tværs af hele bredden, og en vej tilbage under dem */
  loop(s){
    const n = s.steps.length, GAP = 90, CARD = Math.round((USABLE - GAP * (n - 1)) / n);
    const TOP = 470, CH = 190, ARROW_Y = TOP + 86;
    const xOf = i => PAD + i * (CARD + GAP);
    const midOf = i => xOf(i) + CARD / 2;

    const cards = s.steps.map((x, i) => `
      <div class="rv lnode" data-i="${i}"
           style="left:${xOf(i)}px;top:${TOP}px;width:${CARD}px;min-height:${CH}px">
        <b class="num">${i + 1}</b><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
      </div>`).join('');

    const arrows = [0, 1, 2].map(i => `
      <path class="rv larrow" data-i="${i + 1}" marker-end="url(#ah)"
            d="M ${xOf(i) + CARD + 14} ${ARROW_Y} L ${xOf(i + 1) - 16} ${ARROW_Y}"/>`).join('');

    /* vejen tilbage: fra sidste kort, under rækken, op i det første igen */
    const BOT = TOP + CH + 16, LOW = BOT + 130, R = 40;
    const back = `M ${midOf(3)} ${BOT} L ${midOf(3)} ${LOW - R} `
               + `Q ${midOf(3)} ${LOW} ${midOf(3) - R} ${LOW} `
               + `L ${midOf(0) + R} ${LOW} Q ${midOf(0)} ${LOW} ${midOf(0)} ${LOW - R} `
               + `L ${midOf(0)} ${BOT + 6}`;

    return head(s) + `<div class="body scene">
      <svg class="ring" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7"
          orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>
        ${arrows}
        <path class="rv lback" data-i="3" marker-end="url(#ah)" d="${back}"/>
      </svg>
      <div class="orbit" style="offset-path:path('${back}')"></div>
      <p class="lcenter" style="left:${W / 2}px;top:${LOW}px">og forfra · ca. 10 min. pr. runde</p>
      ${cards}</div>`;
  }
};

/* ── tegninger ───────────────────────────────────────────────────────────── */

/* forsidens loop: en skitse der bliver til en grænseflade, og forfra */
function protoAnim(){
  return `<svg viewBox="0 0 720 520" width="720" height="520" aria-hidden="true">
    <rect class="win" x="20" y="20" width="680" height="470" rx="18"/>
    <path class="winbar" d="M 20 38 A 18 18 0 0 1 38 20 L 682 20 A 18 18 0 0 1 700 38 L 700 74 L 20 74 Z"/>
    <circle class="wdot" cx="52" cy="47" r="6"/><circle class="wdot" cx="74" cy="47" r="6"/>
    <circle class="wdot" cx="96" cy="47" r="6"/>

    <g class="sk" fill="none">
      <rect x="70" y="112" width="560" height="54" rx="6" transform="rotate(-.5 350 139)"/>
      <line x1="96" y1="139" x2="300" y2="139"/>
      <rect x="70" y="196" width="560" height="82" rx="6" transform="rotate(.4 350 237)"/>
      <line x1="100" y1="224" x2="380" y2="224"/><line x1="100" y1="252" x2="250" y2="252"/>
      <rect x="70" y="296" width="560" height="82" rx="6" transform="rotate(-.3 350 337)"/>
      <line x1="100" y1="324" x2="360" y2="324"/><line x1="100" y1="352" x2="230" y2="352"/>
      <rect x="390" y="404" width="240" height="58" rx="8" transform="rotate(.6 510 433)"/>
      <line x1="430" y1="433" x2="590" y2="433"/>
    </g>

    <g class="ui">
      <rect class="bar" x="70" y="112" width="560" height="54" rx="8"/>
      <rect class="barln" x="96" y="132" width="190" height="14" rx="7"/>
      <g class="urow"><rect class="ubox" x="70" y="196" width="560" height="82" rx="10"/>
        <circle class="pip" cx="104" cy="237" r="11"/>
        <rect class="ln" x="134" y="216" width="290" height="14" rx="7"/>
        <rect class="ln s" x="134" y="244" width="160" height="12" rx="6"/></g>
      <g class="urow"><rect class="ubox" x="70" y="296" width="560" height="82" rx="10"/>
        <circle class="pip" cx="104" cy="337" r="11"/>
        <rect class="ln" x="134" y="316" width="250" height="14" rx="7"/>
        <rect class="ln s" x="134" y="344" width="200" height="12" rx="6"/></g>
      <rect class="btn" x="390" y="404" width="240" height="58" rx="10"/>
      <rect class="btnln" x="438" y="426" width="144" height="14" rx="7"/>
    </g>

    <g class="cur"><path d="M 0 0 L 0 22 L 6 17 L 11 27 L 16 24 L 11 15 L 18 14 Z"/></g>
  </svg>
  <p class="t-anim-cap"><span class="l1">skitse</span><span class="l2">prototype</span></p>`;
}

/* otte felter: rammerne først, så idéerne, så den ene der bliver valgt */
function crazyGrid(){
  const CW = 246, CH = 228, GX = 16, GY = 20, X0 = 10, Y0 = 10;
  let out = '';
  for (let i = 0; i < 8; i++){
    const x = X0 + (i % 4) * (CW + GX), y = Y0 + Math.floor(i / 4) * (CH + GY);
    out += `<g class="c8 rv" data-i="0"><rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="10"/></g>`;
    out += `<g class="c8i rv" data-i="1">${cellArt(i, x, y, CW)}</g>`;
  }
  const hx = X0 + 1 * (CW + GX), hy = Y0 + 1 * (CH + GY);
  out += `<g class="c8pick rv" data-i="2">
    <rect x="${hx - 9}" y="${hy - 9}" width="${CW + 18}" height="${CH + 18}" rx="14"/>
    <text x="${hx + CW / 2}" y="${hy + CH + 40}" text-anchor="middle">den her</text></g>`;
  return `<svg viewBox="0 0 1040 560" width="1040" height="560" aria-hidden="true">${out}</svg>`;
}

/* otte forskellige krusseduller, så det ligner otte idéer og ikke ét mønster */
function cellArt(i, x, y, w){
  const p = 26, X = x + p, Y = y + p, iw = w - p * 2;
  const bar = `<rect class="k" x="${X}" y="${Y}" width="${iw}" height="18" rx="4"/>`;
  const line = (dy, f) => `<line class="k" x1="${X}" y1="${Y + dy}" x2="${X + iw * f}" y2="${Y + dy}"/>`;
  const btn = dy => `<rect class="k f" x="${X + iw - 88}" y="${Y + dy}" width="88" height="28" rx="6"/>`;
  const box = (dy, hh) => `<rect class="k" x="${X}" y="${Y + dy}" width="${iw}" height="${hh}" rx="6"/>`;
  const circ = dy => `<circle class="k" cx="${X + 20}" cy="${Y + dy}" r="17"/>`;
  return [
    bar + line(48, 1) + line(72, .7) + btn(106),
    bar + box(42, 50) + box(104, 50),
    circ(56) + line(48, .55) + line(72, .4) + btn(112),
    bar + line(48, .9) + line(72, .6) + line(96, .8) + btn(128),
    box(8, 64) + line(96, .8) + line(120, .5) + btn(144),
    bar + circ(72) + line(64, .5) + line(88, .35) + btn(124),
    bar + line(48, .8) + box(66, 44) + btn(130),
    box(2, 40) + box(54, 40) + box(106, 40) + btn(158)
  ][i];
}

/* tre skærme, pile imellem, og ordene på knapperne */
function threeScreens(){
  const FW = 280, FH = 400, Y = 60, XS = [20, 380, 740];
  const label = ['oversigt', 'detalje', 'kvittering'];
  const btn   = ['Se detaljer', 'Kvittér for givet', 'Færdig'];
  let out = '';
  XS.forEach((x, i) => {
    const X = x + 26, iw = FW - 52;
    out += `<g class="sc rv" data-i="0">
      <rect x="${x}" y="${Y}" width="${FW}" height="${FH}" rx="12"/>
      <rect class="k" x="${X}" y="${Y + 34}" width="${iw}" height="20" rx="5"/>
      <line class="k" x1="${X}" y1="${Y + 96}" x2="${X + iw}" y2="${Y + 96}"/>
      <line class="k" x1="${X}" y1="${Y + 128}" x2="${X + iw * .7}" y2="${Y + 128}"/>
      <line class="k" x1="${X}" y1="${Y + 176}" x2="${X + iw}" y2="${Y + 176}"/>
      <line class="k" x1="${X}" y1="${Y + 208}" x2="${X + iw * .55}" y2="${Y + 208}"/>
      <text class="scnum" x="${x + FW / 2}" y="${Y - 16}" text-anchor="middle">${i + 1} · ${label[i]}</text>
    </g>
    <g class="scb rv" data-i="2">
      <rect x="${X}" y="${Y + 292}" width="${iw}" height="52" rx="8"/>
      <text x="${X + iw / 2}" y="${Y + 324}" text-anchor="middle">${btn[i]}</text>
    </g>`;
  });
  [0, 1].forEach(i => {
    const x1 = XS[i] + FW + 16, x2 = XS[i + 1] - 16, my = Y + FH / 2;
    out += `<path class="scarrow rv" data-i="1" marker-end="url(#ah2)"
      d="M ${x1} ${my} L ${x2} ${my}"/>`;
  });
  return `<svg viewBox="0 0 1040 520" width="1040" height="520" aria-hidden="true">
    <defs><marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7"
      orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${out}</svg>`;
}

/* ── byg alle slides én gang ─────────────────────────────────────────────── */
deckEl.innerHTML = SLIDES.map((s, i) =>
  `<section class="slide k-${s.kind}${s.lede ? ' has-lede' : ''}" id="sl-${s.id}" data-si="${i}">
     ${render[s.kind](s)}
   </section>`).join('');

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
  clockEl.textContent = s.clock;
  countEl.textContent = `${si + 1} / ${SLIDES.length}`;
  progress.style.width = ((beatsBefore(si) + n + 2) / BEATS * 100) + '%';
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
  else if (k === 'f' || k === 'F'){ n = lastStep(si); apply(); }
  else if (k === 'Home'){ si = 0; n = -1; apply(); }
});

bNext.onclick = next; bPrev.onclick = prev;
bAll.onclick  = () => { n = lastStep(si); apply(); };

/* ── skalér lærredet ─────────────────────────────────────────────────────── */
function fitStage(){
  stage.style.transform =
    `translate(-50%,-50%) scale(${Math.min(innerWidth / W, innerHeight / H)})`;
}
addEventListener('resize', fitStage);
fitStage();

/* dybt link ved indlæsning: #slide.trin — skrives ikke tilbage undervejs */
const m = /^#(\d+)(?:\.(-?\d+))?$/.exec(location.hash);
if (m){ si = +m[1]; n = m[2] === undefined ? -1 : +m[2]; }
apply();
