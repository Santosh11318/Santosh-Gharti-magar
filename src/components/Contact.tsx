import { useState } from "react";
import { motion } from "motion/react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    business: "",
    plan: "Professional (₹5,999)",
    budget: "< ₹5k"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.replace('form-', '')]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
        alert("Please fill in Name and WhatsApp Number.");
        return;
    }

    const message = `*New Website Inquiry*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Business:* ${formData.business || 'N/A'}\n*Interested Plan:* ${formData.plan}\n*Budget:* ${formData.budget}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918799747981?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="px-6 md:px-20 max-w-[1280px] mx-auto py-32 border-t border-outline-variant/20" id="contact">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center"
        >
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Initialize Connection</h2>
          <p className="font-body-md text-on-surface-variant mb-12 text-lg">
            Ready to elevate your digital presence? Fill out the parameters below and I'll deploy a response within 24 hours.
          </p>
          
          <div className="space-y-8">
            <a href="mailto:santoshghartimagar918@gmail.com" className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center border border-outline-variant/30 group-hover:border-primary/50 transition-colors shadow-sm shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">mail</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-label-mono text-on-surface-variant tracking-widest mb-1">EMAIL</p>
                <p className="font-bold text-on-surface text-base md:text-lg truncate">santoshghartimagar918@gmail.com</p>
              </div>
            </a>
            
            <a href="https://wa.me/918799747981" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center border border-outline-variant/30 group-hover:border-[#25D366]/50 transition-colors shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[#25D366] opacity-70 group-hover:opacity-100 transition-opacity">chat</span>
              </div>
              <div>
                <p className="text-[11px] font-label-mono text-on-surface-variant tracking-widest mb-1">WHATSAPP</p>
                <p className="font-bold text-on-surface text-base md:text-lg">+91 8799747981</p>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-6 md:p-10 rounded-[2rem] border border-outline-variant/30 shadow-2xl"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-label-mono text-on-surface-variant mb-2 tracking-widest">NAME</label>
                <input 
                  id="form-name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  type="text"
                  className="w-full bg-surface/50 border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-label-mono text-on-surface-variant mb-2 tracking-widest">WHATSAPP NO.</label>
                <input 
                  id="form-phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                  type="tel"
                  className="w-full bg-surface/50 border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-label-mono text-on-surface-variant mb-2 tracking-widest">BUSINESS NAME / TYPE</label>
              <input 
                id="form-business" 
                value={formData.business}
                onChange={handleChange}
                type="text"
                className="w-full bg-surface/50 border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" 
              />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-label-mono text-on-surface-variant mb-2 tracking-widest">INTERESTED PLAN</label>
                <select 
                  id="form-plan" 
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full bg-surface/50 border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option value="Basic (₹2,999)">Basic (₹2,999)</option>
                  <option value="Professional (₹5,999)">Professional (₹5,999)</option>
                  <option value="Premium (₹9,999)">Premium (₹9,999)</option>
                  <option value="Custom">Custom Quote</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-label-mono text-on-surface-variant mb-2 tracking-widest">BUDGET RANGE</label>
                <select 
                  id="form-budget" 
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-surface/50 border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option value="< ₹5k">Under ₹5k</option>
                  <option value="₹5k - ₹10k">₹5k - ₹10k</option>
                  <option value="> ₹10k">Above ₹10k</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-primary text-on-primary rounded-xl font-bold font-label-mono text-sm tracking-widest glow-btn mt-6 flex justify-center items-center gap-3"
            >
              SEND VIA WHATSAPP <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </motion.div>
        
      </div>
    </section>
  );
}