import React, { useState } from 'react';
import { ChannelBranding } from '../types';
import { 
  formatChannelKeywords, 
  calculateChecklistProgress,
  validateYouTubeHandle
} from '../utils/youtube-logic';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Palette, 
  Monitor, 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Eye,
  Tag,
  Lightbulb,
  ListChecks,
  Plus,
  X
} from 'lucide-react';

interface BrandingStepProps {
  branding: ChannelBranding;
  onUpdateBranding: (updated: Partial<ChannelBranding>) => void;
  isLoading: boolean;
  onRegenerateBranding: (targetVibe?: string) => void;
  onProceedToContent: () => void;
  nicheName: string;
}

export const BrandingStep: React.FC<BrandingStepProps> = ({
  branding,
  onUpdateBranding,
  isLoading,
  onRegenerateBranding,
  onProceedToContent,
  nicheName,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(true);
  const [customVibe, setCustomVibe] = useState<string>('');
  const [newKeyword, setNewKeyword] = useState<string>('');

  const selectedName = branding.channelNames[branding.selectedNameIndex] || branding.channelNames[0];
  const handleValidation = validateYouTubeHandle(selectedName?.handle || '@MindsetVaultHQ');

  const keywordsList = branding.channelKeywords || [];
  const keywordMetrics = formatChannelKeywords(keywordsList);

  const checklistItems = branding.setupChecklist || [];
  const checklistProgress = calculateChecklistProgress(checklistItems);

  const brandingIdeas = branding.brandingIdeas || [];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newKeyword.trim().toLowerCase();
    if (!cleaned) return;
    if (!keywordsList.includes(cleaned)) {
      onUpdateBranding({ channelKeywords: [...keywordsList, cleaned] });
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    onUpdateBranding({
      channelKeywords: keywordsList.filter(k => k !== kwToRemove),
    });
  };

  const handleToggleChecklistItem = (id: string) => {
    const updated = checklistItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateBranding({ setupChecklist: updated });
  };

  const handleMarkAllChecklist = (completed: boolean) => {
    const updated = checklistItems.map(item => ({ ...item, completed }));
    onUpdateBranding({ setupChecklist: updated });
  };

  const handleCustomVibeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerateBranding(customVibe.trim() || undefined);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Blueprint Step 2 Hero Banner directly integrating user's Step 2 upload */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Blueprint Step 2 Executed
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              2. Build My Channel From Scratch
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Complete faceless channel architecture in the <span className="text-red-400 font-semibold">{nicheName}</span> niche: sticky channel names, SEO-friendly description, competitor-beating branding ideas, channel keywords, and a complete setup checklist.
            </p>

            {/* Master Prompt Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors underline decoration-dotted"
              >
                <span>{showPromptDetails ? 'Hide Step 2 Master Prompt' : 'View Original Step 2 Blueprint Prompt'}</span>
              </button>

              {showPromptDetails && (
                <div className="mt-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed shadow-inner">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500 font-sans font-semibold uppercase tracking-wider">
                    <span>Active Step 2 Master Prompt (from reference attachment)</span>
                    <span className="text-emerald-400 font-mono">Niche Injected: [{nicheName}]</span>
                  </div>
                  <p className="text-zinc-200 italic">
                    "Act as a YouTube branding expert. Help me build a professional faceless YouTube channel in the [{nicheName}] niche. Generate channel names, an SEO-friendly description, branding ideas, channel keywords, and a complete setup checklist to stand out from competitors."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2 Reference Image Thumbnail Card */}
          <div className="w-full lg:w-72 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shrink-0 shadow-lg">
            <div className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
              <span>Attached Step 2 Blueprint</span>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Image Reference</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-zinc-700/60 bg-black">
              <img
                src="/assets/aistudio/IMG_20261104_075044_0cd80a5c.jpg"
                alt="Step 2 Build My Channel From Scratch Prompt"
                className="w-full h-36 object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-0.5">
              <span className="font-medium text-white flex items-center gap-1">
                <Eye className="w-3 h-3 text-red-400" /> 2. Build My Channel From Scratch
              </span>
            </div>
          </div>
        </div>

        {/* Aesthetic Vibe & Regenerate Toolbar */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Selected Identity: <strong className="text-white">{selectedName?.name}</strong> ({selectedName?.handle})</span>
            {handleValidation.valid && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                ✓ Valid Handle
              </span>
            )}
          </div>

          <form onSubmit={handleCustomVibeSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Custom aesthetic (e.g. Dark Minimalist, Cyberpunk)..."
              value={customVibe}
              onChange={(e) => setCustomVibe(e.target.value)}
              className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500 w-full sm:w-64"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50 border border-zinc-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate Brand Pack</span>
            </button>
          </form>
        </div>
      </div>

      {/* Deliverable 1: Channel Names & Handle Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <span>1. Generated Channel Names & Handles</span>
          <span className="text-[10px] text-zinc-500 font-normal">Click any name to activate across studio</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {branding.channelNames.map((item, idx) => {
            const isSelected = branding.selectedNameIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => onUpdateBranding({ selectedNameIndex: idx })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-red-500 shadow-lg ring-1 ring-red-500/50'
                    : 'bg-zinc-950 hover:bg-zinc-900/50 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-white text-base">{item.name}</span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-zinc-700" />
                  )}
                </div>
                <div className="text-xs font-mono text-red-400 mb-2">{item.handle}</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{item.rationale}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live YouTube Channel Header Simulator */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="font-bold text-sm text-white">Live YouTube Channel Header Simulator</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSafeZones(!showSafeZones)}
              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                showSafeZones
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Zones: {showSafeZones ? 'ON' : 'OFF'}</span>
            </button>

            <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 ${
                  previewDevice === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 ${
                  previewDevice === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Banner Area */}
        <div className="relative w-full aspect-[16/5] bg-gradient-to-r from-zinc-950 via-zinc-900 to-black overflow-hidden flex items-center justify-center border-b border-zinc-800/80">
          <div
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 75% 50%, ${branding.colorPalette.accent} 0%, transparent 60%)`,
            }}
          />

          <div className="relative z-10 text-center px-4 max-w-2xl space-y-2">
            <span className="inline-block text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-400/30 backdrop-blur-sm">
              {branding.bannerConcept.uploadBadgeText}
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {branding.bannerConcept.headlineText}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide drop-shadow-sm">
              {branding.bannerConcept.subText}
            </p>
          </div>

          {showSafeZones && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[85%] h-[80%] border-2 border-dashed border-amber-400/50 rounded-lg flex flex-col justify-between p-2">
                <span className="text-[9px] font-mono font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded self-start">
                  YouTube Desktop & Mobile Safe Area (1546 x 423 px)
                </span>
                <span className="text-[9px] font-mono text-amber-300/80 self-end">
                  All critical text & logos MUST stay inside this border
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Channel Details Bar */}
        <div className="p-5 sm:p-6 bg-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative -mt-10 sm:-mt-12 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-900 border-4 border-zinc-950 overflow-hidden shadow-2xl flex items-center justify-center shrink-0">
              <div
                className="w-full h-full flex flex-col items-center justify-center font-black text-2xl tracking-tighter"
                style={{
                  backgroundColor: branding.colorPalette.card,
                  color: branding.colorPalette.accent,
                }}
              >
                {branding.avatarConcept.lettermark || 'CF'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">{selectedName?.name}</h3>
                <span className="w-4 h-4 rounded-full bg-zinc-700 text-zinc-300 text-[10px] flex items-center justify-center">✓</span>
              </div>
              <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-2">
                <span className="font-mono text-zinc-300">{selectedName?.handle}</span>
                <span>•</span>
                <span>0 subscribers</span>
                <span>•</span>
                <span>0 videos</span>
              </div>
              <p className="text-xs text-zinc-300 line-clamp-1 max-w-md">
                {branding.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button type="button" className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-colors">
              Subscribe
            </button>
            <button type="button" className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors">
              Join
            </button>
          </div>
        </div>

        <div className="px-6 border-t border-zinc-900 flex items-center gap-6 text-xs font-semibold text-zinc-400 py-2.5 overflow-x-auto no-scrollbar">
          <span className="text-white border-b-2 border-white pb-2.5 -mb-2.5">HOME</span>
          <span className="hover:text-zinc-200 cursor-pointer">VIDEOS</span>
          <span className="hover:text-zinc-200 cursor-pointer">SHORTS</span>
          <span className="hover:text-zinc-200 cursor-pointer">PLAYLISTS</span>
          <span className="hover:text-zinc-200 cursor-pointer">COMMUNITY</span>
          <span className="hover:text-zinc-200 cursor-pointer">ABOUT</span>
        </div>
      </div>

      {/* Deliverable 2: Branding Ideas to Stand Out from Competitors */}
      {brandingIdeas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>2. Branding Ideas to Stand Out From Competitors</span>
            </label>
            <span className="text-[11px] text-zinc-500">Engineered for high feed recognition</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandingIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {idea.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">Idea #{idx + 1}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">{idea.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{idea.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverable 3 & 4: SEO Description + Channel Keywords + Color Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tagline, Color Aesthetics & Banner Prompt */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Channel Tagline</span>
              <button
                type="button"
                onClick={() => handleCopy(branding.tagline, 'tagline')}
                className="text-zinc-400 hover:text-white p-1 rounded"
                aria-label="Copy Channel Tagline"
              >
                {copiedField === 'tagline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-sm font-semibold text-white italic">
              "{branding.tagline}"
            </p>
            <div className="text-[11px] text-zinc-400 leading-relaxed pt-2 border-t border-zinc-800">
              <strong>Value Proposition:</strong> {branding.valueProposition}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-red-400" /> Color Aesthetics ({branding.colorPalette.mood})
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Primary</div>
                  <div className="font-mono text-zinc-300 font-semibold">{branding.colorPalette.primary}</div>
                </div>
                <div
                  className="w-5 h-5 rounded-md border border-white/20"
                  style={{ backgroundColor: branding.colorPalette.primary }}
                />
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Accent</div>
                  <div className="font-mono text-amber-400 font-semibold">{branding.colorPalette.accent}</div>
                </div>
                <div
                  className="w-5 h-5 rounded-md border border-white/20"
                  style={{ backgroundColor: branding.colorPalette.accent }}
                />
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-zinc-400 font-medium block mb-1">
                Midjourney / Leonardo Banner Prompt:
              </span>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-zinc-400 relative">
                <p className="line-clamp-3">{branding.bannerConcept.visualDescription}</p>
                <button
                  type="button"
                  onClick={() => handleCopy(branding.bannerConcept.visualDescription, 'bannerPrompt')}
                  className="mt-2 text-xs text-red-400 hover:text-red-300 font-sans font-semibold flex items-center gap-1"
                >
                  {copiedField === 'bannerPrompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Image Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: SEO Description + Channel Keywords */}
        <div className="lg:col-span-2 space-y-6">
          {/* SEO-Friendly Description */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">3. SEO-Friendly Channel Description ("About" Bio)</h3>
                <p className="text-xs text-zinc-400">Paste directly into YouTube Studio &gt; Customization &gt; Basic Info</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(branding.aboutBio, 'aboutBio')}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedField === 'aboutBio' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Bio Text</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              value={branding.aboutBio}
              onChange={(e) => onUpdateBranding({ aboutBio: e.target.value })}
              rows={6}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-red-500 shadow-inner"
            />

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>SEO Optimization Tip:</strong> The first 150 characters of this bio are indexed by Google Search and YouTube's classifier to establish channel topical authority.
              </span>
            </div>
          </div>

          {/* Channel Keywords Matrix */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-400" />
                  <span>4. High-Intent Channel Keywords</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Paste into YouTube Studio &gt; Settings &gt; Channel &gt; Basic Info &gt; Keywords
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono px-2 py-1 rounded border ${
                  keywordMetrics.withinLimit
                    ? 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {keywordMetrics.charCount}/500 chars
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(keywordMetrics.commaSeparated, 'channelKeywords')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedField === 'channelKeywords' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Keywords!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Comma-Separated</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Interactive Keyword Pills */}
            <div className="flex flex-wrap gap-1.5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
              {keywordsList.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-800 text-xs font-medium"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                    aria-label={`Remove keyword ${kw}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Keyword Form */}
            <form onSubmit={handleAddKeyword} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add custom channel keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Keyword</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Deliverable 5: Complete Setup Checklist to Stand Out from Competitors */}
      {checklistItems.length > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-emerald-400" />
                <span>5. Complete Channel Setup Checklist (Stand Out From Competitors)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Complete every step below before publishing your first video so YouTube's algorithm classifies and trusts your channel immediately.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xs font-bold text-white">
                  {checklistProgress.completedCount} of {checklistProgress.totalCount} Completed
                </div>
                <div className="text-[11px] font-mono text-emerald-400">
                  {checklistProgress.percentage}% Ready for Launch
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleMarkAllChecklist(checklistProgress.percentage < 100)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-colors"
              >
                {checklistProgress.percentage < 100 ? 'Check All' : 'Reset'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${checklistProgress.percentage}%` }}
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklistItem(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  item.completed
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800'
                }`}
              >
                <button
                  type="button"
                  aria-label={`Mark "${item.task}" as ${item.completed ? 'incomplete' : 'complete'}`}
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    item.completed
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'border border-zinc-600 bg-zinc-950 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {item.category}
                    </span>
                    <span className={`text-xs sm:text-sm font-bold ${item.completed ? 'line-through text-zinc-400' : 'text-white'}`}>
                      {item.task}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-300">Why it beats competitors:</strong> {item.whyItMatters}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onProceedToContent}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Proceed to Step 3: 60-Day Content Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
