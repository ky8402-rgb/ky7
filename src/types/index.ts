export interface NicheItem {
  id: string;
  rank: number;
  name: string;
  category: string;
  tagline: string;
  demandScore: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  estimatedCPM: number;
  viralScore: number;
  monetizationScore: number;
  recommendedForFirst60Days: boolean;
  isTopThree: boolean;
  bestForZeroBudgetReason: string;
  recommendedTools: string[];
  monetizationMethods: string[];
  strategicVerdict: string;
}

export interface ChannelNameOption {
  name: string;
  handle: string;
  rationale: string;
}

export interface ChannelBranding {
  channelNames: ChannelNameOption[];
  selectedNameIndex: number;
  tagline: string;
  valueProposition: string;
  aboutBio: string;
  colorPalette: {
    primary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    mood: string;
  };
  bannerConcept: {
    headlineText: string;
    subText: string;
    uploadBadgeText: string;
    visualDescription: string;
  };
  avatarConcept: {
    description: string;
    lettermark: string;
  };
}

export interface VideoTopic {
  id: string;
  title: string;
  format: 'Long-Form' | 'Shorts' | string;
  targetDuration: string;
  uploadDay: string;
  hook: string;
  thumbnailConcept: string;
  predictedCTR: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  phase: string;
  videos: VideoTopic[];
}

export interface ContentPlan {
  strategy: string;
  targetAudience: string;
  weeks: RoadmapWeek[];
}

export interface ScriptSection {
  sectionName: string;
  timestamp: string;
  durationSeconds: number;
  visualCue: string;
  soundFX: string;
  voiceover: string;
  patternInterruptNote: string;
}

export interface VideoScript {
  title: string;
  estimatedDuration: string;
  predictedRetention: string;
  hookStrategy: string;
  sections: ScriptSection[];
  ttsNarrationSpeed: string;
}

export interface ThumbnailData {
  conceptName: string;
  boldHeadline: string;
  headlineColor: string;
  backgroundColor: string;
  focalElement: string;
  secondaryElement: string;
  midjourneyPrompt: string;
  ctrPsychologyTips: string[];
}

export interface SeoData {
  titleA: string;
  titleB: string;
  titleC: string;
  description: string;
  tags: string[];
  pinnedComment: string;
  hashtags: string[];
}
