import { useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Star, Check, X, Trash2, Plus, Mail, Loader2 } from "lucide-react";

export default function TestimonialManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    content: "",
    rating: 5,
  });

  const utils = trpc.useUtils();
  const { data: testimonials, isLoading } = trpc.testimonials.listAll.useQuery();

  const approveMutation = trpc.testimonials.approve.useMutation({
    onSuccess: () => {
      toast.success("Recensione approvata");
      utils.testimonials.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'approvazione", { description: error.message });
    },
  });

  const rejectMutation = trpc.testimonials.reject.useMutation({
    onSuccess: () => {
      toast.success("Recensione rifiutata");
      utils.testimonials.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nel rifiuto", { description: error.message });
    },
  });

  const deleteMutation = trpc.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Recensione eliminata");
      utils.testimonials.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione", { description: error.message });
    },
  });

  const createMutation = trpc.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Recensione creata");
      utils.testimonials.listAll.invalidate();
      setIsCreateOpen(false);
      setNewTestimonial({ name: "", content: "", rating: 5 });
    },
    onError: (error) => {
      toast.error("Errore nella creazione", { description: error.message });
    },
  });

  const handleCreate = () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      toast.error("Compila tutti i campi");
      return;
    }
    createMutation.mutate(newTestimonial);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
        </div>
      </AdminLayout>
    );
  }

  const pendingCount = testimonials?.filter((t) => !t.approved).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/65 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Reputazione</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Gestione Testimonianze</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Approva, rifiuta o elimina le recensioni dei clienti
            </p>
          </div>
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <Badge variant="destructive">{pendingCount} in attesa</Badge>
            )}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-[#153927] shadow-sm hover:bg-[#153927]">
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Manualmente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuova Testimonianza</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome Cliente</label>
                    <Input
                      value={newTestimonial.name}
                      onChange={(e) =>
                        setNewTestimonial({ ...newTestimonial, name: e.target.value })
                      }
                      placeholder="Mario Rossi"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Recensione</label>
                    <Textarea
                      value={newTestimonial.content}
                      onChange={(e) =>
                        setNewTestimonial({ ...newTestimonial, content: e.target.value })
                      }
                      placeholder="Scrivi la recensione..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valutazione</label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setNewTestimonial({ ...newTestimonial, rating: star })
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newTestimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="w-full"
                  >
                    {createMutation.isPending ? "Creazione..." : "Crea Testimonianza"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tutte le Testimonianze ({testimonials?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {testimonials && testimonials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Recensione</TableHead>
                    <TableHead>Valutazione</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow
                      key={testimonial.id}
                      className={!testimonial.approved ? "bg-yellow-50/50" : ""}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          {testimonial.email && (
                            <a
                              href={`mailto:${testimonial.email}`}
                              className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary"
                            >
                              <Mail className="h-3 w-3" />
                              {testimonial.email}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2">{testimonial.content}</p>
                      </TableCell>
                      <TableCell>{renderStars(testimonial.rating)}</TableCell>
                      <TableCell>
                        {testimonial.approved ? (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            Approvata
                          </Badge>
                        ) : (
                          <Badge variant="secondary">In Attesa</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(testimonial.createdAt).toLocaleDateString("it-IT")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!testimonial.approved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => approveMutation.mutate({ id: testimonial.id })}
                              title="Approva"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {testimonial.approved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rejectMutation.mutate({ id: testimonial.id })}
                              title="Rifiuta"
                            >
                              <X className="h-4 w-4 text-orange-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Eliminare questa recensione?")) {
                                deleteMutation.mutate({ id: testimonial.id });
                              }
                            }}
                            title="Elimina"
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
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nessuna testimonianza presente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
