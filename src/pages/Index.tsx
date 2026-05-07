import HeroSlider from "@/components/HeroSlider";
import { Link } from "react-router-dom";
import { Users, Calendar, Utensils, Music, Sparkles, Heart, Award, Star } from "lucide-react";
import aboutExterior from "@/assets/about-exterior.jpg";

const features = [
  { icon: Users, title: "50–250 Guests", desc: "Flexible halls for intimate gatherings to grand celebrations" },
  { icon: Calendar, title: "Easy Booking", desc: "Check availability and reserve your preferred date with ease" },
  { icon: Utensils, title: "Catering Services", desc: "Multi-cuisine catering with bespoke, customizable menus" },
  { icon: Music, title: "Full Amenities", desc: "DJ, décor, bridal room, parking and every detail covered" },
];

const stats = [
  { value: "10+", label: "Years of Excellence" },
  { value: "500+", label: "Celebrations Hosted" },
  { value: "250", label: "Guest Capacity" },
  { value: "100%", label: "Air-Conditioned" },
];

const testimonials = [
  { name: "Priya & Karthik", role: "Wedding · 2025", text: "A.R Grand made our wedding day absolutely magical. The venue is breathtaking and the staff went above and beyond to ensure every detail was perfect." },
  { name: "Lakshmi Iyer", role: "Reception · 2025", text: "Elegant interiors, attentive service, and seamless coordination. Our guests couldn't stop praising the ambience and the catering." },
  { name: "Rajan Family", role: "Engagement · 2024", text: "The team's professionalism is unmatched. From décor to dining, everything was orchestrated with care. Highly recommended in North Chennai." },
];

const Index = () => (
  <div>
    <HeroSlider />

    {/* About Section */}
    <section className="section-padding max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <p className="eyebrow mb-4">Welcome to A.R Grand</p>
          <span className="gold-divider mb-6" />
          <h2 className="heading-lg text-foreground mb-8 leading-[1.1]">
            Timeless Elegance.<br />
            <span className="italic gold-text">Unforgettable Celebrations.</span>
          </h2>
          <p className="text-body text-muted-foreground mb-5">
            Located on Sidco Main Road near TNEB in Kodungaiyur, Chennai, A.R Grand is a premier marriage hall and wedding venue that blends timeless elegance with modern amenities. Our beautifully appointed halls provide the perfect backdrop for weddings, receptions, engagements, and all your special celebrations.
          </p>
          <p className="text-body text-muted-foreground mb-10">
            With over a decade of experience hosting unforgettable events, our dedicated team ensures every detail is perfect — from exquisite décor to world-class catering.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/gallery" className="btn-outline-gold">View Gallery</Link>
            <Link to="/enquiry" className="btn-gold">Enquire Now</Link>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative">
          <div className="absolute -inset-4 border border-accent/40 rounded-sm hidden md:block" />
          <div className="relative overflow-hidden rounded-sm shadow-[var(--shadow-elegant)] group">
            <img
              src={aboutExterior}
              alt="A.R Grand Marriage Hall Exterior in Kodungaiyur, Chennai"
              width={800}
              height={1000}
              loading="lazy"
              className="w-full h-[480px] lg:h-[600px] object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent" />
          </div>
          {/* Floating accent card */}
          <div className="hidden md:flex absolute -bottom-8 -left-8 bg-card px-6 py-5 shadow-[var(--shadow-elegant)] items-center gap-4 rounded-sm">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
              <Award className="text-noir" size={22} />
            </div>
            <div>
              <p className="font-heading text-2xl text-foreground leading-none">10+</p>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">Years of Trust</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Stats Strip */}
    <section className="relative py-16 noir-bg overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-gold)" }} />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-y-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center px-4 lg:border-r lg:border-cream/15 lg:last:border-r-0">
            <p className="font-heading text-5xl md:text-6xl gold-text font-light mb-2">{s.value}</p>
            <p className="text-[11px] tracking-[0.3em] uppercase text-cream/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="eyebrow mb-3">Our Promise</p>
          <span className="gold-divider mb-6" />
          <h2 className="heading-lg text-foreground">Why Choose <span className="gold-text italic">A.R Grand</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="luxury-card p-8 text-center group">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-accent/15 group-hover:bg-accent/25 transition-colors duration-500" />
                <div className="absolute inset-2 rounded-full border border-accent/40" />
                <f.icon className="relative text-accent" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-2xl mb-3 text-foreground">{f.title}</h3>
              <p className="text-body text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Virtual Tour Video */}
    <section className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="eyebrow mb-3">Step Inside</p>
        <span className="gold-divider mb-6" />
        <h2 className="heading-lg text-foreground mb-4">A Virtual Tour</h2>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          Take a cinematic walk-through of our stunning venue and imagine your special day at A.R Grand.
        </p>
      </div>
      <div className="relative max-w-5xl mx-auto">
        <div className="absolute -inset-3 border border-accent/30 rounded-sm hidden md:block" />
        <div className="relative aspect-video overflow-hidden rounded-sm shadow-[var(--shadow-elegant)]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/RN0FEACG9W0"
            title="A.R Grand Virtual Tour"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="eyebrow mb-3">Kind Words</p>
          <span className="gold-divider mb-6" />
          <h2 className="heading-lg text-foreground">Loved By Our <span className="italic gold-text">Couples</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="luxury-card p-8 flex flex-col">
              <div className="flex gap-1 mb-5 text-accent">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-body text-muted-foreground italic mb-6 flex-1">"{t.text}"</p>
              <div className="pt-4 border-t border-border">
                <p className="font-heading text-xl text-foreground">{t.name}</p>
                <p className="text-xs tracking-widest uppercase text-accent mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="relative section-padding noir-bg overflow-hidden text-center">
      <div className="absolute inset-0 opacity-[0.07]" style={{ background: "var(--gradient-gold)" }} />
      <Sparkles className="absolute top-12 left-12 text-accent/30 hidden md:block" size={28} />
      <Heart className="absolute bottom-12 right-12 text-accent/30 hidden md:block" size={28} />
      <div className="relative max-w-3xl mx-auto">
        <p className="eyebrow mb-4">Reserve Your Date</p>
        <span className="gold-divider mb-6" />
        <h2 className="heading-lg text-cream mb-6">
          Ready to Book Your <span className="italic gold-text">Dream Venue?</span>
        </h2>
        <p className="text-body text-cream/75 mb-10 max-w-xl mx-auto">
          Check availability and reserve your date today. Our team is ready to make your celebration unforgettable.
        </p>
        <Link to="/enquiry" className="btn-gold">Enquire Now</Link>
      </div>
    </section>
  </div>
);

export default Index;
