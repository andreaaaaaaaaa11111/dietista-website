import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Sparkles, Eye } from "lucide-react";
import { Streamdown } from "streamdown";

export default function BlogManagement() {
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.blog.listAll.useQuery();
  const { data: categories } = trpc.blog.categories.useQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    categoryId: "",
    published: false,
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiType, setAiType] = useState<"article" | "recipe" | "tips">("article");

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Articolo creato con successo");
      utils.blog.listAll.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Errore nella creazione", { description: error.message });
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Articolo aggiornato con successo");
      utils.blog.listAll.invalidate();
      setIsCreateOpen(false);
      setEditingPost(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Errore nell'aggiornamento", { description: error.message });
    },
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Articolo eliminato");
      utils.blog.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione", { description: error.message });
    },
  });

  const generateContentMutation = trpc.blog.generateContent.useMutation({
    onSuccess: (data) => {
      const content = typeof data.content === 'string' ? data.content : '';
      setFormData({ ...formData, content });
      toast.success("Contenuto generato con successo");
      setIsAIOpen(false);
    },
    onError: (error) => {
      toast.error("Errore nella generazione", { description: error.message });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      categoryId: "",
      published: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      imageUrl: post.imageUrl || "",
      categoryId: post.categoryId?.toString() || "",
      published: post.published,
    });
    setIsCreateOpen(true);
  };

  const handleGenerateContent = () => {
    generateContentMutation.mutate({
      topic: aiPrompt,
      style: aiType,
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestione Blog</h1>
            <p className="text-muted-foreground">Crea e gestisci gli articoli del blog</p>
          </div>
          <Button onClick={() => { resetForm(); setEditingPost(null); setIsCreateOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Articolo
          </Button>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt || post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            post.published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {post.published ? "Pubblicato" : "Bozza"}
                        </span>
                        {post.publishedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString("it-IT")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Sei sicuro di voler eliminare questo articolo?")) {
                            deleteMutation.mutate({ id: post.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Nessun articolo trovato</p>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Modifica Articolo" : "Nuovo Articolo"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      setFormData({ ...formData, title, slug });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Estratto</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content">Contenuto *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAIOpen(true)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Assistente AI
                  </Button>
                </div>
                <Textarea
                  id="content"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  placeholder="Scrivi il contenuto dell'articolo in Markdown..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL Immagine</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Pubblica immediatamente
                </Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingPost ? "Aggiorna" : "Crea"} Articolo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* AI Assistant Dialog */}
        <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assistente AI per Contenuti</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiType">Tipo di Contenuto</Label>
                <Select value={aiType} onValueChange={(value: any) => setAiType(value)}>
                  <SelectTrigger id="aiType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Articolo Educativo</SelectItem>
                    <SelectItem value="recipe">Ricetta Salutare</SelectItem>
                    <SelectItem value="tips">Consigli Nutrizionali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiPrompt">Descrivi cosa vuoi generare</Label>
                <Textarea
                  id="aiPrompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                  placeholder="Es: Un articolo sui benefici della dieta mediterranea..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsAIOpen(false)}>
                  Annulla
                </Button>
                <Button
                  onClick={handleGenerateContent}
                  disabled={!aiPrompt || generateContentMutation.isPending}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {generateContentMutation.isPending ? "Generazione..." : "Genera Contenuto"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
