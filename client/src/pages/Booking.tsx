import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  User,
  ClipboardList,
} from "lucide-react";
import SEO from "@/components/SEO";

type FormData = {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  medicalConditions: string;
  allergies: string;
  currentDiet: string;
  message: string;
  privacyConsent: boolean;
};

const EMPTY_FORM: FormData = {
  serviceId: "",
  name: "",
  email: "",
  phone: "",
  age: "",
  weight: "",
  height: "",
  goal: "",
  medicalConditions: "",
  allergies: "",
  currentDiet: "",
  message: "",
  privacyConsent: false,
};

export default function Booking() {
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();

  const submitMutation = trpc.consultations.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Richiesta inviata con successo!");
    },
    onError: (error) => {
      toast.error("Errore nell'invio", { description: error.message });
    },
  });

  const handleNextStep = () => {
    if (!formData.name.trim()) {
      toast.error("Inserisci il tuo nome e cognome");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Inserisci la tua email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Inserisci un'email valida");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      toast.error("Devi accettare il consenso al trattamento dei dati");
      return;
    }
    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      goal: formData.goal || undefined,
      medicalConditions: formData.medicalConditions || undefined,
      allergies: formData.allergies || undefined,
      currentDiet: formData.currentDiet || undefined,
      message: formData.message || undefined,
      privacyConsent: formData.privacyConsent,
    });
  };

  const update = (field: keyof FormData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  /* ── Confirmation screen ── */
  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-secondary/20 to-background pt-24 pb-16">
        <SEO
          title="Richiesta Inviata - Dietista Arianna Pelliccioni"
          description="La tua richiesta di consulenza nutrizionale è stata inviata con successo."
        />
        <div className="container max-w-2xl">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Richiesta Ricevuta!</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Grazie per aver compilato il questionario. Ho ricevuto la tua richiesta e ti contatterò al più presto.
              </p>
              <div className="bg-secondary/30 rounded-xl p-6 mb-8 text-left space-y-3">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  I Miei Contatti
                </h3>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="mailto:pelliccioniarianna.dietista@gmail.com" className="text-sm text-primary hover:underline break-all">
                    pelliccioniarianna.dietista@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+393501765893" className="text-sm text-primary hover:underline">
                    +39 350 1765893
                  </a>
                </div>
                <p className="text-xs text-muted-foreground pt-2 italic">
                  ✓ Ti contatterò entro 24-48 ore lavorative per fissare il nostro primo appuntamento.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setLocation("/")}>
                  Torna alla Home
                </Button>
                <Button onClick={() => { setSubmitted(false); setStep(1); setFormData(EMPTY_FORM); }}>
                  Invia Altra Richiesta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  /* ── Progress bar ── */
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : <User className="h-4 w-4" />}
          </div>
          <span className={`text-sm font-medium hidden sm:block ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            Dati di Contatto
          </span>
        </div>

        {/* Connector */}
        <div className="flex-1 mx-4 h-1 rounded-full overflow-hidden bg-muted">
          <div className={`h-full rounded-full transition-all duration-500 ${step === 2 ? "w-full bg-primary" : "w-0"}`} />
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium hidden sm:block ${step === 2 ? "text-primary" : "text-muted-foreground"}`}>
            Informazioni Cliniche
          </span>
          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            <ClipboardList className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Mobile step label */}
      <p className="text-center text-sm text-muted-foreground sm:hidden">
        {step === 1 ? "Step 1 di 2 — Dati di Contatto" : "Step 2 di 2 — Informazioni Cliniche"}
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/20 to-background pt-24 pb-16">
      <SEO
        title="Prenota Consulenza - Dietista Arianna Pelliccioni"
        description="Richiedi una consulenza nutrizionale personalizzata con la Dott.ssa Arianna Pelliccioni. Compila il questionario in 2 semplici step."
        canonical="https://ariannapelliccionidietista.it/prenota"
      />
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Richiedi una Consulenza
          </h1>
          <p className="text-lg text-muted-foreground">
            Compila il questionario in 2 semplici step per fissare un appuntamento personalizzato
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <ProgressBar />
            <CardTitle className="text-xl">
              {step === 1 ? "Dati di Contatto" : "Informazioni Cliniche"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "Inserisci i tuoi dati per essere ricontattato/a. I campi con * sono obbligatori."
                : "Questi dati aiutano la Dottoressa a prepararsi al meglio. Tutti i campi sono facoltativi."}
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Servizio */}
                <div className="space-y-2">
                  <Label htmlFor="serviceId">Tipo di Consulenza</Label>
                  {servicesLoading ? (
                    <div className="flex items-center gap-2 p-3 text-muted-foreground text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" /> Caricamento servizi…
                    </div>
                  ) : (
                    <Select
                      value={formData.serviceId}
                      onValueChange={(v) => update("serviceId", v)}
                    >
                      <SelectTrigger id="serviceId">
                        <SelectValue placeholder="Seleziona un servizio (opzionale)" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.title} — €{(s.price / 100).toFixed(0)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome e Cognome *</Label>
                  <Input
                    id="name"
                    placeholder="Mario Rossi"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mario.rossi@example.com"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>

                {/* Telefono */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono / WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+39 123 456 7890"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>

                <Button className="w-full mt-2" size="lg" onClick={handleNextStep}>
                  Continua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Età, Peso, Altezza */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="age">Età</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={formData.age}
                      onChange={(e) => update("age", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => update("weight", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altezza (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => update("height", e.target.value)}
                    />
                  </div>
                </div>

                {/* Obiettivo */}
                <div className="space-y-2">
                  <Label htmlFor="goal">Obiettivo Nutrizionale</Label>
                  <Textarea
                    id="goal"
                    placeholder="Es: Perdere peso, aumentare massa muscolare, migliorare energia…"
                    value={formData.goal}
                    onChange={(e) => update("goal", e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Condizioni mediche */}
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Condizioni Mediche / Patologie</Label>
                  <Textarea
                    id="medicalConditions"
                    placeholder="Es: Diabete, ipertensione, ipotiroidismo…"
                    value={formData.medicalConditions}
                    onChange={(e) => update("medicalConditions", e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Allergie */}
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergie / Intolleranze Alimentari</Label>
                  <Textarea
                    id="allergies"
                    placeholder="Es: Lattosio, glutine, frutta secca…"
                    value={formData.allergies}
                    onChange={(e) => update("allergies", e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Dieta attuale */}
                <div className="space-y-2">
                  <Label htmlFor="currentDiet">Alimentazione Attuale</Label>
                  <Textarea
                    id="currentDiet"
                    placeholder="Descrivi brevemente la tua alimentazione quotidiana…"
                    value={formData.currentDiet}
                    onChange={(e) => update("currentDiet", e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Note aggiuntive */}
                <div className="space-y-2">
                  <Label htmlFor="message">Note Aggiuntive</Label>
                  <Textarea
                    id="message"
                    placeholder="Altre informazioni che ritieni utili…"
                    value={formData.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3 p-4 bg-muted/40 rounded-lg border">
                  <input
                    id="privacyConsent"
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary cursor-pointer"
                    checked={formData.privacyConsent}
                    onChange={(e) => update("privacyConsent", e.target.checked)}
                  />
                  <label htmlFor="privacyConsent" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                    Acconsento al trattamento dei miei dati personali ai sensi del GDPR (Regolamento UE 2016/679) per la gestione della richiesta di consulenza nutrizionale. I dati forniti saranno utilizzati esclusivamente per finalità legate alla prestazione del servizio richiesto e non saranno ceduti a terzi senza il mio consenso. *
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Indietro
                  </Button>
                  <Button
                    type="submit"
                    className="flex-2 flex-grow"
                    size="lg"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Invio in corso…</>
                    ) : (
                      <>Invia Richiesta <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
