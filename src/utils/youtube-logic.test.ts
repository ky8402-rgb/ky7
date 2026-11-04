import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateChannelRevenue,
  evaluateTitleCTR,
  formatYouTubeTags,
  generateVideoChapters,
  validateYouTubeHandle,
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

  // Link clicks: 100000 * 0.01 = 1000 clicks
  // Conversions: 1000 * 0.02 = 20 purchases
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
