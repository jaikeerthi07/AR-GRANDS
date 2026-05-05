import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919791165395";

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to enquire about A.R Grand.")}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Message us on WhatsApp"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-fade-in"
  >
    <MessageCircle size={28} fill="white" />
  </a>
);

export default WhatsAppButton;
