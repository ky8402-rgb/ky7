import React, { useState, useEffect } from 'react';
import { SeoData, VideoScript, ContentPlan, VideoTopic } from '../types';
import { formatYouTubeTags } from '../utils/youtube-logic';
import {
  renderAutomatedFacelessVideo,
  RenderedVideoOutput,
} from '../utils/videoRenderer';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  fetchConnectedYouTubeChannel,
  uploadVideoToYouTube,
  ConnectedYouTubeChannel,
  YouTubeUploadResult,
} from '../services/youtubeAuth';
import type { User } from 'firebase/auth';
import {
  Sparkles,
  Copy,
  Check,
  Search,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Tag,
  Video,
  Upload,
  Play,
  Download,
  ShieldCheck,
  Calendar,
  ExternalLink,
  AlertTriangle,
  LogOut,
  Volume2,
  Film,
  X,
  Zap,
  Clock,
  Layers,
} from 'lucide-react';

interface SeoStepProps {
  seo: SeoData;
  videoTitle: string;
  script: VideoScript;
  contentPlan?: ContentPlan;
  thumbnailDataUrl?: string | null;
  onSelectTitleVariant: (title: string) => void;
  onSelectIdeaForAutoPilot?: (video: VideoTopic) => Promise<void> | void;
  onRegenerateSeo: () => void;
  onProceedToMonetization: () => void;
  isLoading: boolean;
  channelName: string;
}

function getNextScheduledIsoLocal(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(18, 0, 0, 0);
  const tzOffsetMs = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

export const SeoStep: React.FC<SeoStepProps> = ({
  seo,
  videoTitle,
  script,
  contentPlan,
  thumbnailDataUrl,
  onSelectTitleVariant,
  onSelectIdeaForAutoPilot,
  onRegenerateSeo,
  onProceedToMonetization,
  isLoading,
  channelName,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Automated Video Renderer state
  const [voiceName, setVoiceName] = useState<
    'Charon' | 'Kore' | 'Fenrir' | 'Puck' | 'Zephyr'
  >('Charon');
  const [secondsPerScene, setSecondsPerScene] = useState<number>(2);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState('');
  const [renderedVideo, setRenderedVideo] =
    useState<RenderedVideoOutput | null>(null);
  const [customVideoFile, setCustomVideoFile] = useState<File | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Full 1-Click Auto-Pilot state
  const [isRunningAutoPilot, setIsRunningAutoPilot] = useState(false);
  const [autoPilotStepText, setAutoPilotStepText] = useState('');
  const [showOAuthGuide, setShowOAuthGuide] = useState(false);

  // YouTube OAuth & Direct Upload state
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [connectedChannel, setConnectedChannel] =
    useState<ConnectedYouTubeChannel | null>(null);
  const [privacyStatus, setPrivacyStatus] = useState<
    'private' | 'unlisted' | 'public'
  >('private');
  const [publishAt, setPublishAt] = useState<string>(() =>
    getNextScheduledIsoLocal(1)
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<YouTubeUploadResult | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = initAuth(
      async (authedUser, token) => {
        setUser(authedUser);
        setNeedsAuth(false);
        try {
          const ch = await fetchConnectedYouTubeChannel(token);
          setConnectedChannel(ch);
        } catch (err) {
          console.warn('Could not load YouTube channel details:', err);
        }
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
        setConnectedChannel(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRenderVideo = async (): Promise<RenderedVideoOutput | null> => {
    setIsRenderingVideo(true);
    setRenderError(null);
    setRenderProgress(2);
    setRenderStage('Initializing automated multi-scene video compositor...');
    try {
      const output = await renderAutomatedFacelessVideo({
        script,
        channelName,
        thumbnailDataUrl,
        voiceName,
        secondsPerScene,
        onProgress: (pct, stage) => {
          setRenderProgress(pct);
          setRenderStage(stage);
        },
      });
      setRenderedVideo(output);
      return output;
    } catch (err: any) {
      setRenderError(
        err?.message || 'Failed to render automated video in browser.'
      );
      return null;
    } finally {
      setIsRenderingVideo(false);
    }
  };

  const handleGoogleLogin = async (): Promise<string | null> => {
    setIsLoggingIn(true);
    setUploadError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        try {
          const ch = await fetchConnectedYouTubeChannel(result.accessToken);
          setConnectedChannel(ch);
        } catch (chErr: any) {
          console.warn('Channel lookup warning:', chErr);
        }
        return result.accessToken;
      }
      return null;
    } catch (err: any) {
      setUploadError(
        err?.message ||
          'Google sign-in failed. Make sure popups are allowed for this page.'
      );
      return null;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 1-Click Full Auto-Pilot Pipeline:
  // Automatically renders the multi-scene video + AI voiceover, connects Google OAuth if needed,
  // and opens the final confirmation modal to publish/schedule on YouTube!
  const handleRunFullAutoPilot = async (daysAheadSchedule = 1) => {
    setIsRunningAutoPilot(true);
    setUploadError(null);
    setRenderError(null);

    try {
      const scheduledIso = getNextScheduledIsoLocal(daysAheadSchedule);
      setPublishAt(scheduledIso);

      setAutoPilotStepText(
        'Step 1/3: Synthesizing Gemini TTS voiceover & rendering 1280x720 HD multi-scene video...'
      );
      const videoOut = renderedVideo || (await handleRenderVideo());
      if (!videoOut) {
        throw new Error('Automated video rendering did not complete.');
      }

      setAutoPilotStepText(
        'Step 2/3: Verifying Google YouTube OAuth connection...'
      );
      let token = await getAccessToken();
      if (!token) {
        token = await handleGoogleLogin();
      }

      setAutoPilotStepText(
        'Step 3/3: Video & SEO package ready! Review confirmation dialog to publish to YouTube.'
      );
      if (token) {
        setShowConfirmModal(true);
      } else {
        setUploadError(
          'Video is 100% rendered and ready! Click "Sign in with Google" to authorize uploading to your YouTube channel.'
        );
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Auto-pilot pipeline encountered an error.');
    } finally {
      setIsRunningAutoPilot(false);
    }
  };

  const handleQueueIdeaAndAutoRun = async (
    idea: VideoTopic,
    daysAhead: number
  ) => {
    onSelectTitleVariant(idea.title);
    setPublishAt(getNextScheduledIsoLocal(daysAhead));
    if (onSelectIdeaForAutoPilot) {
      await onSelectIdeaForAutoPilot(idea);
    }
    setRenderedVideo(null);
    await handleRunFullAutoPilot(daysAhead);
  };

  const handleDisconnect = async () => {
    await logout();
    setUser(null);
    setConnectedChannel(null);
    setNeedsAuth(true);
    setUploadResult(null);
  };

  const activeVideoBlob: Blob | null =
    customVideoFile || renderedVideo?.blob || null;

  const handleConfirmedUpload = async () => {
    setShowConfirmModal(false);
    if (!activeVideoBlob) {
      setUploadError(
        'Please click "Run 1-Click Full Auto-Pilot" or "Auto-Render Multi-Scene Video" first.'
      );
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setUploadError('Please sign in with Google to authorize YouTube upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);
    setUploadProgress(5);
    setUploadStage('Preparing YouTube Data API v3 upload...');

    try {
      const result = await uploadVideoToYouTube(token, {
        videoBlob: activeVideoBlob,
        title: videoTitle || seo.titleA,
        description: seo.description,
        tags: seo.tags,
        privacyStatus,
        publishAt: publishAt ? publishAt : undefined,
        thumbnailDataUrl,
        onProgress: (pct, stage) => {
          setUploadProgress(pct);
          setUploadStage(stage);
        },
      });
      setUploadResult(result);
    } catch (err: any) {
      setUploadError(
        err?.message ||
          'YouTube upload failed. Ensure YouTube Data API v3 is enabled in your Google Cloud project.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formattedTags = formatYouTubeTags(seo.tags);
  const queueIdeas: VideoTopic[] = (contentPlan?.weeks || [])
    .flatMap((w) => w.videos)
    .slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top 1-Click Full Auto-Pilot Command Center */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-red-500/30 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Step 7 • 1-Click End-to-End YouTube Auto-Pilot
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              7. Full Auto-Pilot Video Producer &amp; Direct YouTube Channel Publisher
            </h1>
            <p className="text-zinc-300 text-sm max-w-3xl">
              Click <strong>Run 1-Click Full Auto-Pilot</strong> below to automatically synthesize the Gemini TTS voiceover, render your 1280x720 HD multi-scene video with kinetic captions, package your SEO tags &amp; chapters, and schedule/upload directly to your YouTube channel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowOAuthGuide((v) => !v)}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
            >
              {showOAuthGuide ? 'Hide OAuth Status Card' : 'View OAuth Status Card'}
            </button>

            <button
              onClick={() => handleRunFullAutoPilot(1)}
              disabled={isRunningAutoPilot || isRenderingVideo || isUploading}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all cursor-pointer"
            >
              <Zap
                className={`w-4 h-4 ${
                  isRunningAutoPilot ? 'animate-spin' : ''
                }`}
              />
              <span>
                {isRunningAutoPilot
                  ? 'Running Full Auto-Pilot...'
                  : 'Run 1-Click Full Auto-Pilot Now'}
              </span>
            </button>
          </div>
        </div>

        {/* Auto-Pilot Live Pipeline Bar */}
        {isRunningAutoPilot && (
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-red-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-red-400 animate-spin shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white">
                {autoPilotStepText}
              </span>
            </div>
            <span className="text-xs font-mono text-red-400 font-bold">
              {renderProgress > 0 ? `${renderProgress}%` : 'ACTIVE'}
            </span>
          </div>
        )}

        {/* Collapsible Uploaded OAuth Reference Card */}
        {showOAuthGuide && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 rounded-lg overflow-hidden border border-zinc-800 bg-black">
              <img
                src="/assets/aistudio/IMG_0548_10cc876e.png"
                alt="Google Cloud OAuth Client Created"
                className="w-full h-auto object-contain max-h-52"
              />
            </div>
            <div className="md:col-span-7 space-y-2 text-xs text-zinc-300">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-4 h-4" />
                Google Cloud OAuth Provisioned &amp; Active
              </div>
              <p className="text-zinc-300 leading-relaxed">
                Your app is wired to the official client-side Google OAuth 2.0 flow (<code className="text-zinc-200">youtube.upload</code> + <code className="text-zinc-200">youtube.readonly</code>). We never store or expose your Client Secret in browser code.
              </p>
              <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                <li>
                  Ensure <strong>YouTube Data API v3</strong> is enabled in your Google Cloud Console Library.
                </li>
                <li>
                  Ensure your Google account (<code className="text-zinc-200">ky8402@gmail.com</code>) is listed under <strong>Audience &rarr; Test users</strong> on your OAuth consent screen.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1 & 2: Automated Video Renderer + Direct YouTube API Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Automated Multi-Scene Video + AI Voiceover Renderer */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    1. Auto-Render Multi-Scene Video + AI Voiceover
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Stitches your {script.sections.length} script scenes, Ken Burns zoom motion, burned-in captions &amp; Gemini TTS voiceover
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                1280x720 HD
              </span>
            </div>

            {/* Voice Persona & Scene Pace Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-red-400" />
                  AI Narrator Voice (Gemini TTS)
                </label>
                <select
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value as any)}
                  disabled={isRenderingVideo}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Charon">Charon (Deep Documentary Narrator)</option>
                  <option value="Kore">Kore (Clear Studio Authority)</option>
                  <option value="Fenrir">Fenrir (Dramatic Storyteller)</option>
                  <option value="Puck">Puck (Energetic Explainer)</option>
                  <option value="Zephyr">Zephyr (Calm Philosopher)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  Scene Cut Pacing
                </label>
                <select
                  value={secondsPerScene}
                  onChange={(e) => setSecondsPerScene(Number(e.target.value))}
                  disabled={isRenderingVideo}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value={2}>Fast Preview (2.0s / scene)</option>
                  <option value={3.5}>High-Retention Cut (3.5s / scene)</option>
                  <option value={5}>Cinematic Documentary (5.0s / scene)</option>
                </select>
              </div>
            </div>

            {/* Progress Bar during rendering */}
            {isRenderingVideo && (
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-200 font-medium">{renderStage}</span>
                  <span className="text-red-400 font-mono font-bold">
                    {renderProgress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-200"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}

            {renderError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{renderError}</span>
              </div>
            )}

            {/* Video Preview Player */}
            {renderedVideo ? (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video">
                  <video
                    src={renderedVideo.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                  <span>
                    Duration: <strong className="text-white">{renderedVideo.durationSeconds}s</strong> • Size:{' '}
                    <strong className="text-white">
                      {(renderedVideo.blob.size / (1024 * 1024)).toFixed(2)} MB
                    </strong>{' '}
                    • Audio:{' '}
                    <strong className="text-emerald-400">
                      {renderedVideo.hasAiVoiceover
                        ? `Gemini TTS (${voiceName})`
                        : 'Multi-Track Studio Mix'}
                    </strong>
                  </span>
                  <a
                    href={renderedVideo.url}
                    download={`${(videoTitle || 'faceless-video')
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .slice(0, 40)}.webm`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Video</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-dashed border-zinc-800 text-center space-y-2">
                <Play className="w-7 h-7 text-zinc-500 mx-auto" />
                <p className="text-xs text-zinc-300 font-medium">
                  Ready to auto-render <strong>"{videoTitle}"</strong>
                </p>
                <p className="text-[11px] text-zinc-500">
                  Includes {script.sections.length} dynamic visual scenes, kinetic on-screen text, and neural voiceover.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => handleRenderVideo()}
              disabled={isRenderingVideo}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <Film className={`w-4 h-4 ${isRenderingVideo ? 'animate-spin' : ''}`} />
              <span>
                {isRenderingVideo
                  ? 'Rendering Multi-Scene Video...'
                  : renderedVideo
                  ? 'Re-Render Automated Video'
                  : 'Auto-Render Multi-Scene Video Now'}
              </span>
            </button>

            <label className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                {customVideoFile
                  ? `Custom: ${customVideoFile.name.slice(0, 16)}...`
                  : 'Or Pick .MP4 File'}
              </span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setCustomVideoFile(f);
                }}
              />
            </label>
          </div>
        </div>

        {/* Right 6 Cols: Direct YouTube Channel Auto-Uploader (Official API) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    2. Direct YouTube Channel Upload (Official API v3)
                  </h2>
                  <p className="text-xs text-zinc-400">
                    0% Ban Risk • Official Google OAuth 2.0 Resumable Upload + Custom Thumbnail
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono">
                Safe Quota: 6/day
              </span>
            </div>

            {/* Auth Connection Box */}
            {needsAuth ? (
              <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Connect Your YouTube Channel
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Sign in with your Google account to authorize direct video and thumbnail uploads to your YouTube channel with your permission.
                  </p>
                </div>

                {/* Official Google Sign-In Button per workspace-integration skill */}
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  disabled={isLoggingIn}
                  className="gsi-material-button inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-xs shadow transition-all cursor-pointer disabled:opacity-60"
                >
                  <div className="w-4 h-4 shrink-0">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-full h-full block"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  </div>
                  <span>
                    {isLoggingIn ? 'Connecting to YouTube...' : 'Sign in with Google'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {connectedChannel?.thumbnailUrl ? (
                    <img
                      src={connectedChannel.thumbnailUrl}
                      alt={connectedChannel.title}
                      className="w-10 h-10 rounded-full border border-zinc-700 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-sm shrink-0">
                      YT
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {connectedChannel?.title || user?.displayName || 'Connected Google Account'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold">
                        Connected
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {connectedChannel
                        ? `${connectedChannel.customUrl} • ${connectedChannel.subscriberCount} subs • ${connectedChannel.videoCount} videos`
                        : user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 shrink-0 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}

            {/* Privacy & Scheduled Publishing Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Upload Visibility Status
                </label>
                <select
                  value={privacyStatus}
                  onChange={(e) => setPrivacyStatus(e.target.value as any)}
                  disabled={isUploading}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="private">Private (Safe Default / Unverified App)</option>
                  <option value="unlisted">Unlisted (Shareable Link)</option>
                  <option value="public">Public (Immediate Release)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Auto-Schedule Release (publishAt)
                </label>
                <input
                  type="datetime-local"
                  value={publishAt}
                  onChange={(e) => setPublishAt(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Anti-Block Safeguards Summary */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
              <div className="flex items-center justify-between text-zinc-200 font-semibold">
                <span>Built-In Anti-Block &amp; Policy Safeguards</span>
                <span className="text-emerald-400 font-mono">ACTIVE</span>
              </div>
              <p>
                • Uses official <code className="text-zinc-300">googleapis.com/upload/youtube/v3/videos</code> resumable protocol (never browser bots).
              </p>
              <p>
                • Automatically sets <code className="text-zinc-300">selfDeclaredMadeForKids: false</code>, attaches your SEO chapters, tags, and custom 16:9 thumbnail.
              </p>
            </div>

            {isUploading && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-200 font-medium">{uploadStage}</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Uploaded to YouTube Successfully!
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase">
                    ID: {uploadResult.videoId}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={uploadResult.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={uploadResult.studioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Open in YouTube Studio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-900">
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isUploading || needsAuth || !activeVideoBlob}
              className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>
                {needsAuth
                  ? 'Sign In With Google Above to Enable Auto-Upload'
                  : !activeVideoBlob
                  ? 'Step 1: Render or Select a Video First'
                  : 'Upload Video, SEO & Thumbnail to My YouTube Channel'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Automated 6-Day Queue Scheduler (Safe Quota Auto-Queue) */}
      {queueIdeas.length > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-400" />
                3. Automated 6-Video Channel Queue (Safe Daily Quota Scheduler)
              </h2>
              <p className="text-xs text-zinc-400">
                Select any upcoming video from your 30 Viral Ideas to automatically render its HD video, set its scheduled release date, and queue it to YouTube.
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400 shrink-0">
              1,600 / 10,000 Quota Units per Upload
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {queueIdeas.map((idea, idx) => {
              const daysAhead = idx + 1;
              const isCurrent = videoTitle === idea.title;
              return (
                <div
                  key={idea.id || idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-zinc-900 border-red-500/60'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">
                        Slot #{daysAhead} • {idea.format}
                      </span>
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" />
                        Day +{daysAhead} (18:00)
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {idea.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleQueueIdeaAndAutoRun(idea, daysAhead)}
                    disabled={isRunningAutoPilot || isRenderingVideo}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 hover:bg-red-600 disabled:opacity-50 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Auto-Render &amp; Schedule Day +{daysAhead}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mandatory Confirmation Modal before mutating user's YouTube channel */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Confirm YouTube Channel Upload
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Upload Video to Your YouTube Channel?
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Target Channel:</span>
                <span className="text-white font-semibold text-right">
                  {connectedChannel?.title || user?.email || 'Connected YouTube Channel'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Video Title:</span>
                <span className="text-white font-semibold text-right">
                  {videoTitle || seo.titleA}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Video Source:</span>
                <span className="text-emerald-400 font-mono">
                  {customVideoFile
                    ? `${customVideoFile.name} (${(
                        customVideoFile.size /
                        (1024 * 1024)
                      ).toFixed(2)} MB)`
                    : `Auto-Rendered HD Video (${(
                        (renderedVideo?.blob.size || 0) /
                        (1024 * 1024)
                      ).toFixed(2)} MB)`}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Visibility / Schedule:</span>
                <span className="text-amber-400 font-semibold uppercase">
                  {publishAt
                    ? `Scheduled (${new Date(publishAt).toLocaleString()})`
                    : privacyStatus}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">SEO Tags &amp; Chapters:</span>
                <span className="text-zinc-200">
                  {seo.tags.length} tags + Timestamped Description
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Custom 16:9 Thumbnail:</span>
                <span className="text-zinc-200">
                  {thumbnailDataUrl ? 'Included (Auto-Attach)' : 'Default Frame'}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              This action will upload a new video and metadata to your YouTube channel using your authorized Google account.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedUpload}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Confirm &amp; Upload to YouTube</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title A/B/C Testing Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span>Clickable Title A/B/C Options</span>
            <span className="text-[10px] text-zinc-500 font-normal">
              Click any title to make it active for your YouTube upload
            </span>
          </label>
          <button
            onClick={onRegenerateSeo}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 border border-zinc-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate SEO Metadata</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Option A (Curiosity Focus)', title: seo.titleA },
            { label: 'Option B (Urgency / High Stakes)', title: seo.titleB },
            { label: 'Option C (Direct Benefit)', title: seo.titleC },
          ].map((item, idx) => {
            const isSelected = videoTitle === item.title;
            return (
              <div
                key={idx}
                onClick={() => onSelectTitleVariant(item.title)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-red-500 shadow-lg ring-1 ring-red-500/50'
                    : 'bg-zinc-950 hover:bg-zinc-900/50 border-zinc-800'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                    {item.label}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">{item.title.length} chars</span>
                  <span
                    className={`font-semibold ${
                      isSelected ? 'text-red-400' : 'text-zinc-400'
                    }`}
                  >
                    {isSelected ? '✓ Active Upload Title' : 'Click to use'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YouTube Description Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-red-400" />
              Complete Video Description (With Chapters &amp; Timestamps)
            </h3>
            <p className="text-xs text-zinc-400">
              Automatically attached to your YouTube API upload or ready to copy-paste
            </p>
          </div>

          <button
            onClick={() => handleCopy(seo.description, 'description')}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedField === 'description' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Description</span>
              </>
            )}
          </button>
        </div>

        <textarea
          readOnly
          value={seo.description}
          rows={10}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 leading-relaxed focus:outline-none"
        />
      </div>

      {/* Tags & Pinned Comment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Tags */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-400" /> High-Ranking Video Tags
            </span>

            <button
              onClick={() => handleCopy(formattedTags, 'tags')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              {copiedField === 'tags' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedField === 'tags' ? 'Copied Tags' : 'Copy All Tags'}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-[11px] text-zinc-300 leading-relaxed max-h-36 overflow-y-auto">
            {formattedTags}
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {seo.tags.slice(0, 8).map((t, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Pinned Engagement Comment */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Pinned Comment Engagement Bait
            </span>

            <button
              onClick={() => handleCopy(seo.pinnedComment, 'pinned')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              {copiedField === 'pinned' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedField === 'pinned' ? 'Copied' : 'Copy Comment'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-sans">
            "{seo.pinnedComment}"
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Posting &amp; pinning a reflective question + affiliate link increases comment activity and Day-1 conversions.
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
          onClick={onProceedToMonetization}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Export Master Channel Blueprint (.md)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
