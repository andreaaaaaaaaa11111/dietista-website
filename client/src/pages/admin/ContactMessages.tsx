import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, Phone, Calendar, Eye, Trash2, CheckCircle, MessageSquare, Loader2 } from "lucide-react";

export default function ContactMessages() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: messages, isLoading, refetch } = trpc.contact.list.useQuery();
  
  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Stato aggiornato");
      refetch();
    },
    onError: (error) => {
      toast.error("Errore nell'aggiornamento", { description: error.message });
    },
  });

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success("Messaggio eliminato");
      refetch();
      setDetailsOpen(false);
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione", { description: error.message });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-500">Nuovo</Badge>;
      case "read":
        return <Badge variant="secondary">Letto</Badge>;
      case "replied":
        return <Badge variant="outline" className="border-green-500 text-green-600">Risposto</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (message: any) => {
    setSelectedMessage(message);
    setDetailsOpen(true);
    if (message.status === "new") {
      updateStatusMutation.mutate({ id: message.id, status: "read" });
    }
  };

  const handleMarkAsReplied = (id: number) => {
    updateStatusMutation.mutate({ id, status: "replied" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Sei sicuro di voler eliminare questo messaggio?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/65 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Comunicazioni</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Messaggi di Contatto</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Gestisci i messaggi ricevuti dal form di contatto
            </p>
          </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800">
            {messages?.filter((m: any) => m.status === "new").length || 0} nuovi
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Tutti i Messaggi ({messages?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages && messages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Tipo Consulenza</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Stato</TableHead>
                  <TableHead className="text-right font-semibold">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message: any) => (
                  <TableRow key={message.id} className={`hover:bg-muted/50 transition-colors ${
                    message.status === "new" ? "bg-blue-50/50 border-l-4 border-blue-500" : ""
                  }`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {message.status === "new" && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                        {message.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{message.email}</TableCell>
                    <TableCell className="text-sm">{message.consultationType || "-"}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(message.createdAt).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Visualizza dettagli"
                          onClick={() => handleViewDetails(message)}
                          className="hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {message.status !== "replied" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Segna come risposto"
                            onClick={() => handleMarkAsReplied(message.id)}
                            className="hover:bg-green-100"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Elimina messaggio"
                          onClick={() => handleDelete(message.id)}
                          className="hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nessun messaggio di contatto ricevuto</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Dettagli Messaggio */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dettagli Messaggio</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stato</p>
                  {getStatusBadge(selectedMessage.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              {selectedMessage.consultationType && (
                <div>
                  <p className="text-sm text-muted-foreground">Tipo Consulenza</p>
                  <p>{selectedMessage.consultationType}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Messaggio</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Ricevuto il {new Date(selectedMessage.createdAt).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedMessage.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Elimina
                </Button>
                <div className="flex gap-2">
                  {selectedMessage.status !== "replied" && (
                    <Button
                      variant="outline"
                      onClick={() => handleMarkAsReplied(selectedMessage.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Segna come Risposto
                    </Button>
                  )}
                  <Button asChild>
                    <a href={`mailto:${selectedMessage.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Rispondi via Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </AdminLayout>
  );
}
