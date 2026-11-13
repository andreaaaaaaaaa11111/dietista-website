import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/studio-visita.jpeg", alt: "Lo studio: lettino per la visita e strumenti di valutazione" },
  { src: "/studio-consulenza.jpeg", alt: "Lo spazio dedicato alle consulenze nutrizionali" },
  { src: "/arianna-studio.jpeg", alt: "La Dottoressa Arianna Pelliccioni nel suo studio" },
];

export default function StudioCarousel() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (!motion.matches && !document.hidden && !interacting) {
        setActive(index => (index + 1) % slides.length);
      }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [interacting]);

  return (
    <section aria-label="Foto dello studio" aria-roledescription="carosello"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
      className="relative aspect-[4/5] max-h-[680px] overflow-hidden rounded-2xl shadow-lg">
      {slides.map((slide, index) => (
        <img key={slide.src} src={slide.src} alt={slide.alt} aria-hidden={index !== active}
          fetchPriority={index === 0 ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`} />
      ))}
      <button type="button" aria-label="Foto precedente" onClick={() => setActive((active + slides.length - 1) % slides.length)}
        className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow focus-visible:outline-2">
        <ChevronLeft aria-hidden="true" />
      </button>
      <button type="button" aria-label="Foto successiva" onClick={() => setActive((active + 1) % slides.length)}
        className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow focus-visible:outline-2">
        <ChevronRight aria-hidden="true" />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 rounded-full bg-black/35 px-2">
        {slides.map((slide, index) => (
          <button key={slide.src} type="button" aria-label={`Mostra foto ${index + 1}`} aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)} className="grid h-10 w-10 place-items-center">
            <span className={`h-2.5 rounded-full transition-all ${index === active ? "w-6 bg-white" : "w-2.5 bg-white/60"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
