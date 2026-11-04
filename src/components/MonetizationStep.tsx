import React, { useState } from 'react';
import { calculateChannelRevenue } from '../utils/youtube-logic';
import { 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Sliders,
  Download
} from 'lucide-react';

interface MonetizationStepProps {
  channelName: string;
  nicheName: string;
  estimatedCpm: number;
  onExportPlan: () => void;
}

export const MonetizationStep: React.FC<MonetizationStepProps> = ({
  channelName,
  nicheName,
  estimatedCpm,
  onExportPlan,
}) => {
  const [monthlyViews, setMonthlyViews] = useState<number>(100000);
  const [cpm, setCpm] = useState<number>(estimatedCpm || 14.50);
  const [affiliateConversion, setAffiliateConversion] = useState<number>(2.0);
  const [commissionUsd, setCommissionUsd] = useState<number>(25);

  const formatMoney = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const revenue = calculateChannelRevenue({
    monthlyViews,
    cpm,
    affiliateClickRatePercent: 1.0,
    affiliateConversionPercent: affiliateConversion,
    averageCommissionUsd: commissionUsd,
    sponsorshipPer10kViews: 120,
  });

  const phases = [
    {
      phase: 'Phase 1: 0 to 100 Subs',
      target: 'Days 1 - 14 (Seed & Calibrate)',
      color: 'from-blue-600/20 to-sky-600/20 border-blue-500/30 text-blue-400',
      actionSteps: [
        'Upload your initial 3 Long-form cornerstone videos (8-10 min each) before promoting anywhere.',
        'Upload 5 YouTube Shorts testing extreme curiosity hooks and linking back to the long-form videos as related media.',
        'Zero friends or family views: do not share with people outside the target demographic to avoid confusing YouTube recommendation graph.',
        'Verify thumbnails in the feed simulator to ensure text is legible at 100px mobile size.'
      ]
    },
    {
      phase: 'Phase 2: 100 to 1,000 Subs (4K Watch Hours)',
      target: 'Days 15 - 45 (Algorithmic Proof)',
      color: 'from-amber-600/20 to-yellow-600/20 border-amber-500/30 text-amber-400',
      actionSteps: [
        'Maintain strict schedule: 2 Long-form videos every Tuesday & Friday + 2 weekly Shorts.',
        'Focus relentlessly on the 0:00-0:30 retention curve; eliminate all intro logos or hello chitchat.',
        'Implement pattern interrupts every 35-45 seconds (sound effect, punch zoom, text card).',
        'Add end-screen cards linking to next binge-worthy video at the exact climax before drop-off.'
      ]
    },
    {
      phase: 'Phase 3: 1,000 to 5,000 Subs (YPP & Affiliates)',
      target: 'Days 45 - 75 (Monetization Activation)',
      color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
      actionSteps: [
        'Apply for YouTube Partner Program (YPP) once 1,000 subs and 4,000 watch hours or 10M Shorts views are achieved.',
        'Place 1-2 mid-roll ads manually at natural narrative pauses on videos exceeding 8 minutes.',
        'Insert high-commission affiliate links (books, digital planners, SaaS tools) in top 2 lines of description.',
        'Pin an engagement question in every comment section within 10 minutes of publishing.'
      ]
    },
    {
      phase: 'Phase 4: 5,000 to 10,000+ Subs ($3,000+/mo)',
      target: 'Days 75 - 120 (Scale & Automation)',
      color: 'from-rose-600/20 to-red-600/20 border-rose-500/30 text-rose-400',
      actionSteps: [
        'Launch a $19-$39 proprietary digital product (e.g., Notion Stoic System, Financial Tracker, Prompt Bundle).',
        'Set up a professional rate card for inbound sponsors ($120 - $250 per 10k dedicated views).',
        'Template your editing workflow in CapCut / DaVinci Resolve so each video takes under 3 hours to produce.',
        'Repurpose audio tracks into Spotify/Apple Podcasts for dual passive income stream.'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Step 7 of Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            7. Zero-to-10K Subscribers & Monetization Engine
          </h1>
          <p className="text-zinc-400 text-sm">
            Realistic income projections and milestone execution blueprint for <strong className="text-white">{channelName}</strong> ({nicheName}).
          </p>
        </div>

        <button
          onClick={onExportPlan}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all hover:scale-[1.02] shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Master Channel PDF/Markdown</span>
        </button>
      </div>

      {/* Interactive Channel Revenue Simulator */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Dynamic Channel Revenue Estimator
            </h3>
            <p className="text-xs text-zinc-400">Calculates AdSense (55% creator share), affiliate sales, and brand sponsorships</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold">
            Live Math Engine
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Views Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">Target Monthly Views:</span>
              <span className="font-mono font-bold text-white text-sm">
                {monthlyViews.toLocaleString()} views/mo
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={1000000}
              step={10000}
              value={monthlyViews}
              onChange={(e) => setMonthlyViews(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>10K</span>
              <span>250K</span>
              <span>500K</span>
              <span>1M+</span>
            </div>
          </div>

          {/* Niche CPM Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">Niche CPM ($/1,000 views):</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${cpm.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={35}
              step={0.5}
              value={cpm}
              onChange={(e) => setCpm(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$4 (General)</span>
              <span>$14 (Stoic/Doc)</span>
              <span>$25+ (Finance/AI)</span>
            </div>
          </div>
        </div>

        {/* Projected Revenue Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* AdSense */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">AdSense (55% Share)</div>
            <div className="text-lg sm:text-xl font-black text-white">
              ${formatMoney(revenue.adSenseRevenue)}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">per month</div>
          </div>

          {/* Affiliate Revenue */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Affiliate Sales</div>
            <div className="text-lg sm:text-xl font-black text-sky-400">
              ${formatMoney(revenue.affiliateRevenue)}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">per month</div>
          </div>

          {/* Sponsorships */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Brand Deals</div>
            <div className="text-lg sm:text-xl font-black text-amber-400">
              ${formatMoney(revenue.sponsorshipRevenue)}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">per month</div>
          </div>

          {/* Total Monthly */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/60 to-zinc-900 border border-red-500/40 text-center space-y-1 shadow-lg">
            <div className="text-[10px] uppercase font-extrabold text-red-400">Total Monthly Est.</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              ${formatMoney(revenue.totalMonthlyRevenue)}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              ${formatMoney(revenue.annualProjectedRevenue)}/yr
            </div>
          </div>
        </div>
      </div>

      {/* 4-Phase Roadmap to 10K Subscribers */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          The 4-Phase 0-to-10,000 Subscribers Milestone Execution Plan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {phases.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.color}`}>
                  {item.phase}
                </span>
                <span className="text-xs text-zinc-400 font-mono font-medium">
                  {item.target}
                </span>
              </div>

              <ul className="space-y-2 text-xs">
                {item.actionSteps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2 text-zinc-300 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Free AI Software Stack Blueprint */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-400" />
          The 100% Zero-Budget Free Creator Tech Stack
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {[
            { category: 'Voiceover', tool: 'ElevenLabs Free / Edge TTS', cost: '$0 Free' },
            { category: 'Video Editing', tool: 'CapCut Desktop / DaVinci', cost: '$0 Free' },
            { category: 'AI Visuals', tool: 'Leonardo.ai / Ideogram', cost: '$0 Free Tier' },
            { category: 'B-Roll Media', tool: 'Pexels / Pixabay / NASA', cost: '100% Free' },
            { category: 'Thumbnails', tool: 'Canva / Photopea', cost: '$0 Free' },
            { category: 'Script Engine', tool: 'ChannelForge AI (Gemini)', cost: 'Included' },
          ].map((st, i) => (
            <div key={i} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">{st.category}</span>
              <div className="font-bold text-white text-xs">{st.tool}</div>
              <span className="text-[10px] text-emerald-400 font-mono">{st.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
