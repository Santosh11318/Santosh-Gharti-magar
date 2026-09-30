/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
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
import { BlogPost, isUserAdmin } from "./firebase/blogService";
import { auth } from "./firebase/config";

export default function App() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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

  return (
    <div className="min-h-screen font-body-md bg-background text-on-surface antialiased ambient-bg">
      <Navbar />
      <FloatingWhatsApp />
      
      <main className="pt-32 pb-24">
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
      </main>

      <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} />

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
