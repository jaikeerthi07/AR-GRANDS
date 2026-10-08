import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Enquiry from "./pages/Enquiry";
import Terms from "./pages/Terms";
import Events from "./pages/Events";
import Facilities from "./pages/Facilities";
import AdminLogin from "./pages/AdminLogin";
import { PerumburPage, VyasarpadiPage, MadhavaramPage } from "./pages/LocationPage";
import NotFound from "./pages/NotFound";
import Unsubscribe from "./pages/Unsubscribe";
import QRPage from "./pages/QRPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/events" element={<Events />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/locations/perambur" element={<PerumburPage />} />
          <Route path="/locations/vyasarpadi" element={<VyasarpadiPage />} />
          <Route path="/locations/madhavaram" element={<MadhavaramPage />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/qr" element={<QRPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
