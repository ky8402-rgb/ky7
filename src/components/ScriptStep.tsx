import React, { useState, useEffect, useRef } from 'react';
import { VideoScript } from '../types';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Clock, 
  Film, 
  Radio, 
  Zap, 
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Sliders
} from 'lucide-react';

interface ScriptStepProps {
  script: VideoScript;
  onRegenerateScript: () => void;
  isLoading: boolean;
  onProceedToThumbnail: () => void;
  videoTitle: string;
}

export const ScriptStep: React.FC<ScriptStepProps> = ({
  script,
  onRegenerateScript,
  isLoading,
  onProceedToThumbnail,
  videoTitle,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedVoiceoverOnly, setCopiedVoiceoverOnly] = useState<boolean>(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const fullVoiceoverText = script.sections.map((s) => s.voiceover).join(' ');

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    synthRef.current.cancel(); // stop any current speech
    const utterance = new SpeechSynthesisUtterance(fullVoiceoverText);
    utterance.rate = speechRate;
    
    // Pick standard English voice
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Guy') || v.name.includes('David')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const handleCopyFullScript = () => {
    const formatted = `# SCRIPT: ${script.title}\nEst Duration: ${script.estimatedDuration}\nPredicted Retention: ${script.predictedRetention}\n\n` +
      script.sections.map(s => `[${s.timestamp}] ${s.sectionName}\nVISUAL: ${s.visualCue}\nSFX: ${s.soundFX}\nINTERRUPT: ${s.patternInterruptNote}\nVOICEOVER: "${s.voiceover}"\n`).join('\n---\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyVoiceoverOnly = () => {
    navigator.clipboard.writeText(fullVoiceoverText);
    setCopiedVoiceoverOnly(true);
    setTimeout(() => setCopiedVoiceoverOnly(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Step 4 of Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            4. Faceless Retention Scriptwriter
          </h1>
          <p className="text-zinc-400 text-sm">
            Engineered with 3-second visual hooks, pattern interrupts every 35 seconds, and precise B-roll cues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerateScript}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate Script</span>
          </button>
        </div>
      </div>

      {/* Script Summary & Audio Preview Toolbar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              Est. Length: {script.estimatedDuration}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Predicted Retention: {script.predictedRetention}
            </span>
            <span className="text-xs text-zinc-400">
              {script.sections.length} Timeline Blocks
            </span>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">
            {script.title || videoTitle}
          </h2>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            <strong className="text-zinc-200">Retention Strategy:</strong> {script.hookStrategy}
          </p>
        </div>

        {/* Audio TTS Player Card */}
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row items-center gap-4 shrink-0 shadow-lg">
          <button
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-md shrink-0 ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-500 animate-pulse' 
                : 'bg-red-600 hover:bg-red-500'
            }`}
            title={isPlaying ? 'Pause Audio' : 'Play Narration Voiceover'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Narrator Voice Preview</span>
              {isPlaying && (
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded animate-pulse">
                  PLAYING
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              Browser TTS Audio • {speechRate}x pace
            </p>
            {/* Speed slider */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-zinc-500">Speed:</span>
              {[1.0, 1.05, 1.15].map(rate => (
                <button
                  key={rate}
                  onClick={() => setSpeechRate(rate)}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    speechRate === rate ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto">
            <button
              onClick={handleCopyVoiceoverOnly}
              className="text-[11px] px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium flex items-center justify-center gap-1 transition-colors"
            >
              {copiedVoiceoverOnly ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy TTS Text Only</span>
            </button>
            <button
              onClick={handleCopyFullScript}
              className="text-[11px] px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium flex items-center justify-center gap-1 transition-colors"
            >
              {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy Full Director Script</span>
            </button>
          </div>
        </div>
      </div>

      {/* Script Timeline Section Blocks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span>Video Timeline & Scene Breakdown</span>
            <span className="text-xs text-zinc-500 font-normal">({script.sections.length} blocks)</span>
          </h3>
        </div>

        {script.sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 space-y-4 hover:border-zinc-700 transition-all shadow-sm"
          >
            {/* Top row: Section Name & Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-200 font-mono text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="font-extrabold text-white text-sm sm:text-base">
                  {section.sectionName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-red-400">
                  ⏱ {section.timestamp}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  ({section.durationSeconds}s)
                </span>
              </div>
            </div>

            {/* Grid: Production Cues (B-Roll, SFX, Pattern Interrupt) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Visual B-Roll Cue */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="font-bold text-sky-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Film className="w-3 h-3" /> Visual B-Roll / AI Prompt
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {section.visualCue}
                </p>
              </div>

              {/* Sound FX Cue */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Radio className="w-3 h-3" /> Sound Design / SFX
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {section.soundFX}
                </p>
              </div>

              {/* Pattern Interrupt */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Pattern Interrupt Note
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {section.patternInterruptNote}
                </p>
              </div>
            </div>

            {/* Voiceover Text */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Narrator Voiceover (TTS Narration Text)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(section.voiceover);
                  }}
                  className="text-zinc-500 hover:text-white p-1 rounded"
                  title="Copy this section's voiceover"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-zinc-200 text-sm leading-relaxed font-sans">
                "{section.voiceover}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
          onClick={onProceedToThumbnail}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Proceed to Step 5: High-CTR Thumbnail Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
