import { useState, useMemo } from 'react';
import { Receipt, Percent, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import { ALL_TOOLS } from '../toolsData';
import { trackToolEvent } from '../analytics';

const STANDARD_GST_RATES = [5, 12, 18, 28];

export default function GstCalculator({ onNavigate }: { onNavigate: (path: string) => void }) {
  const tool = ALL_TOOLS.find(t => t.id === 'gst-calculator')!;

  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [currency, setCurrency] = useState('₹');

  const calculation = useMemo(() => {
    const amt = Math.max(0, Number(amount) || 0);
    const gstRate = Math.max(0, Number(rate) || 0);

    let baseAmount = 0;
    let gstAmount = 0;
    let finalAmount = 0;

    if (isInclusive) {
      // Inclusive formula: GST = Amount - [Amount * (100 / (100 + Rate))]
      baseAmount = amt * (100 / (100 + gstRate));
      gstAmount = amt - baseAmount;
      finalAmount = amt;
    } else {
      // Exclusive formula: GST = (Amount * Rate) / 100
      baseAmount = amt;
      gstAmount = (amt * gstRate) / 100;
      finalAmount = amt + gstAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      baseAmount: baseAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2)
    };
  }, [amount, rate, isInclusive]);

  return (
    <ToolLayout
      tool={tool}
      onNavigate={onNavigate}
      conversionHeadline="Looking for transparent web development with zero surprises?"
      conversionSubheadline="All our website development packages include crystal-clear invoicing, fixed milestones, and no hidden add-ons."
      whatsappMessage={`Hi Santosh! I calculated GST for an amount of ${currency}${amount} and want a formal proposal for my website.`}
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface/70 border border-outline-variant/30 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label-mono text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Receipt size={14} /> Tax Calculator Inputs
              </span>

              {/* Currency Selector */}
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

            {/* Amount */}
            <div>
              <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase mb-1">
                Enter Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    trackToolEvent('tool_used', 'gst-calculator');
                  }}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface border border-outline-variant text-base text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Mode Toggle: Inclusive vs Exclusive */}
            <div>
              <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase mb-1.5">
                Tax Inclusion Mode
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsInclusive(false)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-label-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    !isInclusive
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  GST Exclusive (+)
                </button>
                <button
                  type="button"
                  onClick={() => setIsInclusive(true)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-label-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    isInclusive
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  GST Inclusive (MRP)
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-label-mono">
                {isInclusive ? 'Amount already includes tax. Extracts base price.' : 'Calculates tax to add on top of base price.'}
              </p>
            </div>

            {/* Rate Slabs */}
            <div>
              <label className="block text-xs font-label-mono text-zinc-300 font-bold uppercase mb-1.5">
                GST Tax Rate Slab
              </label>
              <div className="grid grid-cols-4 gap-2">
                {STANDARD_GST_RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRate(r)}
                    className={`py-2.5 rounded-xl text-xs font-label-mono font-bold border transition-all cursor-pointer ${
                      rate === r
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-surface hover:bg-surface-variant text-zinc-400 hover:text-white border-outline-variant/30'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface/80 border border-outline-variant/40 shadow-xl space-y-6">
            <span className="text-xs font-label-mono text-primary font-bold uppercase tracking-wider block">
              Calculation Breakdown ({isInclusive ? 'GST Inclusive' : 'GST Exclusive'} @ {rate}%)
            </span>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-1">
                <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider block">
                  Base Amount
                </span>
                <div className="text-2xl font-black font-display-lg text-white">
                  {currency}{Number(calculation.baseAmount).toLocaleString()}
                </div>
                <span className="text-[10px] text-zinc-500 block">Pre-tax subtotal</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-1">
                <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider block">
                  Total GST Amount
                </span>
                <div className="text-2xl font-black font-display-lg text-primary">
                  {currency}{Number(calculation.gstAmount).toLocaleString()}
                </div>
                <span className="text-[10px] text-zinc-500 block">Tax component</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-1">
                <span className="text-[10px] font-label-mono text-zinc-400 uppercase tracking-wider block">
                  Total Billed Amount
                </span>
                <div className="text-2xl font-black font-display-lg text-emerald-400">
                  {currency}{Number(calculation.finalAmount).toLocaleString()}
                </div>
                <span className="text-[10px] text-zinc-500 block">Final customer payable</span>
              </div>
            </div>

            {/* CGST / SGST Split */}
            <div className="p-4 rounded-2xl bg-surface/50 border border-outline-variant/20 space-y-3">
              <span className="text-xs font-label-mono text-zinc-300 font-bold uppercase">Tax Division Breakdown</span>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 flex items-center justify-between">
                  <span className="text-zinc-400">CGST ({(rate / 2).toFixed(1)}%):</span>
                  <span className="text-white font-bold">{currency}{calculation.cgst}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 flex items-center justify-between">
                  <span className="text-zinc-400">SGST ({(rate / 2).toFixed(1)}%):</span>
                  <span className="text-white font-bold">{currency}{calculation.sgst}</span>
                </div>
              </div>
            </div>

            {/* Required Tax Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
              <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Disclaimer:</strong> This calculator is for estimation and quotation purposes only. Verify official tax calculations, HSN/SAC codes, and state exemptions with a qualified tax professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
