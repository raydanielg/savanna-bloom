import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, MapPin, User, Mail, Phone, MessageSquare, ChevronRight, ChevronLeft, Check, Mountain, Tent, Loader2 } from "lucide-react";
import axios from "@/lib/axios";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTour?: string;
}

const steps = ["Tour", "Dates", "Travelers", "Accommodation", "Contact"];

const tours = [
  "Lemosho Route (8 Days)",
  "Machame Route (7 Days)",
  "Marangu Route (6 Days)",
  "Rongai Route (7 Days)",
  "Northern Circuit (9 Days)",
  "Serengeti Safari",
  "Ngorongoro Safari",
  "Tarangire Safari",
  "Zanzibar Tour",
  "Custom Safari",
];

const accommodations = [
  { name: "Budget Camping", desc: "Basic tents, shared facilities", icon: Tent },
  { name: "Standard Lodge", desc: "Comfortable rooms with meals", icon: Tent },
  { name: "Luxury Lodge", desc: "Premium lodges & tented camps", icon: Tent },
  { name: "Premium Tented Camp", desc: "Five-star bush luxury", icon: Tent },
];

const InquiryModal = ({ isOpen, onClose, defaultTour }: InquiryModalProps) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    tour: defaultTour || "",
    date: "",
    travelers: "2",
    accommodation: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!form.tour;
      case 1: return !!form.date;
      case 2: return !!form.travelers;
      case 3: return !!form.accommodation;
      case 4: return !!form.name && !!form.email && !isSubmitting;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await axios.post("/api/inquiries", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        subject: `Inquiry for ${form.tour}`,
        inquiry_type: form.tour.toLowerCase().includes('kilimanjaro') ? 'kilimanjaro' : 'safari',
        message: form.message || `Interested in ${form.tour}. Accommodation: ${form.accommodation}. Travelers: ${form.travelers}.`,
        preferred_date: form.date,
        guests: form.travelers,
        accommodation: form.accommodation,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Inquiry submission failed:", err);
      setError(err.response?.data?.message || "Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setForm({ tour: defaultTour || "", date: "", travelers: "2", accommodation: "", name: "", email: "", phone: "", country: "", message: "" });
    setSubmitted(false);
    onClose();
  };

  const transition = { ease: [0.23, 1, 0.32, 1] as const, duration: 0.4 };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={transition}
            className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress */}
            <div className="h-1.5 bg-muted">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={transition}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-6 pb-2">
              <div>
                <h3 className="font-serif text-2xl text-foreground">
                  {submitted ? "Inquiry Sent!" : "Begin Your Expedition"}
                </h3>
                {!submitted && (
                  <p className="text-xs text-muted-foreground mt-1">Step {step + 1} of {steps.length}</p>
                )}
              </div>
              <button onClick={reset} className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps indicator */}
            {!submitted && (
              <div className="flex gap-1.5 px-8 pb-4 pt-2">
                {steps.map((s, i) => (
                  <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-muted"}`} />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="px-8 pb-6 min-h-[300px]">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                      <Check className="w-10 h-10 text-accent" />
                    </div>
                    <h4 className="font-serif text-3xl mb-3 text-foreground">Thank You!</h4>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Our expedition team will review your inquiry and get back to you within 24 hours with a personalized itinerary.
                    </p>
                    <div className="text-left bg-secondary/50 rounded-2xl p-6 space-y-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">What happens next</p>
                      {["We review your travel preferences", "A personal travel advisor contacts you", "Receive your custom itinerary & quote"].map((t, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                          <span className="w-7 h-7 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center font-bold">{i + 1}</span>
                          {t}
                        </div>
                      ))}
                    </div>
                    <button onClick={reset} className="mt-8 px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={transition}>
                    {step === 0 && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4"><MapPin className="w-4 h-4 text-accent" /> Which adventure interests you?</label>
                        <div className="grid gap-2 max-h-[260px] overflow-y-auto pr-2">
                          {tours.map((tour) => (
                            <button key={tour} onClick={() => update("tour", tour)}
                              className={`text-left px-5 py-3.5 rounded-xl text-sm transition-all flex items-center gap-3 ${form.tour === tour ? "bg-primary text-primary-foreground ring-2 ring-primary" : "bg-secondary/50 text-foreground hover:bg-secondary"}`}>
                              <Mountain className={`w-4 h-4 flex-shrink-0 ${form.tour === tour ? "text-primary-foreground" : "text-muted-foreground"}`} />
                              {tour}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 1 && (
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="w-4 h-4 text-accent" /> When would you like to travel?</label>
                        <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)}
                          className="w-full px-5 py-4 rounded-xl bg-secondary/50 border-0 text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                        <p className="text-xs text-muted-foreground">Best seasons: January-March and June-October</p>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Users className="w-4 h-4 text-accent" /> How many travelers?</label>
                        <div className="grid grid-cols-4 gap-3">
                          {["1", "2", "3-4", "5+"].map((n) => (
                            <button key={n} onClick={() => update("travelers", n)}
                              className={`py-4 rounded-xl text-sm font-medium transition-all ${form.travelers === n ? "bg-primary text-primary-foreground ring-2 ring-primary" : "bg-secondary/50 text-foreground hover:bg-secondary"}`}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3"><Tent className="w-4 h-4 text-accent" /> Accommodation preference</label>
                        {accommodations.map((acc) => (
                          <button key={acc.name} onClick={() => update("accommodation", acc.name)}
                            className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center gap-4 ${form.accommodation === acc.name ? "bg-primary text-primary-foreground ring-2 ring-primary" : "bg-secondary/50 text-foreground hover:bg-secondary"}`}>
                            <div>
                              <p className="text-sm font-medium">{acc.name}</p>
                              <p className={`text-xs mt-0.5 ${form.accommodation === acc.name ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{acc.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {step === 4 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2"><User className="w-3 h-3" /> Full Name *</label>
                            <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Smith" className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                          </div>
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2"><Mail className="w-3 h-3" /> Email *</label>
                            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2"><Phone className="w-3 h-3" /> Phone</label>
                            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 234 567 890" className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-2 block">Country</label>
                            <input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="United States" className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2"><MessageSquare className="w-3 h-3" /> Special requests</label>
                          <textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us about your dream trip..." className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent resize-none transition-shadow" />
                        </div>
                        {error && (
                          <p className="text-xs text-red-500 mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            {!submitted && (
              <div className="flex items-center justify-between px-8 pb-8">
                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors py-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {step < steps.length - 1 ? (
                  <button onClick={() => setStep(step + 1)} disabled={!canNext()}
                    className="flex items-center gap-1.5 px-7 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={!canNext() || isSubmitting}
                    className="px-7 py-3 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
