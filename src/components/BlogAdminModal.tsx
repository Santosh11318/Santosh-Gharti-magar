import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  Eye
} from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  ADMIN_EMAIL 
} from "../firebase/config";
import { 
  BlogPost, 
  BlogPostInput, 
  createPost, 
  updatePost, 
  deletePost, 
  fetchAllPostsAdmin, 
  SAMPLE_POSTS,
  isUserAdmin 
} from "../firebase/blogService";

interface BlogAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostsUpdated?: () => void;
}

const CATEGORIES: BlogPost['category'][] = [
  'AI & Tech',
  'Web Development',
  'SEO & Marketing',
  'Business & Growth',
  'Tutorials'
];

const COVER_PRESETS = [
  { label: 'AI Futuristic', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'SEO & Growth', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Code & Dev', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Business Tech', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
];

export default function BlogAdminModal({ isOpen, onClose, onPostsUpdated }: BlogAdminModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'manage' | 'editor'>('manage');
  const [adminPosts, setAdminPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [originalCreatedAt, setOriginalCreatedAt] = useState<string>('');
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<BlogPost['category']>('AI & Tech');
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [tagsInput, setTagsInput] = useState("AI, Web Dev");
  const [readTime, setReadTime] = useState("5 min read");
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && isUserAdmin(user.email)) {
        loadAdminPosts();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadAdminPosts = async () => {
    setLoading(true);
    try {
      const posts = await fetchAllPostsAdmin();
      setAdminPosts(posts);
    } catch (err: any) {
      console.error("Failed to load admin posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!isUserAdmin(user.email)) {
        setStatusMessage({
          type: 'error',
          text: `Signed in as ${user.email}. Notice: Only designated admin (${ADMIN_EMAIL}) has full publishing rights.`
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: `Welcome back, Santosh! Admin access verified.`
        });
        await loadAdminPosts();
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || "Sign-in failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setAdminPosts([]);
    resetForm();
  };

  const resetForm = () => {
    setEditingPostId(null);
    setOriginalCreatedAt('');
    setTitle("");
    setSlug("");
    setCategory('AI & Tech');
    setExcerpt("");
    setContent("");
    setCoverImage(COVER_PRESETS[0].url);
    setTagsInput("AI, Web Dev");
    setReadTime("5 min read");
    setStatus('published');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPostId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in Title, Excerpt, and Article Content.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const postPayload: BlogPostInput = {
      title,
      slug: slug || `post-${Date.now()}`,
      category,
      excerpt,
      content,
      coverImage,
      tags,
      readTime,
      status,
    };

    try {
      if (editingPostId) {
        await updatePost(editingPostId, postPayload, originalCreatedAt);
        setStatusMessage({ type: 'success', text: 'Blog post updated successfully!' });
      } else {
        await createPost(postPayload);
        setStatusMessage({ type: 'success', text: 'New blog post published to Firebase!' });
      }
      resetForm();
      setActiveTab('manage');
      await loadAdminPosts();
      onPostsUpdated?.();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save post' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPostId(post.id);
    setOriginalCreatedAt(post.createdAt);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage || COVER_PRESETS[0].url);
    setTagsInput(post.tags?.join(', ') || '');
    setReadTime(post.readTime || '5 min read');
    setStatus(post.status);
    setActiveTab('editor');
    setStatusMessage(null);
  };

  const handleDeleteClick = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deletePost(postId);
      setStatusMessage({ type: 'success', text: 'Post deleted successfully.' });
      await loadAdminPosts();
      onPostsUpdated?.();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete post' });
    }
  };

  const handleSeedSamples = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      for (const sample of SAMPLE_POSTS) {
        await createPost({
          title: sample.title,
          slug: sample.slug,
          category: sample.category,
          excerpt: sample.excerpt,
          content: sample.content,
          coverImage: sample.coverImage,
          tags: sample.tags,
          readTime: sample.readTime,
          status: 'published'
        });
      }
      setStatusMessage({ type: 'success', text: 'Seeded 3 starter posts into Firebase Firestore!' });
      await loadAdminPosts();
      onPostsUpdated?.();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to seed sample posts' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isAdmin = currentUser && isUserAdmin(currentUser.email);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-surface border border-outline-variant/40 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[92vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Santosh Gharti Magar Blog Admin Portal
                </h2>
                <p className="text-xs text-on-surface-variant font-label-mono">
                  Firebase Cloud Datastore &bull; Real-time Publication
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-variant/80 border border-outline-variant/40 text-xs text-on-surface hover:text-red-400 transition-colors font-label-mono"
                  title="Sign out"
                >
                  <LogOut size={14} /> Sign out
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {statusMessage && (
            <div
              className={`px-6 py-3 text-xs sm:text-sm font-label-mono flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-tertiary/20 text-emerald-300 border-b border-tertiary/30'
                  : 'bg-primary/20 text-red-300 border-b border-primary/30'
              }`}
            >
              {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Body Content */}
          <div className="overflow-y-auto p-6 sm:p-8 flex-1">
            {!currentUser ? (
              /* Auth Prompt */
              <div className="max-w-md mx-auto text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Admin Authentication</h3>
                  <p className="text-sm text-on-surface-variant">
                    Sign in with your authorized Google account (<code className="text-primary font-bold">{ADMIN_EMAIL}</code>) to publish, edit, or delete blog articles.
                  </p>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-white text-slate-900 font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-slate-100 transition-all cursor-pointer font-label-mono text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  {loading ? "Authenticating..." : "Sign In with Google"}
                </button>
              </div>
            ) : !isAdmin ? (
              /* Unauthorized */
              <div className="text-center py-10 space-y-4">
                <AlertCircle className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-bold text-white">Access Denied</h3>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                  You are signed in as <b>{currentUser.email}</b>. Only <b>{ADMIN_EMAIL}</b> has permission to write and update blog posts.
                </p>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-full bg-surface-variant text-sm font-label-mono hover:bg-surface-container"
                >
                  Sign Out &amp; Use Admin Account
                </button>
              </div>
            ) : (
              /* Admin Interface */
              <div className="space-y-6">
                {/* Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setActiveTab('manage'); setStatusMessage(null); }}
                      className={`px-5 py-2.5 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeTab === 'manage'
                          ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                          : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                      }`}
                    >
                      <FileText size={15} /> All Posts ({adminPosts.length})
                    </button>
                    <button
                      onClick={() => { resetForm(); setActiveTab('editor'); setStatusMessage(null); }}
                      className={`px-5 py-2.5 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeTab === 'editor' && !editingPostId
                          ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                          : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                      }`}
                    >
                      <Plus size={15} /> Write New Article
                    </button>
                  </div>

                  {adminPosts.length === 0 && (
                    <button
                      onClick={handleSeedSamples}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/20 text-secondary border border-secondary/30 text-xs font-label-mono hover:bg-secondary/30 transition-colors"
                    >
                      <Sparkles size={14} /> Seed 3 Sample Posts
                    </button>
                  )}
                </div>

                {/* Tab 1: Manage Posts */}
                {activeTab === 'manage' && (
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-12 text-on-surface-variant font-label-mono text-sm">
                        Loading database posts from Firebase...
                      </div>
                    ) : adminPosts.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-outline-variant/40 rounded-2xl space-y-3">
                        <FileText className="w-10 h-10 text-on-surface-variant mx-auto opacity-50" />
                        <p className="text-on-surface-variant text-sm font-label-mono">No blog posts found in Firestore yet.</p>
                        <button
                          onClick={handleSeedSamples}
                          disabled={saving}
                          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold font-label-mono glow-btn"
                        >
                          Populate 3 Starter Articles
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {adminPosts.map((post) => (
                          <div
                            key={post.id}
                            className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-outline-variant transition-all"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-0.5 rounded text-[11px] font-label-mono uppercase font-bold ${
                                  post.status === 'published' ? 'bg-tertiary/20 text-emerald-400 border border-tertiary/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                }`}>
                                  {post.status}
                                </span>
                                <span className="text-xs text-on-surface-variant font-label-mono">
                                  {post.category} &bull; {post.readTime}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white truncate">{post.title}</h4>
                              <p className="text-xs text-on-surface-variant line-clamp-1">{post.excerpt}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleEditClick(post)}
                                className="px-3 py-1.5 rounded-lg bg-surface-variant text-xs font-label-mono text-on-surface hover:text-white flex items-center gap-1.5 border border-outline-variant/40"
                              >
                                <Edit3 size={14} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(post.id)}
                                className="p-2 rounded-lg bg-surface-variant text-xs text-on-surface-variant hover:text-red-400 border border-outline-variant/40"
                                title="Delete article"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Editor */}
                {activeTab === 'editor' && (
                  <form onSubmit={handleSavePost} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">
                        {editingPostId ? "Edit Blog Article" : "Compose New Article"}
                      </h3>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-on-surface-variant hover:text-white font-label-mono"
                      >
                        Clear Form
                      </button>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. 5 AI Web Strategies That Boost Conversions in 2026"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/50 text-white placeholder-slate-500 focus:outline-none focus:border-primary text-base"
                      />
                    </div>

                    {/* Slug & Category */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                          URL Slug *
                        </label>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="ai-web-strategies-2026"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-white font-label-mono text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                          Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-white text-xs font-label-mono focus:outline-none focus:border-primary"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="bg-surface">{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                        Short Excerpt / Teaser (10-300 chars) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary that appears on blog cards and Google snippets..."
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Cover Image Presets */}
                    <div className="space-y-2">
                      <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                        Cover Image URL
                      </label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {COVER_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setCoverImage(preset.url)}
                            className={`px-3 py-1 rounded-lg text-xs font-label-mono border transition-colors ${
                              coverImage === preset.url
                                ? 'bg-primary/20 border-primary text-primary font-bold'
                                : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/50 text-white text-xs font-label-mono focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Full Article Content */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                          Full Article Content *
                        </label>
                        <span className="text-[11px] text-on-surface-variant font-label-mono">
                          Supports Markdown (## Heading, ### Subheading, - Bullet list)
                        </span>
                      </div>
                      <textarea
                        required
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your article here...&#10;&#10;### Introduction&#10;In this article we discuss...&#10;&#10;- Key point 1&#10;- Key point 2"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/50 text-white text-sm font-sans focus:outline-none focus:border-primary leading-relaxed"
                      />
                    </div>

                    {/* Tags, Read Time, Status */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          placeholder="AI, Web, Next.js"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-white text-xs font-label-mono focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          placeholder="4 min read"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-white text-xs font-label-mono focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-label-mono uppercase text-on-surface-variant tracking-wider">
                          Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-white text-xs font-label-mono focus:outline-none focus:border-primary"
                        >
                          <option value="published">Published (Live)</option>
                          <option value="draft">Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
                      <button
                        type="button"
                        onClick={() => setActiveTab('manage')}
                        className="px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-variant text-xs font-label-mono text-on-surface transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs font-label-mono uppercase tracking-wider glow-btn hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                      >
                        <UploadCloud size={16} />
                        {saving ? "Saving to Cloud..." : editingPostId ? "Update Article" : "Publish Article"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
