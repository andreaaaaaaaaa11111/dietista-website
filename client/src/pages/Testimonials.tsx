import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { Star, Quote, PenLine, Mail, Loader2 } from "lucide-react";

export default function Testimonials() {
  const { user, loading: authLoading } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ content: "", rating: 5 });
  const { data: testimonials, isLoading } = trpc.testimonials.list.useQuery();
  const utils = trpc.useUtils();

  const submitMutation = trpc.testimonials.submit.useMutation({
    onSuccess: () => {
      toast.success("Recensione inviata!", {
        description: "La tua recensione sarà visibile dopo l'approvazione.",
      });
      utils.testimonials.list.invalidate();
      setIsFormOpen(false);
      setNewReview({ content: "", rating: 5 });
    },
    onError: (error) => {
      toast.error("Errore nell'invio", { description: error.message });
    },
  });

  const handleSubmit = () => {
    if (newReview.content.length < 10) {
      toast.error("La recensione deve essere di almeno 10 caratteri");
      return;
    }
    submitMutation.mutate(newReview);
  };

  return (
    <>
      <SEO
        title="Testimonianze Clienti - Dietista Arianna Pelliccioni Perugia"
        description="Leggi le recensioni e testimonianze dei pazienti della Dott.ssa Arianna Pelliccioni. Scopri le esperienze di chi ha raggiunto i propri obiettivi di benessere nutrizionale."
        keywords="testimonianze dietista Perugia, recensioni nutrizionista, feedback pazienti, opinioni dietista"
        canonical="https://ariannapelliccionidietista.it/testimonianze"
      />
      <div className="min-h-screen py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Testimonianze</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Le storie di chi ha già intrapreso il percorso verso il benessere. 
            Scopri come ho aiutato i miei clienti a raggiungere i loro obiettivi.
          </p>
          
          {/* Pulsante per aggiungere recensione */}
          {!authLoading && (
            <div>
              {user ? (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg">
                      <PenLine className="h-5 w-5 mr-2" />
                      Lascia una recensione
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Scrivi la tua recensione</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">La tua valutazione</label>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">La tua esperienza</label>
                        <Textarea
                          value={newReview.content}
                          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                          placeholder="Racconta la tua esperienza con il percorso nutrizionale..."
                          rows={5}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Minimo 10 caratteri</p>
                      </div>
                      <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="w-full">
                        {submitMutation.isPending ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Invio in corso...</>
                        ) : "Invia Recensione"}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        La recensione sarà visibile dopo l'approvazione
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button size="lg" asChild>
                  <a href={getLoginUrl()}>
                    <PenLine className="h-5 w-5 mr-2" />
                    Accedi per lasciare una recensione
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-xl transition-all border-2 hover:border-primary/50 relative">
                <div className="absolute top-4 right-4 text-primary/20">
                  <Quote className="h-12 w-12" />
                </div>
                <CardHeader className="relative">
                  <div className="flex items-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "fill-accent text-accent"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed text-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {testimonial.imageUrl ? (
                        <img
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                      </div>
                    </div>
                    {testimonial.email && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="p-2 rounded-full hover:bg-muted transition-colors" title="Contatta">
                            <Mail className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Contatta {testimonial.name}</DialogTitle>
                          </DialogHeader>
                          <div className="text-center py-4">
                            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <p className="text-lg font-medium mb-2">{testimonial.email}</p>
                            <Button asChild className="mt-4">
                              <a href={`mailto:${testimonial.email}`}>Invia Email</a>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              Nessuna testimonianza disponibile al momento.
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 bg-muted/30 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{testimonials?.length || 0}</div>
            <p className="text-muted-foreground">Clienti soddisfatti</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{testimonials?.length ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10) / 10 : 0}/5</div>
            <p className="text-muted-foreground">Valutazione media</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{testimonials?.length ? Math.round((testimonials.filter(t => t.rating >= 4).length / testimonials.length) * 100) : 0}%</div>
            <p className="text-muted-foreground">Grado di soddisfazione dei pazienti</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
