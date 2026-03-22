import { motion } from "framer-motion";
import { Shield, Award, Users, Heart, Mountain, Globe } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getStorageUrl } from "@/lib/storage";

import { fadeInUp } from "@/lib/animations";

const team = [
  { name: "Joseph Moshi", role: "Founder & Lead Guide", exp: "20+ years on Kilimanjaro", initials: "JM" },
  { name: "Grace Kimaro", role: "Safari Director", exp: "15 years wildlife expertise", initials: "GK" },
  { name: "David Mwakalinga", role: "Operations Manager", exp: "Ensuring flawless logistics", initials: "DM" },
  { name: "Amina Hassan", role: "Guest Relations", exp: "Your personal travel advisor", initials: "AH" },
];

const About = () => {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[450px] -mt-24">
        <img src={getStorageUrl('/storage/hero/hero-safari.jpg')} alt="African landscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-16 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-hero font-serif text-primary-foreground">Our Story</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mt-3">Crafting unforgettable African adventures since 2008.</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="safari-container grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <p className="badge-meta bg-accent/10 text-accent mb-4">About Us</p>
            <h2 className="text-section font-serif text-foreground mb-5">Born from a Love for the Wild</h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-5">
              Founded by local Tanzanian mountain guides, Africa Safari & Expeditions was born from a deep love for the African wilderness and a commitment to sharing it responsibly with the world.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mb-5">
              Over 15 years, we've guided more than 10,000 travelers to the summit of Kilimanjaro and across the Serengeti, earning a reputation for safety, expertise, and unforgettable experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Every expedition is led by certified local guides who know these mountains and plains intimately — because this is their home.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="image-reveal rounded-2xl aspect-[3/4]">
                <img src={getStorageUrl('/storage/kilimanjaro/kilimanjaro-climbing.jpg')} alt="Our team on Kilimanjaro" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="space-y-4 pt-8">
                <div className="image-reveal rounded-2xl aspect-square">
                  <img src={getStorageUrl('/storage/gallery/elephant.jpg')} alt="Elephant encounter" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="image-reveal rounded-2xl aspect-[4/3]">
                  <img src={getStorageUrl('/storage/gallery/luxury-camp.jpg')} alt="Luxury camp" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/40">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-section font-serif text-foreground">Why Travelers Trust Us</h2>
            <div className="w-16 h-px bg-accent mx-auto mt-5" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Safety First", desc: "Emergency protocols, certified guides, and medical support on every expedition." },
              { icon: Award, title: "Local Expertise", desc: "Born and raised in Tanzania, our team knows every trail and waterhole." },
              { icon: Heart, title: "Responsible Tourism", desc: "We support local communities and practice eco-friendly travel." },
              { icon: Mountain, title: "98% Summit Rate", desc: "Expert acclimatization ensures the highest success rates." },
              { icon: Users, title: "Small Groups", desc: "Personalized attention with maximum 12 travelers per group." },
              { icon: Globe, title: "Global Recognition", desc: "TripAdvisor Travelers' Choice and Safari Bookings certified." },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
                className="bg-card rounded-2xl p-8 card-shadow text-center group hover:card-shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-section font-serif text-foreground">Meet Our Team</h2>
            <div className="w-16 h-px bg-accent mx-auto mt-5" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div key={member.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-8 card-shadow text-center group hover:card-shadow-lg transition-shadow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-5">
                  <span className="font-serif text-2xl text-primary">{member.initials}</span>
                </div>
                <h3 className="font-medium text-foreground text-lg">{member.name}</h3>
                <p className="text-sm text-accent mt-1 font-medium">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-3">{member.exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="section-padding bg-secondary/40">
        <div className="safari-container grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <div className="image-reveal rounded-3xl overflow-hidden">
              <img src={getStorageUrl('/storage/gallery/safari-vehicle.jpg')} alt="Safari vehicle" className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
            <p className="badge-meta bg-accent/10 text-accent mb-4">Our Fleet</p>
            <h2 className="text-section font-serif text-foreground mb-5">Premium Safari Vehicles</h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              Our fleet of custom 4x4 Toyota Land Cruisers are specially modified for the ultimate safari experience with pop-up roofs, charging ports, and refrigeration.
            </p>
            <ul className="space-y-4">
              {["Pop-up roof for 360° game viewing", "Maximum 6 guests per vehicle", "Two-way radio and GPS navigation", "First aid and emergency equipment"].map((item) => (
                <li key={item} className="flex items-center gap-4 text-foreground">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
