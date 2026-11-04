import React, { useState } from 'react';
import { ThumbnailData } from '../types';
import { evaluateTitleCTR, diagnoseChannelAnalytics } from '../utils/youtube-logic';
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
  Calendar,
  Flame,
  Target,
  Activity,
  Zap,
  Layers
} from 'lucide-react';

interface ThumbnailStepProps {
  thumbnail: ThumbnailData;
  videoTitle: string;
  channelName: string;
  nicheName?: string;
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
  nicheName = 'Stoic Philosophy & Dark Psychology',
  onUpdateThumbnail,
  onUpdateTitle,
  onRegenerateThumbnail,
  onProceedToSeo,
  isLoading,
}) => {
  const [feedMode, setFeedMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>(thumbnail.boldHeadline);
  const [textColor, setTextColor] = useState<string>(thumbnail.headlineColor || '#FACC15');
  const [textPosition] = useState<'top-left' | 'center-left' | 'bottom-left'>('center-left');
  const [focalTheme, setFocalTheme] = useState<string>('bust');

  // Interactive Analytics Diagnostic Simulator State
  const [simCtr, setSimCtr] = useState<number>(7.8);
  const [simRetention30s, setSimRetention30s] = useState<number>(71);
  const [simAvd, setSimAvd] = useState<number>(50);
  const [simShortsBridge, setSimShortsBridge] = useState<number>(2.8);

  const ctrEvaluation = evaluateTitleCTR(videoTitle);
  const analyticsDiagnosis = diagnoseChannelAnalytics({
    ctrPercent: simCtr,
    retention30sPercent: simRetention30s,
    avgViewDurationPercent: simAvd,
    shortsBridgeClickPercent: simShortsBridge,
  });

  const activeMasterPrompt = `Act as my YouTube growth coach. Create a detailed 60-day growth plan for my ${nicheName} channel, starting from zero subscribers. Tell me what to post daily, how to optimize titles and thumbnails, how to improve audience retention, and how to use Shorts and long-form videos strategically. Include weekly performance targets and explain how to adjust the strategy based on analytics.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(thumbnail.midjourneyPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyMasterPrompt = () => {
    navigator.clipboard.writeText(activeMasterPrompt);
    setCopiedMasterPrompt(true);
    setTimeout(() => setCopiedMasterPrompt(false), 2000);
  };

  const focalThemes = [
    { id: 'bust', label: 'Stoic Bust / Statue', gradient: 'from-amber-950/80 via-black to-zinc-950', symbol: '🏛️' },
    { id: 'shadow', label: 'Dark Silhouette', gradient: 'from-zinc-900 via-neutral-950 to-black', symbol: '👤' },
    { id: 'brain', label: 'Mind / Neural Pulse', gradient: 'from-sky-950/80 via-zinc-950 to-black', symbol: '🧠' },
    { id: 'vault', label: 'Gold Vault / Wealth', gradient: 'from-yellow-950/70 via-black to-zinc-950', symbol: '🪙' },
  ];

  const currentTheme = focalThemes.find(t => t.id === focalTheme) || focalThemes[0];

  const dailySchedule = thumbnail.dailyPostingSchedule || [];
  const retentionPlaybook = thumbnail.retentionPlaybook || [];
  const weeklyTargets = thumbnail.weeklyTargets || [];
  const analyticsPivots = thumbnail.analyticsPivots || [];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Step 5 Blueprint Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-black p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 5 of Blueprint • 0 to 50,000 Subscribers</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              5. Grow to 50,000 Subscribers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400">
                (60-Day Growth Coach)
              </span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Your complete 60-day growth coaching system for <span className="text-zinc-200 font-semibold">{nicheName}</span>: daily posting schedule, interactive Title &amp; Thumbnail CTR Lab, audience retention engineering, Shorts-to-Long-Form bridge strategy, weekly KPI targets, and analytics pivot rules.
            </p>

            {/* Uploaded Step 5 Prompt Card + Interpolated Master Prompt */}
            <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-44 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img
                  src="/assets/aistudio/IMG_20261104_074952_8da71528.jpg"
                  alt="Uploaded Prompt 5: Grow to 50,000 Subscribers"
                  referrerPolicy="no-referrer"
                  className="w-full h-28 object-contain"
                />
                <div className="px-2 py-1 bg-zinc-950 border-t border-zinc-800/80 text-[10px] font-mono text-emerald-400 text-center truncate">
                  Active Blueprint #5
                </div>
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                    Active Step 5 Growth Coach Prompt
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyMasterPrompt}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                  >
                    {copiedMasterPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMasterPrompt ? 'Copied Prompt' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  "{activeMasterPrompt}"
                </p>
              </div>
            </div>
          </div>

          {/* Regenerate & 60-Day Target Summary */}
          <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-2xl p-5 w-full lg:w-80 shrink-0 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                60-Day North Star
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                0 → 50,000 Subs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">Target CTR</div>
                <div className="text-base font-extrabold text-amber-400 font-mono tabular-nums mt-0.5">8.5%+</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">Target AVD</div>
                <div className="text-base font-extrabold text-emerald-400 font-mono tabular-nums mt-0.5">50%+</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">Long-Form</div>
                <div className="text-base font-extrabold text-white font-mono tabular-nums mt-0.5">3 / wk</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase">Shorts Bridge</div>
                <div className="text-base font-extrabold text-sky-400 font-mono tabular-nums mt-0.5">4 / wk</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onRegenerateThumbnail}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Coaching 50K Plan...' : 'Regenerate 60-Day 50K Plan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: What to Post Daily (7-Day Repeatable 60-Day Cadence) */}
      {dailySchedule.length > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-400" />
                <span>1. What to Post Daily (Repeatable 7-Day Cadence Across Days 1–60)</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Follow this exact Monday–Sunday rhythm for 8 consecutive weeks to compound Browse, Suggested, and Shorts Shelf velocity.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400 shrink-0">
              24 Long-Form + 32 Shorts in 60 Days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {dailySchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-extrabold text-white">{item.day}</span>
                    <span className="text-[10px] font-mono text-red-400 font-semibold">Day {idx + 1}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-amber-300 leading-snug">
                    {item.format}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {item.whatToPost}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
                  <strong className="text-emerald-400">KPI Focus:</strong> {item.optimizationFocus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: How to Optimize Titles & Thumbnails (Interactive 16:9 Canvas & CTR Lab) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>2. How to Optimize Titles &amp; Thumbnails (Interactive CTR Lab)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Test your 2–3 word thumbnail hook, high-contrast color pairing, and curiosity-gap title in YouTube's dark-mode feed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 Columns: Interactive Thumbnail Canvas */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-400" />
                16:9 Thumbnail Mockup Canvas
              </span>
              <div className="text-[11px] text-zinc-500 font-mono tabular-nums">1280 x 720 px</div>
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

              {/* YouTube Bottom-Right Duration Badge */}
              <div className="absolute bottom-3 right-3 z-30 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[11px] font-bold tracking-tight tabular-nums">
                09:40
              </div>

              {/* Top-left marker */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-bold tracking-wider uppercase shadow-md">
                CURIOSITY GAP HOOK
              </div>
            </div>

            {/* Canvas Controls */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="thumbnail-headline-input" className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Bold Headline Text (2-3 words max):
                  </label>
                  <input
                    id="thumbnail-headline-input"
                    type="text"
                    value={customText}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setCustomText(val);
                      onUpdateThumbnail({ boldHeadline: val });
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold tracking-wide focus:outline-none focus:ring-1 focus:ring-red-500 uppercase"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Color Contrast:
                  </span>
                  <div className="flex items-center gap-2">
                    {[
                      { color: '#FACC15', label: 'Vibrant Yellow' },
                      { color: '#FFFFFF', label: 'Pure White' },
                      { color: '#EF4444', label: 'Alert Red' },
                      { color: '#38BDF8', label: 'Electric Blue' },
                    ].map(c => (
                      <button
                        key={c.color}
                        type="button"
                        aria-label={`Select ${c.label}`}
                        onClick={() => {
                          setTextColor(c.color);
                          onUpdateThumbnail({ headlineColor: c.color });
                        }}
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
                    type="button"
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
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied!' : 'Copy Image Prompt'}</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/60 select-all">
                {thumbnail.midjourneyPrompt}
              </p>
            </div>
          </div>

          {/* Right 5 Columns: CTR Scoring, Psychology Rules & Feed Simulator */}
          <div className="lg:col-span-5 space-y-5">
            {/* CTR Score Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    CTR Viability Score
                  </span>
                  <div className="text-2xl font-black text-white flex items-center gap-2 mt-0.5 font-mono tabular-nums">
                    <span className={ctrEvaluation.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                      {ctrEvaluation.score}/100
                    </span>
                    <span className="text-xs font-sans font-medium text-zinc-400">
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
                <label htmlFor="ctr-video-title-input" className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Video Title to Test:
                </label>
                <textarea
                  id="ctr-video-title-input"
                  value={videoTitle}
                  onChange={(e) => onUpdateTitle(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-[10px] text-zinc-500 font-mono block mt-0.5 tabular-nums">
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

              {/* Coach's Thumbnail Psychology Rules */}
              {thumbnail.ctrPsychologyTips && thumbnail.ctrPsychologyTips.length > 0 && (
                <div className="pt-3 border-t border-zinc-800 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Title &amp; Thumbnail Optimization Rules:
                  </span>
                  {thumbnail.ctrPsychologyTips.map((tip, idx) => (
                    <div key={idx} className="text-[11px] text-zinc-300 leading-relaxed flex items-start gap-2">
                      <span className="text-red-400 font-mono font-bold">0{idx + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* YouTube Feed Simulator */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-red-500" /> YouTube Feed Contrast Test
                </span>
                <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                  <button
                    type="button"
                    aria-label="Desktop feed preview"
                    onClick={() => setFeedMode('desktop')}
                    className={`p-1 rounded text-xs ${feedMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                    title="Desktop feed"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    aria-label="Mobile feed preview"
                    onClick={() => setFeedMode('mobile')}
                    className={`p-1 rounded text-xs ${feedMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                    title="Mobile feed"
                  >
                    <Smartphone className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-xl bg-black border border-zinc-900 space-y-2 ${feedMode === 'mobile' ? 'max-w-[280px] mx-auto' : ''}`}>
                <div className={`relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center border border-zinc-800`}>
                  <div 
                    className="font-black text-xl sm:text-2xl uppercase tracking-tight text-center px-2"
                    style={{ color: textColor }}
                  >
                    {customText || thumbnail.boldHeadline}
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 px-1 py-0.2 rounded bg-black/90 text-white font-mono text-[9px] tabular-nums">
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
                      <span>·</span>
                      <span>14K views · 2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: How to Improve Audience Retention & Strategic Shorts + Long-Form Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Audience Retention Engineering (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>3. How to Improve Audience Retention (AVD Engineering)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Retention mechanics to hold 70%+ viewers past 0:30 and achieve 50%+ Average View Duration on 8–12 minute videos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {retentionPlaybook.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-emerald-400">
                    {item.window}
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    {item.tactic}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {item.execution}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-amber-300">
                  Impact: {item.retentionLift}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use Shorts and Long-Form Strategically (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                <span>4. Strategic Shorts + Long-Form Funnel</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                How to combine vertical discovery with long-form watch hours without splitting your audience.
              </p>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800">
              {thumbnail.shortsAndLongFormStrategy}
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1">
                <div className="text-xs font-bold text-sky-400">
                  01. Shorts Role: High-Velocity Discovery Feeder (4x/wk)
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  45–58 second vertical clips dramatize a single shocking paradox from your niche. Never summarize the full video—leave an unresolved curiosity cliffhanger.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1">
                <div className="text-xs font-bold text-amber-400">
                  02. The Bridge: Native "Related Video" Link
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  In YouTube Studio, link every Short's clickable "Related Video" tag directly to its parent 9-minute Long-Form upload and verbally cue viewers in the last 3 seconds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1">
                <div className="text-xs font-bold text-emerald-400">
                  03. Long-Form Role: Watch-Time &amp; Super-Fan Engine (3x/wk)
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  8–12 minute deep dives build parasocial authority, trigger Browse/Suggested recommendations, and generate 15x–25x higher RPM than Shorts alone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Weekly Performance Targets (60-Day Ladder to 50,000 Subscribers) */}
      {weeklyTargets.length > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                <span>5. Weekly Performance Targets (Weeks 1–8 Roadmap to 50,000 Subscribers)</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Benchmark your channel against these weekly subscriber, view, CTR, and retention milestones from Day 1 to Day 60.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyTargets.map((target, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{target.weekRange}</span>
                    <span className="text-[11px] font-mono text-zinc-400">{target.daysRange}</span>
                  </div>
                  <div className="text-lg font-black text-emerald-400 font-mono tabular-nums">
                    {target.subscriberTarget}
                  </div>
                  <div className="space-y-1 pt-1 text-xs font-mono tabular-nums">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-500 font-sans">Views Target:</span>
                      <span>{target.weeklyViewsTarget}</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-300">
                      <span className="text-zinc-500 font-sans">CTR Benchmark:</span>
                      <span>{target.ctrTarget}</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-300">
                      <span className="text-zinc-500 font-sans">Retention Goal:</span>
                      <span>{target.retentionTarget}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-500 font-sans">Output Volume:</span>
                      <span>{target.cadenceSummary}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-zinc-800 text-[11px] text-zinc-300 leading-relaxed">
                  <strong className="text-white">Coach Priority:</strong> {target.primaryFocus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: How to Adjust Strategy Based on Analytics (Interactive Diagnostic + Pivot Matrix) */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>6. How to Adjust Strategy Based on YouTube Studio Analytics</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Input your current YouTube Studio metrics below to diagnose bottlenecks and see your projected 60-day subscriber trajectory.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums">
            Status:{' '}
            <span
              className={
                analyticsDiagnosis.overallHealth === 'Scaling to 50K'
                  ? 'text-emerald-400 font-bold'
                  : analyticsDiagnosis.overallHealth === 'On Track'
                  ? 'text-amber-400 font-bold'
                  : 'text-red-400 font-bold'
              }
            >
              {analyticsDiagnosis.overallHealth}
            </span>
          </div>
        </div>

        {/* Interactive Analytics Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Interactive YouTube Studio Metric Sliders
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="sim-ctr-slider" className="text-zinc-300 font-medium">
                    Impressions Click-Through Rate (CTR)
                  </label>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">{simCtr.toFixed(1)}%</span>
                </div>
                <input
                  id="sim-ctr-slider"
                  type="range"
                  min="2.0"
                  max="14.0"
                  step="0.2"
                  value={simCtr}
                  onChange={(e) => setSimCtr(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="sim-ret30-slider" className="text-zinc-300 font-medium">
                    First 30-Second Retention (% Still Watching at 0:30)
                  </label>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">{simRetention30s}%</span>
                </div>
                <input
                  id="sim-ret30-slider"
                  type="range"
                  min="35"
                  max="90"
                  step="1"
                  value={simRetention30s}
                  onChange={(e) => setSimRetention30s(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="sim-avd-slider" className="text-zinc-300 font-medium">
                    Average Percentage Viewed (Long-Form AVD)
                  </label>
                  <span className="font-mono font-bold text-sky-400 tabular-nums">{simAvd}%</span>
                </div>
                <input
                  id="sim-avd-slider"
                  type="range"
                  min="20"
                  max="75"
                  step="1"
                  value={simAvd}
                  onChange={(e) => setSimAvd(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="sim-bridge-slider" className="text-zinc-300 font-medium">
                    Shorts "Related Video" Bridge Click Rate
                  </label>
                  <span className="font-mono font-bold text-purple-400 tabular-nums">{simShortsBridge.toFixed(1)}%</span>
                </div>
                <input
                  id="sim-bridge-slider"
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={simShortsBridge}
                  onChange={(e) => setSimShortsBridge(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Live Growth Coach Diagnosis
                </span>
                <span className="text-sm font-black text-emerald-400 font-mono tabular-nums">
                  Projected Day-60 Subs: ~{analyticsDiagnosis.projected60DaySubs.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                <span className="text-zinc-400">Primary Bottleneck: </span>
                <strong className="text-white">{analyticsDiagnosis.primaryBottleneck}</strong>
              </div>

              <div className="space-y-2 pt-1">
                {analyticsDiagnosis.actionItems.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-200 leading-relaxed">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
              Tip: Review YouTube Studio Analytics every 48 hours. Never change both title and video content at once—isolate packaging (CTR) vs. storytelling (AVD).
            </div>
          </div>
        </div>

        {/* 4-Scenario Analytics Strategy Adjustment Matrix */}
        {analyticsPivots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {analyticsPivots.map((pivot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white">{pivot.metricSignal}</h3>
                  <span className="text-[11px] font-mono text-red-400 shrink-0">{pivot.threshold}</span>
                </div>
                <p className="text-xs text-zinc-400">
                  <strong className="text-zinc-200">Diagnosis:</strong> {pivot.rootCause}
                </p>
                <p className="text-xs text-emerald-300 leading-relaxed pt-1 border-t border-zinc-800/80">
                  <strong className="text-emerald-400">Coach Pivot Action:</strong> {pivot.strategyAdjustment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onProceedToSeo}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Proceed to Step 6: Monetize My Channel</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

