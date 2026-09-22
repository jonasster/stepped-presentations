/* ═══ content, part 1 — the words, and how machines learn ══════════════════
   Everything on screen comes from these files. Adding a scene is adding an
   entry; nothing here should require editing the engine or a renderer. */
window.DECK = [];

window.CHAPTERS = [
  { n:1, scene:'ch1', title:'Where AI sits',        blurb:'The words everyone uses, and which one contains which.' },
  { n:2, scene:'ch2', title:'How machines learn',   blurb:'Learning from examples, and what a neural network actually is.' },
  { n:3, scene:'ch3', title:'Inside a language model', blurb:'Tokens, meaning as coordinates, and guessing the next word.' },
  { n:4, scene:'ch4', title:'How a model is made',  blurb:'Pretraining, fine-tuning, feedback, and what it all costs.' },
  { n:5, scene:'ch5', title:'Since ChatGPT',        blurb:'November 2022 to now, and what actually changed.' },
  { n:6, scene:'ch6', title:'What changed inside',  blurb:'Reasoning models, and mixtures of experts.' },
  { n:7, scene:'ch7', title:'Around the model',     blurb:'Harnesses, tools, MCP, skills, retrieval and agents.' },
  { n:8, scene:'ch8', title:'Limits and trust',     blurb:'Hallucination, evaluation, safety, and who builds these.' }
];

DECK.push({
  id:'start', ch:1, type:'cover',
  kicker:'A guided tour &middot; click through at your own pace',
  title:'Generative AI,<br>explained',
  lede:'Eight chapters, from <b>what a neural network is</b> to <b>what an agent does when you are not watching</b>. ' +
       'No maths, no code, nothing assumed. Every term is defined the first time it appears.',
  hint:'Press → or click anywhere to move forward &middot; ← to go back &middot; M for the contents'
});

/* ═══ 01 ═══════════════════════════════════════════════════════════════════ */
DECK.push({
  id:'ch1', ch:1, type:'chapter',
  title:'Where AI<br>sits',
  lede:'Five words get used as if they mean the same thing. They do not — they sit inside one another, ' +
       'like a set of nesting dolls. Getting this straight makes everything after it easier.',
  covers:['The nesting doll of terms','What &ldquo;generative&rdquo; adds','Rules versus patterns']
});

DECK.push({
  id:'nesting', ch:1, type:'nest',
  kicker:'Chapter 01 &middot; the terms',
  title:'One term inside another',
  lede:'Each of these is a smaller, more specific thing than the one around it. A large language model is ' +
       'one kind of generative AI, which is one kind of deep learning, and so on outwards.',
  foot:'So: <b>every LLM is AI, but almost no AI is an LLM.</b> Most of the AI quietly running in the world ' +
       'is still the outer rings — fraud scoring, recommendations, route planning.',
  rings:[
    { c:'c1', tag:'artificial intelligence', t:'Artificial intelligence',
      d:'The whole field: any attempt to make a machine do something we would call intelligent. ' +
        'A chess program from 1997 counts.' },
    { c:'c1', tag:'machine learning', t:'Machine learning',
      d:'The part where the machine is not told the rules. It is shown many examples and works out the ' +
        'rules itself. Spam filters, credit scoring.' },
    { c:'c1', tag:'deep learning', t:'Deep learning',
      d:'Machine learning done with <b>neural networks</b> that have many layers. This is what made image ' +
        'recognition and speech work around 2012.' },
    { c:'c1', tag:'generative ai', t:'Generative AI',
      d:'Deep learning models that <b>produce</b> something new — text, an image, audio, code — rather ' +
        'than only sorting or scoring what you give them.' },
    { c:'c1', tag:'llm', t:'Large language model',
      d:'A generative model whose material is <b>text</b>. ChatGPT, Claude and Gemini are products built ' +
        'around one. This is what people usually mean by &ldquo;AI&rdquo; today.' }
  ]
});

DECK.push({
  id:'generative', ch:1, type:'columns',
  kicker:'Chapter 01 &middot; what changed',
  title:'From writing rules to making things',
  lede:'Three ways to get a computer to do something useful. Each one moved the work somewhere else — ' +
       'and the third is why the last few years felt sudden.',
  foot:'The jump is not that the machine got cleverer. It is that <b>describing what you want</b> replaced ' +
       '<b>specifying how to do it</b>.',
  cols:[
    { tag:'until the 2010s', tone:'muted', t:'You write the rules',
      sub:'A person works out the logic and types it in. The program does exactly that, forever.',
      lines:['Predictable, auditable, testable','Breaks on anything unforeseen',
             'Someone must understand the problem completely first'],
      note:'Still the right answer for payroll, tax, and anything that must be exactly right.' },
    { tag:'machine learning', t:'It finds the rules',
      sub:'You supply thousands of labelled examples. The machine finds the pattern that separates them.',
      lines:['Handles messy input people cannot specify','Needs labelled examples, lots of them',
             'Answers a question you chose in advance'],
      note:'&ldquo;Is this transaction fraud?&rdquo; &mdash; one question, one number back.' },
    { tag:'generative ai', t:'It produces something',
      sub:'The model learns the shape of language itself, then writes text that fits what you asked for.',
      lines:['One model, an open-ended range of tasks','You ask in plain words, not in code',
             'The output is new text, not a label'],
      note:'You did not train it for your task. You described your task to it.' }
  ]
});

/* ═══ 02 ═══════════════════════════════════════════════════════════════════ */
DECK.push({
  id:'ch2', ch:2, type:'chapter',
  title:'How machines<br>learn',
  lede:'&ldquo;Training a model&rdquo; sounds like teaching. It is closer to tuning millions of dials until the ' +
       'output stops being wrong. Here is what is actually in the box.',
  covers:['Examples instead of instructions','What a neural network is','The training loop','Parameters, and why size matters']
});

DECK.push({
  id:'learn', ch:2, type:'columns',
  kicker:'Chapter 02 &middot; the shift',
  title:'Nobody could write this down',
  lede:'The classic example: get a computer to tell a cat from a dog. Try to write the rules and you will ' +
       'fail — not because it is hard, but because you do not actually know how you do it.',
  foot:'This is the whole idea of machine learning: <b>when you can recognise the answer but cannot state ' +
       'the rule</b>, supply examples instead.',
  cols:[
    { tag:'the old way', tone:'muted', t:'Describe a cat',
      sub:'You would have to define whiskers, ear shape, face proportions — in code, unambiguously.',
      lines:['Pointed ears? So have some dogs.','Whiskers? Hidden at this angle.',
             'Small? Not a Maine Coon.','Every rule you add breaks another case.'],
      note:'Decades of computer vision research went this way, and it plateaued.' },
    { tag:'the learned way', t:'Show it 10,000 cats',
      sub:'Give the machine labelled photos and let it adjust itself until its guesses match the labels.',
      lines:['Nobody states what a cat looks like','The pattern lives in the adjusted numbers',
             'Feed it new photos and it generalises','Nobody can read back the rule it found'],
      note:'That last point is the trade: it works, and it is not fully inspectable.' }
  ]
});

DECK.push({
  id:'network', ch:2, type:'network',
  kicker:'Chapter 02 &middot; the machinery',
  title:'What a neural network is',
  lede:'Not a brain. A big grid of numbers and simple arithmetic, arranged in layers, where each connection ' +
       'has a <b>weight</b> — a number saying how much this signal matters to that one.',
  foot:'A modern language model is this picture with <b>billions</b> of connections and a hundred-odd layers. ' +
       'Same arithmetic, absurd scale.',
  shape:[4, 6, 6, 3],
  layers:['input','hidden layer','hidden layer','output'],
  show:[1, 2, 3, 4, 4, 4],
  weightAt:5, flowAt:6,
  notes:[
    { t:'It starts with input',
      d:'Whatever you are feeding in, turned into numbers. Pixel brightnesses for an image; for text, ' +
        'a number per word-piece.' },
    { t:'Then a layer of units',
      d:'Each unit adds up every number reaching it, each multiplied by its own <b>weight</b>, and passes ' +
        'the total on if it is big enough.' },
    { t:'Then another, and another',
      d:'Early layers pick up crude features — an edge, a common letter pair. Later layers combine those ' +
        'into something meaningful.' },
    { t:'And an answer comes out',
      d:'At the far end, a number per possible answer. For a language model: a score for every word-piece ' +
        'that could come next.' },
    { t:'The weights are the model',
      d:'Every line here has a strength, shown by its thickness. Those numbers are the <b>only</b> thing ' +
        'training changes, and the only thing the model knows.' },
    { t:'Nothing else moves',
      d:'The shape is fixed by the people who built it. Running the model is just this arithmetic, in one ' +
        'direction, very fast, over and over.' }
  ]
});

DECK.push({
  id:'training', ch:2, type:'flow',
  kicker:'Chapter 02 &middot; training',
  title:'The training loop',
  lede:'This is the whole of &ldquo;training a model&rdquo;. Four steps, repeated — for a large model, ' +
       'trillions of times, across thousands of machines, for months.',
  loop:'repeat &mdash; trillions of times',
  foot:'Nobody chooses the weights. They are <b>found</b>, by an unimaginable number of tiny corrections. ' +
       'This is why no one can point at a model and say where a particular fact is stored.',
  nodes:[
    { t:'Guess', d:'Show the model an example with the answer hidden. It produces its best guess using ' +
        'whatever its weights currently say.' },
    { t:'Compare', d:'Check the guess against the real answer and score how wrong it was. That score is ' +
        'called the <b>loss</b>.' },
    { t:'Blame', d:'Work backwards through the layers to see which weights pushed the guess in the wrong ' +
        'direction, and by how much.' },
    { t:'Nudge', d:'Move every one of those weights a tiny step in the better direction. Not a fix — ' +
        'a nudge, thousandths of a percent.' }
  ]
});

DECK.push({
  id:'params', ch:2, type:'points',
  kicker:'Chapter 02 &middot; scale',
  title:'Parameters, in plain words',
  lede:'You will see models described as &ldquo;70B&rdquo; or &ldquo;a trillion parameters&rdquo;. Here is what ' +
       'that number is and what it is not.',
  foot:'Parameter count is a rough proxy for capability, <b>not</b> a ranking. A well-trained smaller model ' +
       'routinely beats a badly-trained larger one.',
  points:[
    { t:'A parameter is a dial',
      d:'One number — usually a connection weight. &ldquo;70 billion parameters&rdquo; means 70 billion of ' +
        'those numbers were adjusted during training, and are consulted every time the model runs.' },
    { t:'Nothing is stored as text',
      d:'The model does not keep a copy of what it read. Facts, style and grammar all end up smeared across ' +
        'those numbers as statistical tendencies — which is why it can be confidently wrong.' },
    { t:'More dials, more nuance',
      d:'Bigger models pick up subtler patterns and hold more in their heads at once. Past a point, though, ' +
        'the data and the training recipe matter more than raw size.' },
    { t:'Size costs you twice',
      d:'Once to train, and again every single time anyone uses it. That running cost is why small fast ' +
        'models and large slow ones both exist, and why you are asked to pick.' }
  ]
});
