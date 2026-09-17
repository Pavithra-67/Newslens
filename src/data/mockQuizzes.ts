import { DailyChallenge, QuizQuestion, WeeklyChallenge } from '../types';

export const DAILY_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-semiconductor',
    articleId: 'india-semiconductor-mission',
    question: 'Why are commercial semiconductor fabrication plants ("fabs") strategically vital for a country\'s security and economy?',
    type: 'reasoning',
    options: [
      'They only produce plastic covers for televisions',
      'They produce microchips that power smartphones, cars, medical devices, and defense radar',
      'They reduce the need for domestic software programmers',
      'They eliminate the requirement for electricity grids'
    ],
    correctIndex: 1,
    explanation: 'Semiconductors are the physical "brains" inside modern electronics. Relying 100% on foreign imports leaves a nation vulnerable during geopolitical disruptions or supply chain blockades.',
    xpReward: 20,
    category: 'Science & Technology'
  },
  {
    id: 'q2-spadex',
    articleId: 'chandrayaan-space-station',
    question: 'What is the primary purpose of ISRO’s autonomous space docking technology (SPADEX)?',
    type: 'multiple_choice',
    options: [
      'To beam solar electricity down to earth cities',
      'To robotically connect multiple spacecraft modules together in orbit to build space stations',
      'To shoot down decommissioned space debris with lasers',
      'To increase rocket launch speeds past the sound barrier'
    ],
    correctIndex: 1,
    explanation: 'Modular space stations like the Bharatiya Antariksh Station cannot be launched in one rocket. Individual modules must rendezvous and physically lock together in orbit autonomously.',
    xpReward: 20,
    category: 'Space'
  },
  {
    id: 'q3-repo-rate',
    articleId: 'rbi-repo-rate-decision',
    question: 'True or False: If the RBI decreases the repo rate, commercial banks usually lower loan interest rates for borrowers.',
    type: 'true_false',
    options: [
      'True',
      'False'
    ],
    correctIndex: 0,
    explanation: 'True. When the central bank reduces the rate at which it lends money to commercial banks, borrowing costs drop, leading to cheaper home, auto, and student loans.',
    xpReward: 20,
    category: 'Business & Economy'
  },
  {
    id: 'q4-ncrf',
    articleId: 'nep-vocational-credits',
    question: 'Under India\'s National Credit Framework (NCrF), what is the Academic Bank of Credits (ABC)?',
    type: 'multiple_choice',
    options: [
      'A commercial bank where students deposit tuition money to earn interest',
      'A digital repository that securely stores verified academic and vocational credits earned by students',
      'A competitive exam coaching scholarship program',
      'A loan waiver scheme for engineering dropouts'
    ],
    correctIndex: 1,
    explanation: 'The Academic Bank of Credits (ABC) functions like a digital bank account for learning points. It stores validated credits earned across colleges, internships, and online courses on DigiLocker.',
    xpReward: 20,
    category: 'Education'
  },
  {
    id: 'q5-solid-state',
    articleId: 'solid-state-battery-ev',
    question: 'What is the key technological innovation that prevents solid-state EV batteries from catching fire?',
    type: 'scenario',
    options: [
      'They operate without any electrical voltage',
      'They replace flammable liquid electrolytes with non-combustible ceramic or solid polymer materials',
      'They are submerged in a tank of cold water inside the car trunk',
      'They only charge when the vehicle is moving backwards'
    ],
    correctIndex: 1,
    explanation: 'Traditional lithium-ion batteries rely on flammable liquid solvents that can ignite if punctured. Solid ceramic electrolytes cannot leak or catch fire, even under high heat or physical puncture.',
    xpReward: 20,
    category: 'Science & Technology'
  }
];

export const WEEKLY_CHALLENGE_QUESTIONS: QuizQuestion[] = [
  ...DAILY_QUIZ_QUESTIONS,
  {
    id: 'q6-glof',
    articleId: 'himalayan-glacier-ai-warning',
    question: 'What causes a Glacial Lake Outburst Flood (GLOF) in mountain regions?',
    type: 'multiple_choice',
    options: [
      'Underwater volcanic eruptions in the ocean',
      'Sudden failure or breach of an unstable natural dam made of loose rock and ice (moraine)',
      'High evaporation rates during hot summer afternoons',
      'Excessive snowfall freezing lake surfaces solid'
    ],
    correctIndex: 1,
    explanation: 'GLOFs occur when natural moraine dams holding back millions of liters of glacial meltwater suddenly give way due to avalanches, heavy rain, or rapid melting.',
    xpReward: 20,
    category: 'Environment'
  },
  {
    id: 'q7-chess',
    articleId: 'india-chess-olympiad-victory',
    question: 'What historic milestone did the Indian national chess team achieve at the 45th Chess Olympiad in Budapest?',
    type: 'multiple_choice',
    options: [
      'First team to lose every game in the preliminary stage',
      'Won both the Open and Women’s gold medals simultaneously with an undefeated record',
      'First team composed entirely of grandmasters over 50 years of age',
      'Replaced all human players with computer chess engines'
    ],
    correctIndex: 1,
    explanation: 'India swept both the Open and Women’s team gold medals in the same edition of the Chess Olympiad, led by teenage and twenty-something Grandmasters.',
    xpReward: 20,
    category: 'Sports'
  },
  {
    id: 'q8-loss-damage',
    articleId: 'un-loss-damage-climate-fund',
    question: 'How does the UN "Loss and Damage" climate fund differ from traditional loans to disaster-struck nations?',
    type: 'reasoning',
    options: [
      'It requires recipient countries to repay with 10% annual interest',
      'It delivers non-debt grants directly for reconstruction without burdening vulnerable countries with sovereign debt',
      'It only provides emergency food rations rather than money',
      'It can only be claimed by countries in Europe and North America'
    ],
    correctIndex: 1,
    explanation: 'Traditional international disaster aid often came as high-interest loans that pushed poor islands into debt distress. The Loss and Damage fund provides grants without repayment obligations.',
    xpReward: 20,
    category: 'Environment'
  },
  {
    id: 'q9-geneva-ai',
    articleId: 'global-ai-safety-accord',
    question: 'What does the Geneva Treaty on Frontier AI mandate for large artificial intelligence models?',
    type: 'multiple_choice',
    options: [
      'A complete ban on all university computer science courses',
      'Independent safety red-teaming, biosecurity evaluations, and synthetic media watermarking',
      'A tax of $1,000 on every internet search performed',
      'Mandatory physical robots installed in every household'
    ],
    correctIndex: 1,
    explanation: 'The treaty focuses on frontier models exceeding high compute thresholds, mandating third-party red-teaming and invisible cryptographic watermarking to detect deepfakes.',
    xpReward: 20,
    category: 'World'
  },
  {
    id: 'q10-inflation',
    articleId: 'rbi-repo-rate-decision',
    question: 'Why does the Reserve Bank of India closely monitor food prices when deciding interest rate policy?',
    type: 'reasoning',
    options: [
      'Food items have zero impact on the consumer price index',
      'Food accounts for nearly 46% of India’s consumer price inflation basket, heavily impacting everyday living costs',
      'The RBI owns all grocery supermarkets in India',
      'To encourage citizens to eat only imported packaged food'
    ],
    correctIndex: 1,
    explanation: 'In developing economies like India, food expenses make up almost half of an average household’s monthly budget. Surging food prices directly erode real family income.',
    xpReward: 20,
    category: 'Business & Economy'
  }
];

export const MOCK_DAILY_CHALLENGE: DailyChallenge = {
  id: 'daily-2026-09-12',
  date: '2026-09-12',
  title: "Today's Daily Challenge",
  questions: DAILY_QUIZ_QUESTIONS,
  xpTotal: 100,
  completed: false
};

export const MOCK_WEEKLY_CHALLENGE: WeeklyChallenge = {
  id: 'weekly-2026-w37',
  weekNumber: 37,
  title: 'Weekly All-Rounder Challenge',
  description: 'Test your understanding across Science, Economics, Space, Environment, and Policy.',
  questions: WEEKLY_CHALLENGE_QUESTIONS,
  xpTotal: 200,
  completed: false
};
