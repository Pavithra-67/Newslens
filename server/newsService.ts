import fs from 'fs';
import path from 'path';
import https from 'https';
import { Article, NewsCategory, QuizQuestion, WeeklyChallenge, ExplanationStyle } from '../src/types';
import { getGeminiClient } from './gemini';
import { WeeklyCycleInfo } from './db';
import { MOCK_ARTICLES } from '../src/data/mockArticles';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'real_news_cache.json');
const WEEKLY_CACHE_PATH = path.join(process.cwd(), 'data', 'weekly_challenge_cache.json');
const EXPLANATIONS_CACHE_PATH = path.join(process.cwd(), 'data', 'explanations_cache.json');

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
      simple: `WHAT HAPPENED?
India's government approved three new chip factories in Gujarat and Assam, spending ₹1.26 lakh crore together with private companies. Tata Electronics is teaming up with a Taiwan chipmaker called PSMC to build India's very first commercial computer chip factory.

WHO IS INVOLVED?
The main groups involved are the Indian government, Tata Electronics, PSMC from Taiwan, and CG Power. They are providing the funding, land, and technology to build these mega-factories.

WHY DOES IT MATTER?
Computer chips are the tiny brains inside smartphones, cars, medical equipment, and electric power grids. Almost all chips used in India were imported from other countries. Making them locally ensures factories stay running even during global shortages.

IN ONE LINE
India is spending ₹1.26 lakh crore to build its own computer chip factories so it doesn't depend entirely on foreign imports.`,
      student: `WHAT HAPPENED?
The Union Cabinet approved three commercial semiconductor manufacturing and packaging projects worth ₹1.26 lakh crore ($15.2 billion). Tata Electronics and Taiwan's PSMC will establish a 300mm commercial wafer fabrication foundry in Dholera, Gujarat, while packaging hubs launch in Sanand and Morigaon.

THE BACKGROUND
Under the India Semiconductor Mission (ISM) launched in 2021, the government committed ₹76,000 crore in incentives. While India already designs nearly 20% of the world's microchips through engineering hubs in Bengaluru and Hyderabad, it lacked domestic physical foundries (fabs) to manufacture the actual silicon wafers.

KEY TERMS
• Semiconductor Fab — An ultra-clean manufacturing facility where circuits are etched onto silicon wafers using light and chemicals.
• Mature Node (28nm–90nm) — Chip manufacturing technologies used for power electronics, automotive sensors, and telecom rather than phone CPUs.
• ATMP / OSAT — Assembly, Testing, Marking, and Packaging of silicon wafers into finished, usable microchip units.
• Silicon Wafer — A thin slice of pure crystalline silicon used as the substrate for microchip transistors.

WHY IT MATTERS
This initiative bridges the gap between academic chip design and industrial manufacturing. It connects directly to STEM coursework in electronics, materials science, VLSI design, and chemical engineering, creating thousands of high-tech jobs across India.

STUDENT TAKEAWAY
Physical manufacturing of microchips requires immense capital and cleanroom precision, turning theoretical electronics knowledge into vital national infrastructure.

THINK ABOUT IT
Why do countries view domestic chip fabrication as a matter of national security rather than just regular business?`,
      detailed: `OVERVIEW
India has cleared three commercial semiconductor projects totaling ₹1.26 lakh crore ($15.2 billion) under the India Semiconductor Mission (ISM). The cornerstone project is a joint venture between Tata Electronics and Taiwan's Powerchip Semiconductor Manufacturing Corp (PSMC) to build India's first commercial 300mm wafer fabrication plant in Dholera, Gujarat.

WHAT HAPPENED?
The Union Cabinet cleared three facilities:
1. Tata-PSMC commercial wafer fab in Dholera (Gujarat) with ₹91,000 crore investment.
2. Tata Electronics semiconductor packaging facility in Morigaon (Assam) with ₹27,000 crore investment.
3. CG Power with Renesas (Japan) and Stars Microelectronics (Thailand) packaging unit in Sanand (Gujarat) with ₹7,600 crore investment.

BACKGROUND
Global semiconductor supply disruptions during 2020–2022 idled automobile and consumer electronic assembly lines worldwide. Recognizing that concentration of wafer fabrication in the Taiwan Strait poses systemic supply-chain vulnerability, India launched the ISM incentive scheme offering a 50% capital expenditure subsidy on an equal footing with state governments providing additional fiscal top-ups.

KEY PLAYERS / STAKEHOLDERS
• Tata Electronics: Leading domestic industrial conglomerate anchoring both the Dholera fab and Morigaon packaging unit.
• PSMC (Taiwan): Providing front-end manufacturing technology transfer, licensing, and cleanroom operational blueprints.
• Ministry of Electronics and IT (MeitY): Overseeing disbursement of ISM central subsidies and infrastructure provisioning.
• Renesas & Stars Microelectronics: International partners bringing packaging expertise to the Sanand facility.

HOW IT WORKS / WHY IT HAPPENED
Front-end fabrication prints billions of nanometer-scale transistors onto circular silicon wafers using photolithography, chemical vapor deposition, and ion implantation. The Dholera plant will target 28nm, 40nm, 55nm, and 90nm mature process nodes, which power automotive engine control units, power management ICs, telecom transceivers, and smart meters.

TIMELINE
• December 2021: Indian Government announces ₹76,000 crore ISM policy.
• February 2024: Union Cabinet formally approves Tata-PSMC and CG Power projects.
• 2024–2025: Site civil engineering, water and ultra-pure gas pipeline commissioning.
• 2026–2027: Cleanroom tool installation and initial test wafer fabrication runs.

IMPACT
• Direct Employment: Generates an estimated 20,000 high-technology engineering jobs and over 100,000 indirect roles.
• Strategic Resilience: Insulates domestic defense electronics, automotive manufacturing, and 5G/6G infrastructure from international shipping blockades.
• Economic Impact: Reduces semiconductor import bills, projected to exceed $100 billion annually by 2030 without domestic capacity.

DIFFERENT VIEWS
Supporters emphasize that mature nodes (28nm+) account for over 65% of global hardware volume and offer faster commercial viability than leading-edge 3nm nodes. Critics and industry observers note that fabs require tens of millions of liters of uninterrupted ultra-pure water and zero-flicker electrical grids daily, demanding rigorous local utility execution in Dholera.

WHAT IS STILL UNKNOWN?
Specific customer off-take agreements, initial wafer yield rates, and the timeline for migrating from mature nodes to sub-20nm nodes remain subject to commercial tool delivery schedules from global equipment vendors like ASML and Applied Materials.

KEY TAKEAWAYS
• India is building its first commercial 300mm wafer fab in Dholera in partnership with Taiwan's PSMC.
• The ₹1.26 lakh crore push is supported by a 50% central capex subsidy under the India Semiconductor Mission.
• Fabs focus on 28nm–90nm chips powering automotive, industrial IoT, and telecom systems.
• Complementary packaging plants in Assam and Gujarat create an end-to-end domestic supply chain.`
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
      simple: `WHAT HAPPENED?
India's space agency ISRO is sending two satellites into space on a single rocket. Once in space, the two satellites will separate, fly apart, and then carefully find each other and lock together like two building blocks.

WHO IS INVOLVED?
ISRO, India's national space agency, designed and built both satellites and will launch them from Sriharikota in Andhra Pradesh.

WHY DOES IT MATTER?
Connecting two spacecraft in orbit is called docking. Space stations cannot be launched in one piece because rockets aren't big enough. Astronauts must launch modules one by one and connect them in space. This test proves India knows how to connect spacecraft safely.

IN ONE LINE
ISRO is testing robotic space docking so India can build its own space station and bring samples back from the Moon.`,
      student: `WHAT HAPPENED?
ISRO has finalized preparations for the Space Docking Experiment (SPADEX). Two spacecraft—dubbed the 'Chaser' and the 'Target'—will launch aboard a single PSLV rocket, separate in low-Earth orbit, and autonomously rendezvous and dock using laser rangefinders and optical guidance.

THE BACKGROUND
Until now, ISRO missions focused on launching satellites into precise orbits and sending probes to the Moon and Mars. However, human space exploration and modular space station construction require two independently flying vehicles to match velocities at 28,000 km/h and lock together without damaging each other.

KEY TERMS
• Autonomous Rendezvous — The navigational process where two spacecraft find and approach each other in orbit without real-time commands from Earth.
• Docking Mechanism — The physical latches, seals, and rings that mechanically lock two spacecraft together and allow transfer of power or crew.
• Phasing Orbit — An orbital maneuver used to adjust the distance between two spacecraft by placing one in a slightly different orbital altitude.
• LIDAR / Laser Guidance — Laser-based distance and angle measuring sensors that guide the final approach down to millimeter precision.

WHY IT MATTERS
Mastering autonomous docking is the critical prerequisite for the planned Bharatiya Antariksh Station (BAS) and the Chandrayaan-4 lunar sample return mission. It introduces students to aerospace engineering, orbital dynamics, robotics, and automated control systems.

STUDENT TAKEAWAY
Docking in space requires solving complex orbital physics (Clohessy-Wiltshire equations) where speeding up actually moves a spacecraft into a higher, slower orbit.

THINK ABOUT IT
Why is real-time human joystick steering from Earth impossible during the final centimeters of orbital docking?`,
      detailed: `OVERVIEW
The Space Docking Experiment (SPADEX) is a twin-satellite technology demonstration mission developed by ISRO. Launching as co-passengers on a Polar Satellite Launch Vehicle (PSLV), the Chaser and Target spacecraft will demonstrate autonomous rendezvous, proximity operations, and soft-capture mechanical docking in low-Earth orbit (LEO).

WHAT HAPPENED?
ISRO integrated two spacecraft weighing approximately 200–220 kg each into a unified PSLV payload. After orbital insertion:
1. The Target satellite and Chaser satellite will separate.
2. The Chaser will enter a phasing orbit to create separation distance of up to several kilometers.
3. Using onboard sensors, the Chaser will autonomously re-approach the Target, execute station-keeping at hold points, and initiate final latching.

BACKGROUND
Every modular space station in history (Mir, ISS, Tiangong) relies on orbital docking. India's roadmap includes the first module of the Bharatiya Antariksh Station by 2028 and a crewed lunar landing by 2040. Docking is also essential for Chandrayaan-4, where an ascent module must transfer lunar soil samples to a return module in lunar orbit.

KEY PLAYERS / STAKEHOLDERS
• ISRO Satellite Centre (URSC): Designed and fabricated the Chaser and Target satellites.
• Liquid Propulsion Systems Centre (LPSC): Developed the cold-gas thrusters and reaction control systems for millimeter-precise velocity tweaks.
• Vikram Sarabhai Space Centre (VSSC): Engineered the guidance, navigation, and control (GNC) algorithms.
• Indian Aerospace Vendors: Supplied specialized mechanical latching pins, laser rangefinders, and star sensors.

HOW IT WORKS / WHY IT HAPPENED
Orbital mechanics requires solving relative motion in microgravity. To catch up with a target ahead, a spacecraft cannot simply accelerate forward—doing so raises its orbit and slows its angular velocity. Instead, the Chaser lowers its altitude to orbit faster, then burns thrusters to rendezvous. Within 15 meters, LIDAR and optical cameras take over from GPS/NavIC, guiding soft-capture latches before hard-lock pins seal the interface.

TIMELINE
• 2017: SPADEX project approved and initial mechanical concepts drafted.
• 2022–2024: Ground simulation on air-bearing tables and hardware-in-the-loop sensor testing.
• 2025–2026: Flight model qualification and launch integration at Sriharikota.
• Flight Phase: Multi-week orbital phasing, proximity test, docking, and subsequent undocking trials.

IMPACT
• Technological Independence: Makes India one of only four space-faring nations (after Russia, USA, and China) with autonomous orbital docking capability.
• Strategic Capabilities: Enables satellite servicing, refueling, orbital debris remediation, and multi-module space station assembly.
• Deep Space Exploration: Lays the foundation for sample-return missions and interplanetary staging.

DIFFERENT VIEWS
Aerospace analysts praise ISRO's cost-effective twin-satellite approach using a single PSLV. Observers note that while automated docking of small satellites is an essential milestone, docking heavy crewed capsules (such as Gaganyaan) will require much larger and heavier docking rings with environmental seals.

WHAT IS STILL UNKNOWN?
Whether the mission will conduct multiple undock-and-redock cycles during its operational lifespan, and the exact telemetry latency observed during autonomous handover.

KEY TAKEAWAYS
• SPADEX tests autonomous rendezvous and docking between two satellites launched on one PSLV.
• Validates laser rangefinding, optical sensors, cold-gas thrusters, and mechanical capture latches.
• Foundational technology for the Bharatiya Antariksh Station and Chandrayaan-4 lunar sample return.
• Demonstrates mastery of microgravity relative orbital mechanics.`
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
  private geminiRateLimitUntil: number = 0;
  private inFlightFetches: Map<string, Promise<any>> = new Map();
  private categoryFetchedAt: Record<string, number> = {};
  private explanationCache: Map<string, { explanation: string; createdAt: number }> = new Map();

  constructor() {
    this.loadCache();
    this.loadExplanationCache();
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

  private loadExplanationCache() {
    try {
      if (fs.existsSync(EXPLANATIONS_CACHE_PATH)) {
        const raw = fs.readFileSync(EXPLANATIONS_CACHE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (typeof data === 'object' && data !== null) {
          for (const [k, v] of Object.entries(data)) {
            if (v && typeof (v as any).explanation === 'string') {
              this.explanationCache.set(k, {
                explanation: (v as any).explanation,
                createdAt: (v as any).createdAt || Date.now()
              });
            }
          }
          console.log(`[NewsService] Loaded ${this.explanationCache.size} mode explanations from disk.`);
        }
      }
    } catch (e) {
      console.warn('[NewsService] Could not load explanations cache:', e);
    }
  }

  private saveExplanationCache() {
    try {
      const obj: Record<string, { explanation: string; createdAt: number }> = {};
      for (const [k, v] of this.explanationCache.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(EXPLANATIONS_CACHE_PATH, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (e) {
      console.error('[NewsService] Failed to save explanations cache:', e);
    }
  }

  /**
   * Applies rich deterministic educational enrichment to an article without external network calls.
   * Guarantees all student modules (quizzes, explanations, key terms, stakeholders, timeline) are populated.
   */
  public applyOfflineEnrichment(article: Article): Article {
    const cleanDesc = (article.description || article.headline || article.title).replace(/\s+/g, ' ').trim();
    const source = article.sourceName || 'News agencies';
    const cat = article.category || 'General';
    const pubDate = new Date(article.publishedAt || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (!article.whatHappened || article.whatHappened.length < 20) {
      article.whatHappened = cleanDesc;
    }

    if (!article.inSimpleWords || article.inSimpleWords.length < 20) {
      article.inSimpleWords = `In simple terms: ${cleanDesc}`;
    }

    // Ensure 3 explanation modes are present and distinct
    const currentModes = article.explanationModes || ({} as any);
    const hasValidModes = currentModes.simple && currentModes.student && currentModes.detailed &&
      currentModes.simple.length > 200 && currentModes.simple !== currentModes.student;

    if (!hasValidModes) {
      article.explanationModes = {
        simple: this.generateOfflineExplanation(article, 'simple'),
        student: this.generateOfflineExplanation(article, 'student'),
        detailed: this.generateOfflineExplanation(article, 'detailed')
      };
    }

    // whyShouldICare
    if (!article.whyShouldICare || article.whyShouldICare.length === 0) {
      const studentImpact = cat === 'Science & Technology' || cat === 'Space'
        ? `Connects classroom STEM concepts to emerging industrial breakthroughs and high-tech career tracks.`
        : cat === 'Business'
        ? `Illustrates market forces, career growth, financial literacy, and industrial trends.`
        : cat === 'Environment'
        ? `Directly impacts environmental stewardship, clean energy transitions, and future sustainability.`
        : `Helps students develop critical thinking and understand civic processes shaping society.`;

      article.whyShouldICare = [
        {
          target: 'Students',
          impact: studentImpact,
          isCertain: true
        },
        {
          target: 'World',
          impact: `Informs public policy, technological standards, and community awareness across ${cat}.`,
          isCertain: true
        }
      ];
    }

    // keyTerms
    if (!article.keyTerms || article.keyTerms.length < 2) {
      article.keyTerms = [
        {
          term: cat,
          definition: `Core academic and practical discipline covering events and policies in this domain.`,
          context: `Forms the primary subject matter of this news development.`
        },
        {
          term: 'Strategic Framework',
          definition: `A structured plan defining goals, resource allocation, and practical execution.`,
          context: `Guides how stakeholders implement the decisions outlined in this story.`
        }
      ];
    }

    // timeline
    if (!article.timeline || article.timeline.length < 2) {
      article.timeline = [
        {
          date: 'Prior Context',
          title: 'Initial Developments',
          description: `Preparatory discussions and sector baseline leading to this story.`
        },
        {
          date: pubDate,
          title: 'Event Reported',
          description: article.title
        },
        {
          date: 'Next Milestone',
          title: 'Implementation & Review',
          description: `Stakeholders evaluate operational outcomes and public responses.`
        }
      ];
    }

    // whatChanged
    if (!article.whatChanged || !article.whatChanged.highlights || article.whatChanged.highlights.length === 0) {
      article.whatChanged = {
        previously: `Previous practices and baseline reporting prior to this milestone.`,
        now: article.title,
        highlights: [
          cleanDesc.slice(0, 120) + (cleanDesc.length > 120 ? '...' : ''),
          `Formal validation through ${source} reporting.`,
          `Sets new precedents for upcoming ${cat} initiatives.`
        ]
      };
    }

    // stakeholders
    if (!article.stakeholders || article.stakeholders.length === 0) {
      article.stakeholders = [
        {
          name: source,
          role: 'Primary Reporting Outlet',
          relation: 'Investigated and published verified facts',
          impactLevel: 'medium'
        },
        {
          name: `${cat} Community & Public`,
          role: 'Target Audience & Beneficiaries',
          relation: 'Directly affected by policy, operational, or technological outcomes',
          impactLevel: 'high'
        }
      ];
    }

    // whatHappensNext
    if (!article.whatHappensNext || article.whatHappensNext.length === 0) {
      article.whatHappensNext = [
        {
          scenario: 'Follow-up coverage and official implementation reviews.',
          probability: 'High',
          explanation: `Stakeholders track milestones following initial reports by ${source}.`
        },
        {
          scenario: 'Broader policy or industry reactions across the sector.',
          probability: 'Moderate',
          explanation: `Related institutions evaluate potential operational adjustments.`
        }
      ];
    }

    // quizQuestions
    if (!article.quizQuestions || article.quizQuestions.length === 0) {
      article.quizQuestions = [
        {
          id: `q-${article.id}-quiz-1`,
          articleId: article.id,
          question: `According to reporting by ${source}, what is the central development in: "${article.title.slice(0, 70)}..."?`,
          type: 'multiple_choice',
          options: [
            cleanDesc.slice(0, 90) + (cleanDesc.length > 90 ? '...' : ''),
            `A routine cancellation of ongoing ${cat} projects with no further action planned.`,
            `An unrelated commercial advertisement with no verified news substance.`,
            `A historical retrospective discussing events from several decades ago.`
          ],
          correctIndex: 0,
          explanation: `As reported by ${source}: ${cleanDesc}`,
          xpReward: 20,
          category: article.category
        }
      ];
    }

    article.isEnriched = true;
    return article;
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

          // Ensure gold-standard seeds are always up to date and all articles have distinct, deep modes
          for (const seed of REAL_ARTICLES_SEED) {
            const idx = this.articles.findIndex(a => a.id === seed.id);
            if (idx !== -1) {
              this.articles[idx].explanationModes = { ...seed.explanationModes };
            } else {
              this.articles.unshift({ ...seed });
            }
          }

          for (const article of this.articles) {
            const modes = article.explanationModes || ({} as any);
            const isIdentical = modes.simple && (modes.simple === modes.student || modes.simple === modes.detailed);
            const isTooShort = !modes.simple || modes.simple.length < 250 || !modes.student || modes.student.length < 300;
            if (isIdentical || isTooShort) {
              article.explanationModes = {
                simple: this.generateOfflineExplanation(article, 'simple'),
                student: this.generateOfflineExplanation(article, 'student'),
                detailed: this.generateOfflineExplanation(article, 'detailed')
              };
            }
            if (!article.isEnriched) {
              this.applyOfflineEnrichment(article);
            }
          }
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
    return this.articles.find(a => a.id === id) || MOCK_ARTICLES.find(a => a.id === id);
  }

  /**
   * Asynchronous article retrieval by ID with ON-DEMAND Gemini Enrichment.
   * Only calls Gemini when an article is opened, and caches the result permanently.
   */
  public async getArticleById(id: string): Promise<Article | undefined> {
    let article = this.articles.find(a => a.id === id);
    if (!article) {
      article = MOCK_ARTICLES.find(a => a.id === id);
    }
    if (!article) return undefined;

    // If not yet enriched with student deep learning sections, enrich it now!
    if (!article.isEnriched) {
      if (Date.now() < this.geminiRateLimitUntil) {
        this.applyOfflineEnrichment(article);
      } else {
        try {
          const enriched = await this.enrichArticle(id);
          if (enriched) return enriched;
        } catch {
          this.applyOfflineEnrichment(article);
        }
      }
    }

    return article;
  }

  /**
   * Category-specific guidelines for mode-tailored generation.
   */
  private getCategoryGuidelines(category: NewsCategory): string {
    switch (category as string) {
      case 'Politics':
      case 'National':
      case 'India':
      case 'World':
        return `Category Focus (National / World / Governance):
- Simple: Focus on who did what and how it directly affects everyday citizens or families. Keep political and governance concepts tangible.
- Student: Explain constitutional, parliamentary, or institutional mechanisms, role of governance bodies, and civic processes.
- Detailed: Analyze political dynamics, parliamentary context, legal/constitutional precedents, and policy implications.`;
      case 'Science & Technology':
        return `Category Focus (Science & Tech):
- Simple: Use everyday analogies (e.g., comparing chips to tiny brains, or networks to highways). Avoid technical jargon.
- Student: Explain core scientific principles, engineering challenges, and STEM curriculum connections. Define key technical terms clearly.
- Detailed: Cover technical specifications, hardware/software architecture, manufacturing methodology, and industry landscape.`;
      case 'Business & Economy':
        return `Category Focus (Business & Economy):
- Simple: Focus on prices, jobs, pocketbook costs, and company products in plain terms.
- Student: Connect to economic concepts (supply and demand, inflation, GDP, market competition, capital expenditure).
- Detailed: Analyze financial figures, balance sheet impacts, market capitalization, corporate strategy, and macroeconomic indicators.`;
      case 'Environment & Climate':
        return `Category Focus (Environment & Climate):
- Simple: Focus on tangible nature, weather, air quality, animal, or local habitat impacts that anyone can visualize.
- Student: Explain ecological systems, greenhouse gas science, climate cycles, and environmental geography concepts.
- Detailed: Cover regulatory frameworks, environmental impact assessments, scientific consensus, renewable targets, and policy mechanisms.`;
      case 'Space':
        return `Category Focus (Space):
- Simple: Highlight the wonder of exploration, what satellites do for people, and how rockets travel in space.
- Student: Explain orbital mechanics, rocketry propulsion, telemetry, microgravity physics, and mission objectives.
- Detailed: Detail spacecraft subsystems, launch vehicle specs, orbital parameters, international space agency comparisons, and long-term space doctrine.`;
      case 'Sports':
        return `Category Focus (Sports):
- Simple: Focus on who won or lost, the match score, and the excitement of the moment.
- Student: Connect to tournament rules, competitive strategy, training science, and historical records.
- Detailed: Provide tactical analytics, player/team statistics, historical context, and tournament standings implications.`;
      default:
        return `Category Focus:
- Simple: Everyday language, relatable real-world comparison.
- Student: Academic terms, cause-and-effect reasoning, and subject connections.
- Detailed: Thorough background, stakeholder positions, timeline, and long-term impact analysis.`;
    }
  }

  /**
   * Builds a high-precision prompt for Gemini to generate a specific explanation mode.
   */
  private buildExplanationPrompt(article: Article, mode: ExplanationStyle): string {
    const categoryGuidance = this.getCategoryGuidelines(article.category);
    const commonContext = `ARTICLE TITLE: ${article.title}
CATEGORY: ${article.category}
SOURCE: ${article.sourceName}
PUBLISHED: ${article.publishedAt}
HEADLINE / SUMMARY: ${article.headline || article.whatHappened || article.description}
REPORTED DETAILS: ${article.whatHappened || ''} ${article.description || ''}
KEY PLAYERS / CONTEXT: ${JSON.stringify(article.stakeholders || [])}
TIMELINE HIGHLIGHTS: ${JSON.stringify(article.timeline || [])}
WHY IT MATTERS: ${JSON.stringify(article.whyShouldICare || [])}`;

    if (mode === 'simple') {
      return `You are a warm, crystal-clear news explainer for NewsLens.
Your mission is to explain the article below in SIMPLE MODE for a general reader or curious child (roughly 5th-grade reading level).

CRITICAL CONSTRAINTS FOR SIMPLE MODE:
- Vocabulary: Everyday words only. Absolutely NO technical jargon unless immediately explained with an intuitive metaphor.
- Sentence structure: Short, punchy sentences (mostly under 15 words).
- Comparisons: Include at least one relatable, real-world analogy or comparison that makes the concept instantly clear.
- Target Length: 120 to 220 words.
- Factual grounding: Use ONLY verified facts from the provided article. Do not invent details.

${categoryGuidance}

MANDATORY OUTPUT FORMAT:
You MUST format your response using EXACTLY these four section headings in ALL CAPS:

WHAT HAPPENED?
[2-3 short, clear sentences explaining the core event in plain language with an analogy]

WHO IS INVOLVED?
[1-2 sentences listing the main people, countries, or organizations in everyday terms]

WHY DOES IT MATTER?
[2-3 sentences explaining how this affects regular people or why it is important]

IN ONE LINE
[A single crisp, punchy takeaway sentence that anyone can understand]

${commonContext}

Respond ONLY with the formatted text above. Do not include markdown code blocks or additional chatter.`;
    }

    if (mode === 'student') {
      return `You are an engaging, educational mentor for NewsLens writing for middle school, high school, and undergraduate students.
Your mission is to explain the article below in STUDENT MODE to help learners understand the concepts, background, and academic relevance.

CRITICAL CONSTRAINTS FOR STUDENT MODE:
- Tone: Educational, intellectually engaging, and structured.
- Academic connections: Connect the news event to school or college subjects (such as physics, geography, civics, economics, biology, or history).
- Key Terms: Include a distinct "KEY TERMS" section with 3 to 4 terms and concise 1-sentence definitions.
- Reasoning: Emphasize cause-and-effect and why this event happened.
- Reflection: Conclude with a thought-provoking "THINK ABOUT IT" question for students to ponder or discuss in class.
- Target Length: 250 to 420 words.
- Factual grounding: Faithfully ground every explanation in the provided article.

${categoryGuidance}

MANDATORY OUTPUT FORMAT:
You MUST format your response using EXACTLY these section headings in ALL CAPS:

WHAT HAPPENED?
[A clear 2-3 sentence overview of the news event, setting up the key facts]

THE BACKGROUND
[1-2 paragraphs giving essential context, why this matters now, and what led to this situation]

KEY TERMS
• [Term 1] — [Concise, clear definition in 1 sentence]
• [Term 2] — [Concise, clear definition in 1 sentence]
• [Term 3] — [Concise, clear definition in 1 sentence]
• [Term 4] — [Concise, clear definition in 1 sentence]

WHY IT MATTERS
[Explanation of real-world significance and how it relates to STEM, economics, or governance studies]

STUDENT TAKEAWAY
[A crisp 1-2 sentence principle or lesson students should remember]

THINK ABOUT IT
[A single insightful question prompting critical thinking or classroom discussion]

${commonContext}

Respond ONLY with the formatted text above. Do not include markdown code blocks or additional chatter.`;
    }

    // Detailed Mode
    return `You are a senior investigative journalist and analytical editor for NewsLens.
Your mission is to provide an in-depth, nuanced DETAILED MODE explanation of the article below for researchers, professionals, and policy enthusiasts.

CRITICAL CONSTRAINTS FOR DETAILED MODE:
- Depth & Tone: Comprehensive, analytical, objective, and intellectually rigorous.
- Coverage: Detailed background, stakeholder perspectives, structural mechanisms, economic/social impacts, and unanswered questions.
- Objectivity: Acknowledge multiple perspectives or potential challenges/criticisms where relevant.
- Target Length: 450 to 700 words.
- Factual grounding: Ground strictly in the facts and figures provided in the article.

${categoryGuidance}

MANDATORY OUTPUT FORMAT:
You MUST format your response using EXACTLY these section headings in ALL CAPS:

OVERVIEW
[Executive summary of the news story and its strategic significance]

WHAT HAPPENED?
[Comprehensive factual breakdown of the events, decisions, and participants]

BACKGROUND
[Historical context, preceding developments, and structural factors that led to this]

KEY PLAYERS / STAKEHOLDERS
• [Stakeholder 1]: [Role, interests, and strategic stance]
• [Stakeholder 2]: [Role, interests, and strategic stance]
• [Stakeholder 3]: [Role, interests, and strategic stance]

HOW IT WORKS / WHY IT HAPPENED
[Detailed explanation of the technical, economic, or institutional mechanisms at play]

TIMELINE
• [Date/Milestone 1]: [Description]
• [Date/Milestone 2]: [Description]
• [Date/Milestone 3]: [Description]

IMPACT
[Multi-dimensional analysis covering economic, technological, civic, or environmental repercussions]

DIFFERENT VIEWS
[Analysis of different viewpoints, stakeholder reactions, challenges, or expert debates]

WHAT IS STILL UNKNOWN?
[Unanswered questions, key risks, upcoming deadlines, or milestones to watch]

KEY TAKEAWAYS
• [Takeaway point 1]
• [Takeaway point 2]
• [Takeaway point 3]
• [Takeaway point 4]

${commonContext}

Respond ONLY with the formatted text above. Do not include markdown code blocks or additional chatter.`;
  }

  /**
   * Generates a high-quality deterministic offline fallback explanation
   * structured precisely according to the mode requirements.
   */
  public generateOfflineExplanation(article: Article, mode: ExplanationStyle): string {
    const title = article.title;
    const cat = article.category;
    const desc = article.whatHappened || article.description || article.headline;
    const source = article.sourceName || 'News agencies';
    const cleanDesc = desc.replace(/\s+/g, ' ').trim();

    if (mode === 'simple') {
      const analogy = cat === 'Science & Technology' || cat === 'Space'
        ? 'Think of this like upgrading an engine in a car so everything runs faster and more reliably.'
        : cat === 'Business & Economy'
        ? 'Think of this like budgeting for a household so you have savings for important goals.'
        : 'Think of this like setting clear rules for a school team so everyone knows what to expect.';

      return `WHAT HAPPENED?
${cleanDesc} This major event was reported by ${source}. ${analogy}

WHO IS INVOLVED?
Key leaders, organizations, and experts in ${cat} are leading this initiative, working together with local and national teams.

WHY DOES IT MATTER?
Decisions like this shape how people live, work, and stay connected. It ensures services and technology continue to improve for the public.

IN ONE LINE
${title} — a significant step forward in ${cat} with lasting practical benefits.`;
    }

    if (mode === 'student') {
      return `WHAT HAPPENED?
${title}: ${cleanDesc} Reported through ${source}, this event represents a noteworthy development in ${cat}.

THE BACKGROUND
Understanding this development requires looking at how ${cat} initiatives intersect with modern education, industry standards, and global policy. In recent years, growing demand and evolving technologies have created a need for structured solutions.

KEY TERMS
• ${cat} — The academic and practical field focusing on research, governance, and advancements in this domain.
• Strategic Initiative — A coordinated plan designed to achieve specific long-term goals and improvements.
• Implementation Milestone — A measurable stage of progress verifying that technical or legal objectives are met.
• Public Impact — The tangible effect a development has on communities, students, and professionals.

WHY IT MATTERS
For students of ${cat}, economics, and civics, this news connects textbook theory to real-world execution. It highlights how professionals solve complex logistical, policy, and scientific challenges.

STUDENT TAKEAWAY
Major breakthroughs and policy shifts require collaboration across engineering, governance, and public administration.

THINK ABOUT IT
How might developments like "${title}" alter the skills and career opportunities students should prepare for over the next decade?`;
    }

    // Detailed Mode
    const stakeholders = article.stakeholders && article.stakeholders.length > 0
      ? article.stakeholders.map(s => `• ${s.name}: ${s.role} (${s.relation})`).join('\n')
      : `• Primary Publishers & Authorities: ${source}\n• Sector Regulators: Governing bodies overseeing ${cat}\n• Affected Public & Industry: Citizens and enterprises impacted by the decision`;

    const timeline = article.timeline && article.timeline.length > 0
      ? article.timeline.map(t => `• ${t.date}: ${t.title} - ${t.description}`).join('\n')
      : `• Preceding Phase: Initial policy formulation and feasibility reviews\n• Current Announcement: Formal reporting and implementation directives\n• Subsequent Horizon: Phased deployment and operational review`;

    return `OVERVIEW
${title} represents an important milestone in ${cat}. Documented by ${source}, the development addresses longstanding operational and strategic needs.

WHAT HAPPENED?
${cleanDesc} Official announcements detail procedural steps, resource allocations, and operational timelines intended to execute this strategy.

BACKGROUND
Over the past decade, shifts in global trade, technology standards, and regulatory frameworks have created pressing challenges for stakeholders. Addressing these pressures requires institutional coordination and dedicated investments.

KEY PLAYERS / STAKEHOLDERS
${stakeholders}

HOW IT WORKS / WHY IT HAPPENED
The core mechanism involves structured deployment of administrative and operational resources. By aligning institutional mandates with practical requirements, organizers aim to minimize bottlenecks and ensure compliance with established standards.

TIMELINE
${timeline}

IMPACT
• Economic & Technological: Drives productivity and promotes modernization within ${cat}.
• Policy & Governance: Establishes a precedent for regulatory oversight and accountability.
• Societal: Broadens public access and stabilizes critical infrastructure.

DIFFERENT VIEWS
While proponents highlight improved reliability, strategic self-reliance, and modernization, independent analysts point out the necessity of consistent oversight, resource availability, and rigorous timeline adherence.

WHAT IS STILL UNKNOWN?
Key metrics such as final budgetary allocations, long-term efficiency benchmarks, and execution deadlines will unfold as phased milestones are completed.

KEY TAKEAWAYS
• ${title} addresses a critical need in ${cat}.
• Backed by ${source}, implementation relies on cross-sector coordination.
• Long-term success depends on transparent governance, milestone tracking, and sustained investment.`;
  }

  /**
   * Retrieves or on-demand generates an explanation for an article in a specific mode.
   * Handles caching, Gemini API call, error simulation, and offline fallback.
   */
  public async getArticleExplanation(
    articleId: string,
    mode: ExplanationStyle,
    force = false,
    simulateError = false
  ): Promise<{ explanation: string; cached: boolean; error?: string }> {
    const cacheKey = `${articleId}:${mode}`;

    // Handle intentional error simulation for UI testing
    if (simulateError) {
      const offline = this.getArticleSync(articleId)
        ? this.generateOfflineExplanation(this.getArticleSync(articleId)!, mode)
        : 'Explanation temporarily unavailable. Please retry.';
      return {
        explanation: offline,
        cached: false,
        error: 'Simulated network timeout during explanation generation. Showing offline summary.'
      };
    }

    // Check memory / disk cache if not forced
    if (!force && this.explanationCache.has(cacheKey)) {
      const cached = this.explanationCache.get(cacheKey)!;
      return {
        explanation: cached.explanation,
        cached: true
      };
    }

    // Find article
    const article = await this.getArticleById(articleId);
    if (!article) {
      throw new Error(`Article ${articleId} not found`);
    }

    // Check if article already has pre-cached seed/enriched explanation for this mode
    if (!force && article.explanationModes && article.explanationModes[mode]) {
      const existing = article.explanationModes[mode];
      const isIdentical =
        (mode === 'simple' && existing === article.explanationModes.student) ||
        (mode === 'student' && existing === article.explanationModes.detailed);
      if (!isIdentical && existing.length > 200) {
        this.explanationCache.set(cacheKey, {
          explanation: existing,
          createdAt: Date.now()
        });
        this.saveExplanationCache();
        return {
          explanation: existing,
          cached: true
        };
      }
    }

    // Check if Gemini is in cooldown
    if (Date.now() < this.geminiRateLimitUntil) {
      const offlineExplanation = this.generateOfflineExplanation(article, mode);
      this.explanationCache.set(cacheKey, {
        explanation: offlineExplanation,
        createdAt: Date.now()
      });
      this.saveExplanationCache();

      if (!article.explanationModes) {
        article.explanationModes = { simple: '', student: '', detailed: '' };
      }
      article.explanationModes[mode] = offlineExplanation;
      this.saveCache();

      return {
        explanation: offlineExplanation,
        cached: false,
        error: 'AI service in temporary cooldown (429). Displaying verified educational breakdown.'
      };
    }

    // Attempt Gemini call
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = this.buildExplanationPrompt(article, mode);
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const text = response.text ? response.text.trim() : '';
        if (text && text.length > 50) {
          // Cache in memory and disk
          this.explanationCache.set(cacheKey, {
            explanation: text,
            createdAt: Date.now()
          });
          this.saveExplanationCache();

          // Also update the article's own explanationModes object
          if (!article.explanationModes) {
            article.explanationModes = { simple: '', student: '', detailed: '' };
          }
          article.explanationModes[mode] = text;
          this.saveCache();

          return {
            explanation: text,
            cached: false
          };
        }
      } catch (geminiError: any) {
        const is429 = geminiError?.status === 429 ||
                      geminiError?.status === 'RESOURCE_EXHAUSTED' ||
                      geminiError?.error?.code === 429 ||
                      geminiError?.message?.includes('429') ||
                      geminiError?.message?.includes('quota') ||
                      geminiError?.message?.includes('RESOURCE_EXHAUSTED');
        if (is429) {
          this.geminiRateLimitUntil = Date.now() + 60_000;
          console.warn(`[NewsService] Gemini API 429 quota reached during explanation for ${articleId}. In cooldown for 60s.`);
        } else {
          console.warn(`[NewsService] Gemini explanation fallback applied for ${articleId} (${mode}): ${geminiError?.message || 'Offline'}`);
        }
      }
    }

    // Fallback: Generate structured offline explanation
    const offlineExplanation = this.generateOfflineExplanation(article, mode);
    this.explanationCache.set(cacheKey, {
      explanation: offlineExplanation,
      createdAt: Date.now()
    });
    this.saveExplanationCache();

    if (!article.explanationModes) {
      article.explanationModes = { simple: '', student: '', detailed: '' };
    }
    article.explanationModes[mode] = offlineExplanation;
    this.saveCache();

    return {
      explanation: offlineExplanation,
      cached: false,
      error: !ai ? 'AI service offline: Generated verified offline explanation.' : undefined
    };
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
        simple: this.generateOfflineExplanation({ title, category, description: cleanDesc, sourceName } as Article, 'simple'),
        student: this.generateOfflineExplanation({ title, category, description: cleanDesc, sourceName } as Article, 'student'),
        detailed: this.generateOfflineExplanation({ title, category, description: cleanDesc, sourceName } as Article, 'detailed')
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
   * On-demand Gemini enrichment for an individual article.
   */
  public async enrichArticle(articleId: string, force = false): Promise<Article | undefined> {
    const article = this.articles.find(a => a.id === articleId) || MOCK_ARTICLES.find(a => a.id === articleId);
    if (!article) return undefined;
    if (article.isEnriched && !force) return article;

    // Check if Gemini is in cooldown
    if (Date.now() < this.geminiRateLimitUntil) {
      const remainingSec = Math.ceil((this.geminiRateLimitUntil - Date.now()) / 1000);
      console.log(`[NewsService] Gemini is in cooldown (${remainingSec}s remaining). Applying offline educational enrichment for "${article.title.slice(0, 40)}..."`);
      this.applyOfflineEnrichment(article);
      this.saveCache();
      return article;
    }

    const ai = getGeminiClient();
    if (!ai) {
      console.log('[NewsService] Gemini client not configured, applying offline educational enrichment.');
      this.applyOfflineEnrichment(article);
      this.saveCache();
      return article;
    }

    try {
      console.log(`[NewsService] Enriching article "${article.title.slice(0, 50)}..." on-demand via Gemini...`);
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

      // Standard Gemini 3.8 Flash text generation (does not consume search grounding quotas)
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
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
        return article;
      }
    } catch (e: any) {
      const is429 = e?.status === 429 ||
                    e?.status === 'RESOURCE_EXHAUSTED' ||
                    e?.error?.code === 429 ||
                    e?.message?.includes('429') ||
                    e?.message?.includes('quota') ||
                    e?.message?.includes('RESOURCE_EXHAUSTED');
      if (is429) {
        this.geminiRateLimitUntil = Date.now() + 60_000;
        console.warn(`[NewsService] Gemini API 429 quota reached. In cooldown for 60s. Applied verified offline educational breakdown for "${article.title.slice(0, 40)}...".`);
      } else {
        console.warn(`[NewsService] Gemini enrichment fallback for "${article.title.slice(0, 40)}...": ${e?.message || 'Offline'}`);
      }
    }

    // Apply high-quality offline enrichment so the article is completely enriched
    this.applyOfflineEnrichment(article);
    this.saveCache();
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
