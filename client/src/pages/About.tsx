import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Dumbbell, Heart, Target } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function About() {
  return (
    <>
      <SEO
        title="Chi Sono - Dott.ssa Arianna Pelliccioni | Dietista Perugia"
        description="Scopri il percorso professionale della Dott.ssa Arianna Pelliccioni, dietista laureata a Siena. Approccio nutrizionale personalizzato, scientifico e flessibile per il tuo benessere."
        keywords="Arianna Pelliccioni, dietista Perugia, biografia dietista, formazione nutrizionale, approccio personalizzato"
        canonical="https://ariannapelliccionidietista.it/chi-sono"
      />
      <StructuredData type="Person" />
      <div className="min-h-screen py-20">
      <div className="container">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Chi sono</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Sono Arianna Pelliccioni, Dietista Laureata presso l'Università degli Studi di Siena. La mia missione, sin dai primi anni di Università, è stata aiutare i miei pazienti a raggiungere i loro obiettivi di salute sostenendoli attraverso un approccio nutrizionale personalizzato, scientifico e soprattutto flessibile.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Credo fermamente che ogni paziente esprima delle necessità e dei bisogni unici e necessiti quindi di un piano nutrizionale studiato sulle proprie esigenze specifiche, stile di vita e obiettivi personali. Non esistono diete universali, ma percorsi personalizzati verso il benessere!
            </p>
          </div>
          <div className="relative">
            <img 
              src="/arianna-pelliccioni.jpg"
              alt="Dott.ssa Arianna Pelliccioni - Dietista Professionista"
              className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Formazione e Certificazioni */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Formazione e certificazioni</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Laurea in dietistica</h3>
                    <p className="text-muted-foreground">
                      Università degli Studi di Siena (2021-2024)- 108/110 e lode
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Tesi di Laurea: "Obesità e PCOS: variazioni metaboliche e antropometriche nelle diverse fasi della vita riproduttiva"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Iscrizione all'albo professionale</h3>
                    <p className="text-muted-foreground">
                      Ordine TSRM PSTRP - Sezione Dietisti
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">N. 123</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-primary/[0.035]">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">In partenza a ottobre 2026</span>
                    <h3 className="font-semibold text-lg mb-2">Scuola SANIS</h3>
                    <p className="text-muted-foreground">
                      Scuola di Alta Formazione in Nutrizione e Integrazione Sportiva, per approfondire alimentazione, recupero, composizione corporea e performance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Approccio Metodologico */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Il mio approccio</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Ascolto empatico</h3>
                <p className="text-muted-foreground">
                  Ogni percorso inizia con l'ascolto delle tue esigenze, obiettivi e 
                  difficoltà. La relazione di fiducia è alla base del successo.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Evidenze scientifiche</h3>
                <p className="text-muted-foreground">
                  Tutti i piani nutrizionali sono basati sulle più recenti ricerche 
                  scientifiche in nutrizione e dietologia clinica.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Risultati sostenibili</h3>
                <p className="text-muted-foreground">
                  L'obiettivo non è solo raggiungere i risultati, ma mantenerli nel tempo 
                  attraverso cambiamenti graduali e sostenibili.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filosofia */}
        <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">La mia filosofia</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Il cibo è vita, nutrimento e relazione. Ci accompagna ogni giorno, sostiene il corpo e la mente ed è parte della nostra storia personale, familiare e culturale. Per questo credo che l'alimentazione non debba essere vissuta come una privazione, ma come un gesto concreto di cura verso se stessi.
              </p>
              <p>
                Una buona alimentazione è una parte essenziale della salute, ma non agisce da sola: si integra con il <strong className="text-foreground">movimento fisico</strong>, il riposo, l'idratazione e la capacità di ascoltare i bisogni del proprio organismo. Anche piccoli cambiamenti, quando sono realistici e ripetibili, possono diventare una base solida per stare meglio nel tempo.
              </p>
              <p>
                Il mio approccio si basa su tre pilastri: <strong className="text-foreground">personalizzazione</strong>, perché ogni persona ha esigenze uniche; <strong className="text-foreground">flessibilità</strong>, perché il percorso deve adattarsi alla vita reale; ed <strong className="text-foreground">educazione</strong>, per renderti gradualmente più autonomo nelle scelte alimentari quotidiane.
              </p>
              <p>
                Insieme costruiamo un percorso che non sia una dieta temporanea o un insieme di divieti, ma un modo più consapevole, sostenibile e piacevole di prenderti cura della tua salute. L'obiettivo è trovare un equilibrio che possa accompagnarti a lungo, rispettando il tuo corpo, i tuoi gusti e i tuoi obiettivi.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
