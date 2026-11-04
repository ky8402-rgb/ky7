export interface NicheMetrics {
  name: string;
  category: string;
  demandScore: number; // 1-100
  competitionLevel: 'Low' | 'Medium' | 'High';
  estimatedCPM: number; // in USD
  viralScore: number; // 1-100
  monetizationScore: number; // 1-100
  recommendedForFirst60Days?: boolean;
}

export interface RevenueCalculationParams {
  monthlyViews: number;
  cpm: number;
  affiliateClickRatePercent?: number; // e.g. 1.5%
  affiliateConversionPercent?: number; // e.g. 3%
  averageCommissionUsd?: number; // e.g. $25
  sponsorshipPer10kViews?: number; // e.g. $150
}

export interface RevenueBreakdown {
  adSenseRevenue: number;
  affiliateRevenue: number;
  sponsorshipRevenue: number;
  totalMonthlyRevenue: number;
  annualProjectedRevenue: number;
}

/**
 * Calculates estimated revenue breakdown for a YouTube channel
 */
export function calculateChannelRevenue(params: RevenueCalculationParams): RevenueBreakdown {
  const {
    monthlyViews,
    cpm,
    affiliateClickRatePercent = 1.0,
    affiliateConversionPercent = 2.5,
    averageCommissionUsd = 20,
    sponsorshipPer10kViews = 100,
  } = params;

  // YouTube typically pays ~55% of gross CPM (AdSense share)
  const creatorCpm = Math.max(0, cpm * 0.55);
  const adSenseRevenue = Math.round((monthlyViews / 1000) * creatorCpm * 100) / 100;

  // Affiliate: views -> link clicks -> purchases
  const linkClicks = monthlyViews * (affiliateClickRatePercent / 100);
  const conversions = linkClicks * (affiliateConversionPercent / 100);
  const affiliateRevenue = Math.round(conversions * averageCommissionUsd * 100) / 100;

  // Sponsorship rate for channels above 50k monthly views
  const sponsorshipRevenue = monthlyViews >= 30000 
    ? Math.round((monthlyViews / 10000) * sponsorshipPer10kViews * 100) / 100
    : 0;

  const totalMonthlyRevenue = Math.round((adSenseRevenue + affiliateRevenue + sponsorshipRevenue) * 100) / 100;
  const annualProjectedRevenue = Math.round(totalMonthlyRevenue * 12 * 100) / 100;

  return {
    adSenseRevenue,
    affiliateRevenue,
    sponsorshipRevenue,
    totalMonthlyRevenue,
    annualProjectedRevenue,
  };
}

/**
 * Calculates a Title & Thumbnail CTR Viability Score (0-100)
 */
export function evaluateTitleCTR(title: string): {
  score: number;
  strengths: string[];
  recommendations: string[];
} {
  const strengths: string[] = [];
  const recommendations: string[] = [];
  let score = 50;

  const length = title.trim().length;
  if (length >= 35 && length <= 65) {
    score += 15;
    strengths.push('Optimal title length (35-65 chars) for mobile visibility');
  } else if (length < 25) {
    score -= 10;
    recommendations.push('Title is too short; add a curiosity gap or emotional hook');
  } else if (length > 75) {
    score -= 10;
    recommendations.push('Title is over 75 characters and will be truncated on mobile');
  }

  // Check for numbers (psychological specific numbers boost CTR)
  if (/\d+/.test(title)) {
    score += 12;
    strengths.push('Contains specific numbers or lists (increases curiosity by ~20%)');
  } else {
    recommendations.push('Include a specific number (e.g., "7 Secrets", "in 30 Days")');
  }

  // Power & curiosity words
  const powerWords = [
    'secret', 'never', 'hidden', 'exposed', 'truth', 'warning', 'why', 'how', 
    'rule', 'mistake', 'destroy', 'instant', 'genius', 'wealthy', 'billionaire',
    'stopped', 'before', 'lies', 'shocking', 'uncovered'
  ];
  const lowerTitle = title.toLowerCase();
  const matchedPowerWords = powerWords.filter(w => lowerTitle.includes(w));
  if (matchedPowerWords.length > 0) {
    score += Math.min(18, matchedPowerWords.length * 9);
    strengths.push(`Uses psychological power words: "${matchedPowerWords.slice(0, 3).join(', ')}"`);
  } else {
    recommendations.push('Add an emotional trigger or curiosity gap keyword (e.g., "The Truth About", "Never Do This")');
  }

  // Avoid all caps spam, but allow 1 emphasized capitalized word
  const words = title.split(/\s+/);
  const allCapsWords = words.filter(w => w.length >= 3 && w === w.toUpperCase() && !/^\d+$/.test(w));
  if (allCapsWords.length === 1) {
    score += 5;
    strengths.push(`Good visual emphasis on keyword "${allCapsWords[0]}"`);
  } else if (allCapsWords.length > 3) {
    score -= 8;
    recommendations.push('Too many ALL CAPS words can look spammy; keep it to 1 focal word');
  }

  score = Math.min(99, Math.max(20, score));

  return {
    score,
    strengths,
    recommendations,
  };
}

/**
 * Formats YouTube tags from comma-separated list or array into tag string
 */
export function formatYouTubeTags(tags: string[] | string): string {
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .join(', ');
  }
  return tags.map(t => t.trim()).filter(Boolean).join(', ');
}

/**
 * Generates automated YouTube chapters string from script timing blocks
 */
export function generateVideoChapters(sections: { title: string; seconds: number }[]): string {
  let currentTime = 0;
  return sections
    .map(sec => {
      const minutes = Math.floor(currentTime / 60);
      const secs = currentTime % 60;
      const formattedTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      currentTime += sec.seconds;
      return `${formattedTime} - ${sec.title}`;
    })
    .join('\n');
}

/**
 * Validates YouTube handle
 */
export function validateYouTubeHandle(handle: string): { valid: boolean; formatted: string; message: string } {
  let cleaned = handle.trim();
  if (cleaned.startsWith('@')) {
    cleaned = cleaned.slice(1);
  }
  const validRegex = /^[a-zA-Z0-9._-]{3,30}$/;
  if (!validRegex.test(cleaned)) {
    return {
      valid: false,
      formatted: `@${cleaned}`,
      message: 'Handle must be 3-30 characters using letters, numbers, periods, underscores, or hyphens.',
    };
  }
  return {
    valid: true,
    formatted: `@${cleaned}`,
    message: 'Valid YouTube handle available.',
  };
}
