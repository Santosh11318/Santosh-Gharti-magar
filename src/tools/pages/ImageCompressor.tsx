import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, RefreshCw, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

export default function ImageCompressor({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'image-compressor')!;

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);

  const [quality, setQuality] = useState<number>(80);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressing, setCompressing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const processCompression = (file: File, q: number) => {
    setCompressing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress to JPEG or WebP based on quality
          const outputType = file.type === 'image/png' ? 'image/jpeg' : file.type;
          const dataUrl = canvas.toDataURL(outputType, q / 100);

          setCompressedUrl(dataUrl);

          // Calculate approximate byte size from base64
          const head = 'data:' + outputType + ';base64,';
          const byteLength = Math.round(((dataUrl.length - head.length) * 3) / 4);
          setCompressedSize(byteLength);

          setCompressing(false);
          trackToolEvent('tool_used', 'image-compressor', {
            originalSize: file.size,
            compressedSize: byteLength,
            reduction: Math.round(((file.size - byteLength) / file.size) * 100)
          });
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalSize(file.size);
    setOriginalUrl(URL.createObjectURL(file));

    processCompression(file, quality);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalFile) {
      processCompression(originalFile, newQ);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !originalFile) return;

    const a = document.createElement('a');
    a.href = compressedUrl;
    const nameParts = originalFile.name.split('.');
    const ext = originalFile.type === 'image/png' ? 'jpg' : (nameParts.pop() || 'jpg');
    a.download = `${nameParts.join('.')}-compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    trackToolEvent('download_clicked', 'image-compressor');
  };

  const percentReduction = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Want a lightning-fast website with 99+ Google PageSpeed?"
      conversionSubheadline="We build custom websites with automated image optimization, responsive WebP rendering, and sub-second loading speeds."
      whatsappMessage="Hi Santosh! I compressed my images with your tool and want to optimize my full website speed."
    >
      <div className="space-y-8">
        {/* Upload Box */}
        {!originalFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-12 sm:p-16 rounded-3xl bg-surface/70 border-2 border-dashed border-outline-variant/40 hover:border-primary/60 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
              <Upload size={28} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Choose an image or drag &amp; drop here
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mb-4">
              Supports JPG, PNG, and WebP up to 25MB. 100% private in your browser.
            </p>

            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider shadow-lg glow-btn"
            >
              Browse Image From Device
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Compression Toolbar */}
            <div className="p-6 rounded-3xl bg-surface/80 border border-outline-variant/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Quality Slider */}
              <div className="w-full md:w-80 space-y-2">
                <div className="flex items-center justify-between text-xs font-label-mono">
                  <span className="text-zinc-300 font-bold uppercase">Compression Quality:</span>
                  <span className="text-primary font-bold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="5"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-label-mono text-zinc-500">
                  <span>Smaller Size (High Compression)</span>
                  <span>Max Clarity (95%)</span>
                </div>
              </div>

              {/* Stats Card */}
              <div className="flex items-center gap-4 text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-label-mono text-zinc-500 uppercase">Original</span>
                  <div className="text-base font-bold text-white font-mono">{formatFileSize(originalSize)}</div>
                </div>

                <div className="text-zinc-600 font-bold">&rarr;</div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-label-mono text-emerald-400 uppercase">Compressed</span>
                  <div className="text-base font-bold text-emerald-400 font-mono">{formatFileSize(compressedSize)}</div>
                </div>

                {percentReduction > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-label-mono font-bold">
                    -{percentReduction}% Saved
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 rounded-xl bg-surface hover:bg-surface-variant text-zinc-300 hover:text-white border border-outline-variant/30 text-xs font-label-mono cursor-pointer"
                >
                  Change Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={compressing || !compressedUrl}
                  className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-primary hover:bg-red-700 text-on-primary font-label-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg glow-btn cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download Image</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Preview */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="p-4 sm:p-5 rounded-3xl bg-surface/50 border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-label-mono text-zinc-400">
                  <span>ORIGINAL PHOTO</span>
                  <span>{formatFileSize(originalSize)}</span>
                </div>
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center border border-outline-variant/20">
                  <img
                    src={originalUrl}
                    alt="Original Upload"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed */}
              <div className="p-4 sm:p-5 rounded-3xl bg-surface/50 border border-primary/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-label-mono">
                  <span className="text-emerald-400 font-bold">COMPRESSED PREVIEW</span>
                  <span className="text-emerald-400 font-bold">{formatFileSize(compressedSize)}</span>
                </div>
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center border border-outline-variant/20 relative">
                  {compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">Compressing...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
