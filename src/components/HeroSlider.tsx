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
  { image: hero1, title: "Where Dreams Come True", subtitle: "Celebrate your special day at A.R Grand" },
  { image: hero2, title: "Elegant Celebrations", subtitle: "Stunning décor and world-class hospitality" },
  { image: hero3, title: "Grand Wedding Halls", subtitle: "Spacious seating with beautiful stage settings" },
  { image: hero4, title: "Unforgettable Moments", subtitle: "Capacity for 50 to 250 guests" },
  { image: hero5, title: "Premium Ambience", subtitle: "Fully air-conditioned with elegant interiors" },
];

const HeroSlider = () => {
  const [loaded, setLoaded] = useState<boolean[]>(() => slides.map(() => false));

  return (
    <section className="relative h-screen w-full overflow-hidden bg-muted hero-swiper">
      {!loaded.some(Boolean) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-muted">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      )}
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        className="h-full w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
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
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="animate-fade-in">
                  <h1 className="heading-xl text-primary-foreground mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-body text-primary-foreground/90 text-lg md:text-xl mb-8 drop-shadow">
                    {slide.subtitle}
                  </p>
                  <Link
                    to="/enquiry"
                    className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                  >
                    Book Your Venue
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/30 backdrop-blur-sm p-2 rounded-full text-primary-foreground hover:bg-background/50 transition" aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <button className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/30 backdrop-blur-sm p-2 rounded-full text-primary-foreground hover:bg-background/50 transition" aria-label="Next">
        <ChevronRight size={24} />
      </button>
    </section>
  );
};

export default HeroSlider;
