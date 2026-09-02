import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const projects = [
  {
    name: "Nisha Beauty Salon",
    category: "business",
    label: "BUSINESS / SERVICE",
    url: "https://santosh11318.github.io/Nisha-Beauty-salon/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Nisha-Beauty-salon/"
  },
  {
    name: "Zippy Momos",
    category: "food",
    label: "RESTAURANT / FOOD",
    url: "https://santosh11318.github.io/Zippy-momos/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Zippy-momos"
  },
  {
    name: "Arghakhanchi Dental",
    category: "health",
    label: "HEALTHCARE / CLINIC",
    url: "https://santosh11318.github.io/Arghakhanchi-dental-clinic/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Arghakhanchi-dental-clinic/"
  },
  {
    name: "Sharmila Suryavanshi",
    category: "portfolio",
    label: "PERSONAL PORTFOLIO",
    url: "https://santosh11318.github.io/Sharmilasuryavanshi/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Sharmilasuryavanshi/"
  },
  {
    name: "Supa Deurali Placement",
    category: "business",
    label: "PLACEMENT SERVICE",
    url: "https://santosh11318.github.io/Supadeurali-placement-service/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Supadeurali-placement-service/"
  },
  {
    name: "Ajay Thapa Portfolio",
    category: "portfolio",
    label: "DEVELOPER PORTFOLIO",
    url: "https://santosh11318.github.io/Ajaythapa.portfolio/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Ajaythapa.portfolio/"
  }
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = projects.filter(
    (project) => activeCategory === "all" || project.category === activeCategory
  );

  return (
    <section className="px-6 md:px-20 max-w-[1280px] mx-auto py-32 border-t border-outline-variant/20" id="projects">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Selected Works</h2>
          <p className="font-body-md text-on-surface-variant mt-2 text-lg">A showcase of precision and performance.</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 mt-8 md:mt-0"
        >
          {[
            { id: "all", label: "ALL" },
            { id: "business", label: "BUSINESS" },
            { id: "health", label: "HEALTHCARE" },
            { id: "food", label: "RESTAURANT" },
            { id: "portfolio", label: "PORTFOLIO" }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveCategory(filter.id)}
              className={`px-6 py-2 rounded-full text-xs font-label-mono font-bold transition-colors border ${
                activeCategory === filter.id
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.a
              key={project.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-[1.5rem] overflow-hidden group block border border-outline-variant/20"
            >
              <div 
                className="h-64 bg-surface-container relative overflow-hidden" 
                style={{
                  backgroundImage: `url('${project.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'top center',
                  transition: 'all 0.5s ease'
                }}
              >
                <div className="absolute inset-0 bg-surface/60 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-on-surface text-[24px]">arrow_outward</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xl text-on-surface group-hover:text-primary transition-colors">{project.name}</h3>
                </div>
                <p className="text-[11px] text-on-surface-variant font-label-mono tracking-widest">{project.label}</p>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}