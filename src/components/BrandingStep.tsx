import React, { useState } from 'react';
import { ChannelBranding } from '../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Palette, 
  Image as ImageIcon, 
  Monitor, 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface BrandingStepProps {
  branding: ChannelBranding;
  onUpdateBranding: (updated: Partial<ChannelBranding>) => void;
  isLoading: boolean;
  onRegenerateBranding: () => void;
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

  const selectedName = branding.channelNames[branding.selectedNameIndex] || branding.channelNames[0];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Step 2 of Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            2. Channel Branding & Visual Identity
          </h1>
          <p className="text-zinc-400 text-sm">
            High-converting channel names, YouTube SEO "About" bio, and responsive banner design tailored for <span className="text-zinc-200 font-medium">{nicheName}</span>.
          </p>
        </div>

        <button
          onClick={onRegenerateBranding}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700 transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Brand Pack</span>
        </button>
      </div>

      {/* Channel Name Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <span>Select Primary Channel Name & Handle</span>
          <span className="text-[10px] text-zinc-500 font-normal">Click any name to activate</span>
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

      {/* Interactive YouTube Channel Preview Simulator */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="font-bold text-sm text-white">Live YouTube Channel Header Simulator</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Safe zone toggle */}
            <button
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

            {/* Device preview toggles */}
            <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 ${
                  previewDevice === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
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
          {/* Background texture styling */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 75% 50%, ${branding.colorPalette.accent} 0%, transparent 60%)`,
            }}
          />

          {/* Banner typography and content */}
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

          {/* Visual Safe Zone Overlay Indicator */}
          {showSafeZones && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Desktop Safe Area: 1546 x 423 */}
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

        {/* Channel Details Bar (simulating real YouTube Channel header) */}
        <div className="p-5 sm:p-6 bg-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
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
            <button className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-colors">
              Subscribe
            </button>
            <button className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors">
              Join
            </button>
          </div>
        </div>

        {/* Simulated YouTube channel tabs */}
        <div className="px-6 border-t border-zinc-900 flex items-center gap-6 text-xs font-semibold text-zinc-400 py-2.5 overflow-x-auto no-scrollbar">
          <span className="text-white border-b-2 border-white pb-2.5 -mb-2.5">HOME</span>
          <span className="hover:text-zinc-200 cursor-pointer">VIDEOS</span>
          <span className="hover:text-zinc-200 cursor-pointer">SHORTS</span>
          <span className="hover:text-zinc-200 cursor-pointer">PLAYLISTS</span>
          <span className="hover:text-zinc-200 cursor-pointer">COMMUNITY</span>
          <span className="hover:text-zinc-200 cursor-pointer">ABOUT</span>
        </div>
      </div>

      {/* Brand Attributes: Tagline, Bio, and Color Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tagline & Color Palette */}
        <div className="space-y-6">
          {/* Tagline Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Channel Tagline</span>
              <button
                onClick={() => handleCopy(branding.tagline, 'tagline')}
                className="text-zinc-400 hover:text-white p-1 rounded"
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

          {/* Color Palette Card */}
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

            {/* Banner AI generation prompt copy */}
            <div className="pt-2">
              <span className="text-[11px] text-zinc-400 font-medium block mb-1">
                Midjourney / Leonardo Banner Prompt:
              </span>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-zinc-400 relative">
                <p className="line-clamp-3">{branding.bannerConcept.visualDescription}</p>
                <button
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

        {/* Right 2 Columns: SEO YouTube About / Bio Description */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">YouTube SEO "About" Description</h3>
              <p className="text-xs text-zinc-400">Paste directly into YouTube Studio &gt; Customization &gt; Basic Info</p>
            </div>

            <button
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
            rows={8}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-red-500 shadow-inner"
          />

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>SEO Optimization Tip:</strong> The first 150 characters of this bio are crawled by Google Search and YouTube's algorithm to establish channel topical authority.
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
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
