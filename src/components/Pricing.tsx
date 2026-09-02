import { motion } from "motion/react";
import Counter from "./Counter";

export default function Pricing() {
  const openWhatsApp = (plan: string, price: string) => {
    let message = "Hello Santosh, I am interested in building a website.";
    if (plan) {
        message = `Hello Santosh, I am interested in the ${plan} Plan (₹${price}) for my website.`;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918799747981?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="px-6 md:px-20 max-w-[1280px] mx-auto py-32 border-t border-outline-variant/20" id="pricing">
      <div className="mb-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-headline-lg text-headline-lg text-on-surface"
        >
          Transparent Pricing
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-body-md text-on-surface-variant mt-4 text-lg"
        >
          Investment plans structured for different stages of business growth.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        
        {/* Basic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-10 rounded-[2rem] border border-outline-variant/20"
        >
          <h3 className="font-label-mono text-label-mono text-on-surface-variant mb-4 tracking-widest">BASIC</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-3xl text-on-surface-variant font-bold">₹</span>
            <span className="font-display-lg text-[48px] text-on-surface">
              <Counter end={2999} duration={2} />
            </span>
          </div>
          <ul className="space-y-5 mb-10 font-body-md text-sm text-on-surface-variant">
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-on-surface text-[20px]">check</span> 3-4 Pages Website</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-on-surface text-[20px]">check</span> Mobile Responsive</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-on-surface text-[20px]">check</span> Basic SEO Setup</li>
            <li className="flex items-center gap-4 text-tertiary"><span className="material-symbols-outlined text-[20px]">check</span> Domain/Hosting FREE (1 Yr)</li>
          </ul>
          <button onClick={() => openWhatsApp('BASIC', '2999')} className="w-full py-4 rounded-xl border border-outline-variant hover:border-primary hover:text-primary hover:bg-primary/5 text-on-surface transition-all font-label-mono text-label-mono font-bold">
            Select Basic
          </button>
        </motion.div>

        {/* Professional */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-12 rounded-[2rem] border-2 border-primary relative transform md:scale-105 shadow-[0_0_50px_rgba(220,38,38,0.15)] bg-surface-container-low z-10"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-5 py-1.5 rounded-full text-xs font-bold tracking-widest font-label-mono shadow-md">MOST POPULAR</div>
          <h3 className="font-label-mono text-label-mono text-primary mb-4 tracking-widest">PROFESSIONAL</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-3xl text-on-surface font-bold">₹</span>
            <span className="font-display-lg text-[56px] text-on-surface">
              <Counter end={5999} duration={2.2} />
            </span>
          </div>
          <ul className="space-y-5 mb-10 font-body-md text-sm text-on-surface">
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-primary text-[20px]">check</span> 6-8 Pages Website</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Premium UI/UX Design</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-primary text-[20px]">check</span> WhatsApp Integration</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Contact Form Leads</li>
            <li className="flex items-center gap-4 text-tertiary font-medium"><span className="material-symbols-outlined text-[20px]">check</span> Domain/Hosting FREE</li>
          </ul>
          <button onClick={() => openWhatsApp('PROFESSIONAL', '5999')} className="w-full py-4 rounded-xl bg-primary text-on-primary glow-btn font-label-mono text-label-mono font-bold tracking-wider">
            Select Pro
          </button>
        </motion.div>

        {/* Premium */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-10 rounded-[2rem] border border-outline-variant/20"
        >
          <h3 className="font-label-mono text-label-mono text-on-surface-variant mb-4 tracking-widest">PREMIUM</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-3xl text-on-surface-variant font-bold">₹</span>
            <span className="font-display-lg text-[48px] text-on-surface">
              <Counter end={9999} duration={2.5} />
            </span>
          </div>
          <ul className="space-y-5 mb-10 font-body-md text-sm text-on-surface-variant">
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-on-surface text-[20px]">check</span> 10+ Pages Custom Site</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-on-surface text-[20px]">check</span> Advanced Animations</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-on-surface text-[20px]">check</span> E-commerce Ready</li>
            <li className="flex items-center gap-4"><span className="material-symbols-outlined text-on-surface text-[20px]">check</span> Priority Support</li>
          </ul>
          <button onClick={() => openWhatsApp('PREMIUM', '9999')} className="w-full py-4 rounded-xl border border-outline-variant hover:border-primary hover:text-primary hover:bg-primary/5 text-on-surface transition-all font-label-mono text-label-mono font-bold">
            Select Premium
          </button>
        </motion.div>

      </div>
    </section>
  );
}