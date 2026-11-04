import React, { useState } from 'react';
import { SeoData } from '../types';
import { formatYouTubeTags } from '../utils/youtube-logic';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Search, 
  MessageSquare, 
  Hash, 
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface SeoStepProps {
  seo: SeoData;
  videoTitle: string;
  onSelectTitleVariant: (title: string) => void;
  onRegenerateSeo: () => void;
  onProceedToMonetization: () => void;
  isLoading: boolean;
  channelName: string;
}

export const SeoStep: React.FC<SeoStepProps> = ({
  seo,
  videoTitle,
  onSelectTitleVariant,
  onRegenerateSeo,
  onProceedToMonetization,
  isLoading,
  channelName,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedTags = formatYouTubeTags(seo.tags);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Step 6 of Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            6. Video SEO & YouTube Publishing Kit
          </h1>
          <p className="text-zinc-400 text-sm">
            Everything you need to copy-paste into YouTube Studio for maximum search volume and suggested video algorithmic push.
          </p>
        </div>

        <button
          onClick={onRegenerateSeo}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700 transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate SEO Kit</span>
        </button>
      </div>

      {/* Title A/B/C Testing Options */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <span>Clickable Title A/B/C Options</span>
          <span className="text-[10px] text-zinc-500 font-normal">Click any title to make it active</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Option A (Curiosity Focus)', title: seo.titleA },
            { label: 'Option B (Urgency / High Stakes)', title: seo.titleB },
            { label: 'Option C (Direct Benefit)', title: seo.titleC },
          ].map((item, idx) => {
            const isSelected = videoTitle === item.title;
            return (
              <div
                key={idx}
                onClick={() => onSelectTitleVariant(item.title)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-red-500 shadow-lg ring-1 ring-red-500/50'
                    : 'bg-zinc-950 hover:bg-zinc-900/50 border-zinc-800'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                    {item.label}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">{item.title.length} chars</span>
                  <span className={`font-semibold ${isSelected ? 'text-red-400' : 'text-zinc-400'}`}>
                    {isSelected ? '✓ Active Title' : 'Click to use'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YouTube Description Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-red-400" />
              Complete Video Description (With Chapters & Timestamps)
            </h3>
            <p className="text-xs text-zinc-400">Ready to paste into YouTube Studio description box</p>
          </div>

          <button
            onClick={() => handleCopy(seo.description, 'description')}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedField === 'description' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Description</span>
              </>
            )}
          </button>
        </div>

        <textarea
          readOnly
          value={seo.description}
          rows={10}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 leading-relaxed focus:outline-none"
        />
      </div>

      {/* Tags & Pinned Comment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Tags */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-400" /> High-Ranking Video Tags
            </span>

            <button
              onClick={() => handleCopy(formattedTags, 'tags')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              {copiedField === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'tags' ? 'Copied Tags' : 'Copy All Tags'}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-[11px] text-zinc-300 leading-relaxed max-h-36 overflow-y-auto">
            {formattedTags}
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {seo.tags.slice(0, 8).map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Pinned Engagement Comment */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Pinned Comment Engagement Bait
            </span>

            <button
              onClick={() => handleCopy(seo.pinnedComment, 'pinned')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              {copiedField === 'pinned' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'pinned' ? 'Copied' : 'Copy Comment'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-sans">
            "{seo.pinnedComment}"
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Posting & pinning a controversial or reflective question increases comment section activity by up to 34%.</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
          onClick={onProceedToMonetization}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Proceed to Step 7: Monetization & 0 to 10K Subscribers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
