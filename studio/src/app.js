/* Stepped Studio v0 — a single page that edits a deck in place.
 *
 * No server, no build for the user: the File System Access API hands us a real
 * directory handle, DeckDoc does the write-back, and the preview is the actual
 * deck file running in an iframe. Nothing is injected into the deck, so what you
 * see is literally the bytes that will be saved.
 */
import { DeckDoc } from './deckdoc.js';

const $ = s => document.querySelector(s);
const elm = (t, c, txt) => { const n = document.createElement(t);
  if (c) n.className = c; if (txt != null) n.textContent = txt; return n; };
const isColor = v => typeof v === 'string' && /^#[0-9a-f]{3,8}$/i.test(v.trim());

const S = {
  mode: null,            // 'fsa' | 'readonly' | 'demo'
  files: new Map(),      // path -> { handle, file }
  entry: 'index.html',   // what the iframe loads
  dataPath: '',          // the file that holds the content array
  dataHandle: null,
  base: '',              // the data file as it is on disk
  patches: [],
  sel: null,             // selected item id
  trail: [],             // nav keys pressed, replayed after a preview reload
  stamp: 0,
  urls: [],
};

const current = () => S.patches.length
  ? new DeckDoc(S.base).apply(S.patches).commit() : S.base;
const view = () => new DeckDoc(current());

/* ── patch queue ─────────────────────────────────────────────────────────── */
const sameTarget = (a, b) =>
  a && b && a.op === b.op &&
  (a.op === 'setField' ? a.item === b.item && a.field === b.field
   : a.op === 'reorder' ? true : a.name === b.name);

function push(patch, { live } = {}) {
  const last = S.patches[S.patches.length - 1];
  if (sameTarget(last, patch)) S.patches[S.patches.length - 1] = patch;
  else S.patches.push(patch);
  render();
  live ? live() : reloadPreview();
}
function undo() {
  S.patches.pop();
  render();
  reloadPreview();
}

/* ── opening ─────────────────────────────────────────────────────────────── */
async function collect(dir, prefix = '', depth = 0, out = new Map()) {
  if (depth > 4) return out;
  for await (const [name, handle] of dir.entries()) {
    if (name.startsWith('.') || name === 'node_modules') continue;
    const path = prefix + name;
    if (handle.kind === 'file') out.set(path, { handle, file: await handle.getFile() });
    else await collect(handle, path + '/', depth + 1, out);
  }
  return out;
}

/* the data file is whichever file DeckDoc can actually read a content array out of */
async function locateData(files) {
  const order = [...files.keys()].sort((a, b) =>
    (a.endsWith('.html') ? 0 : 1) - (b.endsWith('.html') ? 0 : 1) ||
    a.split('/').length - b.split('/').length);
  for (const path of order) {
    if (!/\.(html?|js)$/i.test(path)) continue;
    const text = await files.get(path).file.text();
    try { new DeckDoc(text); return { path, text }; } catch { /* next */ }
  }
  return null;
}

async function openFolder() {
  try {
    const dir = await showDirectoryPicker({ mode: 'readwrite' });
    const files = await collect(dir);
    const found = await locateData(files);
    if (!found) return fail('No deck data found. Looked for a content array in every .html and .js file.');
    const entry = [...files.keys()].find(p => /(^|\/)index\.html$/i.test(p))
               || [...files.keys()].find(p => p.endsWith('.html'))
               || found.path;
    Object.assign(S, {
      mode: 'fsa', files, entry, dataPath: found.path,
      dataHandle: files.get(found.path).handle,
      base: found.text, patches: [], sel: null, trail: [],
      stamp: files.get(found.path).file.lastModified,
    });
    start();
  } catch (e) { if (e.name !== 'AbortError') fail(e.message); }
}

async function openFile() {
  try {
    const [handle] = await showOpenFilePicker({
      types: [{ description: 'Deck', accept: { 'text/html': ['.html', '.htm'] } }] });
    const file = await handle.getFile(), text = await file.text();
    new DeckDoc(text);                       // throws here if it is not a deck
    Object.assign(S, {
      mode: 'fsa', files: new Map(), entry: file.name, dataPath: file.name,
      dataHandle: handle, base: text, patches: [], sel: null, trail: [],
      stamp: file.lastModified,
    });
    start();
  } catch (e) { if (e.name !== 'AbortError') fail(e.message); }
}

/* load-only fallback for browsers without the File System Access API */
function openUpload(input) {
  const list = [...input.files];
  if (!list.length) return;
  const files = new Map(list.map(f =>
    [f.webkitRelativePath?.split('/').slice(1).join('/') || f.name, { handle: null, file: f }]));
  locateData(files).then(found => {
    if (!found) return fail('No deck data found in that folder.');
    Object.assign(S, {
      mode: 'readonly', files,
      entry: [...files.keys()].find(p => /(^|\/)index\.html$/i.test(p)) || found.path,
      dataPath: found.path, dataHandle: null, base: found.text,
      patches: [], sel: null, trail: [], stamp: 0,
    });
    start();
  });
}

function openDemo() {
  Object.assign(S, {
    mode: 'demo', files: new Map(), entry: 'index.html', dataPath: 'starter.html',
    dataHandle: null, base: window.DEMO_SOURCE, patches: [], sel: null, trail: [], stamp: 0,
  });
  start();
}

function fail(msg) { $('#err').textContent = msg; $('#err').hidden = false; }
function start() {
  $('#err').hidden = true;
  $('#welcome').hidden = true;
  $('#app').hidden = false;
  render();
  reloadPreview();
}

/* ── saving ──────────────────────────────────────────────────────────────── */
async function save() {
  if (S.mode !== 'fsa') return download();
  const out = current();
  const w = await S.dataHandle.createWritable();
  await w.write(out); await w.close();
  S.base = out; S.patches = [];
  S.stamp = (await S.dataHandle.getFile()).lastModified;
  render(); flash('Saved to ' + S.dataPath);
}
function download() {
  const a = elm('a'); a.download = S.dataPath.split('/').pop();
  a.href = URL.createObjectURL(new Blob([current()], { type: 'text/html' }));
  a.click();
  flash('Downloaded — this browser cannot write in place.');
}
function flash(msg) {
  const n = $('#flash'); n.textContent = msg; n.hidden = false;
  clearTimeout(flash.t); flash.t = setTimeout(() => n.hidden = true, 2600);
}

/* someone else — Claude, an editor — may write the same file while we hold it */
setInterval(async () => {
  if (S.mode !== 'fsa' || !S.dataHandle) return;
  const f = await S.dataHandle.getFile();
  $('#stale').hidden = f.lastModified <= S.stamp;
}, 2000);

async function reloadFromDisk() {
  const f = await S.dataHandle.getFile();
  S.base = await f.text(); S.patches = []; S.stamp = f.lastModified;
  $('#stale').hidden = true;
  render(); reloadPreview();
}

/* ── preview ─────────────────────────────────────────────────────────────── */
async function previewHtml() {
  S.urls.forEach(URL.revokeObjectURL); S.urls = [];
  let html = S.files.has(S.entry)
    ? (S.entry === S.dataPath ? current() : await S.files.get(S.entry).file.text())
    : current();
  // a blob: URL breaks every relative path, so resolve each referenced file to
  // its own blob and substitute the path — the same trap verification.md warns
  // about with data: previews.
  for (const [path, { file }] of S.files) {
    if (path === S.entry) continue;
    if (!html.includes(path)) continue;
    const blob = path === S.dataPath
      ? new Blob([current()], { type: 'text/javascript' }) : file;
    const url = URL.createObjectURL(blob); S.urls.push(url);
    html = html.split(path).join(url);
  }
  return html;
}

let reloadT;
function reloadPreview() {
  clearTimeout(reloadT);
  reloadT = setTimeout(async () => {
    const url = URL.createObjectURL(new Blob([await previewHtml()], { type: 'text/html' }));
    S.urls.push(url);
    $('#frame').src = url;
  }, 120);
}

$('#frame').addEventListener('load', () => {
  const w = $('#frame').contentWindow, d = $('#frame').contentDocument;
  if (!d) return;
  // replay the presenter's position so an edit does not knock you back to slide 1
  for (const k of S.trail) d.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  w.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowLeft', ' ', 'r', 'R', 'f', 'F'].includes(e.key)) {
      e.key === 'r' || e.key === 'R' ? S.trail = [] : S.trail.push(e.key);
    }
  });
  d.addEventListener('click', e => selectFromCanvas(e.target), true);
  setTimeout(checkBounds, 400);
});

/* click-to-select without any binding attributes: match the clicked element's
   text against the item field values we already know. */
function selectFromCanvas(node) {
  const items = view().readItems();
  for (let n = node; n && n.tagName !== 'BODY'; n = n.parentElement) {
    const id = n.dataset?.id ?? (n.dataset?.i != null ? items[+n.dataset.i]?.id : null);
    if (id && items.some(i => i.id === id)) return select(id);
    const t = n.textContent?.trim();
    if (!t || t.length > 200) continue;
    const hit = items.find(i => Object.entries(i)
      .some(([k, v]) => k !== 'id' && typeof v === 'string' && v.trim() === t));
    if (hit) return select(hit.id);
  }
}
function select(id) { S.sel = id; render(); }

/* A geometry slider can push content off the canvas with no error at all — the
 * presenter finds out on a projector. Measure every step, not just the visible
 * one: a deck hides its inactive slides with opacity/visibility, so we lift that
 * for the measurement. No paint happens in between because nothing here yields,
 * and it touches the preview only — never the file. */
function checkBounds() {
  const d = $('#frame').contentDocument, stage = d?.getElementById('stage');
  if (!stage) return ($('#bounds').hidden = true);

  const lift = d.createElement('style');
  // transitions animate over time, so a class change read immediately still
  // reports the OLD geometry — suppress them or the measurement is a lie
  lift.textContent = '*{transition:none!important;animation:none!important}' +
                     '.slide,[class*=slide]{opacity:1!important;visibility:visible!important}';
  d.head.appendChild(lift);
  // an unrevealed item is usually scaled down, so measuring the current step
  // under-reports. `.on` is the house convention for "revealed" (SKILL.md), so
  // turn everything on for the measurement and put it back afterwards.
  const off = [...stage.querySelectorAll(':not(.on)')];
  off.forEach(n => n.classList.add('on'));

  const sr = stage.getBoundingClientRect();
  const W = stage.offsetWidth || 1920, H = stage.offsetHeight || 1080;
  const k = sr.width / W;
  let worst = 0;
  for (const n of stage.querySelectorAll('*')) {
    if (d.defaultView.getComputedStyle(n).display === 'none') continue;
    const r = n.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    worst = Math.max(worst, (r.right - sr.left) / k - W, (sr.left - r.left) / k,
                            (r.bottom - sr.top) / k - H, (sr.top - r.top) / k);
  }
  off.forEach(n => n.classList.remove('on'));
  lift.remove();

  $('#bounds').hidden = worst < 1;
  $('#bounds').textContent = `Content runs ${Math.round(worst)}px past the canvas edge`;
}

/* ── live preview without a reload, for text and colour ──────────────────── */
function livePatchText(oldV, newV) {
  const d = $('#frame').contentDocument; if (!d || !oldV) return;
  const walk = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walk.nextNode());)
    if (n.nodeValue.trim() === oldV.trim()) n.nodeValue = n.nodeValue.replace(oldV, newV);
}
function livePatchColor(oldV, newV) {
  const d = $('#frame').contentDocument; if (!d) return;
  for (const n of d.querySelectorAll('[style]')) {
    const s = n.getAttribute('style');
    if (s.toLowerCase().includes(oldV.toLowerCase()))
      n.setAttribute('style', s.replace(new RegExp(oldV, 'gi'), newV));
  }
}
const livePatchToken = (name, v) =>
  $('#frame').contentDocument?.documentElement.style.setProperty(name, v);

/* ── render ──────────────────────────────────────────────────────────────── */
function render() {
  const v = view(), items = v.readItems();
  $('#file').textContent = S.dataPath + (S.mode === 'demo' ? '  (demo)' : '');
  $('#dirty').textContent = S.patches.length ? `${S.patches.length} unsaved` : 'no changes';
  $('#dirty').classList.toggle('on', !!S.patches.length);
  $('#save').disabled = !S.patches.length;
  $('#undo').disabled = !S.patches.length;
  $('#save').textContent = S.mode === 'fsa' ? 'Save' : 'Download';

  /* outline */
  const list = $('#outline'); list.textContent = '';
  items.forEach((it, i) => {
    const row = elm('div', 'row' + (it.id === S.sel ? ' sel' : ''));
    row.draggable = true;
    row.append(elm('span', 'dot'), elm('span', 'nm', it.name ?? it.label ?? it.id),
               elm('span', 'sub', it.label ?? ''));
    row.querySelector('.dot').style.background = it.color || 'var(--line)';
    row.onclick = () => select(it.id);
    row.ondragstart = e => e.dataTransfer.setData('text/plain', String(i));
    row.ondragover = e => { e.preventDefault(); row.classList.add('over'); };
    row.ondragleave = () => row.classList.remove('over');
    row.ondrop = e => {
      e.preventDefault(); row.classList.remove('over');
      const from = +e.dataTransfer.getData('text/plain');
      if (from === i) return;
      const order = items.map((_, k) => k);
      order.splice(i, 0, ...order.splice(from, 1));
      push({ op: 'reorder', order });
    };
    list.append(row);
  });

  /* inspector */
  const ins = $('#inspector'); ins.textContent = '';
  if (S.sel && v.byId.has(S.sel)) {
    ins.append(elm('h2', null, 'Item'));
    for (const [field, value] of v.fieldsOf(S.sel)) {
      ins.append(elm('label', null, field));
      if (isColor(value)) {
        const wrap = elm('div', 'colorrow');
        const pick = elm('input'); pick.type = 'color'; pick.value = value;
        const hex = elm('input', 'hex'); hex.value = value;
        const set = nv => {
          const old = view().readItems().find(i => i.id === S.sel)[field];
          hex.value = pick.value = nv;
          push({ op: 'setField', item: S.sel, field, value: nv },
               { live: () => livePatchColor(old, nv) });
        };
        pick.oninput = () => set(pick.value);
        hex.onchange = () => isColor(hex.value) && set(hex.value.trim());
        wrap.append(pick, hex); ins.append(wrap);
      } else {
        const long = value.length > 48;
        const inp = elm(long ? 'textarea' : 'input');
        inp.value = value; if (long) inp.rows = 3;
        inp.oninput = () => {
          const old = view().readItems().find(i => i.id === S.sel)[field];
          push({ op: 'setField', item: S.sel, field, value: inp.value },
               { live: () => livePatchText(old, inp.value) });
          inp.focus();
        };
        ins.append(inp);
      }
    }
  } else {
    ins.append(elm('p', 'hint', 'Pick an item in the outline, or click one on the canvas.'));
  }

  /* geometry */
  const geo = $('#geometry'); geo.textContent = '';
  const nums = v.readNumbers();
  for (const [name, value] of Object.entries(nums)) {
    const row = elm('div', 'georow');
    row.append(elm('label', null, name));
    const sl = elm('input'); sl.type = 'range';
    sl.min = Math.min(0, value * 2); sl.max = Math.max(40, Math.abs(value) * 2); sl.value = value;
    const num = elm('input', 'num'); num.type = 'number'; num.value = value;
    const set = nv => { num.value = sl.value = nv; push({ op: 'setConst', name, value: +nv }); };
    sl.oninput = () => set(+sl.value);
    num.onchange = () => set(+num.value);
    row.append(sl, num); geo.append(row);
  }

  /* theme */
  const th = $('#theme'); th.textContent = '';
  for (const [name, value] of Object.entries(v.readTokens())) {
    if (!isColor(value)) continue;
    const row = elm('div', 'georow');
    row.append(elm('label', null, name));
    const pick = elm('input'); pick.type = 'color'; pick.value = value;
    pick.oninput = () => push({ op: 'setToken', name, value: pick.value },
                              { live: () => livePatchToken(name, pick.value) });
    row.append(pick); th.append(row);
  }
}

/* ── wiring ──────────────────────────────────────────────────────────────── */
$('#openFolder').onclick = openFolder;
$('#openFile').onclick = openFile;
$('#openDemo').onclick = openDemo;
$('#upload').onchange = e => openUpload(e.target);
$('#save').onclick = save;
$('#undo').onclick = undo;
$('#reloadDisk').onclick = reloadFromDisk;
addEventListener('keydown', e => {
  if (!(e.metaKey || e.ctrlKey)) return;
  if (e.key === 's') { e.preventDefault(); if (S.patches.length) save(); }
  if (e.key === 'z') { e.preventDefault(); if (S.patches.length) undo(); }
});

const hasFSA = typeof window.showDirectoryPicker === 'function';
$('#openFolder').disabled = $('#openFile').disabled = !hasFSA;
$('#nofsa').hidden = hasFSA;
$('#cap').textContent = hasFSA
  ? 'File System Access available — edits save straight back to your files.'
  : 'This browser has no File System Access API, so the studio can load a deck but not write to it.';
