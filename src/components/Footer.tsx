import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="heading-md text-primary-foreground mb-4">A.R Grand</h3>
          <p className="text-body opacity-80 mb-6">
            Your dream wedding venue. Elegant spaces for unforgettable celebrations.
          </p>
          <SocialLinks />
        </div>
        <div>
          <h4 className="font-heading text-xl mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/gallery", label: "Gallery" },
              { to: "/events", label: "Events" },
              { to: "/contact", label: "Contact" },
              { to: "/enquiry", label: "Book Now" },
              { to: "/terms", label: "Terms" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-body opacity-80 hover:opacity-100 transition-opacity">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading text-xl mb-4">Contact</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 opacity-80">
              <Phone size={16} />
              <span className="text-body">+91 94440 43451</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <Mail size={16} />
              <span className="text-body">info@argrand.com</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <MapPin size={16} />
              <span className="text-body">No 5C/1, Sidco Main Rd, near TNEB, Kodungaiyur (East), Vivekananda Nagar, Kodungaiyur, Chennai, Tamil Nadu 600118</span>
            </div>
            <a
              href="https://wa.me/919791165395"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-md bg-[#25D366] text-white hover:opacity-90 transition-opacity w-fit"
            >
              <MessageCircle size={16} />
              <span className="text-body text-sm">Message us on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
        <p className="text-body opacity-60">© 2026 A.R Grand. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
