import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  BookOpen, 
  Tag 
} from "lucide-react";
import { BlogPost, subscribeToPublishedPosts, SAMPLE_POSTS } from "../firebase/blogService";

interface BlogSectionProps {
  onOpenAdmin?: () => void;
  onSelectPost: (post: BlogPost) => void;
}

export default function BlogSection({ onOpenAdmin, onSelectPost }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToPublishedPosts(
      (livePosts) => {
        if (livePosts.length > 0) {
          setPosts(livePosts);
        } else {
          // If no posts in Firestore yet, use sample posts as starter
          setPosts(SAMPLE_POSTS);
        }
        setIsFirebaseLoaded(true);
      },
      (error) => {
        console.warn("Could not subscribe to live Firestore posts, showing fallback:", error);
        setPosts(SAMPLE_POSTS);
      }
    );

    return () => unsubscribe();
  }, []);

  const categories = ["All", "AI & Tech", "Web Development", "SEO & Marketing", "Business & Growth", "Tutorials"];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="px-6 md:px-20 max-w-[1280px] mx-auto py-24 md:py-32 relative scroll-mt-28" id="blog">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-label-mono font-bold tracking-wider uppercase">
            <BookOpen size={14} /> Insights, Guides &amp; AI Innovations
          </div>
          <h2 className="font-headline-lg text-4xl sm:text-5xl text-white font-extrabold tracking-tight">
            Latest Articles &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-orange-400">Tech Insights</span>
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-xl text-base sm:text-lg">
            Practical strategies on artificial intelligence, technical SEO, high-conversion web development, and digital marketing by Santosh Gharti Magar.
          </p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-outline-variant/20">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-label-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                  : "bg-surface-container/70 text-on-surface-variant hover:text-white hover:bg-surface-container"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container/70 border border-outline-variant/40 text-white placeholder-slate-500 text-xs font-label-mono focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-outline-variant/30 rounded-3xl">
          <p className="text-on-surface-variant font-label-mono text-sm">
            No articles found matching "{searchQuery}" in category "{selectedCategory}".
          </p>
          <button
            onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
            className="mt-4 px-5 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-label-mono"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => {
            const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => onSelectPost(post)}
                className="group glass-card rounded-3xl overflow-hidden border border-outline-variant/25 flex flex-col cursor-pointer hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(220,38,38,0.12)]"
              >
                {/* Cover Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-surface-variant">
                  <img
                    src={post.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-primary border border-primary/30 font-label-mono text-[11px] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-label-mono text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {formattedDate}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-xs font-label-mono font-bold text-primary group-hover:underline flex items-center gap-1.5">
                      Read Full Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>

                    {post.tags && post.tags.length > 0 && (
                      <span className="text-[11px] font-label-mono text-on-surface-variant/70">
                        #{post.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
