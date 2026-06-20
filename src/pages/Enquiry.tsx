import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const functionTypes = ["Wedding", "Reception", "Engagement", "Birthday Party", "Corporate Event", "Other"];
const capacityOptions = ["50–100 Guests", "100–250 Guests"];

const Enquiry = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    functionType: "",
    capacity: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.functionType || !form.capacity) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const enquiryId = crypto.randomUUID();
    const templateData = { ...form };

    try {
      // Always notify the venue
      const adminPromise = supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "enquiry-notification",
          idempotencyKey: `enquiry-admin-${enquiryId}`,
          templateData,
        },
      });

      // Confirm to customer only if they provided an email
      const customerPromise = form.email
        ? supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "enquiry-confirmation",
              recipientEmail: form.email,
              idempotencyKey: `enquiry-customer-${enquiryId}`,
              templateData,
            },
          })
        : Promise.resolve({ error: null });

      const [adminRes, customerRes] = await Promise.all([adminPromise, customerPromise]);
      if (adminRes.error) throw adminRes.error;
      if ((customerRes as any).error) throw (customerRes as any).error;

      toast({ title: "Enquiry Submitted!", description: "We will contact you shortly to confirm your booking." });
      setForm({ name: "", email: "", phone: "", date: "", time: "", functionType: "", capacity: "", message: "" });
    } catch (err) {
      console.error("Enquiry submission failed", err);
      toast({
        title: "Couldn't send enquiry",
        description: "Please try again or call us at +91 94440 43451.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-md border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block font-body text-sm font-semibold text-foreground mb-1";

  return (
    <div className="pt-20">
      <SEO
        title="Book Your Venue · A.R Grand Marriage Hall Kodungaiyur"
        description="Enquire about wedding & event dates at A.R Grand, Kodungaiyur Chennai. Halls for 50–250 guests. Our team replies within 24 hours."
        path="/enquiry"
      />
      <section className="section-padding max-w-3xl mx-auto">
        <h1 className="heading-xl text-center text-foreground mb-4">Book Your Venue</h1>
        <p className="text-body text-center text-muted-foreground mb-12">
          Fill in the details below and our team will get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" maxLength={100} />
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+91 XXXXX XXXXX" maxLength={15} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" maxLength={255} />
            </div>
            <div>
              <label className={labelClass}>Event Date *</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preferred Time</label>
              <input name="time" type="time" value={form.time} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Function Type *</label>
              <select name="functionType" value={form.functionType} onChange={handleChange} className={inputClass}>
                <option value="">Select type</option>
                {functionTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Hall Capacity *</label>
              <select name="capacity" value={form.capacity} onChange={handleChange} className={inputClass}>
                <option value="">Select capacity</option>
                {capacityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Additional Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} className={inputClass} rows={4} placeholder="Tell us about your requirements..." maxLength={1000} />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            Submit Enquiry
          </button>
        </form>
      </section>
    </div>
  );
};

export default Enquiry;
