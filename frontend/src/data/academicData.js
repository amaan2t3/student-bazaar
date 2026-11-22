export const DEGREES = [
  { id: 'BSCS', name: 'BS Computer Science', description: 'Theoretical computing, core algorithmic foundations, systems programming, and modern software architectures.' },
  { id: 'BSIT', name: 'BS Information Technology', description: 'Network engineering, database administration, web systems, enterprise architecture, and cyber infrastructure.' },
  { id: 'BSSE', name: 'BS Software Engineering', description: 'Software design patterns, architectural engineering, quality assurance, formal methods, and agile lifecycle.' },
  { id: 'BSAI', name: 'BS Artificial Intelligence', description: 'Machine learning, deep neural networks, computer vision, natural language processing, and robotics.' },
  { id: 'BSDS', name: 'BS Data Science', description: 'Statistical modeling, big data engineering, data mining, predictive analytics, and business intelligence.' }
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SUBJECTS_BY_DEGREE = {
  BSCS: {
    1: ['Programming Fundamentals', 'Introduction to ICT', 'Calculus and Analytical Geometry', 'English Composition'],
    2: ['Object Oriented Programming', 'Digital Logic Design', 'Multivariable Calculus', 'Discrete Structures'],
    3: ['Data Structures and Algorithms', 'Computer Organization and Assembly Language', 'Linear Algebra', 'Communication Skills'],
    4: ['Database Systems', 'Operating Systems', 'Design and Analysis of Algorithms', 'Probability and Statistics'],
    5: ['Theory of Automata', 'Computer Networks', 'Software Engineering', 'Numerical Computing'],
    6: ['Artificial Intelligence', 'Compiler Construction', 'Web Development', 'Parallel and Distributed Computing'],
    7: ['Information Security', 'Final Year Project - I', 'Cloud Computing', 'Mobile Application Development'],
    8: ['Final Year Project - II', 'Professional Practices', 'Data Mining', 'Machine Learning']
  },
  BSIT: {
    1: ['Programming Fundamentals', 'Information Technology Infrastructure', 'Applied Physics', 'Basic Electronics'],
    2: ['Object Oriented Programming', 'Database Systems', 'Discrete Mathematics', 'Web Design Fundamentals'],
    3: ['Data Structures and Algorithms', 'Computer Networks', 'Operating Systems', 'System Analysis and Design'],
    4: ['Web Engineering', 'Network Security', 'Database Administration and Management', 'Human Computer Interaction'],
    5: ['Enterprise Application Development', 'IT Project Management', 'Cloud Infrastructure Services', 'Mobile Computing'],
    6: ['DevOps and Systems Automation', 'Information Assurance', 'Data Warehousing', 'Cyber Law and Ethics'],
    7: ['Capstone Project - I', 'Virtualization and Cloud', 'Big Data Technologies', 'IT Strategy'],
    8: ['Capstone Project - II', 'Internet of Things (IoT)', 'Professional Practices', 'Penetration Testing']
  },
  BSSE: {
    1: ['Introduction to Computing', 'Programming Fundamentals', 'Calculus', 'English Composition'],
    2: ['Object Oriented Programming', 'Software Engineering Fundamentals', 'Discrete Structures', 'Linear Algebra'],
    3: ['Data Structures and Algorithms', 'Software Requirements Engineering', 'Digital Logic', 'Human Computer Interaction'],
    4: ['Software Architecture and Design', 'Database Systems', 'Operating Systems', 'Technical Writing'],
    5: ['Software Quality Engineering and Testing', 'Web Engineering', 'Computer Networks', 'Software Project Management'],
    6: ['Formal Methods in SE', 'Component Based Software Engineering', 'Mobile App Development', 'Business Process Engineering'],
    7: ['Final Year Project - I', 'Software Re-engineering', 'Information Security', 'Cloud Computing'],
    8: ['Final Year Project - II', 'Software Metrics and Economics', 'Professional Ethics', 'Advanced Software Testing']
  },
  BSAI: {
    1: ['Programming Fundamentals', 'Introduction to Artificial Intelligence', 'Calculus', 'Linear Algebra'],
    2: ['Object Oriented Programming', 'Data Structures and Algorithms', 'Multivariable Calculus', 'Discrete Structures'],
    3: ['Artificial Intelligence', 'Database Systems', 'Probability and Statistics', 'Python for AI'],
    4: ['Machine Learning', 'Operating Systems', 'Knowledge Representation and Reasoning', 'Computer Networks'],
    5: ['Deep Learning', 'Computer Vision', 'Natural Language Processing', 'Data Mining'],
    6: ['Robotics and Intelligent Systems', 'Reinforcement Learning', 'AI Ethics and Governance', 'Cloud AI Deployment'],
    7: ['Final Year Project - I', 'Speech Recognition and Audio Processing', 'Generative AI', 'Explainable AI'],
    8: ['Final Year Project - II', 'Autonomous Systems', 'Edge AI Computing', 'Professional Practices']
  },
  BSDS: {
    1: ['Programming Fundamentals', 'Introduction to Data Science', 'Calculus', 'Linear Algebra'],
    2: ['Object Oriented Programming', 'Data Structures and Algorithms', 'Probability and Statistics', 'Discrete Mathematics'],
    3: ['Database Systems', 'Statistical Data Analysis', 'Python for Data Science', 'Data Visualization'],
    4: ['Data Warehousing and Business Intelligence', 'Operating Systems', 'Exploratory Data Analysis', 'Computer Networks'],
    5: ['Machine Learning for Data Science', 'Big Data Analytics', 'Applied Regression Analysis', 'Data Mining'],
    6: ['Deep Learning Applications', 'Time Series Forecasting', 'Natural Language Processing', 'Cloud Data Platforms'],
    7: ['Final Year Project - I', 'Data Privacy and Ethics', 'Distributed Data Processing (Spark)', 'High-Performance Analytics'],
    8: ['Final Year Project - II', 'Advanced Predictive Modeling', 'MLOps (Machine Learning Operations)', 'Professional Practices']
  }
};

export const UNIVERSITIES = [
  'FAST National University (FAST-NUCES)',
  'NUST (National University of Sciences & Technology)',
  'COMSATS University Islamabad (CUI)',
  'PUCIT (Punjab University College of IT)',
  'UET Lahore / Taxila',
  'GIKI (Ghulam Ishaq Khan Institute)',
  'NED University of Engineering & Technology',
  'Virtual University of Pakistan (VU)',
  'Allama Iqbal Open University (AIOU)',
  'University of Karachi (UBIT)',
  'IBA Karachi',
  'Air University',
  'Bahria University',
  'PIEAS Islamabad',
  'Quaid-i-Azam University (QAU)'
];

const HIGH_TIER_UNIVERSITY_KEYWORDS = ['fast', 'nust', 'giki', 'ned', 'iba', 'pieas'];

export const getUniversityPricingTier = (university) => (
  HIGH_TIER_UNIVERSITY_KEYWORDS.some((keyword) => university?.toLowerCase().includes(keyword))
    ? 'high'
    : 'low'
);

export const CATEGORIES = [
  { id: 'cat-pf', name: 'Programming Fundamentals', slug: 'programming-fundamentals' },
  { id: 'cat-oop', name: 'Object Oriented Programming', slug: 'oop' },
  { id: 'cat-dsa', name: 'Data Structures & Algorithms', slug: 'dsa' },
  { id: 'cat-dbms', name: 'Database Management Systems', slug: 'dbms' },
  { id: 'cat-web', name: 'Web Engineering & Full Stack', slug: 'web-engineering' },
  { id: 'cat-mobile', name: 'Mobile App Development', slug: 'mobile-apps' },
  { id: 'cat-ai', name: 'Artificial Intelligence & ML', slug: 'ai-ml' },
  { id: 'cat-cyber', name: 'Cybersecurity & Networks', slug: 'cybersecurity-networks' },
  { id: 'cat-se', name: 'Software Engineering & Design Patterns', slug: 'software-engineering' },
  { id: 'cat-fyp', name: 'Final Year Projects (FYP)', slug: 'final-year-projects' }
];
