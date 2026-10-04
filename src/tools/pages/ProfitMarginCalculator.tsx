import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Percent, Info, HelpCircle } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

export default function ProfitMarginCalculator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'profit-margin-calculator')!;

  const [costPrice, setCostPrice] = useState<number>(400);
  const [sellingPrice, setSellingPrice] = useState<number>(1000);
  const [currency, setCurrency] = useState('₹');

  const calculation = useMemo(() => {
    const cost = Math.max(0, Number(costPrice) || 0);
    const sell = Math.max(0, Number(sellingPrice) || 0);

    const grossProfit = sell - cost;
    const profitMargin = sell > 0 ? (grossProfit / sell) * 100 : 0;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;

    const costRatio = sell > 0 ? Math.min(100, Math.max(0, (cost / sell) * 100)) : 100;
    const profitRatio = Math.max(0, 100 - costRatio);

    return {
      grossProfit,
      profitMargin: profitMargin.toFixed(1),
      markup: markup.toFixed(1),
      costRatio: costRatio.toFixed(1),
      profitRatio: profitRatio.toFixed(1)
    };
  }, [costPrice, sellingPrice]);

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Want to scale your business with a high-ROI website?"
      conversionSubheadline="Boost your sales margins and capture direct high-value customer inquiries without paying heavy marketplace commissions."
      whatsappMessage={`Hi Santosh! I used your Profit Margin Calculator (Cost: ${currency}${costPrice}, Sell: ${currency}${sellingPrice}) and want a website to sell directly.`}
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label-mono text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} /> Price Inputs
              </span>

              {/* Currency Picker */}
              <div className="flex gap-1 p-1 rounded-xl bg-surface border border-outline-variant/30 text-xs font-label-mono">
                {['₹', '$', 'रू'].map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`w-7 h-7 rounded-lg transition-colors cursor-pointer ${
                      currency === curr ? 'bg-primary text-white font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Cost Price (COGS per unit) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={costPrice}
                  onChange={(e) => {
                    setCostPrice(Number(e.target.value));
                    trackToolEvent('tool_used', 'profit-margin-calculator');
                  }}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface border border-outline-variant text-base text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-label-mono">
                Production cost, material, packaging, or direct labor.
              </p>
            </div>

            <div>
              <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Selling Price (Revenue per unit) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={sellingPrice}
                  onChange={(e) => {
                    setSellingPrice(Number(e.target.value));
                    trackToolEvent('tool_used', 'profit-margin-calculator');
                  }}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface border border-outline-variant text-base text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-label-mono">
                Final amount billed to your customer.
              </p>
            </div>
          </div>
        </div>

        {/* Calculation Results Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface/80 border border-outline-variant/40 shadow-xl space-y-6">
            {/* Top Metric Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-1">
                <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider block">
                  Gross Profit
                </span>
                <div className={`text-2xl font-black font-display-lg ${calculation.grossProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {currency}{calculation.grossProfit.toLocaleString()}
                </div>
                <span className="text-[10px] text-zinc-500 block">per unit sold</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-1">
                <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider block">
                  Profit Margin
                </span>
                <div className="text-2xl font-black font-display-lg text-primary">
                  {calculation.profitMargin}%
                </div>
                <span className="text-[10px] text-zinc-500 block">of revenue is profit</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-1">
                <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider block">
                  Markup Percentage
                </span>
                <div className="text-2xl font-black font-display-lg text-secondary">
                  {calculation.markup}%
                </div>
                <span className="text-[10px] text-zinc-500 block">added to cost</span>
              </div>
            </div>

            {/* Visual Revenue Ratio Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-label-mono">
                <span className="text-zinc-400">Cost Share: <strong className="text-white">{calculation.costRatio}%</strong></span>
                <span className="text-zinc-400">Profit Share: <strong className="text-emerald-400">{calculation.profitRatio}%</strong></span>
              </div>

              <div className="w-full h-4 rounded-full bg-zinc-900 overflow-hidden flex border border-outline-variant/30">
                <div
                  style={{ width: `${calculation.costRatio}%` }}
                  className="h-full bg-zinc-600 transition-all duration-300"
                  title="Cost Price Share"
                />
                <div
                  style={{ width: `${calculation.profitRatio}%` }}
                  className="h-full bg-emerald-500 transition-all duration-300"
                  title="Gross Profit Share"
                />
              </div>
            </div>

            {/* Educational Formula Guide */}
            <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/20 space-y-2.5 text-xs text-on-surface-variant">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-xs font-label-mono uppercase">
                <Info size={14} className="text-primary" /> Key Formulas for Beginners
              </h4>
              <div className="grid sm:grid-cols-2 gap-3 font-mono text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/20">
                  <span className="text-zinc-400 block mb-0.5">Margin Formula:</span>
                  <span className="text-white">(Profit &divide; Selling Price) &times; 100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/20">
                  <span className="text-zinc-400 block mb-0.5">Markup Formula:</span>
                  <span className="text-white">(Profit &divide; Cost Price) &times; 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
