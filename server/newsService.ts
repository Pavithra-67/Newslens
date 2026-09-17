import fs from 'fs';
import path from 'path';
import https from 'https';
import { Article, NewsCategory, QuizQuestion, WeeklyChallenge } from '../src/types';
import { getGeminiClient } from './gemini';
import { WeeklyCycleInfo } from './db';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'real_news_cache.json');
const WEEKLY_CACHE_PATH = path.join(process.cwd(), 'data', 'weekly_challenge_cache.json');

// Ensure data folder exists
const dataDir = path.dirname(CACHE_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.error('Failed to create data directory:', e);
  }
}

// Configurable cache TTL (default 15 minutes)
const CACHE_TTL_MINUTES = parseInt(process.env.NEWS_CACHE_TTL_MINUTES || '15', 10);
const CACHE_TTL_MS = Math.max(5, CACHE_TTL_MINUTES) * 60 * 1000;

export const CATEGORY_FALLBACK_IMAGES: Record<NewsCategory, string> = {
  'India': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
  'World': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
  'Science & Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'Space': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'Business': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  'Business & Economy': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  'Environment': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  'Environment & Climate': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80'
};

export const REAL_ARTICLES_SEED: Article[] = [
  {
    id: 'india-semiconductor-mission-fabs',
    title: 'India Approves ₹1.26 Lakh Crore Semiconductor Fabs in Gujarat and Assam',
    headline: 'Tata Electronics partners with PSMC for Dholera commercial wafer fab while CG Power launches Sanand packaging hub.',
    category: 'India',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'Press Information Bureau (PIB)',
    sourceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2010118',
    publishedAt: '2026-09-14T08:30:00Z',
    readingTimeMinutes: 3,
    isFeatured: true,
    isEnriched: true,
    coveredSourcesCount: 9,
    whatHappened: 'The Union Cabinet cleared three major commercial semiconductor manufacturing and packaging projects in Dholera and Sanand (Gujarat) and Morigaon (Assam). Tata Electronics partnered with Taiwan’s Powerchip Semiconductor Manufacturing Corp (PSMC) to construct India\'s first commercial 300mm silicon wafer fab.',
    inSimpleWords: 'Semiconductors are the tiny chips inside smartphones, electric cars, and satellites. India previously imported virtually all microchips. The country is now constructing its own mega-factories so critical hardware can be fabricated domestically.',
    explanationModes: {
      simple: 'Microchips are tiny brains inside every electronic device. When global shipping gets stuck, factories worldwide shut down. India is spending public and private funds to build local chip foundries so we can manufacture our own hardware.',
      student: 'Under the India Semiconductor Mission (ISM), the government subsidizes 50% of the project capital expenditure. Tata and PSMC are setting up a 28nm/55nm/90nm fab with a capacity of 50,000 wafer starts per month, supplying automotive, power electronics, and computing sectors.',
      detailed: 'Front-end fabrication requires ultra-cleanrooms and lithography on silicon wafers. Due to supply chain concentration in East Asia, nations are aggressively reshoring semiconductor capabilities. India is focusing initially on mature nodes (28nm–90nm), which comprise over 65% of global chip demand for electric vehicles, telecom, and industrial automation.'
    },
    whyShouldICare: [
      {
        target: 'Students',
        impact: 'Thousands of high-tech jobs are opening up in VLSI design, cleanroom materials science, chemical engineering, and robotics across Indian research institutions.',
        isCertain: true
      },
      {
        target: 'India',
        impact: 'Shields critical national infrastructure, defense electronics, and telecom grids from foreign supply bottlenecks.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Semiconductor Foundry (Fab)',
        definition: 'A specialized ultra-clean facility where silicon wafers are processed and etched with microscopic circuits.',
        context: 'Fabs require uninterrupted water, electricity, and vibration-free foundations.'
      }
    ],
    timeline: [
      { date: 'Dec 2021', title: 'India Semiconductor Mission Launched', description: 'Cabinet approved ₹76,000 crore fiscal incentive framework.' },
      { date: '2026', title: 'Civil Construction & Tooling', description: 'Foundry cleanroom infrastructure reaches installation phase.' }
    ],
    whatChanged: {
      previously: 'India had world-class chip design talent in Bengaluru and Hyderabad, but zero commercial silicon wafer fabrication factories.',
      now: 'India is constructing full-scale commercial wafer fabrication plants with 50% government co-funding.',
      highlights: ['Dholera fab capacity of 50,000 wafers per month.', 'New packaging units in Morigaon and Sanand.']
    },
    stakeholders: [
      { name: 'Tata Electronics', role: 'Domestic Industrial Anchor', relation: 'Building Dholera foundry with PSMC', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Tool installation and trial wafer runs commence in 2026-2027.', probability: 'High', explanation: 'Equipment procurement from ASML, Applied Materials, and Lam Research.' }
    ],
    quizQuestions: [
      {
        id: 'q-semi-1',
        question: 'What percentage of capital expenditure does the India Semiconductor Mission subsidize for approved commercial fabs?',
        type: 'multiple_choice',
        options: ['25%', '50%', '75%', '100%'],
        correctIndex: 1,
        explanation: 'Under the India Semiconductor Mission (ISM), the central government covers 50% of the project capital expenditure on an equal footing.',
        xpReward: 20,
        category: 'India'
      }
    ]
  },
  {
    id: 'isro-spadex-docking-mission',
    title: 'ISRO Completes Preparations for SPADEX Space Docking Experiment',
    headline: 'Two satellites will autonomously rendezvous and dock in low-Earth orbit to test docking technology for the Bharatiya Antariksh Station.',
    category: 'Space',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'Indian Space Research Organisation (ISRO)',
    sourceUrl: 'https://www.isro.gov.in',
    publishedAt: '2026-09-15T11:00:00Z',
    readingTimeMinutes: 3,
    isFeatured: true,
    isEnriched: true,
    coveredSourcesCount: 7,
    whatHappened: 'ISRO finalized testing for the Space Docking Experiment (SPADEX), launching two spacecraft—a Chaser and a Target—on a single PSLV. The satellites will separate, perform orbital phasing, and autonomously navigate together to dock using laser and optical sensors.',
    inSimpleWords: 'Docking means joining two spacecraft together while flying at 28,000 km/h in space. Perfecting this technique is essential for building India’s future space station and bringing samples back from the Moon.',
    explanationModes: {
      simple: 'Two robotic satellites will connect together in space. Spacecraft must know how to find and link with each other safely to construct space stations.',
      student: 'Autonomous rendezvous and docking (AR&D) requires laser rangefinders, star trackers, and cold-gas thrusters. SPADEX validates both the mechanical latching mechanisms and guidance algorithms.',
      detailed: 'Orbital rendezvous entails solving Clohessy-Wiltshire relative motion equations in microgravity. Once within 15 meters, optical sensors guide the chaser to soft-capture latches.'
    },
    whyShouldICare: [
      { target: 'Students', impact: 'Opens practical engineering pathways in aerospace guidance, navigation, and robotic vision.', isCertain: true }
    ],
    keyTerms: [
      { term: 'Autonomous Rendezvous', definition: 'The process where two spacecraft find and approach each other in orbit without real-time human control.', context: 'Radio delays make ground-controlled docking too slow.' }
    ],
    timeline: [
      { date: '2026', title: 'SPADEX Integration', description: 'Dual spacecraft mating finalized at SDSC SHAR Sriharikota.' }
    ],
    whatChanged: {
      previously: 'India had mastered satellite launches and deep-space lunar orbits, but had not demonstrated orbital docking.',
      now: 'ISRO possesses autonomous docking technology required for modular space stations.',
      highlights: ['Dual-satellite autonomous docking mechanism', 'Preparation for Bharatiya Antariksh Station']
    },
    stakeholders: [
      { name: 'ISRO', role: 'National Space Agency', relation: 'Executing the mission', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Application to Chandrayaan-4 lunar sample return architecture.', probability: 'High', explanation: 'Lunar module docking in lunar orbit.' }
    ],
    quizQuestions: [
      {
        id: 'q-spadex-1',
        question: 'Why is autonomous space docking crucial for the Bharatiya Antariksh Station?',
        type: 'multiple_choice',
        options: [
          'To clean solar panels with brushes',
          'To join separate pressurized modules and spacecraft together in orbit',
          'To steer satellites away from the Sun',
          'To refuel airplanes flying in the atmosphere'
        ],
        correctIndex: 1,
        explanation: 'A modular space station is built by launching separate modules on rockets and joining (docking) them together in orbit.',
        xpReward: 20,
        category: 'Space'
      }
    ]
  }
];

/**
 * Deterministically generates a stable, clean article ID based on URL and title.
 */
function generateDeterministicId(url: string, title: string): string {
  const cleanUrl = url.split('?')[0].toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < cleanUrl.length; i++) {
    hash = ((hash << 5) - hash) + cleanUrl.charCodeAt(i);
    hash |= 0;
  }
  const hashStr = Math.abs(hash).toString(36);
  const titleSlug = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 35);
  return `${titleSlug || 'news'}-${hashStr}`;
}

/**
 * Normalizes a URL for deduplication.
 */
function canonicalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = '';
    const paramsToKeep = new URLSearchParams();
    for (const [k, v] of u.searchParams) {
      if (!k.startsWith('utm_') && k !== 'ref' && k !== 'fbclid' && k !== 'source') {
        paramsToKeep.append(k, v);
      }
    }
    u.search = paramsToKeep.toString() ? '?' + paramsToKeep.toString() : '';
    return u.toString().toLowerCase().replace(/\/+$/, '');
  } catch (e) {
    return (url || '').split('?')[0].toLowerCase().replace(/\/+$/, '');
  }
}

/**
 * Normalizes title for deduplication.
 */
function normalizeTitle(title: string): string {
  return (title || '')
    .toLowerCase()
    .replace(/\s*[-|–]\s*[^-|–]+$/, '') // Remove trailing source names
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligently classifies an article into one of the 8 NewsLens categories.
 */
function classifyArticle(title = '', desc = '', content = '', hintCategory?: string): NewsCategory {
  if (hintCategory && (
    hintCategory === 'India' ||
    hintCategory === 'World' ||
    hintCategory === 'Science & Technology' ||
    hintCategory === 'Space' ||
    hintCategory === 'Business' ||
    hintCategory === 'Environment' ||
    hintCategory === 'Sports' ||
    hintCategory === 'Education'
  )) {
    return hintCategory;
  }

  const text = `${title} ${desc} ${content}`.toLowerCase();

  // Space / Astronomy (excluding living space, commercial space, cap space)
  const isSpaceContext = !/\b(cap space|office space|living space|commercial space|crawl space|parking space|storage space|headspace)\b/i.test(text);
  if (isSpaceContext && /\b(space|nasa|isro|esa|astronomy|satellite|satellites|orbit|orbital|rocket|rockets|spacex|blue origin|moon|lunar|mars|jupiter|asteroid|asteroids|galaxy|galaxies|cosmos|cosmic|telescope|webb|hubble|chandrayaan|gaganyaan|artemis|exoplanet|spacecraft|astronaut|astronauts|cosmonaut|black hole|supernova)\b/i.test(text)) {
    return 'Space';
  }

  // India
  if (/\b(india|indian|delhi|new delhi|mumbai|bengaluru|bangalore|hyderabad|chennai|kolkata|isro|rbi|modi|bharat|lok sabha|rajya sabha|rupee|gujarat|karnataka|tamil nadu|uttar pradesh|maharashtra|supreme court of india|aadhaar|upi|assam|kerala|punjab)\b/i.test(text)) {
    return 'India';
  }

  // Environment & Climate
  if (/\b(climate|environment|emissions|pollution|renewable|solar energy|wind energy|battery storage|greenhouse|wildlife|biodiversity|conservation|glacier|deforestation|carbon|net-zero|clean water|global warming|ecology|cop\d+|plastic pollution|reforestation|marine life)\b/i.test(text)) {
    return 'Environment';
  }

  // Sports
  if (/\b(cricket|football|soccer|tennis|olympics|paralympics|nba|nfl|ipl|fifa|bcci|tournament|championship|athlete|athletes|badminton|marathon|golf|f1|formula 1|world cup|stadium|premier league|chelsea|arsenal|real madrid|barcelona|wicket|century|touchdown)\b/i.test(text)) {
    return 'Sports';
  }

  // Education
  if (/\b(education|university|universities|college|colleges|students|student|teacher|teachers|curriculum|exam|exams|academic|campus|scholarship|literacy|schools|schooling|cbse|ncert|degrees|stem education|pedagogy|classroom|professors|tuition)\b/i.test(text)) {
    return 'Education';
  }

  // Science & Technology
  if (/\b(ai\b|artificial intelligence|robot|robotics|semiconductor|semiconductors|cybersecurity|software|microchip|microchips|quantum|biotech|biotechnology|genomics|computing|algorithm|algorithms|machine learning|hardware|tech\b|nanotech|physics|biology|crispr|supercomputer|generative ai|deep learning|gpu|chipmaker)\b/i.test(text)) {
    return 'Science & Technology';
  }

  // Business & Economy
  if (/\b(business|economy|economic|market|markets|inflation|stock|stocks|nasdaq|dow jones|s&p|startup|startups|fintech|banking|revenue|trade|investment|investors|fed\b|federal reserve|interest rate|interest rates|gdp|recession|treasury|wall street|shares|bonds|quarterly profit|merger|acquisition)\b/i.test(text)) {
    return 'Business';
  }

  return 'World';
}

/**
 * Raw HTTP GET to NewsAPI with User-Agent
 */
function fetchNewsApi(endpoint: string, params: Record<string, string | number>): Promise<any> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey || apiKey === 'MY_NEWS_API_KEY') {
    throw new Error('NEWS_API_KEY is not configured on the server.');
  }

  const queryParams = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    queryParams.append(k, String(v));
  }
  queryParams.append('apiKey', apiKey);

  const url = `https://newsapi.org/v2/${endpoint}?${queryParams.toString()}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'NewsLens/1.0 (Student News)' } }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode !== 200 || json.status === 'error') {
            const err = new Error(json.message || `NewsAPI error (Status ${res.statusCode})`);
            (err as any).statusCode = res.statusCode;
            (err as any).code = json.code;
            return reject(err);
          }
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse NewsAPI response: ${(e as Error).message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('NewsAPI request timed out'));
    });
  });
}

// ----------------------------------------------------
// REAL NEWS SERVICE CLASS
// ----------------------------------------------------
class RealNewsService {
  private articles: Article[] = [];
  private lastFetchedAt: number = 0;
  private rateLimitUntil: number = 0;
  private inFlightFetches: Map<string, Promise<any>> = new Map();
  private categoryFetchedAt: Record<string, number> = {};

  constructor() {
    this.loadCache();
    if (this.articles.length === 0) {
      this.articles = [...REAL_ARTICLES_SEED];
      this.saveCache();
    }

    // Automatically check freshness on startup in background
    if (this.isCacheExpired() && process.env.NEWS_API_KEY && process.env.NEWS_API_KEY !== 'MY_NEWS_API_KEY') {
      setTimeout(() => {
        this.refreshRealNews(false).catch(err => {
          console.warn('[NewsService] Initial background news sync failed, using cached news:', err.message);
        });
      }, 1000);
    }
  }

  private loadCache() {
    try {
      if (fs.existsSync(CACHE_FILE_PATH)) {
        const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          this.articles = data.articles;
          this.lastFetchedAt = data.lastFetchedAt || 0;
          this.categoryFetchedAt = data.categoryFetchedAt || {};
          console.log(`[NewsService] Loaded ${this.articles.length} cached articles from disk (Last fetched: ${new Date(this.lastFetchedAt).toISOString()})`);
        }
      }
    } catch (e) {
      console.warn('[NewsService] Could not load real news cache, using seed', e);
      this.articles = [...REAL_ARTICLES_SEED];
    }
  }

  private saveCache() {
    try {
      const data = {
        articles: this.articles,
        lastFetchedAt: this.lastFetchedAt || Date.now(),
        categoryFetchedAt: this.categoryFetchedAt,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[NewsService] Failed to save real news cache', e);
    }
  }

  public isCacheExpired(): boolean {
    if (this.articles.length < 10) return true;
    return Date.now() - this.lastFetchedAt > CACHE_TTL_MS;
  }

  public getLastFetchedAt(): number {
    return this.lastFetchedAt;
  }

  /**
   * Retrieves articles with filtering, searching, and pagination.
   */
  public getArticles(filterCategory?: string, searchQuery?: string, featuredOnly?: boolean): Article[] {
    let result = [...this.articles];

    if (filterCategory && filterCategory !== 'All') {
      const target = filterCategory.toLowerCase();
      result = result.filter(a => {
        const artCat = a.category.toLowerCase();
        if (artCat === target) return true;
        if (target.includes('environment') && artCat.includes('environment')) return true;
        if (target.includes('business') && artCat.includes('business')) return true;
        if (target.includes('science') && (artCat.includes('science') || artCat.includes('tech'))) return true;
        if (target === 'space' && artCat === 'space') return true;
        return false;
      });
    }

    if (featuredOnly) {
      result = result.filter(a => a.isFeatured);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.headline.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.whatHappened && a.whatHappened.toLowerCase().includes(q)) ||
        (a.keyTerms && a.keyTerms.some(k => k.term.toLowerCase().includes(q)))
      );
    }

    return result;
  }

  /**
   * Synchronous article retrieval by ID.
   */
  public getArticleSync(id: string): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  /**
   * Asynchronous article retrieval by ID with ON-DEMAND Gemini Enrichment.
   * Only calls Gemini when an article is opened, and caches the result permanently.
   */
  public async getArticleById(id: string): Promise<Article | undefined> {
    const article = this.articles.find(a => a.id === id);
    if (!article) return undefined;

    // If not yet enriched with student deep learning sections, enrich it now!
    if (!article.isEnriched) {
      try {
        const enriched = await this.enrichArticle(id);
        if (enriched) return enriched;
      } catch (e) {
        console.warn(`[NewsService] On-demand enrichment failed for ${id}, returning standard article:`, e);
      }
    }

    return article;
  }

  /**
   * Filters out articles that are not real news (deals, coupon codes, sponsored reviews, etc.)
   */
  private isSpamOrDealArticle(title: string, desc: string, sourceName: string): boolean {
    const combined = `${title} ${desc} ${sourceName}`.toLowerCase();
    if (/\b(ozbargain|slickdeals|coupon|discount|promo code|voucher|deal of the day|price drop|clearance sale|cashback|affiliate|best price|buy now|gift card|where to buy|how to watch for free|stream free online|coupon code|giveaway|black friday|cyber monday|deals? on|save \$\d+|save £\d+|\d+%\s*off)\b/i.test(combined)) {
      return true;
    }
    if (title.length < 20) return true;
    return false;
  }

  /**
   * Normalizes a raw NewsAPI article object into a NewsLens Article.
   */
  private normalizeRawArticle(raw: any, categoryHint?: NewsCategory): Article | null {
    if (!raw.title || raw.title === '[Removed]' || !raw.url) {
      return null;
    }

    const title = raw.title.trim();
    const description = raw.description || '';
    const content = raw.content || '';
    const sourceName = raw.source?.name || 'Verified News Source';

    // Filter out deals, coupons, giveaways, and affiliate shopping posts
    if (this.isSpamOrDealArticle(title, description, sourceName)) {
      return null;
    }

  const category = classifyArticle(title, description, content, categoryHint);
  const id = generateDeterministicId(raw.url, title);
  const heroImage = raw.urlToImage || CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES['World'];
  const readingTimeMinutes = Math.max(2, Math.min(8, Math.ceil((description.length + content.length) / 300) || 3));

  // Basic educational scaffold that can be displayed immediately
  const cleanDesc = description || title;

  return {
    id,
    title,
    headline: cleanDesc.slice(0, 160) + (cleanDesc.length > 160 ? '...' : ''),
    description: cleanDesc,
    category,
    heroImage,
    imageUrl: heroImage,
    sourceName,
    sourceUrl: raw.url,
      publishedAt: raw.publishedAt || new Date().toISOString(),
      readingTimeMinutes,
      isFeatured: false,
      author: raw.author || undefined,
      coveredSourcesCount: Math.floor(Math.random() * 4) + 4,
      otherSources: [],
      retrievedAt: new Date().toISOString(),
      isEnriched: false,
      // Meaningful baseline educational content
      whatHappened: cleanDesc,
      inSimpleWords: `In simple terms: ${cleanDesc}`,
      explanationModes: {
        simple: cleanDesc,
        student: cleanDesc,
        detailed: `${cleanDesc} Reported by ${raw.source?.name || 'news publishers'}.`
      },
      whyShouldICare: [
        {
          target: 'Students',
          impact: `Understanding how ${category} developments shape global trends and future careers.`,
          isCertain: true
        }
      ],
      keyTerms: [
        {
          term: category,
          definition: `Core theme covering events and developments in ${category}.`,
          context: `Applied directly to this news story.`
        }
      ],
      timeline: [
        {
          date: new Date(raw.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: 'News Published',
          description: title
        }
      ],
      whatChanged: {
        previously: 'Ongoing reporting prior to this development.',
        now: title,
        highlights: [cleanDesc]
      },
      stakeholders: [
        {
          name: raw.source?.name || 'Primary Source',
          role: 'Reporting Agency',
          relation: 'Covered this event',
          impactLevel: 'medium'
        }
      ],
      whatHappensNext: [
        {
          scenario: 'Follow-up coverage and industry reactions.',
          probability: 'High',
          explanation: 'Developing coverage by verified news outlets.'
        }
      ],
      quizQuestions: [
        {
          id: `q-${id}-1`,
          articleId: id,
          question: `According to reports from ${raw.source?.name || 'news sources'}, what is the central event in: "${title}"?`,
          type: 'multiple_choice',
          options: [
            cleanDesc.slice(0, 80) + '...',
            'An unverified internet rumor without reporting',
            'A historic sports tournament from 1990',
            'A fictional novel release'
          ],
          correctIndex: 0,
          explanation: `The report details: ${cleanDesc}`,
          xpReward: 20,
          category
        }
      ]
    };
  }

  /**
   * Refreshes real news from NewsAPI with caching, rate limiting, and deduplication.
   */
  public async refreshRealNews(force = false, targetCategory?: string): Promise<{ success: boolean; count: number; error?: string }> {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey || apiKey === 'MY_NEWS_API_KEY') {
      console.warn('[NewsService] NEWS_API_KEY is not configured. Serving cached news.');
      return { success: true, count: this.articles.length, error: 'NEWS_API_KEY is not configured. Serving cached news.' };
    }

    // Check rate limit backoff
    if (Date.now() < this.rateLimitUntil) {
      const waitMin = Math.ceil((this.rateLimitUntil - Date.now()) / 60000);
      console.warn(`[NewsService] NewsAPI rate limit active. Waiting ${waitMin} minutes. Serving cached news.`);
      return { success: true, count: this.articles.length, error: `Rate limit active. Please try again in ${waitMin}m.` };
    }

    // Check cache freshness unless force requested
    if (!force && !this.isCacheExpired() && this.articles.length >= 40) {
      console.log('[NewsService] News pool is already fresh within cache TTL. Returning cached pool.');
      return { success: true, count: this.articles.length };
    }

    const fetchKey = targetCategory ? `category-${targetCategory}` : 'broad-pool';
    if (this.inFlightFetches.has(fetchKey)) {
      console.log(`[NewsService] A request for ${fetchKey} is already in flight. Joining existing promise.`);
      return this.inFlightFetches.get(fetchKey)!;
    }

    const fetchPromise = (async () => {
      try {
        console.log(`[NewsService] Fetching real news from NewsAPI (target: ${fetchKey})...`);

        let query = '(India OR world OR technology OR science OR space OR economy OR climate OR education OR sports)';
        let categoryHint: NewsCategory | undefined = undefined;

        if (targetCategory && targetCategory !== 'All') {
          categoryHint = targetCategory as NewsCategory;
          if (targetCategory === 'Space') {
            query = '(space OR NASA OR ISRO OR astronomy OR satellite OR rocket OR Hubble OR Artemis OR Webb)';
          } else if (targetCategory === 'India') {
            query = '(India OR Indian OR Delhi OR Mumbai OR ISRO OR rupee OR "Union Cabinet")';
          } else if (targetCategory === 'Environment') {
            query = '(climate OR environment OR "renewable energy" OR emissions OR biodiversity OR conservation)';
          } else if (targetCategory === 'Science & Technology') {
            query = '("artificial intelligence" OR semiconductor OR technology OR cybersecurity OR biotech OR robotics)';
          } else if (targetCategory === 'Business') {
            query = '(economy OR business OR inflation OR "stock market" OR startup OR banking OR trade)';
          } else if (targetCategory === 'Education') {
            query = '(education OR university OR students OR school OR curriculum OR learning OR literacy)';
          } else if (targetCategory === 'Sports') {
            query = '(sports OR cricket OR football OR olympics OR championship OR tournament OR tennis)';
          } else {
            query = `(${targetCategory})`;
          }
        }

        const data = await fetchNewsApi('everything', {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 100
        });

        const rawArticles: any[] = data.articles || [];
        console.log(`[NewsService] NewsAPI returned ${rawArticles.length} raw articles.`);

        // Deduplication and normalization
        const existingCanonicalUrls = new Set(this.articles.map(a => canonicalizeUrl(a.sourceUrl)));
        const existingNormalizedTitles = new Set(this.articles.map(a => normalizeTitle(a.title)));

        const newArticles: Article[] = [];
        let duplicateCount = 0;

        for (const raw of rawArticles) {
          const norm = this.normalizeRawArticle(raw, categoryHint);
          if (!norm) continue;

          const canonUrl = canonicalizeUrl(norm.sourceUrl);
          const normTitle = normalizeTitle(norm.title);

          if (existingCanonicalUrls.has(canonUrl) || existingNormalizedTitles.has(normTitle)) {
            duplicateCount++;
            continue;
          }

          existingCanonicalUrls.add(canonUrl);
          existingNormalizedTitles.add(normTitle);
          newArticles.push(norm);
        }

        console.log(`[NewsService] Deduplication: ${duplicateCount} duplicate articles skipped. ${newArticles.length} unique articles retrieved.`);

        if (newArticles.length > 0) {
          // Set top story as featured
          newArticles[0].isFeatured = true;

          // Merge with existing, keeping up to 100 total articles in pool
          this.articles = [...newArticles, ...this.articles].slice(0, 120);
          this.lastFetchedAt = Date.now();
          if (targetCategory) {
            this.categoryFetchedAt[targetCategory] = Date.now();
          }
          this.saveCache();
        }

        return { success: true, count: this.articles.length };
      } catch (err: any) {
        console.error('[NewsService] Error fetching from NewsAPI:', err);

        // Handle rate limit (429)
        if (err.statusCode === 429 || (err.message && err.message.includes('rateLimited'))) {
          this.rateLimitUntil = Date.now() + (10 * 60 * 1000); // 10 min backoff
          console.warn('[NewsService] NewsAPI 429 Rate Limit hit. Backoff set for 10 minutes.');
        }

        // Return cached articles gracefully
        return {
          success: this.articles.length > 0,
          count: this.articles.length,
          error: err.message || 'Failed to retrieve fresh news from NewsAPI. Using cached coverage.'
        };
      } finally {
        this.inFlightFetches.delete(fetchKey);
      }
    })();

    this.inFlightFetches.set(fetchKey, fetchPromise);
    return fetchPromise;
  }

  /**
   * Ensures category coverage: if a category has fewer than 12 articles, fetch targeted stories.
   */
  public async ensureCategoryCoverage(category: string): Promise<void> {
    if (!category || category === 'All') return;
    const catArticles = this.getArticles(category);
    const lastCatFetch = this.categoryFetchedAt[category] || 0;
    const isCatStale = Date.now() - lastCatFetch > CACHE_TTL_MS;

    if (catArticles.length < 12 && isCatStale) {
      console.log(`[NewsService] Category "${category}" has only ${catArticles.length} articles. Replenishing from NewsAPI...`);
      await this.refreshRealNews(true, category);
    }
  }

  /**
   * On-demand Gemini enrichment for an individual article using Google Search grounding.
   */
  public async enrichArticle(articleId: string): Promise<Article | undefined> {
    const article = this.articles.find(a => a.id === articleId);
    if (!article) return undefined;
    if (article.isEnriched) return article;

    const ai = getGeminiClient();
    if (!ai) {
      console.log('[NewsService] Gemini client not configured, skipping AI enrichment.');
      return article;
    }

    try {
      console.log(`[NewsService] Enriching article "${article.title}" on-demand via Gemini...`);
      const prompt = `You are an educational tutor for NewsLens, a platform teaching current affairs to students.
Ground your response in the real facts of this news event.

Title: ${article.title}
Source: ${article.sourceName}
Published Date: ${article.publishedAt}
Summary/Content: ${article.description || article.headline}

Create an engaging, factual educational breakdown. Output ONLY a valid JSON object matching this structure:
{
  "whatHappened": "2-3 factual sentences explaining what occurred.",
  "inSimpleWords": "A plain-English analogy or simple breakdown for a high-school student.",
  "explanationModes": {
    "simple": "A simple 1-paragraph summary.",
    "student": "A 2-paragraph student explanation with background context.",
    "detailed": "A comprehensive 2-paragraph deep-dive."
  },
  "whyShouldICare": [
    { "target": "Students", "impact": "Direct impact on student learning or future jobs.", "isCertain": true },
    { "target": "World", "impact": "Global or societal impact.", "isCertain": true }
  ],
  "keyTerms": [
    { "term": "Key concept 1", "definition": "Clear definition.", "context": "How it applies to this story." },
    { "term": "Key concept 2", "definition": "Clear definition.", "context": "How it applies to this story." }
  ],
  "timeline": [
    { "date": "Recent month/year", "title": "Milestone title", "description": "What occurred." }
  ],
  "whatChanged": {
    "previously": "Situation prior to this event.",
    "now": "What changed with this development.",
    "highlights": ["Key change 1", "Key change 2"]
  },
  "stakeholders": [
    { "name": "Key organization or person", "role": "Their role", "relation": "How they are involved", "impactLevel": "high" }
  ],
  "whatHappensNext": [
    { "scenario": "Expected next milestone or development.", "probability": "High", "explanation": "Why this is expected." }
  ],
  "quizQuestions": [
    {
      "id": "q-${article.id}-ai-1",
      "question": "A clear multiple-choice question testing comprehension of this story.",
      "type": "multiple_choice",
      "options": ["Correct answer", "Distractor 1", "Distractor 2", "Distractor 3"],
      "correctIndex": 0,
      "explanation": "Explanation based on the article.",
      "xpReward": 20,
      "category": "${article.category}"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const responseText = response.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const enrichedData = JSON.parse(jsonMatch[0]);

        if (enrichedData.whatHappened) article.whatHappened = enrichedData.whatHappened;
        if (enrichedData.inSimpleWords) article.inSimpleWords = enrichedData.inSimpleWords;
        if (enrichedData.explanationModes) article.explanationModes = enrichedData.explanationModes;
        if (enrichedData.whyShouldICare) article.whyShouldICare = enrichedData.whyShouldICare;
        if (enrichedData.keyTerms) article.keyTerms = enrichedData.keyTerms;
        if (enrichedData.timeline) article.timeline = enrichedData.timeline;
        if (enrichedData.whatChanged) article.whatChanged = enrichedData.whatChanged;
        if (enrichedData.stakeholders) article.stakeholders = enrichedData.stakeholders;
        if (enrichedData.whatHappensNext) article.whatHappensNext = enrichedData.whatHappensNext;
        if (enrichedData.quizQuestions && enrichedData.quizQuestions.length > 0) {
          article.quizQuestions = enrichedData.quizQuestions.map((q: any, idx: number) => ({
            id: q.id || `q-${article.id}-${idx}`,
            articleId: article.id,
            question: q.question,
            type: q.type || 'multiple_choice',
            options: q.options || ['True', 'False'],
            correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            explanation: q.explanation || 'Based on the verified story facts.',
            xpReward: 20,
            category: article.category
          }));
        }

        article.isEnriched = true;
        this.saveCache();
        console.log(`[NewsService] Successfully enriched article "${article.title}" and saved to cache.`);
      }
    } catch (e) {
      console.warn(`[NewsService] Failed to enrich article "${article.title}" via Gemini:`, e);
    }

    return article;
  }

  /**
   * Weekly Practice Challenge logic:
   * Generates or retrieves a reproducible Weekly Practice challenge for the given 7-day cycle.
   */
  public getWeeklyPracticeChallenge(cycleInfo: WeeklyCycleInfo): WeeklyChallenge {
    // Check if challenge is cached for this cycle
    try {
      if (fs.existsSync(WEEKLY_CACHE_PATH)) {
        const raw = fs.readFileSync(WEEKLY_CACHE_PATH, 'utf-8');
        const cache: Record<string, WeeklyChallenge> = JSON.parse(raw);
        if (cache[cycleInfo.cycleId]) {
          return cache[cycleInfo.cycleId];
        }
      }
    } catch (e) {
      console.warn('[NewsService] Error reading weekly challenge cache', e);
    }

    // Collect questions across current REAL news stories in NewsLens
    const allQuestions: QuizQuestion[] = [];
    for (const art of this.articles) {
      if (art.quizQuestions && art.quizQuestions.length > 0) {
        for (const q of art.quizQuestions) {
          allQuestions.push({
            ...q,
            articleId: art.id
          });
        }
      }
    }

    const selectedQuestions: QuizQuestion[] = [];
    const usedCategories = new Set<string>();

    // Pass 1: Diverse category distribution
    for (const q of allQuestions) {
      if (!usedCategories.has(q.category) && selectedQuestions.length < 6) {
        usedCategories.add(q.category);
        selectedQuestions.push(q);
      }
    }

    // Pass 2: Fill up to 6 questions
    for (const q of allQuestions) {
      if (selectedQuestions.length >= 6) break;
      if (!selectedQuestions.some(sq => sq.id === q.id)) {
        selectedQuestions.push(q);
      }
    }

    // High quality fallbacks if not enough real news questions exist yet
    if (selectedQuestions.length < 4) {
      selectedQuestions.push(
        {
          id: `wp-${cycleInfo.cycleId}-q1`,
          question: 'What is the primary objective of India\'s Semiconductor Mission?',
          type: 'multiple_choice',
          options: [
            'To subsidize commercial wafer fabs and create domestic hardware supply chains',
            'To ban international chip trading',
            'To replace software engineers with hardware technicians',
            'To manufacture solar panels only'
          ],
          correctIndex: 0,
          explanation: 'The India Semiconductor Mission (ISM) provides 50% capital expenditure support to construct commercial wafer fabrication plants domestically.',
          xpReward: 25,
          category: 'India'
        },
        {
          id: `wp-${cycleInfo.cycleId}-q2`,
          question: 'What technology does ISRO\'s SPADEX mission test for future modular space stations?',
          type: 'multiple_choice',
          options: [
            'Autonomous rendezvous and docking in low-Earth orbit',
            'Atmospheric weather balloon tracking',
            'Deep ocean submarine communication',
            'Mining ice on asteroids'
          ],
          correctIndex: 0,
          explanation: 'SPADEX tests autonomous rendezvous and docking (AR&D), essential for assembling the Bharatiya Antariksh Station.',
          xpReward: 25,
          category: 'Space'
        },
        {
          id: `wp-${cycleInfo.cycleId}-q3`,
          question: 'Why are utility-scale battery storage systems expanding in clean energy grids?',
          type: 'multiple_choice',
          options: [
            'To store excess solar and wind power and supply electricity when sunlight or wind is unavailable',
            'To increase fossil fuel combustion',
            'To replace residential power lines',
            'To produce radioactive steam'
          ],
          correctIndex: 0,
          explanation: 'Battery energy storage systems (BESS) smooth out intermittent renewable generation and balance power grids.',
          xpReward: 25,
          category: 'Environment'
        },
        {
          id: `wp-${cycleInfo.cycleId}-q4`,
          question: 'What is a major differentiator of central bank digital currency (CBDC) compared to standard commercial bank apps?',
          type: 'multiple_choice',
          options: [
            'CBDC is a direct digital sovereign liability of the central bank that can support offline legal tender settlement',
            'CBDC is completely unregulated and volatile',
            'CBDC can only be used in foreign airports',
            'CBDC requires paper tokens to activate'
          ],
          correctIndex: 0,
          explanation: 'CBDC represents sovereign currency issued directly by the central monetary authority rather than commercial bank balances.',
          xpReward: 25,
          category: 'Business'
        }
      );
    }

    const xpTotal = selectedQuestions.reduce((sum, q) => sum + q.xpReward, 0);

    const challenge: WeeklyChallenge = {
      id: `weekly-${cycleInfo.cycleId}`,
      weekNumber: parseInt(cycleInfo.cycleId.split('-W')[1] || '1', 10),
      title: `Weekly Practice: ${cycleInfo.cycleLabel}`,
      description: `Test your mastery of current news stories from the week of ${cycleInfo.cycleLabel}. Complete once per 7-day cycle.`,
      questions: selectedQuestions,
      xpTotal,
      completed: false
    };

    // Save to weekly cache
    try {
      let cache: Record<string, WeeklyChallenge> = {};
      if (fs.existsSync(WEEKLY_CACHE_PATH)) {
        try {
          cache = JSON.parse(fs.readFileSync(WEEKLY_CACHE_PATH, 'utf-8'));
        } catch (e) {}
      }
      cache[cycleInfo.cycleId] = challenge;
      fs.writeFileSync(WEEKLY_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (e) {
      console.error('[NewsService] Failed to write weekly challenge cache', e);
    }

    return challenge;
  }

  /**
   * Backwards compatible method name expected by server.ts
   */
  public async refreshRealNewsFromGemini(categoryTopic?: string): Promise<{ success: boolean; count: number; error?: string }> {
    return this.refreshRealNews(true, categoryTopic);
  }
}

export const newsService = new RealNewsService();
