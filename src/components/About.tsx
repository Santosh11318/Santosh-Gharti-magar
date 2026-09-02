import { motion } from "motion/react";
import Counter from "./Counter";

export default function About() {
  return (
    <section className="px-6 md:px-20 max-w-[1280px] mx-auto py-32" id="about">
      <div className="mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-headline-lg text-headline-lg text-on-surface"
        >
          About Me
        </motion.h2>
        <div className="w-20 h-1.5 bg-primary mt-6 rounded-full"></div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-2 glass-card rounded-[2rem] p-12 flex flex-col justify-center border border-outline-variant/20"
        >
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-6 leading-tight">
            Precision Engineering Meets Creative Vision
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10 text-lg leading-relaxed">
            With over a year of intensive experience in modern web development, I bridge the gap between complex AI capabilities and intuitive user interfaces. I build digital experiences that are not just visually premium, but technically robust.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 pt-6 border-t border-outline-variant/20">
            <div>
              <div className="font-display-lg text-4xl text-primary font-bold mb-1">
                <Counter end={50} suffix="+" duration={2} />
              </div>
              <p className="font-label-mono text-xs text-on-surface-variant tracking-widest">PROJECTS DEPLOYED</p>
            </div>
            <div>
              <div className="font-display-lg text-4xl text-secondary font-bold mb-1">
                <Counter end={30} suffix="+" duration={2.2} />
              </div>
              <p className="font-label-mono text-xs text-on-surface-variant tracking-widest">HAPPY CLIENTS</p>
            </div>
            <div>
              <div className="font-display-lg text-4xl text-tertiary font-bold mb-1">
                <Counter end={99} suffix="%" duration={2.5} />
              </div>
              <p className="font-label-mono text-xs text-on-surface-variant tracking-widest">SUCCESS RATE</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface font-label-mono pt-4">
            <span className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-tertiary text-[20px]">verified</span> 
              Verified Pro
            </span>
            <span className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-[20px]">code</span> 
              Clean Code
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-[2rem] p-10 flex flex-col items-center text-center justify-center relative overflow-hidden border border-outline-variant/20"
        >
          <div className="absolute -top-10 -right-10 p-4 opacity-5">
            <span className="material-symbols-outlined text-[180px]">fingerprint</span>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full border-4 border-primary/50 overflow-hidden mb-6 relative z-10 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-110 hover:border-primary transition-all duration-500 cursor-pointer"
          >
            <img 
              alt="Profile Small" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZzXduhPeSYwk_7qQ2KEYaR2M_HFdDPg5xJTi5fcuG7R0y5yFbK0EuhFht5dJ4j81Hpk7yZYTI1vSUNVpV7LKDcE-pC6wOybTmBpa7Ff6fdSG4wIZzHBGPVGja8iT3n_s75xeWdnJxyBcbkFFC7J9Z2ZiCIiK8r9n9gkYMWqKAvmg374Wv826auoSvLxdFaaZXDTO6dYcwZxrvjHX02BH0f74jn31SNbJUiKo9SGuL_P9OT6LZ-CRtfESWuhygmKfuDw"
            />
          </motion.div>
          
          <h4 className="font-bold text-xl text-on-surface relative z-10 mb-1">Santosh Gharti Magar</h4>
          <p className="text-on-surface-variant font-label-mono text-[11px] mb-8 relative z-10 tracking-widest">AI WEBSITE DEVELOPER</p>
          <div className="w-full space-y-4 relative z-10">
            <a className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary hover:bg-surface-variant transition-colors group" href="tel:+918799747981">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">call</span>
              <span className="text-sm font-label-mono text-on-surface">+91 8799747981</span>
            </a>
            <a className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary hover:bg-surface-variant transition-colors group" href="mailto:santoshghartimagar918@gmail.com">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">mail</span>
              <span className="text-sm font-label-mono text-on-surface truncate">Email Me</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}