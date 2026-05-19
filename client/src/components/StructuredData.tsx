import { useEffect } from "react";

interface StructuredDataProps {
  type: "LocalBusiness" | "Person" | "Service";
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    let structuredData: any = {};

    if (type === "LocalBusiness") {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Dietitian",
        "name": "Dott.ssa Arianna Pelliccioni - Dietista",
        "image": "https://ariannapelliccionidietista.it/logo-512.png",
        "url": "https://ariannapelliccionidietista.it",
        "telephone": "+39-XXX-XXXXXXX",
        "email": "pelliccioniarianna.dietista@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Perugia",
          "addressRegion": "PG",
          "addressCountry": "IT"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 43.1107,
          "longitude": 12.3908
        },
        "priceRange": "€€",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        ],
        "sameAs": [
          "https://www.instagram.com/arianna_pelliccionidietista"
        ]
      };
    } else if (type === "Person") {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Arianna Pelliccioni",
        "jobTitle": "Dietista",
        "description": "Dietista laureata presso l'Università degli Studi di Siena, specializzata in nutrizione personalizzata e benessere",
        "url": "https://ariannapelliccionidietista.it/chi-sono",
        "image": "https://ariannapelliccionidietista.it/logo-512.png",
        "email": "pelliccioniarianna.dietista@gmail.com",
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Università degli Studi di Siena"
        },
        "knowsAbout": ["Nutrizione", "Dietologia", "Alimentazione sana", "Benessere"],
        "sameAs": [
          "https://www.instagram.com/arianna_pelliccionidietista"
        ]
      };
    } else if (type === "Service" && data) {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Consulenza Nutrizionale",
        "provider": {
          "@type": "Dietitian",
          "name": "Dott.ssa Arianna Pelliccioni"
        },
        "areaServed": {
          "@type": "City",
          "name": "Perugia"
        },
        ...data
      };
    }

    // Add or update script tag
    let script = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Cleanup on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [type, data]);

  return null;
}
