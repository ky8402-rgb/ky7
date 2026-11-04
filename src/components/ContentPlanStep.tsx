import React, { useState } from 'react';
import { ContentPlan, VideoTopic } from '../types';
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  Play, 
  ArrowRight, 
  Flame, 
  RefreshCw, 
  Plus, 
  Filter,
  CheckCircle2,
  Tv,
  Smartphone
} from 'lucide-react';

interface ContentPlanStepProps {
  contentPlan: ContentPlan;
  onSelectVideoForScript: (video: VideoTopic) => void;
  isLoading: boolean;
  onRegeneratePlan: () => void;
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
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<'All' | 'Long-Form' | 'Shorts'>('All');
  const [customTitle, setCustomTitle] = useState<string>('');

  const allWeeks = contentPlan.weeks || [];

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const newTopic: VideoTopic = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      format: 'Long-Form',
      targetDuration: '9:30',
      uploadDay: 'Custom',
      hook: 'Immediate high-stakes visual hook in the first 3 seconds.',
      thumbnailConcept: 'High contrast visual with bold typography.',
      predictedCTR: '12.0%',
    };
    onSelectVideoForScript(newTopic);
    setCustomTitle('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Step 3 of Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            3. 60-Day Viral Content Roadmap
          </h1>
          <p className="text-zinc-400 text-sm">
            Curiosity-driven titles, hooks, and upload cadence engineered to trigger YouTube algorithm recommendations for <strong className="text-white">{channelName}</strong>.
          </p>
        </div>

        <button
          onClick={onRegeneratePlan}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700 transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Roadmap</span>
        </button>
      </div>

      {/* Strategic Audience & Cadence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
            Algorithmic Strategy
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {contentPlan.strategy}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-1">
            Target Viewer Persona
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {contentPlan.targetAudience}
          </p>
        </div>
      </div>

      {/* Week Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Week Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedWeek('all')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedWeek === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            All Weeks
          </button>
          {allWeeks.map((week) => (
            <button
              key={week.weekNumber}
              onClick={() => setSelectedWeek(week.weekNumber)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedWeek === week.weekNumber
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Week {week.weekNumber}
            </button>
          ))}
        </div>

        {/* Format Selector */}
        <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 self-start sm:self-auto">
          {(['All', 'Long-Form', 'Shorts'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                formatFilter === fmt ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Video Content Grid grouped by week */}
      <div className="space-y-8">
        {allWeeks
          .filter((w) => selectedWeek === 'all' || w.weekNumber === selectedWeek)
          .map((week) => {
            const videos = week.videos.filter(
              (v) => formatFilter === 'All' || v.format.toLowerCase().includes(formatFilter.toLowerCase())
            );

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
                  {videos.map((video) => {
                    const isShorts = video.format.toLowerCase().includes('short');

                    return (
                      <div
                        key={video.id}
                        className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
                      >
                        <div className="space-y-3">
                          {/* Metadata row */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                  isShorts
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}
                              >
                                {isShorts ? <Smartphone className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                                {video.format}
                              </span>
                              <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" /> {video.targetDuration}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                                {video.uploadDay}
                              </span>
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Est. CTR {video.predictedCTR}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                            {video.title}
                          </h4>

                          {/* Hook breakdown */}
                          <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800/60 text-xs space-y-1.5">
                            <div>
                              <span className="text-red-400 font-semibold text-[11px] uppercase tracking-wider">
                                3-Second Viral Hook:
                              </span>
                              <p className="text-zinc-300 text-xs mt-0.5 italic">
                                "{video.hook}"
                              </p>
                            </div>
                            <div className="pt-1.5 border-t border-zinc-800/80">
                              <span className="text-zinc-400 font-medium text-[11px]">
                                Thumbnail Angle:
                              </span>
                              <p className="text-zinc-400 text-[11px] mt-0.5">
                                {video.thumbnailConcept}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card action */}
                        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-end">
                          <button
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
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Custom Topic Input */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-400" />
          Have Your Own Video Idea? Write Script Instantly
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
