import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, RotateCcw, Link2, MessageCircle, MapPin, Type, Share2, Check } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

export default function QrCodeGenerator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'qr-code-generator')!;

  const [type, setType] = useState<'url' | 'whatsapp' | 'maps' | 'text'>('url');
  const [urlValue, setUrlValue] = useState('https://www.santoshghartimagar.site');
  const [textValue, setTextValue] = useState('');
  const [waPhone, setWaPhone] = useState('918799747981');
  const [waMessage, setWaMessage] = useState('Hello! I would like to inquire about your website development services.');
  const [mapsQuery, setMapsQuery] = useState('Kathmandu, Nepal');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute final encoded string
  const encodedContent = React.useMemo(() => {
    switch (type) {
      case 'url':
        return urlValue.trim() || 'https://www.santoshghartimagar.site';
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        const msg = encodeURIComponent(waMessage.trim());
        return `https://wa.me/${cleanPhone}${msg ? `?text=${msg}` : ''}`;
      }
      case 'maps':
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery.trim())}`;
      case 'text':
      default:
        return textValue.trim() || 'Welcome to Santosh Gharti Magar Digital Solutions';
    }
  }, [type, urlValue, textValue, waPhone, waMessage, mapsQuery]);

  // Generate QR Canvas / DataURL
  useEffect(() => {
    QRCode.toDataURL(encodedContent, {
      width: 1000,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => {
        setQrDataUrl(url);
        trackToolEvent('tool_used', 'qr-code-generator', { type });
      })
      .catch(err => {
        console.error('QR code generation failed', err);
      });
  }, [encodedContent, darkColor, lightColor, type]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${type}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    trackToolEvent('download_clicked', 'qr-code-generator');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(encodedContent);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleReset = () => {
    setUrlValue('https://www.santoshghartimagar.site');
    setTextValue('');
    setWaPhone('918799747981');
    setWaMessage('');
    setMapsQuery('Kathmandu, Nepal');
    setDarkColor('#000000');
    setLightColor('#ffffff');
  };

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Want a dedicated website behind your QR code?"
      conversionSubheadline="Whether for restaurant digital menus, real estate flyers, or storefront banners, a custom lightning-fast website maximizes every scan."
      whatsappMessage="Hi Santosh! I made a QR code on your website and want to build a custom mobile-first website for it."
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Format Selector Tabs */}
          <div className="p-6 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-4 shadow-xl">
            <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase tracking-wider">
              1. Choose QR Code Content Type
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'url', label: 'Website URL', icon: Link2 },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                { id: 'maps', label: 'Google Maps', icon: MapPin },
                { id: 'text', label: 'Plain Text', icon: Type },
              ].map(item => {
                const Icon = item.icon;
                const isActive = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-label-mono flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary border-primary font-bold shadow-lg shadow-primary/20'
                        : 'bg-surface hover:bg-surface-variant text-zinc-400 hover:text-white border-outline-variant/30'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Inputs based on Type */}
            <div className="pt-2 space-y-3">
              {type === 'url' && (
                <div>
                  <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              )}

              {type === 'whatsapp' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                      Phone Number with Country Code (e.g. 918799747981) *
                    </label>
                    <input
                      type="text"
                      required
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="918799747981"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                      Prefilled WhatsApp Message (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Hello, I want to inquire about..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {type === 'maps' && (
                <div>
                  <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                    Location Name, Address or Coordinates *
                  </label>
                  <input
                    type="text"
                    required
                    value={mapsQuery}
                    onChange={(e) => setMapsQuery(e.target.value)}
                    placeholder="e.g. Thamel, Kathmandu, Nepal or 27.7172, 85.3240"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {type === 'text' && (
                <div>
                  <label className="block text-[11px] font-label-mono text-zinc-300 font-bold uppercase mb-1">
                    Plain Text / Notes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    placeholder="Type plain text message, WiFi details, or notes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>

            {/* Color Customization */}
            <div className="pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-label-mono">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">QR Color:</span>
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Background:</span>
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-label-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Colors</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview & Download Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface/80 border border-outline-variant/40 shadow-2xl flex flex-col items-center text-center space-y-6">
            <span className="text-xs font-label-mono text-primary font-bold uppercase tracking-wider">
              High-Resolution QR Preview
            </span>

            {/* QR Visual Container */}
            <div className="p-4 rounded-3xl bg-white shadow-2xl border-4 border-zinc-800">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-zinc-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <p className="text-xs text-on-surface-variant font-mono truncate max-w-xs">
              {encodedContent}
            </p>

            {/* Action Buttons */}
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-red-700 text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25 cursor-pointer glow-btn hover:scale-[1.01]"
              >
                <Download size={16} />
                <span>Download Print-Ready PNG</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-3 px-6 rounded-2xl bg-surface-variant hover:bg-surface text-zinc-300 hover:text-white border border-outline-variant/40 font-label-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
                <span>{copiedLink ? 'Target Link Copied!' : 'Copy Target Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
