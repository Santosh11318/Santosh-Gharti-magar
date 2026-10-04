import { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, Wrench, Shield, Zap, ChevronRight } from 'lucide-react';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../toolsData';
import { ToolCategory } from '../types';
import ConversionCTA from './ConversionCTA';
import { trackToolEvent } from '../analytics';

interface FreeToolsHubProps {
  onNavigate: (path: string) => void;
}

export default function FreeToolsHub({ onNavigate }: FreeToolsHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "Free Marketing Tools for Businesses | Santosh Gharti Magar";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Free tools to help you improve your website, SEO, social media and online business. No signup required.'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://www.santoshghartimagar.site/free-tools');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackToolEvent('tool_opened', 'free-tools-hub');
  }, []);

  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.shortDescription.toLowerCase().includes(query) ||
      tool.keywords.some(k => k.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-label-mono text-on-surface-variant mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight size={13} className="text-zinc-600" />
        <span className="text-white font-semibold">Free Marketing Tools</span>
      </nav>

      {/* Hero Header */}
      <header className="mb-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-label-mono font-bold tracking-wider uppercase">
          <Sparkles size={14} /> 100% Free · No Signup Required
        </div>

        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
          Free Marketing Tools for Businesses
        </h1>

        <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
          Free tools to help you improve your website, SEO, social media and online business. Fast, privacy-first, and runs entirely in your browser.
        </p>

        {/* Feature Highlights */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-label-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400" /> Instant Results
          </span>
          <span className="flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-400" /> 100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5">
            <Wrench size={14} className="text-primary" /> 10 Powerful Tools
          </span>
        </div>
      </header>

      {/* Search Bar & Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tools (e.g. SEO, GST, QR Code, Images)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-surface/80 border border-outline-variant/40 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary shadow-sm"
          />
        </div>

        {/* Category Tabs - Horizontally scrollable on mobile */}
        <div className="flex items-center sm:justify-center overflow-x-auto pb-1.5 pt-1 gap-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {TOOL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-label-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                    : 'bg-surface/70 hover:bg-surface text-on-surface-variant hover:text-white border border-outline-variant/30'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12 p-5 rounded-2xl sm:rounded-3xl bg-surface/40 border border-outline-variant/30 space-y-3">
          <p className="text-sm sm:text-base text-zinc-400">No tools found matching "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label-mono font-bold uppercase cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.path)}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface/70 border border-outline-variant/30 hover:border-primary/50 transition-all hover:translate-y-[-3px] flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-primary/5"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 mb-2.5 font-label-mono">
                  <span className="text-primary font-bold">{tool.categoryName}</span>
                  <span className="text-zinc-500">{tool.estimatedTime}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                  {tool.name}
                </h2>

                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] font-label-mono text-zinc-500">Free Forever</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-label-mono text-primary font-bold uppercase group-hover:translate-x-1 transition-transform">
                  <span>Use Tool</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversion Section */}
      <ConversionCTA
        toolId="free-tools-hub"
        headline="Need a custom website or high-ranking SEO?"
        subheadline="Let us build a lightning-fast, conversion-optimized website for your business. Transparent pricing, no hidden costs, and direct client support."
      />

      {/* Internal SEO links */}
      <footer className="mt-12 p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/20 flex flex-wrap items-center justify-between gap-4 text-xs font-label-mono">
        <span className="text-zinc-400">Santosh Gharti Magar Digital Solutions:</span>
        <div className="flex flex-wrap gap-4 text-primary">
          <button onClick={() => onNavigate('/#services')} className="hover:underline cursor-pointer">
            Website Development
          </button>
          <span className="text-zinc-600">&bull;</span>
          <button onClick={() => onNavigate('/#services')} className="hover:underline cursor-pointer">
            SEO &amp; Growth Marketing
          </button>
          <span className="text-zinc-600">&bull;</span>
          <button onClick={() => onNavigate('/#blog')} className="hover:underline cursor-pointer">
            Read Our Blog
          </button>
          <span className="text-zinc-600">&bull;</span>
          <button onClick={() => onNavigate('/#contact')} className="hover:underline cursor-pointer">
            Contact Us
          </button>
        </div>
      </footer>
    </div>
  );
}
