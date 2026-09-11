# Phase 0 — write-back spike

Proves the studio can edit a hand-written deck's data and write it back without
disturbing the rest of the file. No UI. See `../../docs/STUDIO-PLAN.md` §3.

```bash
npm init -y && npm pkg set type=module && npm install acorn magic-string
cp ../../assets/starter.html before.html
node run.js before.html after.html     # four edit kinds, with assertions
node tests.js before.html              # 13 safety properties
```

`deckdoc.js` is the engine: parse the inline `<script>` with acorn, queue semantic
patches, resolve them into non-overlapping byte edits in one `commit()`.
