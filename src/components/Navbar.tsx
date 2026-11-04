import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  DollarSign, 
  Download,
  ImagePlay
} from 'lucide-react';

interface NavbarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  channelName: string;
  nicheName: string;
  onOpenBlueprint: () => void;
  onExport: () => void;
}

const STEPS = [
  { id: 1, label: '1. Niche Matrix', icon: Compass, short: 'Niche' },
  { id: 2, label: '2. Build Channel', icon: Sparkles, short: 'Build Channel' },
  { id: 3, label: '3. 30 Viral Ideas', icon: Calendar, short: '30 Ideas' },
  { id: 4, label: '4. Script Studio', icon: FileText, short: 'Script' },
  { id: 5, label: '5. Thumbnail & CTR', icon: ImageIcon, short: 'Thumbnail' },
  { id: 6, label: '6. SEO & Tags', icon: Search, short: 'SEO' },
  { id: 7, label: '7. Monetize to 10K', icon: DollarSign, short: 'Monetize' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onSelectStep,
  channelName,
  nicheName,
  onOpenBlueprint,
  onExport,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      {/* Top tier brand row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-600/25 ring-1 ring-red-400/30">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">ChannelForge</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                Studio AI
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Faceless YouTube Channel Launchpad</p>
          </div>
        </div>

        {/* Channel Indicator Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400">Target Channel:</span>
          <span className="font-semibold text-white truncate max-w-[140px]">{channelName || 'Setting Up...'}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 truncate max-w-[150px]">{nicheName || 'Select Niche'}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBlueprint}
            aria-label="Reference Blueprint"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-colors shadow-sm"
            title="Inspect Prompt #1 from your uploaded blueprint"
          >
            <ImagePlay className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Reference Blueprint</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Plan</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 border-t border-zinc-900 overflow-x-auto no-scrollbar py-1">
        <ul className="flex items-center gap-1 min-w-max">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <li key={step.id}>
                <button
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-zinc-500'}`} />
                  <span className="hidden lg:inline">{step.label}</span>
                  <span className="lg:hidden">{step.short}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-0.5" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
