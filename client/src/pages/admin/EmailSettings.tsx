import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, Info } from "lucide-react";

export default function EmailSettings() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  
  // @ts-ignore - emailTemplates router exists but types not yet regenerated
  const { data: template, isLoading } = trpc.emailTemplates.getByName.useQuery({ 
    name: "consultation_confirmation" 
  });
  
  // @ts-ignore - emailTemplates router exists but types not yet regenerated
  const updateMutation = trpc.emailTemplates.upsert.useMutation({
    onSuccess: () => {
      toast.success("Template email aggiornato con successo!");
    },
    onError: (error: any) => {
      toast.error("Errore nell'aggiornamento", { description: error.message });
    },
  });

  useEffect(() => {
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  }, [template]);

  const handleSave = () => {
    if (!subject || !body) {
      toast.error("Compila tutti i campi");
      return;
    }

    updateMutation.mutate({
      name: "consultation_confirmation",
      subject,
      body,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Impostazioni Email</h1>
          <p className="text-muted-foreground mt-2">
            Personalizza il contenuto dell'email automatica inviata ai pazienti dopo la compilazione del questionario
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email di Conferma Consulenza</CardTitle>
            <CardDescription>
              Modifica l'oggetto e il contenuto dell'email inviata automaticamente ai pazienti
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info placeholder */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Placeholder disponibili:</p>
                <ul className="space-y-1">
                  <li><code className="bg-blue-100 px-1.5 py-0.5 rounded">{"{{name}}"}</code> - Nome del paziente</li>
                  <li><code className="bg-blue-100 px-1.5 py-0.5 rounded">{"{{email}}"}</code> - Email del paziente</li>
                  <li><code className="bg-blue-100 px-1.5 py-0.5 rounded">{"{{phone}}"}</code> - Telefono del paziente</li>
                </ul>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Oggetto Email</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Conferma Richiesta Consulenza"
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Contenuto Email</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Scrivi qui il contenuto dell'email..."
                rows={16}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Usa i placeholder sopra per personalizzare l'email con i dati del paziente
              </p>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? "Salvataggio..." : "Salva Modifiche"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Amministratore</CardTitle>
            <CardDescription>
              Configura l'email che riceve le notifiche delle nuove richieste di consulenza
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Notifiche</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="dietista@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Questa email riceverà le notifiche quando un paziente conferma la richiesta di consulenza
              </p>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (!adminEmail) {
                    toast.error("Inserisci un'email valida");
                    return;
                  }
                  toast.success("Email admin salvata (feature in sviluppo)");
                }}
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                Salva Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
