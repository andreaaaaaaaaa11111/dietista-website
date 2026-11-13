export type PublicService = {
  id: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

const catalogDate = new Date("2026-01-01T00:00:00.000Z");

// Catalogo ufficiale usato anche come fallback quando il database è vuoto.
// I prezzi sono espressi in centesimi.
export const DEFAULT_SERVICES: PublicService[] = [
  {
    id: 1,
    title: "Prima Visita Nutrizionale",
    description:
      "Valutazione completa dello stato nutrizionale, analisi delle abitudini alimentari e definizione degli obiettivi. Include misurazione composizione corporea e piano alimentare personalizzato.",
    duration: 60,
    price: 9000,
    active: true,
    order: 1,
    createdAt: catalogDate,
    updatedAt: catalogDate,
  },
  {
    id: 2,
    title: "Visita di controllo",
    description:
      "Rivalutazione dei progressi del paziente. Eventuali modifiche al piano nutrizionale inviato.",
    duration: 40,
    price: 5000,
    active: true,
    order: 2,
    createdAt: catalogDate,
    updatedAt: catalogDate,
  },
  {
    id: 3,
    title: "Prima visita Online",
    description:
      "Consulenza nutrizionale svolta attraverso piattaforme digitali. Per maggiori informazioni sullo svolgimento online contattami!",
    duration: 60,
    price: 7000,
    active: true,
    order: 3,
    createdAt: catalogDate,
    updatedAt: catalogDate,
  },
  {
    id: 4,
    title: "Visita di controllo online",
    description:
      "Rivalutazione del paziente ed eventuale cambio della strategia nutrizionale.",
    duration: 24,
    price: 4000,
    active: true,
    order: 4,
    createdAt: catalogDate,
    updatedAt: catalogDate,
  },
  {
    id: 5,
    title: "Educazione Alimentare",
    description:
      "Sessione educativa su temi specifici: lettura etichette, spesa consapevole, organizzazione pasti, cucina salutare. Ideale per famiglie e gruppi.",
    duration: 60,
    price: 7000,
    active: true,
    order: 5,
    createdAt: catalogDate,
    updatedAt: catalogDate,
  },
  {
    id: 6,
    title: "Analisi della composizione corporea (MetaDieta BIA)",
    description: "Analisi della composizione corporea con MetaDieta BIA",
    duration: 20,
    price: 2000,
    active: true,
    order: 6,
    createdAt: catalogDate,
    updatedAt: catalogDate,
  },
];
