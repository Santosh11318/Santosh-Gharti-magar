import { MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { trackToolEvent } from '../analytics';

interface ConversionCTAProps {
  toolId?: string;
  headline?: string;
  subheadline?: string;
  whatsappMessage?: string;
}

export default function ConversionCTA({
  toolId = 'free-tools',
  headline = 'Want us to build or optimize your website?',
  subheadline = 'Get a professional, modern website with custom design, guaranteed speed, high-ranking SEO, and direct WhatsApp lead generation.',
  whatsappMessage = 'Hi Santosh! I used your free tool and would like to get a quote/consultation for my business website.'
}: ConversionCTAProps) {
  const encodedMsg = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/918799747981?text=${encodedMsg}`;

  const handleWhatsAppClick = () => {
    trackToolEvent('whatsapp_clicked', toolId, { source: 'conversion_cta' });
  };

  const handleContactClick = () => {
    trackToolEvent('contact_clicked', toolId, { source: 'conversion_cta' });
  };

  return (
    <div className="my-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-surface to-surface-container border border-outline-variant/40 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-label-mono text-primary font-bold tracking-wider uppercase mb-3">
          <Sparkles size={14} /> Professional Web &amp; SEO Services
        </div>

        <h3 className="font-display-lg text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
          {headline}
        </h3>

        <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-6">
          {subheadline}
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <div className="flex items-center gap-2 text-xs font-label-mono text-zinc-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Mobile-First &amp; Ultra Fast</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-label-mono text-zinc-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Google SEO &amp; Schema Ready</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-label-mono text-zinc-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Direct WhatsApp Leads</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-label-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle size={17} />
            <span>Talk on WhatsApp</span>
          </a>

          <a
            href="/#contact"
            onClick={(e) => {
              handleContactClick();
              if (window.location.pathname !== '/') {
                window.location.href = '/#contact';
              } else {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-red-700 text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/25 cursor-pointer glow-btn"
          >
            <span>Get Free Consultation</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
