import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  { image: hero1, eyebrow: "A.R Grand · Kodungaiyur", title: "Where Dreams Come True", subtitle: "Celebrate your special day in timeless elegance" },
  { image: hero2, eyebrow: "Signature Celebrations", title: "Elegant Moments, Crafted", subtitle: "Stunning décor and world-class hospitality" },
  { image: hero3, eyebrow: "Grand Wedding Halls", title: "A Stage For Forever", subtitle: "Spacious seating with breathtaking stage settings" },
  { image: hero4, eyebrow: "Intimate to Grand", title: "Unforgettable Moments", subtitle: "Capacity for 50 to 250 distinguished guests" },
  { image: hero5, eyebrow: "Premium Ambience", title: "Refined Interiors", subtitle: "Fully air-conditioned with bespoke detailing" },
];

const HeroSlider = () => {
  const [loaded, setLoaded] = useState<boolean[]>(() => slides.map(() => false));

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-noir hero-swiper">
      {!loaded.some(Boolean) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-noir">
          <Loader2 className="animate-spin text-accent" size={48} />
        </div>
      )}
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        loop
        speed={1400}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        className="h-full w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full overflow-hidden">
              <div className="absolute inset-0 animate-ken-burns">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
                  onLoad={() => setLoaded((prev) => { const n = [...prev]; n[i] = true; return n; })}
                  {...(i === 0 ? {} : { loading: "lazy" as const })}
                />
              </div>
              {/* Cinematic overlays */}
              <div className="absolute inset-0" style={{ background: "var(--gradient-hero-overlay)" }} />
              <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />

              <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
                <div className="max-w-3xl">
                  <p className="eyebrow text-accent/90 mb-6 animate-fade-up">{slide.eyebrow}</p>
                  <span className="gold-divider mb-6 animate-fade-up delay-100" />
                  <h1 className="heading-xl text-cream mb-6 animate-fade-up delay-200 drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-body text-cream/85 text-lg md:text-xl mb-10 animate-fade-up delay-300 max-w-xl mx-auto">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center animate-fade-up delay-500">
                    <Link to="/enquiry" className="btn-gold">Book Your Venue</Link>
                    <Link to="/gallery" className="btn-outline-gold !text-cream !border-cream/60 hover:!bg-cream hover:!text-noir">
                      View Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="hero-prev hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full border border-cream/30 text-cream backdrop-blur-sm hover:bg-cream hover:text-noir transition-all duration-500" aria-label="Previous">
        <ChevronLeft size={22} />
      </button>
      <button className="hero-next hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full border border-cream/30 text-cream backdrop-blur-sm hover:bg-cream hover:text-noir transition-all duration-500" aria-label="Next">
        <ChevronRight size={22} />
      </button>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="flex flex-col items-center gap-2 text-cream/70">
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-cream/70 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
