import { Link } from "react-router-dom";
import { Phone, MapPin, Users, Car, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import aboutExterior from "@/assets/about-exterior.jpg";

interface LocationPageProps {
  area: string;
  slug: string;
  distance: string;
  intro: string;
  landmarks: string[];
  nearbyAreas: { name: string; slug: string }[];
}

const LocationPage = ({ area, slug, distance, intro, landmarks, nearbyAreas }: LocationPageProps) => {
  const title = `Best Marriage Hall in ${area}, Chennai · A.R Grand`;
  const description = `Looking for a marriage hall near ${area}? A.R Grand in Kodungaiyur is just ${distance} away. AC banquet halls for 50–250 guests, parking, catering.`;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which is the best marriage hall near ${area}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A.R Grand Marriage Hall in Kodungaiyur is one of the most popular wedding venues for ${area} residents — just ${distance} away. It offers fully air-conditioned halls for 50–250 guests, ample parking, in-house catering, and a bridal room.`,
        },
      },
      {
        "@type": "Question",
        name: `How far is A.R Grand from ${area}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A.R Grand is approximately ${distance} from ${area}, located at No 5C/1 Sidco Main Road near TNEB, Kodungaiyur (East), Chennai 600118.`,
        },
      },
      {
        "@type": "Question",
        name: "What is the guest capacity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A.R Grand accommodates 50 to 250 guests, ideal for intimate functions as well as large weddings and receptions.",
        },
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://argrandweddinghall.com/" },
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://argrandweddinghall.com/locations" },
      { "@type": "ListItem", position: 3, name: area, item: `https://argrandweddinghall.com/locations/${slug}` },
    ],
  };

  return (
    <div className="pt-20">
      <SEO title={title} description={description} path={`/locations/${slug}`} jsonLd={[faqLd, breadcrumbLd]} />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={aboutExterior} alt={`A.R Grand Marriage Hall — serving ${area}`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/60 to-noir/30" />
        <div className="relative h-full max-w-5xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-16 text-cream">
          <p className="eyebrow mb-3 text-accent">Wedding Hall Near {area}</p>
          <span className="gold-divider mb-5" />
          <h1 className="heading-xl mb-4">
            Best Marriage Hall in <span className="italic gold-text">{area}</span>
          </h1>
          <p className="text-body text-cream/80 max-w-2xl">{intro}</p>
        </div>
      </section>

      {/* Why us */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: `${distance} from ${area}`, desc: `An easy drive from ${area} via Sidco Main Road, with on-street access near TNEB Kodungaiyur.` },
            { icon: Users, title: "50–250 Guests", desc: "Flexible AC halls for intimate ceremonies as well as full-scale weddings and receptions." },
            { icon: Car, title: "Spacious Parking", desc: "On-site parking that comfortably accommodates guests arriving from across North Chennai." },
          ].map((f) => (
            <div key={f.title} className="luxury-card p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 mb-5">
                <f.icon className="text-accent" size={24} strokeWidth={1.5} />
              </div>
              <h2 className="font-heading text-2xl mb-3 text-foreground">{f.title}</h2>
              <p className="text-body text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Landmarks */}
      <section className="section-padding bg-card">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-3">Easy To Reach</p>
          <span className="gold-divider mb-5" />
          <h2 className="heading-lg text-foreground mb-6">
            Convenient for guests across <span className="italic gold-text">{area}</span>
          </h2>
          <p className="text-body text-muted-foreground mb-8 max-w-3xl">
            A.R Grand Marriage Hall is a short drive from key landmarks in and around {area}, making it a stress-free choice for your wedding venue in North Chennai.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {landmarks.map((l) => (
              <li key={l} className="flex items-start gap-3 text-muted-foreground">
                <Sparkles className="text-accent mt-1 shrink-0" size={16} />
                <span className="text-body">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding noir-bg text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ background: "var(--gradient-gold)" }} />
        <div className="relative max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Reserve Your Date</p>
          <span className="gold-divider mb-5" />
          <h2 className="heading-lg text-cream mb-5">
            Planning a wedding in <span className="italic gold-text">{area}?</span>
          </h2>
          <p className="text-body text-cream/75 mb-8">
            Check date availability or call us directly — we'll walk you through the venue and packages tailored for your function.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/enquiry" className="btn-gold">Check Availability</Link>
            <a href="tel:+919444043451" className="btn-outline-gold inline-flex items-center gap-2">
              <Phone size={16} /> +91 94440 43451
            </a>
          </div>
        </div>
      </section>

      {/* Nearby areas internal links */}
      <section className="py-12 max-w-5xl mx-auto px-4 md:px-8 text-center">
        <p className="eyebrow mb-4 text-muted-foreground">Also Serving</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {nearbyAreas.map((a) => (
            <Link
              key={a.slug}
              to={`/locations/${a.slug}`}
              className="px-5 py-2 border border-border rounded-sm text-sm text-muted-foreground hover:text-accent hover:border-accent transition-colors"
            >
              Marriage Hall in {a.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

// Wrappers for each location

export const PerumburPage = () => (
  <LocationPage
    area="Perambur"
    slug="perambur"
    distance="2 km"
    intro="A.R Grand is the closest premium marriage hall for families in Perambur — a short drive away in Kodungaiyur, with elegant halls, full catering, and ample parking."
    landmarks={[
      "Perambur Railway Station — ~2 km",
      "Perambur Loco Works — ~2.5 km",
      "Don Bosco Matriculation School — ~2 km",
      "ICF Colony — ~3 km",
    ]}
    nearbyAreas={[
      { name: "Vyasarpadi", slug: "vyasarpadi" },
      { name: "Madhavaram", slug: "madhavaram" },
    ]}
  />
);

export const VyasarpadiPage = () => (
  <LocationPage
    area="Vyasarpadi"
    slug="vyasarpadi"
    distance="3 km"
    intro="Hosting a wedding in Vyasarpadi? A.R Grand in nearby Kodungaiyur offers AC banquet halls, in-house catering, and on-site parking — minutes from Vyasarpadi."
    landmarks={[
      "Vyasarpadi Jeeva Railway Station — ~3 km",
      "MMDA Colony — ~2.5 km",
      "Sharma Nagar — ~2 km",
      "Vyasarpadi Bus Terminus — ~3 km",
    ]}
    nearbyAreas={[
      { name: "Perambur", slug: "perambur" },
      { name: "Madhavaram", slug: "madhavaram" },
    ]}
  />
);

export const MadhavaramPage = () => (
  <LocationPage
    area="Madhavaram"
    slug="madhavaram"
    distance="5 km"
    intro="A.R Grand in Kodungaiyur is a popular wedding venue for Madhavaram families — easy access via Madhavaram High Road, with elegant halls and full event services."
    landmarks={[
      "Madhavaram Milk Colony — ~5 km",
      "Madhavaram Bus Terminus — ~5 km",
      "Manjambakkam — ~4 km",
      "Moolakadai Junction — ~3 km",
    ]}
    nearbyAreas={[
      { name: "Perambur", slug: "perambur" },
      { name: "Vyasarpadi", slug: "vyasarpadi" },
    ]}
  />
);

export default LocationPage;
