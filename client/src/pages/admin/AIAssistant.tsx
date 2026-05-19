import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles, FileText, UtensilsCrossed, Lightbulb, Copy, Check } from "lucide-react";
import { Streamdown } from "streamdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState("article");
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const generateMutation = trpc.blog.generateContent.useMutation({
    onSuccess: (data) => {
      const content = typeof data.content === 'string' ? data.content : '';
      setGeneratedContent(content);
      toast.success("Contenuto generato con successo!");
    },
    onError: (error) => {
      toast.error("Errore nella generazione", { description: error.message });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Inserisci una descrizione");
      return;
    }

    generateMutation.mutate({
      topic: prompt,
      style: activeTab,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success("Contenuto copiato negli appunti");
    setTimeout(() => setCopied(false), 2000);
  };

  const templates = {
    article: [
      "Benefici della dieta mediterranea per la salute cardiovascolare",
      "Come gestire il peso durante le festività",
      "L'importanza dell'idratazione per il benessere",
      "Alimentazione e sistema immunitario: cosa mangiare",
      "Miti da sfatare sulla nutrizione moderna",
    ],
    recipe: [
      "Insalata di quinoa con verdure di stagione",
      "Smoothie energetico per la colazione",
      "Zuppa di legumi e cereali integrali",
      "Salmone al forno con contorno di broccoli",
      "Energy balls con frutta secca e datteri",
    ],
    tips: [
      "5 consigli per una spesa alimentare consapevole",
      "Come leggere le etichette nutrizionali",
      "Strategie per aumentare il consumo di verdure",
      "Gestire gli spuntini in modo salutare",
      "Pianificare i pasti settimanali",
    ],
  };

  const tabConfig = {
    article: {
      icon: FileText,
      title: "Articolo Educativo",
      description: "Genera articoli informativi e scientificamente accurati su nutrizione e benessere",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    recipe: {
      icon: UtensilsCrossed,
      title: "Ricetta Salutare",
      description: "Crea ricette bilanciate con ingredienti, procedimento e valori nutrizionali",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    tips: {
      icon: Lightbulb,
      title: "Consigli Nutrizionali",
      description: "Genera consigli pratici e applicabili per migliorare l'alimentazione quotidiana",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assistente AI</h1>
          <p className="text-muted-foreground">
            Genera contenuti educativi, ricette e consigli nutrizionali con l'intelligenza artificiale
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {Object.entries(tabConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  activeTab === key
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => setActiveTab(key)}
              >
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg ${config.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <CardTitle className="text-lg">{config.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Genera {tabConfig[activeTab as keyof typeof tabConfig].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Descrivi cosa vuoi generare</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder={`Es: ${templates[activeTab as keyof typeof templates][0]}`}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Suggerimenti rapidi</Label>
              <div className="flex flex-wrap gap-2">
                {templates[activeTab as keyof typeof templates].map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(template)}
                    className="text-xs"
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {generateMutation.isPending ? "Generazione in corso..." : "Genera Contenuto"}
            </Button>

            {generatedContent && (
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Contenuto Generato</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copiato
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copia
                      </>
                    )}
                  </Button>
                </div>
                <Card className="bg-muted/30">
                  <CardContent className="p-6">
                    <div className="prose prose-sm max-w-none">
                      <Streamdown>{generatedContent}</Streamdown>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  💡 Puoi copiare questo contenuto e utilizzarlo per creare un nuovo articolo nel blog
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">💡 Suggerimenti per risultati migliori</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Sii specifico nella descrizione: più dettagli fornisci, migliore sarà il risultato</li>
              <li>• Per articoli: indica il target di riferimento e l'obiettivo educativo</li>
              <li>• Per ricette: specifica eventuali restrizioni alimentari o preferenze</li>
              <li>• Per consigli: indica il contesto o la problematica da affrontare</li>
              <li>• Rivedi sempre il contenuto generato prima di pubblicarlo</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
