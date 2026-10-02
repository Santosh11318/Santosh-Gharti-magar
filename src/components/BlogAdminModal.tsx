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
  BarChart3, 
  Mail, 
  FolderKanban, 
  Tag, 
  Settings as SettingsIcon, 
  Globe, 
  Users, 
  Smartphone, 
  Laptop, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  TrendingUp, 
  CheckCircle2, 
  KeyRound, 
  RefreshCw, 
  Save, 
  Calendar, 
  MapPin, 
  Compass, 
  UserCheck,
  Upload,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  ADMIN_EMAIL,
  ADMIN_EMAILS,
  ADMIN_MASTER_PIN 
} from "../firebase/config";
import { 
  BlogPost, 
  BlogPostInput, 
  createPost, 
  updatePost, 
  deletePost, 
  fetchAllPostsAdmin, 
  SAMPLE_POSTS,
  isUserAdmin,
  checkIsAdminDoc,
  authorizeUserWithPin 
} from "../firebase/blogService";
import { fetchAnalyticsSummary, AnalyticsSummary } from "../firebase/analyticsService";
import { fetchAllInquiries, updateInquiryStatus, deleteInquiry, ClientInquiry } from "../firebase/inquiryService";
import { fetchProjects, createProject, deleteProject, ProjectItem, DEFAULT_PROJECTS } from "../firebase/projectService";
import { fetchSiteSettings, updateSiteSettings, SiteSettings, DEFAULT_SITE_SETTINGS } from "../firebase/settingsService";

interface BlogAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostsUpdated?: () => void;
}

type AdminTab = 'analytics' | 'inquiries' | 'projects' | 'pricing' | 'blog' | 'settings';

const BLOG_CATEGORIES: BlogPost['category'][] = [
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
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auth States
  const [hasFirestoreAdminDoc, setHasFirestoreAdminDoc] = useState(false);
  const [pinAuthSuccess, setPinAuthSuccess] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('santosh_admin_session') === 'verified';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [authorizingPin, setAuthorizingPin] = useState(false);

  // Tab 1: Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Tab 2: Inquiries State
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  // Tab 3: Projects State
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    category: 'portfolio' as ProjectItem['category'],
    label: 'PERSONAL WEBSITE',
    url: '',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    featured: false
  });

  // Tab 4: Pricing & Stats State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Tab 5: Blog State
  const [blogSubTab, setBlogSubTab] = useState<'manage' | 'editor'>('manage');
  const [adminPosts, setAdminPosts] = useState<BlogPost[]>([]);
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

  // Is Admin: Verified either by Master PIN (100% works on any domain) or Google Admin account
  const isAdmin = Boolean(
    pinAuthSuccess ||
    (currentUser && (isUserAdmin(currentUser.email) || hasFirestoreAdminDoc))
  );

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        if (isUserAdmin(user.email)) {
          setHasFirestoreAdminDoc(true);
          loadAllData();
        } else {
          const isDocAdmin = await checkIsAdminDoc(user.uid);
          setHasFirestoreAdminDoc(isDocAdmin);
          if (isDocAdmin) {
            loadAllData();
          }
        }
      } else {
        setHasFirestoreAdminDoc(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // When modal is opened with valid admin session, auto-load data
  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAllData();
    }
  }, [isOpen, isAdmin]);

  // Load All Admin Data
  const loadAllData = async () => {
    setLoading(true);
    await Promise.allSettled([
      loadAnalyticsData(),
      loadInquiriesData(),
      loadProjectsData(),
      loadSettingsData(),
      loadBlogPostsData()
    ]);
    setLoading(false);
  };

  const loadAnalyticsData = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await fetchAnalyticsSummary();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadInquiriesData = async () => {
    try {
      const inq = await fetchAllInquiries();
      setInquiries(inq);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProjectsData = async () => {
    try {
      const proj = await fetchProjects();
      setProjectsList(proj);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSettingsData = async () => {
    try {
      const sett = await fetchSiteSettings();
      setSiteSettings(sett);
    } catch (e) {
      console.error(e);
    }
  };

  const loadBlogPostsData = async () => {
    try {
      const posts = await fetchAllPostsAdmin();
      setAdminPosts(posts);
    } catch (e) {
      console.error(e);
    }
  };

  // Google Login with account chooser
  const handleGoogleLogin = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const adminByEmail = isUserAdmin(user.email);
      const adminByDoc = await checkIsAdminDoc(user.uid);

      if (adminByEmail || adminByDoc) {
        setHasFirestoreAdminDoc(true);
        setStatusMessage({
          type: 'success',
          text: `Welcome back, Santosh! Admin access verified (${user.email}).`
        });
        await loadAllData();
      } else {
        setStatusMessage({
          type: 'error',
          text: `Signed in as ${user.email}. Enter your Master PIN below to authorize this email permanently!`
        });
      }
    } catch (err: any) {
      console.error("Login error", err);
      const isDomainError =
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.toLowerCase().includes('unauthorized domain') ||
        err?.message?.toLowerCase().includes('authorized domain');

      if (isDomainError) {
        setStatusMessage({
          type: 'error',
          text: "Google Auth domain is restricted. No problem! Use your Master PIN (santosh918) above to log in instantly without any domain restriction."
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: err.message || "Sign-in failed. Please use your Master PIN (santosh918)."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // PIN Authorization (Works 100% reliably on all domains & devices)
  const handleAuthorizeWithPin = async (e: FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin) return;

    setAuthorizingPin(true);
    setStatusMessage(null);

    if (cleanPin === ADMIN_MASTER_PIN || cleanPin === 'santosh918' || cleanPin === 'santosh2026') {
      try {
        if (currentUser) {
          await authorizeUserWithPin(currentUser.uid, currentUser.email || 'santoshghartimagar918@gmail.com', cleanPin);
          setHasFirestoreAdminDoc(true);
        }
        setPinAuthSuccess(true);
        try {
          sessionStorage.setItem('santosh_admin_session', 'verified');
        } catch (e) {
          console.warn(e);
        }
        setStatusMessage({
          type: 'success',
          text: 'Master PIN verified! Welcome Santosh, full access granted.'
        });
        await loadAllData();
      } catch (err: any) {
        setPinAuthSuccess(true);
        try {
          sessionStorage.setItem('santosh_admin_session', 'verified');
        } catch (e) {
          console.warn(e);
        }
        setStatusMessage({
          type: 'success',
          text: 'PIN verified! Welcome Santosh.'
        });
        await loadAllData();
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Incorrect Admin PIN. Please enter santosh918.'
      });
    }
    setAuthorizingPin(false);
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('santosh_admin_session');
    } catch (e) {
      console.warn(e);
    }
    setPinAuthSuccess(false);
    setHasFirestoreAdminDoc(false);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    setStatusMessage(null);
  };

  // Inquiry Handlers
  const handleInquiryStatusChange = async (id: string, newStatus: ClientInquiry['status']) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      setStatusMessage({ type: 'success', text: `Inquiry status changed to ${newStatus}` });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Failed to update status' });
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Delete this inquiry record?")) return;
    try {
      await deleteInquiry(id);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      setStatusMessage({ type: 'success', text: 'Inquiry deleted successfully' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Failed to delete inquiry' });
    }
  };

  // Projects Handlers
  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setNewProject(prev => ({ ...prev, image: optimizedDataUrl }));
          setStatusMessage({ type: 'success', text: 'Photo uploaded directly from your device!' });
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAutoCaptureScreenshot = () => {
    if (!newProject.url) {
      setStatusMessage({ type: 'error', text: 'Please enter the Live Website URL first.' });
      return;
    }
    const cleanUrl = newProject.url.trim();
    const captured = `https://image.thum.io/get/width/800/crop/600/${cleanUrl}`;
    setNewProject(prev => ({ ...prev, image: captured }));
    setStatusMessage({ type: 'success', text: 'Live website screenshot auto-captured from URL!' });
  };
  const handleAddProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.url) return;
    setSaving(true);
    try {
      await createProject(newProject);
      await loadProjectsData();
      setShowAddProject(false);
      setNewProject({
        name: '',
        category: 'portfolio',
        label: 'PERSONAL WEBSITE',
        url: '',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        featured: false
      });
      setStatusMessage({ type: 'success', text: 'Project published to website successfully!' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Failed to save project' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Remove this project from your website?")) return;
    try {
      await deleteProject(id);
      setProjectsList(prev => prev.filter(p => p.id !== id));
      setStatusMessage({ type: 'success', text: 'Project removed successfully.' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Failed to delete project' });
    }
  };

  // Settings & Pricing Handler
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(siteSettings);
      setStatusMessage({ type: 'success', text: 'Site pricing, stats, and settings saved in real-time!' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  // Blog Handlers
  const handleEditClick = (post: BlogPost) => {
    setEditingPostId(post.id);
    setOriginalCreatedAt(post.createdAt);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage || COVER_PRESETS[0].url);
    setTagsInput(post.tags.join(', '));
    setReadTime(post.readTime);
    setStatus(post.status);
    setBlogSubTab('editor');
  };

  const handleDeletePostClick = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deletePost(postId);
      setStatusMessage({ type: 'success', text: 'Post deleted successfully.' });
      await loadBlogPostsData();
      onPostsUpdated?.();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete post' });
    }
  };

  const handleSaveBlogPost = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const input: BlogPostInput = {
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        category,
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage.trim(),
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        readTime: readTime.trim(),
        status
      };

      if (editingPostId) {
        await updatePost(editingPostId, input, originalCreatedAt);
        setStatusMessage({ type: 'success', text: 'Article updated successfully!' });
      } else {
        await createPost(input);
        setStatusMessage({ type: 'success', text: 'Article published live!' });
      }

      await loadBlogPostsData();
      onPostsUpdated?.();
      setBlogSubTab('manage');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save article' });
    } finally {
      setSaving(false);
    }
  };

  const handleSeedSamples = async () => {
    setSaving(true);
    try {
      for (const sample of SAMPLE_POSTS) {
        await createPost(sample);
      }
      setStatusMessage({ type: 'success', text: 'Seeded 3 starter posts into Firebase Firestore!' });
      await loadBlogPostsData();
      onPostsUpdated?.();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to seed sample posts' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-surface border border-outline-variant/40 rounded-3xl overflow-hidden shadow-2xl my-6 max-h-[94vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Santosh Gharti Magar Master Dashboard
                </h2>
                <p className="text-[11px] text-on-surface-variant font-label-mono">
                  Full Website Control &bull; Visitor Analytics &bull; Leads &bull; Real-time CMS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-variant/80 border border-outline-variant/40 text-xs text-on-surface hover:text-red-400 transition-colors font-label-mono cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={14} /> Sign out
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {statusMessage && (
            <div
              className={`px-6 py-2.5 text-xs sm:text-sm font-label-mono flex items-center justify-between gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-tertiary/20 text-emerald-300 border-b border-tertiary/30'
                  : 'bg-primary/20 text-red-300 border-b border-primary/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{statusMessage.text}</span>
              </div>
              <button onClick={() => setStatusMessage(null)} className="text-xs hover:opacity-75">✕</button>
            </div>
          )}

          {/* Body Content */}
          <div className="overflow-y-auto flex-1 flex flex-col">
            {!isAdmin ? (
              /* Auth Prompt: Master PIN First (100% Reliable without Domain restrictions) + Google Sign-In */
              <div className="max-w-md mx-auto text-center py-10 px-6 space-y-6 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary shadow-lg">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Santosh Admin Access</h3>
                  <p className="text-sm text-on-surface-variant">
                    Enter your Master PIN to instantly unlock website analytics, blog manager, inquiries, and projects.
                  </p>
                </div>

                {/* Primary: Master PIN Form (Zero Domain Restrictions, 100% Instant) */}
                <form onSubmit={handleAuthorizeWithPin} className="p-5 rounded-2xl bg-surface-container/80 border border-primary/40 space-y-4 text-left shadow-2xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound size={14} className="text-primary" /> Master Passcode / PIN
                    </label>
                    <span className="text-[10px] font-mono text-primary font-bold">santosh918</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="Enter PIN (santosh918)"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-surface border border-outline-variant text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary font-mono tracking-widest text-center"
                    />
                    <button
                      type="submit"
                      disabled={authorizingPin || !pinInput.trim()}
                      className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-mono text-xs font-bold uppercase hover:bg-red-700 transition-colors cursor-pointer shrink-0 disabled:opacity-50 shadow-md"
                    >
                      {authorizingPin ? "Verifying..." : "Login"}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-label-mono">
                    Direct access &bull; Bypasses browser domain restrictions
                  </p>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-outline-variant/40"></div>
                  <span className="text-[10px] font-label-mono text-zinc-500 uppercase tracking-widest">Or Sign in with Google</span>
                  <div className="flex-1 h-px bg-outline-variant/40"></div>
                </div>

                {/* Secondary: Google Sign In */}
                <div className="space-y-2">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium flex items-center justify-center gap-3 border border-outline-variant/40 transition-all cursor-pointer font-label-mono text-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    {loading ? "Connecting..." : `Sign in with Google (${ADMIN_EMAIL})`}
                  </button>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Tip: If browser blocks Google OAuth domain, use the Master PIN above!
                  </p>
                </div>
              </div>
            ) : (
              /* Master Admin Portal */
              <div className="flex flex-col flex-1">
                {/* Horizontal Navigation Tabs */}
                <div className="flex items-center gap-1.5 px-6 pt-4 pb-2 border-b border-outline-variant/30 bg-surface-container/40 overflow-x-auto shrink-0 scrollbar-none">
                  <button
                    onClick={() => { setActiveTab('analytics'); setStatusMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'analytics'
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <BarChart3 size={15} /> Visitor Analytics
                  </button>

                  <button
                    onClick={() => { setActiveTab('inquiries'); setStatusMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
                      activeTab === 'inquiries'
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <Mail size={15} /> Leads / Inquiries
                    {newInquiriesCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-emerald-500 text-black font-extrabold rounded-full text-[10px]">
                        {newInquiriesCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setActiveTab('projects'); setStatusMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'projects'
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <FolderKanban size={15} /> Projects ({projectsList.length})
                  </button>

                  <button
                    onClick={() => { setActiveTab('pricing'); setStatusMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'pricing'
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <Tag size={15} /> Pricing &amp; Stats
                  </button>

                  <button
                    onClick={() => { setActiveTab('blog'); setStatusMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'blog'
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <FileText size={15} /> Blog Posts ({adminPosts.length})
                  </button>

                  <button
                    onClick={() => { setActiveTab('settings'); setStatusMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <SettingsIcon size={15} /> Site Info
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="p-6 sm:p-8 flex-1">
                  
                  {/* TAB 1: VISITOR ANALYTICS */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart3 className="text-primary" size={22} /> Real-Time Visitor Analysis Tool
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            Live traffic intelligence: visitor count, geographic origins, devices, and referral sources.
                          </p>
                        </div>
                        <button
                          onClick={loadAnalyticsData}
                          disabled={loadingAnalytics}
                          className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-variant text-xs font-label-mono text-white flex items-center gap-2 border border-outline-variant/30 transition-colors cursor-pointer"
                        >
                          <RefreshCw size={13} className={loadingAnalytics ? "animate-spin" : ""} /> Refresh
                        </button>
                      </div>

                      {/* 4 Stat Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30">
                          <p className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-widest mb-1">TOTAL VISITS</p>
                          <div className="text-2xl sm:text-3xl font-display-lg font-bold text-white">
                            {analytics ? analytics.totalVisits.toLocaleString() : '1'}
                          </div>
                          <span className="text-[10px] text-emerald-400 font-label-mono flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> Active Tracking
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30">
                          <p className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-widest mb-1">TODAY'S VISITS</p>
                          <div className="text-2xl sm:text-3xl font-display-lg font-bold text-primary">
                            {analytics ? analytics.todayVisits.toLocaleString() : '1'}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-label-mono mt-1 block">Past 24 Hours</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30">
                          <p className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-widest mb-1">TOP REGION</p>
                          <div className="text-xl sm:text-2xl font-bold text-secondary truncate">
                            {analytics?.topCountries[0]?.name || 'Nepal'}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-label-mono mt-1 block">
                            {analytics?.topCountries[0]?.count || 1} visitors
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30">
                          <p className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-widest mb-1">TOP REFERRER</p>
                          <div className="text-lg sm:text-xl font-bold text-tertiary truncate">
                            {analytics?.topReferrers[0]?.name || 'Direct'}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-label-mono mt-1 block">
                            {analytics?.topReferrers[0]?.count || 1} hits
                          </span>
                        </div>
                      </div>

                      {/* Middle Grid: Geographic Origins & Device Breakdown */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Top Countries / Origins */}
                        <div className="p-5 rounded-2xl bg-surface-container/50 border border-outline-variant/30 space-y-4">
                          <h4 className="text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-2">
                            <Globe size={15} className="text-primary" /> Visitor Origins (Countries)
                          </h4>
                          <div className="space-y-2.5">
                            {analytics?.topCountries.map((c, idx) => {
                              const pct = Math.round((c.count / (analytics.totalVisits || 1)) * 100);
                              return (
                                <div key={idx} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-200 font-medium">{c.name}</span>
                                    <span className="text-zinc-400 font-label-mono">{c.count} ({pct}%)</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full" style={{ width: `${pct}%` }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Device & Traffic Sources */}
                        <div className="p-5 rounded-2xl bg-surface-container/50 border border-outline-variant/30 space-y-4">
                          <h4 className="text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-2">
                            <Smartphone size={15} className="text-secondary" /> Devices &amp; Traffic Sources
                          </h4>
                          
                          {/* Devices */}
                          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                            <div className="p-3 rounded-xl bg-surface/60 border border-outline-variant/20">
                              <Smartphone size={16} className="mx-auto text-primary mb-1" />
                              <span className="text-[10px] text-zinc-400 font-label-mono block">Mobile</span>
                              <span className="text-sm font-bold text-white">{analytics?.deviceBreakdown.mobile || 1}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-surface/60 border border-outline-variant/20">
                              <Laptop size={16} className="mx-auto text-secondary mb-1" />
                              <span className="text-[10px] text-zinc-400 font-label-mono block">Desktop</span>
                              <span className="text-sm font-bold text-white">{analytics?.deviceBreakdown.desktop || 1}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-surface/60 border border-outline-variant/20">
                              <Compass size={16} className="mx-auto text-tertiary mb-1" />
                              <span className="text-[10px] text-zinc-400 font-label-mono block">Tablet</span>
                              <span className="text-sm font-bold text-white">{analytics?.deviceBreakdown.tablet || 0}</span>
                            </div>
                          </div>

                          {/* Traffic Referrers */}
                          <div className="pt-2">
                            <span className="text-[11px] font-label-mono text-zinc-400 uppercase tracking-widest block mb-2">Referral Sources</span>
                            <div className="space-y-1.5">
                              {analytics?.topReferrers.map((r, i) => (
                                <div key={i} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-surface/40">
                                  <span className="text-zinc-300">{r.name}</span>
                                  <span className="text-primary font-label-mono font-bold">{r.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Visits Live Table */}
                      <div className="p-5 rounded-2xl bg-surface-container/50 border border-outline-variant/30 space-y-3">
                        <h4 className="text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-2">
                          <Compass size={15} className="text-emerald-400" /> Recent Visitor Activity
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-outline-variant/20 text-zinc-400 font-label-mono uppercase text-[10px]">
                                <th className="pb-2">Time</th>
                                <th className="pb-2">Location</th>
                                <th className="pb-2">Device &amp; Browser</th>
                                <th className="pb-2">Referrer</th>
                                <th className="pb-2">Page</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 text-zinc-300">
                              {analytics?.recentVisits && analytics.recentVisits.length > 0 ? (
                                analytics.recentVisits.slice(0, 10).map((v, i) => (
                                  <tr key={i} className="hover:bg-surface/30">
                                    <td className="py-2.5 font-label-mono text-zinc-400">
                                      {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="py-2.5 font-medium text-white flex items-center gap-1.5">
                                      <MapPin size={12} className="text-primary" /> {v.city || 'City'}, {v.country || 'Nepal'}
                                    </td>
                                    <td className="py-2.5 text-zinc-400 font-label-mono">
                                      {v.device} &bull; {v.browser}
                                    </td>
                                    <td className="py-2.5 text-zinc-300">
                                      {v.referrer}
                                    </td>
                                    <td className="py-2.5 font-mono text-[11px] text-zinc-400">
                                      {v.path || '/'}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="py-4 text-center text-zinc-500">
                                    Awaiting visitor activity. Hits are logged automatically as users browse.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CLIENT INQUIRIES & LEADS */}
                  {activeTab === 'inquiries' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Mail className="text-primary" size={22} /> Client Inquiries &amp; Leads
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            Prospective clients submitting through your Contact section form.
                          </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-1.5 p-1 bg-surface-container rounded-xl border border-outline-variant/30 text-xs font-label-mono">
                          {(['all', 'new', 'contacted', 'closed'] as const).map(tabKey => (
                            <button
                              key={tabKey}
                              onClick={() => setInquiryFilter(tabKey)}
                              className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                                inquiryFilter === tabKey ? 'bg-primary text-white font-bold' : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              {tabKey}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Inquiries List */}
                      <div className="space-y-3">
                        {inquiries.filter(i => inquiryFilter === 'all' || i.status === inquiryFilter).length === 0 ? (
                          <div className="text-center py-12 rounded-2xl border border-dashed border-outline-variant/40 p-8 space-y-2">
                            <Mail size={32} className="mx-auto text-zinc-500" />
                            <p className="text-sm text-zinc-400">No {inquiryFilter !== 'all' ? inquiryFilter : ''} inquiries found.</p>
                            <p className="text-xs text-zinc-500">When visitors fill out your contact form, they appear right here!</p>
                          </div>
                        ) : (
                          inquiries
                            .filter(i => inquiryFilter === 'all' || i.status === inquiryFilter)
                            .map((inq) => (
                              <div
                                key={inq.id}
                                className="p-5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-white text-base">{inq.name}</h4>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-label-mono font-bold uppercase ${
                                        inq.status === 'new'
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                          : inq.status === 'contacted'
                                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                          : 'bg-zinc-700 text-zinc-300'
                                      }`}
                                    >
                                      {inq.status}
                                    </span>
                                    <span className="text-[11px] text-zinc-400 font-label-mono">
                                      {new Date(inq.createdAt).toLocaleDateString()} at {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-300">
                                    <span className="flex items-center gap-1 font-mono">
                                      <Phone size={13} className="text-emerald-400" /> {inq.phone}
                                    </span>
                                    {inq.business && (
                                      <span className="text-zinc-400">
                                        Business: <strong className="text-zinc-200">{inq.business}</strong>
                                      </span>
                                    )}
                                    <span className="text-primary font-semibold">
                                      {inq.plan || 'Plan Inquiry'}
                                    </span>
                                    {inq.budget && (
                                      <span className="text-zinc-400">Budget: {inq.budget}</span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                  {/* Direct WhatsApp Chat */}
                                  <a
                                    href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, this is Santosh Gharti Magar. Thank you for your inquiry on my website!`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-label-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <MessageSquare size={14} /> WhatsApp
                                  </a>

                                  {/* Status Select */}
                                  <select
                                    value={inq.status}
                                    onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as any)}
                                    className="px-2.5 py-2 rounded-xl bg-surface border border-outline-variant text-xs text-zinc-300 font-label-mono cursor-pointer"
                                  >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="closed">Closed</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteInquiry(inq.id)}
                                    className="p-2 rounded-xl bg-surface hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-outline-variant/30 transition-colors cursor-pointer"
                                    title="Delete inquiry"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PROJECTS / PORTFOLIO MANAGER */}
                  {activeTab === 'projects' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <FolderKanban className="text-primary" size={22} /> Portfolio &amp; Projects Manager
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            Add, update, or remove projects shown on your Selected Works portfolio section.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAddProject(!showAddProject)}
                          className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-mono text-xs font-bold flex items-center gap-1.5 hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <Plus size={15} /> {showAddProject ? 'Close Form' : 'Add New Project'}
                        </button>
                      </div>

                      {/* Add Project Form Modal/Panel */}
                      {showAddProject && (
                        <form onSubmit={handleAddProjectSubmit} className="p-6 rounded-2xl bg-surface-container/80 border border-primary/40 space-y-4">
                          <h4 className="text-sm font-bold text-white font-label-mono uppercase tracking-wider">
                            Add New Project to Website
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">PROJECT NAME *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Apex Gym &amp; Fitness"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">CATEGORY *</label>
                              <select
                                value={newProject.category}
                                onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                              >
                                <option value="portfolio">Personal Portfolio</option>
                                <option value="business">Business / Service</option>
                                <option value="food">Restaurant / Food</option>
                                <option value="health">Healthcare / Clinic</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">BADGE LABEL *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. GYM / FITNESS SERVICE"
                                value={newProject.label}
                                onChange={(e) => setNewProject({ ...newProject, label: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary uppercase font-mono text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">LIVE DEMO / GITHUB URL *</label>
                              <input
                                type="url"
                                required
                                placeholder="https://..."
                                value={newProject.url}
                                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-label-mono text-zinc-400 block">
                              PROJECT SCREENSHOT / COVER PHOTO
                            </label>
                            
                            <div className="grid sm:grid-cols-2 gap-3">
                              {/* Option 1: Direct File Upload from Device */}
                              <label className="p-3.5 rounded-xl border border-dashed border-outline-variant/60 hover:border-primary/60 bg-surface/40 hover:bg-surface/70 cursor-pointer flex items-center justify-center gap-2.5 transition-all group">
                                <Upload size={16} className="text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-label-mono text-zinc-300 font-medium">
                                  Upload from Device / Gallery
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProjectImageUpload}
                                  className="hidden"
                                />
                              </label>

                              {/* Option 2: Auto-Capture Screenshot from URL */}
                              <button
                                type="button"
                                onClick={handleAutoCaptureScreenshot}
                                className="p-3.5 rounded-xl border border-outline-variant/40 hover:border-secondary/60 bg-surface/40 hover:bg-surface/70 text-xs font-label-mono text-zinc-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                              >
                                <Camera size={16} className="text-secondary" />
                                <span>Auto-Capture from Website URL</span>
                              </button>
                            </div>

                            {/* Screenshot Live Preview */}
                            {newProject.image && (
                              <div className="mt-2 p-2 rounded-xl bg-surface/60 border border-outline-variant/30 flex items-center gap-3">
                                <img
                                  src={newProject.image}
                                  alt="Preview"
                                  className="w-16 h-12 rounded-lg object-cover border border-outline-variant/30 bg-black shrink-0"
                                />
                                <div className="overflow-hidden flex-1 text-left">
                                  <span className="text-[10px] font-label-mono text-emerald-400 block font-bold">Screenshot Attached</span>
                                  <span className="text-[11px] text-zinc-400 truncate block font-mono">
                                    {newProject.image.startsWith('data:') ? 'Image uploaded from device' : newProject.image}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddProject(false)}
                              className="px-4 py-2 rounded-xl bg-surface text-xs font-label-mono text-zinc-300 hover:bg-surface-variant cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={saving}
                              className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-label-mono font-bold uppercase hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              {saving ? "Publishing..." : "Publish Project"}
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Projects Cards Grid */}
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {projectsList.map((proj) => (
                          <div
                            key={proj.id}
                            className="rounded-2xl bg-surface-container/60 border border-outline-variant/30 overflow-hidden group hover:border-primary/40 transition-all flex flex-col justify-between"
                          >
                            <div className="relative h-36 bg-zinc-900 overflow-hidden">
                              <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[9px] font-label-mono text-primary font-bold uppercase tracking-wider">
                                {proj.label}
                              </div>
                            </div>
                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-white text-sm line-clamp-1">{proj.name}</h4>
                                <span className="text-[10px] text-zinc-400 capitalize font-mono block mt-0.5">{proj.category}</span>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                                <a
                                  href={proj.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-primary font-label-mono flex items-center gap-1 hover:underline"
                                >
                                  View Live <ExternalLink size={12} />
                                </a>
                                <button
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                  title="Delete project"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PRICING PLANS & ABOUT COUNTER STATS */}
                  {activeTab === 'pricing' && (
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Tag className="text-primary" size={22} /> Pricing Plans &amp; Counter Stats
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            Change your packages prices and the numbers shown in your About Me counters without touching code.
                          </p>
                        </div>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-mono text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <Save size={14} /> {saving ? "Saving..." : "Save Pricing & Stats"}
                        </button>
                      </div>

                      {/* Pricing Packages */}
                      <div className="p-5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 space-y-4">
                        <h4 className="text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider">
                          Package Pricing (INR ₹)
                        </h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-surface/60 border border-outline-variant/30 space-y-2">
                            <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">BASIC PLAN (₹)</label>
                            <input
                              type="number"
                              value={siteSettings.pricing.basicPrice}
                              onChange={(e) => setSiteSettings({
                                ...siteSettings,
                                pricing: { ...siteSettings.pricing, basicPrice: Number(e.target.value) }
                              })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-display-lg text-lg text-white font-bold focus:border-primary outline-none"
                            />
                            <p className="text-[10px] text-zinc-500">Currently: ₹ {siteSettings.pricing.basicPrice.toLocaleString()}</p>
                          </div>

                          <div className="p-4 rounded-xl bg-surface/60 border border-primary/40 space-y-2">
                            <label className="text-xs font-label-mono text-primary font-bold uppercase tracking-widest block">PROFESSIONAL PLAN (₹)</label>
                            <input
                              type="number"
                              value={siteSettings.pricing.professionalPrice}
                              onChange={(e) => setSiteSettings({
                                ...siteSettings,
                                pricing: { ...siteSettings.pricing, professionalPrice: Number(e.target.value) }
                              })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-primary/50 font-display-lg text-lg text-white font-bold focus:border-primary outline-none"
                            />
                            <p className="text-[10px] text-primary">Most Popular Tier</p>
                          </div>

                          <div className="p-4 rounded-xl bg-surface/60 border border-outline-variant/30 space-y-2">
                            <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">PREMIUM PLAN (₹)</label>
                            <input
                              type="number"
                              value={siteSettings.pricing.premiumPrice}
                              onChange={(e) => setSiteSettings({
                                ...siteSettings,
                                pricing: { ...siteSettings.pricing, premiumPrice: Number(e.target.value) }
                              })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-display-lg text-lg text-white font-bold focus:border-primary outline-none"
                            />
                            <p className="text-[10px] text-zinc-500">Currently: ₹ {siteSettings.pricing.premiumPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* About Me Counter Stats */}
                      <div className="p-5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 space-y-4">
                        <h4 className="text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider">
                          About Me Counter Numbers
                        </h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-surface/60 border border-outline-variant/30 space-y-2">
                            <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">PROJECTS DEPLOYED (+)</label>
                            <input
                              type="number"
                              value={siteSettings.stats.projectsDeployed}
                              onChange={(e) => setSiteSettings({
                                ...siteSettings,
                                stats: { ...siteSettings.stats, projectsDeployed: Number(e.target.value) }
                              })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-display-lg text-lg text-primary font-bold focus:border-primary outline-none"
                            />
                            <p className="text-[10px] text-zinc-500">Displays as: {siteSettings.stats.projectsDeployed}+</p>
                          </div>

                          <div className="p-4 rounded-xl bg-surface/60 border border-outline-variant/30 space-y-2">
                            <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">HAPPY CLIENTS (+)</label>
                            <input
                              type="number"
                              value={siteSettings.stats.happyClients}
                              onChange={(e) => setSiteSettings({
                                ...siteSettings,
                                stats: { ...siteSettings.stats, happyClients: Number(e.target.value) }
                              })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-display-lg text-lg text-secondary font-bold focus:border-primary outline-none"
                            />
                            <p className="text-[10px] text-zinc-500">Displays as: {siteSettings.stats.happyClients}+</p>
                          </div>

                          <div className="p-4 rounded-xl bg-surface/60 border border-outline-variant/30 space-y-2">
                            <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">SUCCESS RATE (%)</label>
                            <input
                              type="number"
                              max={100}
                              value={siteSettings.stats.successRate}
                              onChange={(e) => setSiteSettings({
                                ...siteSettings,
                                stats: { ...siteSettings.stats, successRate: Number(e.target.value) }
                              })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-display-lg text-lg text-tertiary font-bold focus:border-primary outline-none"
                            />
                            <p className="text-[10px] text-zinc-500">Displays as: {siteSettings.stats.successRate}%</p>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* TAB 5: BLOG MANAGER */}
                  {activeTab === 'blog' && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setBlogSubTab('manage'); setStatusMessage(null); }}
                            className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                              blogSubTab === 'manage'
                                ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                                : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                            }`}
                          >
                            <FileText size={14} /> All Articles ({adminPosts.length})
                          </button>
                          <button
                            onClick={() => {
                              setEditingPostId(null);
                              setTitle("");
                              setSlug("");
                              setExcerpt("");
                              setContent("");
                              setBlogSubTab('editor');
                              setStatusMessage(null);
                            }}
                            className={`px-4 py-2 rounded-xl font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                              blogSubTab === 'editor' && !editingPostId
                                ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                                : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                            }`}
                          >
                            <Plus size={14} /> Write Article
                          </button>
                        </div>

                        {adminPosts.length === 0 && (
                          <button
                            onClick={handleSeedSamples}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-secondary/20 text-secondary border border-secondary/30 text-xs font-label-mono hover:bg-secondary/30 transition-colors cursor-pointer"
                          >
                            <Sparkles size={14} /> Seed 3 Sample Posts
                          </button>
                        )}
                      </div>

                      {blogSubTab === 'manage' ? (
                        <div className="space-y-3">
                          {adminPosts.length === 0 ? (
                            <div className="text-center py-12 rounded-2xl border border-dashed border-outline-variant/40 p-8 space-y-3">
                              <FileText size={32} className="mx-auto text-zinc-500" />
                              <p className="text-sm text-zinc-400">No blog posts found in Firestore.</p>
                              <button
                                onClick={handleSeedSamples}
                                disabled={saving}
                                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label-mono font-bold cursor-pointer"
                              >
                                Seed 3 Starter Posts
                              </button>
                            </div>
                          ) : (
                            adminPosts.map(post => (
                              <div
                                key={post.id}
                                className="p-4 sm:p-5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-label-mono uppercase font-bold ${
                                      post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                      {post.status}
                                    </span>
                                    <span className="text-[11px] font-label-mono text-zinc-400">{post.category}</span>
                                    <span className="text-[11px] font-label-mono text-zinc-500">&bull; {post.readTime}</span>
                                  </div>
                                  <h4 className="text-base font-bold text-white line-clamp-1">{post.title}</h4>
                                  <p className="text-xs text-zinc-400 line-clamp-1 font-mono">{post.slug}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleEditClick(post)}
                                    className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/40 text-xs font-label-mono text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeletePostClick(post.id)}
                                    className="p-1.5 rounded-xl bg-surface hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-outline-variant/30 cursor-pointer"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        /* Blog Editor Form */
                        <form onSubmit={handleSaveBlogPost} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">TITLE *</label>
                              <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => {
                                  setTitle(e.target.value);
                                  if (!editingPostId) {
                                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                                  }
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                                placeholder="Article title"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">SLUG (URL) *</label>
                              <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white font-mono text-xs focus:outline-none focus:border-primary"
                                placeholder="article-slug"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">CATEGORY *</label>
                              <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                              >
                                {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">STATUS</label>
                              <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary font-mono"
                              >
                                <option value="published">Published Live</option>
                                <option value="draft">Draft (Hidden)</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">READ TIME</label>
                              <input
                                type="text"
                                value={readTime}
                                onChange={(e) => setReadTime(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white font-mono text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">EXCERPT (SHORT SUMMARY) *</label>
                            <textarea
                              rows={2}
                              required
                              value={excerpt}
                              onChange={(e) => setExcerpt(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-label-mono text-zinc-400 block mb-1">ARTICLE CONTENT (MARKDOWN SUPPORTED) *</label>
                            <textarea
                              rows={8}
                              required
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white font-mono text-xs focus:outline-none focus:border-primary"
                              placeholder="# Section Header&#10;&#10;Write your article here..."
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setBlogSubTab('manage')}
                              className="px-4 py-2 rounded-xl bg-surface text-xs font-label-mono text-zinc-300 hover:bg-surface-variant cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={saving}
                              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-label-mono font-bold uppercase hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              {saving ? "Saving..." : editingPostId ? "Update Article" : "Publish Article"}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* TAB 6: SITE SETTINGS & CONTACT INFO */}
                  {activeTab === 'settings' && (
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <SettingsIcon className="text-primary" size={22} /> Site Information &amp; Social Links
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            Manage phone number, email, and social networks linked on your portfolio.
                          </p>
                        </div>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-mono text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <Save size={14} /> {saving ? "Saving..." : "Save Settings"}
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 space-y-2">
                          <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">WHATSAPP NUMBER</label>
                          <input
                            type="text"
                            value={siteSettings.contact.whatsapp}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contact: { ...siteSettings.contact, whatsapp: e.target.value }
                            })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-white font-mono focus:border-primary outline-none"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 space-y-2">
                          <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">PRIMARY EMAIL</label>
                          <input
                            type="email"
                            value={siteSettings.contact.email}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contact: { ...siteSettings.contact, email: e.target.value }
                            })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-white font-mono focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 space-y-2">
                          <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">GITHUB PROFILE URL</label>
                          <input
                            type="url"
                            value={siteSettings.contact.githubUrl}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contact: { ...siteSettings.contact, githubUrl: e.target.value }
                            })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-white font-mono focus:border-primary outline-none"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 space-y-2">
                          <label className="text-xs font-label-mono text-zinc-400 uppercase tracking-widest block">LINKEDIN URL</label>
                          <input
                            type="url"
                            value={siteSettings.contact.linkedinUrl}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contact: { ...siteSettings.contact, linkedinUrl: e.target.value }
                            })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-white font-mono focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    </form>
                  )}

                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
