import React from 'react';
import { X, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <h3 className="font-extrabold text-white text-base">
              Original Blueprint Reference (Uploaded Attachment)
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
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Embedded User Image */}
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-lg shrink-0">
              <img
                src="/assets/aistudio/IMG_20261104_075058_3a5f11dd.jpg"
                alt="Original Uploaded Reference Blueprint"
                className="w-full h-auto object-contain"
              />
              <div className="p-2.5 bg-zinc-900 text-[11px] text-zinc-400 text-center border-t border-zinc-800">
                Uploaded reference: <code>IMG_20261104_075058_3a5f11dd.jpg</code>
              </div>
            </div>

            {/* Transcription & Framework Details */}
            <div className="w-full md:w-1/2 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                  Transcribed Master Prompt:
                </span>
                <div className="mt-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-zinc-200 leading-relaxed">
                  "Act as a YouTube growth strategist. Find 10 profitable faceless YouTube niches I can start with zero subscribers, no budget, no camera, and no voice recording. Analyze demand, competition, viral potential, and monetization opportunities. Rank the top 3 niches and recommend the best one for my first 60 days."
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Full 8-Step Launch Roadmap Executed by this Studio:
                </span>
                <ol className="space-y-1.5 text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>1. Find a Profitable Niche</strong> (Evaluated 10 niches)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>2. Branding & Bio</strong> (Names, Banner safe zones)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>3. 60-Day Content Plan</strong> (Curiosity titles & cadence)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>4. Faceless Script Studio</strong> (TTS reader & visual cues)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>5. Thumbnail & Title Lab</strong> (Contrast & Feed simulator)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>6. SEO & Publishing Kit</strong> (Tags, Chapters, Pinned comment)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>7. Monetization Engine</strong> (AdSense + Affiliate calculator)</span>
                  </li>
                </ol>
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
