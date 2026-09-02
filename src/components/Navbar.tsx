import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
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

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-500 py-3">
      <div className="flex justify-between items-center w-full px-6 md:px-20 max-w-[1280px] mx-auto py-2">
        
        <a href="#home" className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-outline-variant/50 shadow-md shrink-0">
            <img 
              alt="Santosh Gharti Magar Logo" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPgJhM7k_NrzguH-4zGBIX72Tz3jBh8tdNhFqgNdI6ycMnrJOZWFdJxtlb4JTXpIP7hJcR4Vxyr08878WbU_ZqJdec1Xah64R6aJagv54FKVmcmXIZ6JFucFeqDxMZHvg2Ij9DwGs5ThFMW9etJ8cpRz01nnw3HOfgxD-6c_RBeN4xc7-3M8-E4CGQ62_IjkPGCKyPr74c0JqmvjyNl1fN2VdEVcpwYS4eN7_ZlzHh64M_j6NiC6-prUINx-vEQ8GIgg"
            />
          </div>
          <span className="text-[15px] md:text-[18px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-400 uppercase transition-all duration-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            Santosh Gharti Magar
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              className={`font-label-mono text-label-mono transition-all duration-300 ${
                activeSection === link.href.substring(1) 
                  ? 'text-on-surface font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`} 
              href={link.href}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={toggleTheme} className="p-2 md:p-2.5 rounded-full bg-surface-container border border-outline-variant hover:bg-surface-variant transition-colors text-on-surface shadow-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <a className="hidden lg:inline-flex px-8 py-3 bg-primary text-on-primary rounded-full font-label-mono text-label-mono glow-btn items-center gap-2 font-bold tracking-wider uppercase text-[12px]" href="#contact">
            Get Started <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-on-surface"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-surface border-b border-outline-variant/30"
          >
            <div className="px-6 pt-2 pb-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`font-label-mono text-sm ${
                    activeSection === link.href.substring(1)
                      ? 'text-on-surface font-bold text-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mt-4 inline-flex justify-center px-6 py-3 bg-primary text-on-primary rounded-full font-label-mono font-bold uppercase text-[12px]">
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}