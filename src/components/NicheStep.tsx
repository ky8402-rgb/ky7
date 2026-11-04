import React, { useState } from 'react';
import { NicheItem } from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Layers, 
  CheckCircle2, 
  Wrench, 
  AlertCircle,
  ArrowRight,
  Filter,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react';

interface NicheStepProps {
  niches: NicheItem[];
  selectedNicheId: string;
  onSelectNiche: (niche: NicheItem) => void;
  isLoading: boolean;
  onRefreshNiches: (customFocus?: string) => void;
  onProceedToBranding: () => void;
}

export const NicheStep: React.FC<NicheStepProps> = ({
  niches,
  selectedNicheId,
  onSelectNiche,
  isLoading,
  onRefreshNiches,
  onProceedToBranding,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [customInput, setCustomInput] = useState<string>('');
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(true);

  const categories = ['All', ...Array.from(new Set(niches.map(n => n.category.split('/')[0].trim())))];

  const filteredNiches = filterCategory === 'All' 
    ? niches 
    : niches.filter(n => n.category.toLowerCase().includes(filterCategory.toLowerCase()));

  const selectedNiche = niches.find(n => n.id === selectedNicheId) || niches[0];

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onRefreshNiches(customInput.trim());
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Blueprint Reference Banner directly integrating user upload */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Blueprint Step 1 Executed
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              1. Find a Profitable Faceless Niche
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Engineered specifically for creators starting with <span className="text-red-400 font-semibold">zero subscribers, no budget, no camera, and no voice recording</span>. 
              Our YouTube growth engine evaluates real-time market demand, CPM rates, and algorithmic viral loops.
            </p>

            {/* Prompt Card Accordion */}
            <div className="pt-2">
              <button 
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors underline decoration-dotted"
              >
                <span>{showPromptDetails ? 'Hide Master Prompt Reference' : 'View Original Blueprint Prompt'}</span>
              </button>

              {showPromptDetails && (
                <div className="mt-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed shadow-inner">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500 font-sans font-semibold uppercase tracking-wider">
                    <span>Active Master Prompt (from reference attachment)</span>
                    <span className="text-emerald-400 font-mono">Status: Analyzed</span>
                  </div>
                  <p className="text-zinc-200 italic">
                    "Act as a YouTube growth strategist. Find 10 profitable faceless YouTube niches I can start with zero subscribers, no budget, no camera, and no voice recording. Analyze demand, competition, viral potential, and monetization opportunities. Rank the top 3 niches and recommend the best one for my first 60 days."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reference Image Thumbnail Card */}
          <div className="w-full lg:w-72 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shrink-0 shadow-lg">
            <div className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
              <span>Attached Blueprint</span>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Image Reference</span>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700/60 bg-black group">
              <img 
                src="/assets/aistudio/IMG_20261104_075058_3a5f11dd.jpg" 
                alt="Original YouTube Blueprint Prompt"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[10px] font-medium text-white flex items-center gap-1">
                  <Eye className="w-3 h-3 text-red-400" /> 1. Find a Profitable Niche
                </span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400">
              Matches your uploaded framework step-by-step.
            </p>
          </div>
        </div>

        {/* Filter and custom interest query toolbar */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Custom Focus Prompt Input */}
          <form onSubmit={handleCustomSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Luxury tech, Horror stories, Finance..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500 w-full sm:w-60"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </form>
        </div>
      </div>

      {/* Selected Niche Quick Action Bar */}
      {selectedNiche && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Active Channel Selection:</span>
              <span className="font-bold text-white text-base">{selectedNiche.name}</span>
            </div>
            <p className="text-xs text-zinc-400">
              Estimated CPM: <span className="text-emerald-400 font-semibold">${selectedNiche.estimatedCPM.toFixed(2)}</span> • Viral Score: <span className="text-amber-400 font-semibold">{selectedNiche.viralScore}/100</span> • Demand: <span className="text-sky-400 font-semibold">{selectedNiche.demandScore}/100</span>
            </p>
          </div>

          <button
            onClick={onProceedToBranding}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Proceed to Step 2: Branding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Niche Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNiches.map((niche) => {
          const isSelected = niche.id === selectedNicheId;
          const isTopPick = niche.recommendedForFirst60Days;

          return (
            <div
              key={niche.id}
              onClick={() => onSelectNiche(niche)}
              className={`rounded-2xl p-5 sm:p-6 transition-all cursor-pointer relative border flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-red-500 shadow-xl shadow-red-600/10 ring-1 ring-red-500/50'
                  : 'bg-zinc-950 hover:bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {/* Header tags */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center border border-zinc-700">
                      #{niche.rank}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                      {niche.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isTopPick && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1 shadow-sm">
                        <Award className="w-3 h-3 text-amber-400" />
                        Best First 60 Days
                      </span>
                    )}
                    {niche.isTopThree && !isTopPick && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        Top 3 Pick
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                  {niche.name}
                </h3>
                
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {niche.tagline}
                </p>

                {/* Score Indicators */}
                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-zinc-800/80">
                  <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/60 text-center">
                    <div className="text-[10px] font-medium text-zinc-400">Est. CPM</div>
                    <div className="text-sm font-extrabold text-emerald-400 flex items-center justify-center">
                      ${niche.estimatedCPM.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/60 text-center">
                    <div className="text-[10px] font-medium text-zinc-400">Demand Score</div>
                    <div className="text-sm font-extrabold text-sky-400">
                      {niche.demandScore}/100
                    </div>
                  </div>

                  <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/60 text-center">
                    <div className="text-[10px] font-medium text-zinc-400">Viral Potential</div>
                    <div className="text-sm font-extrabold text-amber-400">
                      {niche.viralScore}/100
                    </div>
                  </div>
                </div>

                {/* Why it works with zero budget */}
                <div className="space-y-2 text-xs">
                  <div className="bg-zinc-900/40 rounded-lg p-2.5 border border-zinc-800/60">
                    <span className="text-red-400 font-semibold block mb-0.5 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Zero Budget / No Camera Advantage:
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {niche.bestForZeroBudgetReason}
                    </p>
                  </div>

                  {/* Free tool stack */}
                  <div className="flex flex-wrap gap-1 items-center pt-1">
                    <span className="text-[11px] text-zinc-400 font-medium mr-1 flex items-center gap-1">
                      <Wrench className="w-3 h-3" /> Free Stack:
                    </span>
                    {niche.recommendedTools.map((tool, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Monetization methods */}
                  <div className="pt-2">
                    <span className="text-[11px] text-zinc-400 font-medium block mb-1">
                      Revenue Engines:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {niche.monetizationMethods.map((m, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs text-zinc-400 italic">
                  Competition: <strong className={niche.competitionLevel === 'Low' ? 'text-emerald-400' : niche.competitionLevel === 'Medium' ? 'text-amber-400' : 'text-rose-400'}>{niche.competitionLevel}</strong>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNiche(niche);
                    onProceedToBranding();
                  }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected (Proceed)</span>
                    </>
                  ) : (
                    <>
                      <span>Choose Niche</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
