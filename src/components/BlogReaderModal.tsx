import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, Tag, Share2, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { BlogPost } from "../firebase/blogService";

interface BlogReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export default function BlogReaderModal({ post, onClose }: BlogReaderModalProps) {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-surface border border-outline-variant/40 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container/60 shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-label-mono text-on-surface-variant hover:text-white transition-colors"
            >
              <ArrowLeft size={18} /> Back to Articles
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-variant/80 border border-outline-variant/40 text-xs font-label-mono text-on-surface hover:border-primary/50 transition-colors"
              >
                {copied ? <Check size={14} className="text-tertiary" /> : <Share2 size={14} />}
                {copied ? "Link Copied!" : "Share"}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-8">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-label-mono">
              <span className="px-3.5 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <Calendar size={14} /> {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <Clock size={14} /> {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center gap-4 py-4 border-y border-outline-variant/20">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/60 shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABLTixsJN2BruB-ISxXi2Jad8tRcEVvn9M3P1L24lQV2F7xDdGK6bMGb4u7NR10R7NaqHTl_Q7Z7a15sWS22rMtSFLUdmgAegViSaWOAYHlu5hTyAFElN5WcNKI3oY5pi_rPWR3Op_ybYj_OlTlA_zivDYx5Ps9mSKJ-u-KIBtQ4ChjVZ4KhRV0HuBf_bu1f74fTy6V4ZPfwAqHBUamuHh0uY2uh6dxlopL_iHVOewsMkIXY3xqafDV_Ua7ODOBtF--w"
                  alt={post.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-white text-sm sm:text-base">{post.authorName}</p>
                <p className="text-xs text-on-surface-variant font-label-mono">AI Website Developer &amp; Marketing Strategist</p>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-outline-variant/30">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Excerpt Lead */}
            <p className="text-lg sm:text-xl font-medium text-slate-200 italic border-l-4 border-primary pl-4 py-1 leading-relaxed">
              "{post.excerpt}"
            </p>

            {/* Formatted Content */}
            <div className="prose prose-invert max-w-none space-y-5 text-on-surface-variant leading-relaxed text-base sm:text-lg">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl sm:text-2xl font-bold text-white pt-4 pb-1">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl sm:text-3xl font-bold text-white pt-6 pb-2">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('- ') || paragraph.includes('\n- ')) {
                  const items = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
                  return (
                    <ul key={index} className="space-y-2 pl-4 list-disc marker:text-primary">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-slate-300">
                          {item.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-slate-300">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-outline-variant/30">
                <span className="text-xs font-label-mono text-on-surface-variant flex items-center gap-1">
                  <Tag size={12} /> Tags:
                </span>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface-container text-xs font-label-mono text-on-surface border border-outline-variant/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA at Bottom of Article */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-surface-container to-secondary/10 border border-primary/20 text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Need a High-Performance AI Website for Your Brand?</h3>
              <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
                Santosh Gharti Magar specializes in crafting modern AI-powered websites that rank #1 on Google and turn visitors into clients.
              </p>
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-full font-label-mono text-xs font-bold uppercase tracking-wider glow-btn hover:scale-105 transition-transform"
              >
                Start Your Project
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
