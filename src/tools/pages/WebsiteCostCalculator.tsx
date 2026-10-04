import { useState, useMemo } from 'react';
import { Calculator, Check, ArrowRight, MessageCircle, Clock, ShieldCheck, Sparkles, Send } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import { ALL_TOOLS } from '../toolsData';
import { WEBSITE_PRICING_CONFIG } from '../pricingConfig';
import { trackToolEvent } from '../analytics';

const BUSINESS_ITEMS = [
  { name: 'Restaurant', icon: '🍽️' },
  { name: 'Clinic', icon: '🏥' },
  { name: 'Hotel', icon: '🏨' },
  { name: 'Real Estate', icon: '🏢' },
  { name: 'Ecommerce', icon: '🛍️' },
  { name: 'Freelancer', icon: '💼' },
  { name: 'Agency', icon: '🚀' },
  { name: 'Local Business', icon: '📍' },
  { name: 'Other', icon: '⚡' }
];

const PAGE_OPTIONS = [
  { id: '1', label: '1 Page', sub: 'Landing page' },
  { id: '3–5', label: '3–5 Pages', sub: 'Standard' },
  { id: '6–10', label: '6–10 Pages', sub: 'Multi-page' },
  { id: '10+', label: '10+ Pages', sub: 'Enterprise' }
];

export default function WebsiteCostCalculator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'website-cost-calculator')!;

  const [businessType, setBusinessType] = useState('Local Business');
  const [pageCount, setPageCount] = useState('3–5');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'whatsapp',
    'contact_form',
    'google_maps',
    'seo'
  ]);

  const toggleFeature = (featureKey: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureKey) ? prev.filter(f => f !== featureKey) : [...prev, featureKey]
    );
  };

  // Calculate pricing based on centralized WEBSITE_PRICING_CONFIG
  const calculation = useMemo(() => {
    const baseInfo = WEBSITE_PRICING_CONFIG.businessTypeBase[businessType] || WEBSITE_PRICING_CONFIG.businessTypeBase['Other'];
    const pageInfo = WEBSITE_PRICING_CONFIG.pagePricing[pageCount] || WEBSITE_PRICING_CONFIG.pagePricing['3–5'];

    // Feature costs
    let featureCost = 0;
    let extraDays = 0;
    selectedFeatures.forEach(featKey => {
      const feat = WEBSITE_PRICING_CONFIG.featurePricing[featKey];
      if (feat) {
        featureCost += feat.price;
        extraDays += feat.extraDays;
      }
    });

    const subtotal = (baseInfo.basePrice * pageInfo.multiplier) + pageInfo.extraPrice + featureCost;
    const minPrice = Math.round(subtotal * 0.95);
    const maxPrice = Math.round(subtotal * 1.15);
    const totalDays = Math.max(3, baseInfo.baseDays + pageInfo.extraDays + Math.round(extraDays * 0.6));

    return {
      minPrice,
      maxPrice,
      totalDays,
      recommendedPackage: baseInfo.recommendedPackage,
      description: baseInfo.description,
      currency: WEBSITE_PRICING_CONFIG.currencySymbol
    };
  }, [businessType, pageCount, selectedFeatures]);

  const whatsappMessage = `Hi Santosh! I calculated my website quote on your website:
• Business: ${businessType}
• Pages: ${pageCount}
• Features: ${selectedFeatures.map(f => WEBSITE_PRICING_CONFIG.featurePricing[f]?.label || f).join(', ')}
• Estimated Range: ${calculation.currency}${calculation.minPrice.toLocaleString()} - ${calculation.currency}${calculation.maxPrice.toLocaleString()}
I'd like to get started with this package!`;

  const handleGetWebsite = () => {
    trackToolEvent('whatsapp_clicked', 'website-cost-calculator', {
      businessType,
      pageCount,
      minPrice: calculation.minPrice,
      maxPrice: calculation.maxPrice
    });
    const url = `https://wa.me/918799747981?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Ready to launch your high-converting website?"
      conversionSubheadline="Get an exact fixed quote, modern mobile-first UI/UX, direct WhatsApp lead capture, and full SEO setup included."
      whatsappMessage={whatsappMessage}
    >
      {/* Mobile Live Sticky Header Card (Always visible on mobile right at the start) */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-surface to-surface-container border border-primary/40 shadow-xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider block">
            Live Estimated Price
          </span>
          <div className="text-xl sm:text-2xl font-black text-white font-display-lg truncate">
            {calculation.currency}{calculation.minPrice.toLocaleString()} – {calculation.currency}{calculation.maxPrice.toLocaleString()}
          </div>
          <div className="text-[11px] font-label-mono text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5 truncate">
            <span>⚡ {calculation.totalDays} Days</span>
            <span>&bull;</span>
            <span className="truncate">{calculation.recommendedPackage}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetWebsite}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg glow-btn shrink-0 cursor-pointer"
        >
          <span>Get Quote</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          {/* Step 1: Business Type */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider">
                1. Select Your Business Type
              </label>
              <span className="text-[11px] font-label-mono text-primary font-bold">{businessType}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_ITEMS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setBusinessType(item.name);
                    trackToolEvent('tool_used', 'website-cost-calculator', { businessType: item.name });
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-sans text-left transition-all cursor-pointer border flex items-center gap-2 ${
                    businessType === item.name
                      ? 'bg-primary/20 text-white border-primary font-bold shadow-md'
                      : 'bg-surface hover:bg-surface-variant text-zinc-300 hover:text-white border-outline-variant/30'
                  }`}
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Page Count */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3">
            <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider">
              2. Number of Pages
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPageCount(opt.id)}
                  className={`py-2.5 px-3 rounded-xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center ${
                    pageCount === opt.id
                      ? 'bg-primary text-on-primary border-primary font-bold shadow-md'
                      : 'bg-surface hover:bg-surface-variant text-zinc-300 hover:text-white border-outline-variant/30'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold font-sans">{opt.label}</span>
                  <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Features Checklist */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider">
                3. Choose Required Features
              </label>
              <span className="text-[11px] font-label-mono text-zinc-500">
                {selectedFeatures.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(WEBSITE_PRICING_CONFIG.featurePricing).map(([key, feat]) => {
                const isChecked = selectedFeatures.includes(key);
                return (
                  <div
                    key={key}
                    onClick={() => toggleFeature(key)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-surface-container border-primary/50 text-white'
                        : 'bg-surface hover:bg-surface-variant/50 border-outline-variant/20 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                        isChecked ? 'bg-primary border-primary text-white' : 'border-outline-variant/60'
                      }`}>
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className="text-xs font-medium truncate">{feat.label}</span>
                    </div>

                    <span className="text-[10px] font-label-mono text-zinc-400 shrink-0 font-bold">
                      {feat.price === 0 ? 'FREE' : `+${WEBSITE_PRICING_CONFIG.currencySymbol}${feat.price}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sticky Quotation Summary Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-surface to-surface-container border border-outline-variant/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-label-mono text-primary font-bold uppercase tracking-wider">
                  Full Project Summary
                </span>
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {calculation.recommendedPackage}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                <Calculator size={18} />
              </div>
            </div>

            {/* Price Range Display */}
            <div className="space-y-1">
              <span className="text-xs font-label-mono text-zinc-400">Estimated Project Cost:</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-display-lg tracking-tight">
                {calculation.currency}{calculation.minPrice.toLocaleString()} – {calculation.currency}{calculation.maxPrice.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-400 font-label-mono">
                Includes responsive design, development, mobile testing, and 30 days free support.
              </p>
            </div>

            {/* Delivery Timeline & Trust */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface border border-outline-variant/20 text-xs font-label-mono">
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock size={15} className="text-amber-400 shrink-0" />
                <div>
                  <span className="text-zinc-500 block text-[9px]">Timeline</span>
                  <span className="font-bold">{calculation.totalDays} Days</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="text-zinc-500 block text-[9px]">Warranty</span>
                  <span className="font-bold">30 Days Support</span>
                </div>
              </div>
            </div>

            {/* Selected Breakdown List */}
            <div className="space-y-2 border-t border-outline-variant/20 pt-3">
              <span className="text-xs font-label-mono text-zinc-300 font-bold uppercase">Included Highlights:</span>
              <ul className="space-y-1.5 text-xs text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  <span className="truncate">{businessType} Custom Layout &amp; Architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  <span>{pageCount} Fully Mobile-Responsive Pages</span>
                </li>
                {selectedFeatures.slice(0, 3).map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="truncate">{WEBSITE_PRICING_CONFIG.featurePricing[f]?.label}</span>
                  </li>
                ))}
                {selectedFeatures.length > 3 && (
                  <li className="text-[11px] text-zinc-500 pl-3.5">
                    + {selectedFeatures.length - 3} more selected features
                  </li>
                )}
              </ul>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleGetWebsite}
                className="w-full py-3.5 px-5 rounded-xl bg-primary hover:bg-red-700 text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25 cursor-pointer glow-btn"
              >
                <Sparkles size={15} />
                <span>Get My Website Quote</span>
              </button>

              <a
                href={`https://wa.me/918799747981?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackToolEvent('whatsapp_clicked', 'website-cost-calculator')}
                className="w-full py-2.5 px-5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-label-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>Discuss on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Bar for Mobile Devices */}
      <div className="fixed bottom-3 left-3 right-3 z-30 lg:hidden animate-fade-in">
        <div className="p-3 pl-4 pr-3 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-primary/40 shadow-2xl flex items-center justify-between gap-3 text-white">
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 font-label-mono block leading-none">Est. Price:</span>
            <span className="text-sm font-extrabold font-display-lg text-white truncate block">
              {calculation.currency}{calculation.minPrice.toLocaleString()} - {calculation.currency}{calculation.maxPrice.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleGetWebsite}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white font-label-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-lg glow-btn cursor-pointer"
          >
            <span>Quote</span>
            <Send size={12} />
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
