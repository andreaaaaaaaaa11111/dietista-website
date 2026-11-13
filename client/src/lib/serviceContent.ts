const serviceTitles: Record<string, string> = {
  "prima visita nutrizionale": "Prima visita nutrizionale",
  "visita di controllo": "Visita di controllo",
  "prima visita online": "Prima visita online",
  "visita di controllo online": "Visita di controllo online",
  "educazione alimentare": "Educazione alimentare",
  "analisi della composizione corporea (metadieta bia)": "Analisi della composizione corporea (MetaDieta BIA)",
};

const serviceDetails: Array<{ match: string[]; points: string[] }> = [
  {
    match: ["prima visita nutrizionale"],
    points: ["Anamnesi clinica, fisiologica e alimentare", "Analisi di abitudini, stile di vita e obiettivi", "Misure antropometriche e valutazione della composizione corporea", "Definizione condivisa della strategia nutrizionale"],
  },
  {
    match: ["visita di controllo online"],
    points: ["Verifica dei progressi e delle abitudini", "Confronto su difficoltà e cambiamenti", "Aggiornamento delle misure riferite", "Adattamento della strategia nutrizionale"],
  },
  {
    match: ["visita di controllo"],
    points: ["Valutazione dei progressi raggiunti", "Confronto su dubbi e difficoltà emerse", "Aggiornamento di peso, circonferenze e composizione corporea", "Eventuali modifiche al percorso nutrizionale"],
  },
  {
    match: ["prima visita online"],
    points: ["Colloquio approfondito in videochiamata", "Analisi di alimentazione, stile di vita e obiettivi", "Valutazione delle misure corporee riferite", "Impostazione di un percorso compatibile con la quotidianità"],
  },
  {
    match: ["educazione alimentare"],
    points: ["Lettura consapevole delle etichette", "Organizzazione pratica dei pasti", "Spesa e scelte alimentari quotidiane", "Strumenti per sviluppare autonomia e flessibilità"],
  },
  {
    match: ["composizione corporea", "metadieta bia"],
    points: ["Analisi della composizione corporea tramite BIA", "Valutazione di massa grassa, massa magra e idratazione", "Lettura professionale dei risultati", "Monitoraggio dell’evoluzione nel tempo"],
  },
];

export function formatServiceTitle(title: string): string {
  const normalizedTitle = title.trim().toLocaleLowerCase("it-IT");
  return serviceTitles[normalizedTitle] ?? title;
}

export function getServicePoints(title: string): string[] {
  const normalizedTitle = title.toLocaleLowerCase("it-IT");
  return serviceDetails.find(detail => detail.match.some(term => normalizedTitle.includes(term)))?.points ?? [
    "Valutazione personalizzata delle tue esigenze",
    "Indicazioni pratiche applicabili alla quotidianità",
    "Strategia costruita insieme sui tuoi obiettivi",
  ];
}
