import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Calendar, ArrowLeft, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function BlogPost() {
  const { user } = useAuth();
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // @ts-ignore - blogLikes router exists but types not yet regenerated
  const { data: likedPosts } = trpc.blogLikes.myLikes.useQuery(undefined, { enabled: !!user });
  // @ts-ignore
  const { data: savedPostIds } = trpc.savedPosts.mySavedIds.useQuery(undefined, { enabled: !!user });
  
  // @ts-ignore
  const toggleLike = trpc.blogLikes.toggle.useMutation({
    onSuccess: (data: any) => {
      toast.success(data.liked ? "Articolo aggiunto ai preferiti" : "Articolo rimosso dai preferiti");
      // @ts-ignore
      trpc.useUtils().blogLikes.myLikes.invalidate();
    },
  });

  // @ts-ignore
  const toggleSave = trpc.savedPosts.toggle.useMutation({
    onSuccess: (data: any) => {
      toast.success(data.saved ? "Articolo salvato" : "Articolo rimosso");
      // @ts-ignore
      trpc.useUtils().savedPosts.mySavedIds.invalidate();
      // @ts-ignore
      trpc.useUtils().savedPosts.mySaved.invalidate();
    },
  });

  const isLiked = post && likedPosts?.includes(post.id);
  const isSaved = post && savedPostIds?.includes(post.id);

  const handleLike = () => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (post) {
      toggleLike.mutate({ postId: post.id });
    }
  };

  const handleSave = () => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (post) {
      toggleSave.mutate({ postId: post.id });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-20">
        <div className="container max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4">Articolo non trovato</h1>
          <p className="text-muted-foreground mb-8">
            L'articolo che stai cercando non esiste o non è più disponibile.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-4xl">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna al Blog
          </Button>
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Data non disponibile"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}
            
            {/* Like and Save Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                disabled={toggleLike.isPending}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Ti piace" : "Mi piace"}
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
                disabled={toggleSave.isPending}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Salvato" : "Salva"}
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <img
                loading="lazy"
                decoding="async"
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto gpu-accelerated"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <Streamdown>{post.content}</Streamdown>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-16 p-8 bg-muted/30 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">
            Vuoi un piano alimentare personalizzato?
          </h3>
          <p className="text-muted-foreground mb-6">
            Prenota una consulenza per iniziare il tuo percorso verso il benessere
          </p>
          <Link href="/prenota">
            <Button size="lg">Prenota Consulenza</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

