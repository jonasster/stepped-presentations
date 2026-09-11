/* The spike: four edit kinds round-tripped on the starter deck. */
import fs from 'node:fs';
import { parse } from 'acorn';
import { DeckDoc } from '../src/deckdoc.js';

const SRC = process.argv[2];
const OUT = process.argv[3];
const original = fs.readFileSync(SRC, 'utf8');

/* --- read side: what an inspector panel would show ------------------------ */
const probe = new DeckDoc(original);
console.log(`discovered content array : ${probe.itemsName}  (${probe.items.elements.length} items)`);
console.log(`inspector would show     :`, JSON.stringify(probe.readItems(), null, 0));
console.log(`geometry                 :`, probe.readConsts(['X0', 'COL', 'DOTY', 'CARD_TOP']));
console.log();

/* --- write side: four patches, applied together --------------------------- */
const doc = new DeckDoc(original)
  .setField('two', 'name', 'Second draft')      // 1 · text
  .setField('three', 'color', '#b4245e')        // 2 · colour
  .moveItem('four', 0)                          // 3 · reorder (last -> first)
  .setConst('COL', 420);                        // 4 · geometry constant

const out = doc.commit();
fs.writeFileSync(OUT, out);
console.log('patch queue:', JSON.stringify(doc.queue));

/* --- assertions ----------------------------------------------------------- */
const fail = [];
const check = (name, ok, detail = '') =>
  (ok ? 0 : fail.push(name), console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail && '  — ' + detail}`));

// a. the result still parses as HTML-embedded JS
let reparsed = true, perr = '';
try {
  const body = out.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i)[1];
  parse(body, { ecmaVersion: 'latest' });
} catch (e) { reparsed = false; perr = e.message; }
check('result re-parses', reparsed, perr);

// b. the edits are actually present, read back through the same reader
const after = new DeckDoc(out);
const items = after.readItems();
check('text edit applied', items.find(i => i.id === 'two').name === 'Second draft');
check('colour edit applied', items.find(i => i.id === 'three').color === '#b4245e');
check('reorder applied', items.map(i => i.id).join(',') === 'four,one,two,three',
      items.map(i => i.id).join(','));
check('geometry edit applied', after.readConsts(['COL']).COL === 420);

// c. nothing outside the data region moved
const region = s => {
  const i = s.indexOf('const ITEMS'), j = s.indexOf('const stage');
  return [s.slice(0, i), s.slice(j)];
};
const [preA, postA] = region(original), [preB, postB] = region(out);
check('everything before the data block is byte-identical', preA === preB);
check('everything after the data block is byte-identical',
      postA.replace(/const COL = \d+/, '') === postB.replace(/const COL = \d+/, ''));

// d. how big is the diff?
const changed = original.split('\n').filter((l, i) => l !== out.split('\n')[i]).length;
console.log(`\nlines differing: ${changed} of ${original.split('\n').length}`);

process.exit(fail.length ? 1 : 0);
