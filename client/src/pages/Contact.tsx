import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import BetterNotice from "@/components/BetterNotice";
import { getBetterOffers } from "@shared/betterOffers";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consultationType: "",
    message: "",
  });
  const { data: services } = trpc.services.list.useQuery();
  const betterOffers = getBetterOffers(services);
  const selectedBetter = betterOffers.find(offer => offer.label === formData.consultationType);
  const selectedService = services?.find(service => service.title === formData.consultationType);
  const bookingSelection = selectedBetter?.key ?? selectedService?.id;
  const bookingHref = bookingSelection ? `/prenota?servizio=${bookingSelection}` : "/prenota";

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Richiesta inviata con successo!", {
        description: "Ti contatteremo al più presto.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        consultationType: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error("Errore nell'invio", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <>
      <SEO
        title="Contatti - Prenota Consulenza Dietista Perugia | Arianna Pelliccioni"
        description="Contatta la Dott.ssa Arianna Pelliccioni per prenotare una consulenza nutrizionale a Perugia. Compila il form o chiama per iniziare il tuo percorso verso il benessere."
        keywords="contatti dietista Perugia, prenotazione consulenza nutrizionale, dietista Arianna Pelliccioni contatti"
        canonical="https://ariannapelliccionidietista.it/contatti"
      />
      <div className="min-h-screen py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contattami</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hai domande o vuoi prenotare una consulenza? Compila il form o contattami 
            direttamente. Sono qui per aiutarti nel tuo percorso verso il benessere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-2">
            <CardHeader>
              {selectedBetter && <BetterNotice />}
              <CardTitle>Invia una Richiesta</CardTitle>
              <CardDescription>
                Compila il form e ti risponderò entro 24 ore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome e Cognome *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mario Rossi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mario.rossi@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+39 123 456 7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationType">Tipo di Consulenza</Label>
                  <Select
                    value={formData.consultationType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, consultationType: value })
                    }
                  >
                    <SelectTrigger id="consultationType" className="w-full min-w-0 [&>span]:truncate">
                      <SelectValue placeholder="Seleziona il tipo di consulenza" />
                    </SelectTrigger>
                    <SelectContent>
                      {betterOffers.map(offer => (
                        <SelectItem key={offer.key} value={offer.label}>
                          {offer.label} — €{(offer.price / 100).toFixed(0)}
                        </SelectItem>
                      ))}
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.title}>
                          {service.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="altro">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={bookingHref}>
                      {selectedBetter ? "Prenota con Better Club" : "Prenota una consulenza"}
                    </Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Descrivi brevemente le tue esigenze..."
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Invio in corso..." : "Invia Richiesta"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Informazioni di Contatto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="break-all text-muted-foreground">pelliccioniarianna.dietista@gmail.com</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rispondo entro 24 ore
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefono</h3>
                    <p className="text-muted-foreground">+39 350 1765893</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Studi Medici</h3>
                    <p className="text-muted-foreground">San.Ar. studi medici</p>
                    <p className="text-muted-foreground">Via Piero Calamandrei, 137 - Arezzo</p>
                    <p className="text-muted-foreground mt-3">Medicina Specialistica</p>
                    <p className="text-muted-foreground">Piazza De Gasperi, 29 - Camucia-Cortona</p>
                    <p className="text-muted-foreground mt-3">Poliambulatorio Fisioterapico Pineta Srl</p>
                    <p className="text-muted-foreground">Localita Pineta, 13 - Macchie (PG)</p>
                    <p className="text-muted-foreground mt-3">Centro Sinergia</p>
                    <p className="text-muted-foreground">Via Amilchare Ponchielli, 30 - Corciano (PG)</p>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
    </>
  );
}
