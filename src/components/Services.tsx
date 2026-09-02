import { motion } from "motion/react";

export default function Services() {
  return (
    <section className="px-6 md:px-20 max-w-[1280px] mx-auto py-32 border-t border-outline-variant/20" id="services">
      <div className="mb-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-headline-lg text-headline-lg text-on-surface"
        >
          Digital Services
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-body-md text-on-surface-variant mt-4 max-w-2xl mx-auto text-lg"
        >
          Comprehensive web solutions engineered for scale and aesthetic superiority.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 rounded-[1.5rem] group border border-outline-variant/20"
        >
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-on-surface mb-8 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
          </div>
          <h3 className="font-bold text-xl mb-3 text-on-surface">AI Development</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">Integration of intelligent features, chatbots, and automated workflows.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 rounded-[1.5rem] border border-outline-variant/20 group"
        >
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-on-surface mb-8 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-300 shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[28px]">storefront</span>
          </div>
          <h3 className="font-bold text-xl mb-3 text-on-surface">Business Websites</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">Premium digital storefronts tailored to your brand identity.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 rounded-[1.5rem] border border-outline-variant/20 group"
        >
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-on-surface mb-8 group-hover:bg-tertiary group-hover:text-on-tertiary transition-all duration-300 shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[28px]">web</span>
          </div>
          <h3 className="font-bold text-xl mb-3 text-on-surface">Landing Pages</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">High-conversion single pages optimized for marketing campaigns.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 rounded-[1.5rem] border border-outline-variant/20 group"
        >
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-on-surface mb-8 group-hover:bg-primary-container group-hover:text-on-primary-container transition-all duration-300 shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[28px]">devices</span>
          </div>
          <h3 className="font-bold text-xl mb-3 text-on-surface">Responsive Design</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">Flawless execution across mobile, tablet, and desktop interfaces.</p>
        </motion.div>

      </div>
    </section>
  );
}