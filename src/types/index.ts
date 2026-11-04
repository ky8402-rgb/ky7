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

export interface BrandingIdeaItem {
  title: string;
  category: string;
  description: string;
}

export interface SetupChecklistItem {
  id: string;
  category: string;
  task: string;
  whyItMatters: string;
  completed: boolean;
}

export interface ChannelBranding {
  channelNames: ChannelNameOption[];
  selectedNameIndex: number;
  tagline: string;
  valueProposition: string;
  aboutBio: string;
  channelKeywords: string[];
  brandingIdeas: BrandingIdeaItem[];
  setupChecklist: SetupChecklistItem[];
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
  ideaNumber?: number;
  title: string;
  format: 'Long-Form' | 'Shorts' | string;
  targetDuration: string;
  uploadDay: string;
  hook: string;
  concept?: string;
  thumbnailConcept: string;
  predictedCTR: string;
  viralDriver?: 'Trending Topic' | 'High Audience Demand' | 'Extreme Shareability' | string;
  shareabilityScore?: number;
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
  onScreenText?: string;
  editingInstructions?: string;
  soundFX: string;
  voiceover: string;
  patternInterruptNote: string;
}

export interface AiVideoTool {
  name: string;
  category: 'AI Voiceover (No Mic)' | 'AI Visuals & B-Roll (No Camera)' | 'AI Video Editing & Captions' | 'Audio & SFX' | string;
  pricingTier: string;
  bestFor: string;
  workflowTip: string;
}

export interface VideoScript {
  title: string;
  targetLengthMinutes?: number;
  estimatedDuration: string;
  predictedRetention: string;
  fiveSecondHook?: string;
  hookStrategy: string;
  sections: ScriptSection[];
  compellingEnding?: string;
  recommendedAiTools?: AiVideoTool[];
  ttsNarrationSpeed: string;
}

export interface DailyPostingItem {
  day: string;
  format: 'Long-Form Pillar' | 'YouTube Short' | 'Community Poll & Hook' | string;
  whatToPost: string;
  optimizationFocus: string;
}

export interface RetentionTacticItem {
  window: string;
  tactic: string;
  execution: string;
  retentionLift: string;
}

export interface WeeklyPerformanceTarget {
  weekRange: string;
  daysRange: string;
  subscriberTarget: string;
  weeklyViewsTarget: string;
  ctrTarget: string;
  retentionTarget: string;
  cadenceSummary: string;
  primaryFocus: string;
}

export interface AnalyticsPivotRule {
  metricSignal: string;
  threshold: string;
  rootCause: string;
  strategyAdjustment: string;
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
  dailyPostingSchedule?: DailyPostingItem[];
  retentionPlaybook?: RetentionTacticItem[];
  shortsAndLongFormStrategy?: string;
  weeklyTargets?: WeeklyPerformanceTarget[];
  analyticsPivots?: AnalyticsPivotRule[];
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

export interface MonetizationStreamGuide {
  streamName: 'Ad Revenue (YPP)' | 'Affiliate Marketing' | 'Sponsorships' | 'Digital Products' | string;
  dayOneEligible: boolean;
  unlockThreshold: string;
  realisticTimeline: string;
  expectedMarginOrCut: string;
  howToEarn: string;
  executionSteps: string[];
}

export interface WeeklyMonetizationAction {
  week: string;
  days: string;
  focusTitle: string;
  primaryStream: string;
  actionItems: string[];
  milestoneCheck: string;
}

export interface RecommendedOfferItem {
  offerName: string;
  offerType: 'Affiliate Offer' | 'Digital Product (Own)' | 'Sponsor Category' | string;
  priceOrPayout: string;
  targetPainPoint: string;
  integrationAngle: string;
}

export interface PolicyComplianceRule {
  ruleTitle: string;
  riskFlag: string;
  whatGetsRejected: string;
  howToComply: string;
}

export interface MonetizationRoadmapData {
  realisticExpectationNote: string;
  yppTier1Summary: {
    title: string;
    subscribersRequired: number;
    uploadsRequired: string;
    watchHoursOrShorts: string;
    unlockedFeatures: string[];
  };
  yppTier2Summary: {
    title: string;
    subscribersRequired: number;
    watchHoursOrShorts: string;
    complianceRequirements: string[];
    unlockedFeatures: string[];
  };
  revenueStreams: MonetizationStreamGuide[];
  weeklyActionPlan: WeeklyMonetizationAction[];
  recommendedOffers: RecommendedOfferItem[];
  policyComplianceRules: PolicyComplianceRule[];
}

