import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export default function SEO({
  title = "Dietista Arianna Pelliccioni - Nutrizione Personalizzata Perugia",
  description = "Consulenza nutrizionale personalizzata con la Dott.ssa Arianna Pelliccioni, dietista specializzata a Perugia. Piani alimentari su misura per il tuo benessere.",
  keywords = "dietista Perugia, nutrizione personalizzata, consulenza nutrizionale, dieta personalizzata, dietologo Perugia, alimentazione sana",
  ogImage = "https://ariannapelliccionidietista.it/logo-512.png",
  canonical,
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set or update meta tags
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute("content", content);
    };

    // Standard meta tags
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);

    // Open Graph tags
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", ogImage, true);
    setMetaTag("og:type", "website", true);

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImage);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [title, description, keywords, ogImage, canonical]);

  return null;
}
