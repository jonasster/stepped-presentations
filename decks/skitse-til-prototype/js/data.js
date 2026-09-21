/* Alt der står på skærmen bor her. Ret teksten her — ikke i engine.js. */

const DECK = {
  title: "Fra skitse til prototype",
  lede: "To timer. I tegner i hånden, og I går herfra med noget man kan klikke på.",
  meta: "Excalidraw → OpenCode · grupper på 3–5 · jeres egen bærbare"
};

const SLIDES = [

/* 1 ─────────────────────────────────────────────────────────────────────── */
{ id:"intro", kind:"title", phase:"Velkommen", clock:"0:00", steps:[] },

/* 2 ─────────────────────────────────────────────────────────────────────── */
{ id:"maal", kind:"cards", phase:"Velkommen", clock:"0:00 – 0:10",
  title:"Hvad I går hjem med",
  steps:[
    { t:"En prototype man kan klikke på",
      d:"En fil I åbner i browseren, og som en anden gruppe kan prøve." },
    { t:"Et sprog for tidlige skitser",
      d:"Crazy 8s, lo-fi, ét flow. Ord I kan bruge næste gang I sidder over for en udvikler." },
    { t:"En refleksion over konteksten",
      d:"Hvem falder ud af skærmen, og hvad antager jeres design om en travl afdeling?" }
  ]},

/* 3 ─────────────────────────────────────────────────────────────────────── */
{ id:"hvorfor", kind:"curve", phase:"Ramme", clock:"0:00 – 0:10",
  title:"Hvorfor skitsere først?",
  steps:[
    { t:"En blyantstreg koster ingenting",
      d:"Den tager tredive sekunder at lave og nul at smide ud." },
    { t:"Jo pænere det ser ud, jo mindre vil nogen lave om",
      d:"Et færdigt design ligner en beslutning. Folk holder høfligt mund." },
    { t:"Lo-fi holder flere idéer i live længere",
      d:"Og det er antallet af idéer tidligt, der afgør hvor god den sidste bliver." },
    { t:"Kritikken rammer idéen, ikke håndværket",
      d:"Ingen skåner en tændstikmand." }
  ]},

/* 4 ─────────────────────────────────────────────────────────────────────── */
{ id:"forloeb", kind:"timeline", phase:"Ramme", clock:"0:00 – 0:10",
  title:"Dagens forløb",
  steps:[
    { t:"Ramme",           d:"0:00" },
    { t:"Setup",           d:"0:10" },
    { t:"Brief + grupper", d:"0:20" },
    { t:"Skitsering",      d:"0:30" },
    { t:"Skitse → prompt", d:"0:55" },
    { t:"Byg",             d:"1:05" },
    { t:"Refleksion",      d:"1:40" },
    { t:"Opsamling",       d:"1:55" }
  ]},

/* 5 ─────────────────────────────────────────────────────────────────────── */
{ id:"setup-oc", kind:"shot", phase:"Setup", clock:"0:10 – 0:20",
  title:"Setup 1 · OpenCode",
  lede:"Hent den gerne hjemmefra. Én maskine pr. gruppe er nok til at komme i gang.",
  shot:"img/opencode.webp",
  shotCap:"opencode.ai/download. Hent skrivebordsappen, ikke terminalversionen",
  steps:[
    { t:"Hent OpenCode Desktop", cmd:"opencode.ai/download",
      d:"Vælg Windows eller macOS. I installerer den som ethvert andet program." },
    { t:"Åbn appen og log ind",
      d:"Første gang skal I forbinde en konto. Vælg en af de gratis muligheder. I skal ikke bruge et betalingskort." },
    { t:"Vælg en gratis model",
      d:"Find modelvælgeren og vælg en model der er markeret som gratis. Den er langsommere og mere fumlende end de betalte, og det er en del af øvelsen." },
    { t:"Lav en mappe til gruppen", cmd:"prototype-gruppe-3",
      d:"På skrivebordet. Alt hvad I laver i dag skal ligge dér, skitse og prototype sammen." },
    { t:"Åbn mappen i OpenCode",
      d:"Appen arbejder i én mappe ad gangen. Peger den et forkert sted hen, ender jeres filer et forkert sted." }
  ]},

/* 6 ─────────────────────────────────────────────────────────────────────── */
{ id:"setup-ex", kind:"shot", phase:"Setup", clock:"0:10 – 0:20",
  title:"Setup 2 · Excalidraw",
  lede:"Ingen konto, ingen installation. Papir og blyant duer lige så godt. I skal bare kunne fotografere det.",
  shot:"img/excalidraw.webp",
  shotCap:"excalidraw.com, sådan ser den ud når I åbner den",
  steps:[
    { t:"Åbn excalidraw.com", cmd:"excalidraw.com",
      d:"Værktøjerne I skal bruge ligger midt for oven: rektangel, streg, pil, tekst. Det er alt." },
    { t:"Del tegnebrættet i gruppen",
      d:"Share øverst til højre → Live collaboration → send linket rundt. Så tegner I på det samme." },
    { t:"Sådan får I den ud igen",
      d:"Menuen øverst til venstre → Export image → PNG, med baggrund slået til. Gem den i gruppens mappe." }
  ]},

/* 7 ─────────────────────────────────────────────────────────────────────── */
{ id:"grupper", kind:"cards", phase:"Brief", clock:"0:20 – 0:30",
  title:"Grupper og spor",
  steps:[
    { t:"Grupper på 3–5",
      d:"Sæt jer om én skærm. Én skriver til OpenCode, resten kigger med og siger hvad der er galt. Byt plads efter et kvarter." },
    { t:"Spor A · Den fælles case",
      d:"Casen på næste slide. Vælg den hvis I er i tvivl. I skal ikke bruge tyve minutter på at finde på noget." },
    { t:"Spor B · Jeres eget projekt",
      d:"Har I noget fra et semesterprojekt eller et klinikophold, så brug det. Én betingelse: I skal kunne tegne det som tre skærme." }
  ]},

/* 8 ─────────────────────────────────────────────────────────────────────── */
{ id:"brief", kind:"brief", phase:"Brief", clock:"0:20 – 0:30",
  title:"Casen",
  lede:"Medicinoverlevering ved flytning mellem afsnit.",
  steps:[
    { t:"Situationen",
      d:"En patient flyttes fra akutmodtagelsen til et sengeafsnit. Medicinen skal følge med, og i dag følger den med som en samtale, et stykke papir og en hukommelse." },
    { t:"Hvem bruger det",
      d:"Sygeplejersken der afleverer, og sygeplejersken der modtager. Begge står op, begge har travlt, begge bliver afbrudt midt i det." },
    { t:"Hvad skal kunne lade sig gøre",
      d:"Se hvad patienten får · markere hvad der er givet · overdrage til den der modtager · se hvad der er ændret siden i går." },
    { t:"Hvad I ikke skal løse",
      d:"Login, journalintegration, jura, hele medicinmodulet. I skal nå tre skærme og ét flow." }
  ]},

/* 9 ─────────────────────────────────────────────────────────────────────── */
{ id:"crazy8", kind:"crazy8", phase:"Skitsering", clock:"0:30 – 0:45",
  title:"Crazy 8s",
  lede:"Første kvarter tegner I hver for sig. Ingen computer på bordet.",
  steps:[
    { t:"8 felter, 8 minutter",
      d:"Fold et A4 to gange, eller lav otte rammer i Excalidraw. Hver person tegner sine egne." },
    { t:"Én idé pr. felt. Grimt er tilladt",
      d:"Ét minut pr. felt. Ser det pænt ud, har du brugt for lang tid." },
    { t:"Læg dem op, sig ét ord til hver",
      d:"Ingen forsvarstaler. Gruppen peger på det der overrasker, ikke på det der er pænest." }
  ]},

/* 10 ────────────────────────────────────────────────────────────────────── */
{ id:"tre-skaerme", kind:"screens", phase:"Skitsering", clock:"0:45 – 0:55",
  title:"Vælg ét flow · tegn tre skærme",
  steps:[
    { t:"Vælg det flow der gør mest for den travle sygeplejerske",
      d:"Ikke det der er lettest at bygge. Det I gerne vil vide om virker." },
    { t:"Tegn skærm 1 → 2 → 3",
      d:"Hvad ser man, hvad trykker man på, hvad sker der så. Tegn pilene imellem dem, for pilene er flowet." },
    { t:"Skriv de rigtige ord på knapperne",
      d:"»Kvittér for givet«, ikke »Knap«. Ordene er halvdelen af designet, og de er det eneste OpenCode med sikkerhed kan læse." }
  ]},

/* 11 ────────────────────────────────────────────────────────────────────── */
{ id:"til-prompt", kind:"steps", phase:"Overgang", clock:"0:55 – 1:05",
  title:"Fra skitse til prompt",
  steps:[
    { t:"Eksportér skitsen som PNG", cmd:"skitse.png",
      d:"Én fil med alle tre skærme på. Læselig, ikke smuk." },
    { t:"Læg filen i gruppens mappe", cmd:"prototype-gruppe-3/skitse.png",
      d:"Samme mappe som I startede OpenCode i. Ellers kan den ikke se den." },
    { t:"Beskriv hvad den viser",
      d:"OpenCode gætter på jeres tegning. Jeres beskrivelse er det, der gør gættet kvalificeret." },
    { t:"Sig hvad prototypen skal kunne",
      d:"Hvilke klik skal virke? Hvad må gerne være falsk? En prototype må gerne lyve, bare ikke om det I vil undersøge." }
  ]},

/* 12 ────────────────────────────────────────────────────────────────────── */
{ id:"prompts", kind:"prompts", phase:"Overgang", clock:"0:55 – 1:05",
  title:"Tre prompts der virker",
  steps:[
    { t:"Byg-prompten", d:"Én gang, i starten.",
      p:"Byg en klikbar prototype ud fra skitsen i skitse.png. Én enkelt fil, index.html, med CSS og JavaScript indeni. Ingen frameworks, og intet der skal hentes fra nettet. Tre skærme: oversigt, detalje, kvittering. Knapperne skal skifte mellem skærmene. Brug opdigtede danske patientdata." },
    { t:"Ret-én-ting-prompten", d:"Resten af tiden. Den vigtigste af de tre.",
      p:"Knappen »Kvittér for givet« skal føre til kvitteringsskærmen og vise et grønt flueben. Lav ikke andet om." },
    { t:"Vis-mig-prompten", d:"Når I er kørt fast.",
      p:"Forklar i to sætninger hvad filen gør lige nu, og hvad der endnu ikke virker." }
  ]},

/* 13 ────────────────────────────────────────────────────────────────────── */
{ id:"loop", kind:"loop", phase:"Byg", clock:"1:05 – 1:40",
  title:"Byggeloopet",
  lede:"Halvanden time, cirka ti runder. Det er runderne der bygger prototypen, ikke den første prompt.",
  steps:[
    { t:"Bed om én ting",               d:"Én knap, én skærm, én rettelse." },
    { t:"Åbn index.html",               d:"Dobbeltklik filen. Den kører i browseren." },
    { t:"Klik på den som en bruger",    d:"Ikke som en der ved hvad der er bygget." },
    { t:"Sig hvad der er galt",         d:"»Den gør X, den skal gøre Y.«" }
  ]},

/* 14 ────────────────────────────────────────────────────────────────────── */
{ id:"galt", kind:"cards", phase:"Byg", clock:"1:05 – 1:40",
  title:"Når det går galt",
  lede:"Det gør det. Gratis modeller er langsomme og glemsomme. Her er de fire fejl I kommer til at møde.",
  steps:[
    { t:"Modellen er optaget",
      d:"Vent et minut, eller skift model med /models. Brug ventetiden på at klikke jer igennem det I allerede har." },
    { t:"Siden er helt hvid",
      d:"Tryk F12 i browseren, find den røde fejl, kopiér den ind i OpenCode. Den kan læse sine egne fejl." },
    { t:"Den laver om på for meget",
      d:"Skriv »lav ikke andet om« i hver eneste prompt. Og gem en kopi af filen hver gang noget virker." },
    { t:"Den bygger noget helt andet",
      d:"Så var prompten for stor. Halvér den. Én skærm, én knap, én ting ad gangen." }
  ]},

/* 15 ────────────────────────────────────────────────────────────────────── */
{ id:"refleksion", kind:"cards", phase:"Refleksion", clock:"1:40 – 1:55",
  title:"Kontekst og implikation",
  lede:"Ti minutter i gruppen, fem i plenum. Skriv tre sætninger ned I kan sige højt.",
  steps:[
    { t:"Hvem falder ud af skærmen?",
      d:"Hvilken patient, hvilken kollega, hvilken situation passer ikke ind i jeres tre skærme?" },
    { t:"Hvad antager den om arbejdsgangen?",
      d:"Ethvert design fortæller en historie om hvordan arbejdet burde foregå. Hvilken fortæller jeres?" },
    { t:"Hvor bruges den, og hvor travlt er der?",
      d:"På en gang, med handsker på, med en pårørende der spørger om noget andet. Holder designet dér?" },
    { t:"Hvad sker der når den tager fejl?",
      d:"Forkert dosis, forkert patient, mistet forbindelse. Hvem opdager det, og hvornår?" }
  ]},

/* 16 ────────────────────────────────────────────────────────────────────── */
{ id:"slut", kind:"steps", phase:"Opsamling", clock:"1:55 – 2:00",
  title:"Inden I går",
  steps:[
    { t:"Gem mappen", cmd:"index.html",
      d:"Filen virker uden internet. Dobbeltklik, og den kører, også om et år på en anden maskine." },
    { t:"Del skitsen og prototypen",
      d:"PNG'en og HTML-filen sammen. Skitsen viser hvad I ville; prototypen viser hvad I nåede." },
    { t:"Det I lavede på to timer",
      d:"I gik fra en tom side til noget en kollega kunne prøve. Det tog timer og ikke uger. Gør det tidligt næste gang, og gør det tit." }
  ]}

];
