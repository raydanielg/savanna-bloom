import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import axios from "@/lib/axios";

import { fadeInUp, staggerDelay } from "@/lib/animations";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  published_at: string;
  author?: { name: string };
  category?: string;
  read_time?: string;
  featured: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/blog-posts");
      const data = response.data?.data || response.data || [];
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      </Layout>
    );
  }

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const restPosts = featuredPost ? posts.filter(p => p.id !== featuredPost.id) : posts;

  return (
    <Layout>
      <section className="section-padding bg-background pt-32">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h1 className="text-hero font-serif text-foreground">Travel Journal</h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Expert tips, travel guides, and stories from the African wilderness.</p>
          </motion.div>

          {posts.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">Travel Stories Coming Soon</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're preparing inspiring travel guides, safari tips, and stories from the African wilderness. Stay tuned for expert insights.
                </p>
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] text-sm"
                >
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featuredPost && (
                <motion.div {...fadeInUp} className="mb-12">
                  <Link to={`/blog/${featuredPost.slug || featuredPost.id}`} className="group grid md:grid-cols-2 bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={featuredPost.image || '/placeholder-blog.jpg'} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="badge-meta bg-accent/10 text-accent"><Calendar className="w-3 h-3" /> {formatDate(featuredPost.published_at)}</span>
                        {featuredPost.read_time && (
                          <span className="badge-meta bg-muted text-muted-foreground"><Clock className="w-3 h-3" /> {featuredPost.read_time}</span>
                        )}
                      </div>
                      <h2 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-3">{featuredPost.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{featuredPost.excerpt}</p>
                      <span className="inline-flex items-center gap-2 text-primary font-medium mt-4 group-hover:text-accent transition-colors">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {restPosts.map((post, i) => (
                  <motion.div key={post.id} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                    <Link to={`/blog/${post.slug || post.id}`} className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={post.image || '/placeholder-blog.jpg'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
                          {post.read_time && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{post.read_time}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
