/* Alt der står på skærmen bor her. Ret teksten her, ikke i engine.js. */

const DECK = {
  title: "Tre huse, én rolle",
  lede: "Seks år som digital læringskonsulent på AAU, og tre organisatoriske flytninger der stille og roligt har lavet om på hvad opgaven er.",
  meta: "Jonas Svenstrup Sterregaard · CDUL, Center for Digitalt Understøttet Læring"
};

/* De tre epoker har hver sin farve. Den går igen på tidslinjen, i sammenligningen
   og i regnskabet: samme farve betyder altid samme hus. Værdierne står i deck.css,
   så det mørke tema kan løfte dem uden at røre ved indholdet her. */
const C = { hum:"acc-hum", ias:"acc-ias", its:"acc-its", nu:"acc-nu" };

/* arbejdsbelastning: 1 lille · 2 mellem · 3 stor */
const SLIDES = [

/* ── akt 1 · rammen ──────────────────────────────────────────────────────── */

{ id:"intro", kind:"title", phase:"CDUL · AAU", clock:"", core:true, steps:[] },

{ id:"mig", kind:"about", phase:"Lidt om mig", clock:"1", core:true,
  avatar:"img/jonas.webp",
  title:"Jonas Svenstrup Sterregaard",
  lede:"Digital læringskonsulent og -designer i CDUL. Uddannet på AAU, og ansat på AAU siden 2020.",
  steps:[
    { t:"Uddannelse", items:[
        "Bachelor i Kommunikation og Digitale Medier, AAU (2017)",
        "Kandidat i Interaktive Digitale Medier, AAU (2019)"] },
    { t:"Arbejde", items:[
        "Freelance UI/UX-designer og webudvikler, 2018 til 2020",
        "Digital læringskonsulent og -designer, 2020 til nu"] },
    { t:"Og ellers", items:[
        "Lidt af en nørd: samler på mekaniske ure, tastaturer og LEGO",
        "Og er i gang med at bygge min egen hjemmeserver"] }
  ]},

{ id:"agenda", kind:"cards", phase:"Rammen", clock:"2",
  title:"Tre spørgsmål",
  lede:"Det I gerne vil vide, i den rækkefølge jeg selv ville stille det.",
  steps:[
    { t:"Hvor har CDUL siddet?",
      d:"Tre organisatoriske adresser på seks år: et fakultet, et forskningsmiljø, en it-organisation." },
    { t:"Hvad gjorde det ved arbejdet?",
      d:"Opgaverne flyttede sig fra lokale til tværgående, og nu fra pædagogiske til tekniske." },
    { t:"Hvor er vi på vej hen?",
      d:"Fra agil efterspørgsel mod et defineret servicekatalog. Vi kender ikke svaret endnu." }
  ]},

{ id:"hvem-vi-er", kind:"facts", phase:"Rammen", clock:"3", core:true,
  title:"Hvem vi er",
  lede:"CDUL hjælper undervisere og uddannelser med at bruge det digitale i undervisningen: kompetenceudvikling, læringsressourcer, og i stigende grad AI. Vi er syv mennesker til hele AAU.",
  steps:[
    { t:"7", d:"mennesker i CDUL" },
    { t:"2", d:"faggrupper: læringskonsulenter og læringsdesignere" },
    { t:"4", d:"fakulteter vi arbejder på tværs af" },
    { t:"3", d:"organisatoriske adresser siden 2020" }
  ]},

{ id:"tidslinje", kind:"timeline", phase:"Rammen", clock:"4", core:true,
  title:"Seks år, tre adresser",
  lede:"Rollen har heddet det samme hele vejen. Det er huset omkring den der har flyttet sig.",
  steps:[
    { t:"Fakulteterne", d:"april 2020",     c:C.hum },
    { t:"IAS PBL",      d:"1. januar 2023", c:C.ias },
    { t:"ITS",          d:"april 2026",     c:C.its },
    { t:"Servicetjek",  d:"lige nu",        c:C.nu  }
  ]},

/* ── akt 2 · de tre epoker ───────────────────────────────────────────────── */

{ id:"epoke-hum", kind:"era", phase:"Epoke 1 · 2020-2022", clock:"5", core:true, org:"hum", accent:C.hum,
  title:"Tæt på undervisningen",
  lede:"CDUL var allerede et navngivet center, men vi sad spredt ud på fakulteterne. Jeg var Humanioras lokale go-to for digitalt understøttet undervisning.",
  steps:[
    { t:"Lokal og synlig",
      d:"Jeg sad fysisk på fakultetet. Man kunne banke på døren, og opgaverne kom typisk den vej ind." },
    { t:"Bottom-up",
      d:"Workshops, kompetenceudviklingsforløb og digitale læringsressourcer, defineret på studienævns- eller institutniveau." },
    { t:"Skruet sammen til én faglighed",
      d:"Næsten alt var tilpasset et specifikt vidensområde. Det gav dybde, men lidt af det kunne genbruges andre steder." }
  ]},

{ id:"epoke-ias", kind:"era", phase:"Epoke 2 · 2023-2026", clock:"7", core:true, org:"ias", accent:C.ias,
  title:"Fra undervisning til uddannelse",
  lede:"1. januar 2023 flyttede hele CDUL på én gang ind i IAS PBL, tæt på de forskere der underviser i og undersøger AAU's egen pædagogiske model.",
  steps:[
    { t:"Samlet under ét tag",
      d:"Fra fakultetets lokale konsulent til ét centraliseret center med en fælles portefølje." },
    { t:"Fra lokalt til institutionelt",
      d:"Vi har selv omtalt skiftet som “fra udvikling af undervisning til udvikling af uddannelse”." },
    { t:"Min rolle spidsede til",
      d:"Koordinerende og udførende ansvar for digitale læringsressourcer og online kurser på tværs af SSH, TECH, ENG og SUND." }
  ]},

{ id:"epoke-its", kind:"era", phase:"Epoke 3 · april 2026 →", clock:"10", core:true, org:"its", accent:C.its,
  title:"Tæt på infrastrukturen",
  lede:"Vores arbejde er defineret af de strategiske køreplaner for uddannelsesrettet digitalisering, og den portefølje ejes af ITS. Så flyttede vi derhen.",
  steps:[
    { t:"Officielt er der ikke sket så meget endnu",
      d:"Nyt kontor, nye kollegaer, ny teamleder. Opgaverne fra før kører videre stort set uændret." },
    { t:"Men profilen flytter sig",
      d:"Jeg kan mærke min faglige positionering glide fra det pædagogisk-didaktiske mod det tekniske og serviceorienterede." },
    { t:"Og AI vokser voldsomt",
      d:"Hjælp til at udvikle og implementere specialiserede AI-løsninger, og til at lægge undervisning, opgaver og eksamen om i lyset af en ny virkelighed." }
  ]},

{ id:"skiftet", kind:"shift", phase:"Skiftet", clock:"12", core:true,
  title:"Samme rolle, tre slags opgaver",
  lede:"Den nemmeste måde at se forskellen på er at spørge: hvad lavede jeg en helt almindelig tirsdag?",
  steps:[
    { t:"Lokalt", era:"2020-2022", home:"Fakultetet", c:C.hum,
      d:"Et kompetenceudviklingsforløb for ét studienævn, skruet sammen til deres faglighed." },
    { t:"Tværgående", era:"2023-2026", home:"IAS PBL", c:C.ias,
      d:"Koordinering af digitale læringsressourcer på tværs af fire fakulteter, inden for en institutionel ramme." },
    { t:"Teknisk og serviceorienteret", era:"2026 →", home:"ITS", c:C.its,
      d:"Rådgivning om AI-løsninger, platformsafhængigheder, og om hvad vi overhovedet kan tilbyde som en service." }
  ]},

{ id:"regnskab", kind:"ledger", phase:"Skiftet", clock:"14",
  title:"Hvad vi mistede, og hvad vi vandt",
  lede:"Ærligt regnskab: flytningen har kostet noget, og den har givet noget andet.",
  steps:[
    { side:"tab", t:"Arbejdsfladen med forskerne",
      d:"Den tætte kontakt til forskningen i PBL, pædagogik og didaktik er stoppet." },
    { side:"tab", t:"At blive tænkt med ind",
      d:"Vi var næsten altid med i IAS PBL's projekter og initiativer. De har ikke længere mandat over vores prioriteringer, og så holdt det op." },
    { side:"gevinst", t:"De tekniske afdelinger",
      d:"Moodle Application Management, it-infrastruktur, it-sikkerhed, UX-teamet, Center for Administrativ AI, digitaliseringspartnerne." },
    { side:"gevinst", t:"Kortere vej til beslutningerne",
      d:"Vi sidder nu i den organisation der ejer digitaliseringsporteføljen, og tæt på it-vicedirektøren." },
    { side:"gevinst", t:"Vi var afhængige af dem i forvejen",
      d:"Meget af det vi laver kan slet ikke lade sig gøre uden de systemer og den sikkerhedsgodkendelse de sidder på." }
  ]},

{ id:"hvad-er-aendret", kind:"cards", phase:"Skiftet", clock:"16", core:true,
  title:"Hvad der faktisk er ændret",
  lede:"Formelt er der ikke sket ret meget endnu. De tre fokusområder gælder stadig på papiret, og opgaverne fra før kører videre. Men fire ting kan mærkes.",
  steps:[
    { t:"Nyt kontor, nye kollegaer",
      d:"Og en ny teamleder. Det er her flytningen er mest håndgribelig: vi sidder et andet sted, ved siden af andre mennesker, og refererer et nyt sted hen." },
    { t:"Nye samarbejdsflader",
      d:"Moodle Application Management, it-infrastruktur, it-sikkerhed, UX-teamet, Center for Administrativ AI. Folk jeg før skulle skrive til, og nu kan gå ned ad gangen til." },
    { t:"Fokusområderne skrider",
      d:"De gælder stadig formelt, men de er ved at blive opløst i overflytningen, og der er endnu ikke noget færdigt til at erstatte dem." },
    { t:"Nye møder og rutiner",
      d:"Før: teammøde hver anden uge og arbejdsfællesskab i ugen imellem, med teamlederen med hver gang. Nu: fælles teammøde hver onsdag, hvor lederen er med én gang om måneden." }
  ]},

/* ── akt 3 · opgavelandskabet ────────────────────────────────────────────── */

{ id:"fokus", kind:"cards", phase:"I dag", clock:"17",
  title:"Sådan har vi organiseret os",
  lede:"Tre fokusområder. De gælder stadig formelt, men de er reelt ved at blive opløst. Mere om det til sidst.",
  steps:[
    { t:"Digitalt kompetente undervisere og ledelse",
      d:"Alt hvad der handler om kompetenceudvikling og digitale kompetencer." },
    { t:"AI i uddannelse",
      d:"Fra strategi, undersøgelser, regler, politikker og infrastruktur til hands-on udvikling af læringsaktiviteter med og om generativ AI." },
    { t:"AAU Micro og digitale læringsressourcer",
      d:"Tilrettelæggelse, design, udvikling og implementering, fra én enkelt undervisningsvideo til fulde asynkrone onlineforløb." }
  ]},

{ id:"landskab", kind:"landscape", phase:"I dag", clock:"18", core:true,
  title:"Min portefølje lige nu",
  lede:"43 opgaver i syv bunker. Det er min egen optælling, ikke et udtræk fra et system. Læg mærke til hvor tyngden ligger.",
  steps:[
    { t:"AAU Micro · strategi",     n:6,  d:"Strategi, KPI'er og notater til Det Strategiske Uddannelsesråd." },
    { t:"AAU Micro · koordinering", n:7,  d:"Løbende koordinering på SSH, TECH, ENG og SUND, plus partnerskaber." },
    { t:"AAU Micro · produktion",   n:13, d:"Tretten konkrete læringsressourcer under udvikling lige nu." },
    { t:"AI i uddannelse",          n:4,  d:"Politik og notater i den ene ende, chatbots i den anden." },
    { t:"GIRAF",                    n:6,  d:"Eksternt finansieret projekt: fire micros, ekspertrolle og projektledelse." },
    { t:"Arrangementer",            n:2,  d:"Aktiviteter hvor underviserne selv møder op og bygger noget." },
    { t:"Drift og platform",        n:5,  d:"Det der bare skal køre. Ofte usynligt, indtil det ikke kører." }
  ]},

{ id:"tema-micro-strat", kind:"tasks", phase:"Portefølje · 1 af 7", clock:"19", accent:C.ias,
  title:"AAU Micro · strategi",
  lede:"AAU Micro er AAU's koncept for små online læringsressourcer og kurser. Her er det rammen om konceptet, ikke indholdet.",
  cards:[
    { g:0, t:"Årlig status og evaluering af AAU Micro-strategien", w:"DSUR", dl:"primo 2027", l:3 },
    { g:0, t:"Notat om akkreditering og meritering af AAU Micros", w:"DSUR", dl:"udgangen af 2026", l:2 },
    { g:1, t:"Udkast til institutionel kommunikationsplan og årshjul", w:"DSUR", dl:"udgangen af 2026", l:2 },
    { g:1, t:"Udkast til lokale kommunikationsplaner på fakulteterne", w:"DSUR", dl:"udgangen af 2026", l:2 },
    { g:2, t:"Spørgeskemaundersøgelse om AAU Micro", w:"DSUR", dl:"primo 2027", l:3 },
    { g:2, t:"KPI'er og dataindsamling", w:"DSUR", dl:"primo 2027", l:3 }
  ],
  steps:[
    { t:"Strategien skal gøres op", d:"Status, evaluering og et notat om hvordan micros kan akkrediteres og meriteres." },
    { t:"Og den skal kommunikeres", d:"Én institutionel plan, og fire lokale der oversætter den til hvert fakultet." },
    { t:"Og den skal kunne måles",  d:"Tallene findes ikke af sig selv. KPI'er og dataindsamling er tungt, men det er det der afgør om konceptet overlever." }
  ]},

{ id:"tema-micro-koord", kind:"tasks", phase:"Portefølje · 2 af 7", clock:"20", accent:C.ias,
  title:"AAU Micro · koordinering",
  lede:"Den koordinerende halvdel af rollen. Det meste af det her har ingen deadline, det er løbende.",
  cards:[
    { g:0, t:"Koordinering af AAU Micros på SSH",  w:"SSH",  dl:"løbende", l:2 },
    { g:0, t:"Koordinering af AAU Micros på TECH", w:"TECH", dl:"løbende", l:2 },
    { g:0, t:"Koordinering af AAU Micros på ENG",  w:"ENG",  dl:"løbende", l:2 },
    { g:0, t:"Koordinering af AAU Micros på SUND", w:"SUND", dl:"løbende", l:2 },
    { g:1, t:"Oplæg på TECH's studienævnsmøder", w:"TECH", dl:"sep-nov", l:1 },
    { g:2, t:"AAU Micro × INNOVATE Academy", w:"AAU Innovation", dl:"udgangen af 2026", l:1 },
    { g:2, t:"AAU Micro × AAU's alumnenetværk", w:"Alumnenetværket", dl:"løbende", l:1 }
  ],
  steps:[
    { t:"Fire fakulteter, samme opgave", d:"SSH, TECH, ENG og SUND. Fire sæt fagmiljøer, fire sæt lokale vaner, samme koncept." },
    { t:"Og en del opsøgende arbejde",   d:"Studienævnsmøderne er stedet hvor konceptet enten bliver til noget eller ikke gør." },
    { t:"Plus to partnerskaber",         d:"INNOVATE Academy og alumnenetværket. Begge steder rammer micros nogen uden for et almindeligt studieforløb." }
  ]},

{ id:"tema-micro-prod", kind:"micros", phase:"Portefølje · 3 af 7", clock:"21", accent:C.ias,
  title:"AAU Micro · under produktion",
  lede:"Tretten læringsressourcer er i gang lige nu, fordelt på alle fire fakulteter. Det er den konkrete ende af rollen: tilrettelæggelse, design, udvikling og implementering.",
  steps:[
    { t:"ENG", d:"Fire meget forskellige fagligheder i det samme format.",
      items:["Business Model Canvas", "Evaluering og feedback",
             "Laboratoriesikkerhed på Energi", "Introduction to PBL in Engineering"] },
    { t:"SUND", d:"Tungt på det kliniske, og på hvordan man underviser i et fysisk rum.",
      items:["E-læring i Anatomi", "E-læring i Ultralyd",
             "Undervisning i Active Learning Spaces", "Klinikeren som bedømmer"] },
    { t:"TECH", d:"Grundlæggende værktøjer som mange uddannelser kan trække på.",
      items:["Introduktion til Python-programmering", "Introduktion til GitHub på AAU"] },
    { t:"SSH", d:"To om generativ AI i sprogfagene, og et om musikterapi.",
      items:["Musikterapi", "Generativ AI på uddannelserne i Dansk",
             "Generativ AI på uddannelserne i Engelsk"] }
  ]},

{ id:"tema-ai", kind:"tasks", phase:"Portefølje · 4 af 7", clock:"23", accent:C.its,
  title:"AI i uddannelse",
  lede:"Den bunke der vokser hurtigst. Den spænder fra et notat til rektoratet til at sidde og bygge en chatbot.",
  cards:[
    { g:0, t:"Notat til rektor om revidering af G-AI Micro mhp. staff", w:"ITS-vicedirektøren", dl:"udgangen af 2026", l:2 },
    { g:1, t:"AI-pilot: Bot Suite", w:"IAS PBL", dl:"4. oktober", l:2 },
    { g:2, t:"Chatbot og workshopdesign til prototyping", w:"HST", dl:"25. september", l:1 },
    { g:2, t:"Chatbot til forberedelse af OSCE-eksamen", w:"Klinisk Institut", dl:"december", l:1 }
  ],
  steps:[
    { t:"Den strategiske ende", d:"Hvad skal AAU's generative AI-micro til medarbejdere egentlig kunne, og for hvem?" },
    { t:"Den infrastrukturelle", d:"En pilot på en samling bots: hvad kan vi drifte, og hvad tør vi drifte?" },
    { t:"Og den helt konkrete",  d:"To chatbots til to fagmiljøer. Det er her jeg mærker skiftet mod det tekniske tydeligst." }
  ]},

{ id:"tema-giraf", kind:"tasks", phase:"Portefølje · 5 af 7", clock:"24", accent:C.nu,
  title:"GIRAF",
  lede:"Generativ, Interaktiv og Refleksiv AI i Fagene. Et projekt med IAS PBL og Uddannelses- og Forskningsministeriet, og den ene tråd tilbage til det gamle hus.",
  cards:[
    { g:0, t:"Projektdeltager: ekspert og kontaktperson", w:"GIRAF · IAS PBL · UFM", dl:"udgangen af 2027", l:2 },
    { g:0, t:"Understøttelse af projektledelsen", w:"GIRAF · IAS PBL · UFM", dl:"udgangen af 2027", l:1 },
    { g:1, t:"GIRAF Micro 1", w:"GIRAF · IAS PBL · UFM", dl:"medio 2027", l:2 },
    { g:1, t:"GIRAF Micro 2", w:"GIRAF · IAS PBL · UFM", dl:"medio 2027", l:2 },
    { g:1, t:"GIRAF Micro 3", w:"GIRAF · IAS PBL · UFM", dl:"medio 2027", l:2 },
    { g:1, t:"GIRAF Micro 4", w:"GIRAF · IAS PBL · UFM", dl:"medio 2027", l:2 }
  ],
  steps:[
    { t:"To roller i projektet", d:"Jeg er både fagligt indhold og kontaktperson, og en hånd på projektledelsen." },
    { t:"Fire micros skal produceres", d:"Det er her de to verdener stadig mødes: et forskningsprojekt der leverer digitale læringsressourcer." }
  ]},

{ id:"tema-events", kind:"tasks", phase:"Portefølje · 6 af 7", clock:"25", accent:C.hum,
  title:"Arrangementer for undervisere",
  lede:"Den mindste bunke i antal, og den der ligner mest det jeg lavede for seks år siden. Underviserne møder selv op og bygger noget.",
  cards:[
    { g:0, t:"Flipped Learning Week", w:"HST", dl:"december-januar", l:2 },
    { g:1, t:"Haickathon", w:"Undervisere", dl:"december", l:2 }
  ],
  steps:[
    { t:"En hel uge om flipped learning", d:"Bottom-up, lokalt forankret, tæt på underviserne. Præcis den slags opgave epoke 1 bestod af." },
    { t:"Og et hackathon om AI",          d:"Samme form, nyt indhold. Det er den gamle rolle brugt på den nye dagsorden." }
  ]},

{ id:"tema-drift", kind:"tasks", phase:"Portefølje · 7 af 7", clock:"26", accent:C.its,
  title:"Drift, platform og udstyr",
  lede:"Det der bare skal køre. Det er også den bunke der vokser af sig selv når man flytter ind i en it-organisation.",
  cards:[
    { g:0, t:"Ekspertinterviews og workshop i Moodle UX-review", w:"Moodle- og UX-team, ITS", dl:"december-januar", l:1 },
    { g:0, t:"Opfølgning og evaluering på ALS og Zoom Rooms", w:"SUND", dl:"dec-feb", l:1 },
    { g:1, t:"Den Digitale Agora", w:"AAU", dl:"løbende", l:1 },
    { g:1, t:"CDUL's hjemmeside", w:"CDUL", dl:"løbende", l:1 },
    { g:1, t:"Udlån af udstyr", w:"CDUL · undervisere", dl:"løbende", l:1 }
  ],
  steps:[
    { t:"Platformene skal blive bedre", d:"Moodle-UX og mødeteknologien i lokalerne. Her er de nye ITS-kollegaer en direkte gevinst." },
    { t:"Og noget skal bare passes",    d:"Agoraen, hjemmesiden, udstyret. Hver enkelt er lille. Tilsammen er det en fast uge om måneden." }
  ]},

/* ── akt 4 · hvor vi er på vej hen ───────────────────────────────────────── */

{ id:"servicetjek", kind:"flow", phase:"Fremad", clock:"27", accent:C.nu,
  title:"Servicetjekket",
  lede:"Et eksternt konsulenthus laver lige nu en analyse på tværs af organisationen. Den afgør hvad CDUL er om et år.",
  steps:[
    { t:"AS IS",           d:"Hvad laver vi rent faktisk i dag? Det er blandt andet derfor jeg har lavet den optælling I lige har set." },
    { t:"TO BE",           d:"Hvad burde vi lave? Og hvad hører til hos andre?" },
    { t:"Servicekatalog",  d:"Et fastdefineret sæt ydelser, med en mere konsistent driftsorganisering bag." },
    { t:"Indstilling til DSUR", d:"Det er der beslutningen bliver truffet. Indtil da ved vi det ikke." }
  ]},

{ id:"paavej", kind:"cards", phase:"Fremad", clock:"29",
  title:"Hvor vi er på vej hen",
  lede:"Fra agilt og efterspørgselsdrevet mod noget mere fast. Det har både en pris og en gevinst.",
  steps:[
    { t:"Væk fra det omskiftelige",
      d:"Indtil nu har arbejdet fulgt hvad digitaliseringsindsatser, projekter og lokale initiativer bad om. Agilt, men umuligt at planlægge efter." },
    { t:"Mod et servicekatalog",
      d:"Et defineret sæt ydelser vi kan tilbyde uddannelsesmiljøerne, i stedet for et tilbud der skal forhandles hver gang." },
    { t:"Færre store udviklingsprojekter",
      d:"Det er prisen. Og hvad kataloget helt præcist kommer til at indeholde, ved jeg ærligt talt ikke endnu." }
  ]},

{ id:"slut", kind:"close", phase:"Fremad", clock:"30",
  title:"Det korte svar",
  steps:[
    { t:"Rollen har heddet det samme i seks år",
      d:"Digital læringskonsulent og -designer. Titlen overlevede alle tre flytninger." },
    { t:"Men det er huset der bestemmer opgaven",
      d:"Studienævnet, så forskningsmiljøet, og nu digitaliseringsporteføljen. Hver gang skifter det hvem der definerer hvad der er vigtigt." },
    { t:"Og lige nu står vi midt i den fjerde",
      d:"Fra agil udvikling mod defineret drift. Jeg kan fortælle jer hvordan det føles, ikke hvordan det ender." }
  ]},

{ id:"case-1", kind:"thread", phase:"Én opgave · 1 af 3", clock:"31", core:true, accent:C.its,
  title:"Sådan startede den",
  note:"Teams, 2. september. Gengivet ord for ord, men med navnet taget ud.",
  steps:[
    { t:"Den kom ind ad den gamle dør",
      d:"Direkte fra en underviser på Teams, efter et forsøg på at ringe. Ikke via en køreplan, ikke via porteføljen. Sådan kommer en stor del af arbejdet stadig ind.",
      msgs:[
        { who:"dem", by:"Underviser, HST", when:"02/09",
          t:"Hej Jonas, Det er mig der har forsøgt at ringe. Jeg skal lave low fi prototyper med mine studerende som de så skal omsætte til mid eller hi fi prototyper og jeg tænker på om ikke man kan bruge noget AI til at generere en brugergrænseflade fx hvis de tager billeder af deres prototype og så uploader og instruerer i hvad de ønsker? er det muligt? og hvilket program skal jeg bruge? håber mine forslag giver mening 🙂" },
        { who:"mig", by:"Mig", when:"02/09 13.21",
          t:"Hej [navn], beklager jeg har været optaget hele dagen. Man kan jo i princippet god bruge Microsoft Copilot til det. Der er et lille “forløb” fra Microsoft her omkring det:",
          link:{ t:"Challenge project - Microsoft Copilot for Prototyping and MVP Creation - Training", d:"learn.microsoft.com" } }
      ]},
    { t:"Kravet kom i replik tre",
      d:"Der var ingen kravspecifikation. Det afgørende, at det ikke må æde tid fra en skal-opgave, dukkede op undervejs. Og jeg foreslog OpenCode og valgte det fra igen i den samme besked.",
      msgs:[
        { who:"dem", by:"Underviser, HST", when:"02/09 13.23",
          t:"det var lige netop sådan noget, som jeg tænkte på. jeg har ikke prøvet det, men vil i aften. er det svært hvis man ikke er så it-kyndig? eller jeg mener, hvis man er studerende og ikke gider at bruge alt for lang tid på en skal-opgave, som jeg har sat dem til. 🙂" },
        { who:"mig", by:"Mig", when:"02/09 13.47",
          t:"Der er også en platform der hedder “OpenCode”, hvor man også godt kan gøre lidt. Men det kræver lidt mere teknisk forståelse synes jeg, fordi det er mere orienteret mod faktiske programmører som gerne vil prompte en agent til at skrive kode for dem.",
          link:{ t:"OpenCode | The open source AI coding agent", d:"opencode.ai" } }
      ]}
  ]},

{ id:"case-2", kind:"thread", phase:"Én opgave · 2 af 3", clock:"32", core:true, accent:C.its,
  title:"Og så drejede den",
  note:"Samme dag, fire timer senere.",
  steps:[
    { t:"En misforståelse ændrede opgaven",
      d:"Jeg havde læst det som om det var hende der skulle bruge værktøjet. Da jeg opdagede at det var de studerende, holdt en værktøjsanbefaling op med at være svaret. Så blev spørgsmålet: hvordan får man en hel klasse i gang på ti minutter?",
      msgs:[
        { who:"mig", by:"Mig", when:"02/09 17.32",
          quote:{ by:"Underviser, HST", when:"02/09/2026 13.23",
                  t:"det var lige netop sådan noget, som jeg tænkte på. jeg har ikke prøvet det, men vil i aften. er det svært hvis man ikke er så it-kyndig? eller j…" },
          t:["Hov - jeg havde ikke læst din besked her ordentligt (jeg troede først det var dig selv og ikke de studerende du talte om) 😅",
             "Det er relativt nemt, da man jo egentlig bare skal beskrive det man gerne vil have en mockup af i “natural language” og så kan man også vedhæfte tegnede papir “wireframes” billeder af andre interfaces/UI kunne være inspireret af og sårnt.",
             "Der hvor man kunne hjælpe øvelsen på vej og de studerende hurtigere i gang var ved at design en “masterprompt” eller en Copilot Agent så de springer mere “direkte” til at beskrive hvad prototypen skal kunne/vise. Jeg kan godt prøve at komme med et bud på sådan en masterprompt / eller Copilot Agent til det formål - hvornår skal du bruge den?"] }
      ]},
    { t:"Fra et link til noget jeg havde bygget",
      d:"Halvanden time senere. Det er skiftet mod det tekniske, helt konkret. Og læg mærke til hvad hun beder om til sidst: at vi sidder sammen og øver det. Det er den rolle jeg havde i 2020.",
      msgs:[
        { who:"mig", by:"Mig", when:"02/09 18.39",
          t:"Nu kom jeg til at sidde og lege med at bygge en Copilot Agent til formålet:",
          links:["Redigeringslink hvor du kan arbejde videre med agenten", "Delingslink til de studerende"] },
        { who:"dem", by:"Underviser, HST", when:"02/09 22.43",
          t:"hvor er du altså vild! 🙂 tusind tusind tusind tak. det var da en mega god ide med en agent. jeg skal bruge agenten den 25. september. tror du at du har tid til at vi sidder sammen og leger lidt med det, så jeg er lidt mere tryg ved det når jeg skal guide mine studerende i processen?" }
      ]}
  ]},

{ id:"case-3", kind:"promptdoc", phase:"Én opgave · 3 af 3", clock:"33", accent:C.its,
  title:"Instruktionen bag agenten",
  lede:"Leverancen er ikke en app. Det er omkring 1.500 ords instruktion til en Copilot-agent. Størstedelen af den handler ikke om hvad agenten skal gøre, men om hvad den skal lade være med.",
  doc:{ head:"Copilot Agent · instruktioner",
        sections:["Rolle og formål","Grundprincip","Samarbejdsform","Eksterne kilder","Fidelity",
                  "Arbejdsproces: Forstå","Arbejdsproces: Fortolk","Regel for spørgsmål",
                  "Arbejdsproces: Prototype","Interaktivitet","Tilstande og indhold",
                  "UI- og UX-kvalitet","Undgå generisk AI-design","Viden: Design Systems",
                  "Bevar forbindelsen til skitsen","Arbejdsproces: Iterér",
                  "Læring gennem resultatet","Brugertest","Billeder og referencer",
                  "Standardadfærd ved ny opgave","Standardadfærd ved feedback"] },
  steps:[
    { q:"Vis noget tidligt. Iterér derefter.",
      d:"Grundprincippet. Resten af instruktionen findes stort set for at forhindre agenten i at interviewe den studerende i stedet for at bygge noget." },
    { q:"Bevar den studerendes idé og intention.",
      d:"Den må gerne forbedre, men ikke overtage. Efter større ændringer skal den kunne gøre rede for hvad der er bevaret, ændret og tilføjet." },
    { q:"Skab ikke automatisk et SaaS-dashboard.",
      d:"En hel sektion forbyder generisk AI-design: ingen gradients, ingen card grids, ingen dekorative grafer. Ellers ender alle grupper med den samme prototype." },
    { q:"prototype → feedback → ændring → test → ny iteration",
      alt:"frem for: analyse → spørgsmål → specifikation → godkendelse → prototype",
      d:"Det er en holdning til designproces skrevet ind i et værktøj. Det er den egentlige faglige beslutning i hele opgaven, og den ligger i en tekstfil." }
  ]},

/* ── opsamling ───────────────────────────────────────────────────────────── */

{ id:"opsamling", kind:"summary", phase:"Opsamling", clock:"34", core:true,
  title:"Hele historien på ét slide",
  end:"Rollen har heddet det samme i seks år. Det er huset der bestemmer opgaven.",
  steps:[
    { lab:"2020-2022 · Fakulteterne", t:"Lokalt", art:"lokalt", c:C.hum,
      d:"Studienævn og institut definerede opgaven." },
    { lab:"2023-2026 · IAS PBL", t:"Tværgående", art:"tvaers", c:C.ias,
      d:"Ét center, fire fakulteter, institutionel ramme." },
    { lab:"April 2026 → · ITS", t:"Teknisk", art:"teknisk", c:C.its,
      d:"Køreplanen ejer porteføljen. Profilen flytter sig." },
    { lab:"Regnskabet", t:"Tab og gevinst", art:"regnskab",
      d:"Mistet forskerne. Vundet de tekniske afdelinger." },
    { lab:"I praksis", t:"Møderne", art:"moeder",
      d:"Før var lederen med hver gang. Nu én gang om måneden." },
    { lab:"Porteføljen", t:"43 opgaver", art:"bunker",
      d:"Syv bunker. AAU Micro fylder 26 af dem." },
    { lab:"Casen", t:"Besked til agent", art:"case", c:C.its,
      d:"En Teams-besked blev til en agent samme aften." },
    { lab:"Fremad", t:"Agilt til defineret", art:"fremad", c:C.nu,
      d:"Servicetjek nu. Et fast servicekatalog bagefter." }
  ]}

];
