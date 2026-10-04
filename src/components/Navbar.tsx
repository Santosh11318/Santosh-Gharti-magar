import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, Wrench, Search, Layout, Share2, Briefcase, Sparkles, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenBlogAdmin?: () => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

const TOOL_DROPDOWN_SECTIONS = [
  {
    category: 'SEO Tools',
    icon: Search,
    tools: [
      { name: 'SEO Score Checker', path: '/free-tools/seo-score-checker' },
      { name: 'Meta Tag Generator', path: '/free-tools/meta-tag-generator' }
    ]
  },
  {
    category: 'Website Tools',
    icon: Layout,
    tools: [
      { name: 'Website Cost Calculator', path: '/free-tools/website-cost-calculator' },
      { name: 'Blog Title Generator', path: '/free-tools/blog-title-generator' },
      { name: 'Image Compressor', path: '/free-tools/image-compressor' }
    ]
  },
  {
    category: 'Social Media Tools',
    icon: Share2,
    tools: [
      { name: 'Social Bio Generator', path: '/free-tools/social-bio-generator' },
      { name: 'Hashtag Generator', path: '/free-tools/hashtag-generator' }
    ]
  },
  {
    category: 'Business Tools',
    icon: Briefcase,
    tools: [
      { name: 'QR Code Generator', path: '/free-tools/qr-code-generator' },
      { name: 'Profit Margin Calculator', path: '/free-tools/profit-margin-calculator' },
      { name: 'GST Calculator', path: '/free-tools/gst-calculator' }
    ]
  }
];

const navLinks = [
  { name: 'Home', href: '#home', icon: 'home' },
  { name: 'About', href: '#about', icon: 'person' },
  { name: 'Services', href: '#services', icon: 'design_services' },
  { name: 'Pricing', href: '#pricing', icon: 'payments' },
  { name: 'Portfolio', href: '#projects', icon: 'work' },
  { name: 'Free Tools', href: '/free-tools', icon: 'handyman', isTools: true },
  { name: 'Blog', href: '#blog', icon: 'menu_book' },
  { name: 'Contact', href: '#contact', icon: 'mail' },
];

export default function Navbar({ onOpenBlogAdmin, onNavigate, currentPath = '/' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileToolsExpanded, setMobileToolsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (currentPath !== '/') return;
      const sections = navLinks.filter(l => l.href.startsWith('#')).map(link => link.href.substring(1));
      
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);

    if (href.startsWith('/free-tools')) {
      if (onNavigate) {
        onNavigate(href);
      } else {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }

    if (href.startsWith('#')) {
      if (currentPath !== '/') {
        if (onNavigate) {
          onNavigate('/' + href);
        } else {
          window.location.href = '/' + href;
        }
        return;
      }

      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        setTimeout(() => {
          const navbarHeight = 85;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - navbarHeight;

          window.scrollTo({
            top: offsetPosition > 0 ? offsetPosition : 0,
            behavior: 'smooth'
          });
          window.history.pushState(null, '', href);
        }, 120);
      }
    }
  };

  const isFreeToolsActive = currentPath.startsWith('/free-tools');

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-500 py-3">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-20 max-w-[1280px] mx-auto py-2">
          
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 sm:gap-4 group cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 md:w-13 md:h-13 rounded-full overflow-hidden border-2 border-outline-variant/50 shadow-md shrink-0">
              <img 
                alt="Santosh Gharti Magar Logo" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPgJhM7k_NrzguH-4zGBIX72Tz3jBh8tdNhFqgNdI6ycMnrJOZWFdJxtlb4JTXpIP7hJcR4Vxyr08878WbU_ZqJdec1Xah64R6aJagv54FKVmcmXIZ6JFucFeqDxMZHvg2Ij9DwGs5ThFMW9etJ8cpRz01nnw3HOfgxD-6c_RBeN4xc7-3M8-E4CGQ62_IjkPGCKyPr74c0JqmvjyNl1fN2VdEVcpwYS4eN7_ZlzHh64M_j6NiC6-prUINx-vEQ8GIgg"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] xs:text-[16px] sm:text-[18px] md:text-[20px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-400 uppercase truncate" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                Santosh Gharti Magar
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              if (link.isTools) {
                return (
                  <div key={link.name} className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setToolsDropdownOpen(prev => !prev)}
                      onMouseEnter={() => setToolsDropdownOpen(true)}
                      className={`font-label-mono text-[13px] tracking-wider transition-colors hover:text-primary cursor-pointer flex items-center gap-1.5 py-1 ${
                        isFreeToolsActive
                          ? 'text-primary font-bold'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180 text-primary' : 'text-zinc-500'}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {toolsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          onMouseLeave={() => setToolsDropdownOpen(false)}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] p-5 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-outline-variant/40 shadow-2xl z-50 space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                            <div className="flex items-center gap-2 text-xs font-label-mono text-white font-bold uppercase tracking-wider">
                              <Sparkles size={14} className="text-primary" /> Free Marketing Tools Hub
                            </div>
                            <button
                              onClick={(e) => handleNavClick(e, '/free-tools')}
                              className="text-[11px] font-label-mono text-primary hover:text-red-400 font-bold uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <span>View All 10 Tools</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {TOOL_DROPDOWN_SECTIONS.map((sec) => {
                              const SecIcon = sec.icon;
                              return (
                                <div key={sec.category} className="space-y-1.5">
                                  <div className="flex items-center gap-1.5 text-xs font-label-mono text-zinc-300 font-bold">
                                    <SecIcon size={13} className="text-primary" />
                                    <span>{sec.category}</span>
                                  </div>
                                  <ul className="space-y-1 pl-4">
                                    {sec.tools.map((t) => (
                                      <li key={t.path}>
                                        <button
                                          type="button"
                                          onClick={(e) => handleNavClick(e, t.path)}
                                          className={`text-xs text-left text-zinc-400 hover:text-primary transition-colors block py-0.5 truncate w-full cursor-pointer ${
                                            currentPath === t.path ? 'text-primary font-bold' : ''
                                          }`}
                                        >
                                          {t.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-label-mono text-[13px] tracking-wider transition-colors hover:text-primary cursor-pointer ${
                    activeSection === link.href.substring(1) && !isFreeToolsActive
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <a 
              className="hidden lg:inline-flex px-8 py-3.5 bg-primary text-on-primary rounded-full font-label-mono text-label-mono glow-btn items-center gap-2 font-bold tracking-wider uppercase text-[13px] cursor-pointer" 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Get Started <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
            </a>
            
            {/* 3-Line Menu Trigger Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl text-on-surface bg-surface-container/80 hover:bg-surface-container border border-outline-variant/30 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Right-Side Slide-Over Drawer & Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Right Side Drawer Panel with Single Order List */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-[290px] sm:w-[320px] bg-zinc-950/98 backdrop-blur-2xl border-l border-zinc-800/80 shadow-2xl z-50 flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-red-500/40 shrink-0">
                      <img 
                        alt="Santosh Logo" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPgJhM7k_NrzguH-4zGBIX72Tz3jBh8tdNhFqgNdI6ycMnrJOZWFdJxtlb4JTXpIP7hJcR4Vxyr08878WbU_ZqJdec1Xah64R6aJagv54FKVmcmXIZ6JFucFeqDxMZHvg2Ij9DwGs5ThFMW9etJ8cpRz01nnw3HOfgxD-6c_RBeN4xc7-3M8-E4CGQ62_IjkPGCKyPr74c0JqmvjyNl1fN2VdEVcpwYS4eN7_ZlzHh64M_j6NiC6-prUINx-vEQ8GIgg"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span 
                        className="text-[13px] sm:text-[14px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-400 uppercase truncate"
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        Santosh Gharti Magar
                      </span>
                      <span className="text-[9px] text-zinc-400 tracking-wider font-mono">
                        AI WEBSITE DEVELOPER
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800/50 transition-colors cursor-pointer shrink-0 ml-2"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Single Order Vertical Stack of All Pages */}
                <div className="flex flex-col space-y-1.5 py-1">
                  {navLinks.map((link) => {
                    if (link.isTools) {
                      return (
                        <div key={link.name} className="space-y-1">
                          <div
                            className={`font-label-mono text-[14px] tracking-wider transition-all px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer group ${
                              isFreeToolsActive
                                ? 'bg-primary/20 text-primary border border-primary/40 font-bold shadow-sm'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/90 border border-transparent'
                            }`}
                          >
                            <div
                              onClick={(e) => handleNavClick(e, '/free-tools')}
                              className="flex items-center gap-3.5 flex-1"
                            >
                              <span className="material-symbols-outlined text-[20px] text-primary">
                                handyman
                              </span>
                              <span>Free Tools</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setMobileToolsExpanded(prev => !prev)}
                              className="p-1 hover:text-white transition-transform"
                            >
                              <ChevronDown size={16} className={`transition-transform ${mobileToolsExpanded ? 'rotate-180 text-primary' : ''}`} />
                            </button>
                          </div>

                          {/* Mobile Tools Sub-menu */}
                          {mobileToolsExpanded && (
                            <div className="pl-6 pr-2 py-2 space-y-1.5 bg-zinc-900/40 rounded-xl border border-zinc-800/40 text-xs font-label-mono">
                              <button
                                onClick={(e) => handleNavClick(e, '/free-tools')}
                                className="w-full text-left text-primary font-bold py-1 block"
                              >
                                &bull; All 10 Free Tools
                              </button>
                              <button
                                onClick={(e) => handleNavClick(e, '/free-tools/seo-score-checker')}
                                className="w-full text-left text-zinc-400 hover:text-white py-1 block"
                              >
                                &bull; SEO Score Checker
                              </button>
                              <button
                                onClick={(e) => handleNavClick(e, '/free-tools/website-cost-calculator')}
                                className="w-full text-left text-zinc-400 hover:text-white py-1 block"
                              >
                                &bull; Website Cost Calculator
                              </button>
                              <button
                                onClick={(e) => handleNavClick(e, '/free-tools/meta-tag-generator')}
                                className="w-full text-left text-zinc-400 hover:text-white py-1 block"
                              >
                                &bull; Meta Tag Generator
                              </button>
                              <button
                                onClick={(e) => handleNavClick(e, '/free-tools/image-compressor')}
                                className="w-full text-left text-zinc-400 hover:text-white py-1 block"
                              >
                                &bull; Image Compressor
                              </button>
                              <button
                                onClick={(e) => handleNavClick(e, '/free-tools/qr-code-generator')}
                                className="w-full text-left text-zinc-400 hover:text-white py-1 block"
                              >
                                &bull; QR Code Generator
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    const isActive = activeSection === link.href.substring(1) && !isFreeToolsActive;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`font-label-mono text-[14px] tracking-wider transition-all px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer group ${
                          isActive
                            ? 'bg-primary/20 text-primary border border-primary/40 font-bold shadow-sm'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/90 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-primary transition-colors'}`}>
                            {link.icon}
                          </span>
                          <span>{link.name}</span>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'opacity-0 group-hover:opacity-100 bg-zinc-600 transition-opacity'}`}></span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Action */}
              <div className="pt-6 border-t border-zinc-800/80 mt-6 space-y-3">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-primary text-on-primary rounded-xl font-label-mono font-bold uppercase text-[13px] shadow-lg cursor-pointer glow-btn hover:scale-[1.02] transition-transform"
                >
                  <span>Get Started</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
                
                <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-label-mono text-zinc-500">
                  <span>AI Web Developer</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Available
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}