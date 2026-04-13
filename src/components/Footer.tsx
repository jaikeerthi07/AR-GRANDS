import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="heading-md text-primary-foreground mb-4">A.R Grand</h3>
          <p className="text-body opacity-80">
            Your dream wedding venue. Elegant spaces for unforgettable celebrations.
          </p>
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
              <span className="text-body">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <Mail size={16} />
              <span className="text-body">info@argrand.com</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <MapPin size={16} />
              <span className="text-body">123 Wedding Avenue, Chennai</span>
            </div>
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
