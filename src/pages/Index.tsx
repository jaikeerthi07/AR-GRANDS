import HeroSlider from "@/components/HeroSlider";
import { Link } from "react-router-dom";
import { Users, Calendar, Utensils, Music } from "lucide-react";
import aboutExterior from "@/assets/about-exterior.jpg";

const features = [
  { icon: Users, title: "50–250 Guests", desc: "Flexible halls for intimate gatherings to grand celebrations" },
  { icon: Calendar, title: "Easy Booking", desc: "Check availability and book your preferred date online" },
  { icon: Utensils, title: "Catering Services", desc: "Multi-cuisine catering with customizable menus" },
  { icon: Music, title: "Full Amenities", desc: "DJ, decoration, bridal room, parking and more" },
];

const Index = () => (
  <div>
    <HeroSlider />

    {/* About Section */}
    <section className="section-padding max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-body text-sm tracking-widest uppercase text-muted-foreground mb-2">Welcome to</p>
          <h2 className="heading-lg text-foreground mb-6">A.R Grand Marriage Hall</h2>
          <p className="text-body text-muted-foreground mb-4">
            Nestled in the heart of the city, A.R Grand is a premier wedding venue that blends timeless elegance with modern amenities. Our beautifully appointed halls provide the perfect backdrop for weddings, receptions, engagements, and all your special celebrations.
          </p>
          <p className="text-body text-muted-foreground mb-8">
            With over a decade of experience hosting unforgettable events, our dedicated team ensures every detail is perfect — from exquisite décor to world-class catering. Let us make your dream celebration a reality.
          </p>
          <Link to="/gallery" className="inline-block border border-primary text-primary px-6 py-3 rounded-md font-body text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
            View Gallery
          </Link>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img src={gallery1} alt="A.R Grand Exterior" width={800} height={600} loading="lazy" className="w-full h-auto object-cover" />
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-lg text-center text-foreground mb-12">Why Choose A.R Grand</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <f.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-heading text-xl mb-2 text-foreground">{f.title}</h3>
              <p className="text-body text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Virtual Tour Video */}
    <section className="section-padding max-w-7xl mx-auto text-center">
      <h2 className="heading-lg text-foreground mb-4">Virtual Tour</h2>
      <p className="text-body text-muted-foreground mb-8 max-w-2xl mx-auto">
        Take a virtual walk-through of our stunning venue and imagine your special day at A.R Grand.
      </p>
      <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="A.R Grand Virtual Tour"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <p className="text-body text-muted-foreground text-sm mt-4 italic">
        Replace the YouTube URL above with your actual virtual tour video
      </p>
    </section>

    {/* CTA */}
    <section className="section-padding gold-gradient text-center">
      <h2 className="heading-lg text-foreground mb-4">Ready to Book Your Dream Venue?</h2>
      <p className="text-body text-foreground/80 mb-8 max-w-xl mx-auto">
        Check availability and reserve your date today. Our team is ready to make your celebration unforgettable.
      </p>
      <Link
        to="/enquiry"
        className="inline-block bg-foreground text-primary-foreground px-8 py-3 rounded-md font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
      >
        Enquire Now
      </Link>
    </section>
  </div>
);

export default Index;
