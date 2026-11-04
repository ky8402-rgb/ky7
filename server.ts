import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// ----------------------------------------------------
// Fallback Curated Data (Robust guarantees)
// ----------------------------------------------------
const DEFAULT_NICHES = [
  {
    id: 'niche-1',
    rank: 1,
    name: 'Stoic Life Psychology & Dark Mindset Lessons',
    category: 'Self-Improvement / Philosophy',
    tagline: 'Ancient wisdom applied to modern mental warfare and emotional mastery.',
    demandScore: 96,
    competitionLevel: 'Medium' as const,
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
    competitionLevel: 'Low' as const,
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
    competitionLevel: 'Medium' as const,
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
    competitionLevel: 'Medium' as const,
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
    competitionLevel: 'High' as const,
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
    competitionLevel: 'High' as const,
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
    competitionLevel: 'Low' as const,
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
    competitionLevel: 'Medium' as const,
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
    competitionLevel: 'Low' as const,
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
    competitionLevel: 'Low' as const,
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

// ----------------------------------------------------
// API Route 1: Find 10 Profitable Niches (Step 1 from user image)
// ----------------------------------------------------
app.post('/api/youtube/find-niches', async (req: Request, res: Response) => {
  try {
    const { customFocus, promptOverride } = req.body;

    if (!ai) {
      // Return rich default niches
      return res.json({ niches: DEFAULT_NICHES, source: 'curated' });
    }

    const defaultPrompt = `Act as an elite YouTube growth strategist. Find 10 profitable faceless YouTube niches I can start with zero subscribers, no budget, no camera, and no voice recording. Analyze demand, competition, viral potential, and monetization opportunities. Rank the top 3 niches and recommend the best one for my first 60 days. ${customFocus ? `Special user preference/focus: ${customFocus}` : ''}`;

    const prompt = promptOverride || defaultPrompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a veteran YouTube growth consultant and channel automation strategist specializing in faceless channels with 0 budget, zero camera, and zero voice recording (using free TTS or royalty-free audio). Return structured JSON adhering strictly to the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            niches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  rank: { type: Type.INTEGER },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  demandScore: { type: Type.INTEGER, description: '1 to 100' },
                  competitionLevel: { type: Type.STRING, description: 'Low, Medium, or High' },
                  estimatedCPM: { type: Type.NUMBER, description: 'in USD, e.g. 15.5' },
                  viralScore: { type: Type.INTEGER, description: '1 to 100' },
                  monetizationScore: { type: Type.INTEGER, description: '1 to 100' },
                  recommendedForFirst60Days: { type: Type.BOOLEAN },
                  isTopThree: { type: Type.BOOLEAN },
                  bestForZeroBudgetReason: { type: Type.STRING },
                  recommendedTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  monetizationMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
                  strategicVerdict: { type: Type.STRING },
                },
                required: ['rank', 'name', 'category', 'tagline', 'demandScore', 'competitionLevel', 'estimatedCPM', 'viralScore', 'monetizationScore', 'recommendedForFirst60Days', 'isTopThree', 'bestForZeroBudgetReason', 'recommendedTools', 'monetizationMethods', 'strategicVerdict']
              }
            }
          },
          required: ['niches']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.niches && Array.isArray(parsed.niches) && parsed.niches.length > 0) {
      const enriched = parsed.niches.map((n: any, idx: number) => ({
        ...n,
        id: n.id || `niche-${idx + 1}`,
        rank: n.rank || idx + 1,
      }));
      return res.json({ niches: enriched, source: 'gemini' });
    }

    return res.json({ niches: DEFAULT_NICHES, source: 'curated' });
  } catch (error: any) {
    console.error('Error generating niches:', error);
    return res.json({ niches: DEFAULT_NICHES, source: 'fallback', error: error.message });
  }
});

// ----------------------------------------------------
// API Route 2: Build My Channel From Scratch (Step 2 from user blueprint)
// ----------------------------------------------------
app.post('/api/youtube/generate-branding', async (req: Request, res: Response) => {
  try {
    const { nicheName, category, targetVibe } = req.body;
    const niche = nicheName || 'Stoic Life Psychology & Dark Mindset Lessons';

    const defaultBranding = {
      channelNames: [
        { name: 'Mindset Vault', handle: '@MindsetVaultHQ', rationale: 'Authoritative, memorable, and evokes protected deep psychological secrets.' },
        { name: 'Stoic Odyssey', handle: '@StoicOdysseyOfficial', rationale: 'Evokes a transformative heroic journey of the mind.' },
        { name: 'Iron Will Philosophy', handle: '@IronWillWisdom', rationale: 'Strong, impactful keyword with high search volume.' },
        { name: 'The Silent Thinker', handle: '@TheSilentThinkerTV', rationale: 'Mysterious and intriguing for faceless commentary.' },
        { name: 'Apex Mentality', handle: '@ApexMentalityAI', rationale: 'Positioned for high-performance self-mastery.' }
      ],
      tagline: 'Master Your Mind Before The World Masters You.',
      valueProposition: 'Unlocking ancient psychological frameworks and stoic mental models to build unshakable discipline, emotional control, and quiet power in under 10 minutes a day.',
      aboutBio: 'Welcome to Mindset Vault — your premier archive for timeless stoic philosophy, dark psychology breakdowns, and deep mindset reprogramming. We deconstruct the cognitive secrets of history\'s most resilient figures into actionable, high-retention visual lessons. \n\n🎯 Upload Schedule: New deep dive every Tuesday & Friday at 2 PM EST.\n💼 Business & Sponsorship Inquiries: contact@mindsetvault.com\n\nSubscribe to fortify your mind and join our community of over 50,000 disciplined thinkers.',
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
          description: 'Use high-contrast obsidian backgrounds with warm golden rim-lighting on classical Roman/Greek busts so viewers recognize your videos in the feed before reading thechannel name.'
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
          whyItMatters: 'Unlocks custom thumbnails, vídeos longer than 15 minutes, external links in descriptions, and higher daily upload limits immediately.',
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
        primary: '#0F172A', // Slate 900
        accent: '#EAB308',  // Yellow 500 Gold
        background: '#020617', // Slate 950
        card: '#1E293B',    // Slate 800
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

    if (!ai) {
      return res.json({ branding: defaultBranding });
    }

    const masterPrompt = `Act as a YouTube branding expert. Help me build a professional faceless YouTube channel in the [${niche}] niche (Category: ${category || 'General'}, Aesthetic: ${targetVibe || 'Cinematic, authoritative, high-conversion'}). Generate channel names, an SEO-friendly description, branding ideas, channel keywords, and a complete setup checklist to stand out from competitors.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: masterPrompt,
      config: {
        systemInstruction: 'You are a world-class YouTube channel branding expert and visual director. Execute the user prompt thoroughly: generate sticky channel names with clean handles, a compelling tagline, an SEO-friendly YouTube About description, 12-15 high-intent channel keywords, 4 distinctive branding ideas to stand out from competitors, a 7-step actionable channel setup checklist, cohesive color scheme, and banner/avatar visual concepts adhering strictly to YouTube desktop and mobile safe zone dimensions.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            branding: {
              type: Type.OBJECT,
              properties: {
                channelNames: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      handle: { type: Type.STRING },
                      rationale: { type: Type.STRING }
                    },
                    required: ['name', 'handle', 'rationale']
                  }
                },
                tagline: { type: Type.STRING },
                valueProposition: { type: Type.STRING },
                aboutBio: { type: Type.STRING },
                channelKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                brandingIdeas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      category: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ['title', 'category', 'description']
                  }
                },
                setupChecklist: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      category: { type: Type.STRING },
                      task: { type: Type.STRING },
                      whyItMatters: { type: Type.STRING },
                      completed: { type: Type.BOOLEAN }
                    },
                    required: ['id', 'category', 'task', 'whyItMatters', 'completed']
                  }
                },
                colorPalette: {
                  type: Type.OBJECT,
                  properties: {
                    primary: { type: Type.STRING },
                    accent: { type: Type.STRING },
                    background: { type: Type.STRING },
                    card: { type: Type.STRING },
                    text: { type: Type.STRING },
                    mood: { type: Type.STRING }
                  },
                  required: ['primary', 'accent', 'background', 'card', 'text', 'mood']
                },
                bannerConcept: {
                  type: Type.OBJECT,
                  properties: {
                    headlineText: { type: Type.STRING },
                    subText: { type: Type.STRING },
                    uploadBadgeText: { type: Type.STRING },
                    visualDescription: { type: Type.STRING }
                  },
                  required: ['headlineText', 'subText', 'uploadBadgeText', 'visualDescription']
                },
                avatarConcept: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    lettermark: { type: Type.STRING }
                  },
                  required: ['description', 'lettermark']
                }
              },
              required: [
                'channelNames',
                'tagline',
                'valueProposition',
                'aboutBio',
                'channelKeywords',
                'brandingIdeas',
                'setupChecklist',
                'colorPalette',
                'bannerConcept',
                'avatarConcept'
              ]
            }
          },
          required: ['branding']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.branding) {
      return res.json(parsed);
    }
    return res.json({ branding: defaultBranding });
  } catch (error: any) {
    console.error('Error generating branding:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// API Route 3: Generate 30 Viral Video Ideas (Step 3)
// ----------------------------------------------------
app.post('/api/youtube/generate-content-plan', async (req: Request, res: Response) => {
  try {
    const { nicheName, channelName, targetAudience } = req.body;
    const niche = nicheName || 'Stoic Life Psychology & Dark Mindset Lessons';
    const channel = channelName || 'Mindset Vault';
    const audience =
      targetAudience ||
      'Ambitious 18-35 year-old professionals, students, and self-improvers seeking emotional resilience and competitive mental advantages';

    const defaultPlan = {
      strategy: `The 30-Idea Viral Velocity Matrix for ${channel}: 6 strategic weekly sprints (5 high-potential videos per week = 30 viral ideas) balancing Trending Topics, High Audience Demand search pillars, and Extreme Shareability social triggers.`,
      targetAudience: audience,
      weeks: [
        {
          weekNumber: 1,
          phase: 'Sprint 1 (Ideas #1–#5): Algorithmic Seeding & Emotional Mastery',
          videos: [
            {
              id: 'w1-v1',
              ideaNumber: 1,
              title: '7 Psychological Habits That Make You Unfazed by Disrespect',
              format: 'Long-Form',
              targetDuration: '9:40',
              uploadDay: 'Monday',
              hook: 'When someone insults you in public, your heart beats 140 times a minute. Here is the 3-second neurological freeze rule that makes the attacker look foolish without a single word.',
              concept: 'Breaks down 7 behavioral psychology and Stoic techniques (Tactical Silence, Agree & Amplify, Emotional Audit) that neutralize verbal disrespect in real-world social and workplace settings.',
              thumbnailConcept: 'Split screen: Cluttered agitated red brain vs calm obsidian marble statue with gold eye glow and text "UNTOUCHABLE".',
              predictedCTR: '12.4%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 97
            },
            {
              id: 'w1-v2',
              ideaNumber: 2,
              title: 'The Dark Psychology of Quiet People (Why Everyone FEARS Them)',
              format: 'Long-Form',
              targetDuration: '10:15',
              uploadDay: 'Wednesday',
              hook: 'Why do the most powerful people in any room speak 40% slower and 60% less than everyone else? Because silence triggers a primal uncertainty loop in the human brain.',
              concept: 'Explores the "Vacuum Effect" in human communication—why withholding immediate validation commands authority, forces others to over-explain, and projects unshakable status.',
              thumbnailConcept: 'Silhouette in shadow with intense amber rim light and bold 2-word text "NEVER TALK".',
              predictedCTR: '13.8%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 98
            },
            {
              id: 'w1-v3',
              ideaNumber: 3,
              title: 'Never React Instantly: The Marcus Aurelius 4-Second Rule #Shorts',
              format: 'Shorts',
              targetDuration: '0:52',
              uploadDay: 'Thursday',
              hook: 'If someone disrespects you today, do NOT say a word for four full seconds. Watch what happens to their face.',
              concept: 'Rapid-fire 50-second demonstration of how a 4-second deadpan stare breaks an aggressor\'s dopamine loop, paired with a quote from Meditations Book IV.',
              thumbnailConcept: 'Marcus Aurelius bust zoomed in on eyes with red countdown timer "0:04".',
              predictedCTR: '15.2%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 96
            },
            {
              id: 'w1-v4',
              ideaNumber: 4,
              title: 'How to Read Anyone Instantly: 6 Micro-Behaviors That Expose Fake Friends',
              format: 'Long-Form',
              targetDuration: '11:05',
              uploadDay: 'Friday',
              hook: 'A fake friend will never betray you to your face first—they will betray you with a 0.3-second facial micro-expression when you share good news.',
              concept: 'Analyzes behavioral tells from FBI interrogation manuals and Machiavellian psychology to spot covert envy, backhanded compliments, and loyalty tests.',
              thumbnailConcept: 'Smiling mask cracking to reveal cold golden eyes underneath with text "FAKE FRIEND".',
              predictedCTR: '12.9%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 95
            },
            {
              id: 'w1-v5',
              ideaNumber: 5,
              title: 'The 1 Sentence That Destroys Manipulation Instantly #Shorts',
              format: 'Shorts',
              targetDuration: '0:45',
              uploadDay: 'Sunday',
              hook: 'When a manipulator tries to guilt-trip you, repeat this exact 6-word question and watch them panic.',
              concept: 'Gives viewers a plug-and-play verbal counter-frame ("What are you hoping I feel?") that exposes covert guilt-tripping on the spot.',
              thumbnailConcept: 'Puppet strings being sliced by a golden blade with text "SAY THIS".',
              predictedCTR: '14.6%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 99
            }
          ]
        },
        {
          weekNumber: 2,
          phase: 'Sprint 2 (Ideas #6–#10): Curiosity Loops & Contrarian Mindset',
          videos: [
            {
              id: 'w2-v1',
              ideaNumber: 6,
              title: 'Why 99% of People Fail Stoicism (The Comfort Trap Exposed)',
              format: 'Long-Form',
              targetDuration: '8:55',
              uploadDay: 'Monday',
              hook: 'You read Meditations, you watched the videos, and you still lost your temper yesterday. That is because modern Stoicism left out the most brutal step.',
              concept: 'Contrarian breakdown of "Performative Stoicism" vs Seneca\'s voluntary discomfort drills—teaching viewers how to inoculate their nervous system against chaos.',
              thumbnailConcept: 'Broken classical pillar with red X mark and bold text "THE BIG LIE".',
              predictedCTR: '11.4%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 92
            },
            {
              id: 'w2-v2',
              ideaNumber: 7,
              title: 'How to Disappear for 6 Months and Return UNRECOGNIZABLE',
              format: 'Long-Form',
              targetDuration: '12:20',
              uploadDay: 'Wednesday',
              hook: 'Every great transformation in history began with a period of strategic invisibility. Here is the 180-day Monk Mode blueprint.',
              concept: 'Step-by-step ghost protocol covering dopamine detoxing, silent skill acquisition, circadian discipline, and eliminating social broadcasting.',
              thumbnailConcept: 'Solitary hooded figure walking into foggy obsidian mountain with glowing gold path and text "GHOST MODE".',
              predictedCTR: '14.5%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 98
            },
            {
              id: 'w2-v3',
              ideaNumber: 8,
              title: 'Stop Telling People Your Goals (The Dopamine Leak) #Shorts',
              format: 'Shorts',
              targetDuration: '0:50',
              uploadDay: 'Thursday',
              hook: 'The moment you announce your big goal to your friends, your brain marks it as already completed.',
              concept: 'Explains Peter Gollwitzer\'s psychological research on "social reality substitution" and why keeping ambitions secret triples follow-through.',
              thumbnailConcept: 'Zipper closing over glowing golden lips with text "KEEP QUIET".',
              predictedCTR: '14.9%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 97
            },
            {
              id: 'w2-v4',
              ideaNumber: 9,
              title: '8 Harsh Truths About Human Nature You Must Accept Before 30',
              format: 'Long-Form',
              targetDuration: '10:50',
              uploadDay: 'Friday',
              hook: 'Nobody is coming to save you, and most people secretly want you to do well—just never better than them.',
              concept: 'Synthesizes Arthur Schopenhauer, Robert Greene, and Epictetus into 8 liberating truths about status, reciprocity, and self-reliance.',
              thumbnailConcept: 'Scale of justice tipping between gold crown and skull with text "HARSH TRUTHS".',
              predictedCTR: '12.7%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 96
            },
            {
              id: 'w2-v5',
              ideaNumber: 10,
              title: 'The "Boredom Test" That Separates Winners From Losers #Shorts',
              format: 'Shorts',
              targetDuration: '0:55',
              uploadDay: 'Sunday',
              hook: 'Can you sit in a quiet room for 10 minutes without touching your phone? If not, your attention span belongs to someone else.',
              concept: 'Challenges viewers with Blaise Pascal\'s famous observation on solitude and gives a 60-second boredom tolerance reset.',
              thumbnailConcept: 'Glowing smartphone chained to a stone statue hand with text "BREAK FREE".',
              predictedCTR: '13.9%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 94
            }
          ]
        },
        {
          weekNumber: 3,
          phase: 'Sprint 3 (Ideas #11–#15): High-Retention Deep Dives & Anxiety Control',
          videos: [
            {
              id: 'w3-v1',
              ideaNumber: 11,
              title: 'The Art of Not Caring: How to Turn Off Overthinking in 60 Seconds',
              format: 'Long-Form',
              targetDuration: '9:30',
              uploadDay: 'Monday',
              hook: 'Overthinking is not an intelligence problem—it is a nervous system stuck in a false survival loop. Here is how to flip the kill switch.',
              concept: 'Combines Epictetus\' Dichotomy of Control with the physiological sigh and cognitive defusion to stop late-night rumination.',
              thumbnailConcept: 'Glowing brain diagram highlighting amygdala shutdown switch with text "TURN IT OFF".',
              predictedCTR: '13.1%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 96
            },
            {
              id: 'w3-v2',
              ideaNumber: 12,
              title: '5 Warning Signs Someone Is Silently Manipulating You',
              format: 'Long-Form',
              targetDuration: '10:45',
              uploadDay: 'Wednesday',
              hook: 'The most dangerous manipulators never raise their voice. They use a covert tactic psychologists call "intermittent reinforcement".',
              concept: 'Exposes 5 subtle dark psychology tactics—breadcrumbing, moving the goalposts, triangulation, and weaponized empathy—and how to disarm each.',
              thumbnailConcept: 'Golden puppet strings descending onto shadowed figure with text "THEY USE YOU".',
              predictedCTR: '13.8%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 97
            },
            {
              id: 'w3-v3',
              ideaNumber: 13,
              title: 'Why Being "Too Nice" Is Ruining Your Life (Nietzsche\'s Warning) #Shorts',
              format: 'Shorts',
              targetDuration: '0:54',
              uploadDay: 'Thursday',
              hook: 'If you cannot say no without feeling guilty, you are not a good person—you are a harmless person. And there is a massive difference.',
              concept: 'Distinguishes between weakness disguised as politeness versus true virtue backed by boundaries and strength.',
              thumbnailConcept: 'Sheep mask lifting off a golden lion statue with text "STOP PLEASING".',
              predictedCTR: '15.4%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 98
            },
            {
              id: 'w3-v4',
              ideaNumber: 14,
              title: 'How to Build Iron Discipline When You Have Zero Motivation',
              format: 'Long-Form',
              targetDuration: '11:15',
              uploadDay: 'Friday',
              hook: 'Motivation is a fair-weather friend that abandons you the moment life gets hard. Discipline is an automated system that requires zero feelings.',
              concept: 'Reveals the "Friction Inversion Protocol" used by elite performers to make hard habits effortless and bad habits impossible.',
              thumbnailConcept: 'Spartan helmet forged in glowing molten gold with text "ZERO EXCUSES".',
              predictedCTR: '12.2%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 94
            },
            {
              id: 'w3-v5',
              ideaNumber: 15,
              title: 'Seneca\'s 3-Minute Nightly Ritual for Unshakable Peace #Shorts',
              format: 'Shorts',
              targetDuration: '0:49',
              uploadDay: 'Sunday',
              hook: 'Before Seneca closed his eyes in ancient Rome, he asked himself three ruthless questions in the dark.',
              concept: 'Walks viewers through Seneca\'s evening moral audit from On Anger to clear mental clutter before sleep.',
              thumbnailConcept: 'Candlelit Roman scroll and quill in dark marble chamber with text "ASK THIS".',
              predictedCTR: '13.6%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 95
            }
          ]
        },
        {
          weekNumber: 4,
          phase: 'Sprint 4 (Ideas #16–#20): Power Dynamics, Status & Binge Series',
          videos: [
            {
              id: 'w4-v1',
              ideaNumber: 16,
              title: 'The Law of Detachment: Why Needing Nothing Gives You Everything',
              format: 'Long-Form',
              targetDuration: '10:30',
              uploadDay: 'Monday',
              hook: 'Have you ever noticed that the moment you stop caring whether you get the job, the deal, or the person, they suddenly chase you?',
              concept: 'Explains the "Paradox of Pursuit" and how outcome independence shifts interpersonal power dynamics in career, negotiation, and relationships.',
              thumbnailConcept: 'Open empty marble hand catching golden starlight with text "LET IT GO".',
              predictedCTR: '13.5%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 98
            },
            {
              id: 'w4-v2',
              ideaNumber: 17,
              title: '10 Rules of Power The 1% Teach Their Children (Never Taught in School)',
              format: 'Long-Form',
              targetDuration: '12:40',
              uploadDay: 'Wednesday',
              hook: 'Schools train you to follow instructions and seek permission. Dynasty families train their children to own leverage and control perception.',
              concept: 'Uncovers 10 unwritten rules of strategic thinking, asymmetric risk, emotional concealability, and network leverage.',
              thumbnailConcept: 'Massive obsidian and gold vault door cracked open with text "HIDDEN RULES".',
              predictedCTR: '15.1%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 99
            },
            {
              id: 'w4-v3',
              ideaNumber: 18,
              title: 'Never Explain Yourself Twice to Anyone #Shorts',
              format: 'Shorts',
              targetDuration: '0:46',
              uploadDay: 'Thursday',
              hook: 'People who demand constant explanations are not confused—they are looking for ammunition.',
              concept: 'Punchy 45-second rule on why over-explaining signals subordination and how to state boundaries with a period, not a question mark.',
              thumbnailConcept: 'Gold chess king standing alone facing row of black pawns with text "NEVER EXPLAIN".',
              predictedCTR: '14.8%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 97
            },
            {
              id: 'w4-v4',
              ideaNumber: 19,
              title: 'How to Command Respect in Any Room Without Saying a Word',
              format: 'Long-Form',
              targetDuration: '9:50',
              uploadDay: 'Friday',
              hook: 'Before you open your mouth, every person in the room has already assigned you a status rank in less than 7 seconds.',
              concept: 'Breaks down spatial posture, eye-contact cadence, vocal stillness, and non-reactive body language that project calm dominance.',
              thumbnailConcept: 'Sharp suited silhouette entering dark boardroom with golden aura and text "INSTANT RESPECT".',
              predictedCTR: '12.8%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 95
            },
            {
              id: 'w4-v5',
              ideaNumber: 20,
              title: 'The Miyamoto Musashi Rule for Total Focus (Dokkodo) #Shorts',
              format: 'Shorts',
              targetDuration: '0:58',
              uploadDay: 'Sunday',
              hook: 'Seven days before his death after 61 undefeated duels, Miyamoto Musashi wrote 21 rules for walking alone.',
              concept: 'Highlights 3 transformative precepts from Musashi\'s Dokkodo ("Do not regret what you have done", "Accept everything just the way it is").',
              thumbnailConcept: 'Lone samurai silhouette under golden eclipse with text "WALK ALONE".',
              predictedCTR: '15.5%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 98
            }
          ]
        },
        {
          weekNumber: 5,
          phase: 'Sprint 5 (Ideas #21–#25): Shadow Work, Focus & Mental Warfare',
          videos: [
            {
              id: 'w5-v1',
              ideaNumber: 21,
              title: 'Carl Jung: Until You Integrate Your Shadow, People Will Control You',
              format: 'Long-Form',
              targetDuration: '11:40',
              uploadDay: 'Monday',
              hook: 'The traits that irritate you most in other people are the exact parts of your own mind you refuse to look at.',
              concept: 'Accessible deep dive into Jungian Shadow integration—showing how repressed aggression and ambition can be harnessed into creative power.',
              thumbnailConcept: 'Classical statue casting a giant crowned monster shadow in gold light with text "YOUR SHADOW".',
              predictedCTR: '13.3%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 96
            },
            {
              id: 'w5-v2',
              ideaNumber: 22,
              title: '7 Things High-Value Minds Never Waste Energy On',
              format: 'Long-Form',
              targetDuration: '9:20',
              uploadDay: 'Wednesday',
              hook: 'Your mental bandwidth is a fixed daily currency. Spend it arguing with fools at 9 AM, and you will be bankrupt by noon.',
              concept: 'Audits the 7 biggest cognitive energy drains (winning petty arguments, seeking closure from toxic people, doomscrolling) and how to cut them.',
              thumbnailConcept: 'Hourglass leaking glowing gold sand with red warning text "STOP WASTING IT".',
              predictedCTR: '11.9%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 93
            },
            {
              id: 'w5-v3',
              ideaNumber: 23,
              title: 'Why You Feel Exhausted Even When You Do Nothing #Shorts',
              format: 'Shorts',
              targetDuration: '0:51',
              uploadDay: 'Thursday',
              hook: 'You are not physically tired—your brain has 47 open emotional tabs running in the background.',
              concept: 'Explains cognitive residue and open Zeigarnik loops, giving viewers a 2-minute brain-dump method to restore energy immediately.',
              thumbnailConcept: 'Overheating glowing human head with 47 warning popups and text "BRAIN DRAIN".',
              predictedCTR: '14.4%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 97
            },
            {
              id: 'w5-v4',
              ideaNumber: 24,
              title: 'The Machiavellian Guide to Surviving Office Politics (Without Losing Your Soul)',
              format: 'Long-Form',
              targetDuration: '10:55',
              uploadDay: 'Friday',
              hook: 'Hard work alone rarely gets promoted if you are politically naive. Here is how to protect your reputation from credit-thieves.',
              concept: 'Combines Niccolò Machiavelli and Baltasar Gracián to teach ethical self-defense in competitive hierarchies.',
              thumbnailConcept: 'Golden dagger hidden behind a polite handshake in dark suit with text "TRUST NO ONE".',
              predictedCTR: '12.6%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 95
            },
            {
              id: 'w5-v5',
              ideaNumber: 25,
              title: 'The 5-Second Eye Contact Trick That Projects Pure Confidence #Shorts',
              format: 'Shorts',
              targetDuration: '0:44',
              uploadDay: 'Sunday',
              hook: 'When you finish making an important point, do not look away first. Hold eye contact for two seconds after you stop speaking.',
              concept: 'Demonstrates how post-statement eye contact anchors authority and prevents vocal upspeak.',
              thumbnailConcept: 'Extreme close-up of golden iris reflection with text "HOLD THE GAZE".',
              predictedCTR: '14.7%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 96
            }
          ]
        },
        {
          weekNumber: 6,
          phase: 'Sprint 6 (Ideas #26–#30): Viral Authority Pillars & 60-Day Breakout',
          videos: [
            {
              id: 'w6-v1',
              ideaNumber: 26,
              title: 'How to Rewire Your Dopamine System in 7 Days (The Monk Reset)',
              format: 'Long-Form',
              targetDuration: '10:25',
              uploadDay: 'Monday',
              hook: 'Cheap dopamine has made hard work feel painful and stillness feel unbearable. In 7 days, we are resetting your baseline.',
              concept: 'Actionable 7-day neuro-behavioral protocol replacing high-frequency digital spikes with deep effort-driven dopamine.',
              thumbnailConcept: 'Brain split between neon junk icons and pure golden light beam with text "7-DAY RESET".',
              predictedCTR: '13.7%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 98
            },
            {
              id: 'w6-v2',
              ideaNumber: 27,
              title: '9 Subtle Signs You Have an Intimidating Presence (And Why People Act Weird)',
              format: 'Long-Form',
              targetDuration: '9:45',
              uploadDay: 'Wednesday',
              hook: 'If strangers either stare at you intensely or avoid your eyes completely, it is rarely because you did something wrong.',
              concept: 'Explores the psychology of grounded presence—why self-contained people trigger projection in insecure observers.',
              thumbnailConcept: 'Lone wolf silhouette with golden eyes standing calm in crowd blur with text "TOO INTENSE?".',
              predictedCTR: '14.1%',
              viralDriver: 'Trending Topic',
              shareabilityScore: 97
            },
            {
              id: 'w6-v3',
              ideaNumber: 28,
              title: 'Epictetus: How to Never Be Offended by Anyone Again #Shorts',
              format: 'Shorts',
              targetDuration: '0:53',
              uploadDay: 'Thursday',
              hook: 'Born a crippled slave in Rome, Epictetus discovered a mental secret that even emperors could not break.',
              concept: 'Illustrates Epictetus\' Enchiridion Verse 20: an insult only becomes an injury the moment your mind agrees with it.',
              thumbnailConcept: 'Broken iron chains falling off marble wrists with text "UNBREAKABLE".',
              predictedCTR: '15.0%',
              viralDriver: 'Extreme Shareability',
              shareabilityScore: 98
            },
            {
              id: 'w6-v4',
              ideaNumber: 29,
              title: 'The Solitude Advantage: Why Your Greatest Growth Happens Alone',
              format: 'Long-Form',
              targetDuration: '11:30',
              uploadDay: 'Friday',
              hook: 'Society treats loneliness like a disease so you never discover how powerful you become when you no longer need validation.',
              concept: 'Examines historical polymaths, philosophers, and strategists who used deliberate solitude to build original thought and emotional sovereignty.',
              thumbnailConcept: 'Classical philosopher standing on cliff edge above golden sea of clouds with text "ALONE = POWER".',
              predictedCTR: '13.2%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 96
            },
            {
              id: 'w6-v5',
              ideaNumber: 30,
              title: '12 Stoic Laws That Will Change How You See Everything (60-Minute Masterclass)',
              format: 'Long-Form',
              targetDuration: '24:00',
              uploadDay: 'Sunday',
              hook: 'For two thousand years, kings, generals, and survivors have returned to twelve core laws when the world around them collapsed.',
              concept: 'Flagship compilation & deep-dive masterclass designed to maximize session watch-time and push the channel past the 4,000 watch-hour monetization threshold.',
              thumbnailConcept: 'Pantheon of 3 golden Roman busts (Marcus, Seneca, Epictetus) with text "12 STOIC LAWS".',
              predictedCTR: '14.9%',
              viralDriver: 'High Audience Demand',
              shareabilityScore: 99
            }
          ]
        }
      ]
    };

    if (!ai) {
      return res.json(defaultPlan);
    }

    const masterPrompt = `Act as a YouTube content strategist. Generate 30 high-potential video ideas for my [${niche}] channel ("${channel}") targeting [${audience}]. For each idea, provide a clickable title, a strong opening hook, the video concept, and a thumbnail idea. Focus on trending topics, audience demand, and shareability. Organize the 30 ideas across 6 weekly sprints (5 video ideas per week, numbered ideaNumber 1 through 30).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: masterPrompt,
      config: {
        systemInstruction: 'You are a world-class YouTube content strategist. Execute the user prompt completely: generate 30 high-potential viral video ideas organized into 6 weekly sprints (5 ideas per week = 30 ideas total, numbered 1 to 30). Every single idea must include a clickable title, a strong opening hook, the detailed video concept, a high-contrast thumbnail idea, viralDriver ("Trending Topic", "High Audience Demand", or "Extreme Shareability"), and shareabilityScore (88-99).',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  phase: { type: Type.STRING },
                  videos: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        ideaNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        format: { type: Type.STRING },
                        targetDuration: { type: Type.STRING },
                        uploadDay: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        concept: { type: Type.STRING },
                        thumbnailConcept: { type: Type.STRING },
                        predictedCTR: { type: Type.STRING },
                        viralDriver: { type: Type.STRING },
                        shareabilityScore: { type: Type.INTEGER }
                      },
                      required: [
                        'id',
                        'ideaNumber',
                        'title',
                        'format',
                        'targetDuration',
                        'uploadDay',
                        'hook',
                        'concept',
                        'thumbnailConcept',
                        'predictedCTR',
                        'viralDriver',
                        'shareabilityScore'
                      ]
                    }
                  }
                },
                required: ['weekNumber', 'phase', 'videos']
              }
            }
          },
          required: ['strategy', 'targetAudience', 'weeks']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.weeks && parsed.weeks.length > 0) {
      return res.json(parsed);
    }
    return res.json(defaultPlan);
  } catch (error: any) {
    console.error('Error generating content plan:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// API Route 4: Create Videos With AI — Faceless Script & AI Tools (Step 4)
// ----------------------------------------------------
app.post('/api/youtube/generate-script', async (req: Request, res: Response) => {
  try {
    const { videoTitle, nicheName, channelName, videoType, videoLengthMinutes } = req.body;
    const title = videoTitle || '7 Psychological Habits That Make You Unfazed by Disrespect';
    const niche = nicheName || 'Stoic Life Psychology & Dark Mindset Lessons';
    const isShorts = String(videoType || '').toLowerCase().includes('short');
    const lengthMinutes = Number(videoLengthMinutes) || (isShorts ? 1 : 9);

    const defaultScript = {
      title,
      targetLengthMinutes: lengthMinutes,
      estimatedDuration: isShorts ? '0:55' : `${lengthMinutes}:00`,
      predictedRetention: '66.4%',
      fiveSecondHook: '0:00–0:05 [VISUAL SHOCK + VERBAL FREEZE]: "When someone insults you in public, your heart spikes to 140 BPM in two seconds. Most people explode or freeze—but the most dangerous minds in history use a 3-second neurological switch that makes the attacker regret speaking."',
      hookStrategy: 'Immediate high-stakes conflict in the first 5 seconds with zero channel intro logo, opening an unclosed curiosity loop ("Habit #4 inverts every argument") before minute 0:30.',
      sections: [
        {
          sectionName: 'Scene 1: The 5-Second Visual & Neurological Hook',
          timestamp: '00:00',
          durationSeconds: 15,
          visualCue: '[SCENE VISUAL DIRECTION]: Slow-motion 4K close-up of a shattered Greek marble statue of Marcus Aurelius reassembling in reverse. High-contrast obsidian black background with molten gold rim lighting.',
          onScreenText: '140 BPM CORTISOL SPIKE → THE 3-SECOND SWITCH',
          editingInstructions: 'Start with a 2-frame white flash + hard sub-bass impact at 0:00. Apply a slow 1.15x dolly zoom-in on the statue eyes; cut on the exact beat at 0:05.',
          soundFX: '[SFX: Deep 40Hz sub-bass drop followed by an abrupt ticking pocket-watch in dead silence]',
          voiceover: 'When someone insults you in public, your heart beats 140 times a minute. Most people either explode in anger or freeze in shame. But the most dangerous people in history do neither. They use a three-second neurological trick that makes the attacker look foolish without uttering a single curse word.',
          patternInterruptNote: '0:05 Kinetic gold text slam: "THE 3-SECOND RULE" with camera shake.'
        },
        {
          sectionName: 'Scene 2: Engaging Storytelling — The Emperor & The Senator',
          timestamp: '00:15',
          durationSeconds: 45,
          visualCue: '[SCENE VISUAL DIRECTION]: Dark atmospheric Roman Senate chamber in candlelight. A furious senator shouts while Emperor Marcus Aurelius sits completely motionless on an obsidian throne.',
          onScreenText: 'HE WHO ANGERS YOU CONQUERS YOU',
          editingInstructions: 'Use rapid 1.8-second cross-dissolves with a dark film-grain overlay (15% opacity) and subtle vignette. Pan slowly left-to-right across the candlelit parchment.',
          soundFX: '[SFX: Distant rain, low cello drone, and subtle parchment rustle]',
          voiceover: 'In 175 AD, a Roman senator stood before Marcus Aurelius and hurled treasonous insults for ten straight minutes, hoping to provoke a tyrant\'s rage. Notice how when you get defensive, you instantly surrender your power. You hand them the emotional remote control to your life. Today, you are going to learn the psychological habits of people who are emotionally untouchable—and Habit Number Four will completely invert how you handle conflict forever.',
          patternInterruptNote: '0:35 Whoosh transition into anatomical brain split-screen.'
        },
        {
          sectionName: 'Scene 3: Habit #1 — The Tactical Silence Vacuum',
          timestamp: '01:00',
          durationSeconds: 120,
          visualCue: '[SCENE VISUAL DIRECTION]: Minimalist dark-mode 3D brain animation showing the red amygdala cooling into glowing gold prefrontal cortex, followed by a shadow silhouette holding steady eye contact.',
          onScreenText: 'HABIT 01: THE 4-SECOND VACUUM PAUSE',
          editingInstructions: 'Insert a real 2.5-second audio pause after "count to four in your mind" while displaying a ticking countdown timer (04..03..02..01) in the center of the frame.',
          soundFX: '[SFX: Heartbeat monitor slowing down from rapid to calm 60 BPM]',
          voiceover: 'Habit number one: The Tactical Silence. When someone throws a passive-aggressive barb, our primitive amygdala screams at us to defend our tribe status. Instead, look directly at the bridge of their nose, remain completely expressionless, and count to four in your mind. Psychologists call this the Vacuum Effect. In silence, the attacker is forced to hear their own disrespect echo in the room, making them look desperate and unstable.',
          patternInterruptNote: 'On-screen 4-second live countdown graphic forces viewer eye fixation.'
        },
        {
          sectionName: 'Scene 4: Habit #2 — Agree & Amplify (Judo of the Mind)',
          timestamp: '03:00',
          durationSeconds: 120,
          visualCue: '[SCENE VISUAL DIRECTION]: Macro shot of a black and gold chessboard. A single golden knight effortlessly sidesteps a charging rook as the rook slides off the edge of the board.',
          onScreenText: 'HABIT 02: AGREE & AMPLIFY THE FRAME',
          editingInstructions: 'Split screen comparison: Left side in desaturated red ("DEFENSIVE REACTION = WEAKNESS"), Right side in crisp gold ("AMPLIFIED HUMOR = DOMINANCE"). Use whip-pan transition.',
          soundFX: '[SFX: Heavy marble chess piece sliding across stone + crisp metallic chime]',
          voiceover: 'Habit number two: Agree and Amplify. Insults only sting if you fight them. When you resist, you validate the attacker\'s frame. But if a colleague says, "You look completely overwhelmed today," what happens if you smile calmly and reply: "Honestly, you should have seen me at 8 AM, it was three times worse"? You take their weapon and turn it into dust. You become impossible to bait.',
          patternInterruptNote: 'Quote card pop-in with typewriter sound effect.'
        },
        {
          sectionName: 'Scene 5: Habit #3 & #4 — The Epictetus Mirror Audit',
          timestamp: '05:00',
          durationSeconds: 150,
          visualCue: '[SCENE VISUAL DIRECTION]: Architectural blueprint of an ancient island citadel surrounded by stormy black waves, transitioning to a cracked mirror reflecting a calm golden bust.',
          onScreenText: 'HABIT 03: NEVER TAKE CRITICISM FROM SOMEONE YOU WOULDN\'T TAKE ADVICE FROM',
          editingInstructions: 'Apply slow Ken Burns zoom-out (120% to 100% scale) over 12 seconds. Highlight key phrases in yellow CapCut-style dynamic word-by-word captions.',
          soundFX: '[SFX: Deep Hans-Zimmer-style brass swell + distant ocean waves]',
          voiceover: 'Habit number three: The Epictetus Audit. Epictetus taught that men are disturbed not by things, but by the view which they take of them. When someone attacks you, ask yourself one ruthless question: Would I trade places with this person\'s mind? If not, why would you rent them space in yours? Every insult is actually an autobiography of the speaker\'s own insecurity.',
          patternInterruptNote: 'Invert screen colors for 0.4s on the word "autobiography".'
        },
        {
          sectionName: 'Scene 6: Compelling Ending & Binge-Loop Handoff',
          timestamp: '07:30',
          durationSeconds: 90,
          visualCue: '[SCENE VISUAL DIRECTION]: Solitary cloaked figure standing atop an obsidian mountain peak watching a golden sunrise break through storm clouds. Dual YouTube End-Screen frames animate in at 08:40.',
          onScreenText: 'NEXT STEP: THE DARK PSYCHOLOGY OF QUIET PEOPLE →',
          editingInstructions: 'Bring background orchestral strings up by +4dB. Keep the final 20 seconds fast-paced with no "thanks for watching" sign-off—point directly to the on-screen end card.',
          soundFX: '[SFX: Uplifting cinematic orchestral crescendo + crisp arrow whoosh]',
          voiceover: 'Mastering disrespect is not about becoming cold; it is about guarding your sovereign peace so fiercely that chaos cannot enter. Now that you know how to neutralize verbal attacks, you need to master the power of silence itself. Click the video on your screen right now to discover the dark psychology of quiet people—and why everyone secretly fears the person who speaks last.',
          patternInterruptNote: 'Animated glowing gold arrow pointing to the End Screen video card.'
        }
      ],
      compellingEnding: 'Never say "Thanks for watching" (which triggers a 70% viewer drop-off). Close with a philosophical mic-drop ("Every insult is an autobiography of the speaker\'s insecurity") and immediately bridge into a curiosity gap for the next video on screen ("Click the video on your screen right now to discover the dark psychology of quiet people").',
      recommendedAiTools: [
        {
          name: 'ElevenLabs (Free Tier) / Clipchamp Neural TTS (100% Free)',
          category: 'AI Voiceover (No Mic)',
          pricingTier: 'Free / $5 mo Starter',
          bestFor: 'Deep, authoritative baritone narration without ever recording your own voice.',
          workflowTip: 'Use the "Adam" or "Marcus" deep voice profile in ElevenLabs (or "Christopher Neural" in free Microsoft Clipchamp) at 1.05x speed with 0.3s pauses between sentences.'
        },
        {
          name: 'Leonardo.ai / Ideogram 2.0 / Bing Image Creator',
          category: 'AI Visuals & B-Roll (No Camera)',
          pricingTier: '100% Free Daily Credits',
          bestFor: 'Generating 16:9 dark marble Stoic statues, chiaroscuro scenes, and anatomical brain graphics.',
          workflowTip: 'Copy the [SCENE VISUAL DIRECTION] prompts from each scene above and append "--ar 16:9, dark cinematic obsidian and gold lighting, 8k photorealistic".'
        },
        {
          name: 'Kling AI / Hailuo MiniMax / Pika Labs',
          category: 'AI Visuals & B-Roll (No Camera)',
          pricingTier: 'Free Daily Video Generations',
          bestFor: 'Turning static AI images into 5-second slow-motion cinematic video clips (falling rain, flickering candles, moving clouds).',
          workflowTip: 'Upload your Leonardo.ai statue image and prompt: "Subtle slow camera dolly-in, golden dust particles floating in air, 24fps cinematic motion".'
        },
        {
          name: 'CapCut Desktop (Free) / DaVinci Resolve (Free)',
          category: 'AI Video Editing & Captions',
          pricingTier: '100% Free',
          bestFor: 'Assembling scenes, adding 1-click Auto-Captions, Ken Burns keyframes, and dark color grading.',
          workflowTip: 'Drop all voiceover audio on Track 1, remove silences >0.4s automatically, apply "Auto Captions" with bold yellow/white highlight on active words, and add "Pendulum" slow zoom.'
        },
        {
          name: 'Pixabay Audio / YouTube Audio Library / Freesound',
          category: 'Audio & SFX',
          pricingTier: '100% Free (Royalty-Free)',
          bestFor: 'Dark ambient cello drones, 40Hz sub-bass drops, ticking clocks, and whoosh transitions.',
          workflowTip: 'Set background dark ambient music to -22dB so the AI narrator voiceover sits crystal-clear at -6dB.'
        }
      ],
      ttsNarrationSpeed: '1.05x speed recommended for optimal retention rhythm'
    };

    if (!ai) {
      return res.json({ script: defaultScript });
    }

    const masterPrompt = `Act as an expert faceless YouTube scriptwriter. Write a complete [${lengthMinutes}]-minute script about [${title}] in the [${niche}] niche (Channel: ${channelName || 'Mindset Vault'}, Format: ${videoType || 'Long-Form'}). Include a powerful 5-second hook, engaging storytelling, scene-by-scene visual directions, on-screen text, editing instructions, and a compelling ending. Recommend free or affordable AI tools to create the video without showing my face or recording my voice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: masterPrompt,
      config: {
        systemInstruction: 'You are an elite faceless YouTube scriptwriter and AI video production director. Execute the user prompt completely: provide a powerful 5-second hook, 6 detailed storytelling scenes with timestamps, scene-by-scene visual directions, exact on-screen text overlays, editing instructions, sound FX, verbatim voiceover, a compelling ending with a binge-loop CTA, and 5 recommended free or affordable AI tools to produce the video with no face and no voice recording.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            script: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                targetLengthMinutes: { type: Type.INTEGER },
                estimatedDuration: { type: Type.STRING },
                predictedRetention: { type: Type.STRING },
                fiveSecondHook: { type: Type.STRING },
                hookStrategy: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sectionName: { type: Type.STRING },
                      timestamp: { type: Type.STRING },
                      durationSeconds: { type: Type.INTEGER },
                      visualCue: { type: Type.STRING },
                      onScreenText: { type: Type.STRING },
                      editingInstructions: { type: Type.STRING },
                      soundFX: { type: Type.STRING },
                      voiceover: { type: Type.STRING },
                      patternInterruptNote: { type: Type.STRING }
                    },
                    required: [
                      'sectionName',
                      'timestamp',
                      'durationSeconds',
                      'visualCue',
                      'onScreenText',
                      'editingInstructions',
                      'soundFX',
                      'voiceover',
                      'patternInterruptNote'
                    ]
                  }
                },
                compellingEnding: { type: Type.STRING },
                recommendedAiTools: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      pricingTier: { type: Type.STRING },
                      bestFor: { type: Type.STRING },
                      workflowTip: { type: Type.STRING }
                    },
                    required: ['name', 'category', 'pricingTier', 'bestFor', 'workflowTip']
                  }
                },
                ttsNarrationSpeed: { type: Type.STRING }
              },
              required: [
                'title',
                'targetLengthMinutes',
                'estimatedDuration',
                'predictedRetention',
                'fiveSecondHook',
                'hookStrategy',
                'sections',
                'compellingEnding',
                'recommendedAiTools',
                'ttsNarrationSpeed'
              ]
            }
          },
          required: ['script']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.script) {
      return res.json(parsed);
    }
    return res.json({ script: defaultScript });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// API Route 5: Grow to 50,000 Subscribers & High-CTR Lab (Step 5)
// ----------------------------------------------------
app.post('/api/youtube/generate-thumbnail-prompt', async (req: Request, res: Response) => {
  try {
    const { videoTitle, nicheName } = req.body;
    const title = videoTitle || '7 Psychological Habits That Make You Unfazed by Disrespect';
    const niche = nicheName || 'Stoic Philosophy & Dark Psychology';

    const defaultThumbnail = {
      conceptName: 'The Stoic Disdain / Golden Contrast',
      boldHeadline: 'NEVER REACT',
      headlineColor: '#FACC15', // Vibrant Yellow
      backgroundColor: '#090D16',
      focalElement: 'Cracked antique Roman marble bust with golden glowing eyes looking slightly off camera with utter calm.',
      secondaryElement: 'Chaotic red motion blur spikes in the background representing angry mob / verbal chaos.',
      midjourneyPrompt: `/imagine prompt: hyper-realistic close-up of a stoic Roman marble statue of Marcus Aurelius for a ${niche} channel, golden glowing cracks running through the marble, dark textured obsidian background, dramatic cinematic side-lighting with bright warm gold rim light, extreme 8k texture, rule of thirds composition, high contrast, clean negative space on left side for text --ar 16:9 --style raw --v 6.0`,
      ctrPsychologyTips: [
        'Maximum 2-3 words on the thumbnail ("NEVER REACT") in bold sans-serif so mobile viewers decode it in under 0.3 seconds.',
        'High-contrast #FACC15 yellow text against #090D16 obsidian dark background creates an immediate visual stop-trigger in YouTube dark mode.',
        'Complementary Title + Thumbnail rule: never repeat the exact title text on the thumbnail — let the thumbnail create the emotional question and the title provide the specific context.',
        'Keep the bottom-right 15% of the 16:9 canvas completely free of text so YouTube duration timestamps (e.g., 09:40) never block the hook.'
      ],
      dailyPostingSchedule: [
        {
          day: 'Monday',
          format: 'Long-Form Pillar #1 (8–10 mins)',
          whatToPost: `Publish flagship ${niche} deep-dive essay at 2:00 PM EST + pin a polarizing debate question in the comments within 60 seconds of upload.`,
          optimizationFocus: 'Test 2 thumbnail variants in the first 3 hours; aim for >= 7.0% CTR and >= 70% retention at 0:30.'
        },
        {
          day: 'Tuesday',
          format: 'YouTube Short #1 (45–58 secs)',
          whatToPost: 'Extract the most shocking 45-second psychological paradox from Monday’s pillar video with a seamless loop ending.',
          optimizationFocus: 'Attach Monday’s Long-Form video via the native "Related Video" bridge link to funnel Shorts viewers into 9-minute watch time.'
        },
        {
          day: 'Wednesday',
          format: 'YouTube Short #2 + Community Poll',
          whatToPost: `Post a rapid-fire "3 Signs of..." Short at 12:00 PM EST + publish a 4-option image/text Community Poll testing Friday's video title.`,
          optimizationFocus: 'Use the winning Community Poll option (>40% vote share) as Friday’s exact Long-Form title hook.'
        },
        {
          day: 'Thursday',
          format: 'Long-Form Pillar #2 (8–12 mins)',
          whatToPost: `Publish high-demand search + browse ${niche} case study video targeting a high-curiosity pain point.`,
          optimizationFocus: 'Place an open-loop mid-video payoff at the 55% mark and an end-screen handoff to Monday’s video.'
        },
        {
          day: 'Friday',
          format: 'YouTube Short #3 (50–59 secs)',
          whatToPost: 'Post a high-tension story Short with 0.2s zero-dead-air cuts and yellow/white active word captions.',
          optimizationFocus: 'Target >= 78% "Viewed vs. Swiped Away" rate and >= 105% average percentage viewed.'
        },
        {
          day: 'Saturday',
          format: 'Long-Form Pillar #3 OR Viral Synthesis Short #4',
          whatToPost: 'Publish a weekend binge-worthy compilation or contrarian breakdown when competitor upload volume drops.',
          optimizationFocus: 'Optimize end-screen click-through rate (>= 6%) to chain 2+ videos per viewer session.'
        },
        {
          day: 'Sunday',
          format: 'Analytics Audit, Batch Script & Thumbnail Lab',
          whatToPost: 'Publish 1 Community curiosity post + review YouTube Studio CTR/AVD cohorts and batch-produce next week’s 3 Long-Form + 4 Shorts.',
          optimizationFocus: 'Swap thumbnails on any video from the past 7 days sitting below 5.5% CTR.'
        }
      ],
      retentionPlaybook: [
        {
          window: '0:00 – 0:05 (The 5-Second Hook Lock)',
          tactic: 'Visual Proof + Stakes Before Context',
          execution: 'Open immediately on the central conflict or paradox shown in the thumbnail. Zero channel intro bumper, zero "Hey guys, welcome back."',
          retentionLift: '+18% to +24% fewer early drop-offs at the 0:30 mark'
        },
        {
          window: '0:05 – 0:45 (The Open-Loop Contract)',
          tactic: 'Plant the Final Payoff Early',
          execution: 'Tease the most powerful rule or revelation (#4 or #7) within the first 35 seconds so viewers stay until the final third of the video.',
          retentionLift: '+14% lift in mid-roll watch time'
        },
        {
          window: 'Every 20–30 Seconds (Pattern Interrupt Cadence)',
          tactic: 'Multi-Sensory Reset',
          execution: 'Alternate camera zoom keyframes, b-roll angle switches, on-screen kinetic text callouts, and subtle low-frequency riser SFX every 25 seconds.',
          retentionLift: 'Eliminates mid-video flatline decay between 02:00 and 06:00'
        },
        {
          window: 'Final 20 Seconds (Binge-Session Handoff)',
          tactic: 'Abrupt Bridge Without Sign-Off Clichés',
          execution: 'Never say "In conclusion" or "Thanks for watching" (which triggers instant exit). Transition directly into the next problem and point to the on-screen video card.',
          retentionLift: '2.1x higher session watch time & faster Browse algorithm promotion'
        }
      ],
      shortsAndLongFormStrategy: `Use a synchronized "Discovery Feeder -> Depth Pillar" flywheel for ${niche}: publish 4–5 vertical Shorts (45–58s) per week engineered purely for top-of-funnel reach in the Shorts Shelf, and 2–3 Long-Form videos (8–12 mins) per week engineered for Suggested/Browse watch hours and high RPM. Every Short must dramatize ONE razor-sharp micro-hook and use YouTube Studio's native "Related Video" clickable link in the lower third to funnel viewers directly into your matching 9-minute Long-Form video.`,
      weeklyTargets: [
        {
          weekRange: 'Weeks 1–2',
          daysRange: 'Days 1–14',
          subscriberTarget: '0 → 500 Subs',
          weeklyViewsTarget: '10,000 – 25,000 Views',
          ctrTarget: '6.0% – 7.0% CTR',
          retentionTarget: '42%+ AVD (65%+ at 0:30)',
          cadenceSummary: '6 Long-Form + 10 Shorts total',
          primaryFocus: 'Algorithm Seed & Baseline Packaging: train YouTube on your exact audience avatar and identify your #1 highest-CTR topic cluster.'
        },
        {
          weekRange: 'Weeks 3–4',
          daysRange: 'Days 15–30',
          subscriberTarget: '500 → 3,500 Subs',
          weeklyViewsTarget: '60,000 – 140,000 Views',
          ctrTarget: '7.5% – 8.5% CTR',
          retentionTarget: '46%+ AVD (70%+ at 0:30)',
          cadenceSummary: '6 Long-Form + 12 Shorts total',
          primaryFocus: 'Double-Down on Outlier Format: replicate the visual motif and hook cadence of your top 2 videos from Weeks 1–2; unlock full YPP monetization.'
        },
        {
          weekRange: 'Weeks 5–6',
          daysRange: 'Days 31–45',
          subscriberTarget: '3,500 → 18,000 Subs',
          weeklyViewsTarget: '250,000 – 550,000 Views',
          ctrTarget: '8.5% – 9.8% CTR',
          retentionTarget: '50%+ AVD (74%+ at 0:30)',
          cadenceSummary: '6 Long-Form + 14 Shorts total',
          primaryFocus: 'Browse & Suggested Expansion: build 3-part episodic video chains linked via end screens so every new viewer watches 2.4+ videos per session.'
        },
        {
          weekRange: 'Weeks 7–8',
          daysRange: 'Days 46–60',
          subscriberTarget: '18,000 → 50,000+ Subs',
          weeklyViewsTarget: '800,000 – 1.8M+ Views',
          ctrTarget: '9.5% – 11.5% CTR',
          retentionTarget: '52%+ AVD (76%+ at 0:30)',
          cadenceSummary: '6 Long-Form + 14 Shorts total',
          primaryFocus: 'Viral Flywheel & Authority Lock: scale sequel videos to your top-performing outlier hits and convert high-velocity Shorts traffic via Related Video bridges.'
        }
      ],
      analyticsPivots: [
        {
          metricSignal: 'High Impressions, Low CTR (< 5.0%)',
          threshold: 'CTR below 5.0% after 5,000 impressions',
          rootCause: 'Thumbnail is visually cluttered or title lacks an emotional curiosity gap.',
          strategyAdjustment: 'Do NOT delete the video. Within 24 hours, upload a new thumbnail with 2 bold yellow/white words, 1 enlarged focal statue/face, and rewrite the first 45 characters of the title.'
        },
        {
          metricSignal: 'Steep First 30-Second Drop (< 60% still watching at 0:30)',
          threshold: 'More than 40% of viewers leave in the first 30 seconds',
          rootCause: 'Clickbait mismatch or slow throat-clearing intro that delays the promised topic.',
          strategyAdjustment: 'Start the very next script with immediate visual validation of the thumbnail in seconds 0–5 and cut all introductory pleasantries.'
        },
        {
          metricSignal: 'Mid-Video Retention Cliff (Gradual bleed between 02:00–05:00)',
          threshold: 'Average View Duration falls below 40% on 8–10 min videos',
          rootCause: 'Monotone narration pacing or static visuals staying on screen longer than 8 seconds.',
          strategyAdjustment: 'Increase TTS speed to 1.05x, cut every pause >0.3s, and force a visual B-roll change + on-screen kinetic text callout every 20–25 seconds.'
        },
        {
          metricSignal: 'High Views, Low Subscriber Conversion (< 0.8% view-to-sub ratio)',
          threshold: 'Fewer than 80 new subscribers per 10,000 views',
          rootCause: 'Viewers consume the single video as a one-off answer without seeing a reason to join a recurring series.',
          strategyAdjustment: 'Add a 4-second value-driven subscribe hook right after delivering the #1 insight (around 65% mark) and pitch a specific upcoming sequel video at the end.'
        }
      ]
    };

    if (!ai) {
      return res.json({ thumbnail: defaultThumbnail });
    }

    const masterPrompt = `Act as my YouTube growth coach. Create a detailed 60-day growth plan for my ${niche} channel, starting from zero subscribers. Tell me what to post daily, how to optimize titles and thumbnails, how to improve audience retention, and how to use Shorts and long-form videos strategically. Include weekly performance targets and explain how to adjust the strategy based on analytics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${masterPrompt}

Also create a high-CTR YouTube thumbnail blueprint and Midjourney prompt for the flagship video: "${title}" in the "${niche}" niche.`,
      config: {
        systemInstruction: 'You are an elite YouTube growth coach and thumbnail strategist who has scaled multiple faceless channels from 0 to 50,000+ subscribers in 60 days. Return a complete, actionable JSON response matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thumbnail: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                boldHeadline: { type: Type.STRING },
                headlineColor: { type: Type.STRING },
                backgroundColor: { type: Type.STRING },
                focalElement: { type: Type.STRING },
                secondaryElement: { type: Type.STRING },
                midjourneyPrompt: { type: Type.STRING },
                ctrPsychologyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                dailyPostingSchedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      format: { type: Type.STRING },
                      whatToPost: { type: Type.STRING },
                      optimizationFocus: { type: Type.STRING }
                    },
                    required: ['day', 'format', 'whatToPost', 'optimizationFocus']
                  }
                },
                retentionPlaybook: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      window: { type: Type.STRING },
                      tactic: { type: Type.STRING },
                      execution: { type: Type.STRING },
                      retentionLift: { type: Type.STRING }
                    },
                    required: ['window', 'tactic', 'execution', 'retentionLift']
                  }
                },
                shortsAndLongFormStrategy: { type: Type.STRING },
                weeklyTargets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      weekRange: { type: Type.STRING },
                      daysRange: { type: Type.STRING },
                      subscriberTarget: { type: Type.STRING },
                      weeklyViewsTarget: { type: Type.STRING },
                      ctrTarget: { type: Type.STRING },
                      retentionTarget: { type: Type.STRING },
                      cadenceSummary: { type: Type.STRING },
                      primaryFocus: { type: Type.STRING }
                    },
                    required: [
                      'weekRange',
                      'daysRange',
                      'subscriberTarget',
                      'weeklyViewsTarget',
                      'ctrTarget',
                      'retentionTarget',
                      'cadenceSummary',
                      'primaryFocus'
                    ]
                  }
                },
                analyticsPivots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      metricSignal: { type: Type.STRING },
                      threshold: { type: Type.STRING },
                      rootCause: { type: Type.STRING },
                      strategyAdjustment: { type: Type.STRING }
                    },
                    required: ['metricSignal', 'threshold', 'rootCause', 'strategyAdjustment']
                  }
                }
              },
              required: [
                'conceptName',
                'boldHeadline',
                'headlineColor',
                'backgroundColor',
                'focalElement',
                'secondaryElement',
                'midjourneyPrompt',
                'ctrPsychologyTips',
                'dailyPostingSchedule',
                'retentionPlaybook',
                'shortsAndLongFormStrategy',
                'weeklyTargets',
                'analyticsPivots'
              ]
            }
          },
          required: ['thumbnail']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.thumbnail) {
      return res.json({
        thumbnail: {
          ...defaultThumbnail,
          ...parsed.thumbnail,
        }
      });
    }
    return res.json({ thumbnail: defaultThumbnail });
  } catch (error: any) {
    console.error('Error generating thumbnail & 50k growth plan:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// API Route 6: Generate Video SEO & Publishing Kit (Step 6)
// ----------------------------------------------------
app.post('/api/youtube/generate-seo', async (req: Request, res: Response) => {
  try {
    const { videoTitle, nicheName, channelName } = req.body;
    const title = videoTitle || '7 Psychological Habits That Make You Unfazed by Disrespect';
    const channel = channelName || 'Mindset Vault';

    if (!ai) {
      return res.json({
        seo: {
          titleA: '7 Psychological Habits That Make You UNFAZED by Disrespect',
          titleB: 'How Dangerous People React to Disrespect (The 3-Second Rule)',
          titleC: 'The Stoic Secret to Never Getting Angry Ever Again',
          description: `When someone disrespects you, your natural instinct is to fight back or shut down. In this video, we explore the 7 proven psychological habits used by history's most resilient stoics and leaders to remain completely untouchable in the face of insult, aggression, or passive hostility.\n\n📌 Timestamps & Chapters:\n00:00 - The 3-Second Visual Freeze Hook\n00:45 - Habit 1: The Tactical Silence Pause\n02:30 - Habit 2: Agree & Amplify\n04:15 - Habit 3: The Emotional Audit\n06:30 - The Stoic Armor of Epictetus\n08:00 - Master Disrespect & Protect Your Peace\n\n🔔 Subscribe to ${channel} for weekly deep dives into dark psychology, stoic wisdom, and emotional mastery: https://youtube.com/@${channel.replace(/\s+/g, '')}\n\n📚 Recommended Reading:\n• Meditations by Marcus Aurelius\n• The Discourses of Epictetus\n\n⚠️ Disclaimer: The content on this channel is for educational and philosophical contemplation purposes only.`,
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
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate complete YouTube video SEO metadata for title: "${title}", Niche: "${nicheName || 'Stoicism'}", Channel: "${channel}". Include 3 high CTR title variations, full formatted description with chapters, 12-15 targeted tags, pinned engagement comment, and top 5 hashtags.`,
      config: {
        systemInstruction: 'You are a YouTube SEO engineer. Format descriptions with clean emoji bullets, precise timestamp chapters, high ranking search tags, and engagement-bait pinned comments.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seo: {
              type: Type.OBJECT,
              properties: {
                titleA: { type: Type.STRING },
                titleB: { type: Type.STRING },
                titleC: { type: Type.STRING },
                description: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                pinnedComment: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['titleA', 'titleB', 'titleC', 'description', 'tags', 'pinnedComment', 'hashtags']
            }
          },
          required: ['seo']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating SEO:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// Health check
// ----------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// ----------------------------------------------------
// Vite Dev Server / Static Production Serve
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    let viteMiddleware: any = null;
    const viteReady = createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    }).then((vite) => {
      viteMiddleware = vite.middlewares;
      return vite;
    });

    app.use(async (req, res, next) => {
      if (!viteMiddleware) {
        await viteReady;
      }
      return viteMiddleware(req, res, next);
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ChannelForge server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
