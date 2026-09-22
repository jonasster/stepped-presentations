/* ═══ content, part 4 — everything wrapped around the model ════════════════ */

DECK.push({
  id:'ch7', ch:7, type:'chapter',
  title:'Around<br>the model',
  lede:'The model is the engine. Almost everything you actually interact with is the car built around it — ' +
       'and in the last two years, that is where nearly all the useful work has happened.',
  covers:['The harness','Tools and the agent loop','MCP','Skills, plugins, custom chatbots','Retrieval']
});

DECK.push({
  id:'harness', ch:7, type:'nest',
  kicker:'Chapter 07 &middot; the harness',
  title:'What a harness is',
  lede:'A raw model takes text in and gives text out. That is all. Everything else — memory, files, ' +
       'tools, retries, permissions — is ordinary software wrapped around it. That wrapper is the ' +
       '<b>harness</b>.',
  foot:'This is why two products using the <b>same</b> model can be wildly different to use. The gap is ' +
       'usually the harness, not the model.',
  rings:[
    { c:'c7', tag:'the product', t:'The product',
      d:'What you open: a chat window, an IDE, a button inside another application. Accounts, history, ' +
        'sharing, billing.' },
    { c:'c7', tag:'the harness', t:'The harness',
      d:'The loop that runs the model. It assembles the prompt, offers tools, reads what comes back, ' +
        'executes what was asked, feeds the result in, and goes round again.' },
    { c:'c7', tag:'context + tools', t:'Context and tools',
      d:'What the model is given on this turn: system instructions, the transcript, retrieved documents, ' +
        'and the list of actions it is allowed to take.' },
    { c:'c7', tag:'the model', t:'The model',
      d:'Tokens in, tokens out, stateless, no side effects. It cannot run anything, fetch anything or ' +
        'remember anything on its own.' }
  ]
});

DECK.push({
  id:'agentloop', ch:7, type:'flow',
  kicker:'Chapter 07 &middot; agents',
  title:'What makes something an agent',
  lede:'Not a different kind of model. The <b>same</b> model, put in a loop with tools and allowed to keep ' +
       'going until the job is done rather than stopping after one reply.',
  loop:'until the goal is met, or a limit is hit',
  foot:'A chatbot answers. An agent <b>finishes</b>. That difference is the loop, and it is why the ' +
       'interesting questions about agents are about permissions and stopping conditions.',
  nodes:[
    { t:'Goal', d:'You state an outcome rather than a step. &ldquo;Find why the nightly job failed and ' +
        'fix it&rdquo; — not &ldquo;show me the log&rdquo;.' },
    { t:'Decide', d:'The model looks at the goal and everything gathered so far, and picks one next ' +
        'action from the tools available to it.' },
    { t:'Act', d:'The harness — not the model — actually runs it: a search, a query, a script, an ' +
        'API call. This is where permissions and approvals live.' },
    { t:'Observe', d:'The result is written back into the context. The model now knows what happened, ' +
        'including that it failed, and can respond to it.' }
  ]
});

DECK.push({
  id:'tools', ch:7, type:'points',
  kicker:'Chapter 07 &middot; tool use',
  title:'How a model &ldquo;uses&rdquo; a tool',
  lede:'This is worth being precise about, because the mental picture most people have is wrong — and ' +
       'the correct one tells you exactly where the safety controls sit.',
  foot:'The model never touches anything. <b>It writes a request; your software decides whether to honour ' +
       'it.</b> Every approval prompt you have seen lives at step three.',
  points:[
    { t:'It is handed a menu',
      d:'The harness describes the available tools in the prompt: what each one is called, what it does, ' +
        'and what information it needs.' },
    { t:'It writes a request, not an action',
      d:'Instead of prose, the model outputs a small structured message: <code>search_orders(customer: ' +
        '4471)</code>. That is still just generated text.' },
    { t:'Your software runs it',
      d:'The harness parses that request, checks it is allowed, and calls the real system. This is the ' +
        'point where a human can be asked to approve.' },
    { t:'The answer goes back in',
      d:'The result is appended to the context and the model continues, now with a real fact it did not ' +
        'have. That is the whole mechanism.' }
  ]
});

DECK.push({
  id:'mcp', ch:7, type:'flow',
  kicker:'Chapter 07 &middot; mcp',
  title:'MCP: one plug instead of many',
  lede:'The <b>Model Context Protocol</b> is an open standard for the connection between a model’s ' +
       'harness and a system it wants to use. Published in late 2024; now supported across the industry.',
  foot:'Before it, every product wired up every integration itself. After it, <b>your system implements ' +
       'the connector once</b> and any compliant client can use it — the same argument as USB.',
  nodes:[
    { t:'The model', d:'Asks for something in plain structured form. It knows nothing about where the ' +
        'answer will come from.' },
    { t:'The client', d:'The harness you are using. It holds the list of connected servers and enforces ' +
        'what is permitted.' },
    { t:'The MCP server', d:'A small adapter you or a vendor runs. It advertises what it offers — ' +
        'tools to call, data to read, prompts to reuse — in the standard shape.' },
    { t:'Your system', d:'The thing that actually holds the value: a database, a ticket tracker, a file ' +
        'share, an internal API. Unchanged, and still behind its own access controls.' }
  ]
});

DECK.push({
  id:'extras', ch:7, type:'columns',
  kicker:'Chapter 07 &middot; the vocabulary',
  title:'Skill, plugin, connector, chatbot',
  lede:'Four words used loosely, often for overlapping things. Sorting them by <b>what they actually add</b> ' +
       'makes the choice obvious.',
  foot:'A rough test: <b>knowledge</b> &rarr; retrieval. <b>Know-how</b> &rarr; skill. <b>Reach</b> &rarr; ' +
       'connector. <b>A packaged setup for other people</b> &rarr; plugin or custom chatbot.',
  cols:[
    { tag:'adds know-how', t:'Skill',
      sub:'A folder of written instructions the model loads only when a task calls for it.',
      lines:['&ldquo;Here is how we write a release note&rdquo;','Plain text and files, no code required',
             'Loaded on demand, so it costs nothing idle','Versioned and shared like a document'],
      note:'Procedural knowledge the model has no way to guess.' },
    { tag:'adds reach', t:'MCP connector',
      sub:'A live connection to a system, so the model can look things up and act.',
      lines:['Real-time, not a snapshot','Reads and writes, with permissions',
             'One standard, many clients','Runs as its own small service'],
      note:'Use when the answer lives somewhere else, now.' },
    { tag:'bundles both', t:'Plugin',
      sub:'A package: skills, connectors, commands and settings, installed in one step.',
      lines:['Distribution, not a new capability','Gives a whole team the same setup',
             'Update centrally, everyone follows','Usually organisation-specific'],
      note:'The unit you hand to colleagues.' },
    { tag:'packages a role', t:'Custom chatbot',
      sub:'A named assistant with fixed instructions, documents and tone, that others can just use.',
      lines:['Fixed system prompt and persona','Often its own small document set',
             'No model training involved','Configuration, not customisation'],
      note:'Nine times in ten this is all a team needs.' }
  ]
});

DECK.push({
  id:'rag', ch:7, type:'flow',
  kicker:'Chapter 07 &middot; retrieval',
  title:'RAG: giving it your documents',
  lede:'<b>Retrieval-augmented generation</b>, and the diagram is the whole idea. The model is not taught ' +
       'your documents — the relevant pieces are found and pasted in front of the question.',
  foot:'Two things this buys you. Answers stay current without retraining, and <b>every claim can carry a ' +
       'source</b>, which is most of what makes an internal assistant trustworthy.',
  nodes:[
    { t:'Question', d:'&ldquo;What is our refund policy for corporate customers?&rdquo; — something the ' +
        'model has no way to know.' },
    { t:'Search', d:'Your documents, chopped into passages and indexed by meaning as well as by keyword, ' +
        'are searched for the handful most likely to be relevant.' },
    { t:'Assemble', d:'Those passages are placed into the prompt above the question, usually with an ' +
        'instruction: answer from this material, and say so if it is not here.' },
    { t:'Answer', d:'The model reads the passages as ordinary context and writes the answer, citing which ' +
        'passage each part came from.' }
  ]
});

DECK.push({
  id:'stack', ch:7, type:'points',
  kicker:'Chapter 07 &middot; putting it together',
  title:'Where the value has moved',
  lede:'If you are deciding where to spend effort, this is the summary of the whole chapter.',
  foot:'The uncomfortable version: <b>the model is increasingly a commodity, and the hard, valuable, ' +
       'company-specific work is everything around it.</b>',
  points:[
    { t:'The model is bought, not built',
      d:'Frontier models come from a handful of labs, they are broadly comparable, and swapping one for ' +
        'another is a configuration change. Do not architect around a specific one.' },
    { t:'Context is the real input',
      d:'Most disappointing results are not the model failing — they are the model being asked without ' +
        'the information a competent colleague would have had.' },
    { t:'Permissions are the real design',
      d:'Once a model can act, the interesting questions are what it may touch, what needs approval, and ' +
        'what the blast radius is when it is wrong. That is your work, not the vendor’s.' },
    { t:'Verification is the bottleneck',
      d:'An agent that does an hour of work in a minute is only useful if checking it takes less than an ' +
        'hour. Build for reviewability first.' }
  ]
});
