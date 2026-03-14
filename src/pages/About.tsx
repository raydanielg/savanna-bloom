import { motion } from "framer-motion";
import { Shield, Award, Users, Heart, Mountain, Globe } from "lucide-react";
import Layout from "@/components/layout/Layout";
import heroSafari from "@/assets/hero-safari.jpg";
import safariVehicle from "@/assets/safari-vehicle.jpg";
import kiliClimbing from "@/assets/kilimanjaro-climbing.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
};

const team = [
  { name: "Joseph Moshi", role: "Founder & Lead Guide", exp: "20+ years on Kilimanjaro" },
  { name: "Grace Kimaro", role: "Safari Director", exp: "15 years wildlife expertise" },
  { name: "David Mwakalinga", role: "Operations Manager", exp: "Ensuring flawless logistics" },
  { name: "Amina Hassan", role: "Guest Relations", exp: "Your personal travel advisor" },
];

const About = () => {
  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[400px] -mt-24">
        <img src={heroSafari} alt="African landscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative h-full flex items-end pb-12 safari-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-hero font-serif text-primary-foreground">About Us</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mt-2">Crafting unforgettable African adventures since 2008.</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="safari-container grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-section font-serif text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded by local Tanzanian mountain guides, Africa Safari & Expeditions was born from a deep love for the African wilderness and a commitment to sharing it responsibly with the world.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Over 15 years, we've guided more than 10,000 travelers to the summit of Kilimanjaro and across the Serengeti, earning a reputation for safety, expertise, and unforgettable experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every expedition is led by certified local guides who know these mountains and plains intimately — because this is their home.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
            <img src={kiliClimbing} alt="Our team on Kilimanjaro" className="rounded-2xl w-full" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/50">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-section font-serif text-foreground">Why Travelers Trust Us</h2>
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
              <motion.div key={item.title} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 card-shadow text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-serif text-lg mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-section font-serif text-foreground">Our Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 card-shadow text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground">{member.name}</h3>
                <p className="text-sm text-accent mt-1">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="section-padding bg-secondary/50">
        <div className="safari-container grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <img src={safariVehicle} alt="Safari vehicle" className="rounded-2xl w-full" loading="lazy" />
          </motion.div>
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
            <h2 className="text-section font-serif text-foreground mb-4">Our Safari Vehicles</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our fleet of custom 4x4 Toyota Land Cruisers are specially modified for the ultimate safari experience with pop-up roofs, charging ports, and refrigeration.
            </p>
            <ul className="space-y-3">
              {["Pop-up roof for 360° game viewing", "Maximum 6 guests per vehicle", "Two-way radio and GPS", "First aid and emergency equipment"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {item}
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
