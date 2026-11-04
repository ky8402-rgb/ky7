import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateChannelRevenue,
  evaluateTitleCTR,
  formatYouTubeTags,
  generateVideoChapters,
  validateYouTubeHandle,
  formatChannelKeywords,
  calculateChecklistProgress,
  summarizeVideoIdeas,
  calculateScriptMetrics,
  diagnoseChannelAnalytics,
} from './youtube-logic.js';

test('calculateChannelRevenue calculates AdSense, Affiliate, and Sponsor revenue accurately', () => {
  const result = calculateChannelRevenue({
    monthlyViews: 100000,
    cpm: 12,
    affiliateClickRatePercent: 1.0,
    affiliateConversionPercent: 2.0,
    averageCommissionUsd: 25,
    sponsorshipPer10kViews: 150,
  });

  // creator CPM is 12 * 0.55 = 6.6
  // adSenseRevenue: (100000 / 1000) * 6.6 = 660
  assert.equal(result.adSenseRevenue, 660);

  // Link clicks: 100000 * 1.0% = 1000 clicks
  // Conversions: 1000 * 2.0% = 20 purchases
  // Affiliate revenue: 20 * 25 = 500
  assert.equal(result.affiliateRevenue, 500);

  // Sponsorship revenue: (100000 / 10000) * 150 = 1500
  assert.equal(result.sponsorshipRevenue, 1500);

  // Total: 660 + 500 + 1500 = 2660
  assert.equal(result.totalMonthlyRevenue, 2660);
  assert.equal(result.annualProjectedRevenue, 31920);
});

test('evaluateTitleCTR gives high score for optimal length, numbers, and curiosity power words', () => {
  const highCtr = evaluateTitleCTR('7 Psychological Secrets That Make People RESPECT You Instantly');
  assert.ok(highCtr.score >= 80, `Expected score >= 80, got ${highCtr.score}`);
  assert.ok(highCtr.strengths.length >= 2);

  const lowCtr = evaluateTitleCTR('vlog');
  assert.ok(lowCtr.score < 50, `Expected score < 50, got ${lowCtr.score}`);
  assert.ok(lowCtr.recommendations.length >= 1);
});

test('formatYouTubeTags cleans tags properly', () => {
  const formatted = formatYouTubeTags(['youtube growth', ' faceless video  ', 'ai automation']);
  assert.equal(formatted, 'youtube growth, faceless video, ai automation');

  const formattedStr = formatYouTubeTags('stoicism, dark psychology , viral shorts ');
  assert.equal(formattedStr, 'stoicism, dark psychology, viral shorts');
});

test('generateVideoChapters calculates sequential timestamps correctly', () => {
  const chapters = generateVideoChapters([
    { title: 'The Shocking Truth', seconds: 45 },
    { title: 'The 3-Step Formula', seconds: 120 },
    { title: 'Avoid This Critical Mistake', seconds: 95 },
  ]);

  const lines = chapters.split('\n');
  assert.equal(lines[0], '00:00 - The Shocking Truth');
  assert.equal(lines[1], '00:45 - The 3-Step Formula');
  assert.equal(lines[2], '02:45 - Avoid This Critical Mistake');
});

test('validateYouTubeHandle handles @ and character rules correctly', () => {
  assert.equal(validateYouTubeHandle('@MindsetVaultHQ').valid, true);
  assert.equal(validateYouTubeHandle('Mindset_Vault').valid, true);
  assert.equal(validateYouTubeHandle('ab').valid, false); // too short
  assert.equal(validateYouTubeHandle('invalid name with spaces!').valid, false);
});

test('formatChannelKeywords formats channel keywords and enforces 500 char limit', () => {
  const res = formatChannelKeywords(['stoicism', ' dark psychology ', 'emotional mastery', '']);
  assert.equal(res.commaSeparated, 'stoicism, dark psychology, emotional mastery');
  assert.equal(res.keywordCount, 3);
  assert.equal(res.withinLimit, true);
});

test('calculateChecklistProgress computes accurate completion percentage', () => {
  const items = [
    { completed: true },
    { completed: true },
    { completed: false },
    { completed: false },
  ];
  const stats = calculateChecklistProgress(items);
  assert.equal(stats.completedCount, 2);
  assert.equal(stats.totalCount, 4);
  assert.equal(stats.percentage, 50);
});

test('summarizeVideoIdeas calculates counts, avgShareability, and filters accurately', () => {
  const sampleIdeas = [
    { title: '7 Stoic Rules for Chaos', format: 'Long-Form', viralDriver: 'Trending Topic', shareabilityScore: 96 },
    { title: 'Never React Instantly #Shorts', format: 'Shorts', viralDriver: 'Extreme Shareability', shareabilityScore: 98 },
    { title: 'How to Master Silence', format: 'Long-Form', viralDriver: 'High Audience Demand', shareabilityScore: 91 },
  ];
  const summary = summarizeVideoIdeas(sampleIdeas, { formatFilter: 'Long-Form' });
  assert.equal(summary.totalCount, 3);
  assert.equal(summary.longFormCount, 2);
  assert.equal(summary.shortsCount, 1);
  assert.equal(summary.avgShareability, 95);
  assert.equal(summary.filteredIdeas.length, 2);
});

test('calculateScriptMetrics computes total words, formatted duration, and speaking pace accurately', () => {
  const metrics = calculateScriptMetrics([
    { voiceover: 'One two three four five six seven eight nine ten', durationSeconds: 45 },
    { voiceover: 'Eleven twelve thirteen fourteen fifteen', durationSeconds: 75 },
  ]);
  assert.equal(metrics.totalWords, 15);
  assert.equal(metrics.totalDurationSeconds, 120);
  assert.equal(metrics.formattedDuration, '2:00');
  assert.equal(metrics.avgSceneSeconds, 60);
});

test('diagnoseChannelAnalytics detects CTR and retention bottlenecks and scales 60-day subscriber projections', () => {
  const bottleneck = diagnoseChannelAnalytics({
    ctrPercent: 3.8,
    retention30sPercent: 52,
    avgViewDurationPercent: 36,
    shortsBridgeClickPercent: 1.1,
  });
  assert.equal(bottleneck.overallHealth, 'Bottleneck Detected');
  assert.ok(bottleneck.primaryBottleneck.includes('Click-Through Rate'));
  assert.ok(bottleneck.actionItems.length >= 3);

  const scaling = diagnoseChannelAnalytics({
    ctrPercent: 8.4,
    retention30sPercent: 74,
    avgViewDurationPercent: 55,
    shortsBridgeClickPercent: 3.5,
  });
  assert.equal(scaling.overallHealth, 'Scaling to 50K');
  assert.ok(scaling.projected60DaySubs >= 45000);
});

test('calculateChannelRevenue supports realistic pre-YPP mode (0 AdSense) and digital products', () => {
  const preYpp = calculateChannelRevenue({
    monthlyViews: 15000,
    cpm: 14,
    affiliateClickRatePercent: 1.5,
    affiliateConversionPercent: 3.0,
    averageCommissionUsd: 20,
    digitalProductConversionPercent: 0.1,
    digitalProductPriceUsd: 29,
    yppApproved: false,
  });

  // Pre-YPP should have $0 AdSense and $0 Sponsorship (<30k views), but positive Affiliate & Digital Product income
  assert.equal(preYpp.adSenseRevenue, 0);
  assert.equal(preYpp.sponsorshipRevenue, 0);
  assert.ok(preYpp.affiliateRevenue > 0);
  assert.ok(preYpp.digitalProductRevenue > 0);
  assert.equal(
    preYpp.totalMonthlyRevenue,
    Math.round((preYpp.affiliateRevenue + preYpp.digitalProductRevenue) * 100) / 100
  );
});

