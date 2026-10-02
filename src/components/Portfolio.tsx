import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchProjects, ProjectItem, DEFAULT_PROJECTS } from "../firebase/projectService";

export default function Portfolio() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetchProjects().then(data => {
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    });
  }, []);

  const filteredProjects = projectsList.filter(
    (project) => activeCategory === "all" || project.category === activeCategory
  );

  return (
    <section className="px-4 sm:px-6 md:px-20 max-w-[1280px] mx-auto py-16 sm:py-24 md:py-32 border-t border-outline-variant/20 scroll-mt-28 relative" id="projects">
      <span id="portfolio" className="absolute -top-28"></span>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Selected Works</h2>
          <p className="font-body-md text-on-surface-variant mt-2 text-base sm:text-lg">A showcase of precision and performance.</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none"
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
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-label-mono font-bold transition-all border whitespace-nowrap cursor-pointer ${
                activeCategory === filter.id
                  ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/20"
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