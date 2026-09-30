import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: 'Home', href: '#home', icon: 'home' },
  { name: 'About', href: '#about', icon: 'person' },
  { name: 'Services', href: '#services', icon: 'design_services' },
  { name: 'Pricing', href: '#pricing', icon: 'payments' },
  { name: 'Portfolio', href: '#projects', icon: 'work' },
  { name: 'Process', href: '#process', icon: 'account_tree' },
  { name: 'Blog', href: '#blog', icon: 'menu_book' },
  { name: 'Contact', href: '#contact', icon: 'mail' },
];

interface NavbarProps {
  onOpenBlogAdmin?: () => void;
}

export default function Navbar({ onOpenBlogAdmin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      
      // Find the section currently in view
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
  }, []);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

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
  };

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
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-label-mono text-[13px] tracking-wider transition-colors hover:text-primary cursor-pointer ${
                  activeSection === link.href.substring(1)
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant'
                }`}
              >
                {link.name}
              </a>
            ))}
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
                    const isActive = activeSection === link.href.substring(1);
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