import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <h3 className="font-extrabold text-white text-base">
              Original Blueprint Reference Library (Uploaded Prompts #1, #2, #3, #4 &amp; #5)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Blueprint #1 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                  Blueprint Step #1
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">1. FIND A PROFITABLE NICHE</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img
                  src="/assets/aistudio/IMG_20261104_075058_3a5f11dd.jpg"
                  alt="Blueprint 1: Find a Profitable Niche"
                  className="w-full h-40 object-contain"
                />
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-200 leading-relaxed flex-1">
                "Act as a YouTube growth strategist. Find 10 profitable faceless YouTube niches I can start with zero subscribers, no budget, no camera, and no voice recording. Analyze demand, competition, viral potential, and monetization opportunities. Rank the top 3 niches and recommend the best one for my first 60 days."
              </div>
            </div>

            {/* Blueprint #2 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Blueprint Step #2
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">2. BUILD MY CHANNEL</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img
                  src="/assets/aistudio/IMG_20261104_075044_0cd80a5c.jpg"
                  alt="Blueprint 2: Build My Channel From Scratch"
                  className="w-full h-40 object-contain"
                />
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-200 leading-relaxed flex-1">
                "Act as a YouTube branding expert. Help me build a professional faceless YouTube channel in the [NICHE] niche. Generate channel names, an SEO-friendly description, branding ideas, channel keywords, and a complete setup checklist to stand out from competitors."
              </div>
            </div>

            {/* Blueprint #3 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Blueprint Step #3
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">3. GENERATE VIRAL IDEAS</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img
                  src="/assets/aistudio/IMG_20261104_075027_de025457.jpg"
                  alt="Blueprint 3: Generate Viral Video Ideas"
                  className="w-full h-40 object-contain"
                />
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-200 leading-relaxed flex-1">
                "Act as a YouTube content strategist. Generate 30 high-potential video ideas for my [NICHE] channel targeting [AUDIENCE]. For each idea, provide a clickable title, a strong opening hook, the video concept, and a thumbnail idea. Focus on trending topics, audience demand, and shareability."
              </div>
            </div>

            {/* Blueprint #4 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  Blueprint Step #4
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">4. CREATE VIDEOS WITH AI</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img
                  src="/assets/aistudio/IMG_20261104_075012_220ef1c9.jpg"
                  alt="Blueprint 4: Create Videos With AI"
                  className="w-full h-40 object-contain"
                />
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-200 leading-relaxed flex-1">
                "Act as an expert faceless YouTube scriptwriter. Write a complete [VIDEO LENGTH]-minute script about [TOPIC]. Include a powerful 5-second hook, engaging storytelling, scene-by-scene visual directions, on-screen text, editing instructions, and a compelling ending. Recommend free or affordable AI tools to create the video without showing my face or recording my voice."
              </div>
            </div>

            {/* Blueprint #5 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 flex flex-col md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Blueprint Step #5
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">5. GROW TO 50,000 SUBSCRIBERS</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img
                  src="/assets/aistudio/IMG_20261104_074952_8da71528.jpg"
                  alt="Blueprint 5: Grow to 50,000 Subscribers"
                  className="w-full h-44 object-contain"
                />
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-200 leading-relaxed flex-1">
                "Act as my YouTube growth coach. Create a detailed 60-day growth plan for my [NICHE] channel, starting from zero subscribers. Tell me what to post daily, how to optimize titles and thumbnails, how to improve audience retention, and how to use Shorts and long-form videos strategically. Include weekly performance targets and explain how to adjust the strategy based on analytics."
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
              Complete 7-Step Launch Roadmap Executed by ChannelForge Studio:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>1. Find a Profitable Niche</strong> (10 niches ranked + 60-day pick)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>2. Build Channel From Scratch</strong> (Names, SEO Bio, Keywords, Checklist)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>3. Generate 30 Viral Video Ideas</strong> (Titles, Hooks, Concepts &amp; Thumbnails)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>4. Create Videos With AI</strong> (5s Hook, Visuals, On-Screen Text &amp; AI Tools)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>5. Grow to 50,000 Subscribers</strong> (60-Day Daily Plan, CTR Lab, Retention &amp; Analytics)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>6. SEO &amp; Publishing Kit</strong> (Tags, timestamps, pinned comment)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>7. Monetization Engine</strong> (AdSense + Affiliate revenue calculator)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
