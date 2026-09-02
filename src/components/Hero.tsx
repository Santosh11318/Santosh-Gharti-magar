import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="min-h-[95vh] flex items-center relative overflow-hidden bg-background" id="home">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-primary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[30%] w-[30%] h-[40%] bg-tertiary/5 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="px-6 md:px-20 max-w-[1280px] mx-auto py-28 md:py-32 mt-20 md:mt-16 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 md:space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface-variant/40 border border-white/10 backdrop-blur-md font-label-mono text-label-mono text-on-surface shadow-lg text-sm transition-all hover:bg-surface-variant/60 hover:border-primary/30">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span> 
              Available for New Projects
            </div>
            
            <h1 className="font-display-lg text-[42px] sm:text-[52px] lg:text-[68px] tracking-tight leading-[1.1] max-w-2xl font-extrabold text-white">
              Elevate Your Brand With <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-orange-400">
                Modern AI Websites
              </span>
            </h1>
            
            <p className="font-body-md text-on-surface-variant max-w-xl text-lg md:text-xl leading-relaxed">
              I specialize in creating high-performance, visually stunning websites tailored for modern businesses, leveraging the latest AI technologies and clean code to drive real growth and digital success.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-5 pt-6">
              <a className="w-full sm:w-auto justify-center px-10 py-4 bg-primary text-on-primary rounded-full font-label-mono text-label-mono glow-btn flex items-center gap-3 font-bold tracking-wider hover:scale-105 transition-transform cursor-pointer" href="#contact">
                Start Your Project <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              </a>
              <a className="w-full sm:w-auto justify-center px-10 py-4 bg-transparent border-2 border-outline-variant text-on-surface rounded-full font-label-mono text-label-mono hover:border-primary hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-3 font-bold tracking-wider cursor-pointer" href="#projects">
                View Portfolio <span className="material-symbols-outlined text-[20px]">arrow_right_alt</span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative h-[450px] md:h-[600px] w-full flex items-center justify-center lg:justify-end"
          >
            {/* Animated rings around the image */}
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full border border-dashed border-primary/30"
              ></motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute w-[380px] h-[380px] md:w-[580px] md:h-[580px] rounded-full border border-secondary/10"
              ></motion.div>
            </div>
            
            <div className="relative z-10 w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:mr-8 rounded-full border-4 border-surface p-2 bg-gradient-to-tr from-primary via-purple-500 to-secondary overflow-hidden shadow-[0_0_60px_rgba(220,38,38,0.25)] group">
              <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-background relative">
                <img 
                  alt="Santosh Gharti Magar Profile" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABLTixsJN2BruB-ISxXi2Jad8tRcEVvn9M3P1L24lQV2F7xDdGK6bMGb4u7NR10R7NaqHTl_Q7Z7a15sWS22rMtSFLUdmgAegViSaWOAYHlu5hTyAFElN5WcNKI3oY5pi_rPWR3Op_ybYj_OlTlA_zivDYx5Ps9mSKJ-u-KIBtQ4ChjVZ4KhRV0HuBf_bu1f74fTy6V4ZPfwAqHBUamuHh0uY2uh6dxlopL_iHVOewsMkIXY3xqafDV_Ua7ODOBtF--w"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
              </div>
            </div>
            
            {/* Floating Tech Pills */}
            <motion.div 
              animate={{ y: [-12, 12, -12] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[5%] md:top-[15%] left-0 lg:left-[-5%] px-4 py-3 md:px-6 md:py-4 bg-surface-variant/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">code</span>
              </div>
              <span className="font-label-mono text-[12px] md:text-[14px] text-white font-bold tracking-wider">React & Next.js</span>
            </motion.div>

            <motion.div 
              animate={{ y: [12, -12, 12] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[5%] md:bottom-[15%] right-0 md:right-[-5%] px-4 py-3 md:px-6 md:py-4 bg-surface-variant/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <span className="font-label-mono text-[12px] md:text-[14px] text-white font-bold tracking-wider">AI Integration</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}