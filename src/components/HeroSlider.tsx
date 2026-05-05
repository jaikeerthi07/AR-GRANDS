import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { Link } from "react-router-dom";

const slides = [
  { image: hero1, title: "Where Dreams Come True", subtitle: "Celebrate your special day at A.R Grand" },
  { image: hero2, title: "Elegant Celebrations", subtitle: "Stunning décor and world-class hospitality" },
  { image: hero3, title: "Unforgettable Moments", subtitle: "Capacity for 50 to 250 guests" },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(() => slides.map(() => false));

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-muted">
      {!loaded[current] && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-muted">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      )}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            onLoad={() => setLoaded((prev) => { const n = [...prev]; n[i] = true; return n; })}
            {...(i === 0 ? {} : { loading: "lazy" as const })}
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center text-center z-10 px-4">
        <div className="animate-fade-in">
          <h1 className="heading-xl text-primary-foreground mb-4 drop-shadow-lg">
            {slides[current].title}
          </h1>
          <p className="text-body text-primary-foreground/90 text-lg md:text-xl mb-8 drop-shadow">
            {slides[current].subtitle}
          </p>
          <Link
            to="/enquiry"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            Book Your Venue
          </Link>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/30 backdrop-blur-sm p-2 rounded-full text-primary-foreground hover:bg-background/50 transition" aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/30 backdrop-blur-sm p-2 rounded-full text-primary-foreground hover:bg-background/50 transition" aria-label="Next">
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? "bg-primary-foreground scale-125" : "bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
