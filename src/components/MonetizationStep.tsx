import React, { useState } from 'react';
import { MonetizationRoadmapData } from '../types';
import { calculateChannelRevenue } from '../utils/youtube-logic';
import { 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  Award, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Download,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Briefcase,
  Layers
} from 'lucide-react';

interface MonetizationStepProps {
  channelName: string;
  nicheName: string;
  estimatedCpm: number;
  monetization: MonetizationRoadmapData;
  onRegenerateMonetization: () => void;
  onProceedToSeo: () => void;
  onExportPlan: () => void;
  isLoading: boolean;
}

export const MonetizationStep: React.FC<MonetizationStepProps> = ({
  channelName,
  nicheName,
  estimatedCpm,
  monetization,
  onRegenerateMonetization,
  onProceedToSeo,
  onExportPlan,
  isLoading,
}) => {
  const [scenarioPreset, setScenarioPreset] = useState<'conservative' | 'realistic' | 'breakout'>('realistic');
  const [monthlyViews, setMonthlyViews] = useState<number>(60000);
  const [cpm, setCpm] = useState<number>(estimatedCpm || 14.50);
  const [affiliateConversion, setAffiliateConversion] = useState<number>(2.5);
  const [commissionUsd, setCommissionUsd] = useState<number>(20);
  const [digitalProductConv, setDigitalProductConv] = useState<number>(0.08);
  const [digitalProductPrice, setDigitalProductPrice] = useState<number>(27);
  const [yppApproved, setYppApproved] = useState<boolean>(true);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const activeMasterPrompt = `Act as a YouTube monetization expert. Build a realistic 60-day monetization roadmap for my faceless channel. Explain YouTube Partner Program requirements and show me how to earn through ad revenue, affiliate marketing, sponsorships, and digital products. Give me a weekly action plan, recommend suitable offers, and explain how to create original content that complies with YouTube monetization policies. Do not assume monetization or 50,000 subscribers are guaranteed.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeMasterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const applyPreset = (preset: 'conservative' | 'realistic' | 'breakout') => {
    setScenarioPreset(preset);
    if (preset === 'conservative') {
      // Pre-YPP realistic Day-60 baseline (e.g., 350 subs, 15,000 monthly views, YPP NOT yet approved)
      setMonthlyViews(15000);
      setYppApproved(false);
      setAffiliateConversion(2.2);
      setDigitalProductConv(0.08);
    } else if (preset === 'realistic') {
      // YPP Newly Unlocked Day-60 baseline (e.g., 1,500 subs, 60,000 monthly views, YPP approved)
      setMonthlyViews(60000);
      setYppApproved(true);
      setAffiliateConversion(2.5);
      setDigitalProductConv(0.08);
    } else {
      // Breakout 60-Day Flywheel (e.g., 15,000–50,000 subs, 250,000 monthly views, all 4 streams active)
      setMonthlyViews(250000);
      setYppApproved(true);
      setAffiliateConversion(3.0);
      setDigitalProductConv(0.10);
    }
  };

  const formatMoney = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const revenue = calculateChannelRevenue({
    monthlyViews,
    cpm,
    affiliateClickRatePercent: 1.2,
    affiliateConversionPercent: affiliateConversion,
    averageCommissionUsd: commissionUsd,
    sponsorshipPer10kViews: 120,
    digitalProductConversionPercent: digitalProductConv,
    digitalProductPriceUsd: digitalProductPrice,
    yppApproved,
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Step 6 Blueprint Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-black p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 6 of Blueprint • Realistic 60-Day Monetization</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              6. Monetize My Channel{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400">
                (60-Day Multi-Stream Roadmap)
              </span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Realistic 60-day monetization architecture for <strong className="text-white">{channelName}</strong> (<span className="text-zinc-200">{nicheName}</span>): YouTube Partner Program requirements, 4 diversification streams (Ad Revenue, Affiliates, Sponsorships, Digital Products), weekly execution plan, curated offers, and YPP original-content compliance.
            </p>

            {/* Uploaded Step 6 Prompt Card + Master Prompt */}
            <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-44 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img
                  src="/assets/aistudio/IMG_20261104_074844_91ec490e.jpg"
                  alt="Uploaded Prompt 6: Monetize My Channel"
                  referrerPolicy="no-referrer"
                  className="w-full h-28 object-contain"
                />
                <div className="px-2 py-1 bg-zinc-950 border-t border-zinc-800/80 text-[10px] font-mono text-emerald-400 text-center truncate">
                  Active Blueprint #6
                </div>
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Active Step 6 Monetization Expert Prompt
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? 'Copied Prompt' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  "{activeMasterPrompt}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Summary & Action Box */}
          <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-2xl p-5 w-full lg:w-80 shrink-0 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Diversified Revenue
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                4 Active Engines
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">Day-1 Streams</div>
                <div className="text-sm font-extrabold text-emerald-400 font-mono tabular-nums mt-0.5">Affiliates + PDF</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">YPP Tier 1</div>
                <div className="text-sm font-extrabold text-sky-400 font-mono tabular-nums mt-0.5">500 Subs / 3K hr</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">YPP Tier 2</div>
                <div className="text-sm font-extrabold text-amber-400 font-mono tabular-nums mt-0.5">1K Subs / 4K hr</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">AdSense Share</div>
                <div className="text-sm font-extrabold text-white font-mono tabular-nums mt-0.5">55% Long-Form</div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onRegenerateMonetization}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Building 60-Day Roadmap...' : 'Regenerate 60-Day Monetization Plan'}</span>
              </button>

              <button
                type="button"
                onClick={onExportPlan}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Full Blueprint (.md)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Realistic Non-Guaranteed Framing Banner */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 flex flex-col sm:flex-row items-start gap-3.5 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <div className="font-bold text-amber-300 uppercase tracking-wider">
            Realistic Expectation Guardrail (No Guaranteed YPP or 50,000 Subscriber Assumption)
          </div>
          <p className="text-zinc-300">
            {monetization.realisticExpectationNote}
          </p>
        </div>
      </div>

      {/* SECTION 1: YouTube Partner Program (YPP) Requirements (2-Tier Breakdown) */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
        <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>1. YouTube Partner Program (YPP) Requirements Explained</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              YouTube now operates a 2-tier YPP qualification structure. Long-form watch hours and Shorts views are tracked separately.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Official 2-Tier YPP Thresholds
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* YPP Tier 1 */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Milestone 1 • Early Monetization
                </span>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {monetization.yppTier1Summary.subscribersRequired.toLocaleString()} Subscribers
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                {monetization.yppTier1Summary.title}
              </h3>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs">
                <div className="text-zinc-300">
                  <strong className="text-white">Upload Activity:</strong> {monetization.yppTier1Summary.uploadsRequired}
                </div>
                <div className="text-zinc-300">
                  <strong className="text-white">Volume Threshold:</strong> {monetization.yppTier1Summary.watchHoursOrShorts}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  What Tier 1 Unlocks:
                </span>
                {monetization.yppTier1Summary.unlockedFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* YPP Tier 2 */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Milestone 2 • Full Ad Revenue Share
                </span>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {monetization.yppTier2Summary.subscribersRequired.toLocaleString()} Subscribers
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                {monetization.yppTier2Summary.title}
              </h3>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs">
                <div className="text-zinc-300">
                  <strong className="text-white">Volume Threshold:</strong> {monetization.yppTier2Summary.watchHoursOrShorts}
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Required checks: {monetization.yppTier2Summary.complianceRequirements.join(' · ')}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  What Tier 2 Unlocks:
                </span>
                {monetization.yppTier2Summary.unlockedFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive 4-Stream Revenue & Realistic Scenario Estimator */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>2. Realistic 4-Stream Revenue Simulator (Pre-YPP vs. Post-YPP)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Compare how your channel earns across Conservative (Pre-YPP), Realistic (YPP Unlocked), and Breakout 60-day scenarios.
            </p>
          </div>

          {/* Scenario Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => applyPreset('conservative')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                scenarioPreset === 'conservative'
                  ? 'bg-zinc-800 text-amber-300 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Conservative (15K Views · Pre-YPP)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('realistic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                scenarioPreset === 'realistic'
                  ? 'bg-zinc-800 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Realistic (60K Views · YPP Active)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('breakout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                scenarioPreset === 'breakout'
                  ? 'bg-zinc-800 text-sky-300 border border-sky-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Breakout (250K Views · All 4 Streams)
            </button>
          </div>
        </div>

        {/* Sliders + YPP Status Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Views Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="monetization-views-slider" className="font-semibold text-zinc-300">
                Monthly Channel Views:
              </label>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                {monthlyViews.toLocaleString()} views/mo
              </span>
            </div>
            <input
              id="monetization-views-slider"
              type="range"
              min={5000}
              max={500000}
              step={5000}
              value={monthlyViews}
              onChange={(e) => setMonthlyViews(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono tabular-nums">
              <span>5K (Start)</span>
              <span>60K (Realistic)</span>
              <span>250K</span>
              <span>500K</span>
            </div>
          </div>

          {/* Niche CPM Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="monetization-cpm-slider" className="font-semibold text-zinc-300">
                Gross Niche CPM ($/1K views):
              </label>
              <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                ${cpm.toFixed(2)}
              </span>
            </div>
            <input
              id="monetization-cpm-slider"
              type="range"
              min={4}
              max={30}
              step={0.5}
              value={cpm}
              onChange={(e) => setCpm(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$4 (Broad)</span>
              <span>$14 (Psych/Doc)</span>
              <span>$25+ (Finance)</span>
            </div>
          </div>

          {/* YPP Approval Toggle & Digital Product Price */}
          <div className="space-y-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-300">
                YPP Tier 2 Approved (1K Subs + 4K Hrs)?
              </span>
              <button
                type="button"
                onClick={() => setYppApproved(!yppApproved)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  yppApproved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                }`}
              >
                {yppApproved ? 'YES (AdSense On)' : 'NO (Pre-YPP Mode)'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-zinc-400">Own Digital Product Price:</span>
              <span className="font-mono font-bold text-sky-400 tabular-nums">${digitalProductPrice} (95% margin)</span>
            </div>
          </div>
        </div>

        {/* 5 Revenue Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Stream 1: AdSense */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">
              1. Ad Revenue (55% Share)
            </div>
            <div className="text-lg sm:text-xl font-black text-white font-mono tabular-nums">
              ${formatMoney(revenue.adSenseRevenue)}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {yppApproved ? 'YPP Active' : 'Requires 1K Subs + 4K Hrs'}
            </div>
          </div>

          {/* Stream 2: Affiliate Marketing */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">
              2. Affiliate Marketing
            </div>
            <div className="text-lg sm:text-xl font-black text-sky-400 font-mono tabular-nums">
              ${formatMoney(revenue.affiliateRevenue)}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              Day-1 Eligible (0 Subs)
            </div>
          </div>

          {/* Stream 3: Digital Products */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">
              3. Digital Products (${digitalProductPrice})
            </div>
            <div className="text-lg sm:text-xl font-black text-purple-400 font-mono tabular-nums">
              ${formatMoney(revenue.digitalProductRevenue)}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              Day-1 Eligible (95% Margin)
            </div>
          </div>

          {/* Stream 4: Sponsorships */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">
              4. Sponsorships
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-400 font-mono tabular-nums">
              ${formatMoney(revenue.sponsorshipRevenue)}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {monthlyViews >= 30000 ? 'Active (30K+ views/mo)' : 'Unlocks at ~30K views/mo'}
            </div>
          </div>

          {/* Total Monthly */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/60 to-zinc-900 border border-red-500/40 text-center space-y-1 shadow-lg">
            <div className="text-[10px] uppercase font-extrabold text-red-400">
              Total Monthly Est.
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
              ${formatMoney(revenue.totalMonthlyRevenue)}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tabular-nums">
              ${formatMoney(revenue.annualProjectedRevenue)}/yr
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: How to Earn Through All 4 Revenue Streams */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>3. How to Earn Through Ad Revenue, Affiliates, Sponsorships &amp; Digital Products</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Step-by-step monetization mechanics for each income stream so your channel is never 100% dependent on AdSense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {monetization.revenueStreams.map((stream, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3.5 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                  <h3 className="text-base font-extrabold text-white">
                    0{idx + 1}. {stream.streamName}
                  </h3>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      stream.dayOneEligible ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {stream.dayOneEligible ? 'Day-1 Eligible' : stream.unlockThreshold}
                  </span>
                </div>

                <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span><strong className="text-zinc-200">Timeline:</strong> {stream.realisticTimeline}</span>
                  <span>·</span>
                  <span><strong className="text-zinc-200">Economics:</strong> {stream.expectedMarginOrCut}</span>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-900/70 p-3 rounded-xl border border-zinc-800">
                  {stream.howToEarn}
                </p>

                <ul className="space-y-1.5 pt-1 text-xs">
                  {stream.executionSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2 text-zinc-300 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: 60-Day Weekly Monetization Action Plan (Weeks 1–8) */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-400" />
            <span>4. Realistic 60-Day Weekly Monetization Action Plan (Weeks 1–8)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Exact weekly execution milestones to activate Day-1 affiliate/product income while building toward YPP watch-hour qualification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monetization.weeklyActionPlan.map((week, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">
                    {week.week} ({week.days})
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">
                    {week.primaryStream}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-emerald-300">
                  {week.focusTitle}
                </h3>

                <ul className="space-y-1.5 text-xs pt-1">
                  {week.actionItems.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 text-zinc-300 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2.5 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
                <strong className="text-white">Realistic Benchmark:</strong> {week.milestoneCheck}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Recommended Suitable Offers for Your Niche */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>5. Recommended Suitable Offers for {nicheName}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            High-converting affiliate programs, digital product blueprints, and sponsor categories matched to your audience's psychology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monetization.recommendedOffers.map((offer, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-sky-400">
                    {offer.offerType}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 tabular-nums">
                    {offer.priceOrPayout}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  {offer.offerName}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-100">Audience Fit:</strong> {offer.targetPainPoint}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 font-mono leading-relaxed">
                <strong className="text-amber-400 font-sans">CTA Script Angle:</strong> {offer.integrationAngle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: How to Create Original Content That Complies With YouTube Monetization Policies */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
        <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>6. How to Create Original Content That Complies With YouTube Monetization Policies</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Prevent "Reused Content" and "Repetitious / Inauthentic Content" rejections during YouTube Partner Program human review.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 shrink-0">
            YPP Human Review Compliance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monetization.policyComplianceRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white">{rule.ruleTitle}</h3>
                  <span className="text-[10px] font-mono text-amber-400 shrink-0">{rule.riskFlag}</span>
                </div>
                <p className="text-xs text-red-300/90 leading-relaxed">
                  <strong className="text-red-400">What Gets Rejected:</strong> {rule.whatGetsRejected}
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-xs text-emerald-300 leading-relaxed">
                <strong className="text-emerald-400">How to Comply (100% Original):</strong> {rule.howToComply}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onExportPlan}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Complete Channel Blueprint (.md)</span>
        </button>

        <button
          type="button"
          onClick={onProceedToSeo}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Proceed to Step 7: Video SEO &amp; Publishing Kit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

