import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Sun, Moon, Calculator, ClipboardList, Calendar, CheckCircle, Clock, Phone } from "lucide-react";

// Mappa stato consulenza → etichetta e colore badge
const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending_verification: { label: "In attesa di verifica", variant: "outline" },
  new: { label: "Ricevuta", variant: "secondary" },
  contacted: { label: "Contattata", variant: "default" },
  scheduled: { label: "Appuntamento fissato", variant: "default" },
  completed: { label: "Completata", variant: "default" },
};

const statusIcon: Record<string, React.ReactElement> = {
  pending_verification: <Clock className="w-4 h-4 text-yellow-500" />,
  new: <ClipboardList className="w-4 h-4 text-blue-500" />,
  contacted: <Phone className="w-4 h-4 text-green-500" />,
  scheduled: <Calendar className="w-4 h-4 text-purple-500" />,
  completed: <CheckCircle className="w-4 h-4 text-green-600" />,
};

export default function UserDashboard() {
  const { user } = useAuth();
  const { theme, toggleTheme, switchable } = useTheme();

  // BMI state
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  // Consulenze utente
  const { data: consultations, isLoading: loadingConsultations } = trpc.consultations.getMyConsultations.useQuery();

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h || h <= 0) return;
    const value = w / (h * h);
    setBmi(parseFloat(value.toFixed(1)));
    if (value < 18.5) setBmiCategory("Sottopeso");
    else if (value < 25) setBmiCategory("Normopeso");
    else if (value < 30) setBmiCategory("Sovrappeso");
    else setBmiCategory("Obesità");
  };

  const getBmiColor = () => {
    if (!bmi) return "text-foreground";
    if (bmi < 18.5) return "text-blue-500";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-500";
    return "text-red-500";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Accesso richiesto.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-8">

        {/* Header benvenuto */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Benvenuta, {user.name || user.email?.split("@")[0] || "Utente"}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Stato Consulenze */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Le Mie Richieste di Consulenza
            </CardTitle>
            <CardDescription>
              Monitora lo stato delle tue richieste inviate alla Dottoressa Pelliccioni
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingConsultations ? (
              <p className="text-sm text-muted-foreground">Caricamento...</p>
            ) : !consultations || consultations.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-muted-foreground text-sm">
                  Non hai ancora inviato nessuna richiesta di consulenza.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/prenota">Richiedi una Consulenza</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {statusIcon[c.status] ?? <ClipboardList className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Richiesta del {new Date(c.createdAt).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {c.goal && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Obiettivo: {c.goal}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={statusMap[c.status]?.variant ?? "outline"} className="shrink-0 text-xs">
                      {statusMap[c.status]?.label ?? c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calcolatore BMI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Calcolatore BMI
            </CardTitle>
            <CardDescription>
              Calcola il tuo Indice di Massa Corporea
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="es. 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="es. 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={calculateBmi} className="w-full">
              Calcola BMI
            </Button>
            {bmi !== null && (
              <div className="mt-4 p-4 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground mb-1">Il tuo BMI</p>
                <p className={`text-4xl font-bold ${getBmiColor()}`}>{bmi}</p>
                <p className={`text-sm font-medium mt-1 ${getBmiColor()}`}>{bmiCategory}</p>
                <Separator className="my-3" />
                <div className="grid grid-cols-4 gap-1 text-xs text-muted-foreground">
                  <div className="text-blue-500">
                    <p className="font-semibold">Sottopeso</p>
                    <p>&lt; 18.5</p>
                  </div>
                  <div className="text-green-600">
                    <p className="font-semibold">Normopeso</p>
                    <p>18.5 – 24.9</p>
                  </div>
                  <div className="text-yellow-500">
                    <p className="font-semibold">Sovrappeso</p>
                    <p>25 – 29.9</p>
                  </div>
                  <div className="text-red-500">
                    <p className="font-semibold">Obesità</p>
                    <p>≥ 30</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tema del sito */}
        {switchable && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                Tema del Sito
              </CardTitle>
              <CardDescription>
                Scegli la modalità di visualizzazione preferita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (theme !== "light" && toggleTheme) toggleTheme();
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                    theme === "light"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-sm font-medium">Chiaro</span>
                </button>
                <button
                  onClick={() => {
                    if (theme !== "dark" && toggleTheme) toggleTheme();
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                    theme === "dark"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-sm font-medium">Scuro</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
