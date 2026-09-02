import { Youtube, Facebook, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-10 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center space-x-3 text-xl font-bold tracking-tight mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 shadow-md shrink-0">
                <img 
                  alt="SGM Logo" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPgJhM7k_NrzguH-4zGBIX72Tz3jBh8tdNhFqgNdI6ycMnrJOZWFdJxtlb4JTXpIP7hJcR4Vxyr08878WbU_ZqJdec1Xah64R6aJagv54FKVmcmXIZ6JFucFeqDxMZHvg2Ij9DwGs5ThFMW9etJ8cpRz01nnw3HOfgxD-6c_RBeN4xc7-3M8-E4CGQ62_IjkPGCKyPr74c0JqmvjyNl1fN2VdEVcpwYS4eN7_ZlzHh64M_j6NiC6-prUINx-vEQ8GIgg" 
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold text-sm">SGM</span>
                <span className="text-red-600 font-extrabold text-[10px] tracking-wider">DIGITAL MARKETING</span>
              </div>
            </a>
            <p className="text-zinc-400 mb-6 max-w-sm">
              AI Website Developer crafting premium, high-performance digital experiences.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/19BmDkcDX5/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/@santoshghartimagar-tu5cn?si=9b_IUfSLHv2UJUU_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Pricing', 'Projects', 'Process', 'FAQ', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase()}`} 
                    className="text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+918799747981" className="text-zinc-400 hover:text-red-400 transition-colors">
                  +91 8799747981
                </a>
              </li>
              <li>
                <a href="mailto:santoshghartimagar918@gmail.com" className="text-zinc-400 hover:text-red-400 transition-colors break-all">
                  santoshghartimagar918@gmail.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-zinc-400 mb-6">
              Subscribe to my newsletter to get the latest web development tips and tricks.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-l-xl focus:outline-none focus:border-red-500 w-full"
                required
              />
              <button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-r-xl transition-colors flex items-center justify-center shrink-0"
                aria-label="Subscribe"
              >
                <ArrowUp size={20} className="rotate-45" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm gap-4">
          <p>© 2026 Santosh Gharti Magar. All Rights Reserved.</p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center space-x-2 hover:text-zinc-300 transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}