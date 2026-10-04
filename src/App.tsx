/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Shield, Plus, Settings } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import BlogSection from "./components/BlogSection";
import BlogReaderModal from "./components/BlogReaderModal";
import BlogAdminModal from "./components/BlogAdminModal";

// Free Marketing Tools Components
import FreeToolsHub from "./tools/components/FreeToolsHub";
import SeoScoreChecker from "./tools/pages/SeoScoreChecker";
import WebsiteCostCalculator from "./tools/pages/WebsiteCostCalculator";
import MetaTagGenerator from "./tools/pages/MetaTagGenerator";
import BlogTitleGenerator from "./tools/pages/BlogTitleGenerator";
import SocialBioGenerator from "./tools/pages/SocialBioGenerator";
import HashtagGenerator from "./tools/pages/HashtagGenerator";
import QrCodeGenerator from "./tools/pages/QrCodeGenerator";
import ProfitMarginCalculator from "./tools/pages/ProfitMarginCalculator";
import GstCalculator from "./tools/pages/GstCalculator";
import ImageCompressor from "./tools/pages/ImageCompressor";

import { BlogPost, isUserAdmin } from "./firebase/blogService";
import { auth } from "./firebase/config";
import { recordVisitorHit } from "./firebase/analyticsService";

export default function App() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Client-side Navigation Router
  const navigate = useCallback((path: string) => {
    if (path.startsWith('/#')) {
      const anchor = path.replace('/', '');
      window.history.pushState(null, '', anchor);
      setCurrentPath('/');
      setTimeout(() => {
        const el = document.getElementById(anchor.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    if (path === '/') {
      window.history.pushState(null, '', '/');
      setCurrentPath('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize Visitor Analytics Hit (once per session)
  useEffect(() => {
    recordVisitorHit();
  }, []);

  // Monitor Admin Auth state silently
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isUserAdmin(user.email)) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Secret triggers: #admin or ?admin=true
  useEffect(() => {
    const handleUrlCheck = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin' || params.get('admin') === 'true' || params.get('portal') === 'admin') {
        setIsAdminModalOpen(true);
      }
    };

    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    return () => window.removeEventListener('hashchange', handleUrlCheck);
  }, []);

  // Keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A on Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to render the active view based on currentPath
  const renderContent = () => {
    switch (currentPath) {
      case '/free-tools':
        return <FreeToolsHub onNavigate={navigate} />;
      case '/free-tools/seo-score-checker':
        return <SeoScoreChecker onNavigate={navigate} />;
      case '/free-tools/website-cost-calculator':
        return <WebsiteCostCalculator onNavigate={navigate} />;
      case '/free-tools/meta-tag-generator':
        return <MetaTagGenerator onNavigate={navigate} />;
      case '/free-tools/blog-title-generator':
        return <BlogTitleGenerator onNavigate={navigate} />;
      case '/free-tools/social-bio-generator':
        return <SocialBioGenerator onNavigate={navigate} />;
      case '/free-tools/hashtag-generator':
        return <HashtagGenerator onNavigate={navigate} />;
      case '/free-tools/qr-code-generator':
        return <QrCodeGenerator onNavigate={navigate} />;
      case '/free-tools/profit-margin-calculator':
        return <ProfitMarginCalculator onNavigate={navigate} />;
      case '/free-tools/gst-calculator':
        return <GstCalculator onNavigate={navigate} />;
      case '/free-tools/image-compressor':
        return <ImageCompressor onNavigate={navigate} />;
      default:
        // Main Website Landing Page
        return (
          <>
            <Hero />
            <About />
            <Services />
            <Pricing />
            <Portfolio />
            <BlogSection 
              onOpenAdmin={() => setIsAdminModalOpen(true)} 
              onSelectPost={(post) => setSelectedPost(post)} 
            />
            <Process />
            <Contact />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen font-body-md bg-background text-on-surface antialiased ambient-bg overflow-x-hidden w-full">
      <Navbar onNavigate={navigate} currentPath={currentPath} />
      <FloatingWhatsApp />
      
      <main className="pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 overflow-x-hidden min-h-[calc(100vh-80px)]">
        {renderContent()}
      </main>

      <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} onNavigate={navigate} />

      {/* Reader Modal */}
      <BlogReaderModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />

      {/* Admin Management Modal */}
      <BlogAdminModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
      />

      {/* Discreet Floating Admin Bar - ONLY rendered when Santosh is logged in */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
          <div className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full bg-zinc-900/90 backdrop-blur-md border border-red-500/40 shadow-2xl text-xs font-label-mono text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-zinc-300 font-bold hidden sm:inline">Admin Mode</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-primary hover:bg-red-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Post Blog</span>
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Manage Articles"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
