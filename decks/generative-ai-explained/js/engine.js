/* ═══ engine ═══════════════════════════════════════════════════════════════
   One logical canvas scaled once, one global step index, every scene derived
   from it. Nothing here knows what the deck is about — content lives in
   js/data-*.js, drawing lives in js/render.js. */
(function(){
'use strict';

var stage = document.getElementById('stage'),
    host  = document.getElementById('scenes'),
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── build every scene once. Build creates nodes; the step pass only toggles
      classes — rebuilding on a step change would drop CSS transitions. ───── */
var SCENES = window.DECK, FLAT = [];

SCENES.forEach(function(sc, si){
  var r = window.RENDER[sc.type];
  if (!r) { console.error('no renderer for type', sc.type, sc.id); return; }
  var el = document.createElement('section');
  el.className = 'scene sc-' + sc.type;
  el.id = 'sc-' + sc.id;
  el.dataset.ch = sc.ch;
  host.appendChild(el);
  sc.el = el;
  sc.n = r.build(el, sc) || sc.steps || 1;   /* renderer may declare its own count */
  for (var k = 0; k < sc.n; k++) FLAT.push({ si: si, k: k });
});

document.getElementById('counter-all').textContent = FLAT.length;

/* ── the step machine ──────────────────────────────────────────────────── */
var g = -1, curScene = -1;

function applyGlobal(n, push){
  g = Math.max(0, Math.min(n, FLAT.length - 1));
  var f = FLAT[g], sc = SCENES[f.si];

  if (f.si !== curScene){
    SCENES.forEach(function(s, i){ s.el.classList.toggle('is-active', i === f.si); });
    curScene = f.si;
    document.getElementById('rail-fill').style.setProperty('--rc', 'var(--c' + sc.ch + ')');
  }
  window.RENDER[sc.type].step(sc.el, sc, f.k);

  document.getElementById('rail-fill').style.width = ((g + 1) / FLAT.length * 100) + '%';
  document.getElementById('counter-now').textContent = g + 1;
  var hash = '#' + sc.id + (f.k ? '/' + f.k : '');
  if (push !== false && location.hash !== hash) history.replaceState(null, '', hash);
}

function next(){ if (g < FLAT.length - 1) applyGlobal(g + 1); }
function prev(){ if (g > 0) applyGlobal(g - 1); }

/* jump to the first step of a scene */
function goScene(id){
  for (var i = 0; i < FLAT.length; i++)
    if (SCENES[FLAT[i].si].id === id && FLAT[i].k === 0) return applyGlobal(i);
}

/* ── contents menu ─────────────────────────────────────────────────────── */
var menu = document.getElementById('menu'),
    list = document.getElementById('menu-list');

window.CHAPTERS.forEach(function(c){
  var li = document.createElement('li');
  li.style.setProperty('--mc', 'var(--c' + c.n + ')');
  li.innerHTML = '<b>' + String(c.n).padStart(2, '0') + '</b><div><h4></h4><p></p></div>';
  li.querySelector('h4').textContent = c.title;
  li.querySelector('p').textContent = c.blurb;
  li.onclick = function(){ closeMenu(); goScene(c.scene); };
  list.appendChild(li);
});

function openMenu(){ menu.classList.add('open'); }
function closeMenu(){ menu.classList.remove('open'); }
function toggleMenu(){ menu.classList.contains('open') ? closeMenu() : openMenu(); }

/* ── keyboard and controls ─────────────────────────────────────────────── */
addEventListener('keydown', function(e){
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Escape'){ closeMenu(); return; }
  if (e.key === 'm' || e.key === 'M'){ toggleMenu(); return; }
  if (menu.classList.contains('open')) return;
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown'){ e.preventDefault(); next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); prev(); }
  else if (e.key === 'Home'){ e.preventDefault(); applyGlobal(0); }
  else if (e.key === 'End'){ e.preventDefault(); applyGlobal(FLAT.length - 1); }
});
document.getElementById('bNext').onclick = next;
document.getElementById('bPrev').onclick = prev;
document.getElementById('bMenu').onclick = toggleMenu;
addEventListener('click', function(e){
  if (e.target.closest('#chrome,#menu,a,button,.no-advance')) return;
  if (menu.classList.contains('open')) return;
  next();
});

/* ── fit the canvas ────────────────────────────────────────────────────── */
function fitStage(){
  var k = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = 'translate(-50%,-50%) scale(' + k + ')';
  document.body.classList.toggle('cramped', innerWidth < 620 || innerHeight < 380);
}
addEventListener('resize', fitStage);
fitStage();

/* ── boot: resolve a deep link before showing anything ─────────────────── */
function boot(){
  /* text-derived measurements are wrong until the real faces are in, so any
     renderer that positions something from a measured height does it here */
  SCENES.forEach(function(sc){
    var r = window.RENDER[sc.type];
    if (r && r.measure) r.measure(sc.el, sc);
  });
  var h = decodeURIComponent(location.hash.replace(/^#/, '')),
      id = h.split('/')[0], k = parseInt(h.split('/')[1] || '0', 10) || 0, at = 0;
  if (id) for (var i = 0; i < FLAT.length; i++)
    if (SCENES[FLAT[i].si].id === id && FLAT[i].k === k){ at = i; break; }
  applyGlobal(at);
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else boot();
window.DECK_DEBUG = { flat: FLAT, scenes: SCENES, go: applyGlobal, goScene: goScene,
                      at: function(){ return g; }, reduced: reduced };
})();
