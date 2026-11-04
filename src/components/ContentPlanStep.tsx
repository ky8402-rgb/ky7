import React, { useState } from 'react';
import { ContentPlan, VideoTopic } from '../types';
import { summarizeVideoIdeas, evaluateTitleCTR } from '../utils/youtube-logic';
import {
  Sparkles,
  Clock,
  Play,
  ArrowRight,
  Flame,
  RefreshCw,
  Plus,
  Tv,
  Smartphone,
  Eye,
  Users,
  TrendingUp,
  Share2,
  Search,
  Copy,
  Check,
  LayoutGrid,
  Calendar,
  Lightbulb,
  Image as ImageIcon,
} from 'lucide-react';

interface ContentPlanStepProps {
  contentPlan: ContentPlan;
  onSelectVideoForScript: (video: VideoTopic) => void;
  isLoading: boolean;
  onRegeneratePlan: (customAudience?: string) => void;
  channelName: string;
  nicheName: string;
}

export const ContentPlanStep: React.FC<ContentPlanStepProps> = ({
  contentPlan,
  onSelectVideoForScript,
  isLoading,
  onRegeneratePlan,
  channelName,
  nicheName,
}) => {
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid30' | 'weekly'>('grid30');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<'All' | 'Long-Form' | 'Shorts'>('All');
  const [driverFilter, setDriverFilter] = useState<
    'All' | 'Trending Topic' | 'High Audience Demand' | 'Extreme Shareability'
  >('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [audienceInput, setAudienceInput] = useState<string>(contentPlan.targetAudience || '');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allWeeks = contentPlan.weeks || [];

  // Flatten all ideas across weeks and ensure sequential numbering 1..30
  const flattenedIdeas: (VideoTopic & { weekNumber: number; phase: string; displayNumber: number })[] = [];
  let counter = 1;
  for (const week of allWeeks) {
    for (const video of week.videos) {
      flattenedIdeas.push({
        ...video,
        weekNumber: week.weekNumber,
        phase: week.phase,
        displayNumber: video.ideaNumber ?? counter,
      });
      counter++;
    }
  }

  const summary = summarizeVideoIdeas(flattenedIdeas, {
    formatFilter,
    driverFilter,
    searchQuery,
  });

  const handleAudienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegeneratePlan(audienceInput.trim() || contentPlan.targetAudience);
  };

  const handleCopyAllIdeas = () => {
    const text = flattenedIdeas
      .map(
        (v) =>
          `#${v.displayNumber}. ${v.title} [${v.format} • ${v.viralDriver || 'Viral Idea'}]\n` +
          `   - Opening Hook: "${v.hook}"\n` +
          `   - Video Concept: ${v.concept || 'High-retention educational narrative tailored to target audience.'}\n` +
          `   - Thumbnail Idea: ${v.thumbnailConcept}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingleIdea = (video: VideoTopic & { displayNumber: number }) => {
    const text =
      `Idea #${video.displayNumber}: ${video.title}\n` +
      `Opening Hook: "${video.hook}"\n` +
      `Video Concept: ${video.concept || ''}\n` +
      `Thumbnail Idea: ${video.thumbnailConcept}`;
    navigator.clipboard.writeText(text);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const newTopic: VideoTopic = {
      id: `custom-${Date.now()}`,
      ideaNumber: flattenedIdeas.length + 1,
      title: customTitle.trim(),
      format: 'Long-Form',
      targetDuration: '9:30',
      uploadDay: 'Custom',
      hook: 'Immediate high-stakes visual and psychological hook in the first 3 seconds.',
      concept: 'Custom high-retention deep dive tailored to your channel audience.',
      thumbnailConcept: 'High contrast visual with bold 2-word typography.',
      predictedCTR: '12.5%',
      viralDriver: 'Trending Topic',
      shareabilityScore: 95,
    };
    onSelectVideoForScript(newTopic);
    setCustomTitle('');
  };

  const getDriverBadgeStyle = (driver?: string) => {
    const d = (driver || '').toLowerCase();
    if (d.includes('trending')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    }
    if (d.includes('share')) {
      return 'bg-purple-500/10 text-purple-400 border-purple-500/25';
    }
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
  };

  const renderVideoCard = (
    video: VideoTopic & { weekNumber?: number; displayNumber: number }
  ) => {
    const isShorts = video.format.toLowerCase().includes('short');
    const ctrEval = evaluateTitleCTR(video.title);
    const shareScore = video.shareabilityScore ?? 95;
    const driverLabel = video.viralDriver || 'High Audience Demand';

    return (
      <div
        key={video.id}
        className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
      >
        <div className="space-y-3.5">
          {/* Top Metadata Row: Idea #, Format, Viral Driver, Est. CTR */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 font-mono">
                IDEA #{video.displayNumber}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                  isShorts
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}
              >
                {isShorts ? <Smartphone className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {video.format}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${getDriverBadgeStyle(
                  driverLabel
                )}`}
              >
                <TrendingUp className="w-3 h-3" />
                {driverLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5" /> {video.targetDuration}
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3" /> CTR {video.predictedCTR}
              </span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                <Share2 className="w-2.5 h-2.5" /> {shareScore}/100
              </span>
            </div>
          </div>

          {/* 1. Clickable Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                1. Clickable Title
              </span>
              <span className="text-[10px] font-semibold text-emerald-400">
                Title CTR Score: {ctrEval.score}/100
              </span>
            </div>
            <h4 className="text-base font-extrabold text-white group-hover:text-red-400 transition-colors leading-snug">
              {video.title}
            </h4>
          </div>

          {/* 2. Strong Opening Hook */}
          <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800/80 text-xs space-y-2.5">
            <div>
              <span className="text-red-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 2. Strong Opening Hook (First 5 Seconds):
              </span>
              <p className="text-zinc-200 text-xs mt-1 italic leading-relaxed">
                "{video.hook}"
              </p>
            </div>

            {/* 3. The Video Concept */}
            <div className="pt-2 border-t border-zinc-800/80">
              <span className="text-sky-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> 3. The Video Concept & Retention Angle:
              </span>
              <p className="text-zinc-300 text-xs mt-1 leading-relaxed">
                {video.concept ||
                  'High-retention psychological narrative structured around 3 escalating curiosity loops and actionable viewer takeaways.'}
              </p>
            </div>

            {/* 4. Thumbnail Idea */}
            <div className="pt-2 border-t border-zinc-800/80">
              <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> 4. High-CTR Thumbnail Idea:
              </span>
              <p className="text-zinc-300 text-xs mt-1 leading-relaxed">
                {video.thumbnailConcept}
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopySingleIdea(video)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-800 flex items-center gap-1 transition-colors"
            >
              {copiedId === video.id ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copy Idea</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              Upload: <strong className="text-zinc-300">{video.uploadDay}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectVideoForScript(video)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Generate Full Script (Step 4)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Blueprint Step 3 Hero Banner directly integrating user's Step 3 upload */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Blueprint Step 3 Executed
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              3. Generate Viral Video Ideas (30 High-Potential Ideas)
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              30 high-potential viral video ideas for <strong className="text-white">{channelName}</strong> in the{' '}
              <span className="text-red-400 font-semibold">{nicheName}</span> niche—complete with clickable titles, strong opening hooks, full video concepts, and high-CTR thumbnail ideas engineered for trending topics, audience demand, and shareability.
            </p>

            {/* Master Prompt Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors underline decoration-dotted"
              >
                <span>
                  {showPromptDetails
                    ? 'Hide Step 3 Master Prompt'
                    : 'View Original Step 3 Blueprint Prompt'}
                </span>
              </button>

              {showPromptDetails && (
                <div className="mt-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500 font-sans font-semibold uppercase tracking-wider">
                    <span>Active Step 3 Master Prompt (from reference attachment)</span>
                    <span className="text-emerald-400 font-mono">
                      30 Ideas Generated • [NICHE] + [AUDIENCE] Injected
                    </span>
                  </div>
                  <p className="text-zinc-200 italic">
                    "Act as a YouTube content strategist. Generate 30 high-potential video ideas for my [{nicheName}] channel targeting [{contentPlan.targetAudience}]. For each idea, provide a clickable title, a strong opening hook, the video concept, and a thumbnail idea. Focus on trending topics, audience demand, and shareability."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 3 Reference Image Thumbnail Card */}
          <div className="w-full lg:w-72 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shrink-0 shadow-lg">
            <div className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
              <span>Attached Step 3 Blueprint</span>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                Image Reference
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-zinc-700/60 bg-black">
              <img
                src="/assets/aistudio/IMG_20261104_075027_de025457.jpg"
                alt="Step 3 Generate Viral Video Ideas Prompt"
                className="w-full h-36 object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-0.5">
              <span className="font-medium text-white flex items-center gap-1">
                <Eye className="w-3 h-3 text-red-400" /> 3. Generate Viral Video Ideas
              </span>
            </div>
          </div>
        </div>

        {/* Target Audience [AUDIENCE] Injector & Regenerate Bar */}
        <form
          onSubmit={handleAudienceSubmit}
          className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col md:flex-row items-stretch md:items-center gap-3"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 shrink-0">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Target [AUDIENCE]:</span>
          </div>
          <input
            type="text"
            value={audienceInput}
            onChange={(e) => setAudienceInput(e.target.value)}
            placeholder="e.g. Ambitious 18-35 year-old professionals, students, and self-improvers..."
            className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyAllIdeas}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied All 30 Ideas!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy All 30 Ideas</span>
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Generating 30 Ideas...' : 'Generate 30 Viral Ideas'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4-Card Summary Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Total Viral Ideas
            </span>
            <span className="text-2xl font-extrabold text-white mt-0.5 block">
              {summary.totalCount} Ideas
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Long-Form Pillars
            </span>
            <span className="text-2xl font-extrabold text-blue-400 mt-0.5 block">
              {summary.longFormCount} Videos
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Tv className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Viral Shorts Feeders
            </span>
            <span className="text-2xl font-extrabold text-rose-400 mt-0.5 block">
              {summary.shortsCount} Shorts
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Avg. Shareability
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-0.5 block">
              {summary.avgShareability}/100
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Share2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters, Search & View Mode Controls */}
      <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl bg-zinc-950 border border-zinc-800 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid30')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'grid30'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All 30 Ideas (#1–#30)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'weekly'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>6-Week Sprint View</span>
              </button>
            </div>

            {/* Format Filter */}
            <div className="flex items-center rounded-xl bg-zinc-950 border border-zinc-800 p-1">
              {(['All', 'Long-Form', 'Shorts'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    formatFilter === fmt
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 30 titles or keywords..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Viral Focus Filter Pills (Trending Topics, Audience Demand, Shareability) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 mr-1">
              Prompt Focus Filter:
            </span>
            {(
              [
                'All',
                'Trending Topic',
                'High Audience Demand',
                'Extreme Shareability',
              ] as const
            ).map((driver) => (
              <button
                key={driver}
                type="button"
                onClick={() => setDriverFilter(driver)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                  driverFilter === driver
                    ? 'bg-zinc-800 text-white border border-zinc-600 shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {driver === 'All' ? `All Drivers (${summary.totalCount})` : driver}
              </button>
            ))}
          </div>

          {viewMode === 'weekly' && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedWeek('all')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
                  selectedWeek === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                }`}
              >
                All 6 Weeks
              </button>
              {allWeeks.map((week) => (
                <button
                  key={week.weekNumber}
                  type="button"
                  onClick={() => setSelectedWeek(week.weekNumber)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
                    selectedWeek === week.weekNumber
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Week {week.weekNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Display: All 30 Ideas Grid OR Weekly Sprints */}
      {viewMode === 'grid30' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Showing {summary.filteredIdeas.length} of {summary.totalCount} High-Potential Viral Video Ideas
            </h3>
            <span className="text-xs text-zinc-500">
              Click "Generate Full Script (Step 4)" on any idea to build its script & thumbnail
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {summary.filteredIdeas.map((video) => renderVideoCard(video))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {allWeeks
            .filter((w) => selectedWeek === 'all' || w.weekNumber === selectedWeek)
            .map((week) => {
              const weekVideos = summary.filteredIdeas.filter(
                (v) => v.weekNumber === week.weekNumber
              );
              if (weekVideos.length === 0) return null;

              return (
                <div key={week.weekNumber} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-white text-xs font-extrabold uppercase">
                      Week {week.weekNumber}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {week.phase}
                    </h3>
                    <div className="h-px bg-zinc-800 flex-1 ml-2" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {weekVideos.map((video) => renderVideoCard(video))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Custom Topic Input */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-400" />
          Have Your Own Viral Idea (#31)? Turn It Into a Full Script Instantly
        </h3>
        <form onSubmit={handleAddCustomTopic} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. Why The Most Dangerous People Never Argue Back..."
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <span>Script This Custom Video</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
