import { Article } from '../types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'india-semiconductor-mission',
    title: 'India Approves New Semiconductor Fab Projects Worth ₹1.26 Lakh Crore',
    headline: 'Major push for domestic chip fabrication begins with new plants in Dholera and Morigaon.',
    category: 'Science & Technology',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'The Hindu & PIB',
    sourceUrl: 'https://pib.gov.in',
    publishedAt: '2026-09-11T14:30:00Z',
    readingTimeMinutes: 3,
    isFeatured: true,
    coveredSourcesCount: 8,
    otherSources: [
      { name: 'LiveMint', url: 'https://livemint.com' },
      { name: 'Business Standard', url: 'https://business-standard.com' },
      { name: 'Reuters', url: 'https://reuters.com' },
      { name: 'Economic Times', url: 'https://economictimes.indiatimes.com' }
    ],
    whatHappened: 'The Union Cabinet has officially greenlit major commercial semiconductor fabrication and packaging units in Gujarat and Assam, partnering with Tata Electronics, Powerchip Semiconductor Manufacturing Corp (PSMC), and CG Power.',
    inSimpleWords: 'Think of semiconductors as the "brains" inside everything from your smartphone to electric cars. Right now, almost all of them are made in places like Taiwan. India is now building its own mega-factories so we can make these essential microchips ourselves.',
    explanationModes: {
      simple: 'Microchips are tiny electronic brains inside phones, laptops, cars, and satellites. India currently imports almost 100% of these chips. The government and big companies are spending huge funds to construct chip factories in India so we never run out when global trade gets disrupted.',
      student: 'Under the India Semiconductor Mission (ISM), the government is subsidizing 50% of the capital expenditure to build commercial silicon wafer fabs and packaging facilities. Tata Electronics is building a 28nm/55nm fab in Dholera, Gujarat, capable of rolling out 50,000 wafer starts per month to supply automotive, power electronics, and computing devices.',
      detailed: 'Semiconductor manufacturing involves ultra-pure cleanroom lithography to etch billions of transistors onto silicon wafers. Due to geopolitical vulnerabilities centered in the Taiwan Strait, countries worldwide are reshoring semiconductor capacity via industrial policies like the US CHIPS Act and India\'s ₹76,000-crore ISM. India\'s new fabs focus on trailing nodes (28nm to 90nm), which represent over 60% of volume demand for IoT, automotive, industrial machinery, and telecom components.'
    },
    whyShouldICare: [
      {
        target: 'Students',
        impact: 'Thousands of high-tech engineering and research roles will open up in VLSI design, materials science, chemical engineering, and robotics across Indian universities.',
        isCertain: true
      },
      {
        target: 'India',
        impact: 'Reduces foreign exchange outflow and shields India from global supply chain chokeholds during international crises.',
        isCertain: true
      },
      {
        target: 'Technology',
        impact: 'Spurs a domestic ecosystem of electronics design, printed circuit board (PCB) assembly, and indigenous chip IP development.',
        isCertain: true
      },
      {
        target: 'Future Careers',
        impact: 'Estimated to create 20,000 direct high-skilled technology jobs and over 100,000 indirect ecosystem jobs in logistics, supply, and equipment repair.',
        isCertain: false
      }
    ],
    keyTerms: [
      {
        term: 'Semiconductor Fab (Foundry)',
        definition: 'A specialized manufacturing facility where silicon wafers are processed and etched with billions of microscopic transistors under ultra-clean conditions.',
        context: 'Fabs cost billions of dollars and require uninterrupted water and electricity supplies.',
        category: 'Technology'
      },
      {
        term: 'Nanometer (nm) Node',
        definition: 'A metric referring to the generational density and transistor sizing in chip fabrication (e.g., 28nm vs 3nm).',
        context: 'Smaller nodes are faster and more power-efficient, but mature nodes (28nm+) remain workhorses for cars and home appliances.',
        category: 'Physics'
      },
      {
        term: 'ATMP / OSAT',
        definition: 'Assembly, Testing, Marking, and Packaging: the phase where processed silicon wafers are cut into individual dies and encased in protective protective housings.',
        context: 'ATMP is less capital-intensive than front-end fabrication and provides rapid employment.',
        category: 'Manufacturing'
      }
    ],
    timeline: [
      {
        date: 'Dec 2021',
        title: 'India Semiconductor Mission Launched',
        description: 'Cabinet approved ₹76,000 crore incentive package for chip ecosystem.',
        source: 'PIB'
      },
      {
        date: 'Jun 2023',
        title: 'Micron ATMP Facility Groundbreaking',
        description: 'Micron Technology began construction of $2.75 billion memory packaging facility in Sanand, Gujarat.',
        source: 'LiveMint'
      },
      {
        date: 'Feb 2024',
        title: 'First Commercial Fabs Approved',
        description: 'Tata-PSMC partnership receives green light for Dholera wafer plant.',
        source: 'Cabinet Release'
      },
      {
        date: 'Today',
        title: 'Construction & Equipment Procurement Underway',
        description: 'Civil construction reaches milestone; tool installation timelines finalized for first commercial silicon in late 2026.',
        source: 'Ministry of IT'
      }
    ],
    whatChanged: {
      previously: 'India had world-class chip design talent (over 20% of the world’s chip design engineers work in Bengaluru and Hyderabad), but zero commercial silicon wafer fabrication factories.',
      now: 'India is transitioning from pure chip design to actual physical chip manufacturing on home soil, with government co-funding 50% of the plant setup costs.',
      highlights: [
        'First commercial silicon wafer foundry under construction in Gujarat',
        'Advanced semiconductor packaging units in Assam expanding high-tech jobs to Northeast India',
        'Over 100 Indian universities introducing AICTE-approved VLSI curriculum'
      ]
    },
    stakeholders: [
      {
        name: 'Government of India',
        role: 'Policymaker & Funding Partner',
        relation: 'Providing 50% fiscal support and world-class industrial corridors.',
        impactLevel: 'high'
      },
      {
        name: 'Tata Electronics & PSMC',
        role: 'Fabrication Operator',
        relation: 'Building cleanrooms and managing complex lithography equipment operations.',
        impactLevel: 'high'
      },
      {
        name: 'Engineering Students',
        role: 'Future Workforce',
        relation: 'Beneficiaries of specialized training programs, internships, and research grants.',
        impactLevel: 'high'
      },
      {
        name: 'Automotive & Device Makers',
        role: 'Domestic Customers',
        relation: 'Will be able to source reliable microcontrollers without waiting months for overseas shipments.',
        impactLevel: 'medium'
      }
    ],
    viewpoints: {
      topic: 'Should governments invest billions in mature chip nodes instead of leading-edge (sub-5nm)?',
      confirmedFacts: [
        'Over 60% of global semiconductor demand uses mature nodes (28nm and above).',
        'Building a sub-3nm fab costs over $20 billion and requires extreme ultraviolet (EUV) lithography tools with multi-year waiting lists.'
      ],
      viewpointA: {
        title: 'Pragmatic & Industry-Aligned',
        argument: 'Mature nodes serve automobiles, energy grids, defense electronics, and consumer appliances—India’s biggest import burdens. Building these first generates revenue, trains local technicians, and creates foundational infrastructure before attempting sub-5nm.',
        sourceOrGroup: 'Industry Analysts & Ministry of Electronics'
      },
      viewpointB: {
        title: 'Risk of Technological Obsolescence',
        argument: 'Cutting-edge AI chips, high-end smartphones, and supercomputers require 2nm-4nm nodes. Heavy investment in older nodes might leave the country dependent on Taiwan and the US for next-generation computing.',
        sourceOrGroup: 'Global Tech Strategy Thinktanks'
      },
      sources: ['SemiAnalysis Report 2025', 'IEEE Spectrum Analysis', 'Ministry of Electronics and IT Press Release']
    },
    whatHappensNext: [
      {
        scenario: 'Pilot chip runs commence on schedule',
        probability: 'High',
        explanation: 'Cleanroom construction milestones are currently tracking on schedule with clean utilities in place.'
      },
      {
        scenario: 'Global component suppliers relocate to India',
        probability: 'Moderate',
        explanation: 'Chemical, gas, and substrate suppliers usually cluster around operational fabs within 2-3 years of launch.'
      }
    ],
    predictions: [
      {
        id: 'pred-chip-export',
        question: 'Will India produce and ship its first commercially packaged chip before December 2026?',
        options: [
          'Yes, ahead of or on schedule',
          'Delayed into early 2027',
          'Significant delays beyond 2027'
        ],
        expiresAt: '2026-12-31T23:59:59Z',
        category: 'Science & Technology',
        totalVotes: [342, 89, 14]
      }
    ],
    relatedArticleIds: ['chandrayaan-space-station', 'rbi-repo-rate-decision'],
    chunks: [
      'The Union Cabinet has officially greenlit major commercial semiconductor fabrication and packaging units in Gujarat and Assam, partnering with Tata Electronics, Powerchip Semiconductor Manufacturing Corp (PSMC), and CG Power.',
      'Under the India Semiconductor Mission (ISM), the government is subsidizing 50% of the capital expenditure to build commercial silicon wafer fabs and packaging facilities.',
      'Tata Electronics is building a 28nm/55nm fab in Dholera, Gujarat, capable of rolling out 50,000 wafer starts per month to supply automotive, power electronics, and computing devices.',
      'Microchips are tiny electronic brains inside phones, laptops, cars, and satellites. India currently imports almost 100% of these chips.',
      'Semiconductor manufacturing involves cleanroom lithography. Mature nodes represent over 60% of volume demand for IoT, automotive, and telecom components.'
    ]
  },
  {
    id: 'chandrayaan-space-station',
    title: 'ISRO Completes Key Docking Trials Ahead of Bharatiya Antariksh Station 2028 Launch',
    headline: 'Space agency validates autonomous rendezvous and docking sensors in orbit for future space station modules.',
    category: 'Space',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'ISRO & SpaceNews',
    sourceUrl: 'https://isro.gov.in',
    publishedAt: '2026-09-10T09:15:00Z',
    readingTimeMinutes: 3,
    coveredSourcesCount: 6,
    otherSources: [
      { name: 'NDTV Science', url: 'https://ndtv.com' },
      { name: 'Times of India', url: 'https://timesofindia.com' }
    ],
    whatHappened: 'The Indian Space Research Organisation (ISRO) has achieved successful ground and orbital simulations of its SPADEX (Space Docking Experiment), a critical capability required to link individual modules of India’s planned space station.',
    inSimpleWords: 'Just like snapping Lego blocks together in mid-air while flying at 28,000 km/h, spaceships need to "dock" with each other smoothly. ISRO has mastered this robotic connection technology, which is needed to build India’s own space station by 2028.',
    explanationModes: {
      simple: 'India is building its own space station called the Bharatiya Antariksh Station. To build a station, you cannot launch it all in one heavy rocket. You launch multiple pieces and connect them in space. ISRO tested the robotic eyes and latches that make this automatic connection possible.',
      student: 'The SPADEX mission validates two spacecraft (Chaser and Target) navigating towards each other using LIDAR, optical cameras, and cold-gas thrusters. Once within millimeters, mechanical latching mechanisms lock them hermetically. This technology is vital for Gaganyaan crew transfers, lunar sample return (Chandrayaan-4), and assembling the first module (BAS-1) in Low Earth Orbit.',
      detailed: 'Orbital rendezvous and docking requires solving complex relative celestial orbital mechanics with micro-propulsion precision. ISRO’s autonomous navigation and guidance algorithms must counteract gravitational gradient torque and solar radiation pressure without manual astronaut intervention. Successful autonomous docking places India among an elite group (USA, Russia, China) capable of multi-element space architecture assembly.'
    },
    whyShouldICare: [
      {
        target: 'Students',
        impact: 'Opens unprecedented microgravity research opportunities in Indian universities for biology, cancer drug development, and materials crystals.',
        isCertain: true
      },
      {
        target: 'India',
        impact: 'Guarantees sovereign scientific presence in Low Earth Orbit as the International Space Station (ISS) nears retirement around 2030.',
        isCertain: true
      },
      {
        target: 'Future Careers',
        impact: 'Surge in private aerospace startups in Bengaluru, Hyderabad, and Chennai supplying sensors, thermal blankets, and satellite telemetry systems.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Autonomous Docking',
        definition: 'The robotic process where two spacecraft find each other in orbit and lock together without manual pilot steering.',
        context: 'Used to deliver supplies, transfer astronauts, or connect station modules.',
        category: 'Space Science'
      },
      {
        term: 'Bharatiya Antariksh Station (BAS)',
        definition: 'India’s planned modular space station in Low Earth Orbit (~400 km altitude), with the first module scheduled for 2028.',
        context: 'Expected to weigh ~52 tonnes upon full completion by 2035.',
        category: 'Space Missions'
      },
      {
        term: 'LIDAR (Light Detection and Ranging)',
        definition: 'A remote sensing method using pulsed laser beams to calculate exact distances to target objects with millimeter accuracy.',
        context: 'Mounted on the Chaser spacecraft to calculate approach speed.',
        category: 'Optics'
      }
    ],
    timeline: [
      {
        date: 'Aug 2023',
        title: 'Chandrayaan-3 Historic South Pole Landing',
        description: 'India became the first nation to land near the lunar south pole.',
        source: 'ISRO'
      },
      {
        date: 'Oct 2023',
        title: 'Space Station Roadmap Announced',
        description: 'Prime Minister set target of 2028 for BAS-1 and 2040 for Indian astronaut on Moon.',
        source: 'PMO'
      },
      {
        date: 'Today',
        title: 'SPADEX Docking Trial Qualified',
        description: 'Sensors and latch mechanisms cleared for flight integration.',
        source: 'ISRO Press Briefing'
      }
    ],
    whatChanged: {
      previously: 'India had mastered launching satellites to specific orbits and landing on extraterrestrial bodies, but had never locked two moving spacecraft together in orbit.',
      now: 'ISRO possesses indigenous autonomous docking software and mechanical capture rings, removing foreign reliance for crewed station construction.',
      highlights: [
        'Robotic capture mechanism tested under simulated vacuum and thermal extremes',
        'Navigation algorithms proven to work without GPS dependencies',
        'Direct precursor to Chandrayaan-4 lunar sample return architecture'
      ]
    },
    stakeholders: [
      {
        name: 'ISRO Scientists & Engineers',
        role: 'Mission Architects',
        relation: 'Designing guidance, navigation, and docking hardware.',
        impactLevel: 'high'
      },
      {
        name: 'Indian Private Aerospace Vendors',
        role: 'Manufacturing Partners',
        relation: 'Supplying precision titanium latches, avionics, and solar arrays.',
        impactLevel: 'high'
      },
      {
        name: 'Medical & Material Researchers',
        role: 'Future Station Users',
        relation: 'Will run scientific experiments in true zero-gravity conditions.',
        impactLevel: 'medium'
      }
    ],
    whatHappensNext: [
      {
        scenario: 'Orbital SPADEX launch using PSLV',
        probability: 'High',
        explanation: 'Flight hardware has passed vibration and thermovac testing at UR Rao Satellite Centre.'
      },
      {
        scenario: 'Uncrewed Gaganyaan flight tests with Vyommitra humanoid',
        probability: 'High',
        explanation: 'Crew module safety systems and parachute jettisons verified in preliminary drop tests.'
      }
    ],
    predictions: [
      {
        id: 'pred-bas-module',
        question: 'Will the first module of Bharatiya Antariksh Station (BAS-1) launch by December 2028?',
        options: [
          'Yes, on or before 2028',
          'Delayed to 2029',
          'Postponed to 2030 or later'
        ],
        expiresAt: '2028-12-31T23:59:59Z',
        category: 'Space',
        totalVotes: [512, 114, 38]
      }
    ],
    relatedArticleIds: ['india-semiconductor-mission'],
    chunks: [
      'The Indian Space Research Organisation (ISRO) has achieved successful ground and orbital simulations of its SPADEX (Space Docking Experiment).',
      'This critical capability is required to link individual modules of India’s planned space station, the Bharatiya Antariksh Station (BAS).',
      'The SPADEX mission validates two spacecraft navigating towards each other using LIDAR, optical cameras, and cold-gas thrusters.',
      'Autonomous docking places India among an elite group capable of multi-element space station assembly.',
      'The first module of Bharatiya Antariksh Station is planned for launch by 2028.'
    ]
  },
  {
    id: 'rbi-repo-rate-decision',
    title: 'RBI Keeps Repo Rate Steady at 6.50% for Ninth Consecutive Review',
    headline: 'Central bank maintains balanced stance between controlling food inflation and supporting 7.2% GDP growth.',
    category: 'Business',
    heroImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'Reserve Bank of India',
    sourceUrl: 'https://rbi.org.in',
    publishedAt: '2026-09-08T11:00:00Z',
    readingTimeMinutes: 3,
    coveredSourcesCount: 11,
    otherSources: [
      { name: 'Bloomberg', url: 'https://bloomberg.com' },
      { name: 'CNBC-TV18', url: 'https://cnbctv18.com' },
      { name: 'Moneycontrol', url: 'https://moneycontrol.com' }
    ],
    whatHappened: 'The Reserve Bank of India’s Monetary Policy Committee (MPC) voted to hold the benchmark repo rate at 6.50%, noting that while overall economic growth remains robust at over 7%, volatile food prices require continued vigilance.',
    inSimpleWords: 'The repo rate is the interest rate at which commercial banks borrow money from the Reserve Bank of India. When this rate stays the same, home loans, car loans, and student loan EMIs usually don’t change.',
    explanationModes: {
      simple: 'Imagine the RBI as the "bank for other banks." If RBI charges banks 6.5% interest, your local bank charges you a little more (like 8.5%) for a loan. By keeping the rate unchanged, RBI is making sure things like groceries do not get too expensive while still helping businesses grow.',
      student: 'The Monetary Policy Committee has a mandate to keep consumer price inflation at 4% (within a tolerance band of 2% to 6%). Lowering the repo rate pumps more money into the economy, which can spark inflation. Raising it makes borrowing expensive and slows down growth. Holding it at 6.50% is a "wait-and-watch" neutral policy.',
      detailed: 'The MPC assessed headline CPI against stubborn food inflation pressures, especially in vegetables and pulses. With the US Federal Reserve adjusting international interest rates, the RBI must also protect the Rupee from sudden capital flight. India’s strong domestic investment cycle allows the central bank to prioritize price stability over immediate monetary easing.'
    },
    whyShouldICare: [
      {
        target: 'Families',
        impact: 'Monthly loan EMIs for home and auto loans will remain stable without unexpected jumps.',
        isCertain: true
      },
      {
        target: 'Students',
        impact: 'Education loan interest rates will remain steady for upcoming university admissions semesters.',
        isCertain: true
      },
      {
        target: 'India',
        impact: 'Protects the purchasing power of middle and lower-income households against runaway inflation.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Repo Rate',
        definition: 'The rate at which the central bank (RBI) lends money to commercial banks in the event of any shortfall of funds.',
        context: 'Used by monetary authorities to control inflation and credit liquidity.',
        category: 'Economics'
      },
      {
        term: 'Monetary Policy Committee (MPC)',
        definition: 'A 6-member committee consisting of RBI officials and external experts that meets bi-monthly to fix benchmark interest rates.',
        context: 'Each member casts a vote, with the RBI Governor holding the casting vote in case of a tie.',
        category: 'Governance'
      },
      {
        term: 'Headline vs Core Inflation',
        definition: 'Headline inflation measures the total inflation in an economy including food and energy, while Core inflation excludes volatile food and fuel prices.',
        context: 'In India, food accounts for nearly 46% of the consumer price basket.',
        category: 'Finance'
      }
    ],
    timeline: [
      {
        date: 'May 2022',
        title: 'Rate Hike Cycle Began',
        description: 'RBI rapidly hiked rates from 4.0% to combat post-pandemic global commodity shocks.',
        source: 'RBI Statement'
      },
      {
        date: 'Feb 2023',
        title: 'Repo Rate Reached 6.50%',
        description: 'Rates reached current pause level after cumulative 250 basis point hikes.',
        source: 'MPC Minutes'
      },
      {
        date: 'Today',
        title: 'Ninth Continuous Pause',
        description: 'MPC votes 4 to 2 to remain focused on withdrawal of accommodation.',
        source: 'Governor Address'
      }
    ],
    whatChanged: {
      previously: 'Analysts debated whether a rate cut would occur in mid-2026 as headline inflation briefly touched 4.5%.',
      now: 'The RBI reiterated that it will not cut rates prematurely until food inflation permanently aligns with the 4% target.',
      highlights: [
        'Repo rate retained at 6.50%',
        'FY27 GDP growth forecast retained at a resilient 7.2%',
        'Core inflation (non-food, non-fuel) remains benign at below 3.5%'
      ]
    },
    stakeholders: [
      {
        name: 'Borrowers & Homeowners',
        role: 'Loan Customers',
        relation: 'Fixed EMI burden without sudden increases in monthly installment payments.',
        impactLevel: 'high'
      },
      {
        name: 'Senior Citizens & Savers',
        role: 'Fixed Deposit Holders',
        relation: 'Continue enjoying attractive bank fixed deposit returns of 7.0%–7.5%.',
        impactLevel: 'medium'
      },
      {
        name: 'Corporates & Startups',
        role: 'Capital Borrowers',
        relation: 'Borrowing costs for new factory expansions remain at current plateau.',
        impactLevel: 'medium'
      }
    ],
    whatHappensNext: [
      {
        scenario: 'Monsoon crop arrivals cool food prices in Q4',
        probability: 'High',
        explanation: 'Favorable kharif harvest data indicates easing pulses and vegetable prices in winter months.'
      },
      {
        scenario: 'First 25 bps rate cut in early 2027',
        probability: 'Moderate',
        explanation: 'If food inflation stabilizes near 4%, MPC members may pivot to rate cuts to stimulate consumption.'
      }
    ],
    predictions: [
      {
        id: 'pred-rbi-rate-cut',
        question: 'When will the Reserve Bank of India announce its first rate cut?',
        options: [
          'December 2026 meeting',
          'February 2027 meeting',
          'Later in 2027 or beyond'
        ],
        expiresAt: '2027-02-28T23:59:59Z',
        category: 'Business & Economy',
        totalVotes: [210, 395, 78]
      }
    ],
    relatedArticleIds: ['india-semiconductor-mission'],
    chunks: [
      'The Reserve Bank of India’s Monetary Policy Committee (MPC) voted to hold the benchmark repo rate at 6.50%.',
      'While overall economic growth remains robust at over 7%, volatile food prices require continued vigilance.',
      'The repo rate is the interest rate at which commercial banks borrow money from the Reserve Bank of India.',
      'Headline inflation measures the total inflation in an economy including food and energy, while core inflation excludes volatile food and fuel prices.',
      'The MPC has a mandate to keep consumer price inflation at 4% with a tolerance band of 2% to 6%.'
    ]
  },
  {
    id: 'global-ai-safety-accord',
    title: '50 Nations Sign Landmark Geneva Treaty on AI Safety and Frontier Model Oversight',
    headline: 'Historic accord mandates independent red-teaming, watermarking standards, and biosecurity guardrails.',
    category: 'World',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'United Nations & Reuters',
    sourceUrl: 'https://un.org',
    publishedAt: '2026-09-09T18:00:00Z',
    readingTimeMinutes: 4,
    coveredSourcesCount: 14,
    otherSources: [
      { name: 'Associated Press', url: 'https://apnews.com' },
      { name: 'BBC News', url: 'https://bbc.com' },
      { name: 'The Guardian', url: 'https://theguardian.com' }
    ],
    whatHappened: 'Representatives from 50 nations, including India, the United States, the European Union, the United Kingdom, and Japan, have signed the Geneva Treaty on Frontier AI Systems, establishing binding safety evaluations for models trained on more than 10^26 floating-point operations (FLOPs).',
    inSimpleWords: 'Just like new airplanes must pass strict safety tests before carrying passengers, governments worldwide have agreed that ultra-powerful AI models must pass independent safety and security tests before being released to the public.',
    explanationModes: {
      simple: 'World leaders met in Geneva and agreed on common rules for very smart artificial intelligence. Companies making big AI models must now prove their software cannot be used for cyberattacks or dangerous biological weapons, and must clearly label AI-generated images and audio.',
      student: 'The Geneva Treaty establishes a global network of AI Safety Institutes (AISIs). Frontier models exceeding compute thresholds must undergo pre-deployment red-teaming for autonomous cyber capabilities, biological synthesis risks, and chemical weapon design. Crucially, open-source models below the high-risk compute threshold are protected from burdensome licensing.',
      detailed: 'The treaty creates a two-tiered regulatory architecture. Tier 1 applies to frontier dual-use foundation models, requiring third-party algorithmic audits, tamper-resistant synthetic media watermarking (using C2PA standards), and mandatory incident reporting within 72 hours. Tier 2 provides sovereign carve-outs for national defense research while establishing an International Scientific Panel on AI modelled on the IPCC for climate science.'
    },
    whyShouldICare: [
      {
        target: 'Students',
        impact: 'Protects against deepfake harassment, automated exam impersonation, and misleading synthetic educational content.',
        isCertain: true
      },
      {
        target: 'Technology',
        impact: 'Standardizes cryptographic watermarking so digital platforms can reliably detect AI-generated audio and video.',
        isCertain: true
      },
      {
        target: 'Future Careers',
        impact: 'Emergence of high-paying specializations in AI compliance, alignment engineering, ethical auditing, and algorithmic red-teaming.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Frontier AI Model',
        definition: 'Highly capable general-purpose foundation models that match or exceed the capabilities present in the most advanced models at the boundary of machine learning.',
        context: 'Measured by training compute (e.g., >10^26 FLOPs) and dual-use capabilities.',
        category: 'Computer Science'
      },
      {
        term: 'Red-Teaming',
        definition: 'A structured testing process where authorized security researchers deliberately attempt to bypass safety guardrails to discover vulnerabilities.',
        context: 'Helps identify prompt injection, bioweapon recipes, or cyber exploits before model weights are published.',
        category: 'Cybersecurity'
      },
      {
        term: 'Cryptographic Watermarking',
        definition: 'Techniques that embed invisible, tamper-evident digital signatures into generated media (text, images, audio) to prove authenticity.',
        context: 'Backed by the C2PA coalition to fight deepfakes and disinformation.',
        category: 'Cryptography'
      }
    ],
    timeline: [
      {
        date: 'Nov 2023',
        title: 'Bletchley Park Declaration',
        description: 'First international consensus on frontier AI risks signed in the UK.',
        source: 'Bletchley Summit'
      },
      {
        date: 'May 2024',
        title: 'Seoul AI Safety Commitments',
        description: 'Tech companies agreed to thresholds for catastrophic AI risk assessment.',
        source: 'Seoul Summit'
      },
      {
        date: 'Today',
        title: 'Binding Geneva Treaty Signed',
        description: '50 countries turn voluntary pledges into codified international treaty.',
        source: 'UN Press Office'
      }
    ],
    whatChanged: {
      previously: 'AI safety relied mainly on voluntary corporate pledges and fragmented national executive orders.',
      now: 'A multilateral treaty creates synchronized evaluation standards, mandatory reporting of safety incidents, and mutual recognition of AI safety testing certificates.',
      highlights: [
        '50 signatory nations commit to mutual safety standards',
        'Mandatory disclosure of dangerous model capabilities before commercial launch',
        'Specific safeguards protecting open-source developers from regulatory capture'
      ]
    },
    stakeholders: [
      {
        name: 'AI Labs & Tech Giants',
        role: 'Regulated Entities',
        relation: 'Must submit frontier training runs for independent third-party evaluations.',
        impactLevel: 'high'
      },
      {
        name: 'Open Source Community',
        role: 'Innovators',
        relation: 'Protected from onerous registration fees for research models below the frontier threshold.',
        impactLevel: 'medium'
      },
      {
        name: 'General Public & Internet Users',
        role: 'Consumers',
        relation: 'Protected by authentic media provenance and deepfake transparency labels.',
        impactLevel: 'high'
      }
    ],
    viewpoints: {
      topic: 'Should powerful AI models be strictly licensed by governments before release?',
      confirmedFacts: [
        'Frontier models can rapidly automate software coding and scientific paper summarization.',
        'Over 500 AI safety researchers signed warnings about unchecked autonomous system risks.'
      ],
      viewpointA: {
        title: 'Pro-Regulation & Safety First',
        argument: 'Catastrophic risks from autonomous cyberwarfare or biosecurity cannot be fixed after the fact. Just like pharmaceuticals and aviation, AI requires rigorous pre-market clearance.',
        sourceOrGroup: 'Safety Researchers & UN Envoys'
      },
      viewpointB: {
        title: 'Pro-Openness & Anti-Monopoly',
        argument: 'Excessive licensing rules benefit incumbent tech giants with armies of lawyers, suffocating open-source innovation, startups, and academic laboratories.',
        sourceOrGroup: 'Open Source Advocates & Venture Capitalists'
      },
      sources: ['Geneva Treaty Draft Text', 'Stanford AI Index 2026', 'Open Source Initiative Statement']
    },
    whatHappensNext: [
      {
        scenario: 'National parliaments ratify treaty protocols',
        probability: 'High',
        explanation: 'Key signatory governments have committed to introduce domestic enabling legislation within 180 days.'
      },
      {
        scenario: 'First standardized watermarking browser extensions roll out',
        probability: 'High',
        explanation: 'Major browser engines have already previewed native C2PA badge indicators in developer builds.'
      }
    ],
    predictions: [
      {
        id: 'pred-ai-watermark',
        question: 'Will all major social media platforms display mandatory AI watermarking badges by mid-2027?',
        options: [
          'Yes, widespread adoption across platforms',
          'Only partially adopted with frequent workarounds',
          'No, compliance stalls over technical hurdles'
        ],
        expiresAt: '2027-06-30T23:59:59Z',
        category: 'World',
        totalVotes: [420, 180, 45]
      }
    ],
    relatedArticleIds: ['india-semiconductor-mission', 'nep-vocational-credits'],
    chunks: [
      'Representatives from 50 nations, including India, the US, and EU, signed the Geneva Treaty on Frontier AI Systems.',
      'The treaty establishes binding safety evaluations for models trained on more than 10^26 floating-point operations (FLOPs).',
      'The treaty establishes a global network of AI Safety Institutes (AISIs). Frontier models exceeding compute thresholds must undergo pre-deployment red-teaming.',
      'Open-source models below the high-risk compute threshold are protected from burdensome licensing.',
      'It mandates synthetic media watermarking using C2PA standards and incident reporting within 72 hours.'
    ]
  },
  {
    id: 'nep-vocational-credits',
    title: 'UGC Implements National Credit Framework: Coding, Carpentry, and AI Now Count for College Degrees',
    headline: 'Colleges across India allow students to earn up to 50% of academic credits through hands-on vocational skills.',
    category: 'Education',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'University Grants Commission (UGC)',
    sourceUrl: 'https://ugc.gov.in',
    publishedAt: '2026-09-07T10:00:00Z',
    readingTimeMinutes: 3,
    coveredSourcesCount: 7,
    otherSources: [
      { name: 'Indian Express', url: 'https://indianexpress.com' },
      { name: 'NDTV Education', url: 'https://ndtv.com' }
    ],
    whatHappened: 'The University Grants Commission (UGC) and the Ministry of Education have enforced the National Credit Framework (NCrF) across all accredited higher education institutions. Students can now seamlessly transfer credits earned from apprenticeships, coding bootcamps, and creative arts into their degree transcripts.',
    inSimpleWords: 'Gone are the days when college was only about sitting in lectures and memorizing textbooks. If you build mobile apps, intern at an electric vehicle garage, or practice digital animation, those real-world hours can now directly earn you college degree marks.',
    explanationModes: {
      simple: 'In Indian colleges, students usually had to stick strictly to one subject and study mostly theory. With the new rules, half your college points can come from real work: like programming, drone repair, graphic design, or hands-on craftsmanship.',
      student: 'Under the National Credit Framework, learning hours are quantified via the Academic Bank of Credits (ABC). One credit equals approximately 30 hours of verified learning—whether in a physics lab, an industry internship, or an accredited online AI course. A BSc Physics student can earn credits in full-stack web development, and an arts student can study data analytics.',
      detailed: 'The NCrF removes the rigid artificial division between vocational education and mainstream academic streams as envisioned by the National Education Policy (NEP) 2020. Degrees become modular with multiple entry and exit points (Certificate at Year 1, Diploma at Year 2, Degree at Year 3, Honours at Year 4). The system interfaces with the National Skills Qualifications Framework (NSQF) to ensure industry parity.'
    },
    whyShouldICare: [
      {
        target: 'Students',
        impact: 'Earn college degrees with real employability skills and zero penalty for pursuing multidisciplinary passions.',
        isCertain: true
      },
      {
        target: 'Families',
        impact: 'Reduces the need to spend lakhs of rupees on parallel coaching or private diplomas after graduation.',
        isCertain: true
      },
      {
        target: 'Future Careers',
        impact: 'Direct campus hiring from companies that value demonstrable GitHub repositories, portfolios, and trade certifications.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Academic Bank of Credits (ABC)',
        definition: 'A digital repository hosted on DigiLocker that stores the academic credits earned by a student from various recognized institutions.',
        context: 'Allows students to transfer credits when changing universities or taking gap years.',
        category: 'Education Policy'
      },
      {
        term: 'Multiple Entry and Exit',
        definition: 'A flexible degree structure where students can exit with a Certificate after 1 year, a Diploma after 2 years, or a full Bachelor’s degree after 3–4 years.',
        context: 'Enables students who take financial or personal breaks to resume later without starting over.',
        category: 'University System'
      },
      {
        term: 'NCrF (National Credit Framework)',
        definition: 'A unified credit meta-framework encompassing school education, higher education, and vocational training/skill development.',
        context: 'Assigns uniform value to theoretical and practical learning hours.',
        category: 'National Policy'
      }
    ],
    timeline: [
      {
        date: 'Jul 2020',
        title: 'NEP 2020 Approved',
        description: 'Replaced the 34-year-old 1986 education policy with a focus on multidisciplinary learning.',
        source: 'Cabinet'
      },
      {
        date: 'Oct 2022',
        title: 'NCrF Draft Released',
        description: 'Inter-ministerial committee outlined credit assignment for skills and academics.',
        source: 'Ministry of Skill Development'
      },
      {
        date: 'Today',
        title: 'Nationwide Mandatory University Compliance',
        description: 'Over 800 universities integrate NCrF with digitized DigiLocker student accounts.',
        source: 'UGC Circular'
      }
    ],
    whatChanged: {
      previously: 'Students who spent hundreds of hours coding open-source software, making short films, or working as apprentices received zero credit toward their formal university degree marks.',
      now: 'Practical apprenticeships, trade skills, and verified technical bootcamps earn official academic credits that appear on final university grade cards.',
      highlights: [
        'Up to 50% credits permissible from practical & vocational courses',
        'Academic Bank of Credits integrated with DigiLocker for instant transfer',
        'Flexible degrees with 1-year certificate and 2-year diploma exit options'
      ]
    },
    stakeholders: [
      {
        name: 'College Students',
        role: 'Primary Beneficiaries',
        relation: 'Gain the freedom to combine diverse subjects without losing graduation progress.',
        impactLevel: 'high'
      },
      {
        name: 'University Faculty',
        role: 'Evaluators',
        relation: 'Need to design project-based grading rubrics rather than relying solely on end-semester exams.',
        impactLevel: 'high'
      },
      {
        name: 'Industry Employers',
        role: 'Skill Recruiters',
        relation: 'Can hire graduates who possess validated, hands-on apprenticeship hours.',
        impactLevel: 'medium'
      }
    ],
    whatHappensNext: [
      {
        scenario: 'Over 10 million students activate ABC credit accounts',
        probability: 'High',
        explanation: 'Mandatory enrollment for state university semester registrations is driving rapid signups.'
      },
      {
        scenario: 'Surge in university-corporate apprenticeship partnerships',
        probability: 'High',
        explanation: 'Companies in EV, green energy, and IT are actively accrediting their training modules with universities.'
      }
    ],
    predictions: [
      {
        id: 'pred-nep-vocational',
        question: 'Will more than 30% of Indian undergraduates choose multidisciplinary credit combinations by 2028?',
        options: [
          'Yes, rapid adoption',
          'Moderate adoption (15-30%)',
          'Low adoption (<15%) due to administrative inertia'
        ],
        expiresAt: '2028-06-30T23:59:59Z',
        category: 'Education',
        totalVotes: [290, 140, 52]
      }
    ],
    relatedArticleIds: ['india-semiconductor-mission', 'global-ai-safety-accord'],
    chunks: [
      'The University Grants Commission (UGC) and Ministry of Education have enforced the National Credit Framework (NCrF) across higher education institutions.',
      'Students can now transfer credits earned from apprenticeships, coding bootcamps, and creative arts into their degree transcripts.',
      'Under the National Credit Framework, learning hours are quantified via the Academic Bank of Credits (ABC). One credit equals approximately 30 hours of verified learning.',
      'The NCrF removes the rigid division between vocational education and mainstream academic streams.',
      'Degrees become modular with multiple entry and exit points (Certificate at Year 1, Diploma at Year 2, Degree at Year 3, Honours at Year 4).'
    ]
  },
  {
    id: 'himalayan-glacier-ai-warning',
    title: 'India Deploys AI-Powered Early Warning Network for Glacial Lake Outburst Floods',
    headline: '50 high-altitude sensors across Uttarakhand, Himachal, and Sikkim provide 4-hour alert window for downstream towns.',
    category: 'Environment',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'National Disaster Management Authority (NDMA)',
    sourceUrl: 'https://ndma.gov.in',
    publishedAt: '2026-09-06T08:30:00Z',
    readingTimeMinutes: 3,
    coveredSourcesCount: 5,
    otherSources: [
      { name: 'Down To Earth', url: 'https://downtoearth.org.in' },
      { name: 'Hindustan Times', url: 'https://hindustantimes.com' }
    ],
    whatHappened: 'The National Disaster Management Authority (NDMA), together with the Department of Space and Wadia Institute of Himalayan Geology, has completed the installation of automated sensor stations and satellite telemetry at 50 vulnerable glacial lakes across the Himalayas.',
    inSimpleWords: 'As climate change melts mountain glaciers, huge natural dams made of ice and rocks can suddenly burst and flood mountain valleys below. India has installed smart cameras, water sensors, and satellites that spot a burst instantly and text downstream villagers 4 hours before water hits.',
    explanationModes: {
      simple: 'High in the cold Himalayas, melting glaciers create deep lakes held back by loose gravel. If an avalanche falls into the lake, it creates a massive flash flood. Solar-powered sensors and satellites now watch these lakes 24/7. If water levels rise dangerously, sirens and SMS alerts immediately warn people downstream to move to higher ground.',
      student: 'Glacial Lake Outburst Floods (GLOFs) are sudden releases of millions of cubic meters of water when moraine dams fail. Climate warming has caused Himalayan glaciers to retreat by over 20 meters annually. The new telemetry network fuses high-resolution SAR satellite imagery with lake hydrostatic pressure probes, feeding real-time data to an AI model that predicts flood wave velocity and evacuation lead times.',
      detailed: 'The sensor suite combines ultrasonic water-level monitors, geophones for avalanche acoustic detection, and dual-frequency GNSS receivers to track dam moraine displacement. When a seismic trigger or breach threshold is detected, satellite uplink via ISRO’s GSAT-7 relays telemetry to the central disaster control room within 90 seconds, triggering automated emergency cell broadcasts to riverside communities.'
    },
    whyShouldICare: [
      {
        target: 'India',
        impact: 'Protects vital strategic mountain highways, border infrastructure, and downstream hydroelectric dams worth thousands of crores.',
        isCertain: true
      },
      {
        target: 'Families',
        impact: 'Saves thousands of lives in mountain villages and pilgrimage hubs by providing up to 4 hours of life-saving evacuation notice.',
        isCertain: true
      },
      {
        target: 'Environment',
        impact: 'Provides valuable long-term scientific data on real-time glacier retreat rates and climate-driven cryosphere dynamics.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'GLOF (Glacial Lake Outburst Flood)',
        definition: 'A catastrophic release of water when a natural glacial dam made of loose moraine rock or ice collapses suddenly.',
        context: 'Triggered by heavy rainfall, avalanches, or internal moraine melting.',
        category: 'Earth Science'
      },
      {
        term: 'Moraine',
        definition: 'A mass of rocks, gravel, and sediment carried down and deposited by a glacier, often forming an unstable natural dam.',
        context: 'Unlike engineered concrete dams, moraine dams can wash away in minutes under high hydrostatic pressure.',
        category: 'Geology'
      },
      {
        term: 'Early Warning System (EWS)',
        definition: 'An integrated system of sensors, communication links, and emergency alarms designed to alert communities before disaster strikes.',
        context: 'Gives civilians critical time to move to pre-designated higher elevation safety zones.',
        category: 'Disaster Management'
      }
    ],
    timeline: [
      {
        date: 'Oct 2023',
        title: 'South Lhonak Lake Disaster in Sikkim',
        description: 'Sudden GLOF washed away the Chungthang dam and caused widespread devastation, underscoring urgent need for automated sensors.',
        source: 'Disaster Assessment Report'
      },
      {
        date: 'Jan 2024',
        title: 'Himalayan Lake Vulnerability Mapping',
        description: 'ISRO mapped 28,000 glacial lakes, pinpointing 188 high-risk water bodies.',
        source: 'ISRO Cryosphere Study'
      },
      {
        date: 'Today',
        title: '50-Lake Autonomous Sensor Network Operational',
        description: 'Sikkim, Uttarakhand, and Himachal lakes equipped with satellite telemetry.',
        source: 'NDMA Release'
      }
    ],
    whatChanged: {
      previously: 'Himalayan glacial lakes were inaccessible for 6 months a year due to extreme winter blizzards, with zero real-time telemetry when dam breaches occurred.',
      now: 'Autonomous solar-powered sensors survive -40°C conditions and beam live depth and avalanche readings via ISRO satellites every 5 minutes.',
      highlights: [
        '50 highest-risk glacial lakes monitored in real time',
        'Evacuation lead times increased from 15 minutes to over 3 to 4 hours',
        'Direct cell broadcast integration sends loud sirens to all mobile phones in the river valley'
      ]
    },
    stakeholders: [
      {
        name: 'Himalayan Residents & Pilgrims',
        role: 'Downstream Citizens',
        relation: 'Primary beneficiaries who receive early sirens and evacuation guidance.',
        impactLevel: 'high'
      },
      {
        name: 'Hydroelectric Power Operators',
        role: 'Infrastructure Managers',
        relation: 'Can open sluice gates early to prevent dam silting and catastrophic breaches.',
        impactLevel: 'high'
      },
      {
        name: 'Climate Scientists',
        role: 'Researchers',
        relation: 'Receive pristine, continuous cryosphere datasets to calibrate climate models.',
        impactLevel: 'medium'
      }
    ],
    whatHappensNext: [
      {
        scenario: 'Expansion to an additional 100 lakes across Ladakh and Arunachal Pradesh',
        probability: 'High',
        explanation: 'Budget sanction has already been granted under the National Cryosphere Mission.'
      },
      {
        scenario: 'Controlled lake siphoning trials to lower water pressure before monsoon',
        probability: 'Moderate',
        explanation: 'Army engineers and scientists are testing high-density polyethylene siphons to drain excess water safely.'
      }
    ],
    predictions: [
      {
        id: 'pred-glof-network',
        question: 'Will India’s GLOF early warning network successfully detect and warn an event with zero casualties by 2027?',
        options: [
          'Yes, network will prove effective',
          'Partial warning but infrastructure damage will occur',
          'Sensors may experience communication outages during extreme blizzards'
        ],
        expiresAt: '2027-10-31T23:59:59Z',
        category: 'Environment',
        totalVotes: [310, 160, 48]
      }
    ],
    relatedArticleIds: ['chandrayaan-space-station'],
    chunks: [
      'The National Disaster Management Authority (NDMA) has completed the installation of automated sensor stations at 50 vulnerable glacial lakes across the Himalayas.',
      'Glacial Lake Outburst Floods (GLOFs) are sudden releases of millions of cubic meters of water when moraine dams fail.',
      'The sensor suite combines ultrasonic water-level monitors, geophones for avalanche detection, and dual-frequency GNSS receivers.',
      'When a breach threshold is detected, satellite uplink via ISRO GSAT relays telemetry to disaster control within 90 seconds.',
      'Evacuation lead times have increased to 3 to 4 hours for downstream communities.'
    ]
  },
  {
    id: 'solid-state-battery-ev',
    title: 'Next-Gen Solid-State EV Batteries Enter Mass Testing: 1,000 km Range on a 10-Minute Charge',
    headline: 'Replacing liquid flammable electrolytes with ceramic solid electrolytes eliminates fire risk and doubles energy density.',
    category: 'Science & Technology',
    heroImage: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'Automotive News & MIT Technology Review',
    sourceUrl: 'https://technologyreview.com',
    publishedAt: '2026-09-05T16:00:00Z',
    readingTimeMinutes: 3,
    coveredSourcesCount: 9,
    otherSources: [
      { name: 'Electrek', url: 'https://electrek.co' },
      { name: 'Nikkei Asia', url: 'https://asia.nikkei.com' }
    ],
    whatHappened: 'Leading automotive consortiums and battery research institutes have rolled out commercial pilot assembly lines for all-solid-state lithium-metal batteries, achieving over 450 Watt-hours per kilogram (Wh/kg) and passing rigorous puncture fire tests without thermal runaway.',
    inSimpleWords: 'Today’s electric car batteries use a liquid chemical that can catch fire if damaged and takes 30–45 minutes to charge. Scientists have replaced that liquid with a safe, solid ceramic layer. This means electric cars can drive 1,000 km on one charge and refill power in the time it takes to drink a cup of tea.',
    explanationModes: {
      simple: 'Think of a battery like a sandwich. Today’s batteries have a wet jelly inside that moves electricity back and forth. New solid-state batteries replace the wet jelly with a solid sheet of ceramic or polymer. They are completely fireproof, pack double the energy, and charge in just 10 minutes.',
      student: 'Conventional lithium-ion cells use liquid organic carbonate electrolytes and graphite anodes. Under fast-charging, microscopic lithium crystals called dendrites can pierce the separator and cause short circuits and fires. Solid-state batteries replace both the liquid and separator with a solid ceramic electrolyte (like LLZO or sulfide glass), permitting the use of pure lithium metal anodes with much higher specific capacity.',
      detailed: 'The commercial transition to solid-state batteries hinges on solving solid-solid interface impedance. When batteries charge and discharge, electrodes swell and shrink, which previously caused microscopic cracks and rapid capacity fade. New pliable sulfide-based electrolytes and isostatic pressure packaging maintain atomic contact over 1,500 continuous fast-charge cycles with over 90% retention.'
    },
    whyShouldICare: [
      {
        target: 'Environment',
        impact: 'Accelerates the replacement of petrol and diesel vehicles by eliminating "range anxiety" and fire fears permanently.',
        isCertain: true
      },
      {
        target: 'Technology',
        impact: 'Paves the way for electric passenger aircraft and long-haul electric freight trucks that were impossible with heavy liquid batteries.',
        isCertain: true
      },
      {
        target: 'Families',
        impact: 'Electric vehicle prices are projected to drop below petrol cars once solid-state lines scale up by 2028–2029.',
        isCertain: false
      }
    ],
    keyTerms: [
      {
        term: 'Solid Electrolyte',
        definition: 'A non-flammable solid material (such as ceramic, glass, or solid polymer) that conducts lithium ions between cathode and anode instead of liquid chemicals.',
        context: 'Eliminates battery fire and explosion hazards completely.',
        category: 'Materials Science'
      },
      {
        term: 'Energy Density (Wh/kg)',
        definition: 'The amount of electrical energy a battery can store per unit of weight.',
        context: 'Higher energy density means electric cars can drive farther without becoming heavier.',
        category: 'Physics'
      },
      {
        term: 'Lithium Dendrites',
        definition: 'Microscopic tree-like spikes of lithium metal that can grow inside liquid batteries during fast charging and pierce the separator.',
        context: 'Solid electrolytes act as physical barriers preventing dendrite short-circuits.',
        category: 'Chemistry'
      }
    ],
    timeline: [
      {
        date: '2020-2022',
        title: 'Laboratory Breakthroughs',
        description: 'Researchers proved lithium-metal anodes could function with sulfide electrolytes in coin cells.',
        source: 'Nature Energy'
      },
      {
        date: '2024',
        title: 'Automaker Pilot Investments',
        description: 'Toyota, QuantumScape, and CATL unveiled prototype multi-layer pouch cells.',
        source: 'Reuters'
      },
      {
        date: 'Today',
        title: 'Commercial Pilot Line Testing',
        description: 'Vehicles with production-grade solid-state packs begin public road winter trials.',
        source: 'Automotive News'
      }
    ],
    whatChanged: {
      previously: 'Electric vehicles were limited by heavy lithium-ion batteries that lose range in winter and require 30–60 minutes at high-speed charging stations.',
      now: 'Solid-state battery cells can absorb power at 4C rates (10-minute full charges) while surviving -30°C to +60°C temperatures with zero degradation.',
      highlights: [
        'Energy density reached 450 Wh/kg (nearly double conventional LFP batteries)',
        'Zero flammable liquids—passed nail penetration and blowtorch fire tests',
        'First test fleets on road, targeting mass market showroom rollout by 2028'
      ]
    },
    stakeholders: [
      {
        name: 'Electric Vehicle Buyers',
        role: 'Consumers',
        relation: 'Enjoy gas-car convenience: 1,000 km range with 10-minute highway recharge stops.',
        impactLevel: 'high'
      },
      {
        name: 'Automakers & Battery Giants',
        role: 'Manufacturers',
        relation: 'Racing to retool gigafactories to avoid obsolescence in the next decade.',
        impactLevel: 'high'
      },
      {
        name: 'Power Grid Operators',
        role: 'Energy Utilities',
        relation: 'Need to upgrade highway substation capacity to supply ultra-fast 350 kW charging spikes.',
        impactLevel: 'medium'
      }
    ],
    whatHappensNext: [
      {
        scenario: 'Luxury flagship EVs debut solid-state options in 2027',
        probability: 'High',
        explanation: 'Initial production will carry a premium price tag before manufacturing yields reach economies of scale.'
      },
      {
        scenario: 'Cost parity with conventional lithium-ion batteries by 2030',
        probability: 'Moderate',
        explanation: 'Depends on scaling dry-electrode processing and synthetic sulfide production yields.'
      }
    ],
    predictions: [
      {
        id: 'pred-ev-solid-state',
        question: 'Will solid-state batteries power more than 10% of newly sold electric cars by 2030?',
        options: [
          'Yes, rapid scaling replaces lithium-ion',
          'No, lithium-iron-phosphate (LFP) will remain dominant due to lower cost',
          'Only in luxury and commercial aviation niches'
        ],
        expiresAt: '2030-12-31T23:59:59Z',
        category: 'Science & Technology',
        totalVotes: [340, 290, 110]
      }
    ],
    relatedArticleIds: ['india-semiconductor-mission', 'himalayan-glacier-ai-warning'],
    chunks: [
      'Leading automotive consortiums have rolled out commercial pilot assembly lines for all-solid-state lithium-metal batteries.',
      'Achieving over 450 Watt-hours per kilogram (Wh/kg), the cells pass puncture fire tests without thermal runaway.',
      'Solid-state batteries replace liquid organic carbonate electrolytes with a solid ceramic or polymer electrolyte, permitting pure lithium metal anodes.',
      'Microscopic lithium dendrites that caused fires in liquid cells cannot penetrate the dense solid ceramic separator.',
      'Vehicles can achieve 1,000 km range on a single charge and recharge in under 10 minutes.'
    ]
  },
  {
    id: 'india-chess-olympiad-victory',
    title: 'Historic Double Gold: India Sweeps Open and Women’s Titles at 45th Chess Olympiad',
    headline: 'Young Grandmasters showcase unparalleled tactical depth in Budapest, signaling a new era of global chess dominance.',
    category: 'Sports',
    heroImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'FIDE & All India Chess Federation',
    sourceUrl: 'https://fide.com',
    publishedAt: '2026-09-04T19:30:00Z',
    readingTimeMinutes: 3,
    coveredSourcesCount: 12,
    otherSources: [
      { name: 'Sportstar', url: 'https://sportstar.thehindu.com' },
      { name: 'ESPN', url: 'https://espn.com' }
    ],
    whatHappened: 'India created sports history by winning both the Open and Women’s section gold medals at the 45th Chess Olympiad in Budapest, Hungary. The young Indian squad dominated powerhouse nations like the United States, China, and Uzbekistan.',
    inSimpleWords: 'In the biggest global chess tournament on Earth, both the Indian men’s and women’s teams won historic gold medals. Most of the players are teenagers or in their early twenties, proving India is now the undisputed world capital of chess.',
    explanationModes: {
      simple: 'The Chess Olympiad is like the Olympics for chess. Over 180 countries sent their smartest grandmasters. The Indian players played with incredible teamwork and mental stamina to win first place in both categories, a rare feat in sporting history.',
      student: 'The victory reflects a generational revolution sparked by 5-time world champion Viswanathan Anand and accelerated by modern computer chess engines. Grandmasters like Gukesh D, Praggnanandhaa, Arjun Erigaisi, Vaishali Rameshbabu, and Divya Deshmukh demonstrated unprecedented calculation accuracy, with several players crossing the historic 2800 FIDE rating mark.',
      detailed: 'India’s team strategy maximized individual board strengths. Board 1 played solid, impenetrable positional games to neutralize rival world champions, while lower boards weaponized sharp computer-prepared novelties to grind out decisive wins. The structural depth of Indian chess is backed by widespread grassroots tournaments, dedicated academies, and government financial support via the Target Olympic Podium Scheme (TOPS).'
    },
    whyShouldICare: [
      {
        target: 'Students',
        impact: 'Inspires youth to pursue strategic thinking, deep focus, and mathematical calculation over passive screen consumption.',
        isCertain: true
      },
      {
        target: 'India',
        impact: 'Cements India’s global reputation as a premier intellectual powerhouse and sporting superpower.',
        isCertain: true
      },
      {
        target: 'Future Careers',
        impact: 'Boom in professional coaching, sports psychology, and chess analytics software development across Indian cities.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Grandmaster (GM)',
        definition: 'The highest title a chess player can attain, awarded by the International Chess Federation (FIDE) for life.',
        context: 'Requires reaching a FIDE Elo rating of at least 2500 and achieving three favorable results ("norms") in international tournaments.',
        category: 'Sports'
      },
      {
        term: 'FIDE Rating',
        definition: 'A numerical scoring system used by the International Chess Federation to measure the skill level of a player.',
        context: 'A rating over 2700 is considered "Super Grandmaster"; crossing 2800 is achieved by only a handful of legends in history.',
        category: 'Analytics'
      },
      {
        term: 'Chess Engine & Opening Novelty',
        definition: 'Advanced AI programs (like Stockfish or Leela Chess Zero) used by grandmasters to analyze millions of positions per second and uncover new strategic moves.',
        context: 'A "novelty" is a previously unplayed move prepared in secret to surprise an opponent.',
        category: 'Technology & Sports'
      }
    ],
    timeline: [
      {
        date: '1988',
        title: 'Viswanathan Anand Becomes India’s 1st GM',
        description: 'Anand’s rise ignited the modern chess movement across India.',
        source: 'AICF History'
      },
      {
        date: '2022',
        title: 'Chennai Hosts 44th Olympiad',
        description: 'India hosted the Olympiad and won historic bronze medals with teenage teams.',
        source: 'FIDE'
      },
      {
        date: 'Today',
        title: 'Double Gold Swept in Budapest',
        description: 'India finishes tournament with historic match points margin and zero team losses.',
        source: 'FIDE Official Standings'
      }
    ],
    whatChanged: {
      previously: 'For decades, the Soviet Union, Russia, and later the United States and China dominated international team chess Olympiads.',
      now: 'India has produced the youngest, highest-rated contingent of Super Grandmasters in history, sweeping both open and women’s global team championships.',
      highlights: [
        'India won both Open and Women’s Gold at the same Olympiad',
        'Multiple individual board gold medals earned with 9.5/11 performances',
        'India’s average team age is among the youngest ever for a gold medal squad'
      ]
    },
    stakeholders: [
      {
        name: 'Young Chess Grandmasters',
        role: 'Champions',
        relation: 'Cemented their status as world championship contenders for the next two decades.',
        impactLevel: 'high'
      },
      {
        name: 'School Students Across India',
        role: 'Emerging Players',
        relation: 'Surge in school chess clubs and grassroots district competitions.',
        impactLevel: 'high'
      },
      {
        name: 'All India Chess Federation (AICF)',
        role: 'Sports Body',
        relation: 'Receiving expanded corporate sponsorships and state-of-the-art training camp funds.',
        impactLevel: 'medium'
      }
    ],
    whatHappensNext: [
      {
        scenario: 'India hosts upcoming World Chess Championship matches',
        probability: 'High',
        explanation: 'FIDE has commended Indian infrastructure and massive viewership interest.'
      },
      {
        scenario: 'Over 100 Indian Grandmasters milestone reached by 2027',
        probability: 'High',
        explanation: 'Dozens of International Masters (IMs) already hold one or two GM norms.'
      }
    ],
    predictions: [
      {
        id: 'pred-world-chess-champ',
        question: 'Will an Indian Grandmaster hold the Classical World Chess Championship title by the end of 2027?',
        options: [
          'Yes, Indian champion crowned',
          'Rival from China/US retains or wins title',
          'Contested in tiebreaks with close finish'
        ],
        expiresAt: '2027-12-31T23:59:59Z',
        category: 'Sports',
        totalVotes: [520, 110, 85]
      }
    ],
    relatedArticleIds: ['nep-vocational-credits'],
    chunks: [
      'India created sports history by winning both the Open and Women’s section gold medals at the 45th Chess Olympiad in Budapest, Hungary.',
      'The young Indian squad dominated powerhouse nations like the United States, China, and Uzbekistan.',
      'Grandmasters like Gukesh D, Praggnanandhaa, Arjun Erigaisi, Vaishali Rameshbabu, and Divya Deshmukh demonstrated unprecedented calculation accuracy.',
      'The victory reflects a generational revolution sparked by 5-time world champion Viswanathan Anand.',
      'India’s team strategy maximized individual board strengths with computer-prepared novelties and rock-solid defense.'
    ]
  },
  {
    id: 'un-loss-damage-climate-fund',
    title: 'UN Loss and Damage Climate Fund Disburses First $1 Billion to Vulnerable Island Nations',
    headline: 'Historic mechanism moves from diplomatic pledge to real relief for communities facing sea level rise and severe typhoons.',
    category: 'Environment',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'United Nations Framework Convention on Climate Change (UNFCCC)',
    sourceUrl: 'https://unfccc.int',
    publishedAt: '2026-09-03T12:00:00Z',
    readingTimeMinutes: 3,
    coveredSourcesCount: 8,
    whatHappened: 'The governing board of the UN Loss and Damage Fund, established at COP27 and finalized at COP28, has approved its first tranche of direct emergency recovery and sea-wall adaptation grants to ten low-lying island states in the Pacific and Caribbean.',
    inSimpleWords: 'Countries that contributed the least to global pollution often suffer the worst damage from rising oceans and ferocious storms. The world has created a shared fund where wealthier nations pay money to help vulnerable islands rebuild homes and sea walls.',
    explanationModes: {
      simple: 'Small island nations in the Pacific did not build the big coal factories that caused climate change, but rising sea waters are washing away their beaches and drinking wells. Wealthier countries have put money into a global emergency account to help these islands protect their people.',
      student: 'The "Loss and Damage" principle acknowledges that mitigation (cutting emissions) and adaptation (building storm barriers) are no longer enough for irreversible climate impacts. When saltwater permanently contaminates freshwater aquifers or coastal land erodes completely, financial compensation and reconstruction grants are legally coordinated through the World Bank hosted secretariat.',
      detailed: 'Disbursements are prioritized according to multidimensional vulnerability indices (MVI) rather than gross domestic product (GDP). The first $1 billion funding tranche is structured as non-debt grants rather than concessionary loans, avoiding exacerbating the sovereign debt distress of developing island states. Monies are channeled directly into mangrove restoration, elevated community storm shelters, and solar-powered desalination units.'
    },
    whyShouldICare: [
      {
        target: 'Environment',
        impact: 'Sets a global precedent that environmental restoration must be funded by major historical emitters.',
        isCertain: true
      },
      {
        target: 'World',
        impact: 'Fosters diplomatic trust between the Global North and Global South during critical international negotiations.',
        isCertain: true
      },
      {
        target: 'Students',
        impact: 'Teaches environmental justice, international law, and real-world humanitarian resource distribution.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Loss and Damage',
        definition: 'Economic and non-economic harm caused by climate change that cannot be avoided by cutting emissions (mitigation) or building defenses (adaptation).',
        context: 'Includes loss of lives, homes, territory, and cultural heritage.',
        category: 'Climate Policy'
      },
      {
        term: 'COP (Conference of the Parties)',
        definition: 'The annual supreme decision-making body of the United Nations Framework Convention on Climate Change (UNFCCC).',
        context: 'Where nearly 200 countries meet to negotiate binding climate treaties.',
        category: 'International Relations'
      },
      {
        term: 'Climate Justice',
        definition: 'A framework treating climate change as an ethical, legal, and human rights issue rather than purely an environmental or physical phenomenon.',
        context: 'Advocates that those who polluted most should bear the greatest financial responsibility.',
        category: 'Ethics & Law'
      }
    ],
    timeline: [
      {
        date: '1991',
        title: 'Vanuatu First Proposes Loss and Damage',
        description: 'Island nation proposed an insurance mechanism for sea level rise 35 years ago.',
        source: 'UN Archives'
      },
      {
        date: 'Nov 2022',
        title: 'COP27 Agreement Reached',
        description: 'Historic decision to create the dedicated fund adopted in Sharm El-Sheikh.',
        source: 'UNFCCC'
      },
      {
        date: 'Today',
        title: 'First $1 Billion Disbursed',
        description: 'First projects funded without adding debt to recipient nations.',
        source: 'UN Board Meeting'
      }
    ],
    whatChanged: {
      previously: 'Developing island nations hit by hurricanes had to take high-interest commercial loans from international banks to rebuild destroyed infrastructure, compounding national debt.',
      now: 'Direct grant financing delivers immediate reconstruction funds without loan interest, recognizing historical climate responsibility.',
      highlights: [
        '$1 billion deployed in non-debt grants to 10 vulnerable island states',
        'Funding allocated for mangrove barriers and solar desalination units',
        'Independent civil society board monitors direct local community benefit'
      ]
    },
    stakeholders: [
      {
        name: 'Pacific & Caribbean Island Citizens',
        role: 'Recipient Communities',
        relation: 'Receive immediate resources to reinforce coastlines and safeguard drinking water.',
        impactLevel: 'high'
      },
      {
        name: 'Donor Nations (EU, Japan, US, UAE)',
        role: 'Contributors',
        relation: 'Funding the facility to fulfill international climate treaty commitments.',
        impactLevel: 'medium'
      },
      {
        name: 'Environmental Activists & Youth Diplomats',
        role: 'Advocates',
        relation: 'Pushed for three decades to turn moral arguments into binding multilateral financial aid.',
        impactLevel: 'high'
      }
    ],
    whatHappensNext: [
      {
        scenario: 'Fund replenishment drive targets $10 billion annual volume',
        probability: 'Moderate',
        explanation: 'Developing nations argue current funding is only a fraction of estimated annual damages.'
      },
      {
        scenario: 'Introduction of international shipping and aviation carbon levies',
        probability: 'Moderate',
        explanation: 'Economists propose global transport fuel taxes to provide automatic recurring revenue for the fund.'
      }
    ],
    predictions: [
      {
        id: 'pred-climate-fund-scale',
        question: 'Will the UN Loss and Damage Fund exceed $5 billion in cumulative capital by 2028?',
        options: [
          'Yes, donor pledges increase steadily',
          'Struggles to pass $3 billion due to fiscal austerity in donor nations',
          'Replaced by private insurance risk pools'
        ],
        expiresAt: '2028-12-31T23:59:59Z',
        category: 'Environment',
        totalVotes: [210, 260, 42]
      }
    ],
    relatedArticleIds: ['himalayan-glacier-ai-warning'],
    chunks: [
      'The governing board of the UN Loss and Damage Fund approved its first tranche of emergency recovery grants to ten low-lying island states.',
      'The Loss and Damage principle acknowledges that mitigation and adaptation are no longer enough for irreversible climate impacts.',
      'The first $1 billion funding tranche is structured as non-debt grants rather than loans.',
      'Funds are channeled directly into mangrove restoration, elevated storm shelters, and solar-powered desalination units.',
      'Vulnerable island states are prioritized according to multidimensional vulnerability indices rather than GDP.'
    ]
  },
  {
    id: 'india-upi-digital-infrastructure',
    title: 'India’s Digital Public Infrastructure: UPI Live Across 10 Global Nations',
    headline: 'Real-time cross-border retail payments and student remittances expand across France, UAE, Singapore, and Mauritius.',
    category: 'India',
    heroImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'National Payments Corporation of India (NPCI) & RBI',
    sourceUrl: 'https://npci.org.in',
    publishedAt: '2026-09-14T09:15:00Z',
    readingTimeMinutes: 3,
    isFeatured: true,
    coveredSourcesCount: 9,
    otherSources: [
      { name: 'Financial Times', url: 'https://ft.com' },
      { name: 'Economic Times', url: 'https://economictimes.indiatimes.com' },
      { name: 'The Straits Times', url: 'https://straitstimes.com' }
    ],
    whatHappened: 'India’s Unified Payments Interface (UPI) network has officially expanded cross-border interoperability to ten countries, allowing Indian tourists, expatriates, and overseas students to make instant QR-code payments directly from their domestic bank accounts without exorbitant forex conversion fees.',
    inSimpleWords: 'Normally when you travel or study abroad, using an Indian debit or credit card incurs hefty 3% to 5% international conversion fees. With UPI going global, you can simply scan a local QR code in places like Paris or Singapore and pay directly in Indian Rupees via your phone.',
    explanationModes: {
      simple: 'UPI is India’s free instant payment system built on top of bank accounts. Through international partnerships with foreign banks and fintech gateways, Indian travelers and students can now scan foreign store QR codes and pay instantly with zero international card swipe fees.',
      student: 'Digital Public Infrastructure (DPI) — also known as the "India Stack" (Aadhaar + UPI + DigiLocker) — is being adopted globally as an alternative to expensive private card networks like Visa and Mastercard. By linking India’s UPI with Singapore’s PayNow and UAE’s AANI system, cross-border retail payments settle instantly via secure bilateral central bank rails.',
      detailed: 'The G20 Roadmap for Enhancing Cross-Border Payments prioritizes cheaper, faster remittances. Bilateral linkage of fast payment systems (FPS) eliminates correspondent banking delays and brings transaction fees down from the global average of 6.2% to under 1.5%. NPCI International Payments Ltd (NIPL) is actively deploying UPI rails across the Gulf Cooperation Council, Europe, and ASEAN members.'
    },
    whyShouldICare: [
      {
        target: 'Students',
        impact: 'Indian students studying abroad in France, Singapore, or the UK can receive instant semester allowances and pay university canteen fees without banking wire delays.',
        isCertain: true
      },
      {
        target: 'Families',
        impact: 'Reduces foreign exchange fees by thousands of rupees per trip for family vacations and medical visits.',
        isCertain: true
      },
      {
        target: 'India',
        impact: 'Elevates the Indian Rupee as an internationally accepted medium of retail exchange and solidifies India as a global architect of public digital goods.',
        isCertain: true
      },
      {
        target: 'Technology',
        impact: 'Proves that open, interoperable public protocol stacks outcompete closed proprietary payment gateways at massive scale.',
        isCertain: true
      }
    ],
    keyTerms: [
      {
        term: 'Digital Public Infrastructure (DPI)',
        definition: 'Open digital networks and identity layers provided as public utilities, analogous to physical roads or power grids.',
        context: 'DPI enables competition and low-cost digital financial access.',
        category: 'Technology & Governance'
      },
      {
        term: 'Cross-Border Fast Payment System (FPS)',
        definition: 'Direct real-time linkage between central banking payment gateways in different sovereign jurisdictions.',
        context: 'Replaces traditional multi-day SWIFT wire routing with 5-second settlements.',
        category: 'Economics'
      },
      {
        term: 'NPCI International (NIPL)',
        definition: 'The international subsidiary of NPCI tasked with exporting UPI and RuPay protocols to foreign central banks.',
        context: 'NIPL licenses the technical architecture to friendly nations.',
        category: 'Policy'
      }
    ],
    timeline: [
      {
        date: '2016',
        title: 'UPI Launched in India',
        description: 'RBI and NPCI launch the Unified Payments Interface with 21 pilot member banks.'
      },
      {
        date: '2023',
        title: 'First Cross-Border Linkage with Singapore',
        description: 'Prime Minister Narendra Modi and Prime Minister Lee Hsien Loong inaugurate the UPI-PayNow linkage.'
      },
      {
        date: '2024',
        title: 'Eiffel Tower QR Payment Launch',
        description: 'France becomes the first European nation to activate UPI acceptance for tourist monuments.'
      },
      {
        date: '2026',
        title: '10-Nation Multi-Corridor Integration',
        description: 'Full bilateral instant retail settlements live across GCC, ASEAN, and Europe.'
      }
    ],
    whatChanged: {
      previously: 'Overseas remittances and travel payments required SWIFT bank drafts, international forex cards, or 4% credit card markup fees taking 2-3 business days.',
      now: 'Instant 5-second QR scans directly debiting domestic Indian Rupee savings accounts at transparent mid-market exchange rates.',
      highlights: [
        'Over 10 countries now accept Indian UPI QR codes',
        'Average remittance fees cut by more than 60%',
        'Indian students can pay local tuition and living expenses seamlessly'
      ]
    },
    stakeholders: [
      {
        name: 'Indian Travelers & Students',
        role: 'End Users',
        relation: 'Primary beneficiaries who avoid high card markup fees.',
        impactLevel: 'high'
      },
      {
        name: 'NPCI & Reserve Bank of India',
        role: 'Central Architecture Regulators',
        relation: 'Govern protocol standards and bilateral bilateral currency settlement safety.',
        impactLevel: 'high'
      },
      {
        name: 'Traditional Card Networks (Visa/Mastercard)',
        role: 'Legacy Payment Competitors',
        relation: 'Face competitive pressure from lower-cost sovereign payment rails.',
        impactLevel: 'medium'
      }
    ],
    viewpoints: {
      topic: 'Sovereign Open Payment Rails vs Private Global Card Networks',
      confirmedFacts: [
        'UPI processes over 14 billion transactions monthly within India.',
        'Cross-border payment integration requires bilateral central bank reciprocity.'
      ],
      viewpointA: {
        title: 'Global Public Good & Democratization',
        argument: 'Digital payments should be open, interoperable utilities that empower citizens and small merchants without extracting 3% merchant discount tolls.',
        sourceOrGroup: 'World Bank & G20 Financial Inclusion Taskforce'
      },
      viewpointB: {
        title: 'Regulatory & AML Compliance Hurdles',
        argument: 'Cross-border real-time settlements require stringent Anti-Money Laundering (AML) and Know Your Customer (KYC) synchronization across diverse legal regimes.',
        sourceOrGroup: 'Bank for International Settlements (BIS)'
      },
      sources: ['NPCI Official Release', 'RBI Annual Financial Stability Report', 'World Bank DPI Whitepaper']
    },
    whatHappensNext: [
      {
        scenario: 'Expansion to Major Western Hubs (US & UK)',
        probability: 'High',
        explanation: 'Negotiations with Federal Reserve FedNow and UK Faster Payments to enable real-time diaspora remittances.'
      },
      {
        scenario: 'Direct Local Currency Settlements',
        probability: 'High',
        explanation: 'Direct INR-Dirham and INR-Euro trade settlements without passing through intermediate currency conversions.'
      },
      {
        scenario: 'Reciprocal Acceptance for Foreign Tourists in India',
        probability: 'Moderate',
        explanation: 'Allowing foreign visitors landing in India to link their native digital wallets to India’s merchant QR network.'
      }
    ],
    quizQuestions: [
      {
        id: 'qq-india-upi-1',
        question: 'What is the primary benefit for an Indian student using UPI abroad compared to a traditional credit card?',
        type: 'multiple_choice',
        options: [
          'Direct account debit avoiding high 3-5% international conversion and swipe fees',
          'Free tuition waivers from foreign universities',
          'Unlimited loans without repayment obligations',
          'Elimination of passport visa requirements'
        ],
        correctIndex: 0,
        explanation: 'UPI cross-border linkages route directly between central bank rails, bypassing expensive private card network exchange markups.',
        xpReward: 20,
        category: 'India'
      }
    ],
    predictions: [
      {
        id: 'pred-india-upi-adoption',
        question: 'Will cross-border UPI transactions exceed $10 billion annually by 2028?',
        options: [
          'Yes, rapid adoption by NRI remittances and tourism',
          'No, restricted by foreign banking regulations',
          'Equaled by competing central bank digital currencies (CBDCs)'
        ],
        expiresAt: '2028-12-31T23:59:59Z',
        category: 'India',
        totalVotes: [340, 95, 120]
      }
    ],
    relatedArticleIds: ['rbi-repo-rate-decision'],
    chunks: [
      'India’s Unified Payments Interface (UPI) network has officially expanded cross-border interoperability to ten countries.',
      'Indian tourists and overseas students can make instant QR-code payments directly from their domestic bank accounts.',
      'The G20 Roadmap for Enhancing Cross-Border Payments prioritizes cheaper and faster retail remittances.',
      'Direct fast payment system linkage reduces transaction fees from 6.2% to under 1.5%.',
      'NPCI International continues to deploy open digital public infrastructure across ASEAN and GCC nations.'
    ]
  }
];
