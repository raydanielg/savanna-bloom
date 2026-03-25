import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const KNOWLEDGE_BASE = {
  company: "Go Deep Africa Safari is Tanzania's premier safari company since 2008, specializing in Kilimanjaro climbs, high-end wildlife safaris, and Zanzibar beach vacations.",
  destinations: ["Serengeti National Park", "Ngorongoro Crater", "Mount Kilimanjaro", "Zanzibar Archipelago", "Tarangire National Park", "Lake Manyara"],
  services: ["Kilimanjaro Trekking (98% success rate)", "Wildlife Game Drives", "Cultural Tours", "Luxury Tented Camps", "Private Guided Safaris"],
  contacts: "Email: info@godeepafricasafari.com, Phone: +255 123 456 789, Office: Arusha, Tanzania",
  specialties: "Expert local guides, safety-first protocols, custom-modified 4x4 vehicles, and 15+ years of experience."
};

const SYSTEM_PROMPT = `You are the Go Deep Africa Safari AI assistant. 
Only answer questions about African safaris, Kilimanjaro climbing, Tanzania travel, and Go Deep Africa Safari company services.
Use the following knowledge base: ${JSON.stringify(KNOWLEDGE_BASE)}.
If a question is outside these topics, politely decline and offer to help with safari planning. 
Keep answers concise, professional, and adventurous.`;

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Jambo! I'm your Go Deep Africa AI. How can I help you plan your Tanzanian adventure today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    // Simulated AI response based on keywords (since we are not connecting to a real LLM API here for local stability)
    setTimeout(() => {
      let response = "";
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes("kili") || lowerInput.includes("mountain") || lowerInput.includes("climb")) {
        response = "We offer expert-led Kilimanjaro climbs on all major routes (Machame, Lemosho, etc.) with a 98% success rate. Which route interests you?";
      } else if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("expensive")) {
        response = "Our safari packages vary based on luxury level and duration. Generally, prices start from $2,500 per person. I can get you a custom quote if you'd like!";
      } else if (lowerInput.includes("best time") || lowerInput.includes("when to go")) {
        response = "The best time for wildlife is during the dry season (June to October). For the Great Migration, July to September is spectacular in the Serengeti!";
      } else if (lowerInput.includes("zanzibar") || lowerInput.includes("beach")) {
        response = "Zanzibar is the perfect post-safari relaxation spot! We handle everything from stone town tours to luxury beach resorts.";
      } else if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("phone")) {
        response = `You can reach us at ${KNOWLEDGE_BASE.contacts}. We're based in Arusha!`;
      } else if (lowerInput.includes("serengeti") || lowerInput.includes("migration")) {
        response = "The Serengeti is our specialty! We track the Great Migration year-round to ensure you see the best wildlife action.";
      } else {
        response = "That's a great question! I specialize in Tanzania safaris, Kilimanjaro treks, and Go Deep Africa services. Could you tell me more about your travel plans?";
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Safari Guide AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] opacity-80 uppercase tracking-widest font-semibold">Online</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4 bg-slate-50">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn("flex gap-3 max-w-[85%]", m.role === "user" ? "ml-auto flex-row-reverse" : "")}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                      m.role === "user" ? "bg-orange-100 text-orange-600" : "bg-white text-orange-600 border border-orange-100"
                    )}>
                      {m.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      m.role === "user" 
                        ? "bg-orange-600 text-white rounded-tr-none shadow-md shadow-orange-200" 
                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm"
                    )}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your safari..."
                  className="rounded-xl border-slate-200 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <Button onClick={handleSend} className="bg-orange-600 hover:bg-orange-700 rounded-xl px-4 shadow-lg shadow-orange-200">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[9px] text-center text-slate-400 mt-3 uppercase tracking-tighter">
                Go Deep Africa AI Assistant • Specialized Safari Support
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        {/* Main AI Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
            isOpen ? "bg-slate-800 text-white rotate-90" : "bg-orange-600 text-white"
          )}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  );
}
