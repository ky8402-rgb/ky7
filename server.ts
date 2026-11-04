import express, { Request, Response } from 'express';
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
// API Route 3: Generate 60-Day Content Roadmap (Step 3)
// ----------------------------------------------------
app.post('/api/youtube/generate-content-plan', async (req: Request, res: Response) => {
  try {
    const { nicheName, channelName } = req.body;
    const niche = nicheName || 'Stoic Life Psychology';
    const channel = channelName || 'Mindset Vault';

    if (!ai) {
      return res.json({
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
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a comprehensive 60-day viral content roadmap for the YouTube channel "${channel}" in the niche "${niche}". Include 4 core phase weeks with at least 8 long-form videos and 4 viral shorts, structured with curiosity gap titles, hooks, estimated durations, upload days, and thumbnail angles.`,
      config: {
        systemInstruction: 'You are an algorithmic YouTube strategist. Design high-retention, high-CTR content plans engineered for zero-subscriber takeoff.',
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
                        title: { type: Type.STRING },
                        format: { type: Type.STRING },
                        targetDuration: { type: Type.STRING },
                        uploadDay: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        thumbnailConcept: { type: Type.STRING },
                        predictedCTR: { type: Type.STRING }
                      },
                      required: ['id', 'title', 'format', 'targetDuration', 'uploadDay', 'hook', 'thumbnailConcept', 'predictedCTR']
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
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating content plan:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// API Route 4: Generate Faceless Video Script (Step 4)
// ----------------------------------------------------
app.post('/api/youtube/generate-script', async (req: Request, res: Response) => {
  try {
    const { videoTitle, nicheName, channelName, videoType } = req.body;
    const title = videoTitle || '7 Psychological Habits That Make You Unfazed by Disrespect';
    const niche = nicheName || 'Stoic Life Psychology';

    if (!ai) {
      return res.json({
        script: {
          title,
          estimatedDuration: videoType === 'Shorts' ? '0:55' : '8:45',
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
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Write a complete, high-retention faceless YouTube script for the title "${title}" in the niche "${niche}" (Channel: ${channelName || 'Growth Studio'}). Video format: ${videoType || 'Long-Form'}.
      Include:
      1. Precise timing blocks
      2. Specific visual B-roll cues (describing Midjourney / Pexels clips)
      3. Sound effect (SFX) cues
      4. Verbatim voiceover text crafted for AI TTS readers (natural cadences, commas for breathing pauses)
      5. Pattern interrupts every 30-45 seconds
      6. Binge-loop end CTA directing to another video.`,
      config: {
        systemInstruction: 'You are an elite YouTube scriptwriter who has engineered scripts for channels with millions of views. Focus on tension, curiosity loops, conversational flow, and zero fluff.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            script: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                estimatedDuration: { type: Type.STRING },
                predictedRetention: { type: Type.STRING },
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
                      soundFX: { type: Type.STRING },
                      voiceover: { type: Type.STRING },
                      patternInterruptNote: { type: Type.STRING }
                    },
                    required: ['sectionName', 'timestamp', 'durationSeconds', 'visualCue', 'soundFX', 'voiceover', 'patternInterruptNote']
                  }
                },
                ttsNarrationSpeed: { type: Type.STRING }
              },
              required: ['title', 'estimatedDuration', 'predictedRetention', 'hookStrategy', 'sections', 'ttsNarrationSpeed']
            }
          },
          required: ['script']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// API Route 5: Generate High-CTR Thumbnail Concept & Prompts (Step 5)
// ----------------------------------------------------
app.post('/api/youtube/generate-thumbnail-prompt', async (req: Request, res: Response) => {
  try {
    const { videoTitle, nicheName } = req.body;
    const title = videoTitle || '7 Psychological Habits That Make You Unfazed by Disrespect';
    const niche = nicheName || 'Stoic Psychology';

    if (!ai) {
      return res.json({
        thumbnail: {
          conceptName: 'The Stoic Disdain / Golden Contrast',
          boldHeadline: 'NEVER REACT',
          headlineColor: '#FACC15', // Vibrant Yellow
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
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a high-CTR YouTube thumbnail blueprint and Midjourney prompt for the video: "${title}" in niche "${niche}". Focus on 2-3 word bold text hook, contrasting color palette, facial or psychological focal element, and mobile readability.`,
      config: {
        systemInstruction: 'You are a veteran YouTube thumbnail designer with an average 12%+ CTR track record. Follow YouTube thumbnail best practices: extreme contrast, 2-3 words max, rule of thirds, clear focal point.',
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
                ctrPsychologyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['conceptName', 'boldHeadline', 'headlineColor', 'backgroundColor', 'focalElement', 'secondaryElement', 'midjourneyPrompt', 'ctrPsychologyTips']
            }
          },
          required: ['thumbnail']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating thumbnail concept:', error);
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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ChannelForge server running on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
