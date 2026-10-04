import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, HelpCircle, CheckCircle, Lightbulb, ExternalLink, ArrowLeft } from 'lucide-react';
import { ToolMeta } from '../types';
import ConversionCTA from './ConversionCTA';
import RelatedTools from './RelatedTools';
import { trackToolEvent } from '../analytics';

interface ToolLayoutProps {
  tool: ToolMeta;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  conversionHeadline?: string;
  conversionSubheadline?: string;
  whatsappMessage?: string;
}

export default function ToolLayout({
  tool,
  children,
  onNavigate,
  conversionHeadline,
  conversionSubheadline,
  whatsappMessage
}: ToolLayoutProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Update Document Title, Meta Description, and Structured Data
  useEffect(() => {
    document.title = tool.metaTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', tool.metaDescription);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://www.santoshghartimagar.site${tool.path}`);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track tool opened event
    trackToolEvent('tool_opened', tool.id, { category: tool.category });

    // JSON-LD Structured Data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = `schema-${tool.id}`;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": tool.name,
          "url": `https://www.santoshghartimagar.site${tool.path}`,
          "description": tool.longDescription,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": "Santosh Gharti Magar",
            "url": "https://www.santoshghartimagar.site"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.santoshghartimagar.site/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Free Marketing Tools",
              "item": "https://www.santoshghartimagar.site/free-tools"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": tool.name,
              "item": `https://www.santoshghartimagar.site${tool.path}`
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": tool.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      ]
    };

    schemaScript.text = JSON.stringify(structuredData);
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(`schema-${tool.id}`);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [tool]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs font-label-mono text-on-surface-variant mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight size={13} className="text-zinc-600" />
        <button
          onClick={() => onNavigate('/free-tools')}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Free Tools
        </button>
        <ChevronRight size={13} className="text-zinc-600" />
        <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">
          {tool.name}
        </span>
      </nav>

      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('/free-tools')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-variant text-zinc-300 hover:text-white border border-outline-variant/30 text-xs font-label-mono transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>All Free Tools</span>
        </button>
      </div>

      {/* Tool Header */}
      <header className="mb-8 space-y-3">
        <div className="flex items-center gap-3 text-xs text-zinc-400 font-label-mono">
          <span className="text-primary font-bold">{tool.categoryName}</span>
          <span aria-hidden="true">&bull;</span>
          <span>100% Free · No Signup</span>
          <span aria-hidden="true">&bull;</span>
          <span>Takes {tool.estimatedTime}</span>
        </div>

        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {tool.name}
        </h1>

        <p className="text-on-surface-variant text-base sm:text-lg max-w-3xl leading-relaxed">
          {tool.shortDescription}
        </p>
      </header>

      {/* Main Interactive Tool Interface Card */}
      <main className="mb-14">
        {children}
      </main>

      {/* How it Works Step-by-Step */}
      <section className="my-14 p-6 sm:p-8 rounded-3xl bg-surface/50 border border-outline-variant/30">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb size={20} className="text-amber-400" />
          <h2 className="font-display-lg text-xl sm:text-2xl font-bold text-white">
            How It Works
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {tool.howItWorks.map((step) => (
            <div key={step.step} className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary font-label-mono font-bold text-sm flex items-center justify-center border border-primary/30">
                0{step.step}
              </div>
              <h3 className="font-bold text-base text-white">{step.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Use This Tool? (Clean unboxed text) */}
      <section className="my-14 space-y-6">
        <h2 className="font-display-lg text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle size={20} className="text-emerald-400" /> Why Use Our {tool.name}?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {tool.whyUse.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-surface/40 border border-outline-variant/20 space-y-2">
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contextual Blog Link */}
      {tool.targetBlogTitle && (
        <div className="my-8 p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-label-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-primary font-bold">Related Guide:</span>
            <span className="text-white font-medium">{tool.targetBlogTitle}</span>
          </div>
          <button
            onClick={() => onNavigate('/#blog')}
            className="inline-flex items-center gap-1.5 text-primary hover:text-red-400 font-bold transition-colors cursor-pointer shrink-0"
          >
            <span>Read on our Blog</span>
            <ExternalLink size={13} />
          </button>
        </div>
      )}

      {/* Soft Conversion Call to Action */}
      <ConversionCTA
        toolId={tool.id}
        headline={conversionHeadline}
        subheadline={conversionSubheadline}
        whatsappMessage={whatsappMessage}
      />

      {/* FAQ Accordion Section */}
      <section className="my-14 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={20} className="text-secondary" />
          <h2 className="font-display-lg text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {tool.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-surface/60 border border-outline-variant/30 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-primary transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contextual Internal Links Footer */}
      <nav className="my-10 p-5 rounded-2xl bg-surface-container/30 border border-outline-variant/20 flex flex-wrap items-center justify-between gap-4 text-xs font-label-mono">
        <span className="text-zinc-400">Explore Services:</span>
        <div className="flex flex-wrap gap-4 text-primary">
          <button onClick={() => onNavigate('/#services')} className="hover:underline cursor-pointer">
            Custom Web Development
          </button>
          <span className="text-zinc-600">&bull;</span>
          <button onClick={() => onNavigate('/#services')} className="hover:underline cursor-pointer">
            Local &amp; Technical SEO
          </button>
          <span className="text-zinc-600">&bull;</span>
          <button onClick={() => onNavigate('/#pricing')} className="hover:underline cursor-pointer">
            Transparent Pricing
          </button>
          <span className="text-zinc-600">&bull;</span>
          <button onClick={() => onNavigate('/#contact')} className="hover:underline cursor-pointer">
            Get Direct Quote
          </button>
        </div>
      </nav>

      {/* Related Tools */}
      <RelatedTools
        currentToolId={tool.id}
        relatedIds={tool.relatedToolIds}
        onNavigate={onNavigate}
      />
    </div>
  );
}
