import { TopicInfo } from '../types';

export const MOCK_TOPICS: TopicInfo[] = [
  {
    id: 'topic-semiconductors',
    name: 'Semiconductors & Chip Geopolitics',
    category: 'Science & Technology',
    icon: 'Cpu',
    tagline: 'The microscopic engines powering modern civilization and global power.',
    summary: 'From electric vehicles to smartphones and AI supercomputers, microchips are the modern equivalent of oil. Learn why chip fabrication is the most complex manufacturing process on earth and how nations compete for chip sovereignty.',
    keyConcepts: [
      {
        term: 'Silicon Wafer Fabrication',
        explanation: 'The process of purifying silicon to 99.9999999% and using ultraviolet light to print microscopic circuits measuring only tens of nanometers wide.'
      },
      {
        term: 'Supply Chain Bottlenecks',
        explanation: 'Over 85% of global advanced processors (<5nm) are fabricated in Taiwan by TSMC, creating single-point vulnerabilities for global trade.'
      },
      {
        term: 'India’s Strategy',
        explanation: 'Fulfilling the ₹76,000 crore India Semiconductor Mission to build commercial fabs for mature nodes (28nm+) for cars and power grids.'
      }
    ],
    articleIds: ['india-semiconductor-mission', 'global-ai-safety-standards-summit'],
    quickQuiz: [
      {
        id: 'qq-chip-1',
        question: 'What is the primary base material used to manufacture computer microchips?',
        type: 'multiple_choice',
        options: ['Refined Silicon extracted from quartz sand', 'Pure Gold', 'Recycled Plastic', 'Natural Rubber'],
        correctIndex: 0,
        explanation: 'Silicon is an abundant semiconductor element that can conduct or insulate electricity when dosed with minute impurities.',
        xpReward: 15,
        category: 'Science & Technology'
      }
    ]
  },
  {
    id: 'topic-inflation-interest-rates',
    name: 'Inflation & Central Banks',
    category: 'Business',
    icon: 'TrendingUp',
    tagline: 'How money supply, repo rates, and grocery prices dictate the economy.',
    summary: 'Why do prices rise? How does the Reserve Bank of India use interest rates to cool down high prices without hurting business jobs? Discover the mechanics of monetary policy.',
    keyConcepts: [
      {
        term: 'Demand-Pull vs Cost-Push',
        explanation: 'Demand-pull occurs when too much money chases too few goods. Cost-push occurs when oil prices or crop failures push production costs higher.'
      },
      {
        term: 'Repo Rate Mechanism',
        explanation: 'Raising the repo rate makes borrowing more expensive, encouraging people to save rather than spend, cooling down excess price increases.'
      },
      {
        term: 'Purchasing Power',
        explanation: 'The amount of goods that one unit of currency can buy. High inflation reduces your real purchasing power over time.'
      }
    ],
    articleIds: ['india-digital-rupee-cbdc-expansion'],
    quickQuiz: [
      {
        id: 'qq-inflation-1',
        question: 'What happens to loan interest rates when a central bank raises the repo rate?',
        type: 'multiple_choice',
        options: ['Banks lower rates to zero', 'Banks increase loan interest rates to match higher borrowing costs', 'Nothing changes for anyone', 'Loans become free gifts'],
        correctIndex: 1,
        explanation: 'Higher central bank lending rates ripple through commercial banks, making auto, home, and personal loans more expensive.',
        xpReward: 15,
        category: 'Business & Economy'
      }
    ]
  },
  {
    id: 'topic-space-stations',
    name: 'Space Stations & Orbital Living',
    category: 'Space',
    icon: 'Rocket',
    tagline: 'Living and doing science 400 km above Earth in zero gravity.',
    summary: 'Space stations are artificial satellites serving as long-duration orbital laboratories. Explore how astronauts survive in microgravity and why India is building the Bharatiya Antariksh Station.',
    keyConcepts: [
      {
        term: 'Microgravity Research',
        explanation: 'Without gravity, protein crystals grow larger and purer, offering breakthroughs in cancer treatment drugs and aerospace alloys.'
      },
      {
        term: 'Modular Orbital Assembly',
        explanation: 'Connecting multiple launched segments using automated docking rings and hermetic airtight seals.'
      },
      {
        term: 'Life Support Systems (ECLSS)',
        explanation: 'Recycling 98% of astronaut sweat and urine into ultra-pure drinking water and splitting water into breathable oxygen.'
      }
    ],
    articleIds: ['spadex-space-docking-isro'],
    quickQuiz: [
      {
        id: 'qq-space-1',
        question: 'Why must space stations be built in multiple launched modules rather than launched all at once?',
        type: 'multiple_choice',
        options: [
          'Current rockets cannot lift a full 50-100 ton space station in a single launch',
          'Space stations shrink when exposed to sunlight',
          'Astronauts prefer assembling pieces in orbit like puzzles',
          'Rockets are not permitted to exceed 10 meters in height'
        ],
        correctIndex: 0,
        explanation: 'Rocket payload limits constrain single launches to 10-25 tons into Low Earth Orbit. Multiple modules must rendezvous and dock together in space.',
        xpReward: 15,
        category: 'Space'
      }
    ]
  },
  {
    id: 'topic-climate-resilience',
    name: 'Climate Resilience & Loss and Damage',
    category: 'Environment',
    icon: 'ShieldAlert',
    tagline: 'Protecting communities from extreme weather and ensuring global climate justice.',
    summary: 'As global temperatures surpass historical records, learn how coastal sea walls, AI satellite flood warnings, and multilateral disaster funds help human societies survive climate impacts.',
    keyConcepts: [
      {
        term: 'Mitigation vs Adaptation',
        explanation: 'Mitigation means cutting emissions (solar, EVs). Adaptation means preparing for inevitable impacts (sea walls, cyclone shelters).'
      },
      {
        term: 'Loss and Damage Framework',
        explanation: 'Compensating communities for irreversible climate destruction that cannot be adapted to.'
      },
      {
        term: 'Early Warning Technology',
        explanation: 'Using radar satellites, mountain seismic sensors, and cellular broadcasts to evacuate vulnerable populations before floods strike.'
      }
    ],
    articleIds: ['global-renewable-grid-expansion-iea', 'un-global-plastics-treaty-talks'],
    quickQuiz: [
      {
        id: 'qq-climate-1',
        question: 'Which of the following is an example of climate "adaptation"?',
        type: 'multiple_choice',
        options: [
          'Building sea walls and flood drainage to protect coastal towns',
          'Burning more coal to generate electricity',
          'Ignoring weather warnings during a monsoon',
          'Cutting down mangrove forests'
        ],
        correctIndex: 0,
        explanation: 'Climate adaptation focuses on proactive defenses (sea walls, elevated shelters, early warning sirens) to endure extreme weather events.',
        xpReward: 15,
        category: 'Environment'
      }
    ]
  },
  {
    id: 'topic-india-digital-infrastructure',
    name: 'India’s Digital Public Infrastructure (DPI)',
    category: 'India',
    icon: 'Cpu',
    tagline: 'How open protocols like UPI and Aadhaar revolutionized public service delivery.',
    summary: 'India pioneered the concept of Digital Public Infrastructure as a societal utility, enabling over a billion citizens to access digital banking, identity, and health records instantly.',
    keyConcepts: [
      {
        term: 'The India Stack',
        explanation: 'A three-tier architecture comprising identity (Aadhaar), payments (UPI), and data empowerment (DigiLocker/Account Aggregator).'
      },
      {
        term: 'Interoperable Protocol Rails',
        explanation: 'Open protocols allowing any bank or fintech app to talk to any other without walled gardens.'
      },
      {
        term: 'Cross-Border Fast Payments',
        explanation: 'Connecting domestic central bank payment gateways internationally to make remittances cheap and instantaneous.'
      }
    ],
    articleIds: ['india-digital-rupee-cbdc-expansion', 'india-semiconductor-mission'],
    quickQuiz: [
      {
        id: 'qq-india-dpi-1',
        question: 'What is the core philosophical difference between DPI (like UPI) and private card networks?',
        type: 'multiple_choice',
        options: [
          'DPI is built as an open public utility with interoperable rails rather than a proprietary walled garden',
          'DPI requires paper money deposits only',
          'DPI works without internet connections everywhere',
          'DPI is only accessible to multinational corporations'
        ],
        correctIndex: 0,
        explanation: 'Digital Public Infrastructure provides open, standardized protocol layers that any authorized bank or developer can build upon.',
        xpReward: 15,
        category: 'India'
      }
    ]
  },
  {
    id: 'topic-global-governance',
    name: 'Multilateral Accords & AI Governance',
    category: 'World',
    icon: 'ShieldAlert',
    tagline: 'How sovereign states cooperate on global technology and existential safety standards.',
    summary: 'When breakthrough technologies cross national borders, individual nations cannot regulate them in isolation. Explore how international treaties, summits, and accords set binding safety benchmarks.',
    keyConcepts: [
      {
        term: 'Frontier AI Safety Testing',
        explanation: 'Pre-deployment independent red-teaming and audits to verify autonomous capabilities and biosecurity safety.'
      },
      {
        term: 'Sovereign Regulatory Alignment',
        explanation: 'Harmonizing legal definitions across jurisdictions to prevent regulatory arbitrage.'
      }
    ],
    articleIds: ['global-ai-safety-standards-summit', 'un-global-plastics-treaty-talks'],
    quickQuiz: [
      {
        id: 'qq-world-1',
        question: 'Why do nations establish international accords for frontier technologies?',
        type: 'multiple_choice',
        options: [
          'Because digital systems and safety risks transcend national borders',
          'To ban computers globally',
          'To make software code secret forever',
          'To stop internet cables under oceans'
        ],
        correctIndex: 0,
        explanation: 'Technology flows across borders instantly, requiring international harmonization of safety testing protocols.',
        xpReward: 15,
        category: 'World'
      }
    ]
  },
  {
    id: 'topic-future-learning',
    name: 'Vocational Credits & Future of Education',
    category: 'Education',
    icon: 'Cpu',
    tagline: 'Bridging classroom theory with real-world skill apprenticeships.',
    summary: 'Traditional school systems often separate book knowledge from vocational crafts. Learn how credit frameworks like NEP create flexible multi-disciplinary pathways.',
    keyConcepts: [
      {
        term: 'Academic Bank of Credits (ABC)',
        explanation: 'A digital repository tracking course credits earned across different universities and certified skill institutes.'
      },
      {
        term: 'Multi-Disciplinary Flexibility',
        explanation: 'Allowing students to blend computer science with music, design, or environmental engineering seamlessly.'
      }
    ],
    articleIds: ['nep-curriculum-ai-vocational-framework'],
    quickQuiz: [
      {
        id: 'qq-edu-1',
        question: 'What does an Academic Bank of Credits allow a student to do?',
        type: 'multiple_choice',
        options: [
          'Store and transfer accredited learning credits across multiple institutions',
          'Withdraw cash from ATM machines',
          'Skip all exams permanently without studying',
          'Guarantee instant government jobs'
        ],
        correctIndex: 0,
        explanation: 'The Academic Bank of Credits digitally records credits earned across institutions, enabling flexible transfers and re-entries.',
        xpReward: 15,
        category: 'Education'
      }
    ]
  },
  {
    id: 'topic-sports-analytics',
    name: 'Sports Logistics & Hybrid Tournaments',
    category: 'Sports',
    icon: 'TrendingUp',
    tagline: 'How international sports bodies schedule tournaments across multi-nation corridors.',
    summary: 'From hybrid neutral-venue protocols to broadcasting primetime slots, modern sports administration balances geopolitics, athlete welfare, and global audience access.',
    keyConcepts: [
      {
        term: 'Hybrid Hosting Model',
        explanation: 'Staging fixtures across multiple host and neutral nations to navigate diplomatic or travel clearances without tournament cancellation.'
      },
      {
        term: 'Broadcast Window Logistics',
        explanation: 'Synchronizing international match timings to maximize live viewership across global timezones.'
      }
    ],
    articleIds: ['icc-champions-trophy-hybrid-scheduling'],
    quickQuiz: [
      {
        id: 'qq-sports-1',
        question: 'How do modern grandmasters use chess neural engines in tournament preparation?',
        type: 'multiple_choice',
        options: [
          'To test novel strategies, evaluate defensive variations, and study complex endgames',
          'To play in disguise during real-life board games',
          'To avoid exercising or physical fitness completely',
          'To replace human intuition entirely during the match'
        ],
        correctIndex: 0,
        explanation: 'Grandmasters train with AI engines beforehand to discover new ideas and pressure-test opening variations.',
        xpReward: 15,
        category: 'Sports'
      }
    ]
  }
];
