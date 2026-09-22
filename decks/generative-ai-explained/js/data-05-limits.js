/* ═══ content, part 5 — limits, trust, and the recap ═══════════════════════ */

DECK.push({
  id:'ch8', ch:8, type:'chapter',
  title:'Limits<br>and trust',
  lede:'Everything so far explains what these systems do. This chapter is about what they do badly, why ' +
       'the failures look the way they do, and how anyone decides whether a model is any good.',
  covers:['Why it makes things up','What it is bad at','How models are evaluated','Safety, and who builds these']
});

DECK.push({
  id:'hallucinate', ch:8, type:'points',
  kicker:'Chapter 08 &middot; hallucination',
  title:'Why it invents things',
  lede:'A model stating a fake court case with a plausible citation is not malfunctioning. It is doing ' +
       'exactly what it does the rest of the time — producing text that fits.',
  foot:'The practical consequence: <b>confidence carries no information.</b> A wrong answer is generated ' +
       'by the same process, with the same fluency, as a right one.',
  points:[
    { t:'There is no fact store to check',
      d:'Nothing is looked up. The answer is assembled from statistical tendencies spread across billions ' +
        'of weights, so there is no record to consult and no gap to notice.' },
    { t:'A shape can be right while the content is wrong',
      d:'The model has strongly learnt what a citation, a case number or an API function <i>looks</i> like. ' +
        'Filling that shape convincingly is easy; filling it truthfully is a different problem.' },
    { t:'Silence was never rewarded',
      d:'Training rewards helpful answers. Historically, a confident guess scored better than &ldquo;I do ' +
        'not know&rdquo;, and that tendency is still being trained back out.' },
    { t:'The fixes are all external',
      d:'Retrieval, citation, letting it search, checking its output with code. Every reliable system does ' +
        'this — none of it happens inside the model.' }
  ]
});

DECK.push({
  id:'limits', ch:8, type:'columns',
  kicker:'Chapter 08 &middot; the shape of the failures',
  title:'What it is good and bad at',
  lede:'Capability here is jagged, not a single level. A model that drafts a decent legal summary may ' +
       'miscount the words in a sentence — and neither tells you much about the other.',
  foot:'The useful instinct: <b>ask whether a wrong answer would be obvious to you.</b> If it would not be, ' +
       'that is precisely where you need a check that is not another model.',
  cols:[
    { tag:'reliably strong', t:'Transforming text',
      sub:'Anything where the material is in front of it and the job is to reshape it.',
      lines:['Summarising, rewriting, translating','Drafting a first version of anything',
             'Extracting structure from mess','Explaining code or documents'],
      note:'You can usually check these at a glance, which is why they feel so good.' },
    { tag:'unreliable', tone:'muted', t:'Facts from memory',
      sub:'Anything recalled rather than read — especially specific, verifiable details.',
      lines:['Dates, figures, quotes, citations','Anything after its training cut-off',
             'Niche or rapidly changing topics','Its own confidence about all of this'],
      note:'Give it the source and this whole column moves left.' },
    { tag:'structurally weak', t:'Counting and characters',
      sub:'Consequences of working in tokens rather than letters or numbers.',
      lines:['Letters in a word, items in a list','Arithmetic done in its head',
             'Exact quoting over long distances','Holding a strict count across a long answer'],
      note:'Solved by giving it a calculator or code, not a better prompt.' },
    { tag:'worth knowing', t:'It cannot know itself',
      sub:'Ask it how it works and it will answer from what it read, not from introspection.',
      lines:['It cannot report its own confidence','Its explanation may not be its actual reason',
             'It does not know what it was trained on','It cannot tell you if it is wrong'],
      note:'Treat self-reports as generated text, because that is what they are.' }
  ]
});

DECK.push({
  id:'evaluate', ch:8, type:'points',
  kicker:'Chapter 08 &middot; evaluation',
  title:'How anyone knows if a model is good',
  lede:'Every vendor publishes a chart showing they win. Here is roughly what those numbers are, and what ' +
       'to do instead if the decision matters to you.',
  foot:'The only benchmark that settles anything for you is <b>fifty real examples from your own work, ' +
       'with answers you already trust.</b> It takes an afternoon and beats every leaderboard.',
  points:[
    { t:'Benchmarks are exams',
      d:'Fixed question sets — maths, code, reasoning, professional exams — scored automatically. ' +
        'Useful for coarse comparison, and roughly as predictive of real work as exam results are.' },
    { t:'And exams leak',
      d:'If the questions were on the public web, they may be in the training data. A high score can mean ' +
        'the model has seen the paper, and this is genuinely hard to rule out.' },
    { t:'Human preference is a popularity contest',
      d:'Side-by-side ratings from the public measure what people <i>like</i>: confident, well-formatted, ' +
        'agreeable. Those are not the same as correct.' },
    { t:'Model-graded is circular but practical',
      d:'Using a strong model to grade another scales well and is now standard. It also inherits the ' +
        'grader’s blind spots — fine for regression testing, weak as proof.' }
  ]
});

DECK.push({
  id:'safety', ch:8, type:'points',
  kicker:'Chapter 08 &middot; safety',
  title:'What &ldquo;alignment&rdquo; means in practice',
  lede:'Not one thing. It covers the everyday work of making a model behave, and the longer-horizon ' +
       'question of whether we can keep steering systems more capable than the last ones.',
  foot:'Worth separating: <b>present-day harms</b> — bad advice, privacy, bias, misuse — are ' +
       'concrete and measurable. Longer-term concerns are speculative but the reason serious money goes ' +
       'into this research.',
  points:[
    { t:'Most of it is training',
      d:'The feedback stage from chapter 04 is where refusal, honesty, tone and caution are taught. ' +
        'Behaviour is shaped by preference data, not by a rulebook the model consults.' },
    { t:'Some of it is a fence',
      d:'Separate filters on input and output, rate limits, tool permissions, logging. Cruder than ' +
        'training, but inspectable and switchable — which is exactly why it is used.' },
    { t:'Prompt injection is unsolved',
      d:'A model reading a web page or a document cannot fully distinguish <i>content</i> from ' +
        '<i>instructions</i>. Give an agent reach and untrusted input, and this becomes your problem.' },
    { t:'Bias comes from the material',
      d:'Trained on human writing, models reproduce its assumptions, and can amplify them by producing ' +
        'the most typical version of everything. Measurable; not fully fixable.' }
  ]
});

DECK.push({
  id:'makers', ch:8, type:'columns',
  kicker:'Chapter 08 &middot; the landscape',
  title:'Who actually builds these',
  lede:'Four camps, with genuinely different incentives. Knowing which one a model comes from tells you ' +
       'something about how it will behave and what you are agreeing to.',
  foot:'For most organisations the real question is not which lab, but <b>hosted or self-hosted</b> — ' +
       'and that is a question about your data, your regulator and your appetite for running infrastructure.',
  cols:[
    { tag:'frontier labs', t:'The specialists',
      sub:'Anthropic, OpenAI and a few others: companies whose product is the model itself.',
      lines:['Fastest to the capability frontier','Safety research is a stated priority',
             'You rent access through an API','Model versions change under you'],
      note:'Compete on capability, price and trust.' },
    { tag:'big platforms', t:'The incumbents',
      sub:'Google, Microsoft, Amazon, Meta: models as part of a much larger business.',
      lines:['Distribution into software you already use','Bundled with cloud and enterprise agreements',
             'Deep pockets, long horizons','Often the path of least resistance'],
      note:'You may already be using one without choosing it.' },
    { tag:'open weights', t:'The downloadable',
      sub:'Models published for anyone to run, from Meta, Mistral, DeepSeek, Alibaba and others.',
      lines:['Run entirely on your own hardware','No data leaves your environment',
             'Free to modify and fine-tune','You own the hosting and the upkeep'],
      note:'&ldquo;Open weights&rdquo; rarely means open training data.' },
    { tag:'everyone else', tone:'muted', t:'The builders',
      sub:'The vast majority of &ldquo;AI companies&rdquo; — products built on someone else’s model.',
      lines:['Compete on the harness, not the model','Own the workflow and the context',
             'Can switch models underneath','This is where most of the jobs are'],
      note:'Chapter 07 is a description of this work.' }
  ]
});

DECK.push({
  id:'recap', ch:8, type:'recap',
  kicker:'The whole thing',
  title:'Eight ideas, one page',
  lede:'If you keep one sentence from each chapter, keep these.',
  foot:'Press <b>M</b> for the contents to jump back to any chapter, or <b>←</b> to walk back through. ' +
       'The address bar holds a link to whichever step you are on.',
  items:[
    { t:'Nesting dolls', d:'AI contains machine learning contains deep learning contains generative AI ' +
        'contains large language models.' },
    { t:'Found, not written', d:'Nobody programs the behaviour. Billions of weights are nudged until the ' +
        'output stops being wrong.' },
    { t:'One token at a time', d:'Text becomes numbered pieces; the model scores what comes next, picks ' +
        'one, and repeats.' },
    { t:'Three stages', d:'Pretraining gives it knowledge, fine-tuning gives it manners, feedback gives ' +
        'it judgement.' },
    { t:'Four curves', d:'Since 2022: cost collapsed, context grew, tools arrived, and thinking time ' +
        'became a dial.' },
    { t:'Time and routing', d:'Reasoning buys accuracy with tokens. Mixture of experts buys size without ' +
        'paying for it per request.' },
    { t:'The harness matters', d:'The model is stateless text-in, text-out. Memory, tools, retrieval and ' +
        'permissions are software around it.' },
    { t:'Confidence is not evidence', d:'Right and wrong answers are produced the same way. Verification ' +
        'is the whole job.' }
  ]
});
