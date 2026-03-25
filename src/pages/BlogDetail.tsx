import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  User, 
  Tag, 
  ArrowLeft, 
  Share2, 
  ChevronRight, 
  Clock,
  BookOpen,
  Loader2,
  AlertCircle
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import axios from "@/lib/axios";
import { getStorageUrl } from "@/lib/storage";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string | string[];
  created_at: string;
  author?: { name: string };
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blog-posts/${slug}`);
      const data = response.data.data || response.data;
      setPost(data);
      
      // Fetch related posts (simple mock logic for now)
      const relatedRes = await axios.get('/api/blog-posts');
      const allPosts = relatedRes.data?.data || relatedRes.data || [];
      setRelatedPosts(allPosts.filter((p: BlogPost) => p.slug !== slug).slice(0, 3));
    } catch (err: any) {
      console.error("Failed to fetch post:", err);
      setError(err.response?.data?.message || "Story not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <p className="text-slate-500 font-medium">Tracking the story...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-rose-600" />
          </div>
          <h2 className="text-3xl font-serif text-slate-900 mb-2">Lost in the Wilderness</h2>
          <p className="text-slate-500 max-w-md mb-8">{error || "The story you're looking for couldn't be found."}</p>
          <Button asChild className="bg-orange-600 hover:bg-orange-700 rounded-full px-8">
            <Link to="/blog">Back to Stories</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const tagsList = typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()) : (Array.isArray(post.tags) ? post.tags : []);

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img 
            src={post.featured_image ? getStorageUrl(post.featured_image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=1600'} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </div>
        
        <div className="relative safari-container pb-12 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-orange-400 transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-orange-600 text-white border-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-[1.1]">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                  {post.author?.name?.charAt(0) || 'G'}
                </div>
                <span className="font-semibold">{post.author?.name || 'Go Deep Team'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                {Math.ceil(post.content.split(' ').length / 200)} min read
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="safari-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Post Content */}
            <article className="lg:col-span-8">
              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600 prose-img:rounded-3xl prose-a:text-orange-600 hover:prose-a:text-orange-700">
                {post.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Tags & Share */}
              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {tagsList.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">
                      <Tag className="w-3 h-3 text-orange-500" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Share story</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-orange-50 hover:text-orange-600 border-slate-200">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              {/* About Author Card */}
              <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl bg-slate-900 text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-2xl font-serif">
                      G
                    </div>
                    <div>
                      <h4 className="font-bold">Go Deep Africa</h4>
                      <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Expert Guides</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Sharing authentic stories from the heart of Tanzania. Our guides live and breathe the savanna, bringing you closer to nature.
                  </p>
                  <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" /> Related Stories
                </h3>
                <div className="space-y-6">
                  {relatedPosts.map(rPost => (
                    <Link key={rPost.id} to={`/blog/${rPost.slug}`} className="flex gap-4 group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <img 
                          src={rPost.featured_image ? getStorageUrl(rPost.featured_image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=200'} 
                          alt={rPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                          {rPost.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-2">
                          {new Date(rPost.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100">
                <h3 className="text-2xl font-serif text-slate-900 mb-4">Join the Expedition</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Get monthly safari tips, migration updates, and exclusive trek offers delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Your email address"
                    className="w-full h-12 px-4 rounded-xl border-orange-200 bg-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 h-12 rounded-xl font-bold">
                    Subscribe
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Quick Booking CTA */}
      <section className="py-20 bg-slate-50">
        <div className="safari-container">
          <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Inspired by this story?</h2>
              <p className="text-slate-500 text-lg max-w-lg">Let us help you create your own African legend. Custom safaris and climbs await.</p>
            </div>
            <div className="flex flex-wrap gap-4 relative z-10">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 rounded-2xl h-14 px-10 font-bold shadow-lg shadow-orange-200">
                <Link to="/contact">Plan Your Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-200 text-slate-900 rounded-2xl h-14 px-10 font-bold hover:bg-slate-50">
                <Link to="/tanzania-safaris">Browse Packages</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
