import SEO from "@/components/SEO";
import PerfectGymService from "@/components/PerfectGymService";
import { trpc } from "@/lib/trpc";

export default function SportsNutrition() {
  const { data: services } = trpc.services.list.useQuery();
  return (
    <>
      <SEO title="Nutrizione Sportiva | Arianna Pelliccioni Dietista"
        description="Collaborazione Palestra Better. Promozioni riservate agli abbonati Better Club, solo per abbonamenti in corso di validità."
        canonical="https://ariannapelliccionidietista.it/nutrizione-sportiva" />
      <section className="bg-primary px-4 py-16 text-white md:py-24">
        <div className="container text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-white/80">Nutrizione Sportiva</p>
          <h1 className="flex flex-col gap-3 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            <span>Nutrizione</span><span>Allenamento</span><span>Performance</span>
          </h1>
        </div>
      </section>
      <div className="container py-12 md:py-20">
        <PerfectGymService services={services} />
      </div>
    </>
  );
}
