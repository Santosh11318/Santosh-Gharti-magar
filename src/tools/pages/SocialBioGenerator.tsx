import React, { useState, useMemo } from 'react';
import { UserCheck, Instagram, Facebook, Linkedin, Youtube, Copy, Check, Sparkles } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import CopyButton from '../components/CopyButton';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

export default function SocialBioGenerator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'social-bio-generator')!;

  const [name, setName] = useState('Santosh Gharti Magar');
  const [industry, setIndustry] = useState('Web Development & SEO');
  const [location, setLocation] = useState('Nepal & Global');
  const [mainService, setMainService] = useState('High-Converting Custom Websites');
  const [usp, setUsp] = useState('Modern UI/UX & Guaranteed PageSpeed');
  const [cta, setCta] = useState('Book a Free Website Consultation 👇');
  const [style, setStyle] = useState<'clean' | 'emoji'>('emoji');

  const generatedBios = useMemo(() => {
    // 1. Instagram (Strict max 150 chars)
    let igBio = style === 'emoji'
      ? `💻 ${mainService}\n⚡ ${usp}\n📍 ${location}\n👇 ${cta}`
      : `${mainService}. ${usp}. Serving ${location}. ${cta}`;

    if (igBio.length > 150) {
      igBio = style === 'emoji'
        ? `💻 ${mainService}\n⚡ ${usp}\n👇 ${cta}`
        : `${mainService}. ${usp}. ${cta}`;
    }

    // 2. Facebook About
    const fbBio = `${name} | ${industry}\n\nWe build ${mainService.toLowerCase()} engineered with ${usp.toLowerCase()} to turn website visitors into loyal paying customers.\n\n📍 Based in ${location}\n🚀 Ready to scale your brand? ${cta}`;

    // 3. LinkedIn Headline & About
    const linkedInHeadline = `${industry} Specialist | Helping Brands 3x Conversions with ${mainService} | ${location}`;
    const linkedInAbout = `I help modern businesses and founders establish dominant online authority through ${mainService.toLowerCase()} and strategic SEO.\n\nWhy work with me:\n• ${usp}\n• Tailored to local & international markets\n• Proven ROI and measurable lead generation\n\nLet's connect or send a message to discuss your next project.`;

    // 4. YouTube Channel Description
    const ytBio = `Welcome to the official channel for ${name} (${industry}).\n\nHere we share actionable insights on ${mainService.toLowerCase()}, modern UI/UX design, and SEO strategies to grow your business online.\n\n📍 Based in ${location}\n👉 Get in touch: ${cta}`;

    return {
      instagram: igBio,
      facebook: fbBio,
      linkedInHeadline,
      linkedInAbout,
      youtube: ytBio
    };
  }, [name, industry, location, mainService, usp, cta, style]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, val: string) => {
    setter(val);
    trackToolEvent('tool_used', 'social-bio-generator');
  };

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Want a modern website to link in your social bio?"
      conversionSubheadline="A great bio needs a high-converting website destination. We build custom websites, digital portfolios, and WhatsApp lead funnels."
      whatsappMessage={`Hi Santosh! I generated my social bio for "${name}" and want a custom website for my link in bio.`}
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label-mono text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck size={14} /> Profile Inputs
              </span>

              {/* Style Toggle */}
              <div className="flex gap-1 p-1 rounded-xl bg-surface border border-outline-variant/30 text-xs font-label-mono">
                <button
                  type="button"
                  onClick={() => setStyle('emoji')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    style === 'emoji' ? 'bg-primary text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Emoji
                </button>
                <button
                  type="button"
                  onClick={() => setStyle('clean')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    style === 'clean' ? 'bg-primary text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Minimal
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Name / Brand Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange(setName, e.target.value)}
                placeholder="e.g. Santosh Gharti Magar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Industry / Niche *
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => handleInputChange(setIndustry, e.target.value)}
                placeholder="e.g. AI Website Development"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Main Service / Offer *
              </label>
              <input
                type="text"
                value={mainService}
                onChange={(e) => handleInputChange(setMainService, e.target.value)}
                placeholder="e.g. High-Converting Custom Websites"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Unique Advantage (USP) *
              </label>
              <input
                type="text"
                value={usp}
                onChange={(e) => handleInputChange(setUsp, e.target.value)}
                placeholder="e.g. Modern UI/UX & 99+ PageSpeed"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Location / Coverage
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => handleInputChange(setLocation, e.target.value)}
                placeholder="e.g. Kathmandu, Nepal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Call-To-Action (CTA) *
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => handleInputChange(setCta, e.target.value)}
                placeholder="e.g. Book a Free Call 👇"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Bios Output Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Instagram Bio */}
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Instagram size={18} className="text-pink-500" />
                <span>Instagram Bio</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-label-mono ${generatedBios.instagram.length <= 150 ? 'text-emerald-400' : 'text-red-400 font-bold'}`}>
                  {generatedBios.instagram.length}/150 chars
                </span>
                <CopyButton textToCopy={generatedBios.instagram} toolId="social-bio-generator" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-outline-variant/20 font-sans text-sm text-white whitespace-pre-line leading-relaxed">
              {generatedBios.instagram}
            </div>
          </div>

          {/* LinkedIn Headline & Summary */}
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Linkedin size={18} className="text-blue-500" />
                <span>LinkedIn Headline &amp; About</span>
              </div>
              <CopyButton textToCopy={`${generatedBios.linkedInHeadline}\n\n${generatedBios.linkedInAbout}`} label="Copy Both" toolId="social-bio-generator" />
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-outline-variant/20 flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-300 font-medium">{generatedBios.linkedInHeadline}</span>
                <CopyButton textToCopy={generatedBios.linkedInHeadline} label="" toolId="social-bio-generator" />
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-outline-variant/20 text-xs text-on-surface-variant whitespace-pre-line leading-relaxed">
                {generatedBios.linkedInAbout}
              </div>
            </div>
          </div>

          {/* Facebook Page About */}
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Facebook size={18} className="text-blue-400" />
                <span>Facebook Page Description</span>
              </div>
              <CopyButton textToCopy={generatedBios.facebook} toolId="social-bio-generator" />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-outline-variant/20 text-xs sm:text-sm text-white whitespace-pre-line leading-relaxed">
              {generatedBios.facebook}
            </div>
          </div>

          {/* YouTube Channel Description */}
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Youtube size={18} className="text-red-500" />
                <span>YouTube Channel Description</span>
              </div>
              <CopyButton textToCopy={generatedBios.youtube} toolId="social-bio-generator" />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-outline-variant/20 text-xs sm:text-sm text-white whitespace-pre-line leading-relaxed">
              {generatedBios.youtube}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
