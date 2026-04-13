const sections = [
  {
    title: "1. Booking & Reservation",
    items: [
      "A minimum advance of 50% is required to confirm your booking.",
      "Booking is confirmed only upon receipt of the advance payment and signed agreement.",
      "Tentative bookings without advance will be held for a maximum of 48 hours.",
    ],
  },
  {
    title: "2. Cancellation & Refund",
    items: [
      "Cancellations made 30+ days before the event: 75% refund of advance.",
      "Cancellations made 15–30 days before: 50% refund.",
      "Cancellations made within 15 days: No refund.",
      "Date changes are subject to availability and may incur additional charges.",
    ],
  },
  {
    title: "3. Venue Usage",
    items: [
      "The venue must be vacated by the agreed time. Overtime charges apply at ₹5,000/hour.",
      "Any damage to the property will be charged to the client.",
      "Outside catering is allowed only with prior approval and a surcharge.",
      "Decorations must not damage walls, ceilings, or fixtures. No nails or adhesives on surfaces.",
    ],
  },
  {
    title: "4. Capacity & Safety",
    items: [
      "Guest count must not exceed the hall's maximum capacity for safety reasons.",
      "Fire exits must remain unblocked at all times.",
      "Fireworks, sky lanterns, and open flames are strictly prohibited indoors.",
      "The management reserves the right to stop any activity deemed unsafe.",
    ],
  },
  {
    title: "5. Noise & Conduct",
    items: [
      "Music and DJ must comply with local noise regulations and stop by 10:00 PM.",
      "Guests are expected to maintain decorum. The management is not responsible for misconduct.",
      "Consumption of illegal substances is strictly prohibited on the premises.",
    ],
  },
  {
    title: "6. Parking & Liability",
    items: [
      "Complimentary parking is available on a first-come, first-served basis.",
      "The management is not liable for theft or damage to vehicles.",
      "Valet services can be arranged at additional cost.",
    ],
  },
  {
    title: "7. General",
    items: [
      "The management reserves the right to amend these terms at any time.",
      "All disputes are subject to the jurisdiction of courts in Chennai.",
      "By booking, you agree to all terms and conditions listed herein.",
    ],
  },
];

const Terms = () => (
  <div className="pt-20">
    <section className="section-padding max-w-4xl mx-auto">
      <h1 className="heading-xl text-center text-foreground mb-4">Terms & Conditions</h1>
      <p className="text-body text-center text-muted-foreground mb-12">
        Please read the following rules and regulations carefully before booking.
      </p>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="heading-md text-foreground mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="text-body text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Terms;
