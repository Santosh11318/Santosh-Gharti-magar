import React, { useState, useMemo } from 'react';
import { FileCode, Globe, Smartphone, Monitor, CheckCircle, Sparkles } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import CopyButton from '../components/CopyButton';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

export default function MetaTagGenerator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'meta-tag-generator')!;

  const [businessName, setBusinessName] = useState('Apex Dental Care');
  const [pageTopic, setPageTopic] = useState('Dental Implants & Cosmetic Dentistry');
  const [mainKeyword, setMainKeyword] = useState('Dental Implants');
  const [location, setLocation] = useState('Kathmandu, Nepal');
  const [shortDesc, setShortDesc] = useState('Painless dental implants, smile makeovers, and cosmetic dentistry with modern laser technology. Book your free consultation today.');
  const [serpView, setSerpView] = useState<'desktop' | 'mobile'>('desktop');

  // Generated outputs
  const generated = useMemo(() => {
    // Variations of Title
    const title1 = `${mainKeyword} in ${location} | ${businessName}`;
    const title2 = `${pageTopic} | Best ${mainKeyword} in ${location}`;
    const title3 = `${businessName} – Premier ${mainKeyword} & Clinic in ${location}`;

    // Choose primary best fitting under 60 chars
    let title = title1;
    if (title.length > 60 && title.includes('|')) {
      title = `${mainKeyword} in ${location} – ${businessName}`.slice(0, 60);
    }

    // Description formatted for 150-160 chars
    let description = shortDesc.trim();
    if (!description.includes(businessName) && description.length < 130) {
      description = `${description} Visit ${businessName} in ${location} for expert care.`;
    }

    // Slug
    const slug = `${mainKeyword}-${location}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const fullHtml = `<!-- Primary SEO Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.yourdomain.com/${slug}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">`;

    return {
      title,
      titleLength: title.length,
      description,
      descLength: description.length,
      slug,
      fullHtml,
      variations: [title1, title2, title3]
    };
  }, [businessName, pageTopic, mainKeyword, location, shortDesc]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    trackToolEvent('tool_used', 'meta-tag-generator');
  };

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Need top Google rankings for your business?"
      conversionSubheadline="Meta tags are just the beginning. We build comprehensive SEO architectures, Local Map Pack optimization, and high-converting websites."
      whatsappMessage={`Hi Santosh! I used your Meta Tag Generator for "${businessName}" (${mainKeyword}) and would like full SEO services.`}
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-label-mono text-primary font-bold uppercase tracking-wider">
              <FileCode size={15} /> Input Business &amp; Keyword Details
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Business / Brand Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => handleInputChange(setBusinessName, e.target.value)}
                placeholder="e.g. Himalayan Coffee Roasters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Primary Keyword *
              </label>
              <input
                type="text"
                value={mainKeyword}
                onChange={(e) => handleInputChange(setMainKeyword, e.target.value)}
                placeholder="e.g. Organic Coffee Beans"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Target Location / City (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => handleInputChange(setLocation, e.target.value)}
                placeholder="e.g. Kathmandu, Pokhara, India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Page Topic / Service Focus
              </label>
              <input
                type="text"
                value={pageTopic}
                onChange={(e) => handleInputChange(setPageTopic, e.target.value)}
                placeholder="e.g. Specialty Roasted Artisan Coffee"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Short Description / Value Proposition *
              </label>
              <textarea
                rows={3}
                value={shortDesc}
                onChange={(e) => handleInputChange(setShortDesc, e.target.value)}
                placeholder="Briefly describe what you offer, key benefits, and a call-to-action..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Results & SERP Preview Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Google SERP Preview Box */}
          <div className="p-6 rounded-3xl bg-surface/80 border border-outline-variant/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={14} className="text-primary" /> Live Google Search Snippet Preview
              </span>

              <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant/30 text-xs font-label-mono">
                <button
                  type="button"
                  onClick={() => setSerpView('desktop')}
                  className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                    serpView === 'desktop' ? 'bg-primary text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor size={13} />
                  <span className="text-[10px] hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpView('mobile')}
                  className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                    serpView === 'mobile' ? 'bg-primary text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone size={13} />
                  <span className="text-[10px] hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Google SERP Card */}
            <div className={`p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5 transition-all ${
              serpView === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}>
              <div className="flex items-center gap-2 text-[12px] text-zinc-400 font-sans truncate">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">G</div>
                <span className="text-zinc-300">https://www.yourdomain.com</span>
                <span className="text-zinc-500">&rsaquo; {generated.slug}</span>
              </div>

              <h4 className="text-base sm:text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1 leading-snug">
                {generated.title}
              </h4>

              <p className="text-xs sm:text-sm text-[#bdc1c6] leading-relaxed line-clamp-2">
                {generated.description}
              </p>
            </div>
          </div>

          {/* Generated Tag Fields with Counters & Copy */}
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-5 shadow-xl">
            {/* Title Tag */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-label-mono">
                <span className="text-zinc-300 font-bold uppercase">SEO Title Tag</span>
                <span className={generated.titleLength <= 60 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {generated.titleLength}/60 chars ({generated.titleLength <= 60 ? 'Optimal' : 'Slightly Long'})
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generated.title}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white font-medium focus:outline-none"
                />
                <CopyButton textToCopy={generated.title} toolId="meta-tag-generator" />
              </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-label-mono">
                <span className="text-zinc-300 font-bold uppercase">Meta Description</span>
                <span className={generated.descLength >= 130 && generated.descLength <= 160 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {generated.descLength}/160 chars ({generated.descLength <= 160 ? 'Optimal' : 'Review'})
                </span>
              </div>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  readOnly
                  value={generated.description}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-xs sm:text-sm text-white focus:outline-none leading-relaxed"
                />
                <CopyButton textToCopy={generated.description} toolId="meta-tag-generator" />
              </div>
            </div>

            {/* Suggested Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-label-mono">
                <span className="text-zinc-300 font-bold uppercase">Suggested URL Slug</span>
                <span className="text-zinc-500 font-mono">Clean lowercase</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generated.slug}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-xs text-white font-mono focus:outline-none"
                />
                <CopyButton textToCopy={generated.slug} toolId="meta-tag-generator" />
              </div>
            </div>

            {/* Complete HTML Snippet */}
            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-xs font-label-mono text-zinc-400">Copy Complete HTML Head Tags:</span>
              <CopyButton textToCopy={generated.fullHtml} label="Copy HTML Code" toolId="meta-tag-generator" />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
