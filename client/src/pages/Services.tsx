import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Clock, Euro, ArrowRight, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { formatServiceTitle, getServicePoints } from "@/lib/serviceContent";

export default function Services() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  return (
    <>
      <SEO
        title="Servizi di Nutrizione - Consulenza Dietista Perugia | Arianna Pelliccioni"
        description="Scopri i servizi di consulenza nutrizionale personalizzata: piani alimentari su misura, educazione alimentare, supporto continuo. Prenota la tua consulenza a Perugia."
        keywords="servizi dietista, consulenza nutrizionale Perugia, piano alimentare personalizzato, educazione alimentare, dietologo Perugia"
        canonical="https://ariannapelliccionidietista.it/servizi"
      />
      <div className="min-h-screen py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">I miei servizi</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ti offro una gamma completa di servizi nutrizionali personalizzati per aiutarti 
            a raggiungere i tuoi obiettivi di salute e benessere. Ogni consulenza è studiata 
            sulle tue esigenze specifiche.
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-1"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Card key={service.id} className="flex flex-col hover:shadow-xl transition-all border-2 hover:border-primary/50">
                <CardHeader className="flex-grow">
                  <CardTitle className="text-2xl mb-3">{formatServiceTitle(service.title)}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <ul className="mt-5 space-y-2.5 border-t pt-5">
                    {getServicePoints(service.title).map(point => (
                      <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10">
                          <Check className="h-3.5 w-3.5 text-primary" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4 py-3 border-t">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">
                        {service.duration > 0 ? `circa ${service.duration} minuti` : "Durata personalizzata"}
                      </span>
                    </div>
                    {service.price > 0 ? (
                      <div className="flex items-center space-x-1">
                        <Euro className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold text-primary">
                          {(service.price / 100).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">Su richiesta</span>
                    )}
                  </div>
                  <Link href={`/prenota?servizio=${service.id}`}>
                    <Button className="w-full" size="lg">
                      Scopri di più
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-20 bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Come funziona</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Prenota</h3>
                <p className="text-sm text-muted-foreground">
                  Scegli il servizio che preferisci
                </p>
              </div>
              <div>
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Consulenza</h3>
                <p className="text-sm text-muted-foreground">
                  Consulenza personalizzata
                </p>
              </div>
              <div>
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Piano personalizzato</h3>
                <p className="text-sm text-muted-foreground">
                  Ricevi il tuo piano personalizzato
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Entro 7 giorni lavorativi troverai pronto il tuo piano nella mail fornita nel corso della visita!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Non sei sicuro quale servizio fa per te?
          </p>
          <Link href="/contatti">
            <Button variant="outline" size="lg">
              Contattami per capire quale piano fa al caso tuo
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
