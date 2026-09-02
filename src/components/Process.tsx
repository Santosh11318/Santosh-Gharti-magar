import { motion } from "motion/react";

const steps = [
  { num: "01", title: "DISCOVER" },
  { num: "02", title: "PLAN" },
  { num: "03", title: "DESIGN" },
  { num: "04", title: "DEVELOP" },
  { num: "05", title: "OPTIMIZE" },
  { num: "06", title: "LAUNCH" }
];

export default function Process() {
  return (
    <section className="px-6 md:px-20 max-w-[1280px] mx-auto py-32 border-t border-outline-variant/20">
      <motion.h2 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-headline-lg text-headline-lg text-on-surface text-center mb-24"
      >
        Development Pipeline
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-[40px] left-0 w-full h-[2px] bg-outline-variant/30 z-0"></div>
        
        {/* Steps */}
        {steps.map((step, index) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10 group cursor-default"
          >
            {step.num === "04" ? (
              <>
                <div className="font-display-lg text-primary text-[64px] mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] transform -translate-y-2 font-black">
                  {step.num}
                </div>
                <div className="w-6 h-6 bg-primary rounded-full border-4 border-surface mx-auto mb-5 shadow-[0_0_15px_rgba(220,38,38,0.5)] hidden md:block"></div>
                <h4 className="font-bold text-sm text-primary font-label-mono tracking-widest">{step.title}</h4>
              </>
            ) : (
              <>
                <div className="font-display-lg text-surface-variant text-[56px] mb-6 opacity-40 group-hover:opacity-100 group-hover:text-on-surface transition-all duration-300 transform group-hover:-translate-y-2">
                  {step.num}
                </div>
                <div className="w-4 h-4 bg-surface rounded-full border-2 border-outline-variant mx-auto mb-6 group-hover:border-on-surface transition-colors hidden md:block"></div>
                <h4 className="font-bold text-sm text-on-surface-variant font-label-mono tracking-widest group-hover:text-on-surface transition-colors">{step.title}</h4>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}