import { Check, Clock, Dumbbell } from "lucide-react";
import { type PublicService } from "@shared/services";
import { BETTER_NOTICE, getBetterOffers } from "@shared/betterOffers";
import { Link } from "wouter";
import { getServicePoints } from "@/lib/serviceContent";
import { Button } from "@/components/ui/button";

type Service = Pick<PublicService, "id" | "title" | "description" | "duration" | "price">;

export default function PerfectGymService({ services }: { services?: Service[] }) {
  const offers = getBetterOffers(services);

  return (
    <section aria-labelledby="perfect-title" className="overflow-hidden rounded-2xl border-2 border-[#153927] bg-[#153927] text-white shadow-lg md:col-span-2 lg:col-span-3">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15">
            <Dumbbell className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 id="perfect-title" className="text-2xl font-semibold leading-tight">Collaborazione Palestra Better</h2>
            <p className="mt-3 text-base text-white/90">Promozioni riservate agli abbonati Better Club</p>
            <p className="mt-2 text-sm font-semibold text-white">{BETTER_NOTICE}</p>
          </div>
        </div>
      </div>
      <div id="perfect-offers" className="border-t border-white/20 bg-background p-4 text-foreground md:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {offers.map(offer => {
            const { source, price } = offer;
            return (
              <article key={offer.match} className="flex flex-col rounded-xl border border-[#153927]/15 bg-white p-6">
                <h3 className="text-xl font-semibold text-[#153927]">{offer.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{source.description}</p>
                <ul className="my-5 space-y-3">
                  {getServicePoints(source.title).map(point => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#153927]" />{point}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#153927]/15 pt-4">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Clock aria-hidden="true" className="h-4 w-4" />{source.duration > 0 ? `circa ${source.duration} minuti` : "Durata personalizzata"}</span>
                  <span className="text-xl font-bold text-[#153927]">Prezzo: {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price / 100)}</span>
                </div>
                <Button asChild size="lg" className="mt-5 w-full bg-[#153927] text-white hover:bg-[#153927]">
                  <Link href={`/prenota?servizio=${offer.key}`} aria-label={`Prenota ${offer.title} Better Club`}>Prenota</Link>
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
