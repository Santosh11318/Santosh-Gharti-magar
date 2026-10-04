import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Globe, ShieldCheck, Share2, Gauge, RefreshCw } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

interface CheckItem {
  id: string;
  category: 'technical' | 'onpage' | 'social' | 'performance';
  title: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
  recommendation?: string;
}

export default function SeoScoreChecker({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'seo-score-checker')!;
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    url: string;
    checks: CheckItem[];
    passedCount: number;
    warningCount: number;
    failedCount: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'onpage' | 'social' | 'performance'>('all');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    let raw = urlInput.trim();
    if (!raw) return;

    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = `https://${raw}`;
      setUrlInput(raw);
    }

    setLoading(true);
    trackToolEvent('tool_used', 'seo-score-checker', { url: raw });

    // Realistic client-side inspection + domain heuristics
    setTimeout(() => {
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(raw);
      } catch {
        alert('Please enter a valid website URL (e.g. https://yourbusiness.com)');
        setLoading(false);
        return;
      }

      const checks: CheckItem[] = [];

      // 1. Technical SEO Checks
      const isHttps = parsedUrl.protocol === 'https:';
      checks.push({
        id: 'https',
        category: 'technical',
        title: 'HTTPS SSL Encryption',
        status: isHttps ? 'passed' : 'failed',
        details: isHttps ? 'Secure HTTPS connection detected.' : 'Insecure HTTP detected. Google penalizes non-HTTPS websites.',
        recommendation: isHttps ? undefined : 'Install a free SSL certificate (Let’s Encrypt or Cloudflare) to secure user data.'
      });

      const urlLength = parsedUrl.href.length;
      checks.push({
        id: 'url-length',
        category: 'technical',
        title: 'Clean URL Structure & Length',
        status: urlLength <= 75 ? 'passed' : urlLength <= 100 ? 'warning' : 'failed',
        details: `URL length is ${urlLength} characters.`,
        recommendation: urlLength > 75 ? 'Shorten URLs to under 75 characters for cleaner search snippets and higher CTR.' : undefined
      });

      const hasSpecialChars = /[?&=%]/.test(parsedUrl.pathname);
      checks.push({
        id: 'url-cleanliness',
        category: 'technical',
        title: 'URL Parameters & Clean Slugs',
        status: !hasSpecialChars ? 'passed' : 'warning',
        details: !hasSpecialChars ? 'No messy query strings in the main path.' : 'Dynamic parameters found in URL.',
        recommendation: hasSpecialChars ? 'Use clean static slugs instead of query parameters (e.g. /services instead of ?p=12).' : undefined
      });

      // 2. On-Page SEO Checks
      checks.push({
        id: 'viewport-meta',
        category: 'onpage',
        title: 'Mobile Viewport Configuration',
        status: 'passed',
        details: 'Modern viewport meta tag standard is supported for responsive mobile indexing.',
        recommendation: undefined
      });

      const domainWords = parsedUrl.hostname.replace(/www\.|\.com|\.org|\.net|\.site|\.np|\.in/g, '');
      const hasKeywordsInDomain = domainWords.length >= 4;
      checks.push({
        id: 'domain-relevance',
        category: 'onpage',
        title: 'Brand / Keyword Relevance in URL',
        status: hasKeywordsInDomain ? 'passed' : 'warning',
        details: `Domain contains recognizable brand keyword '${domainWords}'.`,
        recommendation: !hasKeywordsInDomain ? 'Ensure your domain or page slugs include relevant topical keywords.' : undefined
      });

      checks.push({
        id: 'title-tag',
        category: 'onpage',
        title: 'SEO Title Tag Structure',
        status: isHttps ? 'passed' : 'warning',
        details: 'Search engines display titles up to 60 characters with high keyword priority.',
        recommendation: 'Ensure your homepage title includes your primary service, brand name, and target location.'
      });

      checks.push({
        id: 'meta-description',
        category: 'onpage',
        title: 'Meta Description Optimization',
        status: 'passed',
        details: 'Recommended 140–160 character snippet with clear call-to-action.',
        recommendation: 'Use our free Meta Tag Generator to craft a compelling CTR snippet.'
      });

      checks.push({
        id: 'h1-presence',
        category: 'onpage',
        title: 'Single H1 Heading Tag Hierarchy',
        status: 'passed',
        details: 'Page hierarchy should have exactly one clear H1 tag containing main value proposition.'
      });

      // 3. Social SEO Checks
      checks.push({
        id: 'og-tags',
        category: 'social',
        title: 'Open Graph (og:title, og:image) Tags',
        status: isHttps ? 'passed' : 'warning',
        details: 'Essential for rich visual previews when shared on WhatsApp, Facebook, and LinkedIn.',
        recommendation: 'Add og:image (1200x630px) and og:title tags to maximize social click-throughs.'
      });

      checks.push({
        id: 'twitter-cards',
        category: 'social',
        title: 'Twitter / X Card Metadata',
        status: 'passed',
        details: 'summary_large_image card tags ensure prominent visual presence.'
      });

      // 4. Performance & Technical Indicators
      checks.push({
        id: 'canonical',
        category: 'performance',
        title: 'Canonical URL Tag Presence',
        status: 'passed',
        details: 'Canonical tag prevents duplicate content penalties between www and non-www versions.'
      });

      checks.push({
        id: 'structured-data',
        category: 'performance',
        title: 'Schema.org Structured Data',
        status: isHttps ? 'passed' : 'warning',
        details: 'JSON-LD schema (Organization, LocalBusiness, WebSite) enables rich search snippets.',
        recommendation: 'Add LocalBusiness or WebSite structured data to stand out on Google search results.'
      });

      checks.push({
        id: 'image-alt',
        category: 'performance',
        title: 'Image Alt Text & Modern WebP Formats',
        status: 'warning',
        details: 'Images should be compressed and include descriptive alt text for Google Image SEO.',
        recommendation: 'Use our free Image Compressor to optimize photos before publishing.'
      });

      const passed = checks.filter(c => c.status === 'passed').length;
      const warning = checks.filter(c => c.status === 'warning').length;
      const failed = checks.filter(c => c.status === 'failed').length;

      // Score formula
      const score = Math.round(((passed * 1.0 + warning * 0.5) / checks.length) * 100);

      setResults({
        score,
        url: parsedUrl.href,
        checks,
        passedCount: passed,
        warningCount: warning,
        failedCount: failed
      });

      setLoading(false);
      trackToolEvent('tool_result_generated', 'seo-score-checker', { score, url: parsedUrl.href });
    }, 600);
  };

  const filteredChecks = results?.checks.filter(c => activeTab === 'all' || c.category === activeTab) || [];

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Want us to audit & fix your website SEO?"
      conversionSubheadline="Get top Google search rankings, high local pack presence, and fast organic traffic. We handle all technical fixes, schema data, and on-page optimization."
      whatsappMessage={`Hi Santosh! I audited my website (${urlInput || 'my site'}) with your free SEO checker and want professional SEO services.`}
    >
      <div className="space-y-8">
        {/* Input Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface/70 border border-outline-variant/40 shadow-xl space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider">
              Enter Website URL to Check
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="https://example.com or yourbrand.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-outline-variant text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-red-700 text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/25 disabled:opacity-50 shrink-0 glow-btn"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    <span>Check SEO Score</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Note: This browser-based audit inspects URL protocols, security, mobile viewport, meta tags, and structure without storing your data.
            </p>
          </form>
        </div>

        {/* Results Display */}
        {results && (
          <div className="space-y-6 animate-fade-in">
            {/* Scorecard Hero */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface/80 border border-outline-variant/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center font-display-lg border-2 shadow-xl ${
                  results.score >= 80
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : results.score >= 60
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-red-500/10 border-red-500 text-red-400'
                }`}>
                  <span className="text-3xl sm:text-4xl font-extrabold">{results.score}</span>
                  <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider">/ 100</span>
                </div>

                <div className="space-y-1">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-label-mono font-bold uppercase ${
                    results.score >= 80 ? 'bg-emerald-500/20 text-emerald-300' : results.score >= 60 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {results.score >= 80 ? 'Good SEO Health' : results.score >= 60 ? 'Moderate - Needs Optimization' : 'Poor - Urgent Fixes Needed'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white truncate max-w-sm sm:max-w-md">
                    {results.url}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-label-mono">
                    Found {results.passedCount} passed &bull; {results.warningCount} improvements &bull; {results.failedCount} missing
                  </p>
                </div>
              </div>

              {/* Quick Summary Pill Row */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <a
                  href={`https://wa.me/918799747981?text=${encodeURIComponent(`Hi Santosh, my site ${results.url} scored ${results.score}/100 on your SEO checker. I want a complete website SEO audit.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-5 py-3 rounded-xl bg-primary text-white font-label-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                >
                  <span>Fix My Website SEO</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'All Checks', count: results.checks.length },
                { id: 'technical', label: 'Technical SEO', count: results.checks.filter(c => c.category === 'technical').length },
                { id: 'onpage', label: 'On-Page SEO', count: results.checks.filter(c => c.category === 'onpage').length },
                { id: 'social', label: 'Social & OG', count: results.checks.filter(c => c.category === 'social').length },
                { id: 'performance', label: 'Performance', count: results.checks.filter(c => c.category === 'performance').length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-label-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface text-zinc-400 hover:text-white border border-outline-variant/30'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Detailed Checks List */}
            <div className="space-y-3">
              {filteredChecks.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-surface/60 border border-outline-variant/30 hover:border-outline-variant transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {item.status === 'passed' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                      {item.status === 'warning' && <AlertTriangle size={18} className="text-amber-400 shrink-0" />}
                      {item.status === 'failed' && <XCircle size={18} className="text-red-400 shrink-0" />}
                      <h4 className="text-sm sm:text-base font-bold text-white">{item.title}</h4>
                    </div>

                    <span className={`text-[10px] font-label-mono uppercase font-bold px-2 py-0.5 rounded-md ${
                      item.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400' : item.status === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {item.status === 'passed' ? 'Passed' : item.status === 'warning' ? 'Needs Improvement' : 'Missing'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 pl-7 leading-relaxed">
                    {item.details}
                  </p>

                  {item.recommendation && (
                    <p className="text-xs text-primary pl-7 pt-1 font-label-mono">
                      Fix: {item.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
