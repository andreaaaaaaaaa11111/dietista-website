import { DEFAULT_SERVICES, type PublicService } from "./services";

export const BETTER_NOTICE = "Solo per abbonamenti in corso di validità";
export const BETTER_KEYS = ["better-prima-visita", "better-controllo", "better-bia"] as const;
const definitions = [
  { key: BETTER_KEYS[0], match: "prima visita nutrizionale", title: "Prima visita", price: 7500 },
  { key: BETTER_KEYS[1], match: "visita di controllo", title: "Visita di controllo", price: 4000 },
  { key: BETTER_KEYS[2], match: "analisi della composizione corporea (metadieta bia)", title: "BIA (bioimpedenziometria)", price: null },
] as const;

type SourceService = Pick<PublicService, "id" | "title" | "description" | "duration" | "price">;

export function getBetterOffers(services: SourceService[] = DEFAULT_SERVICES) {
  return definitions.map(offer => {
    const matches = (service: SourceService) => service.title.trim().toLocaleLowerCase("it-IT") === offer.match;
    const source = services.find(matches) ?? DEFAULT_SERVICES.find(matches)!;
    return { ...offer, source, price: offer.price ?? source.price, label: `Better Club — ${offer.title}` };
  });
}

export function betterRequestMessage(offer: ReturnType<typeof getBetterOffers>[number], message?: string) {
  return [`${offer.label} — €${(offer.price / 100).toFixed(2)}`, `${BETTER_NOTICE}. Validità da verificare.`, message?.trim()].filter(Boolean).join("\n");
}
