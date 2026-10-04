import { useState, useMemo } from 'react';
import { BookOpen, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import CopyButton from '../components/CopyButton';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

const POWER_WORDS = ['Proven', 'Ultimate', 'Essential', 'Actionable', 'Secret', 'Powerful', 'Guaranteed', 'High-Converting'];
const NUMBERS = ['5', '7', '9', '10', '12', '15'];

export default function BlogTitleGenerator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'blog-title-generator')!;

  const [topic, setTopic] = useState('Website Redesign');
  const [keyword, setKeyword] = useState('Business Website');
  const [industry, setIndustry] = useState('Digital Marketing');
  const [audience, setAudience] = useState('Small Business Owners');
  const [seed, setSeed] = useState(0);

  const handleRegenerate = () => {
    setSeed(prev => prev + 1);
    trackToolEvent('tool_used', 'blog-title-generator', { topic, keyword });
  };

  const titleGroups = useMemo(() => {
    const p1 = POWER_WORDS[(seed) % POWER_WORDS.length];
    const p2 = POWER_WORDS[(seed + 3) % POWER_WORDS.length];
    const num1 = NUMBERS[(seed) % NUMBERS.length];
    const num2 = NUMBERS[(seed + 2) % NUMBERS.length];

    const cleanTopic = topic.trim() || 'Website Strategy';
    const cleanKeyword = keyword.trim() || 'Digital Growth';
    const cleanAudience = audience.trim() || 'Entrepreneurs';
    const cleanIndustry = industry.trim() || 'Business';

    return [
      {
        category: 'Listicle Headlines',
        titles: [
          `${num1} ${p1} Ways to Scale Your ${cleanKeyword} in 2026`,
          `${num2} Critical ${cleanTopic} Mistakes ${cleanAudience} Must Avoid`,
          `${num1} ${p2} Checklist Items for a High-Converting ${cleanKeyword}`
        ]
      },
      {
        category: 'How-To & Guides',
        titles: [
          `How to Master ${cleanTopic}: The Step-by-Step Guide for ${cleanAudience}`,
          `How to Build a Successful ${cleanKeyword} from Scratch`,
          `How ${cleanAudience} Can Use ${cleanTopic} to 3x Inbound Leads`
        ]
      },
      {
        category: 'Beginner & Foundational',
        titles: [
          `${cleanTopic} for Beginners: Everything You Need to Know`,
          `The No-Nonsense Guide to ${cleanKeyword} for First-Time Founders`,
          `Why Every ${cleanIndustry} Professional Needs to Understand ${cleanTopic}`
        ]
      },
      {
        category: 'Problem / Solution',
        titles: [
          `Struggling With Your ${cleanKeyword}? Here Is the Exact Fix`,
          `Why Most ${cleanTopic} Strategies Fail (And What to Do Instead)`,
          `How to Overcome the Biggest ${cleanIndustry} Roadblocks in 2026`
        ]
      },
      {
        category: 'Comparison & Decision',
        titles: [
          `Custom ${cleanKeyword} vs DIY Templates: Which Is Better for ${cleanAudience}?`,
          `The Real Cost of ${cleanTopic}: DIY vs Professional Agency`,
          `${cleanKeyword} Before & After: What Actually Moves the Needle?`
        ]
      },
      {
        category: 'Local SEO & Geo-Targeted',
        titles: [
          `Top ${cleanKeyword} Services in Nepal & India: Complete Buyer’s Guide`,
          `How to Rank Your ${cleanIndustry} Website #1 on Google Local Pack`,
          `The Ultimate Local SEO Playbook for ${cleanAudience} in 2026`
        ]
      },
      {
        category: 'Question & Curiosity Hooks',
        titles: [
          `Is Your ${cleanKeyword} Costing You Customers? (Take This Quick Test)`,
          `What Makes a ${cleanIndustry} Website Truly Profitable?`,
          `Are You Making These 3 Costly ${cleanTopic} Errors?`
        ]
      },
      {
        category: 'Conversion & ROI-Focused',
        titles: [
          `How a Redesigned ${cleanKeyword} Increased Conversion Rates by 140%`,
          `The High-ROI Approach to ${cleanTopic} for ${cleanAudience}`,
          `${num1} High-Impact Changes That Turn ${cleanKeyword} Visitors into Paying Clients`
        ]
      }
    ];
  }, [topic, keyword, industry, audience, seed]);

  const allTitlesText = useMemo(() => {
    return titleGroups
      .map(group => `## ${group.category}\n` + group.titles.map(t => `- ${t}`).join('\n'))
      .join('\n\n');
  }, [titleGroups]);

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Want us to write & publish SEO blogs for your website?"
      conversionSubheadline="We provide high-ranking SEO content creation, technical keyword research, and custom website development to turn organic searches into paying clients."
      whatsappMessage={`Hi Santosh! I used your Blog Title Generator for "${topic}" and want to discuss content marketing for my website.`}
    >
      <div className="space-y-8">
        {/* Controls Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface/70 border border-outline-variant/30 shadow-xl space-y-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Topic / Subject *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Website Redesign"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Main Keyword *
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Business Website"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Industry / Niche
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Digital Marketing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Small Business Owners"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleRegenerate}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-red-700 text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary/25 glow-btn"
            >
              <RefreshCw size={14} />
              <span>Regenerate Headline Ideas</span>
            </button>

            <CopyButton textToCopy={allTitlesText} label="Copy All Titles" toolId="blog-title-generator" />
          </div>
        </div>

        {/* Categorized Titles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {titleGroups.map((group, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3 shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-label-mono text-primary font-bold uppercase tracking-wider block mb-2">
                  {group.category}
                </span>

                <div className="space-y-2.5">
                  {group.titles.map((titleText, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3 rounded-xl bg-surface/90 border border-outline-variant/20 hover:border-outline-variant/60 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <p className="text-xs sm:text-sm font-medium text-white leading-relaxed line-clamp-2">
                        {titleText}
                      </p>
                      <CopyButton textToCopy={titleText} label="" toolId="blog-title-generator" className="shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
