import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Trash2, Eye, Mail, CheckCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConsultationRequest {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  goal: string | null;
  medicalConditions: string | null;
  allergies: string | null;
  currentDiet: string | null;
  message: string | null;
  status: "new" | "contacted" | "scheduled" | "completed" | "pending_verification";
  createdAt: Date;
  privacyConsent: boolean;
}

export default function ConsultationManagement() {
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // @ts-ignore - consultations router exists
  const { data: consultations, isLoading, refetch } = trpc.consultations.list.useQuery();

  // @ts-ignore - consultations router exists
  const deleteMutation = trpc.consultations.delete.useMutation({
    onSuccess: () => {
      toast.success("Consulenza eliminata");
      refetch();
    },
    onError: (error: any) => {
      toast.error("Errore nell'eliminazione", { description: error.message });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Sei sicuro di voler eliminare questa consulenza?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending_verification":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Nuova";
      case "contacted":
        return "Contattata";
      case "scheduled":
        return "Programmata";
      case "completed":
        return "Completata";
      case "pending_verification":
        return "In attesa verifica";
      default:
        return status;
    }
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
        <div className="rounded-[28px] border border-white/80 bg-white/65 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-7">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Pazienti</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Gestione Consulenze</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Visualizza e gestisci tutte le richieste di consulenza ricevute
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Richieste di Consulenza</CardTitle>
            <CardDescription>
              Totale: {consultations?.length || 0} richieste
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!consultations || consultations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nessuna richiesta di consulenza
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Telefono</th>
                      <th className="text-left py-3 px-4">Stato</th>
                      <th className="text-left py-3 px-4">Data</th>
                      <th className="text-right py-3 px-4">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultations.map((consultation: ConsultationRequest) => (
                      <tr key={consultation.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{consultation.name}</td>
                        <td className="py-3 px-4 text-sm">{consultation.email}</td>
                        <td className="py-3 px-4 text-sm">{consultation.phone || "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                            {getStatusLabel(consultation.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(consultation.createdAt).toLocaleDateString("it-IT")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedConsultation(consultation);
                                setShowDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(consultation.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Dettagli */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Dettagli Consulenza</DialogTitle>
            <DialogDescription>
              Informazioni complete della richiesta di consulenza
            </DialogDescription>
          </DialogHeader>

          {selectedConsultation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-lg font-semibold">{selectedConsultation.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="break-all text-lg font-semibold">{selectedConsultation.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefono</p>
                  <p className="text-lg font-semibold">{selectedConsultation.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Età</p>
                  <p className="text-lg font-semibold">{selectedConsultation.age || "-"}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Obiettivo</p>
                <p className="text-base">{selectedConsultation.goal || "Non specificato"}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Condizioni Mediche</p>
                  <p className="text-base">{selectedConsultation.medicalConditions || "Nessuna"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Allergie</p>
                  <p className="text-base">{selectedConsultation.allergies || "Nessuna"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Dieta Attuale</p>
                <p className="text-base">{selectedConsultation.currentDiet || "Non specificata"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Messaggio</p>
                <p className="text-base">{selectedConsultation.message || "Nessun messaggio"}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  Chiudi
                </Button>
                <Button
                  onClick={() => handleDelete(selectedConsultation.id)}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Elimina
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
