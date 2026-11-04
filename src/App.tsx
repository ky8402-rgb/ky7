/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  NicheItem, 
  ChannelBranding, 
  ContentPlan, 
  VideoScript, 
  ThumbnailData, 
  SeoData,
  VideoTopic
} from './types';
import { Navbar } from './components/Navbar';
import { NicheStep } from './components/NicheStep';
import { BrandingStep } from './components/BrandingStep';
import { ContentPlanStep } from './components/ContentPlanStep';
import { ScriptStep } from './components/ScriptStep';
import { ThumbnailStep } from './components/ThumbnailStep';
import { SeoStep } from './components/SeoStep';
import { MonetizationStep } from './components/MonetizationStep';
import { BlueprintModal } from './components/BlueprintModal';
import { ExportModal } from './components/ExportModal';

// Initial Starter State
const INITIAL_NICHES: NicheItem[] = [
  {
    id: 'niche-1',
    rank: 1,
    name: 'Stoic Life Psychology & Dark Mindset Lessons',
    category: 'Self-Improvement / Philosophy',
    tagline: 'Ancient wisdom applied to modern mental warfare and emotional mastery.',
    demandScore: 96,
    competitionLevel: 'Medium',
    estimatedCPM: 14.50,
    viralScore: 94,
    monetizationScore: 92,
    recommendedForFirst60Days: true,
    isTopThree: true,
    bestForZeroBudgetReason: 'Requires only AI-generated statue art, royalty-free ambient music, and free TTS narration. Very high retention and binge factor.',
    recommendedTools: ['CapCut (Free transitions)', 'ElevenLabs or Browser TTS', 'Leonardo.ai (Free Marcus Aurelius renders)', 'Pixabay Ambient Music'],
    monetizationMethods: ['High AdSense CPM ($12-$18)', 'Affiliate books/journals', 'Digital Stoic Notion Planners ($19)'],
    strategicVerdict: 'Top recommended pick for first 60 days. Massive curiosity loops, repeatable templated editing, rapid audience emotional connection.'
  },
  {
    id: 'niche-2',
    rank: 2,
    name: 'Luxury Crimes & Billionaire Scams Documentaries',
    category: 'Business / True Crime',
    tagline: 'Investigating how high-society titans built and lost illicit empires.',
    demandScore: 93,
    competitionLevel: 'Low',
    estimatedCPM: 22.00,
    viralScore: 91,
    monetizationScore: 88,
    recommendedForFirst60Days: false,
    isTopThree: true,
    bestForZeroBudgetReason: 'Utilizes public domain court sketches, news clippings, stock footage, and deep-dive public records without filming.',
    recommendedTools: ['Pexels / Wikimedia Commons', 'Clipchamp or DaVinci Resolve', 'Free Sound FX libraries'],
    monetizationMethods: ['Top-tier finance/business CPM ($20-$35)', 'VPN and Security sponsorships', 'Audible/Audiobook affiliates'],
    strategicVerdict: 'Rank #2. Outstanding CPM and viewer demographics (US/UK/Canada business audience) with massive watch hours.'
  },
  {
    id: 'niche-3',
    rank: 3,
    name: 'AI Automation & No-Code Business Systems',
    category: 'Technology & Productivity',
    tagline: 'Practical blueprints to automate workflows and launch micro-businesses using AI tools.',
    demandScore: 90,
    competitionLevel: 'Medium',
    estimatedCPM: 26.50,
    viralScore: 86,
    monetizationScore: 98,
    recommendedForFirst60Days: false,
    isTopThree: true,
    bestForZeroBudgetReason: 'Can be demonstrated using screen recordings of free web tools, animated flowcharts, and clear software tutorials.',
    recommendedTools: ['OBS Studio (Free screen capture)', 'Canva Free (Diagrams)', 'CapCut (Auto captions)'],
    monetizationMethods: ['Highest SaaS affiliate commissions (30-50% recurring)', 'Prompt bundles & templates', 'Direct software sponsorships'],
    strategicVerdict: 'Rank #3. Highest monetization potential per view via recurring SaaS referral commissions.'
  },
  {
    id: 'niche-4',
    rank: 4,
    name: 'Historical Mysteries & Forgotten Civilizations',
    category: 'History & Education',
    tagline: 'Unearthing strange archaeological finds and bizarre historical anomalies.',
    demandScore: 89,
    competitionLevel: 'Medium',
    estimatedCPM: 11.20,
    viralScore: 93,
    monetizationScore: 80,
    recommendedForFirst60Days: false,
    isTopThree: false,
    bestForZeroBudgetReason: 'Historic maps, public archive photos, and generative AI illustrations build immersive visual lore.',
    recommendedTools: ['Library of Congress archive', 'Midjourney / Stable Diffusion', 'Freesound.org atmospheric audio'],
    monetizationMethods: ['AdSense binge watch sessions', 'History/Archaeology book affiliates', 'Merchandise'],
    strategicVerdict: 'Phenomenal click-through rates and high global fascination with forgotten ancient relics.'
  },
  {
    id: 'niche-5',
    rank: 5,
    name: 'Frugal Millionaire Habits & Personal Finance Hacks',
    category: 'Finance / Wealth',
    tagline: 'Real wealth building lessons from stealth wealth millionaires and behavioral economics.',
    demandScore: 88,
    competitionLevel: 'High',
    estimatedCPM: 24.00,
    viralScore: 84,
    monetizationScore: 94,
    recommendedForFirst60Days: false,
    isTopThree: false,
    bestForZeroBudgetReason: 'Uses animated typography, text bullet overlays, and clean graphical illustrations.',
    recommendedTools: ['Canva Free templates', 'CapCut Auto-Captions', 'Spreadsheet screen mockups'],
    monetizationMethods: ['Finance app affiliates', 'Budgeting spreadsheet templates', 'High CPM AdSense'],
    strategicVerdict: 'Evergreen search volume with year-round advertiser bidding.'
  },
  {
    id: 'niche-6',
    rank: 6,
    name: 'Deep Sleep Ambient Stories & Soundscapes',
    category: 'Health & Relaxation',
    tagline: 'Hypnotic sleep stories, rain sounds, and restorative 432Hz sleep journeys.',
    demandScore: 92,
    competitionLevel: 'High',
    estimatedCPM: 8.50,
    viralScore: 80,
    monetizationScore: 78,
    recommendedForFirst60Days: false,
    isTopThree: false,
    bestForZeroBudgetReason: 'Long 3-8 hour loopable audio and slow-panning calming AI imagery.',
    recommendedTools: ['Audacity (Free audio looping)', 'Free stock ambient sound generators', 'Slow pan video loops'],
    monetizationMethods: ['Massive watch hour accumulation for 4,000 hr YPP requirement', 'Sleep mask and mattress affiliates'],
    strategicVerdict: 'Fastest path to 4,000 watch hours required for YouTube Partner Program.'
  },
  {
    id: 'niche-7',
    rank: 7,
    name: 'Space Anomalies & Cosmic Phenomena Explanations',
    category: 'Science & Astronomy',
    tagline: 'Terrifying facts about black holes, cosmic horizons, and deep space exploration.',
    demandScore: 87,
    competitionLevel: 'Low',
    estimatedCPM: 10.50,
    viralScore: 95,
    monetizationScore: 76,
    recommendedForFirst60Days: false,
    isTopThree: false,
    bestForZeroBudgetReason: 'NASA and ESA provide 100% free, high-resolution public domain footage, images, and telescope data.',
    recommendedTools: ['NASA Image & Video Library (Free public domain)', 'CapCut', 'Dramatic synth soundtracks'],
    monetizationMethods: ['YouTube AdSense', 'Telescope & STEM learning affiliates', 'Science print merchandise'],
    strategicVerdict: 'Zero copyright issues using NASA official public archive footage with viral YouTube Shorts potential.'
  },
  {
    id: 'niche-8',
    rank: 8,
    name: 'Psychological Brain Teasers & Detective Riddles',
    category: 'Gaming / Trivia',
    tagline: 'Interactive 30-second mysteries that test viewer IQ and deductive reasoning.',
    demandScore: 85,
    competitionLevel: 'Medium',
    estimatedCPM: 9.00,
    viralScore: 97,
    monetizationScore: 72,
    recommendedForFirst60Days: false,
    isTopThree: false,
    bestForZeroBudgetReason: 'Simple 2D illustrated crime scene puzzles with ticking countdown timers.',
    recommendedTools: ['Canva Free puzzle templates', 'Clock sound effects', 'CapCut keyframing'],
    monetizationMethods: ['Viral YouTube Shorts monetization', 'Mobile game sponsorships', 'Board game affiliates'],
    strategicVerdict: 'Insane audience engagement and comment-section debate driving YouTube algorithm push.'
  },
  {
    id: 'niche-9',
    rank: 9,
    name: 'Biographies of Shadow Icons & Military Tacticians',
    category: 'Documentary / History',
    tagline: 'The psychological breakdowns of ruthless strategists, spies, and military minds.',
    demandScore: 86,
    competitionLevel: 'Low',
    estimatedCPM: 15.00,
    viralScore: 89,
    monetizationScore: 84,
    recommendedForFirst60Days: false,
    isTopThree: false,
    bestForZeroBudgetReason: 'Historical portraits, animated military maps, and atmospheric narrative pacing.',
    recommendedTools: ['Historical map archives', 'Ken Burns effect panning in CapCut', 'Dark cinematic audio'],
    monetizationMethods: ['Strategy book affiliates', 'VPN & History stream sponsorships', 'High male demographic AdSense'],
    strategicVerdict: 'Cult following with high viewer retention (50%+ average percentage viewed).'
  },
  {
    id: 'niche-10',
    rank: 10,
    name: 'Top 10 Mega-Engineering Marvels & Urban Megaprojects',
    category: 'Architecture & Tech',
    tagline: 'How the worlds most insane tunnels, bridges, and futuristic cities were built.',
    demandScore: 84,
    competitionLevel: 'Low',
    estimatedCPM: 18.00,
    viralScore: 88,
    monetizationScore: 82,
    recommendedForFirst60Days: false,
    isTopThree: false,
    bestForZeroBudgetReason: 'Government project renders, satellite imagery from Google Earth Studio, and structural blueprints.',
    recommendedTools: ['Google Earth Studio (Free for YouTube)', 'Wikimedia blueprints', 'Infographic overlays'],
    monetizationMethods: ['Engineering tool sponsorships', 'Architecture course affiliates', 'High global CPM'],
    strategicVerdict: 'Visual eye-candy with wide international curiosity appeal across all age demographics.'
  }
];

const INITIAL_BRANDING: ChannelBranding = {
  channelNames: [
    { name: 'Mindset Vault', handle: '@MindsetVaultHQ', rationale: 'Authoritative, memorable, and evokes protected deep psychological secrets.' },
    { name: 'Stoic Odyssey', handle: '@StoicOdysseyOfficial', rationale: 'Evokes a transformative heroic journey of the mind.' },
    { name: 'Iron Will Philosophy', handle: '@IronWillWisdom', rationale: 'Strong, impactful keyword with high search volume.' },
    { name: 'The Silent Thinker', handle: '@TheSilentThinkerTV', rationale: 'Mysterious and intriguing for faceless commentary.' },
    { name: 'Apex Mentality', handle: '@ApexMentalityAI', rationale: 'Positioned for high-performance self-mastery.' }
  ],
  selectedNameIndex: 0,
  tagline: 'Master Your Mind Before The World Masters You.',
  valueProposition: 'Unlocking ancient stoic frameworks and psychological mental models to build unshakable discipline, emotional control, and quiet power in under 10 minutes a day.',
  aboutBio: 'Welcome to Mindset Vault — your premier archive for timeless stoic philosophy, dark psychology breakdowns, and deep mindset reprogramming. We deconstruct the cognitive secrets of history\'s most resilient figures into actionable, high-retention visual lessons. \n\n🎯 Upload Schedule: New deep dive every Tuesday & Friday at 2 PM EST.\n💼 Business & Sponsorship Inquiries: contact@mindsetvault.com\n\nSubscribe to fortify your mind and join our community of disciplined thinkers.',
  channelKeywords: [
    'stoicism',
    'stoic philosophy',
    'dark psychology',
    'emotional mastery',
    'mental toughness',
    'marcus aurelius meditations',
    'epictetus wisdom',
    'self discipline habits',
    'how to control emotions',
    'psychological tricks',
    'mindset reprogramming',
    'silent power',
    'unshakable confidence',
    'ancient wisdom modern life',
    'faceless philosophy channel'
  ],
  brandingIdeas: [
    {
      title: 'Chiaroscuro Marble & Gold Visual Signature',
      category: 'Visual Motif',
      description: 'Use high-contrast obsidian backgrounds with warm golden rim-lighting on classical Roman/Greek busts so viewers recognize your videos in the feed before reading the channel name.'
    },
    {
      title: 'Calm Baritone Authority Narration',
      category: 'Voice Persona',
      description: 'Pair a deep, measured baritone TTS voice at 1.05x speed with subtle room reverb and a 40Hz sub-bass drone during hook questions to create immediate psychological gravity.'
    },
    {
      title: '2-Word High-Contrast Yellow/White Thumbnail Rule',
      category: 'Thumbnail Identity',
      description: 'Never exceed 2-3 words on thumbnails. Place bold uppercase sans-serif text on the left third with a single focal statue or silhouette on the right third.'
    },
    {
      title: 'The "3-Second Biological Freeze" Cold Open',
      category: 'Competitor Differentiation',
      description: 'Eliminate channel intro logos completely. Start every video with a visceral real-world conflict scenario and a neurological or historical twist within the first 5 seconds.'
    }
  ],
  setupChecklist: [
    {
      id: 'chk-1',
      category: 'Account & Security',
      task: 'Create a dedicated Brand Account & enable 2-Step Verification + Intermediate/Advanced YouTube Features via phone verification',
      whyItMatters: 'Unlocks custom thumbnails, videos longer than 15 minutes, external links in descriptions, and higher daily upload limits immediately.',
      completed: true
    },
    {
      id: 'chk-2',
      category: 'Visual Identity',
      task: 'Upload 800x800px high-contrast Avatar & 2560x1440px Banner keeping all text inside the 1546x423px mobile safe zone',
      whyItMatters: '72% of faceless channel traffic is on mobile; cropped banners immediately signal an amateur channel and lower subscriber conversion.',
      completed: true
    },
    {
      id: 'chk-3',
      category: 'SEO & Discovery',
      task: 'Paste your 15 targeted Channel Keywords into YouTube Studio > Settings > Channel > Basic Info & set Channel Country to Tier-1 (US/UK)',
      whyItMatters: 'Trains YouTube\'s initial recommendation classifier on who your ideal viewer is before you even have watch-history data.',
      completed: false
    },
    {
      id: 'chk-4',
      category: 'SEO & Discovery',
      task: 'Publish your keyword-rich "About" Description with upload schedule in the first 150 characters + business inquiry email',
      whyItMatters: 'YouTube & Google index the first 150 characters as your channel meta description, while sponsors filter channels by visible contact emails.',
      completed: false
    },
    {
      id: 'chk-5',
      category: 'Conversion & Layout',
      task: 'Configure a 150x150px transparent "Subscribe" Branding Watermark set to display across the "Entire Video"',
      whyItMatters: 'Adds a persistent 1-click subscribe button on desktop fullscreen views, boosting passive subscriber conversion by 8-14%.',
      completed: false
    },
    {
      id: 'chk-6',
      category: 'Upload Defaults',
      task: 'Set YouTube Studio Upload Defaults: Category ("Education" or "People & Blogs"), Video Language (English), Comments ("Hold potentially inappropriate")',
      whyItMatters: 'Saves 10 minutes per upload and ensures consistent algorithmic categorization across every video.',
      completed: false
    },
    {
      id: 'chk-7',
      category: 'Competitor Edge',
      task: 'Create 3 themed Playlists ("Stoic Mental Armor", "Dark Psychology Decoded", "Silent Discipline") and feature them on the Channel Home tab',
      whyItMatters: 'Turns single-video viewers into multi-video binge sessions—the #1 signal YouTube uses to push small channels to the Browse page.',
      completed: false
    }
  ],
  colorPalette: {
    primary: '#0F172A',
    accent: '#EAB308',
    background: '#020617',
    card: '#1E293B',
    text: '#F8FAFC',
    mood: 'Dark Cinematic & Regal Gold'
  },
  bannerConcept: {
    headlineText: 'BUILD AN UNSHAKABLE MIND',
    subText: 'Ancient Philosophy • Modern Psychology • Daily Discipline',
    uploadBadgeText: 'NEW VIDEOS EVERY TUESDAY & FRIDAY',
    visualDescription: 'Dark textured marble background with a golden cracked Roman bust of Marcus Aurelius on the right side, dramatic rim lighting in gold, clean bold typography in center safe zone.'
  },
  avatarConcept: {
    description: 'Minimalist golden Spartan/Roman helmet silhouette on a deep obsidian black circular background with a subtle ambient gold rim glow.',
    lettermark: 'MV'
  }
};

const INITIAL_CONTENT_PLAN: ContentPlan = {
  strategy: 'The 60-Day Momentum Ladder: 2 Long-form cornerstone videos per week + 3 YouTube Shorts for algorithmic cross-pollination.',
  targetAudience: 'Ambitious 18-35 year-old professionals, students, and self-improvers seeking emotional resilience and competitive mental advantages.',
  weeks: [
    {
      weekNumber: 1,
      phase: 'Algorithmic Seeding & Core Proof',
      videos: [
        {
          id: 'w1-v1',
          title: '7 Psychological Habits That Make You Unfazed by Disrespect',
          format: 'Long-Form',
          targetDuration: '9:40',
          uploadDay: 'Tuesday',
          hook: 'Open with a scene of public confrontation and the 3-second biological freeze rule.',
          thumbnailConcept: 'Split screen: Cluttered agitated brain vs calm marble statue with gold eye glow.',
          predictedCTR: '11.8%'
        },
        {
          id: 'w1-v2',
          title: 'The Dark Psychology of Quiet People (Why Everyone FEARS Them)',
          format: 'Long-Form',
          targetDuration: '10:15',
          uploadDay: 'Friday',
          hook: 'Why high-status individuals speak 40% slower than the average person.',
          thumbnailConcept: 'Silhouette in shadow with intense amber rim light and bold text "DO NOT TALK".',
          predictedCTR: '13.4%'
        },
        {
          id: 'w1-s1',
          title: 'Never React Instantly: The Marcus Aurelius Rule #Shorts',
          format: 'Shorts',
          targetDuration: '0:48',
          uploadDay: 'Wednesday',
          hook: 'If someone insults you, say this one sentence and walk away.',
          thumbnailConcept: 'Statue face zoomed in with red alert border.',
          predictedCTR: '15.0%'
        }
      ]
    },
    {
      weekNumber: 2,
      phase: 'Curiosity Loops & Contrarian Takes',
      videos: [
        {
          id: 'w2-v1',
          title: 'Why 99% of People Fail Stoicism (The Comfort Trap Exposed)',
          format: 'Long-Form',
          targetDuration: '8:55',
          uploadDay: 'Tuesday',
          hook: 'You read Meditations and still got angry yesterday. Heres the missing neurological step.',
          thumbnailConcept: 'Broken classical pillar with red X mark and text "THE BIG LIE".',
          predictedCTR: '10.9%'
        },
        {
          id: 'w2-v2',
          title: 'How to Disappear for 6 Months and Return UNRECOGNIZABLE',
          format: 'Long-Form',
          targetDuration: '11:20',
          uploadDay: 'Friday',
          hook: 'The solitary monk protocol used by Silicon Valley founders and ancient generals.',
          thumbnailConcept: 'Man walking into foggy obsidian mountain with glowing pathway.',
          predictedCTR: '14.2%'
        }
      ]
    },
    {
      weekNumber: 3,
      phase: 'High-Retention Deep Dives',
      videos: [
        {
          id: 'w3-v1',
          title: 'The Art of Not Caring: How to Turn Off Anxiety in 60 Seconds',
          format: 'Long-Form',
          targetDuration: '9:10',
          uploadDay: 'Tuesday',
          hook: 'The physiological sigh combined with Epictetus dichotomy of control.',
          thumbnailConcept: 'Glowing brain diagram highlighting amygdala shutdown.',
          predictedCTR: '12.5%'
        },
        {
          id: 'w3-v2',
          title: '5 Warning Signs Someone Is Silently Manipulating You',
          format: 'Long-Form',
          targetDuration: '10:45',
          uploadDay: 'Friday',
          hook: 'The insidious tactic called conversational shifting.',
          thumbnailConcept: 'Puppet strings descending onto shadowed human figure.',
          predictedCTR: '13.8%'
        }
      ]
    },
    {
      weekNumber: 4,
      phase: 'Binge-Watching Trigger & Series Launch',
      videos: [
        {
          id: 'w4-v1',
          title: 'The Law of Detachment: Why Needing Nothing Gives You Everything',
          format: 'Long-Form',
          targetDuration: '10:30',
          uploadDay: 'Tuesday',
          hook: 'The paradox of pursuit: why chasing approval repels it.',
          thumbnailConcept: 'Open empty hand catching starlight with text "LET GO".',
          predictedCTR: '11.5%'
        },
        {
          id: 'w4-v2',
          title: '10 Rules of Power The 1% Teach Their Children (Never in School)',
          format: 'Long-Form',
          targetDuration: '12:40',
          uploadDay: 'Friday',
          hook: 'Rule number one: Information asymmetry is the only real currency.',
          thumbnailConcept: 'Gold vault door cracked open revealing intense warm glow.',
          predictedCTR: '15.1%'
        }
      ]
    }
  ]
};

const INITIAL_SCRIPT: VideoScript = {
  title: '7 Psychological Habits That Make You Unfazed by Disrespect',
  estimatedDuration: '8:45',
  predictedRetention: '64%',
  hookStrategy: 'Immediate high-stakes visual confrontation within 3 seconds, delaying the channel name until 2 minutes in.',
  sections: [
    {
      sectionName: '0:00 - 0:15 The 3-Second Visual Freeze Hook',
      timestamp: '00:00',
      durationSeconds: 15,
      visualCue: '[B-ROLL: Slow-motion close-up of a shattered Greek marble statue falling in reverse. High-contrast black and gold rim lighting.]',
      soundFX: '[SFX: Low bass rumble followed by an abrupt ticking clock silence.]',
      voiceover: 'When someone insults you in public, your heart beats 140 times a minute. Most people either explode in anger or freeze in shame. But the most dangerous people in history do neither. They use a three-second neurological trick that makes the attacker look foolish without uttering a single curse word.',
      patternInterruptNote: 'Cut to text on screen: "THE 3-SECOND RULE" with a gold pulse.'
    },
    {
      sectionName: '0:15 - 0:45 The Agitation & Curiosity Gap',
      timestamp: '00:15',
      durationSeconds: 30,
      visualCue: '[B-ROLL: Cinematic footage of modern city rain and solitary figure walking through shadows. Rapid 1.5s cuts.]',
      soundFX: '[SFX: Cinematic ambient synth swell and distant thunder.]',
      voiceover: 'Notice how when you get defensive, you instantly surrender your power. You hand them the emotional remote control to your life. Today, you are going to learn the seven psychological behaviors of people who are psychologically untouchable. Habit number four will completely invert how you handle conflict forever.',
      patternInterruptNote: 'Quick zoom-in transition with whoosh effect.'
    },
    {
      sectionName: '0:45 - 2:30 Habit 1: The Tactical Silence Pause',
      timestamp: '00:45',
      durationSeconds: 105,
      visualCue: '[B-ROLL: Roman bust of Marcus Aurelius standing immovable amidst heavy storm winds. Camera slowly dollies in.]',
      soundFX: '[SFX: Sub-bass drone, heartbeat monitor slowing down.]',
      voiceover: 'Habit number one: The Tactical Silence. When someone throws an insult or passive-aggressive barb, our primitive amygdala screams at us to defend our reputation. Instead, look them directly into their left eye, remain completely expressionless, and count to four in your mind. Psychologists call this the "vacuum effect". In silence, the attacker is forced to hear their own disrespect echo in the room, making them look desperate and unstable.',
      patternInterruptNote: 'Split-screen graphic showing Amygdala vs Prefrontal Cortex activation.'
    },
    {
      sectionName: '2:30 - 4:15 Habit 2: Agree and Amplify',
      timestamp: '02:30',
      durationSeconds: 105,
      visualCue: '[B-ROLL: Chess board macro shot with pawn knocking down king. Golden hour backlight.]',
      soundFX: '[SFX: Crisp chess piece sliding sound followed by subtle cinematic vinyl crackle.]',
      voiceover: 'Habit number two: Agree and Amplify. Insults only sting if you fight them. When you resist, you confirm the blow landed. But if someone says, "You look tired and sloppy today," what happens if you smile and reply: "Honestly, you should have seen me yesterday, it was twice as bad"? You take their weapon and turn it into dust. You become impossible to bait.',
      patternInterruptNote: 'Fast quote card overlay: "He who angers you conquers you." — Elizabeth Kenny.'
    },
    {
      sectionName: '4:15 - 6:30 Habit 3: The Emotional Audit',
      timestamp: '04:15',
      durationSeconds: 135,
      visualCue: '[B-ROLL: Animated minimalist blueprint drawing of a fortified castle citadel surrounded by water.]',
      soundFX: '[SFX: Deep cello melody with subtle ambient tape saturation.]',
      voiceover: 'Habit number three: The Emotional Audit. Epictetus taught that men are disturbed not by things, but by the view which they take of them. When someone attacks you, ask yourself: Does this person have the wisdom I aspire to? If not, why would I value their criticism? You do not ask a blind man for directions, so do not ask a bitter person for your self-worth.',
      patternInterruptNote: 'Sound of page turning with key takeaway checklist highlighted.'
    },
    {
      sectionName: '6:30 - 8:45 The Final Climax & Binge Loop CTA',
      timestamp: '06:30',
      durationSeconds: 135,
      visualCue: '[B-ROLL: Majestic mountain peak at dawn with golden sunrise breaking through dark clouds. End screen card elements slide in at 8:25.]',
      soundFX: '[SFX: Uplifting cinematic brass crescendo.]',
      voiceover: 'Mastering disrespect is not about being cold; it is about recognizing your own sovereign peace. If this shifted your perspective today, tap the subscribe button and join our archive of disciplined minds. Next, click the video on your screen right now to discover the dark psychology of quiet people and why the world fears those who do not speak.',
      patternInterruptNote: 'Interactive YouTube end screen video cards appear with animated pointing arrows.'
    }
  ],
  ttsNarrationSpeed: '1.05x speed recommended for optimal retention rhythm'
};

const INITIAL_THUMBNAIL: ThumbnailData = {
  conceptName: 'The Stoic Disdain / Golden Contrast',
  boldHeadline: 'NEVER REACT',
  headlineColor: '#FACC15',
  backgroundColor: '#090D16',
  focalElement: 'Cracked antique Roman marble bust with golden glowing eyes looking slightly off camera with utter calm.',
  secondaryElement: 'Chaotic red motion blur spikes in the background representing angry mob / verbal chaos.',
  midjourneyPrompt: '/imagine prompt: hyper-realistic close-up of a stoic Roman marble statue of Marcus Aurelius, golden glowing cracks running through the marble, dark textured obsidian background, dramatic cinematic side-lighting with bright warm gold rim light, extreme 8k texture, rule of thirds composition, high contrast, clean negative space on left side for text --ar 16:9 --style raw --v 6.0',
  ctrPsychologyTips: [
    'Only 2 words on the thumbnail ("NEVER REACT") to maximize readability on mobile screens.',
    'High contrast yellow against deep black creates instant focal gaze trigger.',
    'Face element (even a statue) triggers human facial recognition circuitry in the amygdala.',
    'Negative space on the left ensures thumbnail text never overlaps with YouTube duration timestamp badge in bottom right.'
  ]
};

const INITIAL_SEO: SeoData = {
  titleA: '7 Psychological Habits That Make You UNFAZED by Disrespect',
  titleB: 'How Dangerous People React to Disrespect (The 3-Second Rule)',
  titleC: 'The Stoic Secret to Never Getting Angry Ever Again',
  description: `When someone disrespects you, your natural instinct is to fight back or shut down. In this video, we explore the 7 proven psychological habits used by history's most resilient stoics and leaders to remain completely untouchable in the face of insult, aggression, or passive hostility.\n\n📌 Timestamps & Chapters:\n00:00 - The 3-Second Visual Freeze Hook\n00:45 - Habit 1: The Tactical Silence Pause\n02:30 - Habit 2: Agree & Amplify\n04:15 - Habit 3: The Emotional Audit\n06:30 - The Stoic Armor of Epictetus\n08:00 - Master Disrespect & Protect Your Peace\n\n🔔 Subscribe to Mindset Vault for weekly deep dives into dark psychology, stoic wisdom, and emotional mastery: https://youtube.com/@MindsetVaultHQ\n\n📚 Recommended Reading:\n• Meditations by Marcus Aurelius\n• The Discourses of Epictetus\n\n⚠️ Disclaimer: The content on this channel is for educational and philosophical contemplation purposes only.`,
  tags: [
    'stoicism',
    'how to handle disrespect',
    'dark psychology',
    'psychological tricks',
    'emotional control',
    'marcus aurelius',
    'epictetus wisdom',
    'stoic mindset',
    'never get angry',
    'psychology of disrespect',
    'faceless youtube automation',
    'self improvement motivation'
  ],
  pinnedComment: '💬 Question for you: Which of these 7 habits do you struggle with the most when someone provokes you? Drop your thoughts below — I read and pin the most thoughtful answer!',
  hashtags: ['#Stoicism', '#DarkPsychology', '#SelfImprovement', '#Mindset', '#Wisdom']
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [niches, setNiches] = useState<NicheItem[]>(INITIAL_NICHES);
  const [selectedNicheId, setSelectedNicheId] = useState<string>('niche-1');
  const [branding, setBranding] = useState<ChannelBranding>(INITIAL_BRANDING);
  const [contentPlan, setContentPlan] = useState<ContentPlan>(INITIAL_CONTENT_PLAN);
  const [script, setScript] = useState<VideoScript>(INITIAL_SCRIPT);
  const [thumbnail, setThumbnail] = useState<ThumbnailData>(INITIAL_THUMBNAIL);
  const [seo, setSeo] = useState<SeoData>(INITIAL_SEO);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>(INITIAL_SCRIPT.title);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const activeNiche = niches.find(n => n.id === selectedNicheId) || niches[0];
  const activeChannelName = branding.channelNames[branding.selectedNameIndex]?.name || 'Mindset Vault';

  // API Callers
  const handleRefreshNiches = async (customFocus?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/find-niches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customFocus }),
      });
      const data = await res.json();
      if (data.niches && data.niches.length > 0) {
        setNiches(data.niches);
        setSelectedNicheId(data.niches[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateBranding = async (targetVibe?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/generate-branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nicheName: activeNiche.name,
          category: activeNiche.category,
          targetVibe,
        }),
      });
      const data = await res.json();
      if (data.branding) {
        setBranding({
          ...INITIAL_BRANDING,
          ...data.branding,
          selectedNameIndex: 0,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateContentPlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/generate-content-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nicheName: activeNiche.name,
          channelName: activeChannelName,
        }),
      });
      const data = await res.json();
      if (data.weeks) {
        setContentPlan(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVideoForScript = async (video: VideoTopic) => {
    setActiveVideoTitle(video.title);
    setCurrentStep(4);
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: video.title,
          nicheName: activeNiche.name,
          channelName: activeChannelName,
          videoType: video.format,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateScript = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: activeVideoTitle,
          nicheName: activeNiche.name,
          channelName: activeChannelName,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateThumbnail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/generate-thumbnail-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: activeVideoTitle,
          nicheName: activeNiche.name,
        }),
      });
      const data = await res.json();
      if (data.thumbnail) {
        setThumbnail(data.thumbnail);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSeo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: activeVideoTitle,
          nicheName: activeNiche.name,
          channelName: activeChannelName,
        }),
      });
      const data = await res.json();
      if (data.seo) {
        setSeo(data.seo);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNiche = (niche: NicheItem) => {
    setSelectedNicheId(niche.id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ef4444', '#f59e0b', '#3b82f6'],
    });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        channelName={activeChannelName}
        nicheName={activeNiche?.name}
        onOpenBlueprint={() => setIsBlueprintModalOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentStep === 1 && (
          <NicheStep
            niches={niches}
            selectedNicheId={selectedNicheId}
            onSelectNiche={handleSelectNiche}
            isLoading={isLoading}
            onRefreshNiches={handleRefreshNiches}
            onProceedToBranding={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <BrandingStep
            branding={branding}
            onUpdateBranding={(updated) => setBranding(prev => ({ ...prev, ...updated }))}
            isLoading={isLoading}
            onRegenerateBranding={handleRegenerateBranding}
            onProceedToContent={() => setCurrentStep(3)}
            nicheName={activeNiche?.name}
          />
        )}

        {currentStep === 3 && (
          <ContentPlanStep
            contentPlan={contentPlan}
            onSelectVideoForScript={handleSelectVideoForScript}
            isLoading={isLoading}
            onRegeneratePlan={handleRegenerateContentPlan}
            channelName={activeChannelName}
            nicheName={activeNiche?.name}
          />
        )}

        {currentStep === 4 && (
          <ScriptStep
            script={script}
            onRegenerateScript={handleRegenerateScript}
            isLoading={isLoading}
            onProceedToThumbnail={() => setCurrentStep(5)}
            videoTitle={activeVideoTitle}
          />
        )}

        {currentStep === 5 && (
          <ThumbnailStep
            thumbnail={thumbnail}
            videoTitle={activeVideoTitle}
            channelName={activeChannelName}
            onUpdateThumbnail={(updated) => setThumbnail(prev => ({ ...prev, ...updated }))}
            onUpdateTitle={(title) => {
              setActiveVideoTitle(title);
              setScript(prev => ({ ...prev, title }));
            }}
            onRegenerateThumbnail={handleRegenerateThumbnail}
            onProceedToSeo={() => setCurrentStep(6)}
            isLoading={isLoading}
          />
        )}

        {currentStep === 6 && (
          <SeoStep
            seo={seo}
            videoTitle={activeVideoTitle}
            onSelectTitleVariant={(title) => {
              setActiveVideoTitle(title);
              setScript(prev => ({ ...prev, title }));
            }}
            onRegenerateSeo={handleRegenerateSeo}
            onProceedToMonetization={() => setCurrentStep(7)}
            isLoading={isLoading}
            channelName={activeChannelName}
          />
        )}

        {currentStep === 7 && (
          <MonetizationStep
            channelName={activeChannelName}
            nicheName={activeNiche?.name}
            estimatedCpm={activeNiche?.estimatedCPM || 14.50}
            onExportPlan={() => setIsExportModalOpen(true)}
          />
        )}
      </main>

      {/* Blueprint Reference Modal */}
      <BlueprintModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
      />

      {/* Master Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        niche={activeNiche}
        branding={branding}
        contentPlan={contentPlan}
        script={script}
        thumbnail={thumbnail}
        seo={seo}
      />
    </div>
  );
}
