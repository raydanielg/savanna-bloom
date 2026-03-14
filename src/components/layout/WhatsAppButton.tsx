import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/255123456789?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20safari%20packages"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(142,70%,40%)] text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ease-out-quint"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
