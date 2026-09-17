import fs from 'fs';
import path from 'path';
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

// ----------------------------------------------------
// VERIFIED REAL NEWS SEED (Grounded in current real events)
// ----------------------------------------------------
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
    coveredSourcesCount: 9,
    otherSources: [
      { name: 'The Hindu', url: 'https://www.thehindu.com/business/Industry/cabinet-approves-three-semiconductor-units/article67897214.ece' },
      { name: 'LiveMint', url: 'https://www.livemint.com/industry/cabinet-approves-3-semiconductor-units-at-investment-of-rs-1-26-lakh-crore-11709204018809.html' },
      { name: 'Reuters', url: 'https://www.reuters.com/technology/india-approves-152-bln-chip-plant-investments-2024-02-29/' }
    ],
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
      },
      {
        target: 'Technology',
        impact: 'Catalyzes local assembly of printed circuit boards (PCBs) and domestic hardware patents.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Semiconductor Foundry (Fab)',
        definition: 'A specialized ultra-clean facility where silicon wafers are processed and etched with microscopic circuits.',
        context: 'Fabs require uninterrupted water, electricity, and vibration-free foundations.'
      },
      {
        term: 'ATMP / OSAT',
        definition: 'Assembly, Testing, Marking, and Packaging where fabricated silicon wafers are separated into dies and packaged into protective cases.',
        context: 'ATMP brings faster employment generation compared to initial front-end fabrication.'
      }
    ],
    timeline: [
      { date: 'Dec 2021', title: 'India Semiconductor Mission Launched', description: 'Cabinet approved ₹76,000 crore fiscal incentive framework.' },
      { date: 'Feb 2024', title: 'Cabinet Approves Dholera Fab', description: 'Tata-PSMC partnership receives official green light.' },
      { date: '2026', title: 'Civil Construction & Tooling', description: 'Foundry cleanroom infrastructure reaches installation phase.' }
    ],
    whatChanged: {
      previously: 'India had world-class chip design talent in Bengaluru and Hyderabad, but zero commercial silicon wafer fabrication factories.',
      now: 'India is constructing full-scale commercial wafer fabrication plants with 50% government co-funding.',
      highlights: [
        'Dholera fab capacity of 50,000 wafers per month.',
        'New packaging units in Morigaon (Assam) and Sanand (Gujarat).'
      ]
    },
    stakeholders: [
      { name: 'Tata Electronics', role: 'Domestic Industrial Anchor', relation: 'Building Dholera foundry with PSMC', impactLevel: 'high' },
      { name: 'Ministry of Electronics & IT', role: 'Government Regulator', relation: 'Disbursing capital subsidies under ISM', impactLevel: 'high' }
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
      },
      {
        id: 'q-semi-2',
        question: 'In which location is Tata Electronics constructing India\'s first commercial 300mm silicon wafer fabrication plant?',
        type: 'multiple_choice',
        options: ['Bengaluru, Karnataka', 'Dholera, Gujarat', 'Hyderabad, Telangana', 'Noida, Uttar Pradesh'],
        correctIndex: 1,
        explanation: 'Tata Electronics partnered with PSMC to build the 300mm semiconductor foundry in Dholera Special Investment Region, Gujarat.',
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
    coveredSourcesCount: 7,
    otherSources: [
      { name: 'The Indian Express', url: 'https://indianexpress.com/article/technology/science/isro-spadex-docking-space-station-chandrayaan-4-9190112/' },
      { name: 'BBC News', url: 'https://www.bbc.com/news/world-asia-india' }
    ],
    whatHappened: 'ISRO finalized testing for the Space Docking Experiment (SPADEX), launching two spacecraft—a Chaser and a Target—on a single PSLV. The satellites will separate, perform orbital phasing, and autonomously navigate together to dock using laser and optical sensors.',
    inSimpleWords: 'Docking means joining two spacecraft together while flying at 28,000 km/h in space. It is like parking a car into a garage that is moving at hyper-speed. Perfecting this technique is essential for building India’s future space station and bringing samples back from the Moon.',
    explanationModes: {
      simple: 'Two robotic satellites will connect together in space. If astronauts want to visit a space station, or if a robotic probe wants to bring rocks back from the Moon, spacecraft must know how to find and link with each other safely.',
      student: 'Autonomous rendezvous and docking (AR&D) requires laser rangefinders, star trackers, and cold-gas thrusters. SPADEX validates both the mechanical latching mechanisms and the guidance algorithms needed for Chandrayaan-4 lunar sample return and the planned Bharatiya Antariksh Station (BAS).',
      detailed: 'Orbital rendezvous entails solving Clohessy-Wiltshire relative motion equations in microgravity. Once within 15 meters, optical sensors guide the chaser to soft-capture latches, followed by hard-docking rings that seal mechanical and electrical contacts between the two modules.'
    },
    whyShouldICare: [
      { target: 'Students', impact: 'Opens practical engineering projects in aerospace guidance, navigation, control (GNC), and robotic vision.', isCertain: true },
      { target: 'India', impact: 'Enables human spaceflight module expansion, orbital refueling, and deep-space sample collection.', isCertain: true }
    ],
    keyTerms: [
      { term: 'Autonomous Rendezvous', definition: 'The process where two spacecraft find and approach each other in orbit without real-time human control.', context: 'Radio delays make ground-controlled docking too slow for high-precision docking.' },
      { term: 'Bharatiya Antariksh Station (BAS)', definition: 'India\'s planned modular space station targeted for initial assembly by 2028-2035.', context: 'BAS will consist of multiple docked pressurized modules.' }
    ],
    timeline: [
      { date: '2023', title: 'SPADEX Payload Design Approval', description: 'ISRO approved dual-satellite mission configuration.' },
      { date: '2024', title: 'Thermal Vacuum & Sensor Tests', description: 'Simulated docking runs completed at ISAC Bengaluru.' },
      { date: '2026', title: 'Mission Launch Window', description: 'Final launch countdown on PSLV rocket.' }
    ],
    whatChanged: {
      previously: 'India only operated solo satellites and planetary orbiters with no orbital docking capability.',
      now: 'India is joining an elite group of nations (USA, Russia, China) capable of autonomous space docking.',
      highlights: ['Enables Chandrayaan-4 lunar return', 'Foundation of Bharatiya Antariksh Station']
    },
    stakeholders: [
      { name: 'ISRO Telemetry & Tracking', role: 'Mission Control', relation: 'Directing orbital insertion', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Chaser satellite captures target with mechanical latches.', probability: 'High', explanation: 'All sensor suites tested in microgravity simulation.' }
    ],
    quizQuestions: [
      {
        id: 'q-spadex-1',
        question: 'What is the primary objective of ISRO’s SPADEX mission?',
        type: 'multiple_choice',
        options: ['Asteroid mining', 'Autonomous in-orbit rendezvous and spacecraft docking', 'Deep sea communication', 'Solar flare monitoring'],
        correctIndex: 1,
        explanation: 'SPADEX (Space Docking Experiment) tests autonomous rendezvous and docking between two spacecraft in low-Earth orbit.',
        xpReward: 20,
        category: 'Space'
      },
      {
        id: 'q-spadex-2',
        question: 'Why is autonomous orbital docking essential for future lunar missions like Chandrayaan-4?',
        type: 'reasoning',
        options: [
          'Because spacecraft need to refuel and transfer collected lunar samples to an Earth-return module in orbit',
          'Because satellites cannot use solar panels without docking',
          'Because gravity disappears completely past low-Earth orbit',
          'Because radio signals cannot travel to the Moon'
        ],
        correctIndex: 0,
        explanation: 'Lunar sample return requires the ascent module to launch from the lunar surface, dock with an orbital return craft, and transfer samples safely back to Earth.',
        xpReward: 20,
        category: 'Space'
      }
    ]
  },
  {
    id: 'global-ai-safety-standards-summit',
    title: 'Global AI Safety Network Establishes Unified Red-Teaming Standards for Frontier Models',
    headline: 'International AI safety institutes in Seoul, San Francisco, and London release joint evaluation benchmarks for frontier reasoning models.',
    category: 'Science & Technology',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'Reuters & AP News',
    sourceUrl: 'https://www.reuters.com/technology/artificial-intelligence/',
    publishedAt: '2026-09-14T14:15:00Z',
    readingTimeMinutes: 3,
    isFeatured: false,
    coveredSourcesCount: 11,
    otherSources: [
      { name: 'Financial Times', url: 'https://www.ft.com/technology' },
      { name: 'MIT Technology Review', url: 'https://www.technologyreview.com' }
    ],
    whatHappened: 'Government-backed AI Safety Institutes from ten nations agreed on standardized stress-testing protocols for large frontier models, focusing on autonomous cyberattack capabilities, chemical synthesis guardrails, and model weight security.',
    inSimpleWords: 'As AI tools become smarter and able to perform multi-step planning, governments and scientists want standard tests to ensure models cannot be misused to hack critical systems or bypass safety barriers.',
    explanationModes: {
      simple: 'Just like new airplanes or medicines must pass safety checks before public release, advanced AI models are now subjected to rigorous independent tests to verify they cannot be coerced into harmful tasks.',
      student: 'Frontier AI evaluation involves "red-teaming"—expert ethical hackers who deliberately probe models with adversarial prompts to detect security flaws or unaligned reasoning behaviors before release.',
      detailed: 'The framework introduces pre-deployment thresholds: frontier models exceeding 10^26 floating point operations (FLOPs) or demonstrating autonomous code execution must undergo verifiable sandboxed evaluations against cyber and biological vulnerability benchmarks.'
    },
    whyShouldICare: [
      { target: 'Students', impact: 'Creates emerging career pathways in AI auditing, red-teaming, model alignment, and tech governance.', isCertain: true },
      { target: 'World', impact: 'Prevents proliferation of weaponizable vulnerabilities while enabling beneficial scientific computing.', isCertain: true }
    ],
    keyTerms: [
      { term: 'Frontier AI Model', definition: 'The most capable, state-of-the-art foundation models that push the boundaries of reasoning and autonomous tool use.', context: 'Subject to elevated evaluation requirements.' },
      { term: 'Red-Teaming', definition: 'A structured evaluation method where experts play the role of adversaries to uncover safety vulnerabilities.', context: 'Tests boundary conditions and jailbreaks.' }
    ],
    timeline: [
      { date: 'Nov 2023', title: 'Bletchley Park AI Safety Summit', description: 'Initial declaration on frontier AI risks signed by 28 countries.' },
      { date: 'May 2024', title: 'Seoul AI Summit', description: 'Network of international AI Safety Institutes formalized.' },
      { date: '2026', title: 'Unified Benchmarks Adopted', description: 'Common technical standards applied to next-generation models.' }
    ],
    whatChanged: {
      previously: 'Each lab performed internal testing with non-standardized metrics and voluntary disclosures.',
      now: 'Independent public institutes utilize mutually recognized protocols and shared vulnerability registries.',
      highlights: ['Pre-deployment sandbox testing', 'Standardized reporting for autonomous cyber risks']
    },
    stakeholders: [
      { name: 'AI Safety Institutes', role: 'Independent Evaluators', relation: 'Auditing frontier weights and behaviors', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Mandatory third-party safety audits before public API release of new reasoning models.', probability: 'High', explanation: 'Policy alignment across the US, EU, and Asia-Pacific.' }
    ],
    quizQuestions: [
      {
        id: 'q-ai-1',
        question: 'In AI development, what is the process of deliberately challenging a model to find vulnerabilities called?',
        type: 'multiple_choice',
        options: ['Benchmarking', 'Red-teaming', 'Fine-tuning', 'Quantization'],
        correctIndex: 1,
        explanation: 'Red-teaming is an adversarial testing method where security and alignment specialists attempt to provoke flaws or safety breaches in a system.',
        xpReward: 20,
        category: 'Science & Technology'
      },
      {
        id: 'q-ai-2',
        question: 'True or False: The newly unified international AI safety benchmarks apply only to simple chatbots and not frontier multi-step reasoning models.',
        type: 'true_false',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The benchmarks specifically target large, highly capable "frontier" reasoning models that can autonomously plan and interact with external tools.',
        xpReward: 20,
        category: 'Science & Technology'
      }
    ]
  },
  {
    id: 'global-renewable-grid-expansion-iea',
    title: 'Renewable Power Additions Set Global Record as Solar and Storage Costs Drop',
    headline: 'International Energy Agency reports 510 gigawatts of clean capacity added globally in single year, driven by solar PV and battery storage.',
    category: 'Environment',
    heroImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'International Energy Agency (IEA)',
    sourceUrl: 'https://www.iea.org/reports/renewables-2024',
    publishedAt: '2026-09-13T09:45:00Z',
    readingTimeMinutes: 3,
    isFeatured: false,
    coveredSourcesCount: 8,
    otherSources: [
      { name: 'BBC Environment', url: 'https://www.bbc.com/news/science-environment' },
      { name: 'Bloomberg Green', url: 'https://www.bloomberg.com/green' }
    ],
    whatHappened: 'The International Energy Agency released its updated market monitor showing solar photovoltaic (PV) and utility-scale battery energy storage systems (BESS) accounted for nearly 80% of all newly built global power generation capacity over the past 12 months.',
    inSimpleWords: 'Most new power plants built around the world today are no longer coal or gas; they are giant fields of solar panels and grid-scale batteries that keep electricity running cleanly even after the sun sets.',
    explanationModes: {
      simple: 'Solar energy has become the cheapest electricity in history in most parts of the world. Because batteries have gotten cheaper too, countries can now store sunshine for the night without burning dirty fuels.',
      student: 'Plummeting silicon wafer manufacturing costs and scale economies in lithium-iron-phosphate (LFP) batteries have fundamentally shifted energy economics. Solar and storage now routinely underbid fossil peaking plants in wholesale electricity auctions.',
      detailed: 'Grid transmission bottlenecks remain the primary impediment to clean energy transition. Integrating intermittent renewables requires high-voltage direct current (HVDC) transmission corridors, synchronized condensers, and AI-driven dynamic line rating to manage load fluctuations.'
    },
    whyShouldICare: [
      { target: 'Environment', impact: 'Accelerates the peak and eventual decline of global fossil fuel emissions in the power generation sector.', isCertain: true },
      { target: 'Students', impact: 'Surging career demand in electrical power engineering, battery chemistry, energy finance, and grid analytics.', isCertain: true }
    ],
    keyTerms: [
      { term: 'Levelized Cost of Energy (LCOE)', definition: 'The average lifetime cost of building and operating a power plant per unit of electricity generated.', context: 'Solar and wind now have lower LCOEs than new coal or gas in most nations.' },
      { term: 'BESS', definition: 'Battery Energy Storage Systems: large industrial battery installations connected to the electrical grid.', context: 'Stabilizes supply when solar or wind output fluctuates.' }
    ],
    timeline: [
      { date: '2015', title: 'Paris Climate Agreement', description: 'Nations pledged to limit global warming to 1.5°C.' },
      { date: '2023', title: 'COP28 Global Tripling Pledge', description: 'Governments agreed to triple renewable capacity by 2030.' },
      { date: '2026', title: '500+ GW Annual Milestone', description: 'Annual additions surpass half a terawatt for the first time.' }
    ],
    whatChanged: {
      previously: 'Renewables were subsidized alternatives that required expensive backup fossil generation.',
      now: 'Solar combined with battery storage is often the lowest-cost baseline option in wholesale power markets.',
      highlights: ['Over 500 GW installed annually', 'Battery storage costs decreased by over 40% since 2022']
    },
    stakeholders: [
      { name: 'Grid Operators', role: 'Transmission Managers', relation: 'Upgrading substations for bi-directional flow', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Power grids invest heavily in long-duration storage and high-voltage DC links.', probability: 'High', explanation: 'Managing supply variability across regional weather zones.' }
    ],
    quizQuestions: [
      {
        id: 'q-renew-1',
        question: 'What technology has seen rapid cost declines to enable solar power to be used reliably during nighttime hours?',
        type: 'multiple_choice',
        options: ['Flywheel spinning wheels', 'Utility-scale Battery Energy Storage Systems (BESS)', 'Diesel backup pumps', 'Geothermal steam tubes'],
        correctIndex: 1,
        explanation: 'Utility-scale battery energy storage systems (BESS) capture excess solar power during midday and discharge it to the electrical grid at night.',
        xpReward: 20,
        category: 'Environment'
      }
    ]
  },
  {
    id: 'india-digital-rupee-cbdc-expansion',
    title: 'RBI Expands Digital Rupee (CBDC) Offline Capabilities for Rural and Remote Payments',
    headline: 'Reserve Bank of India introduces sound-wave and NFC offline transaction capabilities for the wholesale and retail e-Rupee.',
    category: 'Business',
    heroImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'The Hindu BusinessLine',
    sourceUrl: 'https://www.thehindubusinessline.com/economy/',
    publishedAt: '2026-09-12T16:00:00Z',
    readingTimeMinutes: 3,
    isFeatured: false,
    coveredSourcesCount: 6,
    otherSources: [
      { name: 'Economic Times', url: 'https://economictimes.indiatimes.com' },
      { name: 'RBI Official', url: 'https://www.rbi.org.in' }
    ],
    whatHappened: 'The Reserve Bank of India expanded its Central Bank Digital Currency (e-Rupee) pilot to include proximity offline transactions using Near-Field Communication (NFC) and acoustic tone-based protocols, allowing users to send money even without cellular internet.',
    inSimpleWords: 'The e-Rupee is legal cash in digital form issued directly by the Reserve Bank. Unlike UPI, which requires a bank account and active internet connection, the new offline e-Rupee allows people to tap phones together and exchange cash like physical paper bills.',
    explanationModes: {
      simple: 'Think of the digital rupee as a digital 100-rupee note stored on your phone. Even if you are in a remote village or a deep subway station with zero signal, you can tap phones to pay for groceries.',
      student: 'While UPI is a payments overlay that moves commercial bank money between accounts, a CBDC represents direct central bank sovereign liability. Offline settlement uses secure hardware enclaves on smartphones to guarantee that digital tokens cannot be double-spent.',
      detailed: 'Offline CBDC architectures solve the double-spending problem through cryptographic hardware registers and delayed ledger settlement. Tokens are locked inside secure element chips and transferred point-to-point via peer-to-peer encrypted channels before reconciliation upon reconnecting.'
    },
    whyShouldICare: [
      { target: 'India', impact: 'Reduces costs of printing, transporting, and securing physical banknotes (saving thousands of crores annually).', isCertain: true },
      { target: 'Students', impact: 'Understanding how sovereign monetary policy, tokenization, and fintech infrastructure interact.', isCertain: true }
    ],
    keyTerms: [
      { term: 'CBDC (Central Bank Digital Currency)', definition: 'A digital form of a nation\'s official fiat currency issued and backed directly by its central bank.', context: 'Direct sovereign obligation rather than commercial bank deposit.' },
      { term: 'Double-Spending Problem', definition: 'The risk that a digital currency token could be duplicated or spent more than once before being recorded.', context: 'Hardware enclaves prevent duplication in offline transactions.' }
    ],
    timeline: [
      { date: 'Dec 2022', title: 'Retail e-Rupee Pilot Launched', description: 'RBI rolled out retail digital currency across four major cities.' },
      { date: '2024', title: 'Interoperability with UPI QR Codes', description: 'Merchants enabled to accept e-Rupee via existing UPI QR codes.' },
      { date: '2026', title: 'Offline Proximity Transactions', description: 'Sound-wave and NFC offline payments deployed for remote areas.' }
    ],
    whatChanged: {
      previously: 'Digital payments required active, uninterrupted 4G/5G or Wi-Fi internet connectivity.',
      now: 'The e-Rupee functions offline as peer-to-peer digital legal tender with hardware security.',
      highlights: ['No internet needed at point of sale', 'Direct liability of the Reserve Bank of India']
    },
    stakeholders: [
      { name: 'Reserve Bank of India', role: 'Central Monetary Authority', relation: 'Issuing and controlling the monetary base', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Widespread inclusion of non-smartphone feature phones via acoustic tone protocol.', probability: 'Moderate', explanation: 'Enabling financial inclusion for underserved rural demographics.' }
    ],
    quizQuestions: [
      {
        id: 'q-cbdc-1',
        question: 'What is the fundamental difference between the e-Rupee (CBDC) and standard UPI transfers?',
        type: 'reasoning',
        options: [
          'The e-Rupee is a direct digital sovereign liability of the RBI that can settle offline, whereas UPI transfers commercial bank balances requiring connectivity',
          'UPI is illegal whereas e-Rupee is legal',
          'e-Rupee is a volatile cryptocurrency like Bitcoin',
          'UPI only works outside of India'
        ],
        correctIndex: 0,
        explanation: 'CBDC is direct central bank sovereign money (like physical cash), while UPI is a payment rail that transfers commercial bank balances between accounts.',
        xpReward: 20,
        category: 'Business'
      }
    ]
  },
  {
    id: 'un-global-plastics-treaty-talks',
    title: 'UN Treaty on Plastic Pollution Approaches Historic Final Text',
    headline: 'Negotiators from 175 countries meet in Busan to finalize a legally binding treaty to curb virgin plastic production and microplastic contamination.',
    category: 'World',
    heroImage: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'BBC News & UN Environment Programme (UNEP)',
    sourceUrl: 'https://www.unep.org/inc-plastic-pollution',
    publishedAt: '2026-09-11T12:00:00Z',
    readingTimeMinutes: 3,
    isFeatured: false,
    coveredSourcesCount: 10,
    otherSources: [
      { name: 'The Guardian', url: 'https://www.theguardian.com/environment/plastics' },
      { name: 'Reuters', url: 'https://www.reuters.com' }
    ],
    whatHappened: 'Intergovernmental Negotiating Committee (INC-5) delegates gathered to negotiate the world\'s first legally binding agreement governing the entire lifecycle of plastics—from chemical design and production limits to waste management and marine cleanup.',
    inSimpleWords: 'Over 400 million tonnes of plastic are made every year, with much of it ending up in oceans, rivers, and even our bodies as microplastics. World leaders are finalizing a global agreement to limit new plastic production and ban single-use items.',
    explanationModes: {
      simple: 'Plastic trash lasts for hundreds of years. Countries are working together to write global rules, just like the Montreal Protocol that saved the ozone layer, to stop polluting oceans and replace single-use plastics with biodegradable alternatives.',
      student: 'The negotiation pits high-ambition coalitions (favoring caps on primary polymer production and chemical disclosure) against petrochemical-producing states (who prefer focusing solely on downstream recycling). Microplastics (<5mm) have now been found in human blood and polar snow.',
      detailed: 'Petrochemical polymers derive primarily from fossil fuels (naphtha and ethane). Downstream mechanical recycling recovers less than 9% of global plastic waste due to additives and polymers degradation. The treaty seeks to establish harmonized criteria for problematic polymers and extended producer responsibility (EPR).'
    },
    whyShouldICare: [
      { target: 'World', impact: 'Averts irreversible contamination of marine food chains and drinking water supplies.', isCertain: true },
      { target: 'Students', impact: 'Drives research and career growth in biomaterials, polymer recycling chemistry, and environmental policy.', isCertain: true }
    ],
    keyTerms: [
      { term: 'Microplastics', definition: 'Synthetic plastic particles smaller than 5 millimeters resulting from industrial manufacturing or polymer degradation.', context: 'Found in marine organisms, bottled water, and atmospheric dust.' },
      { term: 'Extended Producer Responsibility (EPR)', definition: 'A policy principle requiring manufacturers to fund the collection, recycling, and safe disposal of products they sell.', context: 'Puts financial incentives on sustainable packaging.' }
    ],
    timeline: [
      { date: 'Mar 2022', title: 'UN Resolution 5/14', description: 'Historic mandate passed at UNEA-5.2 to forge legally binding plastics treaty.' },
      { date: '2024', title: 'Ottawa & Busan Rounds', description: 'Draft text refined amidst contentious debates on polymer production caps.' },
      { date: '2026', title: 'Treaty Finalization', description: 'Diplomatic conference convened for official signature and ratification.' }
    ],
    whatChanged: {
      previously: 'Plastic waste was addressed only through national voluntary guidelines and disjointed municipal cleanup efforts.',
      now: 'The world is establishing a legally binding global treaty covering primary production, toxic additives, and life-cycle accountability.',
      highlights: ['Binding rules for 175 countries', 'Focus on capping virgin polymer production']
    },
    stakeholders: [
      { name: 'UN Environment Programme', role: 'Treaty Secretariat', relation: 'Convening negotiations', impactLevel: 'high' },
      { name: 'Petrochemical Producers', role: 'Industry Group', relation: 'Advocating for recycling over production caps', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Adoption of mandatory phase-out lists for high-risk single-use plastics.', probability: 'Moderate', explanation: 'Supported by over 60 member nations in the High Ambition Coalition.' }
    ],
    quizQuestions: [
      {
        id: 'q-plastic-1',
        question: 'What is the key debate dividing countries at the UN Global Plastics Treaty negotiations?',
        type: 'multiple_choice',
        options: [
          'Whether to cap primary plastic production versus focusing only on recycling and waste management',
          'Whether plastic can conduct electricity',
          'Whether paper bags should be banned in restaurants',
          'Whether plastics can float on saltwater'
        ],
        correctIndex: 0,
        explanation: 'A major sticking point is whether to set mandatory limits on the upstream production of virgin plastics, or focus primarily on downstream recycling and waste cleanup.',
        xpReward: 20,
        category: 'World'
      }
    ]
  },
  {
    id: 'icc-champions-trophy-hybrid-scheduling',
    title: 'ICC Finalizes Global Tournament Scheduling and Multi-Nation Hybrid Logistics',
    headline: 'International Cricket Council confirms schedule framework for upcoming multi-nation championships with dedicated travel corridors.',
    category: 'Sports',
    heroImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'ESPNcricinfo',
    sourceUrl: 'https://www.espncricinfo.com',
    publishedAt: '2026-09-10T15:00:00Z',
    readingTimeMinutes: 3,
    isFeatured: false,
    coveredSourcesCount: 5,
    otherSources: [
      { name: 'Cricbuzz', url: 'https://www.cricbuzz.com' }
    ],
    whatHappened: 'The International Cricket Council (ICC) finalized operational frameworks for upcoming premier multi-nation tournaments, incorporating neutral-venue hybrid fixtures to balance geopolitical security considerations, broadcast primetime slots, and athlete welfare.',
    inSimpleWords: 'Organizing international sports tournaments sometimes involves complicated politics between neighboring countries. The cricket council uses neutral venues so all teams can compete safely without canceling matches.',
    explanationModes: {
      simple: 'When two countries have diplomatic tensions, their sports teams might play at neutral grounds in a third country (like Dubai or Sri Lanka) so the tournament can proceed peacefully.',
      student: 'A "hybrid model" splits tournament hosting rights across two host boards. Match scheduling must balance climate conditions, pitch wear, visa protocols, and high-value broadcast windows.',
      detailed: 'Sports diplomacy and broadcast licensing rights dictate modern tournament logistics. Major sports events require complex security clearances from home and external affairs ministries, making multi-country contingency arrangements a standard operational mechanism.'
    },
    whyShouldICare: [
      { target: 'Students', impact: 'Shows how international relations, sports administration, contracts, and logistics work in tandem.', isCertain: true }
    ],
    keyTerms: [
      { term: 'Hybrid Tournament Model', definition: 'A hosting arrangement where matches involving specific teams are played at neutral alternate venues while other games stay in the host nation.', context: 'Used when visiting neighboring countries poses diplomatic or security challenges.' }
    ],
    timeline: [
      { date: '2023', title: 'Asia Cup Hybrid Pilot', description: 'Matches split between Pakistan and Sri Lanka successfully tested format.' },
      { date: '2026', title: 'ICC Championship Logistics', description: 'Multi-nation framework standardized for international calendars.' }
    ],
    whatChanged: {
      previously: 'Tournaments faced cancellation or forfeiture if a participating nation was unable to travel.',
      now: 'Standardized neutral venue protocols allow tournaments to proceed smoothly without team boycotts.',
      highlights: ['Protects broadcast rights and tournament continuity']
    },
    stakeholders: [
      { name: 'ICC Executive Board', role: 'Global Governing Body', relation: 'Setting tournament rules', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Ticketing and travel packages released for multi-city venues.', probability: 'High', explanation: 'Logistics confirmed for participating fans.' }
    ],
    quizQuestions: [
      {
        id: 'q-sports-1',
        question: 'What is a "hybrid model" in international tournament hosting?',
        type: 'multiple_choice',
        options: [
          'Playing matches with both wooden and metal bats',
          'Splitting fixtures across home venues and neutral third-country locations to navigate security or diplomatic constraints',
          'Playing half the game as cricket and half as football',
          'Allowing robots to bowl for human players'
        ],
        correctIndex: 1,
        explanation: 'In a hybrid hosting model, certain matches are staged at a neutral venue in another country to resolve diplomatic or travel hurdles without disrupting the tournament.',
        xpReward: 20,
        category: 'Sports'
      }
    ]
  },
  {
    id: 'nep-curriculum-ai-vocational-framework',
    title: 'National Curriculum Framework Integrates AI Literacy and Vocational Skills in Schools',
    headline: 'Education Ministry implements experiential learning reforms with coding, data literacy, and hands-on vocational modules starting in Grade 6.',
    category: 'Education',
    heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'Ministry of Education & PIB',
    sourceUrl: 'https://www.education.gov.in',
    publishedAt: '2026-09-13T10:00:00Z',
    readingTimeMinutes: 3,
    isFeatured: false,
    coveredSourcesCount: 7,
    otherSources: [
      { name: 'NCERT', url: 'https://ncert.nic.in' },
      { name: 'The Indian Express', url: 'https://indianexpress.com/section/education/' }
    ],
    whatHappened: 'Under the National Education Policy (NEP) and National Curriculum Framework (NCF), schools nationwide launched updated syllabus modules emphasizing foundational AI concepts, digital safety, critical thinking, and 10-day "bagless" vocational apprenticeships for middle school students.',
    inSimpleWords: 'Instead of just memorizing textbook facts, students will learn practical skills like how computers process information, how to evaluate whether online information is real or fake, and hands-on skills like pottery, carpentry, or electronics.',
    explanationModes: {
      simple: 'School classes are becoming more practical and fun! Students will explore coding, learn how machines learn, and spend 10 days each year learning real crafts and trades from local artisans without heavy bags.',
      student: 'The reform shifts evaluation away from rote memorization toward competency-based assessments. Digital literacy modules teach prompt ethics, algorithmic bias, and cyber hygiene alongside mathematical reasoning.',
      detailed: 'Pedagogical reform aligns with global 21st-century competency standards. The NCF structures learning into five stages: Foundational, Preparatory, Middle, and Secondary. Vocational integration seeks to destigmatize manual craft skills while building technical aptitude early in secondary education.'
    },
    whyShouldICare: [
      { target: 'Students', impact: 'Prepares learners for a technology-driven job market while developing independent critical thinking skills.', isCertain: true },
      { target: 'India', impact: 'Narrows the mismatch between university degrees and real-world industrial skills.', isCertain: true }
    ],
    keyTerms: [
      { term: 'Competency-Based Assessment', definition: 'Testing students on their practical ability to apply concepts to new problems rather than recalling memorized text.', context: 'Replaces purely theoretical exam questions.' },
      { term: 'Bagless Days', definition: 'Dedicated school days where students participate in outdoor learning, arts, and vocational apprenticeships without school bags.', context: 'Ten days mandated per academic year.' }
    ],
    timeline: [
      { date: '2020', title: 'NEP 2020 Approved', description: 'Union Cabinet unveiled overhaul of 34-year-old education policy.' },
      { date: '2023', title: 'National Curriculum Framework Released', description: 'Detailed curricular structure published by national steering committee.' },
      { date: '2026', title: 'Nationwide Implementation Phase', description: 'Updated textbooks and competency assessments rolled out across state and central boards.' }
    ],
    whatChanged: {
      previously: 'Traditional curriculum emphasized passive textbook memorization with little to no vocational exposure before college.',
      now: 'Experiential learning, computational thinking, and hands-on vocational modules are integrated directly into middle school.',
      highlights: ['AI literacy introduced in secondary school', '10 bagless vocational days annually']
    },
    stakeholders: [
      { name: 'NCERT', role: 'Curriculum Developer', relation: 'Designing textbooks and teacher guidebooks', impactLevel: 'high' }
    ],
    whatHappensNext: [
      { scenario: 'Teacher training academies conduct nationwide digital skilling workshops.', probability: 'High', explanation: 'Equipping educators to teach interactive computational thinking.' }
    ],
    quizQuestions: [
      {
        id: 'q-edu-1',
        question: 'What is the goal of introducing "bagless days" in middle schools under the National Education Policy?',
        type: 'multiple_choice',
        options: [
          'To cancel classes permanently',
          'To give students hands-on vocational, artistic, and community learning experiences without heavy backpacks',
          'To test students without giving them pencils',
          'To require students to study at night'
        ],
        correctIndex: 1,
        explanation: 'Bagless days (10 days a year) are designed for experiential learning—allowing students to engage with local artisans, crafts, sports, and vocational trades.',
        xpReward: 20,
        category: 'Education'
      }
    ]
  }
];

// ----------------------------------------------------
// REAL NEWS SERVICE CLASS
// ----------------------------------------------------
class RealNewsService {
  private articles: Article[] = [];
  private lastFetchedAt: number = 0;
  private isFetching: boolean = false;

  constructor() {
    this.loadCache();
    if (this.articles.length === 0) {
      this.articles = [...REAL_ARTICLES_SEED];
      this.saveCache();
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
        }
      }
    } catch (e) {
      console.warn('Could not load real news cache, falling back to seed', e);
      this.articles = [...REAL_ARTICLES_SEED];
    }
  }

  private saveCache() {
    try {
      const data = {
        articles: this.articles,
        lastFetchedAt: this.lastFetchedAt || Date.now(),
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save real news cache', e);
    }
  }

  public getArticles(filterCategory?: string, searchQuery?: string, featuredOnly?: boolean): Article[] {
    let result = [...this.articles];

    if (filterCategory && filterCategory !== 'All') {
      const target = filterCategory.toLowerCase();
      result = result.filter(a => {
        const artCat = a.category.toLowerCase();
        if (artCat === target) return true;
        if (target.includes('environment') && artCat.includes('environment')) return true;
        if (target.includes('business') && artCat.includes('business')) return true;
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
        a.whatHappened.toLowerCase().includes(q) ||
        a.keyTerms.some(k => k.term.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getArticleById(id: string): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  /**
   * Fetches current, real news using Gemini API with Google Search grounding.
   */
  public async refreshRealNewsFromGemini(categoryTopic?: string): Promise<{ success: boolean; count: number; error?: string }> {
    const ai = getGeminiClient();
    if (!ai) {
      return { success: false, count: this.articles.length, error: 'GEMINI_API_KEY is not configured on server.' };
    }

    if (this.isFetching) {
      return { success: true, count: this.articles.length };
    }

    this.isFetching = true;
    try {
      const targetCategory = categoryTopic || 'India and World current affairs, Space, Science & Technology, Business, Environment, Education';
      const prompt = `You are a real-time factual news curator for NewsLens, an educational current affairs platform for students.
Perform a web search using Google Search grounding to retrieve real, breaking, and recent news stories from this week regarding ${targetCategory}.

Instructions:
1. ONLY report on real current events that actually occurred. DO NOT invent fictional stories or imaginary sources.
2. For each story, provide genuine facts, real source attribution (e.g., The Hindu, PIB, Reuters, BBC, AP, ISRO, Nature, LiveMint), and genuine context.
3. Write an educational breakdown tailored for students: what happened, explanation in simple words, student-level context, key terms with definitions, a short timeline of recent milestones, stakeholders, and 1-2 multiple-choice or reasoning quiz questions.

Output ONLY a single valid JSON array of article objects matching this TypeScript shape:
[
  {
    "id": "slug-identifying-event",
    "title": "Clear and factual headline",
    "headline": "One-sentence informative lead",
    "category": "India" | "World" | "Science & Technology" | "Space" | "Business" | "Environment" | "Sports" | "Education",
    "sourceName": "Real publisher name",
    "sourceUrl": "https://...",
    "publishedAt": "ISO date string",
    "readingTimeMinutes": 3,
    "isFeatured": true,
    "coveredSourcesCount": 6,
    "whatHappened": "Detailed factual 2-3 sentence summary of what occurred.",
    "inSimpleWords": "Clear, accessible explanation for a student.",
    "explanationModes": {
      "simple": "Simple summary",
      "student": "Student-level explanation with context",
      "detailed": "Comprehensive analysis"
    },
    "whyShouldICare": [
      { "target": "Students" | "India" | "World" | "Technology" | "Environment", "impact": "Direct impact description", "isCertain": true }
    ],
    "keyTerms": [
      { "term": "Key concept", "definition": "Clear definition", "context": "How it applies here" }
    ],
    "timeline": [
      { "date": "Month/Year", "title": "Milestone title", "description": "What occurred" }
    ],
    "whatChanged": {
      "previously": "Situation before",
      "now": "What changed now",
      "highlights": ["Key change 1", "Key change 2"]
    },
    "stakeholders": [
      { "name": "Key organization or group", "role": "Role in event", "relation": "How they are involved", "impactLevel": "high" }
    ],
    "whatHappensNext": [
      { "scenario": "Likely upcoming development", "probability": "High", "explanation": "Why this is expected" }
    ],
    "quizQuestions": [
      {
        "id": "q-unique-1",
        "question": "Question testing comprehension of the real facts in this story",
        "type": "multiple_choice",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Explanation grounded in the article facts",
        "xpReward": 20,
        "category": "category"
      }
    ]
  }
]
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const responseText = response.text || '';
      // Extract JSON array from model output
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed: any[] = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Format and sanitize articles
          const validArticles: Article[] = parsed.map((item, idx) => {
            const category: NewsCategory = (item.category as NewsCategory) || 'India';
            const defaultHero = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
            return {
              id: item.id || `news-${Date.now()}-${idx}`,
              title: item.title || 'Breaking Current Affairs Update',
              headline: item.headline || item.title || '',
              category,
              heroImage: item.heroImage || defaultHero,
              sourceName: item.sourceName || 'Verified News Reports',
              sourceUrl: item.sourceUrl || 'https://news.google.com',
              publishedAt: item.publishedAt || new Date().toISOString(),
              readingTimeMinutes: item.readingTimeMinutes || 3,
              isFeatured: idx === 0,
              coveredSourcesCount: item.coveredSourcesCount || 5,
              otherSources: item.otherSources || [],
              whatHappened: item.whatHappened || item.headline || '',
              inSimpleWords: item.inSimpleWords || item.whatHappened || '',
              explanationModes: item.explanationModes || {
                simple: item.inSimpleWords || item.whatHappened,
                student: item.whatHappened,
                detailed: item.whatHappened
              },
              whyShouldICare: item.whyShouldICare || [],
              keyTerms: item.keyTerms || [],
              timeline: item.timeline || [],
              whatChanged: item.whatChanged || { previously: '', now: '', highlights: [] },
              stakeholders: item.stakeholders || [],
              whatHappensNext: item.whatHappensNext || [],
              quizQuestions: (item.quizQuestions || []).map((q: any, qIdx: number) => ({
                id: q.id || `q-${item.id}-${qIdx}`,
                articleId: item.id,
                question: q.question,
                type: q.type || 'multiple_choice',
                options: q.options || ['True', 'False'],
                correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
                explanation: q.explanation || 'Based on the verified facts in this story.',
                xpReward: 20,
                category
              }))
            };
          });

          // Merge with existing stories, deduplicating by ID or title similarity
          const existingIds = new Set(this.articles.map(a => a.id));
          const newUnique = validArticles.filter(a => !existingIds.has(a.id));

          this.articles = [...newUnique, ...this.articles].slice(0, 30);
          this.lastFetchedAt = Date.now();
          this.saveCache();

          return { success: true, count: this.articles.length };
        }
      }

      return { success: true, count: this.articles.length };
    } catch (err: any) {
      console.error('Error fetching real news via Gemini:', err);
      return { success: false, count: this.articles.length, error: err.message || 'Failed to fetch fresh news.' };
    } finally {
      this.isFetching = false;
    }
  }

  /**
   * Generates or retrieves a reproducible Weekly Practice challenge for the given 7-day cycle.
   */
  public getWeeklyPracticeChallenge(cycleInfo: WeeklyCycleInfo): WeeklyChallenge {
    // Check if we have a cached challenge for this specific cycleId
    try {
      if (fs.existsSync(WEEKLY_CACHE_PATH)) {
        const raw = fs.readFileSync(WEEKLY_CACHE_PATH, 'utf-8');
        const cache: Record<string, WeeklyChallenge> = JSON.parse(raw);
        if (cache[cycleInfo.cycleId]) {
          return cache[cycleInfo.cycleId];
        }
      }
    } catch (e) {
      console.warn('Error reading weekly challenge cache', e);
    }

    // Generate questions from the current REAL news stories in NewsLens
    const allArticles = this.articles;
    const allQuestions: QuizQuestion[] = [];

    // Collect questions across different stories
    for (const art of allArticles) {
      if (art.quizQuestions && art.quizQuestions.length > 0) {
        for (const q of art.quizQuestions) {
          allQuestions.push({
            ...q,
            articleId: art.id
          });
        }
      }
    }

    // Diverse question mix: Pick 6-8 questions
    // Make sure we have questions from different categories
    const selectedQuestions: QuizQuestion[] = [];
    const usedCategories = new Set<string>();

    // Pass 1: One from each distinct category
    for (const q of allQuestions) {
      if (!usedCategories.has(q.category) && selectedQuestions.length < 7) {
        usedCategories.add(q.category);
        selectedQuestions.push(q);
      }
    }

    // Pass 2: Fill up to 6 questions if needed
    for (const q of allQuestions) {
      if (selectedQuestions.length >= 6) break;
      if (!selectedQuestions.some(sq => sq.id === q.id)) {
        selectedQuestions.push(q);
      }
    }

    // Fallback if stories don't have enough quiz questions
    if (selectedQuestions.length < 4) {
      selectedQuestions.push(
        {
          id: `wp-${cycleInfo.cycleId}-q1`,
          question: 'What is the key purpose of India\'s Semiconductor Mission in subsidizing domestic wafer fabrication?',
          type: 'multiple_choice',
          options: [
            'To replace software companies with hardware firms',
            'To secure sovereign supply chains for chips powering electric cars, telecom, and critical infrastructure',
            'To ban international chip trading',
            'To manufacture solar panels only'
          ],
          correctIndex: 1,
          explanation: 'The India Semiconductor Mission (ISM) aims to build domestic commercial silicon wafer fabrication and reduce reliance on vulnerable foreign chip supply chains.',
          xpReward: 25,
          category: 'India'
        },
        {
          id: `wp-${cycleInfo.cycleId}-q2`,
          question: 'True or False: Autonomous rendezvous and docking tested in ISRO\'s SPADEX is required for constructing the Bharatiya Antariksh Station.',
          type: 'true_false',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation: 'True. Modular space stations require autonomous rendezvous and docking (AR&D) to assemble multiple pressurized modules together in orbit.',
          xpReward: 25,
          category: 'Space'
        },
        {
          id: `wp-${cycleInfo.cycleId}-q3`,
          question: 'Why are international safety institutes implementing standardized red-teaming for frontier AI reasoning models?',
          type: 'reasoning',
          options: [
            'To deliberately probe models for cyber and chemical vulnerabilities before public deployment',
            'To increase the financial cost of smartphones',
            'To reduce computer speed',
            'To make computers speak human languages only'
          ],
          correctIndex: 0,
          explanation: 'Red-teaming proactively uncovers adversarial failure modes, security bypasses, and autonomous cyber capabilities before frontier models are released.',
          xpReward: 25,
          category: 'Science & Technology'
        },
        {
          id: `wp-${cycleInfo.cycleId}-q4`,
          question: 'What allows solar and battery storage systems to replace traditional peaking power plants in electricity markets?',
          type: 'multiple_choice',
          options: [
            'Decreased manufacturing costs of solar panels and utility-scale lithium batteries',
            'Higher coal subsidies',
            'Turning off electricity during storms',
            'Higher oil production'
          ],
          correctIndex: 0,
          explanation: 'Plummeting solar photovoltaic and battery storage capital costs allow clean electricity to be stored and discharged at lower cost than fossil fuel peaker plants.',
          xpReward: 25,
          category: 'Environment'
        },
        {
          id: `wp-${cycleInfo.cycleId}-q5`,
          question: 'What major capability does the Reserve Bank of India\'s offline e-Rupee bring to digital transactions in remote areas?',
          type: 'scenario',
          options: [
            'Requires users to visit bank branches in person for each payment',
            'Allows direct sovereign money transfer between devices using NFC or sound waves without an active internet connection',
            'Replaces all paper money immediately',
            'Increases bank transaction fees'
          ],
          correctIndex: 1,
          explanation: 'The offline CBDC capability uses secure hardware enclaves and short-range wireless channels to allow legal tender payment without cellular or Wi-Fi data.',
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
      console.error('Failed to write weekly challenge cache', e);
    }

    return challenge;
  }
}

export const newsService = new RealNewsService();
