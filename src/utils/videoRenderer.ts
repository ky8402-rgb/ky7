import { VideoScript } from '../types';

export interface RenderVideoOptions {
  script: VideoScript;
  channelName: string;
  thumbnailDataUrl?: string | null;
  voiceName?: 'Kore' | 'Charon' | 'Fenrir' | 'Puck' | 'Zephyr';
  secondsPerScene?: number;
  onProgress?: (percent: number, stage: string) => void;
}

export interface RenderedVideoOutput {
  blob: Blob;
  url: string;
  durationSeconds: number;
  mimeType: string;
  hasAiVoiceover: boolean;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const testLine = current ? `${current} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = testLine;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function renderAutomatedFacelessVideo(
  options: RenderVideoOptions
): Promise<RenderedVideoOutput> {
  const {
    script,
    channelName,
    thumbnailDataUrl,
    voiceName = 'Charon',
    secondsPerScene = 3.5,
    onProgress,
  } = options;

  const scenes = script.sections.length > 0 ? script.sections.slice(0, 6) : [];
  const totalDurationSec = Math.max(8, scenes.length * secondsPerScene);

  onProgress?.(5, `Requesting AI neural voiceover (${voiceName}) from Gemini TTS...`);

  let hasAiVoiceover = false;
  let audioBase64: string | null = null;

  try {
    const narrationText = scenes
      .map((s) => s.voiceover)
      .join(' ')
      .slice(0, 750);

    const res = await fetch('/api/youtube/generate-voiceover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: narrationText,
        voiceName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.audioBase64) {
        audioBase64 = data.audioBase64;
        hasAiVoiceover = true;
      }
    }
  } catch (err) {
    console.warn('AI TTS fallback to ambient studio audio track:', err);
  }

  onProgress?.(22, 'Preparing 1280x720 HD canvas & multi-scene compositor...');

  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D rendering context.');
  }

  let bgImage: HTMLImageElement | null = null;
  if (thumbnailDataUrl) {
    bgImage = await new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = thumbnailDataUrl;
    });
  }

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();

  let actualDurationMs = totalDurationSec * 1000;

  if (audioBase64) {
    try {
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decodedBuffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
      const voiceSource = audioCtx.createBufferSource();
      voiceSource.buffer = decodedBuffer;
      voiceSource.connect(dest);
      voiceSource.start(0);
      actualDurationMs = Math.min(
        Math.max(decodedBuffer.duration * 1000, 8000),
        35000
      );
    } catch (decodeErr) {
      console.warn('Could not decode WAV buffer, using ambient synth:', decodeErr);
      hasAiVoiceover = false;
    }
  }

  // Subtle -22dB ambient pad underneath for anti-"Reused Content" multi-track audio depth
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(110, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
  osc.connect(gain);
  gain.connect(dest);
  osc.start();

  const canvasStream = canvas.captureStream(30);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  const supportedMimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  const chosenMimeType =
    supportedMimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || 'video/webm';

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(combinedStream, {
    mimeType: chosenMimeType,
    videoBitsPerSecond: 2_500_000,
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const recordingFinished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: chosenMimeType }));
    };
  });

  recorder.start(200);
  const startTime = performance.now();
  const sceneCount = Math.max(1, scenes.length);
  const msPerScene = actualDurationMs / sceneCount;

  const scenePalettes = [
    ['#09090b', '#1e1b4b', '#dc2626'],
    ['#09090b', '#172554', '#f59e0b'],
    ['#09090b', '#064e3b', '#10b981'],
    ['#09090b', '#3b0764', '#ec4899'],
    ['#09090b', '#450a0a', '#f97316'],
    ['#09090b', '#0f172a', '#38bdf8'],
  ];

  await new Promise<void>((resolve) => {
    const drawFrame = () => {
      const elapsed = performance.now() - startTime;
      const progressRatio = Math.min(1, elapsed / actualDurationMs);
      const currentSceneIdx = Math.min(
        sceneCount - 1,
        Math.floor(elapsed / msPerScene)
      );
      const sceneProgress = (elapsed % msPerScene) / msPerScene;
      const currentScene = scenes[currentSceneIdx] || {
        sectionName: 'Hook',
        timestamp: '0:00',
        durationSeconds: 10,
        visualCue: script.title,
        voiceover: script.fiveSecondHook || script.title,
        onScreenText: script.title.slice(0, 32).toUpperCase(),
        editingInstructions: 'Ken Burns slow zoom',
        soundFX: 'Sub-bass riser',
        patternInterruptNote: 'Zoom cut',
      };

      const palette = scenePalettes[currentSceneIdx % scenePalettes.length];

      // 1. Dynamic Ken Burns Background
      ctx.save();
      const zoom = 1.0 + sceneProgress * 0.08;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      if (bgImage) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(9, 9, 11, 0.78)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createRadialGradient(
          canvas.width * (0.3 + sceneProgress * 0.4),
          canvas.height * 0.35,
          60,
          canvas.width * 0.5,
          canvas.height * 0.5,
          canvas.width * 0.85
        );
        grad.addColorStop(0, palette[1]);
        grad.addColorStop(1, palette[0]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.restore();

      // Subtle architectural grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 80; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // 2. Top Studio Header Bar
      ctx.fillStyle = 'rgba(9, 9, 11, 0.75)';
      ctx.fillRect(48, 36, canvas.width - 96, 56);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(48, 36, canvas.width - 96, 56);

      ctx.fillStyle = palette[2];
      ctx.fillRect(48, 36, 8, 56);

      ctx.font = 'bold 18px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${channelName.toUpperCase()}  •  SCENE ${currentSceneIdx + 1}/${sceneCount} (${currentScene.sectionName.toUpperCase()})`,
        74,
        70
      );

      ctx.font = '600 16px JetBrains Mono, monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.textAlign = 'right';
      ctx.fillText(currentScene.timestamp, canvas.width - 68, 70);

      // 3. Center Kinetic On-Screen Text Callout (Transformative Visual Compliance)
      const badgeText = (currentScene.onScreenText || currentScene.sectionName).toUpperCase();
      ctx.font = '900 46px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = palette[2];
      ctx.fillText(badgeText, canvas.width / 2, 235);

      // 4. Burned-In Dynamic Narration Subtitles Box
      ctx.fillStyle = 'rgba(9, 9, 11, 0.86)';
      ctx.fillRect(100, 300, canvas.width - 200, 260);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(100, 300, canvas.width - 200, 260);

      ctx.font = '600 28px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#f4f4f5';
      const wrappedLines = wrapCanvasText(
        ctx,
        `"${currentScene.voiceover}"`,
        canvas.width - 280
      ).slice(0, 4);

      wrappedLines.forEach((line, idx) => {
        ctx.fillText(line, canvas.width / 2, 365 + idx * 46);
      });

      // 5. Visual Direction Subtitle Footer
      ctx.font = '500 16px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#a1a1aa';
      const visualPreview =
        currentScene.visualCue.length > 95
          ? `${currentScene.visualCue.slice(0, 95)}...`
          : currentScene.visualCue;
      ctx.fillText(`Visual Scene: ${visualPreview}`, canvas.width / 2, 620);

      // 6. Bottom Progress Bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(48, canvas.height - 42, canvas.width - 96, 10);
      ctx.fillStyle = palette[2];
      ctx.fillRect(
        48,
        canvas.height - 42,
        (canvas.width - 96) * progressRatio,
        10
      );

      const pct = Math.min(98, Math.round(25 + progressRatio * 73));
      onProgress?.(
        pct,
        `Rendering Scene ${currentSceneIdx + 1} of ${sceneCount} (${Math.round(
          progressRatio * 100
        )}%)...`
      );

      if (elapsed < actualDurationMs) {
        requestAnimationFrame(drawFrame);
      } else {
        osc.stop();
        recorder.stop();
        audioCtx.close().catch(() => {});
        resolve();
      }
    };

    requestAnimationFrame(drawFrame);
  });

  const finalBlob = await recordingFinished;
  const url = URL.createObjectURL(finalBlob);

  onProgress?.(100, '1080p/720p Multi-Scene Video Render Complete!');

  return {
    blob: finalBlob,
    url,
    durationSeconds: Math.round(actualDurationMs / 1000),
    mimeType: chosenMimeType,
    hasAiVoiceover,
  };
}
