import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-20 scroll-mt-28" id="home">
      {/* Digital Marketing & AI High-Tech Background Poster */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Vibrant Marketing Poster Illustration */}
        <img 
          src="/assets/digital-marketing-poster.svg" 
          alt="Digital Marketing & Growth Architecture Poster" 
          className="w-full h-full object-cover object-center opacity-90 scale-105 transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Ambient Color Glows for extra depth */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-600/20 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-600/20 blur-[140px] rounded-full pointer-events-none"></div>
        
        {/* Targeted soft shading ONLY behind the text column so typography is super sharp */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] bg-gradient-to-r from-background/85 via-background/65 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </div>

      <div className="px-6 md:px-20 max-w-[1280px] mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface-variant/70 border border-white/15 backdrop-blur-md font-label-mono text-label-mono text-on-surface shadow-lg text-[14px] transition-all hover:border-primary/40">
                <span className="w-3 h-3 rounded-full bg-tertiary animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]"></span> 
                Available for New Projects
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 font-label-mono text-[13px] text-red-300 font-bold tracking-wider">
                <span className="material-symbols-outlined text-[17px] text-primary">trending_up</span>
                Digital Marketing &amp; AI
              </div>
            </div>
            
            <h1 className="font-display-lg text-[48px] sm:text-[58px] lg:text-[72px] tracking-tight leading-[1.12] max-w-2xl font-black text-white">
              Elevate Your Brand With <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-orange-400">
                Modern AI Websites
              </span>
            </h1>
            
            <p className="font-body-md text-on-surface-variant max-w-xl text-[20px] md:text-[22px] leading-relaxed">
              I specialize in creating high-performance, visually stunning websites tailored for modern businesses, leveraging the latest AI technologies, SEO, and digital marketing strategies to drive real growth and online revenue.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-5 pt-4">
              <a className="w-full sm:w-auto justify-center px-10 py-4 bg-primary text-on-primary rounded-full font-label-mono text-label-mono glow-btn flex items-center gap-3 font-bold tracking-wider hover:scale-105 transition-transform cursor-pointer text-[14px]" href="#contact">
                Start Your Project <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
              </a>
              <a className="w-full sm:w-auto justify-center px-10 py-4 bg-surface-variant/60 backdrop-blur-md border-2 border-outline-variant text-on-surface rounded-full font-label-mono text-label-mono hover:border-primary hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-3 font-bold tracking-wider cursor-pointer text-[14px]" href="#projects">
                View Portfolio <span className="material-symbols-outlined text-[22px]">arrow_right_alt</span>
              </a>
            </div>

            {/* Quick Marketing Metric Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-[13px] font-label-mono text-on-surface-variant border-t border-outline-variant/30">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                SEO Optimized Architecture
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                Ultra Fast Load Speeds
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">insights</span>
                High-Conversion Funnels
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative h-[480px] md:h-[580px] w-full flex items-center justify-center lg:justify-end"
          >
            {/* Animated rings around the image */}
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-[340px] h-[340px] md:w-[500px] md:h-[500px] rounded-full border border-dashed border-primary/30"
              ></motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border border-secondary/15"
              ></motion.div>
            </div>
            
            <div className="relative z-10 w-[300px] h-[300px] md:w-[420px] md:h-[420px] lg:mr-8 rounded-full border-4 border-surface p-2 bg-gradient-to-tr from-primary via-purple-500 to-secondary overflow-hidden shadow-[0_0_70px_rgba(220,38,38,0.3)] group">
              <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-background relative">
                <img 
                  alt="Santosh Gharti Magar Profile" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABLTixsJN2BruB-ISxXi2Jad8tRcEVvn9M3P1L24lQV2F7xDdGK6bMGb4u7NR10R7NaqHTl_Q7Z7a15sWS22rMtSFLUdmgAegViSaWOAYHlu5hTyAFElN5WcNKI3oY5pi_rPWR3Op_ybYj_OlTlA_zivDYx5Ps9mSKJ-u-KIBtQ4ChjVZ4KhRV0HuBf_bu1f74fTy6V4ZPfwAqHBUamuHh0uY2uh6dxlopL_iHVOewsMkIXY3xqafDV_Ua7ODOBtF--w"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
              </div>
            </div>
            
            {/* Floating Tech & Marketing Pills */}
            <motion.div 
              animate={{ y: [-12, 12, -12] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[8%] md:top-[12%] left-0 lg:left-[-5%] px-5 py-3.5 bg-surface-variant/90 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl flex items-center gap-3 z-20"
            >
              <div className="w-11 h-11 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">code</span>
              </div>
              <div>
                <span className="font-label-mono text-[13px] md:text-[14px] text-white font-bold tracking-wider block">React &amp; Next.js</span>
                <span className="text-[11px] text-slate-400 block font-sans">Full-Stack AI UI</span>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [12, -12, 12] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[8%] md:bottom-[12%] right-0 md:right-[-5%] px-5 py-3.5 bg-surface-variant/90 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl flex items-center gap-3 z-20"
            >
              <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">ads_click</span>
              </div>
              <div>
                <span className="font-label-mono text-[13px] md:text-[14px] text-white font-bold tracking-wider block">Digital Marketing</span>
                <span className="text-[11px] text-red-300 block font-sans">SEO &amp; Ad Funnels</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}