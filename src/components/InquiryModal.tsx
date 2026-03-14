import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, MapPin, User, Mail, Phone, MessageSquare, ChevronRight, ChevronLeft, Check } from "lucide-react";

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

const accommodations = ["Budget Camping", "Standard Lodge", "Luxury Lodge", "Premium Tented Camp"];

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

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    switch (step) {
      case 0: return !!form.tour;
      case 1: return !!form.date;
      case 2: return !!form.travelers;
      case 3: return !!form.accommodation;
      case 4: return !!form.name && !!form.email;
      default: return true;
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={transition}
            className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress */}
            <div className="h-1 bg-muted">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={transition}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h3 className="font-serif text-xl text-foreground">
                {submitted ? "Inquiry Sent" : "Begin Your Expedition"}
              </h3>
              <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps indicator */}
            {!submitted && (
              <div className="flex gap-2 px-6 pb-4">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${i <= step ? "text-accent" : "text-muted-foreground"}`}>
                      {s}
                    </span>
                    {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="px-6 pb-6 min-h-[280px]">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-serif text-2xl mb-2 text-foreground">Thank You!</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      Our expedition team will review your inquiry and get back to you within 24 hours with a personalized itinerary.
                    </p>
                    <div className="text-left bg-muted/50 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">What happens next</p>
                      {["We review your travel preferences", "A personal travel advisor contacts you", "Receive your custom itinerary & quote"].map((t, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                          <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">{i + 1}</span>
                          {t}
                        </div>
                      ))}
                    </div>
                    <button onClick={reset} className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={transition}>
                    {step === 0 && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3"><MapPin className="w-4 h-4" /> Select Your Tour</label>
                        <div className="grid gap-2 max-h-[240px] overflow-y-auto pr-2">
                          {tours.map((tour) => (
                            <button key={tour} onClick={() => update("tour", tour)}
                              className={`text-left px-4 py-3 rounded-xl text-sm transition-all ${form.tour === tour ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground hover:bg-muted"}`}>
                              {tour}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 1 && (
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="w-4 h-4" /> Preferred Travel Date</label>
                        <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-muted/50 border-0 text-foreground text-sm outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Users className="w-4 h-4" /> Number of Travelers</label>
                        <div className="grid grid-cols-4 gap-2">
                          {["1", "2", "3-4", "5+"].map((n) => (
                            <button key={n} onClick={() => update("travelers", n)}
                              className={`py-3 rounded-xl text-sm font-medium transition-all ${form.travelers === n ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground hover:bg-muted"}`}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">Accommodation Preference</label>
                        {accommodations.map((acc) => (
                          <button key={acc} onClick={() => update("accommodation", acc)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${form.accommodation === acc ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground hover:bg-muted"}`}>
                            {acc}
                          </button>
                        ))}
                      </div>
                    )}
                    {step === 4 && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1"><User className="w-3 h-3" /> Name *</label>
                            <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                          </div>
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1"><Mail className="w-3 h-3" /> Email *</label>
                            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1"><Phone className="w-3 h-3" /> Phone</label>
                            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Country</label>
                            <input value={form.country} onChange={(e) => update("country", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1"><MessageSquare className="w-3 h-3" /> Message</label>
                          <textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent resize-none" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            {!submitted && (
              <div className="flex items-center justify-between px-6 pb-6">
                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {step < steps.length - 1 ? (
                  <button onClick={() => setStep(step + 1)} disabled={!canNext()}
                    className="flex items-center gap-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={!canNext()}
                    className="px-6 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
                    Submit Inquiry
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
