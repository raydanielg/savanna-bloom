import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const update = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));

  return (
    <Layout>
      <section className="section-padding bg-background pt-32">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h1 className="text-hero font-serif text-foreground">Contact Us</h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Ready to plan your African adventure? We're here to help.</p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Form */}
            <motion.div {...fadeInUp} className="bg-card rounded-2xl p-8 card-shadow">
              <h2 className="font-serif text-2xl text-foreground mb-6">Send Us a Message</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                    <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                    <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
                    <input value={form.subject} onChange={(e) => update("subject", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                  <textarea rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent resize-none" />
                </div>
                <button className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Send Message <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="space-y-6">
              <div className="bg-card rounded-2xl p-6 card-shadow">
                <h3 className="font-serif text-lg text-foreground mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Office", value: "Arusha, Tanzania" },
                    { icon: Phone, label: "Phone", value: "+255 123 456 789" },
                    { icon: Mail, label: "Email", value: "info@africasafari.com" },
                    { icon: Clock, label: "Hours", value: "Mon-Sat: 8AM - 6PM (EAT)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://wa.me/255123456789" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[hsl(142,70%,40%)] text-primary-foreground rounded-2xl p-6 hover:opacity-90 transition-opacity">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <p className="font-medium">Chat on WhatsApp</p>
                  <p className="text-sm text-primary-foreground/70">Quick response guaranteed</p>
                </div>
              </a>

              {/* Map placeholder */}
              <div className="bg-muted rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Arusha, Tanzania</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
