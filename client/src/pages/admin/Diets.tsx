import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Plus, Edit, Trash2, Upload } from "lucide-react";

export default function DietsManagement() {
  const utils = trpc.useUtils();
  
  // @ts-ignore - diets router exists but types not yet regenerated
  const { data: allDiets, isLoading } = trpc.diets.listAll.useQuery();
  
  // @ts-ignore
  const { data: allUsers, isLoading: usersLoading } = trpc.diets.listUsers.useQuery();
  
  // @ts-ignore
  const createOrUpdateDiet = trpc.diets.createOrUpdate.useMutation({
    onSuccess: () => {
      toast.success("Dieta salvata con successo");
      // @ts-ignore
      utils.diets.listAll.invalidate();
      // @ts-ignore
      utils.diets.getMyDiet.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Errore nel salvataggio della dieta");
      console.error(error);
    },
  });

  // @ts-ignore
  const deleteDiet = trpc.diets.delete.useMutation({
    onSuccess: () => {
      toast.success("Dieta eliminata con successo");
      // @ts-ignore
      utils.diets.listAll.invalidate();
      // @ts-ignore
      utils.diets.getMyDiet.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione della dieta");
      console.error(error);
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    pdfFile: null as File | null,
  });

  const resetForm = () => {
    setFormData({
      userId: "",
      title: "",
      pdfFile: null,
    });
    setSelectedDiet(null);
  };

  const handleOpenDialog = (diet?: any) => {
    if (diet) {
      setSelectedDiet(diet);
      setFormData({
        userId: diet.userId.toString(),
        title: diet.title,
        pdfFile: null,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verifica che sia un PDF
      if (file.type !== "application/pdf") {
        toast.error("Per favore carica solo file PDF");
        return;
      }
      
      // Verifica dimensione massima 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Il file è troppo grande. Massimo 10MB");
        return;
      }
      
      setFormData({ ...formData, pdfFile: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.title) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    // Se stiamo modificando e non c'è un nuovo file, non serve upload
    if (selectedDiet && !formData.pdfFile) {
      createOrUpdateDiet.mutate({
        userId: parseInt(formData.userId),
        title: formData.title,
        pdfUrl: selectedDiet.pdfUrl,
        fileKey: selectedDiet.fileKey,
        fileName: selectedDiet.fileName,
        fileSize: selectedDiet.fileSize,
      });
      return;
    }

    if (!formData.pdfFile) {
      toast.error("Carica il file PDF della dieta");
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload PDF su S3 tramite tRPC
      const fileBuffer = await formData.pdfFile.arrayBuffer();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileKey = `diets/${formData.userId}-${randomSuffix}.pdf`;
      
      // @ts-ignore
      const { url } = await utils.client.storage.upload.mutate({
        key: fileKey,
        data: Array.from(new Uint8Array(fileBuffer)),
        contentType: "application/pdf",
      });

      // Salva nel database
      createOrUpdateDiet.mutate({
        userId: parseInt(formData.userId),
        title: formData.title,
        pdfUrl: url,
        fileKey: fileKey,
        fileName: formData.pdfFile.name,
        fileSize: formData.pdfFile.size,
      });
    } catch (error) {
      console.error("Errore upload:", error);
      toast.error("Errore durante l'upload del file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questa dieta?")) {
      deleteDiet.mutate({ userId });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Filtra le diete in base alla ricerca
  const filteredDiets = allDiets?.filter((diet: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const userName = diet.userName?.toLowerCase() || "";
    const userEmail = diet.userEmail?.toLowerCase() || "";
    const userId = diet.userId.toString();
    return userName.includes(query) || userEmail.includes(query) || userId.includes(query);
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestione Diete</h1>
        <p className="text-muted-foreground mt-2">
          Carica e gestisci le diete personalizzate in formato PDF per i tuoi pazienti
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Diete dei Pazienti</CardTitle>
            <CardDescription>
              {searchQuery ? `${filteredDiets.length} di ${allDiets?.length || 0}` : `${allDiets?.length || 0}`} diete {searchQuery ? "trovate" : "caricate"}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nuova Dieta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedDiet ? "Modifica Dieta" : "Carica Nuova Dieta"}
                </DialogTitle>
                <DialogDescription>
                  Carica il file PDF della dieta personalizzata per il paziente
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">
                    Seleziona Paziente *
                  </Label>
                  <Select
                    value={formData.userId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, userId: value })
                    }
                    disabled={selectedDiet !== null}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Cerca per nome o email..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {usersLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">Caricamento...</div>
                      ) : allUsers && allUsers.length > 0 ? (
                        allUsers
                          .filter((user: any) => user.role !== 'admin')
                          .map((user: any) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name || `Utente ${user.id}`}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </SelectItem>
                          ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">Nessun paziente trovato</div>
                      )}
                    </SelectContent>
                  </Select>
                  {selectedDiet && (
                    <p className="text-xs text-muted-foreground">
                      Non puoi cambiare il paziente durante la modifica
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Titolo della Dieta *
                  </Label>
                  <Input
                    id="title"
                    placeholder="es. Dieta Personalizzata - Gennaio 2025"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdfFile">
                    File PDF della Dieta {selectedDiet ? "" : "*"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pdfFile"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {formData.pdfFile && (
                    <p className="text-sm text-muted-foreground">
                      File selezionato: {formData.pdfFile.name} ({formatFileSize(formData.pdfFile.size)})
                    </p>
                  )}
                  {selectedDiet && !formData.pdfFile && (
                    <p className="text-sm text-muted-foreground">
                      File attuale: {selectedDiet.fileName} ({formatFileSize(selectedDiet.fileSize)})
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Formato: PDF | Dimensione massima: 10MB
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    disabled={createOrUpdateDiet.isPending || isUploading}
                  >
                    {isUploading ? "Caricamento..." : createOrUpdateDiet.isPending ? "Salvataggio..." : "Salva Dieta"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {/* Campo di Ricerca */}
          {allDiets && allDiets.length > 0 && (
            <div className="mb-6">
              <Input
                placeholder="Cerca per nome, email o ID paziente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : !allDiets || allDiets.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Nessuna dieta caricata ancora
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Carica la Prima Dieta
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paziente</TableHead>
                    <TableHead>Titolo</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Data Aggiornamento</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nessuna dieta trovata con i criteri di ricerca
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDiets.map((diet: any) => (
                    <TableRow key={diet.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold">{diet.userName || `Utente ${diet.userId}`}</span>
                          <span className="text-xs text-muted-foreground">{diet.userEmail || `ID: ${diet.userId}`}</span>
                        </div>
                      </TableCell>
                      <TableCell>{diet.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{diet.fileName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(diet.fileSize)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(diet.updatedAt).toLocaleDateString('it-IT')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(diet.pdfUrl, '_blank')}
                            title="Visualizza PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(diet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(diet.userId)}
                            disabled={deleteDiet.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
