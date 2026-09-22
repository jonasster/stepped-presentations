/* ═══ content, part 2 — inside a language model, and how one is made ═══════ */

/* ═══ 03 ═══════════════════════════════════════════════════════════════════ */
DECK.push({
  id:'ch3', ch:3, type:'chapter',
  title:'Inside a<br>language model',
  lede:'A model does not read words and it does not look anything up. It turns text into numbers, and then ' +
       'repeatedly answers one narrow question: <b>what comes next?</b>',
  covers:['Text becomes tokens','Meaning as coordinates','Guessing the next piece','Attention','The context window']
});

DECK.push({
  id:'tokens', ch:3, type:'tokens',
  kicker:'Chapter 03 &middot; tokens',
  title:'Text becomes numbers',
  lede:'The first thing that happens to anything you type. The text is chopped into <b>tokens</b> — ' +
       'common chunks, roughly three-quarters of a word each — and every chunk is swapped for its ID number.',
  foot:'Token IDs shown are illustrative. Different models chop text differently, which is why the same ' +
       'sentence can cost slightly different amounts on different services.',
  raw:'Generative AI is not magic, it is arithmetic.',
  splitAt:2, idAt:3,
  toks:[['Gener','8645'],['ative','1413'],[' AI','15592'],[' is','374'],[' not','539'],[' magic','11204'],
        [',','11'],[' it','433'],[' is','374'],[' arith','070'],['metic','56255'],['.','13']],
  notes:[
    { t:'Not words. Pieces.',
      d:'Common words are one token. Rarer ones get split, which is why a model can spell out an unusual ' +
        'word it has never seen whole.' },
    { t:'Each piece has an ID',
      d:'The model has a fixed vocabulary, typically 50,000–200,000 entries. Every token is just its ' +
        'position in that list.' },
    { t:'Spaces belong to the token',
      d:'The dot shown here is a leading space. <code>&middot;is</code> and <code>is</code> are different ' +
        'tokens to the model — which is one small reason formatting affects output.' },
    { t:'This is what you pay for',
      d:'Usage is billed per token, in and out. A page of text is roughly 500 tokens; this sentence is ' +
        'about twenty.' }
  ]
});

DECK.push({
  id:'meaning', ch:3, type:'scatter',
  kicker:'Chapter 03 &middot; embeddings',
  title:'Meaning as a position',
  lede:'Each token ID is then swapped for an <b>embedding</b>: a long list of numbers that acts as a set of ' +
       'coordinates. Things that mean similar things end up near one another.',
  foot:'Real embeddings have <b>hundreds or thousands</b> of dimensions, not two. That is what lets ' +
       '&ldquo;bank&rdquo; sit near both <i>river</i> and <i>money</i>, in different directions.',
  groups:[
    { c:'c3', t:'Similar things cluster',
      d:'Nobody placed these. The positions fell out of training, from noticing which words turn up in ' +
        'the same kinds of sentence.',
      pts:[[150,120,'cat'],[232,168,'dog'],[120,212,'hamster'],[262,80,'puppy'],[196,256,'kitten']] },
    { c:'c3', t:'Distance is relatedness',
      d:'Two clusters far apart are unrelated topics. The model uses this constantly: it is how a question ' +
        'about <i>lorries</i> can draw on things it read about <i>vans</i>.',
      pts:[[700,150,'monarch'],[836,118,'throne'],[716,400,'crown'],[660,300,'king'],[770,244,'queen']] },
    { c:'c3', t:'Direction carries meaning',
      d:'The step from <i>man</i> to <i>woman</i> points the same way as <i>actor</i> to <i>actress</i> ' +
        'and <i>king</i> to <i>queen</i>. Relationships live in the geometry.',
      pts:[[210,470,'man'],[320,414,'woman'],[430,500,'actor'],[540,444,'actress']] }
  ],
  /* three deliberately parallel offsets — the point of the figure is that the
     step is the same one, so the coordinates above are chosen to make it so */
  arrow:{ d:'M210 470 L320 414 M430 500 L540 444 M660 300 L770 244', tx:210, ty:548,
          t:'the same step, three times — that is what a relationship looks like here' }
});

DECK.push({
  id:'predict', ch:3, type:'bars',
  kicker:'Chapter 03 &middot; the one thing it does',
  title:'It is guessing the next piece',
  lede:'Given <b>&ldquo;The capital of France is&rdquo;</b>, the model produces a score for every token in its ' +
       'vocabulary. Not an answer — a whole distribution of possible next pieces.',
  foot:'It then picks one, appends it, and does the entire thing again for the next token. <b>Every</b> ' +
       'sentence you have ever seen a model write was produced one piece at a time, this way.',
  bars:[
    { label:'&middot;Paris',   value:'91%',  pct:91, note:'the obvious continuation' },
    { label:'&middot;the',     value:'3.4%', pct:14, note:'as in &ldquo;the city of Paris&rdquo;' },
    { label:'&middot;located', value:'1.9%', pct:8,  note:'a different sentence shape' },
    { label:'&middot;a',       value:'0.8%', pct:4,  note:'&ldquo;a city in the north&rdquo;' },
    { label:'everything else', value:'2.9%', pct:11, muted:true, note:'the remaining ~100,000 tokens, ' +
        'each with a tiny share' }
  ]
});

DECK.push({
  id:'temperature', ch:3, type:'points',
  kicker:'Chapter 03 &middot; consequences',
  title:'Three things that follow',
  lede:'Almost every surprising behaviour of these systems falls out of that one mechanism. It is worth ' +
       'sitting with for a moment.',
  foot:'None of this is a bug being fixed later. It is what next-token prediction <b>is</b>.',
  points:[
    { t:'It does not plan the sentence',
      d:'There is no draft it is working towards. Coherence over a paragraph comes from each new piece ' +
        'being chosen in the light of everything already written — including what it just wrote itself.' },
    { t:'It is deliberately not certain',
      d:'Always taking the top choice makes flat, repetitive text. So the pick is a weighted random draw. ' +
        'That setting is <code>temperature</code>, and it is why the same prompt gives different answers.' },
    { t:'Plausible beats true',
      d:'The scores rank what <b>fits</b>, not what is correct. When a plausible-sounding falsehood outranks ' +
        'the truth — a citation that looks exactly like a real one — that is what comes out.' }
  ]
});

DECK.push({
  id:'attention', ch:3, type:'points',
  kicker:'Chapter 03 &middot; the transformer',
  title:'Attention, in one idea',
  lede:'The 2017 paper that made all of this possible is called <i>Attention Is All You Need</i>. ' +
       'The idea it introduced is simpler than the name suggests.',
  foot:'This was the unlock. Older designs read a sentence strictly left to right; attention let models ' +
       'weigh <b>everything at once</b> — and, crucially, do it in parallel on thousands of chips.',
  points:[
    { t:'Words need other words',
      d:'&ldquo;The trophy did not fit in the case because <b>it</b> was too big.&rdquo; What is <i>it</i>? ' +
        'You resolved that by glancing back at the rest of the sentence. So does the model.' },
    { t:'Every token looks at every other',
      d:'At each layer, each token gets a set of scores for how much every other token matters to it right ' +
        'now, and pulls in their information in those proportions.' },
    { t:'The scores are computed, not stored',
      d:'They are worked out fresh for each input. This is why the model handles sentences it has never ' +
        'seen — it is not matching, it is weighing.' },
    { t:'That is the &ldquo;T&rdquo; in GPT',
      d:'<b>Transformer</b>: the architecture built around attention. Every major model today — text, ' +
        'image, audio — is a variation on it.' }
  ]
});

DECK.push({
  id:'context', ch:3, type:'window',
  kicker:'Chapter 03 &middot; memory',
  title:'The context window',
  lede:'A model has no memory between messages. Every time you press send, the <b>entire</b> conversation is ' +
       're-sent and re-read from scratch. The window is how much of it fits.',
  foot:'Windows have grown from about 4,000 tokens in 2022 to hundreds of thousands, and in some models ' +
       'over a million. <b>A bigger window is not memory</b> — it is a bigger note passed in each time.',
  frameLabel:'what the model can see',
  frameAt:3, dropAt:5, drops:4,
  show:[2, 4, 4, 8, 10],
  turns:[
    { who:'you',   t:'My name is Jonas and I work in logistics.' },
    { who:'model', t:'Nice to meet you, Jonas. What can I help with?' },
    { who:'you',   t:'Draft a note to a supplier about a late delivery.' },
    { who:'model', t:'Here is a draft: &ldquo;Dear supplier &mdash; regarding order 4471&hellip;&rdquo;' },
    { who:'you',   t:'Make it firmer.' },
    { who:'model', t:'Revised, with a clear deadline and a consequence stated.' },
    { who:'you',   t:'Now the same thing for a different supplier.' },
    { who:'model', t:'Adapted, with the order reference left blank for you.' },
    { who:'you',   t:'Remind me what I said I do for a living?' },
    { who:'model', t:'I do not have that earlier part of our conversation any more.' }
  ],
  notes:[
    { t:'It re-reads everything, every time',
      d:'Your first message is processed again on your fortieth. Nothing is remembered between turns — ' +
        'the transcript is simply resent.' },
    { t:'That is why long chats cost more',
      d:'You pay for the whole transcript on each turn, so a conversation gets steadily more expensive as ' +
        'it goes on, even if your messages stay short.' },
    { t:'The window is a hard edge',
      d:'It is a fixed number of tokens — prompt, history, documents and the reply all share it. ' +
        'Everything inside is visible at once.' },
    { t:'What falls out is gone',
      d:'Past the limit, the oldest turns are dropped or summarised. The model does not know something is ' +
        'missing, which is why it can contradict what you agreed an hour ago.' },
    { t:'&ldquo;Memory&rdquo; is a feature, not the model',
      d:'Products that remember you across sessions are storing notes outside the model and quietly pasting ' +
        'them back into the window. Useful — but it is filing, not recall.' }
  ]
});

/* ═══ 04 ═══════════════════════════════════════════════════════════════════ */
DECK.push({
  id:'ch4', ch:4, type:'chapter',
  title:'How a model<br>is made',
  lede:'Between a pile of text and something you can talk to, there are three distinct stages — and they ' +
       'produce very different things. The last one is where the personality comes from.',
  covers:['The three stages','What it costs','Four ways to make it yours']
});

DECK.push({
  id:'pipeline', ch:4, type:'flow',
  kicker:'Chapter 04 &middot; the stages',
  title:'From raw text to an assistant',
  lede:'Each stage takes the output of the last and changes what the model is <b>for</b>. Skip the last two ' +
       'and you have something that rambles rather than answers.',
  foot:'A useful distinction: pretraining produces <b>knowledge and fluency</b>. The later stages produce ' +
       '<b>behaviour</b> — answering, refusing, formatting, admitting uncertainty.',
  nodes:[
    { t:'Pretraining', d:'Months of predicting the next token across an enormous body of text and code. ' +
        'This is where nearly all the knowledge and all the cost live. Result: a fluent text-continuer that ' +
        'is not much use to talk to.' },
    { t:'Fine-tuning', d:'A much smaller, curated set of example conversations — good question, good ' +
        'answer. This teaches the shape of being helpful: answer the question, follow the instruction, ' +
        'stop at the end.' },
    { t:'Feedback', d:'People compare two candidate answers and mark the better one, thousands of times. ' +
        'Those preferences train the model towards what people actually want. Often called <b>RLHF</b>: ' +
        'reinforcement learning from human feedback.' },
    { t:'Release', d:'Safety testing, guardrails, rate limits, a system prompt setting the ground rules, ' +
        'and monitoring once it is live. The model is frozen at this point — it does not learn from ' +
        'your conversations.' }
  ]
});

DECK.push({
  id:'scale', ch:4, type:'bars',
  kicker:'Chapter 04 &middot; cost',
  title:'Why so few can build one',
  lede:'Rough orders of magnitude for training one frontier model, from public estimates. Precise figures ' +
       'are not published — but the shape of the answer is not in doubt.',
  foot:'Two consequences. <b>Frontier training is a handful of organisations</b>, because of that bottom row. ' +
       'And <b>using</b> a model has become very cheap, which is the opposite curve.',
  bars:[
    { label:'text read', value:'~10T', pct:88, note:'tokens &mdash; a large fraction of the useful public web, ' +
        'plus books, code and licensed material' },
    { label:'chips', value:'10–100k', pct:62, note:'specialised processors, running together, for a ' +
        'single training run' },
    { label:'wall-clock time', value:'2–6 mo', pct:34, note:'a run that fails near the end is a very ' +
        'expensive failure' },
    { label:'energy', value:'GWh', pct:46, note:'enough that where you build the data centre is now a ' +
        'strategic question' },
    { label:'cost of one run', value:'$10–100M+', pct:96, note:'and it is obsolete within a year or two' }
  ]
});

DECK.push({
  id:'adapt', ch:4, type:'columns',
  kicker:'Chapter 04 &middot; making it yours',
  title:'Four ways to point a model at your own work',
  lede:'This is the decision people get wrong most often, usually by reaching for the expensive option ' +
       'first. They are listed here in the order you should try them.',
  foot:'Rule of thumb: <b>prompting changes what it does, retrieval changes what it knows, fine-tuning ' +
       'changes how it behaves.</b> Very few people need the fourth column.',
  cols:[
    { tag:'start here', t:'Prompting',
      sub:'Just tell it, in the message, including examples of what good looks like.',
      lines:['Free, instant, anyone can do it','Change your mind in seconds','Limited by the context window'],
      note:'Surprisingly often, this is the whole answer.' },
    { tag:'for your data', t:'Retrieval',
      sub:'Search your own documents first, paste the relevant few into the prompt.',
      lines:['Always current — no retraining','You can show the sources','Only as good as the search'],
      note:'Called RAG. Chapter 07 has the diagram.' },
    { tag:'for your style', t:'Fine-tuning',
      sub:'Continue training the model a little on a few hundred to a few thousand of your examples.',
      lines:['Teaches tone, format, a niche task','Needs good examples and maintenance','Does not reliably add facts'],
      note:'Reach for it when prompting keeps almost working.' },
    { tag:'almost never', tone:'muted', t:'From scratch',
      sub:'Train your own foundation model on your own data.',
      lines:['Total control over everything','The costs on the previous slide','Needs a research team'],
      note:'For national labs and a handful of companies.' }
  ]
});
