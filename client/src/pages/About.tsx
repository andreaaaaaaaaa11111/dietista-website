import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Heart, Target } from "lucide-react";
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Chi Sono</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Sono Arianna Pelliccioni, Dietista Laureata presso l'Università degli Studi di Siena. La mia missione, sin dai primi anni di Università, è stata aiutare i miei pazienti a raggiungere i loro obbiettivi di salute sostenendoli attraverso un approccio nutrizionale personalizzato, scientifico e soprattutto flessibile!
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Credo fermamente che ogni paziente esprima delle necessità e dei bisogni unici e necessiti quindi di un piano nutrizionale studiato sulle proprie esigenze specifiche, stile di vita e obiettivi personali. Non esistono diete universali, ma percorsi personalizzati verso il benessere!
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663236549894/ZvkScbyffEuXkoBy.JPG" 
              alt="Dott.ssa Arianna Pelliccioni - Dietista Professionista"
              className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Formazione e Certificazioni */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Formazione e Certificazioni</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Laurea in Dietistica</h3>
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
                    <h3 className="font-semibold text-lg mb-2">Iscrizione Albo Professionale</h3>
                    <p className="text-muted-foreground">
                      Ordine TSRM PSTRP - Sezione Dietisti
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">N. 123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Approccio Metodologico */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Il Mio Approccio</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Ascolto Empatico</h3>
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
                <h3 className="font-semibold text-xl mb-3">Evidenze Scientifiche</h3>
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
                <h3 className="font-semibold text-xl mb-3">Risultati Sostenibili</h3>
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
            <h2 className="text-3xl font-bold mb-6 text-center">La Mia Filosofia</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Credo che l'alimentazione non debba essere vissuta come una privazione, 
                ma come un atto di cura verso se stessi. Il cibo è nutrimento per il corpo 
                e per la mente, e deve portare gioia e benessere.
              </p>
              <p>
                Il mio approccio si basa su tre pilastri fondamentali: <strong className="text-foreground">personalizzazione</strong>, 
                perché ogni persona ha esigenze uniche; <strong className="text-foreground">flessibilità</strong>, 
                per adattarsi al tuo stile di vita; e <strong className="text-foreground">educazione</strong>, 
                per renderti autonomo nelle scelte alimentari quotidiane.
              </p>
              <p>
                Insieme costruiremo un percorso che non sia solo una dieta temporanea, 
                ma un vero e proprio cambiamento di stile di vita, sostenibile e piacevole 
                nel lungo termine.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
