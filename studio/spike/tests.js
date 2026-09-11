/* Safety properties. These are what decide whether a studio can be trusted with
 * a file the night before a talk. */
import fs from 'node:fs';
import { parse } from 'acorn';
import { DeckDoc } from '../src/deckdoc.js';

const src = fs.readFileSync(process.argv[2], 'utf8');
let fails = 0;
const check = (name, ok, detail = '') => {
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};
const parses = s => { try { parse(s.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i)[1],
                             { ecmaVersion: 'latest' }); return true; } catch { return false; } };
const throws = fn => { try { fn(); return false; } catch { return true; } };

/* 1 · open and save with no edits must not change a single byte. */
check('no-op commit is byte-identical', new DeckDoc(src).commit() === src);

/* 2 · a patch then its inverse returns to the original. */
const there = new DeckDoc(src).setField('two', 'name', 'Changed').commit();
const back  = new DeckDoc(there).setField('two', 'name', 'Second').commit();
check('edit then invert is byte-identical', back === src);

/* 3 · reorder then reorder back. */
const r1 = new DeckDoc(src).moveItem('four', 0).commit();
const r2 = new DeckDoc(r1).moveItem('four', 3).commit();
check('reorder then invert is byte-identical', r2 === src);

/* 4 · applying the same patch twice is stable (no drift on repeat saves). */
const once  = new DeckDoc(src).setConst('COL', 420).commit();
const twice = new DeckDoc(once).setConst('COL', 420).commit();
check('repeated identical patch is stable', once === twice);

/* 5 · awkward text survives and still parses. */
const nasty = 'He said "no" — it\'s 100% fine\\done';
const n1 = new DeckDoc(src).setField('one', 'desc', nasty).commit();
check('awkward text re-parses', parses(n1));
check('awkward text reads back exactly',
      new DeckDoc(n1).readItems()[0].desc === nasty,
      JSON.stringify(new DeckDoc(n1).readItems()[0].desc));

/* 6 · reorder must not disturb the array's punctuation. */
const arr = s => s.slice(s.indexOf('const ITEMS'), s.indexOf('];') + 2);
check('reorder keeps trailing-comma shape',
      arr(r1).split('\n').map(l => /,\s*$/.test(l)).join() ===
      arr(src).split('\n').map(l => /,\s*$/.test(l)).join());

/* 7 · computed values are refused rather than mangled. */
check('computed binding is refused', throws(() => new DeckDoc(src).setConst('xOf', 1)));
check('unknown id is refused',       throws(() => new DeckDoc(src).setField('nope', 'name', 'x')));
check('unknown field is refused',    throws(() => new DeckDoc(src).setField('one', 'nope', 'x')));

/* 8 · a file the parser cannot handle must fail loudly, not silently half-write. */
check('unparseable script is refused',
      throws(() => new DeckDoc(src.replace('const ITEMS = [', 'const ITEMS = [ ('))));

/* 9 · edits of different lengths in one element do not corrupt each other. */
const multi = new DeckDoc(src)
  .setField('one', 'name', 'A')                       // much shorter
  .setField('one', 'desc', 'x'.repeat(200))           // much longer
  .setField('one', 'label', 'December')               // same-ish
  .commit();
const m = new DeckDoc(multi).readItems()[0];
check('multiple edits in one element compose',
      m.name === 'A' && m.desc.length === 200 && m.label === 'December');

/* 10 · a field edit and a reorder touching the SAME element compose.
 *      (This is the bug the first draft of the engine had.) */
const both = new DeckDoc(src).setField('four', 'name', 'Moved').moveItem('four', 0).commit();
const b = new DeckDoc(both).readItems();
check('field edit + reorder of the same element compose',
      b[0].id === 'four' && b[0].name === 'Moved', JSON.stringify(b.map(x => x.id + ':' + x.name)));

console.log(fails ? `\n${fails} failing` : '\nall safety properties hold');
process.exit(fails ? 1 : 0);
