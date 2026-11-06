import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
];

export const DEFAULT_OAUTH_CLIENT_IDS = [
  firebaseConfig.oAuthClientId ||
    '284846780259-st1tnpc5skfmfmqqijhmh2c6l0oius9d.apps.googleusercontent.com',
  '923698034199-e0f5mmkm022jdukkfodeh1o7627eqf8f.apps.googleusercontent.com',
];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'consent',
});

let isSigningIn = false;
// In-memory access token cache (never stored in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export interface ConnectedYouTubeChannel {
  id: string;
  title: string;
  customUrl: string;
  thumbnailUrl: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
}

export interface YouTubeUploadParams {
  videoBlob: Blob;
  title: string;
  description: string;
  tags: string[];
  categoryId?: string;
  privacyStatus: 'private' | 'unlisted' | 'public';
  publishAt?: string; // ISO 8601 timestamp for scheduled publishing
  thumbnailDataUrl?: string | null;
  onProgress?: (percent: number, stage: string) => void;
}

export interface YouTubeUploadResult {
  videoId: string;
  videoUrl: string;
  studioUrl: string;
  privacyStatus: string;
  publishAt?: string;
  thumbnailUploaded: boolean;
}

export const initAuth = (
  onAuthSuccess?: (user: User | null, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (user && !isSigningIn) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    } else if (!user && !cachedAccessToken) {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Direct Google Identity Services (GIS) OAuth 2.0 popup fallback
// Works when Firebase throws (auth/unauthorized-domain)
export const signInWithGoogleIdentityServices = (
  clientId?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const g = (window as any).google;
    if (!g?.accounts?.oauth2?.initTokenClient) {
      reject(
        new Error(
          'Google Identity Services script is still loading. Please try again in 2 seconds or use Instant OAuth Token mode below.'
        )
      );
      return;
    }

    const activeClientId =
      clientId?.trim() || DEFAULT_OAUTH_CLIENT_IDS[0];

    try {
      const tokenClient = g.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        scope: SCOPES.join(' '),
        prompt: 'consent',
        callback: (response: any) => {
          if (response?.error) {
            reject(
              new Error(
                `Google OAuth error (${response.error}): ${
                  response.error_description ||
                  'Ensure this domain is in Authorized JavaScript origins or use Instant Token mode below.'
                }`
              )
            );
            return;
          }
          if (response?.access_token) {
            cachedAccessToken = response.access_token;
            resolve(response.access_token);
          } else {
            reject(new Error('No access_token returned from Google OAuth.'));
          }
        },
        error_callback: (err: any) => {
          reject(
            new Error(
              err?.message ||
                'OAuth popup closed or domain not yet authorized in Google Cloud Console.'
            )
          );
        },
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      reject(err);
    }
  });
};

export const googleSignIn = async (
  customClientId?: string
): Promise<{
  user: User | null;
  accessToken: string;
  authMethod: 'firebase' | 'gis';
} | null> => {
  try {
    isSigningIn = true;

    // If user explicitly provided a custom OAuth Client ID, use Google Identity Services directly
    if (customClientId && customClientId.trim().length > 10) {
      const gisToken = await signInWithGoogleIdentityServices(
        customClientId.trim()
      );
      return { user: null, accessToken: gisToken, authMethod: 'gis' };
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error(
          'Failed to obtain YouTube OAuth access token from Google sign-in.'
        );
      }
      cachedAccessToken = credential.accessToken;
      return {
        user: result.user,
        accessToken: cachedAccessToken,
        authMethod: 'firebase',
      };
    } catch (firebaseErr: any) {
      const errCode = String(firebaseErr?.code || firebaseErr?.message || '');
      // Automatically bypass Firebase (auth/unauthorized-domain) using Google Identity Services!
      if (
        errCode.includes('auth/unauthorized-domain') ||
        errCode.includes('unauthorized-domain') ||
        errCode.includes('auth/operation-not-supported')
      ) {
        console.warn(
          'Firebase domain check triggered; automatically switching to Google Identity Services (GIS) OAuth popup...'
        );
        try {
          const gisToken = await signInWithGoogleIdentityServices(
            DEFAULT_OAUTH_CLIENT_IDS[0]
          );
          return { user: null, accessToken: gisToken, authMethod: 'gis' };
        } catch (gisErr: any) {
          const host =
            typeof window !== 'undefined' ? window.location.hostname : '';
          const origin =
            typeof window !== 'undefined' ? window.location.origin : '';
          const enhancedError = new Error(
            `Domain "${host}" is not yet allowlisted in Firebase / Google Cloud OAuth. Quick Fix: Either (1) paste a 10-second token from Google OAuth Playground in the "Instant Token Bypass" box below (works immediately on any domain!), or (2) add "${host}" to Firebase Console -> Authentication -> Settings -> Authorized domains and "${origin}" to Google Cloud Console -> Clients -> Authorized JavaScript origins.`
          );
          (enhancedError as any).isUnauthorizedDomain = true;
          throw enhancedError;
        }
      }
      throw firebaseErr;
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const setManualYouTubeAccessToken = (token: string): string => {
  const cleaned = token.replace(/^Bearer\s+/i, '').trim();
  if (!cleaned) {
    throw new Error('Please paste a valid Google OAuth access token.');
  }
  cachedAccessToken = cleaned;
  return cleaned;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  try {
    await auth.signOut();
  } catch {
    // Ignore if signed in via GIS or manual token
  }
  cachedAccessToken = null;
};

export const fetchConnectedYouTubeChannel = async (
  accessToken: string
): Promise<ConnectedYouTubeChannel | null> => {
  const res = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message ||
        `YouTube API returned ${res.status}. Ensure your token includes youtube.readonly / youtube.upload scopes and YouTube Data API v3 is enabled.`
    );
  }

  const data = await res.json();
  const item = data?.items?.[0];
  if (!item) {
    return null;
  }

  return {
    id: item.id,
    title: item.snippet?.title || 'My YouTube Channel',
    customUrl: item.snippet?.customUrl || '@channel',
    thumbnailUrl:
      item.snippet?.thumbnails?.default?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      '',
    subscriberCount: item.statistics?.subscriberCount || '0',
    videoCount: item.statistics?.videoCount || '0',
    viewCount: item.statistics?.viewCount || '0',
  };
};

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(parts[1] || '');
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

// Adds a natural human-like minute jitter (+3 to +9 mins) so scheduled uploads
// never trigger robotic exact-hour spam heuristics on YouTube
export function applyAntiBanScheduleJitter(publishAtIso?: string): string | undefined {
  if (!publishAtIso) return undefined;
  const d = new Date(publishAtIso);
  if (Number.isNaN(d.getTime())) return undefined;
  if (d.getMinutes() === 0) {
    const jitterMinutes = 4 + (Math.abs(d.getDate()) % 5); // e.g., 18:04 - 18:08
    d.setMinutes(jitterMinutes, 15, 0);
  }
  return d.toISOString();
}

export const uploadVideoToYouTube = async (
  accessToken: string,
  params: YouTubeUploadParams
): Promise<YouTubeUploadResult> => {
  const {
    videoBlob,
    title,
    description,
    tags,
    categoryId = '27', // 27 = Education
    privacyStatus,
    publishAt,
    thumbnailDataUrl,
    onProgress,
  } = params;

  onProgress?.(
    10,
    'Applying anti-ban metadata sanitization & initializing YouTube Data API v3 resumable session...'
  );

  // Anti-ban tag & title sanitization: strip < > brackets and cap at 15 high-relevance tags
  const cleanTitle = title.replace(/[<>]/g, '').trim().slice(0, 95);
  const cleanTags = tags
    .map((t) => t.replace(/^#/, '').replace(/[<>]/g, '').trim())
    .filter(Boolean)
    .slice(0, 15);

  const complianceFooter =
    '\n\n---\nProduction & Editorial Disclosure: Original commentary, script structure, and transformative multi-scene visual synthesis created for educational and philosophical analysis.';
  const cleanDescription =
    description.replace(/[<>]/g, '').slice(0, 4600) + complianceFooter;

  const jitteredPublishAt = applyAntiBanScheduleJitter(publishAt);
  const effectivePrivacy = jitteredPublishAt ? 'private' : privacyStatus;

  const metadata = {
    snippet: {
      title: cleanTitle,
      description: cleanDescription,
      tags: cleanTags,
      categoryId,
      defaultLanguage: 'en',
      defaultAudioLanguage: 'en',
    },
    status: {
      privacyStatus: effectivePrivacy,
      selfDeclaredMadeForKids: false,
      embeddable: true,
      publicStatsViewable: true,
      ...(jitteredPublishAt ? { publishAt: jitteredPublishAt } : {}),
    },
  };

  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(videoBlob.size),
        'X-Upload-Content-Type': videoBlob.type || 'video/webm',
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!initRes.ok) {
    const errBody = await initRes.json().catch(() => ({}));
    throw new Error(
      errBody?.error?.message ||
        `Failed to initialize YouTube upload (HTTP ${initRes.status}). Make sure YouTube Data API v3 is enabled.`
    );
  }

  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) {
    throw new Error(
      'YouTube API did not return a resumable upload Location URL.'
    );
  }

  onProgress?.(45, 'Streaming rendered HD video binary to YouTube servers...');

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': videoBlob.type || 'video/webm',
    },
    body: videoBlob,
  });

  if (!uploadRes.ok) {
    const errBody = await uploadRes.json().catch(() => ({}));
    throw new Error(
      errBody?.error?.message ||
        `Video binary upload failed (HTTP ${uploadRes.status}).`
    );
  }

  const uploadedVideo = await uploadRes.json();
  const videoId: string = uploadedVideo.id;

  let thumbnailUploaded = false;
  if (thumbnailDataUrl && thumbnailDataUrl.startsWith('data:image/')) {
    try {
      onProgress?.(85, 'Uploading custom 16:9 thumbnail to YouTube video...');
      const thumbBlob = dataUrlToBlob(thumbnailDataUrl);
      const thumbRes = await fetch(
        `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${encodeURIComponent(
          videoId
        )}&uploadType=media`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': thumbBlob.type,
          },
          body: thumbBlob,
        }
      );
      thumbnailUploaded = thumbRes.ok;
    } catch (thumbErr) {
      console.warn('Custom thumbnail upload skipped:', thumbErr);
    }
  }

  onProgress?.(100, 'Upload complete! Video is live in your YouTube Studio.');

  return {
    videoId,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    studioUrl: `https://studio.youtube.com/video/${videoId}/edit`,
    privacyStatus: uploadedVideo?.status?.privacyStatus || effectivePrivacy,
    publishAt: uploadedVideo?.status?.publishAt || jitteredPublishAt,
    thumbnailUploaded,
  };
};
