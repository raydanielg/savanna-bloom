import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getStorageUrl } from "@/lib/storage";

import { fadeInUp } from "@/lib/animations";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const update = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px] -mt-24">
        <img src={getStorageUrl('/storage/hero/kili-summit.jpg')} alt="Tanzania landscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-14 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-hero font-serif text-primary-foreground">Contact Us</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mt-3">Ready to plan your African adventure? We're here to help.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16">
            {/* Form */}
            <motion.div {...fadeInUp} className="bg-card rounded-3xl p-8 lg:p-10 card-shadow-lg">
              <h2 className="font-serif text-2xl text-foreground mb-2">Send Us a Message</h2>
              <p className="text-sm text-muted-foreground mb-8">We respond to every inquiry within 24 hours.</p>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Name *</label>
                    <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Smith"
                      className="w-full px-5 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com"
                      className="w-full px-5 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Phone</label>
                    <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 234 567 890"
                      className="w-full px-5 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Subject</label>
                    <input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Safari inquiry"
                      className="w-full px-5 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Message *</label>
                  <textarea rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us about your dream trip..."
                    className="w-full px-5 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent resize-none transition-shadow" />
                </div>
                <button className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm tracking-wide uppercase flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="space-y-6">
              <div className="bg-card rounded-2xl p-8 card-shadow">
                <h3 className="font-serif text-xl text-foreground mb-6">Get in Touch</h3>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: "Office", value: "Arusha, Tanzania" },
                    { icon: Phone, label: "Phone", value: "+255 123 456 789" },
                    { icon: Mail, label: "Email", value: "info@africasafari.com" },
                    { icon: Clock, label: "Hours", value: "Mon-Sat: 8AM - 6PM (EAT)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://wa.me/255123456789" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[hsl(142,70%,40%)] text-primary-foreground rounded-2xl p-6 hover:opacity-90 transition-opacity group">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">Chat on WhatsApp</p>
                  <p className="text-sm text-primary-foreground/70">Quick response guaranteed</p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Map placeholder */}
              <div className="bg-secondary/50 rounded-2xl h-52 flex items-center justify-center border border-border">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-accent/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">Arusha, Tanzania</p>
                  <p className="text-xs text-muted-foreground mt-1">East Africa</p>
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
