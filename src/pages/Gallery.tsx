import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";
import gallery10 from "@/assets/gallery-10.jpg";

const images = [
  { src: gallery1, alt: "A.R Grand Marriage Hall Aerial Exterior View" },
  { src: gallery2, alt: "Elegant Wedding Stage Decoration with Floral Arch" },
  { src: gallery3, alt: "Close-up of Bridal Stage with Floral Arrangements" },
  { src: gallery4, alt: "Grand Entrance with Traditional Floral Garlands" },
  { src: gallery5, alt: "Hall Front View with Stage and Seating" },
  { src: gallery6, alt: "Hall Back View with Full Seating Arrangement" },
  { src: gallery7, alt: "Hall Side View with Stage and Seated Layout" },
  { src: gallery8, alt: "Spacious Hall Interior with Decorated Seating" },
  { src: gallery9, alt: "Wide Hall View Showcasing Capacity and Decor" },
  { src: gallery10, alt: "Lift and Staircase Access to Marriage Hall" },
];

const Gallery = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  return (
    <div className="pt-20">
      <section className="section-padding max-w-7xl mx-auto">
        <h1 className="heading-xl text-center text-foreground mb-4">Our Gallery</h1>
        <p className="text-body text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore the elegance and grandeur of A.R Grand through our photo gallery.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group cursor-pointer text-left"
            >
              <div className="relative w-full h-64 bg-muted">
                {!loaded[i] && <Skeleton className="absolute inset-0 w-full h-full" />}
                <img
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
                  className={`w-full h-64 object-cover group-hover:scale-105 transition-all duration-500 ${loaded[i] ? "opacity-100" : "opacity-0"}`}
                />
              </div>
              <div className="p-3 bg-card">
                <p className="font-body text-sm text-muted-foreground">{img.alt}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 text-primary-foreground hover:opacity-80"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <div className="relative">
            {!loaded[selected] && (
              <Loader2 className="absolute inset-0 m-auto animate-spin text-primary-foreground" size={48} />
            )}
            <img
              src={images[selected].src}
              alt={images[selected].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
