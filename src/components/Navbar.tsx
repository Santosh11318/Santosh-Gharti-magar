import React, { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Portfolio', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

interface NavbarProps {
  onOpenBlogAdmin?: () => void;
}

export default function Navbar({ onOpenBlogAdmin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Initial check
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      
      // Find the section currently in view
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // if top is near top of viewport
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-500 py-3">
      <div className="flex justify-between items-center w-full px-6 md:px-20 max-w-[1280px] mx-auto py-2">
        
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-11 h-11 md:w-13 md:h-13 rounded-full overflow-hidden border-2 border-outline-variant/50 shadow-md shrink-0">
            <img 
              alt="Santosh Gharti Magar Logo" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPgJhM7k_NrzguH-4zGBIX72Tz3jBh8tdNhFqgNdI6ycMnrJOZWFdJxtlb4JTXpIP7hJcR4Vxyr08878WbU_ZqJdec1Xah64R6aJagv54FKVmcmXIZ6JFucFeqDxMZHvg2Ij9DwGs5ThFMW9etJ8cpRz01nnw3HOfgxD-6c_RBeN4xc7-3M8-E4CGQ62_IjkPGCKyPr74c0JqmvjyNl1fN2VdEVcpwYS4eN7_ZlzHh64M_j6NiC6-prUINx-vEQ8GIgg"
            />
          </div>
          <span className="text-[17px] md:text-[20px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-400 uppercase transition-all duration-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            Santosh Gharti Magar
          </span>
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
          <button onClick={toggleTheme} className="p-2.5 md:p-3 rounded-full bg-surface-container border border-outline-variant hover:bg-surface-variant transition-colors text-on-surface shadow-sm flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[20px] md:text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <a 
            className="hidden lg:inline-flex px-8 py-3.5 bg-primary text-on-primary rounded-full font-label-mono text-label-mono glow-btn items-center gap-2 font-bold tracking-wider uppercase text-[13px] cursor-pointer" 
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Get Started <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
          </a>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg text-on-surface bg-surface-container/60 hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-surface/98 backdrop-blur-2xl border-b border-outline-variant/40 shadow-2xl"
          >
            <div className="px-8 pt-4 pb-8 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)} 
                  className={`font-label-mono text-[16px] tracking-wider transition-colors py-1.5 cursor-pointer ${
                    activeSection === link.href.substring(1)
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}

              <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, '#contact')} 
                className="mt-2 inline-flex justify-center px-8 py-4 bg-primary text-on-primary rounded-full font-label-mono font-bold uppercase text-[14px] shadow-lg cursor-pointer"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}