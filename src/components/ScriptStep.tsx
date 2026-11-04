import React, { useState, useEffect, useRef } from 'react';
import { VideoScript } from '../types';
import { calculateScriptMetrics } from '../utils/youtube-logic';
import {
  Sparkles,
  Volume2,
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
  Eye,
  Type as TypeIcon,
  Scissors,
  Cpu,
  Flag,
  FileText,
} from 'lucide-react';

interface ScriptStepProps {
  script: VideoScript;
  onRegenerateScript: (customTopic?: string, customLengthMinutes?: number) => void;
  isLoading: boolean;
  onProceedToThumbnail: () => void;
  videoTitle: string;
}

const LENGTH_PRESETS = [1, 5, 8, 9, 10, 12, 15];

export const ScriptStep: React.FC<ScriptStepProps> = ({
  script,
  onRegenerateScript,
  isLoading,
  onProceedToThumbnail,
  videoTitle,
}) => {
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(true);
  const [topicInput, setTopicInput] = useState<string>(script.title || videoTitle);
  const [lengthMinutes, setLengthMinutes] = useState<number>(script.targetLengthMinutes || 9);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedVoiceoverOnly, setCopiedVoiceoverOnly] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setTopicInput(script.title || videoTitle);
    if (script.targetLengthMinutes) {
      setLengthMinutes(script.targetLengthMinutes);
    }
  }, [script.title, script.targetLengthMinutes, videoTitle]);

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
  const metrics = calculateScriptMetrics(script.sections);

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(fullVoiceoverText);
    utterance.rate = speechRate;

    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Guy') ||
          v.name.includes('David'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const handleCopySnippet = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleCopyFullScript = () => {
    const formatted =
      `# AI VIDEO PRODUCTION SCRIPT: ${script.title}\n` +
      `Target Length: ${lengthMinutes} Minutes (${script.estimatedDuration}) | Predicted Retention: ${script.predictedRetention}\n` +
      `5-Second Hook: ${script.fiveSecondHook || script.hookStrategy}\n\n` +
      script.sections
        .map(
          (s, i) =>
            `## Scene #${i + 1}: [${s.timestamp}] ${s.sectionName} (${s.durationSeconds}s)\n` +
            `- VISUAL DIRECTION: ${s.visualCue}\n` +
            `- ON-SCREEN TEXT: "${s.onScreenText || 'KEY TAKEAWAY'}"\n` +
            `- EDITING INSTRUCTIONS: ${s.editingInstructions || 'Slow zoom-in with dynamic captions.'}\n` +
            `- SOUND FX: ${s.soundFX}\n` +
            `- PATTERN INTERRUPT: ${s.patternInterruptNote}\n` +
            `- VOICEOVER NARRATION: "${s.voiceover}"\n`
        )
        .join('\n---\n\n') +
      `\n## COMPELLING ENDING STRATEGY:\n${script.compellingEnding || ''}\n`;
    navigator.clipboard.writeText(formatted);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyVoiceoverOnly = () => {
    navigator.clipboard.writeText(fullVoiceoverText);
    setCopiedVoiceoverOnly(true);
    setTimeout(() => setCopiedVoiceoverOnly(false), 2000);
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerateScript(topicInput.trim() || script.title, lengthMinutes);
  };

  const aiTools = script.recommendedAiTools || [];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Blueprint Step 4 Hero Banner directly integrating user's Step 4 upload */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Blueprint Step 4 Executed
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              4. Create Videos With AI (Faceless Script & Production Studio)
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Complete <strong className="text-white">{lengthMinutes}-minute</strong> faceless YouTube script about{' '}
              <span className="text-red-400 font-semibold">"{script.title || videoTitle}"</span>—featuring a powerful 5-second hook, engaging storytelling, scene-by-scene visual directions, on-screen text, editing instructions, a compelling ending, and free/affordable AI tools with zero face or voice recording.
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
                    ? 'Hide Step 4 Master Prompt'
                    : 'View Original Step 4 Blueprint Prompt'}
                </span>
              </button>

              {showPromptDetails && (
                <div className="mt-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500 font-sans font-semibold uppercase tracking-wider">
                    <span>Active Step 4 Master Prompt (from reference attachment)</span>
                    <span className="text-emerald-400 font-mono">
                      [{lengthMinutes}]-Minute Script • [TOPIC] Injected
                    </span>
                  </div>
                  <p className="text-zinc-200 italic">
                    "Act as an expert faceless YouTube scriptwriter. Write a complete [{lengthMinutes}]-minute script about [{script.title || videoTitle}]. Include a powerful 5-second hook, engaging storytelling, scene-by-scene visual directions, on-screen text, editing instructions, and a compelling ending. Recommend free or affordable AI tools to create the video without showing my face or recording my voice."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 4 Reference Image Thumbnail Card */}
          <div className="w-full lg:w-72 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shrink-0 shadow-lg">
            <div className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
              <span>Attached Step 4 Blueprint</span>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                Image Reference
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-zinc-700/60 bg-black">
              <img
                src="/assets/aistudio/IMG_20261104_075012_220ef1c9.jpg"
                alt="Step 4 Create Videos With AI Prompt"
                className="w-full h-36 object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-0.5">
              <span className="font-medium text-white flex items-center gap-1">
                <Eye className="w-3 h-3 text-red-400" /> 4. Create Videos With AI
              </span>
            </div>
          </div>
        </div>

        {/* Interactive [VIDEO LENGTH] & [TOPIC] Injector Bar */}
        <form
          onSubmit={handleGenerateSubmit}
          className="mt-6 pt-5 border-t border-zinc-800/80 space-y-3"
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* [VIDEO LENGTH] Preset Selector */}
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1.5 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-400" /> [VIDEO LENGTH]:
              </span>
              <div className="flex items-center gap-1">
                {LENGTH_PRESETS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setLengthMinutes(mins)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                      lengthMinutes === mins
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* [TOPIC] Input */}
            <div className="flex-1 flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 shrink-0">
                [TOPIC]:
              </span>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter video topic or select from your 30 viral ideas..."
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 transition-colors shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Writing AI Script...' : 'Generate AI Video Script'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Script Telemetry & Audio TTS Player Bar */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
              Target Length: {lengthMinutes} Min ({script.estimatedDuration || metrics.formattedDuration})
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Predicted Retention: {script.predictedRetention}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              {script.sections.length} Scenes • {metrics.totalWords} Spoken Words
            </span>
          </div>

          <h2 className="text-lg font-extrabold text-white tracking-tight">
            {script.title || videoTitle}
          </h2>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            <strong className="text-zinc-200">Storytelling Architecture:</strong> {script.hookStrategy}
          </p>
        </div>

        {/* Browser TTS Narrator Player + Copy Buttons */}
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row items-center gap-4 shrink-0 shadow-lg">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-md shrink-0 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 animate-pulse'
                : 'bg-red-600 hover:bg-red-500'
            }`}
            title={isPlaying ? 'Pause Audio' : 'Play Narration Voiceover'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold text-white">AI Voiceover Preview</span>
              {isPlaying && (
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded animate-pulse">
                  PLAYING
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">No-Mic Browser TTS • {speechRate}x pace</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[10px] text-zinc-500">Speed:</span>
              {[1.0, 1.05, 1.15].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSpeechRate(rate)}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    speechRate === rate
                      ? 'bg-zinc-700 text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyVoiceoverOnly}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium flex items-center justify-center gap-1 transition-colors"
            >
              {copiedVoiceoverOnly ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedVoiceoverOnly ? 'Copied Voiceover!' : 'Copy TTS Voiceover'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyFullScript}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium flex items-center justify-center gap-1 transition-colors"
            >
              {copiedScript ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <FileText className="w-3 h-3" />
              )}
              <span>{copiedScript ? 'Copied Full Script!' : 'Copy Full Production Script'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Powerful 5-Second Hook Spotlight Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/30 via-zinc-950 to-zinc-950 border border-red-500/30 shadow-lg space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> 1. Powerful 5-Second Hook (0:00 – 0:05 Scroll-Stopper)
          </span>
          <button
            type="button"
            onClick={() =>
              handleCopySnippet('hook-5s', script.fiveSecondHook || script.sections[0]?.voiceover || '')
            }
            className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 flex items-center gap-1"
          >
            {copiedKey === 'hook-5s' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied Hook</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy 5s Hook</span>
              </>
            )}
          </button>
        </div>
        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
          {script.fiveSecondHook ||
            `0:00–0:05: "${script.sections[0]?.voiceover || ''}"`}
        </p>
      </div>

      {/* 2. Scene-by-Scene Visual Directions, On-Screen Text, Editing Instructions & Storytelling */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <span>2. Scene-by-Scene Visual Directions, On-Screen Text, Editing & Storytelling</span>
            <span className="text-xs text-zinc-500 font-normal">
              ({script.sections.length} production scenes)
            </span>
          </h3>
          <span className="text-xs text-zinc-500">
            Click any copy icon to paste prompts directly into Leonardo.ai, ElevenLabs, or CapCut
          </span>
        </div>

        {script.sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 space-y-4 hover:border-zinc-700 transition-all shadow-sm"
          >
            {/* Scene Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 font-mono text-xs font-extrabold">
                  SCENE #{idx + 1}
                </span>
                <span className="font-extrabold text-white text-sm sm:text-base">
                  {section.sectionName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-red-400">
                  ⏱ {section.timestamp}
                </span>
                <span className="text-xs text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {section.durationSeconds}s
                </span>
              </div>
            </div>

            {/* 4-Column Production Cues Grid: Visual Directions, On-Screen Text, Editing Instructions, SFX/Interrupt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Scene-by-Scene Visual Directions */}
              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Film className="w-3.5 h-3.5" /> Scene Visual Direction (AI B-Roll Prompt)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySnippet(`vis-${idx}`, section.visualCue)}
                    className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === `vis-${idx}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy Prompt</span>
                  </button>
                </div>
                <p className="text-zinc-200 text-xs leading-relaxed">{section.visualCue}</p>
              </div>

              {/* On-Screen Text Overlay */}
              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <TypeIcon className="w-3.5 h-3.5" /> On-Screen Text Overlay
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopySnippet(
                        `txt-${idx}`,
                        section.onScreenText || section.patternInterruptNote
                      )
                    }
                    className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === `txt-${idx}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy Text</span>
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-black border border-amber-500/20 font-mono font-extrabold text-amber-300 text-xs tracking-wide">
                  "{section.onScreenText || section.patternInterruptNote}"
                </div>
              </div>

              {/* Editing Instructions */}
              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 space-y-1.5">
                <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5" /> Editing Instructions (CapCut / DaVinci)
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {section.editingInstructions ||
                    'Apply 1.12x slow keyframe zoom-in, high-contrast dark LUT, and cut on beat.'}
                </p>
              </div>

              {/* Sound Design & Pattern Interrupt */}
              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 space-y-1.5">
                <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" /> Sound Design (SFX) & Pattern Interrupt
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {section.soundFX} • <span className="text-zinc-400">{section.patternInterruptNote}</span>
                </p>
              </div>
            </div>

            {/* Engaging Storytelling Voiceover Narration */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Engaging Storytelling Voiceover (AI TTS Script)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(`vo-${idx}`, section.voiceover)}
                  className="text-xs text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800/80 flex items-center gap-1"
                >
                  {copiedKey === `vo-${idx}` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Scene Narration</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-zinc-100 text-sm leading-relaxed font-sans">
                "{section.voiceover}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Compelling Ending & Binge-Loop Architecture */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Flag className="w-4 h-4" /> 3. Compelling Ending & Binge-Watch Handoff Strategy
        </span>
        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
          {script.compellingEnding ||
            'Close with a high-impact philosophical takeaway and immediately point viewers to the on-screen end card video without saying "thanks for watching" to preserve 70%+ end-screen retention.'}
        </p>
      </div>

      {/* 4. Recommended Free or Affordable AI Tools (No Face, No Voice Recording) */}
      {aiTools.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>
                  4. Recommended Free & Affordable AI Tools (No Face, No Voice Recording)
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Complete zero-camera, zero-microphone AI production stack to turn the script above into a finished 1080p/4K video.
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
              100% Faceless & Voiceless Stack
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiTools.map((tool, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                      {tool.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {tool.pricingTier}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">{tool.name}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-200">Best For:</strong> {tool.bestFor}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
                  <strong className="text-amber-400">Pro Workflow Tip:</strong> {tool.workflowTip}
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
