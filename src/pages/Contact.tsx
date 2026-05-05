import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => (
  <div className="pt-20">
    <section className="section-padding max-w-7xl mx-auto">
      <h1 className="heading-xl text-center text-foreground mb-4">Contact Us</h1>
      <p className="text-body text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        We'd love to hear from you. Reach out to us for bookings, enquiries, or a venue visit.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-foreground mb-1">Address</h3>
              <p className="text-body text-muted-foreground">No 5C/1, Sidco Main Rd, near TNEB, Kodungaiyur (East), Vivekananda Nagar, Kodungaiyur, Chennai, Tamil Nadu 600118</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-foreground mb-1">Phone</h3>
              <p className="text-body text-muted-foreground">+91 94440 43451</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-foreground mb-1">Email</h3>
              <p className="text-body text-muted-foreground">info@argrand.com</p>
              <p className="text-body text-muted-foreground">bookings@argrand.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-foreground mb-1">Working Hours</h3>
              <p className="text-body text-muted-foreground">Mon – Sun: 9:00 AM – 9:00 PM</p>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="rounded-lg overflow-hidden shadow-lg h-96 lg:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.0!2d80.2464!3d13.1167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264000000000%3A0x0!2sKodungaiyur%2C+Chennai!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "384px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="A.R Grand Location"
          />
        </div>
      </div>
    </section>
  </div>
);

export default Contact;
