import React, { useState, useMemo } from 'react';
import { Hash, Copy, Check, Sparkles, Instagram, Linkedin, Youtube, Layers } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import CopyButton from '../components/CopyButton';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

export default function HashtagGenerator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'hashtag-generator')!;

  const [topic, setTopic] = useState('Digital Marketing');
  const [businessType, setBusinessType] = useState('Web Agency');
  const [location, setLocation] = useState('Nepal');
  const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'youtube'>('instagram');

  const sanitizeTag = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const hashtagGroups = useMemo(() => {
    const cleanTopic = sanitizeTag(topic) || 'marketing';
    const cleanBiz = sanitizeTag(businessType) || 'agency';
    const cleanLoc = sanitizeTag(location) || 'local';

    const groups = [
      {
        id: 'broad',
        name: 'Broad Reach Tags',
        desc: 'High-volume discovery tags to increase post impressions',
        tags: [
          `#${cleanTopic}`,
          `#${cleanTopic}tips`,
          `#${cleanTopic}strategy`,
          `#businessgrowth`,
          `#onlinebusiness`,
          `#digitalgrowth`
        ]
      },
      {
        id: 'niche',
        name: 'Niche Community Tags',
        desc: 'Specific tags targeted at engaged buyers & clients',
        tags: [
          `#${cleanTopic}expert`,
          `#${cleanTopic}agency`,
          `#${cleanBiz}solutions`,
          `#leadgeneration`,
          `#conversionoptimization`,
          `#modernwebdesign`
        ]
      },
      {
        id: 'local',
        name: 'Local & Regional Tags',
        desc: 'Attract local clients and regional Google/Instagram searchers',
        tags: [
          `#${cleanTopic}${cleanLoc}`,
          `#${cleanBiz}${cleanLoc}`,
          `#business${cleanLoc}`,
          `#${cleanLoc}business`,
          `#${cleanLoc}entrepreneur`
        ]
      },
      {
        id: 'industry',
        name: 'Industry & Professional Tags',
        desc: 'B2B industry tags for authoritative positioning',
        tags: [
          `#${cleanBiz}`,
          `#webdevelopment`,
          `#seostrategy`,
          `#softwareagency`,
          `#brandbuilding`
        ]
      },
      {
        id: 'branded',
        name: 'Branded Campaign Tags',
        desc: 'Exclusive tags for your company campaigns and portfolios',
        tags: [
          `#${cleanBiz}life`,
          `#${cleanTopic}with${cleanBiz}`,
          `#${cleanBiz}portfolio`
        ]
      }
    ];

    return groups;
  }, [topic, businessType, location]);

  const allHashtags = useMemo(() => {
    const set = new Set<string>();
    hashtagGroups.forEach(g => g.tags.forEach(t => set.add(t)));
    return Array.from(set).join(' ');
  }, [hashtagGroups]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>, val: any) => {
    setter(val);
    trackToolEvent('tool_used', 'hashtag-generator');
  };

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Want more organic leads from search & social?"
      conversionSubheadline="We build custom high-performance websites and execute SEO strategies that turn social traffic into high-ticket paying clients."
      whatsappMessage={`Hi Santosh! I used your Hashtag Generator for "${topic}" and want to discuss digital marketing for my business.`}
    >
      <div className="space-y-8">
        {/* Controls Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-4 shadow-xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Topic / Keyword *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => handleInputChange(setTopic, e.target.value)}
                placeholder="e.g. Digital Marketing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Business Type *
              </label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => handleInputChange(setBusinessType, e.target.value)}
                placeholder="e.g. Web Agency"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => handleInputChange(setLocation, e.target.value)}
                placeholder="e.g. Nepal, India, Kathmandu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => handleInputChange(setPlatform, e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
            <span className="text-xs font-label-mono text-zinc-400">
              Total unique tags: <strong className="text-white">{allHashtags.split(' ').length}</strong>
            </span>
            <CopyButton textToCopy={allHashtags} label="Copy All Hashtags" toolId="hashtag-generator" />
          </div>
        </div>

        {/* Hashtag Groups Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {hashtagGroups.map((group) => {
            const groupText = group.tags.join(' ');
            return (
              <div
                key={group.id}
                className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-3 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Hash size={16} className="text-primary" />
                      <span>{group.name}</span>
                    </h3>
                    <CopyButton textToCopy={groupText} label="Copy Group" toolId="hashtag-generator" />
                  </div>
                  <p className="text-xs text-on-surface-variant mb-3">{group.desc}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-surface/90 border border-outline-variant/40 text-xs font-mono text-blue-400 hover:text-white transition-colors select-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
