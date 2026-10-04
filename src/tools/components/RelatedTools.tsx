import { ALL_TOOLS } from '../toolsData';
import { ArrowRight, Wrench } from 'lucide-react';

interface RelatedToolsProps {
  currentToolId: string;
  relatedIds?: string[];
  onNavigate: (path: string) => void;
}

export default function RelatedTools({ currentToolId, relatedIds = [], onNavigate }: RelatedToolsProps) {
  // Find related tools, fallback to other tools in catalog
  let toolsToShow = ALL_TOOLS.filter(t => relatedIds.includes(t.id) && t.id !== currentToolId);
  if (toolsToShow.length < 3) {
    const fallback = ALL_TOOLS.filter(t => t.id !== currentToolId && !toolsToShow.some(x => x.id === t.id));
    toolsToShow = [...toolsToShow, ...fallback].slice(0, 3);
  } else {
    toolsToShow = toolsToShow.slice(0, 3);
  }

  return (
    <div className="my-14 pt-10 border-t border-outline-variant/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display-lg text-2xl font-bold text-white flex items-center gap-2">
            <Wrench size={20} className="text-primary" /> More Free Marketing Tools
          </h3>
          <p className="text-xs text-on-surface-variant mt-1 font-label-mono">
            Explore additional browser tools to elevate your website and online reach.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/free-tools')}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-label-mono text-primary hover:text-red-400 font-bold uppercase transition-colors cursor-pointer"
        >
          <span>View All 10 Tools</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {toolsToShow.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigate(tool.path)}
            className="p-5 rounded-2xl bg-surface/70 border border-outline-variant/30 hover:border-primary/50 transition-all hover:translate-y-[-2px] cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-label-mono">
                <span>{tool.categoryName}</span>
                <span className="text-zinc-500">{tool.estimatedTime}</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
                {tool.name}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                {tool.shortDescription}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-label-mono text-primary font-bold group-hover:translate-x-1 transition-transform">
              <span>Use Tool Free</span>
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
