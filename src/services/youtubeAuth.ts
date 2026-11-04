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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'consent',
});

let isSigningIn = false;
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
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain YouTube OAuth access token from Google sign-in.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
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
        `YouTube API returned ${res.status}. Ensure YouTube Data API v3 is enabled in your Google Cloud project.`
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

  onProgress?.(10, 'Initializing YouTube Data API v3 resumable upload session...');

  const cleanTags = tags
    .map((t) => t.replace(/^#/, '').trim())
    .filter(Boolean)
    .slice(0, 25);

  const effectivePrivacy = publishAt ? 'private' : privacyStatus;

  const metadata = {
    snippet: {
      title: title.slice(0, 100),
      description: description.slice(0, 4900),
      tags: cleanTags,
      categoryId,
      defaultLanguage: 'en',
      defaultAudioLanguage: 'en',
    },
    status: {
      privacyStatus: effectivePrivacy,
      selfDeclaredMadeForKids: false,
      ...(publishAt ? { publishAt: new Date(publishAt).toISOString() } : {}),
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
    throw new Error('YouTube API did not return a resumable upload Location URL.');
  }

  onProgress?.(40, 'Uploading rendered video binary to YouTube servers...');

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

  onProgress?.(100, 'Upload complete! Video is live on your YouTube Studio.');

  return {
    videoId,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    studioUrl: `https://studio.youtube.com/video/${videoId}/edit`,
    privacyStatus: uploadedVideo?.status?.privacyStatus || effectivePrivacy,
    publishAt: uploadedVideo?.status?.publishAt,
    thumbnailUploaded,
  };
};
