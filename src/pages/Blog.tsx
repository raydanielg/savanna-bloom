import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import serengeti from "@/assets/serengeti.jpg";
import kiliClimbing from "@/assets/kilimanjaro-climbing.jpg";
import zanzibar from "@/assets/zanzibar.jpg";
import heroSafari from "@/assets/hero-safari.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
};

const posts = [
  { title: "Best Time to Visit Tanzania for Safari", excerpt: "Planning your Tanzania trip? Here's a month-by-month guide to the best wildlife viewing, weather, and crowd levels.", image: serengeti, date: "Mar 10, 2024", readTime: "8 min", slug: "best-time-visit-tanzania" },
  { title: "How to Prepare for Climbing Kilimanjaro", excerpt: "Everything you need to know about training, gear, altitude acclimatization, and what to expect on the mountain.", image: kiliClimbing, date: "Feb 28, 2024", readTime: "12 min", slug: "prepare-kilimanjaro" },
  { title: "Tanzania Safari Packing List", excerpt: "The complete packing guide for your Tanzania safari — from clothing and camera gear to medications and essentials.", image: heroSafari, date: "Feb 15, 2024", readTime: "6 min", slug: "safari-packing-list" },
  { title: "Zanzibar Travel Guide: Beaches, Culture & Spices", excerpt: "Discover the best beaches, Stone Town's history, spice tours, and everything Zanzibar has to offer.", image: zanzibar, date: "Jan 30, 2024", readTime: "10 min", slug: "zanzibar-guide" },
];

const Blog = () => {
  return (
    <Layout>
      <section className="section-padding bg-background pt-32">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h1 className="text-hero font-serif text-foreground">Travel Journal</h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Expert tips, travel guides, and stories from the African wilderness.</p>
          </motion.div>

          {/* Featured */}
          <motion.div {...fadeInUp} className="mb-12">
            <Link to={`/blog/${posts[0].slug}`} className="group grid md:grid-cols-2 bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge-meta bg-accent/10 text-accent"><Calendar className="w-3 h-3" /> {posts[0].date}</span>
                  <span className="badge-meta bg-muted text-muted-foreground"><Clock className="w-3 h-3" /> {posts[0].readTime}</span>
                </div>
                <h2 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-3">{posts[0].title}</h2>
                <p className="text-muted-foreground leading-relaxed">{posts[0].excerpt}</p>
                <span className="inline-flex items-center gap-2 text-primary font-medium mt-4 group-hover:text-accent transition-colors">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(1).map((post, i) => (
              <motion.div key={post.slug} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <Link to={`/blog/${post.slug}`} className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
