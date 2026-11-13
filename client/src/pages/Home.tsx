import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Activity, Apple, ArrowRight, Dumbbell, HeartPulse, Sparkles, Sprout, Star } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatServiceTitle } from "@/lib/serviceContent";
import StudioCarousel from "@/components/StudioCarousel";

const approachSteps = [
  ["1", "Ascolto", "Conosciamo la tua storia, le abitudini, le esigenze e ciò che vuoi davvero ottenere."],
  ["2", "Valutazione", "Mettiamo a fuoco salute, stile di vita, composizione corporea e punto di partenza."],
  ["3", "Strategia su misura", "Costruiamo indicazioni pratiche e flessibili, compatibili con giornate, gusti e allenamenti."],
  ["4", "Evoluzione", "Nei controlli osserviamo i progressi e adattiamo il percorso senza giudizio e senza rigidità."],
] as const;

const expertiseAreas = [
  { icon: Apple, title: "Educazione alimentare", emphasis: "Per grandi e piccoli", description: "Più consapevolezza nelle scelte, nella spesa e nell’organizzazione dei pasti, con strumenti adatti all’età e alla vita quotidiana." },
  { icon: HeartPulse, title: "Salute fisica e metabolica", description: "Supporto nutrizionale personalizzato nelle condizioni che possono beneficiare di un intervento alimentare mirato.", points: ["Sovrappeso, obesità e ricomposizione corporea", "Insulino-resistenza e diabete", "Dislipidemie, ipertensione e steatosi epatica", "Iperuricemia, anemia e alterazioni tiroidee", "Disturbi gastrointestinali e intolleranze"] },
  { icon: Sprout, title: "Benessere femminile", description: "Percorsi dedicati alle diverse fasi della vita e alle esigenze della salute femminile." },
  { icon: Activity, title: "Ricomposizione corporea", description: "Obiettivi di peso e composizione corporea affrontati con gradualità e metodo." },
] as const;

export default function Home() {
  const { user } = useAuth();
  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();
  const { data: testimonials, isLoading: testimonialsLoading } = trpc.testimonials.list.useQuery();

  return (
    <div className="min-h-screen">
      <SEO
        title="Dietista Arianna Pelliccioni - Nutrizione Personalizzata Perugia"
        description="Consulenza nutrizionale personalizzata con la Dott.ssa Arianna Pelliccioni, dietista specializzata a Perugia. Piani alimentari su misura per il tuo benessere e salute."
        keywords="dietista Perugia, nutrizione personalizzata, consulenza nutrizionale, dieta personalizzata, dietologo Perugia, alimentazione sana, benessere"
        canonical="https://ariannapelliccionidietista.it/"
      />
      <StructuredData type="LocalBusiness" />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-secondary/30 via-background to-accent/20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Il tuo percorso verso il{" "}
                  <span className="text-primary">Benessere</span>
                </h1>
              </div>
              <div className="space-y-1.5 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>La dieta non è una punizione, ma uno strumento di cura e consapevolezza.</p>
                <p>Deve rispettare i tuoi gusti, i tuoi ritmi e la tua quotidianità.</p>
                <p>Può aiutarti a ritrovare energia, equilibrio e serenità a tavola.</p>
                <p>Può sostenere la salute, il movimento e la performance sportiva.</p>
                <p>Non richiede perfezione, ma scelte sostenibili che durano nel tempo.</p>
                <p>Ogni percorso nasce dall’ascolto della tua storia e dei tuoi bisogni.</p>
                <p>Insieme trasformiamo gli obiettivi in abitudini concrete e personali.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {user?.role !== 'admin' && (
                  <Link href="/prenota">
                    <Button size="lg" className="w-full sm:w-auto">
                      Prenota una consulenza
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="/servizi">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Scopri i servizi
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <StudioCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="overflow-hidden bg-muted/20 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> Un percorso costruito insieme
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Il mio approccio
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Niente schemi rigidi o soluzioni uguali per tutti: partiamo dalla tua quotidianità e costruiamo obiettivi realistici, un passo alla volta.
            </p>
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-4">
            <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent md:block" />
            {approachSteps.map(([number, title, description]) => (
              <div key={number} className="group relative text-center">
                <div className="relative z-10 mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition group-hover:-translate-y-1 group-hover:rotate-6">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <span className="text-xs font-bold tracking-[0.18em] text-primary/60">PASSO {number}</span>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Aree di competenza</p>
            <h2 className="text-3xl font-bold md:text-4xl">Dove posso accompagnarti</h2>
            <p className="mt-4 text-lg text-muted-foreground">Percorsi nutrizionali personalizzati per benessere, salute e obiettivi specifici, con un’attenzione crescente al mondo sportivo.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr_1fr]">
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary to-primary text-white shadow-xl lg:row-span-2">
              <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <CardContent className="relative flex h-full flex-col p-8">
                <div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                  <Dumbbell className="h-7 w-7 text-white" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">Focus sportivo</p>
                <h3 className="mt-3 text-3xl font-semibold">Nutrizione per sport e performance</h3>
                <p className="mt-4 leading-relaxed text-white/80">Un supporto nutrizionale pensato intorno al tipo di attività, ai carichi di allenamento e agli obiettivi dell’atleta, professionista o amatoriale.</p>
                <ul className="mt-7 space-y-3 text-sm text-white/90">
                  {["Energia e organizzazione dei pasti intorno all’allenamento", "Idratazione, recupero e gestione della giornata sportiva", "Composizione corporea e obiettivi di performance"].map(item => (
                    <li key={item} className="flex gap-3"><Star className="mt-0.5 h-4 w-4 shrink-0 fill-white text-white" />{item}</li>
                  ))}
                </ul>
                <p className="mt-auto pt-8 text-xs leading-relaxed text-white/65">Competenze in approfondimento attraverso la Scuola di Alta Formazione SANIS in Nutrizione e Integrazione Sportiva, in partenza a ottobre 2026.</p>
              </CardContent>
            </Card>

            {expertiseAreas.map(({ icon: ExpertiseIcon, title, description, ...area }) => (
                <Card key={title} className="border-2 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10"><ExpertiseIcon className="h-5 w-5 text-primary" /></div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    {"emphasis" in area ? <p className="mt-1 text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4">{area.emphasis}</p> : null}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                    {"points" in area ? (
                      <>
                        <ul className="mt-4 space-y-2 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
                          {area.points.map(point => <li key={point} className="flex gap-2"><Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-primary/20 text-primary" />{point}</li>)}
                        </ul>
                        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80">Il supporto nutrizionale affianca, senza sostituirli, diagnosi, terapie e controlli medici.</p>
                      </>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">I miei servizi</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluzioni complete per ogni esigenza nutrizionale
            </p>
          </div>

          {servicesLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {services?.slice(0, 3).map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{formatServiceTitle(service.title)}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between gap-3 mb-4">
                      <span className="text-xl font-bold text-primary">
                        {service.price > 0 ? `€${(service.price / 100).toFixed(2)}` : "Su richiesta"}
                      </span>
                      <span className="text-sm text-muted-foreground text-right">
                        {service.duration > 0 ? `circa ${service.duration} min` : "Durata personalizzata"}
                      </span>
                    </div>
                    <Link href="/servizi">
                      <Button className="w-full">Scopri di più</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/servizi">
              <Button variant="outline" size="lg">
                Vedi tutti i servizi
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cosa dicono i miei clienti
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Storie di successo e trasformazione
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials?.slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <CardDescription className="text-base">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/testimonianze">
              <Button variant="outline" size="lg">
                Leggi tutte le recensioni
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Inizia oggi il tuo percorso di benessere
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Compila il form cliccando sul pulsante in basso e la Dottoressa Pelliccioni si metterà in contatto con te!
              </p>
              <Link href="/prenota">
                <Button size="lg">
                  Il Cambiamento Inizia da Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
