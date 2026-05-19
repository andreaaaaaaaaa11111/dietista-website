import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { CheckCircle, Star, ArrowRight, Leaf, Heart, TrendingUp } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

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
                  Il Tuo Percorso Verso il{" "}
                  <span className="text-primary">Benessere</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Il benessere nasce dalle scelte che facciamo ogni giorno, a partire da ciò che portiamo in tavola.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user?.role !== 'admin' && (
                  <Link href="/prenota">
                    <Button size="lg" className="w-full sm:w-auto">
                      Prenota Consulenza
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="/servizi">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Scopri i Servizi
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/dietista-hero.jpg" 
                  alt="Dietista Arianna Pelliccioni" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perché Scegliere di Affidarsi a Me
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              La scelta di un professionista può cambiare tutto, scegli con attenzione!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Raggiungimi</CardTitle>
                <CardDescription>
                  Raggiungimi in una delle mie sedi per iniziare il nostro percorso insieme.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Cura della Vostra Salute</CardTitle>
                <CardDescription>
                  Ogni percorso intrapreso insieme serve per riuscire ad ottenere il miglior stato di salute possibile!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Risultati Duraturi</CardTitle>
                <CardDescription>
                  Follow-up costante e supporto continuo per garantire 
                  risultati concreti e mantenuti nel tempo
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">I Miei Servizi</h2>
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
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-3xl font-bold text-primary">
                        €{(service.price / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {service.duration} min
                      </span>
                    </div>
                    <Link href="/prenota">
                      <Button className="w-full">Prenota Ora</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/servizi">
              <Button variant="outline" size="lg">
                Vedi Tutti i Servizi
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
              Cosa Dicono i Miei Clienti
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
                Leggi Tutte le Recensioni
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
                Inizia Oggi il Tuo Percorso Benessere
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
