/* ═══ renderers ════════════════════════════════════════════════════════════
   Each renderer has build(el, sc) -> step count, and step(el, sc, k).
   build() creates every node once; step() only toggles `.on`. Everything is
   derived from k, never incremented, so ← costs nothing. */
window.RENDER = {};
(function(){
'use strict';

/* ── helpers ───────────────────────────────────────────────────────────── */
function h(tag, cls, html){
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function head(el, sc){
  if (sc.kicker) el.appendChild(h('p', 'kicker', sc.kicker));
  if (sc.title)  el.appendChild(h('h2', 's-title', sc.title));
  if (sc.lede)   el.appendChild(h('p', 's-lede', sc.lede));
  if (sc.foot)   el.appendChild(h('p', 's-foot', sc.foot));
}
/* the footnote lands on the last step of the scene */
function foot(el, k, n){
  var f = el.querySelector('.s-foot');
  if (f) f.classList.toggle('on', k >= n - 1);
}
function reveal(nodes, k){
  nodes.forEach(function(nd, i){ nd.classList.toggle('on', i < k); });
}
window.RH = { h: h, head: head, foot: foot, reveal: reveal };

/* ═══ cover ════════════════════════════════════════════════════════════════ */
RENDER.cover = {
  build: function(el, sc){
    el.appendChild(h('p', 'cv-kick', sc.kicker));
    el.appendChild(h('h1', 'cv-title', sc.title));
    el.appendChild(h('p', 'cv-lede', sc.lede));
    var strip = h('div', 'cv-strip');
    window.CHAPTERS.forEach(function(c){
      var s = h('span', '', String(c.n).padStart(2, '0') + ' ' + c.title);
      s.style.setProperty('--mc', 'var(--c' + c.n + ')');
      strip.appendChild(s);
    });
    el.appendChild(strip);
    el.appendChild(h('p', 'cv-hint', sc.hint));
    return 1;
  },
  step: function(){}
};

/* ═══ chapter card ═════════════════════════════════════════════════════════ */
RENDER.chapter = {
  build: function(el, sc){
    el.appendChild(h('span', 'ch-num', String(sc.ch).padStart(2, '0')));
    el.appendChild(h('h2', 'ch-title', sc.title));
    el.appendChild(h('p', 'ch-lede', sc.lede));
    var ul = h('ul', 'ch-list');
    (sc.covers || []).forEach(function(t){ ul.appendChild(h('li', '', t)); });
    el.appendChild(ul);
    return 1;
  },
  step: function(){}
};

/* ═══ points — headline plus stepped bullets ═══════════════════════════════ */
RENDER.points = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'pt-wrap' + (sc.wide ? ' wide' : ''));
    sc.points.forEach(function(p, i){
      var li = h('div', 'pt');
      /* three direct grid children: number, title, description. Wrapping the
         last two in a div puts the description in the title's column. */
      li.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b><h3></h3><p></p>';
      li.querySelector('h3').innerHTML = p.t;
      li.querySelector('p').innerHTML = p.d;
      wrap.appendChild(li);
    });
    el.appendChild(wrap);
    return sc.points.length + 1;
  },
  step: function(el, sc, k){
    reveal([].slice.call(el.querySelectorAll('.pt')), k);
    foot(el, k, sc.n);
  }
};

/* ═══ columns — 2–4 cards compared ═════════════════════════════════════════ */
RENDER.columns = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'col-wrap');
    wrap.dataset.n = sc.cols.length;
    if (sc.tall) wrap.classList.add('tall');
    sc.cols.forEach(function(c){
      var card = h('div', 'col');
      if (c.tone) card.classList.add('t-' + c.tone);
      var lines = (c.lines || []).map(function(l){ return '<li>' + l + '</li>'; }).join('');
      card.innerHTML = '<span class="col-tag"></span><h3></h3><p class="col-sub"></p>' +
                       (lines ? '<ul>' + lines + '</ul>' : '') +
                       (c.note ? '<p class="col-note"></p>' : '');
      card.querySelector('.col-tag').textContent = c.tag || '';
      card.querySelector('h3').innerHTML = c.t;
      card.querySelector('.col-sub').innerHTML = c.sub || '';
      if (c.note) card.querySelector('.col-note').innerHTML = c.note;
      wrap.appendChild(card);
    });
    el.appendChild(wrap);
    return sc.cols.length + 1;
  },
  step: function(el, sc, k){
    reveal([].slice.call(el.querySelectorAll('.col')), k);
    foot(el, k, sc.n);
  }
};

/* ═══ flow — a chain of boxes, optionally looping back ═════════════════════ */
RENDER.flow = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'fl-wrap' + (sc.loop ? ' looped' : ''));
    wrap.dataset.n = sc.nodes.length;
    sc.nodes.forEach(function(nd, i){
      if (i) wrap.appendChild(h('div', 'fl-arrow', '<svg viewBox="0 0 54 22">' +
        '<path d="M0 11 H40" /><path d="M34 5 L42 11 L34 17" /></svg>'));
      var b = h('div', 'fl-node');
      b.innerHTML = '<span class="fl-i"></span><h3></h3><p></p>';
      b.querySelector('.fl-i').textContent = String(i + 1).padStart(2, '0');
      b.querySelector('h3').innerHTML = nd.t;
      b.querySelector('p').innerHTML = nd.d;
      wrap.appendChild(b);
    });
    el.appendChild(wrap);
    if (sc.loop){
      var lp = h('div', 'fl-loop', '<svg viewBox="0 0 1000 96" preserveAspectRatio="none">' +
        '<path class="fl-loop-line" d="M978 4 V52 Q978 78 952 78 H48 Q22 78 22 52 V16" />' +
        '<path class="fl-loop-head" d="M14 26 L22 12 L30 26" /></svg>' +
        '<span class="fl-loop-tag"></span>');
      lp.querySelector('.fl-loop-tag').innerHTML = sc.loop;
      el.appendChild(lp);
    }
    return sc.nodes.length + 1 + (sc.loop ? 1 : 0);
  },
  measure: function(el, sc){
    /* node heights depend on the text, which depends on the loaded font, so the
       return arrow is placed from a real measurement rather than a guessed y */
    var lp = el.querySelector('.fl-loop'), wrap = el.querySelector('.fl-wrap');
    if (lp) lp.style.top = (wrap.offsetTop + wrap.offsetHeight + 34) + 'px';
  },
  step: function(el, sc, k){
    var nodes = [].slice.call(el.querySelectorAll('.fl-node')),
        arrows = [].slice.call(el.querySelectorAll('.fl-arrow'));
    nodes.forEach(function(nd, i){
      nd.classList.toggle('on', i < k);
      nd.classList.toggle('live', i === k - 1);
    });
    arrows.forEach(function(a, i){ a.classList.toggle('on', i < k - 1); });
    var lp = el.querySelector('.fl-loop');
    if (lp) lp.classList.toggle('on', k >= sc.nodes.length + 1);
    foot(el, k, sc.n);
  }
};

/* ═══ bars — a quantity per row ════════════════════════════════════════════ */
RENDER.bars = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'bar-wrap');
    sc.bars.forEach(function(b){
      var row = h('div', 'bar');
      row.innerHTML = '<span class="bar-l"></span>' +
        '<span class="bar-t"><i style="width:' + b.pct + '%"></i></span>' +
        '<span class="bar-v"></span><span class="bar-n"></span>';
      row.querySelector('.bar-l').innerHTML = b.label;
      row.querySelector('.bar-v').innerHTML = b.value;
      row.querySelector('.bar-n').innerHTML = b.note || '';
      if (b.muted) row.classList.add('muted');
      wrap.appendChild(row);
    });
    el.appendChild(wrap);
    return sc.bars.length + 1;
  },
  step: function(el, sc, k){
    reveal([].slice.call(el.querySelectorAll('.bar')), k);
    foot(el, k, sc.n);
  }
};

})();
