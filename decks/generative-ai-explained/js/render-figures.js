/* ═══ figure renderers ═════════════════════════════════════════════════════
   The scenes that carry a picture rather than a list. Same contract:
   build(el, sc) -> step count, step(el, sc, k), everything derived from k. */
(function(){
'use strict';
var h = window.RH.h, head = window.RH.head, foot = window.RH.foot, reveal = window.RH.reveal;
var RENDER = window.RENDER;

function svg(tag, attrs){
  var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var a in attrs) n.setAttribute(a, attrs[a]);
  return n;
}

/* ═══ nest — one term inside another ═══════════════════════════════════════
   Concentric boxes, outermost first. Used for AI⊃ML⊃LLM and again for
   model⊃harness⊃product, because it is the same relationship both times. */
RENDER.nest = {
  build: function(el, sc){
    head(el, sc);
    var CX = 548, CY = 622, N = sc.rings.length, OUT = 590, INW = (OUT - 146) / (N - 1);
    var box = h('div', 'ne-box');
    sc.rings.forEach(function(r, i){
      var w = OUT - i * INW;
      var ring = h('div', 'ne-ring');
      ring.style.cssText = 'left:' + Math.round(CX - w / 2) + 'px;top:' + Math.round(CY - w / 2) +
        'px;width:' + Math.round(w) + 'px;height:' + Math.round(w) + 'px;' +
        '--c:var(--' + (r.c || 'ink-3') + ');z-index:' + (i + 1);
      ring.innerHTML = '<span></span>';
      ring.querySelector('span').textContent = r.tag || r.t;
      if (i === N - 1) ring.classList.add('core');
      box.appendChild(ring);
    });
    el.appendChild(box);

    var side = h('div', 'ne-side');
    sc.rings.forEach(function(r){
      var it = h('div', 'ne-item');
      it.style.setProperty('--c', 'var(--' + (r.c || 'ink-3') + ')');
      it.innerHTML = '<h3></h3><p></p>';
      it.querySelector('h3').innerHTML = r.t;
      it.querySelector('p').innerHTML = r.d;
      side.appendChild(it);
    });
    el.appendChild(side);
    return N + 1;
  },
  step: function(el, sc, k){
    reveal([].slice.call(el.querySelectorAll('.ne-ring')), k);
    var items = [].slice.call(el.querySelectorAll('.ne-item'));
    items.forEach(function(it, i){
      it.classList.toggle('on', i < k);
      it.classList.toggle('live', i === k - 1);
    });
    foot(el, k, sc.n);
  }
};

/* ═══ network — what a neural network actually is ══════════════════════════ */
RENDER.network = {
  build: function(el, sc){
    head(el, sc);
    var W = 1040, H = 560, LAYERS = sc.shape || [4, 6, 6, 3],
        X0 = 86, XS = (W - 172) / (LAYERS.length - 1), R = 16;
    var wrap = h('div', 'nw-wrap');
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'nw-svg' });

    var pos = LAYERS.map(function(count, li){
      var gap = Math.min(76, (H - 90) / count), top = H / 2 - (count - 1) * gap / 2;
      return Array.from({ length: count }, function(_, ni){
        return [X0 + li * XS, top + ni * gap];
      });
    });

    /* edges first so the nodes sit on top of them */
    var gEdges = svg('g', { class: 'nw-edges' });
    var seed = 7;
    function rnd(){ seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    pos.forEach(function(layer, li){
      if (!li) return;
      pos[li - 1].forEach(function(a){
        layer.forEach(function(b){
          var e = svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
          e.dataset.l = li;
          /* a fixed spread of weights, so "the strengths differ" is shown, not asserted.
             Seeded, not Math.random, so the picture is the same every time. */
          e.style.setProperty('--w', (0.06 + rnd() * 0.94).toFixed(2));
          gEdges.appendChild(e);
        });
      });
    });
    s.appendChild(gEdges);

    pos.forEach(function(layer, li){
      layer.forEach(function(p, ni){
        var g = svg('g', { class: 'nw-node' });
        g.dataset.l = li;
        g.style.setProperty('--hd', ((li * 0.22) + ni * 0.06).toFixed(2) + 's');
        g.appendChild(svg('circle', { cx: p[0], cy: p[1], r: R }));
        s.appendChild(g);
      });
    });
    wrap.appendChild(s);

    var labs = h('div', 'nw-labs');
    (sc.layers || []).forEach(function(t, i){
      var sp = h('span', '', t);
      sp.dataset.l = i;
      /* position each label on its own layer's x rather than spreading them
         evenly — an even spread only happens to line up at four layers */
      sp.style.left = ((X0 + i * XS) / W * 100).toFixed(3) + '%';
      labs.appendChild(sp);
    });
    wrap.appendChild(labs);
    el.appendChild(wrap);

    var side = h('div', 'nw-side');
    sc.notes.forEach(function(nt){
      var it = h('div', 'side-note');
      it.innerHTML = '<h3></h3><p></p>';
      it.querySelector('h3').innerHTML = nt.t;
      it.querySelector('p').innerHTML = nt.d;
      side.appendChild(it);
    });
    el.appendChild(side);
    return sc.notes.length + 1;
  },
  step: function(el, sc, k){
    /* how much of the net is up is declared per step in the data */
    var show = k ? (sc.show[k - 1] || 0) : 0;
    el.querySelectorAll('.nw-node').forEach(function(n){
      n.classList.toggle('on', +n.dataset.l < show);
    });
    el.querySelectorAll('.nw-edges line').forEach(function(e){
      e.classList.toggle('on', +e.dataset.l < show);
    });
    el.querySelectorAll('.nw-labs span').forEach(function(s){
      s.classList.toggle('on', +s.dataset.l < show);
    });
    var g = el.querySelector('.nw-svg');
    g.classList.toggle('weighted', k >= (sc.weightAt || 99));
    g.classList.toggle('flowing', k >= (sc.flowAt || 99));
    var notes = [].slice.call(el.querySelectorAll('.side-note'));
    notes.forEach(function(nt, i){
      nt.classList.toggle('on', i < k);
      nt.classList.toggle('live', i === k - 1);
    });
    foot(el, k, sc.n);
  }
};

/* ═══ tokens — text becomes numbers ════════════════════════════════════════ */
RENDER.tokens = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'tk-wrap');
    wrap.appendChild(h('p', 'tk-raw', '&ldquo;' + sc.raw + '&rdquo;'));
    var row = h('div', 'tk-row');
    sc.toks.forEach(function(t, i){
      var c = h('div', 'tk');
      c.style.setProperty('--hd', (i * 0.04).toFixed(2) + 's');
      c.innerHTML = '<span class="tk-t"></span><span class="tk-id"></span>';
      /* a leading space is part of the token; show it as a middle dot or it
         reads as a word boundary that is not there */
      c.querySelector('.tk-t').textContent = t[0].replace(/ /g, '·');
      c.querySelector('.tk-id').textContent = t[1];
      row.appendChild(c);
    });
    wrap.appendChild(row);
    el.appendChild(wrap);

    var side = h('div', 'tk-side');
    sc.notes.forEach(function(nt){
      var it = h('div', 'side-note');
      it.innerHTML = '<h3></h3><p></p>';
      it.querySelector('h3').innerHTML = nt.t;
      it.querySelector('p').innerHTML = nt.d;
      side.appendChild(it);
    });
    el.appendChild(side);
    return sc.notes.length + 1;
  },
  step: function(el, sc, k){
    var w = el.querySelector('.tk-wrap');
    w.querySelector('.tk-raw').classList.toggle('on', k >= 1);
    w.classList.toggle('split', k >= (sc.splitAt || 2));
    w.classList.toggle('ids', k >= (sc.idAt || 3));
    var notes = [].slice.call(el.querySelectorAll('.side-note'));
    notes.forEach(function(n, i){ n.classList.toggle('on', i < k); n.classList.toggle('live', i === k - 1); });
    foot(el, k, sc.n);
  }
};

/* ═══ scatter — meaning as coordinates ═════════════════════════════════════ */
RENDER.scatter = {
  build: function(el, sc){
    head(el, sc);
    var W = 1000, H = 578;
    var wrap = h('div', 'sp-wrap');
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'sp-svg' });
    s.appendChild(svg('rect', { x: .5, y: .5, width: W - 1, height: H - 1, class: 'sp-frame' }));
    for (var i = 1; i < 6; i++){
      s.appendChild(svg('line', { x1: i * W / 6, y1: 0, x2: i * W / 6, y2: H, class: 'sp-grid' }));
      s.appendChild(svg('line', { x1: 0, y1: i * H / 6, x2: W, y2: i * H / 6, class: 'sp-grid' }));
    }
    if (sc.arrow){
      var a = svg('path', { class: 'sp-arrow', d: sc.arrow.d });
      s.appendChild(a);
      var at = svg('text', { class: 'sp-arrow-t', x: sc.arrow.tx, y: sc.arrow.ty });
      at.textContent = sc.arrow.t;
      s.appendChild(at);
    }
    sc.groups.forEach(function(g, gi){
      g.pts.forEach(function(p){
        var node = svg('g', { class: 'sp-pt' });
        node.dataset.g = gi;
        node.style.setProperty('--c', 'var(--' + (g.c || 'ink-3') + ')');
        node.appendChild(svg('circle', { cx: p[0], cy: p[1], r: 7 }));
        var tx = svg('text', { x: p[0] + 15, y: p[1] + 5 });
        tx.textContent = p[2];
        node.appendChild(tx);
        s.appendChild(node);
      });
    });
    wrap.appendChild(s);
    el.appendChild(wrap);

    var side = h('div', 'sp-side');
    sc.groups.forEach(function(g){
      var it = h('div', 'side-note');
      it.style.setProperty('--c', 'var(--' + (g.c || 'ink-3') + ')');
      it.innerHTML = '<h3></h3><p></p>';
      it.querySelector('h3').innerHTML = g.t;
      it.querySelector('p').innerHTML = g.d;
      side.appendChild(it);
    });
    el.appendChild(side);
    return sc.groups.length + 1 + (sc.arrow ? 1 : 0);
  },
  step: function(el, sc, k){
    el.querySelectorAll('.sp-pt').forEach(function(p){ p.classList.toggle('on', +p.dataset.g < k); });
    var notes = [].slice.call(el.querySelectorAll('.side-note'));
    notes.forEach(function(n, i){ n.classList.toggle('on', i < k); n.classList.toggle('live', i === k - 1); });
    var ar = el.querySelector('.sp-arrow'), at = el.querySelector('.sp-arrow-t');
    if (ar){
      var on = k > sc.groups.length;
      ar.classList.toggle('on', on); at.classList.toggle('on', on);
    }
    foot(el, k, sc.n);
  }
};

/* ═══ window — the context window, and what falls out of it ════════════════ */
RENDER.window = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'wd-wrap');
    var col = h('div', 'wd-col');
    sc.turns.forEach(function(t, i){
      var b = h('div', 'wd-turn t-' + t.who);
      b.dataset.i = i;
      b.innerHTML = '<span></span><p></p>';
      b.querySelector('span').textContent = t.who === 'you' ? 'you' : 'model';
      b.querySelector('p').innerHTML = t.t;
      col.appendChild(b);
    });
    wrap.appendChild(col);
    var frame = h('div', 'wd-frame', '<span class="wd-frame-t"></span>');
    frame.querySelector('.wd-frame-t').innerHTML = sc.frameLabel || 'context window';
    wrap.appendChild(frame);
    el.appendChild(wrap);

    var side = h('div', 'wd-side');
    sc.notes.forEach(function(nt){
      var it = h('div', 'side-note');
      it.innerHTML = '<h3></h3><p></p>';
      it.querySelector('h3').innerHTML = nt.t;
      it.querySelector('p').innerHTML = nt.d;
      side.appendChild(it);
    });
    el.appendChild(side);
    return sc.notes.length + 1;
  },
  step: function(el, sc, k){
    var upTo = k ? (sc.show[k - 1] || 0) : 0;
    el.querySelectorAll('.wd-turn').forEach(function(t){
      var i = +t.dataset.i;
      t.classList.toggle('on', i < upTo);
      /* once the window slides, the earliest turns are still on screen for the
         reader but greyed: they are out of the model's view, not out of history */
      t.classList.toggle('gone', k >= (sc.dropAt || 99) && i < (sc.drops || 0));
    });
    var fr = el.querySelector('.wd-frame'), on = k >= (sc.frameAt || 99);
    fr.classList.toggle('on', on);
    if (on){
      /* offsetTop/offsetHeight are layout values, immune to the stage transform */
      var vis = [].slice.call(el.querySelectorAll('.wd-turn.on')).filter(function(t){
        return !t.classList.contains('gone');
      });
      if (vis.length){
        var a = vis[0], b = vis[vis.length - 1];
        fr.style.top = (a.offsetTop - 10) + 'px';
        fr.style.height = (b.offsetTop + b.offsetHeight - a.offsetTop + 20) + 'px';
      }
    }
    var notes = [].slice.call(el.querySelectorAll('.side-note'));
    notes.forEach(function(n, i){ n.classList.toggle('on', i < k); n.classList.toggle('live', i === k - 1); });
    foot(el, k, sc.n);
  }
};

/* ═══ trace — a reasoning model thinking out loud ══════════════════════════ */
RENDER.trace = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'tr-wrap');
    var q = h('div', 'tr-q', '<span>prompt</span><p></p>');
    q.querySelector('p').innerHTML = sc.q;
    wrap.appendChild(q);

    var pad = h('div', 'tr-pad', '<span class="tr-pad-t">internal reasoning &mdash; not the answer</span>');
    sc.lines.forEach(function(l){
      var li = h('p', 'tr-line');
      li.innerHTML = l;
      pad.appendChild(li);
    });
    wrap.appendChild(pad);

    var a = h('div', 'tr-a', '<span>answer</span><p></p>');
    a.querySelector('p').innerHTML = sc.a;
    wrap.appendChild(a);
    el.appendChild(wrap);
    return sc.lines.length + 3;   /* prompt, each line, pad-closes + answer, note */
  },
  step: function(el, sc, k){
    el.querySelector('.tr-q').classList.toggle('on', k >= 1);
    var pad = el.querySelector('.tr-pad');
    pad.classList.toggle('on', k >= 2);
    pad.classList.toggle('done', k >= sc.lines.length + 2);
    el.querySelectorAll('.tr-line').forEach(function(l, i){
      l.classList.toggle('on', i < k - 1);
      l.classList.toggle('live', i === k - 2);
    });
    el.querySelector('.tr-a').classList.toggle('on', k >= sc.lines.length + 2);
    foot(el, k, sc.n);
  }
};

/* ═══ moe — mixture of experts ═════════════════════════════════════════════ */
RENDER.moe = {
  build: function(el, sc){
    head(el, sc);
    var wrap = h('div', 'mo-wrap');

    var dense = h('div', 'mo-dense', '<span class="mo-tag">one dense model</span>' +
      '<div class="mo-slab"></div><p class="mo-cap"></p>');
    dense.querySelector('.mo-cap').innerHTML = sc.denseCap;
    wrap.appendChild(dense);

    var right = h('div', 'mo-right');
    right.appendChild(h('span', 'mo-tag', 'a mixture of experts'));
    var router = h('div', 'mo-router', '<b>router</b><i></i>');
    right.appendChild(router);
    var grid = h('div', 'mo-grid');
    sc.experts.forEach(function(x, i){
      var e = h('div', 'mo-x');
      e.dataset.i = i;
      e.innerHTML = '<b></b><span></span>';
      e.querySelector('b').textContent = String(i + 1).padStart(2, '0');
      e.querySelector('span').innerHTML = x;
      grid.appendChild(e);
    });
    right.appendChild(grid);
    right.appendChild(h('p', 'mo-cap', sc.moeCap));
    wrap.appendChild(right);
    el.appendChild(wrap);

    var tok = h('div', 'mo-tok');
    tok.innerHTML = '<span class="mo-tok-l"></span><b class="mo-tok-v"></b>';
    el.appendChild(tok);

    var side = h('div', 'mo-side');
    sc.notes.forEach(function(nt){
      var it = h('div', 'side-note');
      it.innerHTML = '<h3></h3><p></p>';
      it.querySelector('h3').innerHTML = nt.t;
      it.querySelector('p').innerHTML = nt.d;
      side.appendChild(it);
    });
    el.appendChild(side);
    return sc.notes.length + 1;
  },
  step: function(el, sc, k){
    var st = k ? (sc.states[k - 1] || {}) : {};
    el.querySelector('.mo-dense').classList.toggle('on', !!st.dense);
    el.querySelector('.mo-dense').classList.toggle('hot', !!st.denseHot);
    el.querySelector('.mo-right').classList.toggle('on', !!st.moe);
    el.querySelector('.mo-router').classList.toggle('on', !!st.router);
    var lit = st.lit || [];
    el.querySelectorAll('.mo-x').forEach(function(x){
      x.classList.toggle('lit', lit.indexOf(+x.dataset.i) > -1);
    });
    var tok = el.querySelector('.mo-tok');
    tok.classList.toggle('on', !!st.tok);
    if (st.tok){
      tok.querySelector('.mo-tok-l').textContent = 'routing the token';
      tok.querySelector('.mo-tok-v').textContent = st.tok;
    }
    var notes = [].slice.call(el.querySelectorAll('.side-note'));
    notes.forEach(function(n, i){ n.classList.toggle('on', i < k); n.classList.toggle('live', i === k - 1); });
    foot(el, k, sc.n);
  }
};

/* ═══ timeline — the scene that is wider than the canvas ═══════════════════
   The track pans under a fixed spine. Follow, never re-centre: re-centring on
   every step makes the whole scene lurch under the reader. */
RENDER.timeline = {
  build: function(el, sc){
    head(el, sc);
    var X0 = 300, COL = 384, DOTY = 700, CARD_TOP = 352, CARD_W = 344;
    var span = X0 * 2 + (sc.events.length - 1) * COL;
    var vp = h('div', 'tl-vp');
    var track = h('div', 'tl-track');
    track.style.width = span + 'px';
    track.appendChild(h('div', 'tl-spine'));

    sc.events.forEach(function(e, i){
      var x = X0 + i * COL;
      var dot = h('div', 'tl-dot');
      dot.dataset.i = i;
      dot.style.cssText = 'left:' + x + 'px;top:' + DOTY + 'px;--hd:' + (i * 0.27).toFixed(2) + 's';
      if (e.big) dot.classList.add('big');
      track.appendChild(dot);

      var date = h('div', 'tl-date', e.date);
      date.dataset.i = i;
      date.style.cssText = 'left:' + x + 'px;top:' + (DOTY + 34) + 'px';
      track.appendChild(date);

      var card = h('div', 'tl-card');
      card.dataset.i = i;
      card.style.cssText = 'left:' + x + 'px;top:' + CARD_TOP + 'px;width:' + CARD_W + 'px';
      card.innerHTML = '<h3></h3><p></p>' + (e.tag ? '<span class="tl-tag"></span>' : '');
      card.querySelector('h3').innerHTML = e.t;
      card.querySelector('p').innerHTML = e.d;
      if (e.tag) card.querySelector('.tl-tag').innerHTML = e.tag;
      track.appendChild(card);

      var stem = h('div', 'tl-stem');
      stem.dataset.i = i;
      stem.style.cssText = 'left:' + x + 'px;top:' + (CARD_TOP + 214) + 'px;' +
                           'height:' + (DOTY - CARD_TOP - 214) + 'px';
      track.appendChild(stem);
    });
    vp.appendChild(track);
    el.appendChild(vp);
    sc._geo = { X0: X0, COL: COL, span: span, DOTY: DOTY, CARD_TOP: CARD_TOP };

    /* each card flies out of its own marker, so the reveal reads "this came from here" */
    track.querySelectorAll('.tl-card').forEach(function(c){
      c.style.setProperty('--sy', (DOTY - CARD_TOP - 60) + 'px');
    });
    return sc.events.length + 1;
  },
  step: function(el, sc, k){
    el.querySelectorAll('.tl-dot,.tl-date,.tl-card,.tl-stem').forEach(function(n){
      var i = +n.dataset.i;
      n.classList.toggle('on', i < k);
      n.classList.toggle('live', i === k - 1);
    });
    var g = sc._geo, track = el.querySelector('.tl-track');
    /* The camera is replayed from step 0 every time rather than carried forward.
       Following is path-dependent by nature, so keeping a running pan made the
       backwards walk land somewhere different from the forwards one. Replaying
       is a dozen arithmetic ops and makes the pan a pure function of k. */
    var min = Math.min(0, -(g.span - 1920)), pan = 0;
    for (var j = 1; j <= k; j++){
      var cx = g.X0 + (j - 1) * g.COL;
      /* follow, do not centre: move only when the new marker nears an edge */
      if (cx + pan > 1470) pan = Math.max(min, -(cx - 1120));
      else if (cx + pan < 420) pan = Math.min(0, -(cx - 700));
    }
    track.style.transform = 'translateX(' + pan + 'px)';
  }
};

/* ═══ recap ════════════════════════════════════════════════════════════════ */
RENDER.recap = {
  build: function(el, sc){
    head(el, sc);
    var grid = h('div', 'rc-grid');
    sc.items.forEach(function(it, i){
      var c = h('div', 'rc');
      c.style.setProperty('--c', 'var(--c' + (i + 1) + ')');
      c.innerHTML = '<b></b><h3></h3><p></p>';
      c.querySelector('b').textContent = String(i + 1).padStart(2, '0');
      c.querySelector('h3').innerHTML = it.t;
      c.querySelector('p').innerHTML = it.d;
      grid.appendChild(c);
    });
    el.appendChild(grid);
    return 2;
  },
  step: function(el, sc, k){
    el.querySelectorAll('.rc').forEach(function(c){ c.classList.toggle('on', k >= 1); });
    foot(el, k, sc.n);
  }
};

})();
