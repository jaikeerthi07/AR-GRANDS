import { Calendar } from "lucide-react";

const upcomingEvents = [
  { date: "2026-04-20", type: "Wedding", hall: "Grand Hall (250)", status: "Booked" },
  { date: "2026-04-22", type: "Reception", hall: "Banquet Hall (100)", status: "Booked" },
  { date: "2026-04-25", type: "Engagement", hall: "Grand Hall (250)", status: "Booked" },
  { date: "2026-05-01", type: "Wedding", hall: "Grand Hall (250)", status: "Booked" },
  { date: "2026-05-03", type: "Birthday Party", hall: "Banquet Hall (100)", status: "Booked" },
];

const availableDates = [
  { date: "2026-04-18", halls: "All Halls Available" },
  { date: "2026-04-19", halls: "Banquet Hall (100) Available" },
  { date: "2026-04-21", halls: "All Halls Available" },
  { date: "2026-04-23", halls: "All Halls Available" },
  { date: "2026-04-24", halls: "Grand Hall (250) Available" },
  { date: "2026-04-26", halls: "All Halls Available" },
  { date: "2026-04-27", halls: "All Halls Available" },
  { date: "2026-04-28", halls: "Banquet Hall (100) Available" },
  { date: "2026-04-29", halls: "All Halls Available" },
  { date: "2026-04-30", halls: "All Halls Available" },
];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const Events = () => (
  <div className="pt-20">
    <section className="section-padding max-w-6xl mx-auto">
      <h1 className="heading-xl text-center text-foreground mb-4">Events & Availability</h1>
      <p className="text-body text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Check our upcoming bookings and available dates. Contact us to reserve your preferred date.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Scheduled Bookings */}
        <div>
          <h2 className="heading-md text-foreground mb-6 flex items-center gap-2">
            <Calendar className="text-primary" size={24} />
            Scheduled Bookings
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="bg-card p-4 rounded-lg border border-border flex items-center justify-between">
                <div>
                  <p className="font-body font-semibold text-foreground">{event.type}</p>
                  <p className="font-body text-sm text-muted-foreground">{formatDate(event.date)} • {event.hall}</p>
                </div>
                <span className="bg-destructive/10 text-destructive font-body text-xs px-3 py-1 rounded-full font-semibold">
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Dates */}
        <div>
          <h2 className="heading-md text-foreground mb-6 flex items-center gap-2">
            <Calendar className="text-primary" size={24} />
            Available Dates
          </h2>
          <div className="space-y-3">
            {availableDates.map((slot, i) => (
              <div key={i} className="bg-card p-4 rounded-lg border border-border flex items-center justify-between">
                <div>
                  <p className="font-body font-semibold text-foreground">{formatDate(slot.date)}</p>
                  <p className="font-body text-sm text-muted-foreground">{slot.halls}</p>
                </div>
                <span className="bg-primary/10 text-primary font-body text-xs px-3 py-1 rounded-full font-semibold">
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Events;
