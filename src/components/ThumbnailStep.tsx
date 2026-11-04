import React, { useState } from 'react';
import { ThumbnailData } from '../types';
import { evaluateTitleCTR } from '../utils/youtube-logic';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Eye, 
  Monitor, 
  Smartphone, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Type
} from 'lucide-react';

interface ThumbnailStepProps {
  thumbnail: ThumbnailData;
  videoTitle: string;
  channelName: string;
  onUpdateThumbnail: (updated: Partial<ThumbnailData>) => void;
  onUpdateTitle: (newTitle: string) => void;
  onRegenerateThumbnail: () => void;
  onProceedToSeo: () => void;
  isLoading: boolean;
}

export const ThumbnailStep: React.FC<ThumbnailStepProps> = ({
  thumbnail,
  videoTitle,
  channelName,
  onUpdateThumbnail,
  onUpdateTitle,
  onRegenerateThumbnail,
  onProceedToSeo,
  isLoading,
}) => {
  const [feedMode, setFeedMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>(thumbnail.boldHeadline);
  const [textColor, setTextColor] = useState<string>(thumbnail.headlineColor || '#FACC15');
  const [textPosition, setTextPosition] = useState<'top-left' | 'center-left' | 'bottom-left'>('center-left');
  const [focalTheme, setFocalTheme] = useState<string>('bust');

  const ctrEvaluation = evaluateTitleCTR(videoTitle);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(thumbnail.midjourneyPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const focalThemes = [
    { id: 'bust', label: 'Stoic Bust / Statue', gradient: 'from-amber-950/80 via-black to-zinc-950', symbol: '🏛️' },
    { id: 'shadow', label: 'Dark Silhouette', gradient: 'from-zinc-900 via-neutral-950 to-black', symbol: '👤' },
    { id: 'brain', label: 'Mind / Neural Pulse', gradient: 'from-sky-950/80 via-zinc-950 to-black', symbol: '🧠' },
    { id: 'vault', label: 'Gold Vault / Wealth', gradient: 'from-yellow-950/70 via-black to-zinc-950', symbol: '🪙' },
  ];

  const currentTheme = focalThemes.find(t => t.id === focalTheme) || focalThemes[0];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Step 5 of Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            5. High-CTR Thumbnail & Title Lab
          </h1>
          <p className="text-zinc-400 text-sm">
            Test visual contrast, curiosity gap triggers, and simulator feed performance against YouTube competitors.
          </p>
        </div>

        <button
          onClick={onRegenerateThumbnail}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700 transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Concept</span>
        </button>
      </div>

      {/* Main Studio: Canvas Editor & Feed Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Interactive Thumbnail Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-400" />
              16:9 Thumbnail Mockup Canvas
            </span>
            <div className="text-[11px] text-zinc-500 font-mono">1280 x 720 px</div>
          </div>

          {/* Interactive Thumbnail Visual Canvas */}
          <div className={`relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center select-none group`}>
            {/* Ambient Lighting FX */}
            <div 
              className="absolute inset-0 opacity-30 mix-blend-color-dodge pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 70% 40%, ${textColor} 0%, transparent 60%)`,
              }}
            />

            {/* Focal Graphic / Statue Motif on Right Side (Rule of Thirds) */}
            <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 flex items-center justify-center pointer-events-none">
              <div className="relative text-7xl sm:text-9xl opacity-90 drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] filter saturate-150">
                {currentTheme.symbol}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>

            {/* Bold Impact Text Overlay on Left Side */}
            <div 
              className={`absolute left-5 sm:left-8 z-20 max-w-[65%] space-y-2 pointer-events-none ${
                textPosition === 'top-left' ? 'top-6' : textPosition === 'bottom-left' ? 'bottom-8' : 'top-1/2 -translate-y-1/2'
              }`}
            >
              <div 
                className="font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none uppercase drop-shadow-[0_8px_8px_rgba(0,0,0,1)] stroke-black"
                style={{ 
                  color: textColor,
                  textShadow: '0 4px 12px rgba(0,0,0,0.95), 0 0 25px rgba(0,0,0,0.8)'
                }}
              >
                {customText || thumbnail.boldHeadline}
              </div>
              <div className="inline-block px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono font-bold text-white uppercase tracking-wider drop-shadow-md">
                HIGH RETENTION PROOF
              </div>
            </div>

            {/* YouTube Bottom-Right Duration Badge (Essential to test safe area) */}
            <div className="absolute bottom-3 right-3 z-30 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[11px] font-bold tracking-tight">
              09:40
            </div>

            {/* Red Alert Marker for stopping power */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-bold tracking-wider uppercase shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              CURIOSITY GAP
            </div>
          </div>

          {/* Canvas Controls */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Bold Headline Text (2-3 words max):
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold tracking-wide focus:outline-none focus:ring-1 focus:ring-red-500 uppercase"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Color Contrast:
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { color: '#FACC15', label: 'Vibrant Yellow' },
                    { color: '#FFFFFF', label: 'Pure White' },
                    { color: '#EF4444', label: 'Alert Red' },
                    { color: '#38BDF8', label: 'Electric Blue' },
                  ].map(c => (
                    <button
                      key={c.color}
                      onClick={() => setTextColor(c.color)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform ${
                        textColor === c.color ? 'scale-110 ring-2 ring-white border-transparent' : 'border-zinc-700'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Focal Theme Buttons */}
            <div className="pt-2 border-t border-zinc-900 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-zinc-500 font-medium">Focal Motif:</span>
              {focalThemes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setFocalTheme(t.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
                    focalTheme === t.id
                      ? 'bg-zinc-800 text-white border-zinc-600'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span>{t.symbol}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Image Generator Prompt */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300">
                Midjourney v6 / Flux Image Prompt
              </span>
              <button
                onClick={handleCopyPrompt}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono leading-relaxed bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/60 select-all">
              {thumbnail.midjourneyPrompt}
            </p>
          </div>
        </div>

        {/* Right 5 Columns: CTR Scoring & Feed Simulator */}
        <div className="lg:col-span-5 space-y-6">
          {/* CTR Score Card */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  CTR Viability Score
                </span>
                <div className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                  <span className={ctrEvaluation.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                    {ctrEvaluation.score}/100
                  </span>
                  <span className="text-xs font-medium text-zinc-400">
                    {ctrEvaluation.score >= 80 ? 'High Click Potential' : 'Needs Optimization'}
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <TrendingUp className={`w-6 h-6 ${ctrEvaluation.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
              </div>
            </div>

            {/* Title Editor */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Video Title to Test:
              </label>
              <textarea
                value={videoTitle}
                onChange={(e) => onUpdateTitle(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                {videoTitle.length} characters (Optimal: 40-65 chars)
              </span>
            </div>

            {/* Strengths & Recommendations */}
            <div className="space-y-2 text-xs">
              {ctrEvaluation.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{str}</span>
                </div>
              ))}

              {ctrEvaluation.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-amber-300">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Feed Simulator */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-red-500" /> YouTube Feed Contrast Test
              </span>
              <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                <button
                  onClick={() => setFeedMode('desktop')}
                  className={`p-1 rounded text-xs ${feedMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  title="Desktop feed"
                >
                  <Monitor className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setFeedMode('mobile')}
                  className={`p-1 rounded text-xs ${feedMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  title="Mobile feed"
                >
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              Check how your thumbnail text and focal contrast stand out in YouTube's dark mode feed:
            </p>

            {/* Simulated Feed Item */}
            <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-2">
              <div className={`relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center border border-zinc-800`}>
                <div 
                  className="font-black text-xl sm:text-2xl uppercase tracking-tight text-center px-2"
                  style={{ color: textColor }}
                >
                  {customText || thumbnail.boldHeadline}
                </div>
                <div className="absolute bottom-1.5 right-1.5 px-1 py-0.2 rounded bg-black/90 text-white font-mono text-[9px]">
                  09:40
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-red-600 font-bold text-xs flex items-center justify-center text-white shrink-0">
                  {channelName.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {videoTitle}
                  </h4>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <span>{channelName}</span>
                    <span>•</span>
                    <span>14K views • 2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
          onClick={onProceedToSeo}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Proceed to Step 6: SEO & Publishing Kit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
