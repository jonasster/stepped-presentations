/* deckdoc — write-back spike for stepped-presentations studio.
 *
 * Opens a deck's index.html, finds its data in the inline <script>, and applies
 * semantic patches as surgical byte-range edits. Never re-prints the program:
 * every byte outside an edited literal is preserved exactly.
 *
 * Patches are QUEUED, not applied. commit() resolves the whole queue into a set
 * of non-overlapping byte edits in one pass. This matters: a reorder rewrites a
 * whole array element, a field edit rewrites a literal nested inside that same
 * element, and applying them eagerly means one silently eats the other.
 */
import { parse } from 'acorn';
import MagicString from 'magic-string';

const SCRIPT_RE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

export class DeckDoc {
  constructor(source, { itemsName = null } = {}) {
    this.source = source;
    this.queue = [];

    // 1 · locate every inline <script>, remembering its offset in the FILE so
    //     every AST range we take is a file offset, not a script offset.
    this.scripts = [];
    for (const m of source.matchAll(SCRIPT_RE)) {
      const body = m[1];
      const offset = m.index + m[0].indexOf(body);
      let ast;
      try {
        ast = parse(body, { ecmaVersion: 'latest', ranges: true });
      } catch (e) {
        throw new Error(`inline <script> at ${offset} does not parse: ${e.message}`);
      }
      this.scripts.push({ offset, body, ast });
    }
    // a bare .js data file (the split multi-file shape) is one script at offset 0
    if (!this.scripts.length && !/<\s*html|<\s*body/i.test(source))
      this.scripts.push({ offset: 0, body: source,
                          ast: parse(source, { ecmaVersion: 'latest', ranges: true }) });
    if (!this.scripts.length) throw new Error('no inline <script> found');

    // 2 · index every top-level declarator by name.
    this.decls = new Map();
    for (const s of this.scripts)
      for (const node of s.ast.body) {
        if (node.type !== 'VariableDeclaration') continue;
        for (const d of node.declarations)
          if (d.id.type === 'Identifier' && d.init)
            this.decls.set(d.id.name, { init: d.init, script: s, kind: node.kind });
      }

    // 3 · find the content array: named if told, otherwise the first top-level
    //     binding whose value is an array of object literals that all carry `id`.
    this.itemsName = itemsName ?? this.#discoverItems();
    if (!this.itemsName) throw new Error('could not find a content array');
    const d = this.decls.get(this.itemsName);
    this.script = d.script;
    this.items = d.init;
    this.byId = new Map();
    this.items.elements.forEach((el, i) => {
      const id = literalValue(prop(el, 'id')?.value);
      if (id != null) this.byId.set(id, i);
    });

    // 4 · the `:root` token block in <style>, if there is one. Byte ranges of
    //     each value, found by scan — no CSS parser, and none needed.
    this.tokenRanges = new Map();
    const root = /:root\s*\{([^}]*)\}/.exec(source);
    if (root) {
      const bodyAt = root.index + root[0].indexOf(root[1]);
      for (const m of root[1].matchAll(/(--[\w-]+)\s*:\s*([^;]*?)\s*(?=;|$)/g)) {
        const vAt = bodyAt + m.index + m[0].lastIndexOf(m[2]);
        this.tokenRanges.set(m[1], [vAt, vAt + m[2].length]);
      }
    }
  }

  #discoverItems() {
    for (const [name, d] of this.decls) {
      const a = d.init;
      if (a.type !== 'ArrayExpression' || a.elements.length < 2) continue;
      if (a.elements.every(e => e?.type === 'ObjectExpression' && prop(e, 'id')))
        return name;
    }
    return null;
  }

  #abs(node, script) { const s = script ?? this.script;
                       return [s.offset + node.range[0], s.offset + node.range[1]]; }

  /* ── the patch API — everything here only queues ─────────────────────── */
  setField(itemId, field, value) {
    if (!this.byId.has(itemId)) throw new Error(`no item with id "${itemId}"`);
    const i = this.byId.get(itemId);
    if (!prop(this.items.elements[i], field))
      throw new Error(`item "${itemId}" has no field "${field}"`);
    this.queue.push({ op: 'setField', item: itemId, field, value });
    return this;
  }
  reorder(order) {
    const n = this.items.elements.length;
    if (order.length !== n || new Set(order).size !== n)
      throw new Error('reorder needs a permutation of every index');
    this.queue.push({ op: 'reorder', order });
    return this;
  }
  moveItem(itemId, toIndex) {
    const order = this.items.elements.map((_, i) => i);
    order.splice(toIndex, 0, ...order.splice(this.byId.get(itemId), 1));
    return this.reorder(order);
  }
  setConst(name, value) {
    const d = this.decls.get(name);
    if (!d) throw new Error(`no top-level binding "${name}"`);
    if (literalValue(d.init) === undefined)
      throw new Error(`"${name}" is computed, not a literal — not editable`);
    this.queue.push({ op: 'setConst', name, value });
    return this;
  }
  /* a `:root` custom property. Lives in <style>, so it can never overlap a
     script edit — located by scan rather than AST. */
  setToken(name, value) {
    if (!this.tokenRanges.has(name)) throw new Error(`no :root token "${name}"`);
    this.queue.push({ op: 'setToken', name, value });
    return this;
  }
  /* replay a list of patches produced elsewhere (the editor's undo stack) */
  apply(patches) { for (const p of patches) this[p.op](...argsOf(p)); return this; }

  /* ── resolve the whole queue into non-overlapping byte edits ─────────── */
  commit() {
    const ms = new MagicString(this.source);
    const els = this.items.elements;

    // a · collect field edits per element index; later patches win.
    const fields = els.map(() => new Map());
    let order = null;
    for (const p of this.queue) {
      if (p.op === 'setField') fields[this.byId.get(p.item)].set(p.field, p.value);
      else if (p.op === 'reorder') order = p.order;
    }

    // b · build each element's new text by editing its OWN slice, so a field
    //     edit and a reorder of the same element compose instead of colliding.
    const text = els.map((el, i) => {
      const [s, e] = this.#abs(el);
      let out = this.source.slice(s, e);
      const edits = [...fields[i]].map(([f, v]) => {
        const [a, b] = this.#abs(prop(el, f).value);
        return { a: a - s, b: b - s, v };
      }).sort((x, y) => y.a - x.a);          // right to left: offsets stay valid
      for (const { a, b, v } of edits)
        out = out.slice(0, a) + reEmit(out.slice(a, b), v) + out.slice(b);
      return out;
    });

    // c · write elements back. Gaps between elements (indentation, line breaks,
    //     trailing commas, comments) are never touched, so the array keeps its
    //     shape and only the contents move.
    els.forEach((el, to) => {
      const from = order ? order[to] : to;
      const [a, b] = this.#abs(el);
      if (text[from] !== this.source.slice(a, b)) ms.overwrite(a, b, text[from]);
    });

    // d · constants live outside the array, so they cannot overlap the above.
    //     Later patches win, so collapse by name before writing.
    const consts = new Map(), tokens = new Map();
    for (const p of this.queue) {
      if (p.op === 'setConst') consts.set(p.name, p.value);
      if (p.op === 'setToken') tokens.set(p.name, p.value);
    }
    for (const [name, value] of consts) {
      const d = this.decls.get(name);
      const [a, b] = this.#abs(d.init, d.script);
      ms.overwrite(a, b, reEmit(this.source.slice(a, b), value));
    }
    // e · CSS custom properties, in <style> — disjoint from every script range.
    for (const [name, value] of tokens) {
      const [a, b] = this.tokenRanges.get(name);
      ms.overwrite(a, b, String(value));
    }
    return ms.toString();
  }

  /* ── read side: what an inspector panel populates from ───────────────── */
  readItems() {
    return this.items.elements.map(el => Object.fromEntries(
      el.properties.map(p => [keyName(p), literalValue(p.value)])));
  }
  readConsts(names) {
    return Object.fromEntries(names.map(n =>
      [n, literalValue(this.decls.get(n)?.init)]));
  }
  /* every top-level CONST holding a plain number — the geometry an inspector can
     safely offer as a slider. `let` is excluded on purpose: it is runtime state
     (`let step = -1`), not a layout decision. */
  readNumbers() {
    const out = {};
    for (const [name, d] of this.decls) {
      const v = literalValue(d.init);
      if (typeof v === 'number' && d.kind === 'const') out[name] = v;
    }
    return out;
  }
  readTokens() {
    return Object.fromEntries([...this.tokenRanges]
      .map(([n, [a, b]]) => [n, this.source.slice(a, b)]));
  }
  /* the string fields of each item — what the inspector offers as text inputs */
  fieldsOf(itemId) {
    const el = this.items.elements[this.byId.get(itemId)];
    return el.properties.map(p => [keyName(p), literalValue(p.value)])
                        .filter(([k, v]) => k !== 'id' && typeof v === 'string');
  }
}

const argsOf = p => p.op === 'setField' ? [p.item, p.field, p.value]
                  : p.op === 'reorder'  ? [p.order]
                  :                       [p.name, p.value];

/* ---- helpers ---- */
const keyName = p => p.key.type === 'Identifier' ? p.key.name : p.key.value;
const prop = (obj, name) => obj.properties?.find(p => keyName(p) === name);
function literalValue(v) {
  if (!v) return undefined;
  if (v.type === 'Literal') return v.value;
  if (v.type === 'UnaryExpression' && v.argument.type === 'Literal')
    return v.operator === '-' ? -v.argument.value : v.argument.value;
  return undefined;                      // computed — not editable, by design
}
/* re-emit a value in the quoting style the original used */
function reEmit(original, value) {
  if (typeof value !== 'string') return String(value);
  const q = original[0] === "'" || original[0] === '"' ? original[0] : '"';
  return q + value
    .replace(/\\/g, '\\\\').replace(new RegExp(q, 'g'), '\\' + q)
    .replace(/\n/g, '\\n') + q;
}
