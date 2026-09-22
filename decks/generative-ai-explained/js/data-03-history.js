/* ═══ content, part 3 — the history, and what changed inside ═══════════════ */

/* ═══ 05 ═══════════════════════════════════════════════════════════════════ */
DECK.push({
  id:'ch5', ch:5, type:'chapter',
  title:'Since<br>ChatGPT',
  lede:'November 2022 is the date everyone remembers, but the research was a decade old by then. What ' +
       'actually happened after it is a story about four things getting better at once.',
  covers:['The timeline, one step at a time','What genuinely changed','What only looked like it changed']
});

DECK.push({
  id:'timeline', ch:5, type:'timeline',
  kicker:'Chapter 05 &middot; the timeline',
  title:'From a research demo to infrastructure',
  lede:'Thirteen moments, in order. Watch for the shift about halfway along, where the interesting news ' +
       'stops being <i>the model is cleverer</i> and starts being <i>the model can now do things</i>.',
  events:[
    { date:'Nov 2022', big:true, t:'ChatGPT', tag:'the starting gun',
      d:'Not a new model — an existing one given a chat box. A hundred million people tried it within ' +
        'two months. <b>The interface was the invention.</b>' },
    { date:'Mar 2023', t:'GPT-4', tag:'it got serious',
      d:'A clear jump in reasoning and reliability. Passed professional exams, and started being used for ' +
        'real work rather than novelty.' },
    { date:'2023', t:'A field, not a product', tag:'competition',
      d:'Claude, Gemini, Mistral and others arrive. Capability stops being one company’s, and prices ' +
        'start falling immediately.' },
    { date:'Jul 2023', t:'Open weights', tag:'you can run it yourself',
      d:'Llama 2 is published for anyone to download. A second track opens: models you host, tune and keep ' +
        'entirely on your own machines.' },
    { date:'Nov 2023', t:'Long context', tag:'from pages to books',
      d:'Windows jump from a few thousand tokens to 200,000, then a million. You can hand a model a whole ' +
        'contract, codebase or year of reports.' },
    { date:'2024', t:'Multimodal', tag:'eyes and ears',
      d:'Images, audio and documents go in as naturally as text. &ldquo;Language model&rdquo; stops being ' +
        'quite the right name.' },
    { date:'Jun 2024', t:'Good at code', tag:'the sleeper',
      d:'Models cross the line from suggesting snippets to writing whole working changes. Software becomes ' +
        'the first industry visibly reshaped.' },
    { date:'Sep 2024', big:true, t:'Thinking first', tag:'a new axis',
      d:'Reasoning models appear: given harder problems, they work through them internally before ' +
        'answering. Accuracy now buyable with <b>time</b>, not just size.' },
    { date:'Nov 2024', t:'A standard for tools', tag:'mcp',
      d:'MCP is published as an open way to connect any model to any system. Within a year it is broadly ' +
        'adopted across the industry.' },
    { date:'Jan 2025', big:true, t:'The price collapse', tag:'efficiency',
      d:'DeepSeek-R1 lands: open, reasoning, and trained for a fraction of the assumed cost. Frontier-ish ' +
        'capability stops being scarce.' },
    { date:'2025', t:'Agents', tag:'it does the task',
      d:'Models given tools, a loop and permission start completing multi-step work — writing code, ' +
        'running it, checking the result, fixing it.' },
    { date:'2025–26', t:'A component', tag:'plumbing',
      d:'The model becomes something inside other software rather than a website you visit. Skills, ' +
        'plugins and connectors make it configurable.' },
    { date:'Now', big:true, t:'Where we are', tag:'september 2026',
      d:'Cheap, fast, everywhere, and increasingly working unattended for minutes or hours at a time. ' +
        'The hard problems left are <b>trust and verification</b>.' }
  ],
  foot:'Dates mark when something became <b>widely visible</b>, not when the research was done — that is ' +
       'usually one to three years earlier. The final stretch moves fast; check the current state before ' +
       'relying on it.'
});

DECK.push({
  id:'changed', ch:5, type:'points',
  kicker:'Chapter 05 &middot; the shape of it',
  title:'Four curves, not one',
  lede:'&ldquo;AI got better&rdquo; hides what happened. Four separate things improved, and the ones that ' +
       'mattered most were not the ones that made headlines.',
  foot:'Note which curve is missing: <b>reliability</b>. Models are far more capable than in 2022 and still ' +
       'confidently wrong in much the same way.',
  points:[
    { t:'Cost fell off a cliff',
      d:'The price of a given level of capability has fallen by orders of magnitude and keeps falling. ' +
        'Things that were not worth automating in 2023 are now rounding errors.' },
    { t:'Context got enormous',
      d:'From a few pages to a few hundred thousand words. That changed what you can attempt — whole ' +
        'documents rather than extracts — more than any capability jump did.' },
    { t:'They gained hands',
      d:'A model that can search, run code, call your systems and read the result is a different kind of ' +
        'thing from one that can only talk. Chapter 07 is about this.' },
    { t:'They learned to take their time',
      d:'Reasoning models made effort a dial. Hard problem: think longer, pay more, get a better answer. ' +
        'Easy problem: answer instantly for a fraction of a penny.' }
  ]
});

/* ═══ 06 ═══════════════════════════════════════════════════════════════════ */
DECK.push({
  id:'ch6', ch:6, type:'chapter',
  title:'What changed<br>inside',
  lede:'Two ideas explain most of the last two years of progress. One buys accuracy with time. The other ' +
       'buys size without paying for it on every request.',
  covers:['Reasoning models','When thinking helps','Mixture of experts']
});

DECK.push({
  id:'reasoning', ch:6, type:'trace',
  kicker:'Chapter 06 &middot; reasoning models',
  title:'Thinking before answering',
  lede:'An ordinary model starts writing its answer with the first token. A <b>reasoning model</b> first ' +
       'writes to itself — working, checking, sometimes changing its mind — and only then answers.',
  foot:'The scratchpad is made of exactly the same next-token prediction. Nothing new was added — ' +
       'the model was trained to <b>use some of its output on working rather than answering</b>.',
  q:'A bat and a ball cost &pound;1.10 together. The bat costs &pound;1.00 more than the ball. ' +
    'How much is the ball?',
  lines:[
    'The intuitive answer is 10p. Let me check it.',
    'If the ball is 10p, the bat is 10p + &pound;1.00 = &pound;1.10.',
    'Then the total would be &pound;1.20, not &pound;1.10. So 10p is wrong.',
    'Let the ball be x. Then bat = x + 1.00, and x + (x + 1.00) = 1.10.',
    '2x = 0.10, so x = 0.05.',
    'Check: ball 5p, bat &pound;1.05, total &pound;1.10, difference &pound;1.00. Correct.'
  ],
  a:'The ball costs <b>5p</b> (and the bat &pound;1.05).'
});

DECK.push({
  id:'reasoning2', ch:6, type:'columns',
  kicker:'Chapter 06 &middot; the trade',
  title:'When thinking is worth paying for',
  lede:'Reasoning is not a free upgrade. It costs time and money on every request, and on most requests it ' +
       'buys you nothing. Knowing which is which is the practical skill.',
  foot:'Most products now decide for you, routing easy questions to a fast path and hard ones to a slow ' +
       'one. When you are choosing yourself: <b>does this have a checkable right answer?</b>',
  cols:[
    { tag:'worth it', t:'Problems with steps',
      sub:'Where a wrong early move poisons everything after it, and the model can catch itself.',
      lines:['Maths, logic, puzzles','Debugging and code review','Planning work with dependencies',
             'Anything where you can verify the answer'],
      note:'Gains here are large — often the difference between usually wrong and usually right.' },
    { tag:'no gain', tone:'muted', t:'Problems without them',
      sub:'Where the answer is recall, style or taste, there is nothing to reason towards.',
      lines:['Summarising a document','Rewriting in another tone','Simple factual lookup',
             'Chat, drafting, brainstorming'],
      note:'You pay for thinking and get the same answer, slower.' },
    { tag:'the catch', t:'What it does not fix',
      sub:'A longer chain of reasoning is still generated text, and it can be confidently wrong throughout.',
      lines:['Reasoning can be wrong <i>and</i> fluent','The trace is not a proof of the answer',
             'It can still invent a source','Latency goes from seconds to minutes'],
      note:'Treat the trace as working shown, not as evidence.' }
  ]
});

DECK.push({
  id:'moe', ch:6, type:'moe',
  kicker:'Chapter 06 &middot; architecture',
  title:'Mixture of experts',
  lede:'A way to have a very large model without running all of it every time. The network is split into ' +
       'many parallel sections, and a small <b>router</b> picks a couple for each token.',
  denseCap:'Every parameter runs for every token. Capability and cost rise together — you cannot have ' +
       'one without the other.',
  moeCap:'The same total size, split up. Each token activates only a small slice, so the running cost is a ' +
       'fraction of the parameter count.',
  experts:['pattern group','pattern group','pattern group','pattern group',
           'pattern group','pattern group','pattern group','pattern group'],
  states:[
    { dense:true, denseHot:true },
    { dense:true, moe:true },
    { dense:true, moe:true, router:true, lit:[2,5], tok:'·arithmetic' },
    { dense:true, moe:true, router:true, lit:[0,6], tok:'·château' },
    { dense:true, moe:true, router:true, lit:[0,6] }
  ],
  foot:'The sections are <b>not</b> tidy human specialisms — there is no &ldquo;French expert&rdquo;. ' +
       'They are statistical groupings nobody chose and nobody can label. The boxes here are illustrative.',
  notes:[
    { t:'A dense model runs whole',
      d:'Every one of its parameters is used for every token. Doubling the model doubles what each answer ' +
        'costs to produce.' },
    { t:'A mixture is divided',
      d:'The same parameters, arranged as many parallel sections. Only a few are used at a time, but all ' +
        'of them must still be held in memory.' },
    { t:'A router chooses per token',
      d:'A small network looks at each token and picks which sections handle it — typically two out of ' +
        'eight, or eight out of a hundred and twenty-eight.' },
    { t:'Different tokens, different sections',
      d:'The next token may be routed somewhere else entirely. The choice is made fresh, thousands of times ' +
        'a second, inside a single answer.' },
    { t:'That is the whole trick',
      d:'It is why a model can be advertised with a huge parameter count and still be fast and cheap to ' +
        'run. Most large models released since 2024 work this way.' }
  ]
});
