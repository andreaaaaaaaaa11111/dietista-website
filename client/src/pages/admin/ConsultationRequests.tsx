import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Mail, Phone, User, Calendar, Weight, Ruler, Target, AlertCircle, Apple, Utensils, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConsultationRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const utils = trpc.useUtils();

  const { data: requests, isLoading } = trpc.consultations.listAll.useQuery();

  const updateStatusMutation = trpc.consultations.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Stato aggiornato");
      utils.consultations.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore", { description: error.message });
    },
  });

  const deleteMutation = trpc.consultations.delete.useMutation({
    onSuccess: () => {
      toast.success("Richiesta eliminata");
      utils.consultations.listAll.invalidate();
      setSelectedRequest(null);
    },
    onError: (error) => {
      toast.error("Errore", { description: error.message });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      new: { variant: "default", label: "Nuova" },
      contacted: { variant: "secondary", label: "Contattato" },
      scheduled: { variant: "outline", label: "Programmato" },
      completed: { variant: "secondary", label: "Completato" },
    };
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Richieste di Consulenza</h1>
          <p className="text-muted-foreground">Gestisci le richieste ricevute tramite il questionario</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
          </div>
        ) : !requests || requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Nessuna richiesta di consulenza ricevuta</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request: any) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {request.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {request.email}
                        </span>
                        {request.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {request.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        Dettagli
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {request.age && (
                      <div>
                        <span className="text-muted-foreground">Età:</span>
                        <span className="ml-2 font-medium">{request.age} anni</span>
                      </div>
                    )}
                    {request.weight && (
                      <div className="flex items-center gap-1">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{request.weight} kg</span>
                      </div>
                    )}
                    {request.height && (
                      <div className="flex items-center gap-1">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{request.height} cm</span>
                      </div>
                    )}
                    <div>
                      <Calendar className="h-4 w-4 inline mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs">
                        {new Date(request.createdAt).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                  </div>
                  {request.goal && (
                    <div className="mt-4 p-3 bg-sage-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-sage-600 mt-0.5" />
                        <div>
                          <span className="text-xs font-medium text-sage-700">Obiettivo:</span>
                          <p className="text-sm mt-1">{request.goal}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog Dettagli */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Dettagli Richiesta</DialogTitle>
            <DialogDescription>
              Richiesta ricevuta il {selectedRequest && new Date(selectedRequest.createdAt).toLocaleDateString('it-IT', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Stato */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Stato</label>
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) => {
                    updateStatusMutation.mutate({
                      id: selectedRequest.id,
                      status: value as any,
                    });
                    setSelectedRequest({ ...selectedRequest, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuova</SelectItem>
                    <SelectItem value="contacted">Contattato</SelectItem>
                    <SelectItem value="scheduled">Programmato</SelectItem>
                    <SelectItem value="completed">Completato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dati Personali */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Dati Personali</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium mt-1">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium mt-1">{selectedRequest.email}</p>
                  </div>
                  {selectedRequest.phone && (
                    <div>
                      <span className="text-muted-foreground">Telefono:</span>
                      <p className="font-medium mt-1">{selectedRequest.phone}</p>
                    </div>
                  )}
                  {selectedRequest.age && (
                    <div>
                      <span className="text-muted-foreground">Età:</span>
                      <p className="font-medium mt-1">{selectedRequest.age} anni</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dati Fisici */}
              {(selectedRequest.weight || selectedRequest.height) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Dati Fisici</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {selectedRequest.weight && (
                      <div>
                        <span className="text-muted-foreground">Peso:</span>
                        <p className="font-medium mt-1">{selectedRequest.weight} kg</p>
                      </div>
                    )}
                    {selectedRequest.height && (
                      <div>
                        <span className="text-muted-foreground">Altezza:</span>
                        <p className="font-medium mt-1">{selectedRequest.height} cm</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informazioni Nutrizionali */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold">Informazioni Nutrizionali</h3>
                
                {selectedRequest.goal && (
                  <div className="p-4 bg-sage-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-sage-600 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-sage-700">Obiettivo</span>
                        <p className="text-sm mt-1">{selectedRequest.goal}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.medicalConditions && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-orange-700">Condizioni Mediche</span>
                        <p className="text-sm mt-1">{selectedRequest.medicalConditions}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.allergies && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Apple className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-red-700">Allergie / Intolleranze</span>
                        <p className="text-sm mt-1">{selectedRequest.allergies}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.currentDiet && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Utensils className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-blue-700">Alimentazione Attuale</span>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{selectedRequest.currentDiet}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.message && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Note Aggiuntive</span>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{selectedRequest.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Azioni */}
              <div className="border-t pt-4 flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Sei sicuro di voler eliminare questa richiesta?")) {
                      deleteMutation.mutate({ id: selectedRequest.id });
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Elimina"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Chiudi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
