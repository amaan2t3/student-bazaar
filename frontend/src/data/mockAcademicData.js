// Pakistani University Academic Curricula Taxonomy & Seed Data for studentBazaar

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
  { id: 'cat-pf', name: 'Programming Fundamentals', slug: 'programming-fundamentals', count: 42 },
  { id: 'cat-oop', name: 'Object Oriented Programming', slug: 'oop', count: 68 },
  { id: 'cat-dsa', name: 'Data Structures & Algorithms', slug: 'dsa', count: 54 },
  { id: 'cat-dbms', name: 'Database Management Systems', slug: 'dbms', count: 86 },
  { id: 'cat-web', name: 'Web Engineering & Full Stack', slug: 'web-engineering', count: 120 },
  { id: 'cat-mobile', name: 'Mobile App Development', slug: 'mobile-apps', count: 45 },
  { id: 'cat-ai', name: 'Artificial Intelligence & ML', slug: 'ai-ml', count: 72 },
  { id: 'cat-cyber', name: 'Cybersecurity & Networks', slug: 'cybersecurity-networks', count: 31 },
  { id: 'cat-se', name: 'Software Engineering & Design Patterns', slug: 'software-engineering', count: 48 },
  { id: 'cat-fyp', name: 'Final Year Projects (FYP)', slug: 'final-year-projects', count: 95 }
];

export const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    slug: 'hospital-management-system-mysql-csharp',
    title: 'Hospital Management & Electronic Health Records System',
    summary: 'Comprehensive relational DBMS semester project with 18 3NF normalized tables, stored procedures, triggers, and full C# GUI.',
    detailedDescription: `A high-distinction Database Systems semester project tailored for BSCS and BSIT students. Features clean architecture separating the data access layer (DAL) from the presentation layer.

Includes patient admission tracking, doctor duty scheduling, automated pharmacy inventory billing, lab test reporting, and admin analytics dashboards with exportable PDF receipts. Fully compliant with university rubric requirements.`,
    degree: 'BSIT',
    semester: 4,
    subject: 'Database Systems',
    category: 'Database Management Systems',
    pricePKR: 2800,
    rating: 4.9,
    reviewsCount: 38,
    difficulty: 'Intermediate',
    technologies: ['MySQL', 'C#', '.NET', 'SQL Server', 'Crystal Reports'],
    seller: {
      id: 'seller-101',
      name: 'Muhammad Usman',
      university: 'PUCIT Lahore',
      rating: 4.95,
      salesCount: 42,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    ],
    packageIncludes: [
      { name: 'Complete Runnable C# .NET Source Code (.zip)', ready: true },
      { name: 'MySQL Database Script (.sql) with Seed Dummy Data', ready: true },
      { name: 'Normalized Schema Diagram (1NF, 2NF, 3NF Proofs)', ready: true },
      { name: 'Entity-Relationship Diagram (ERD) in High-Res PDF/Visio', ready: true },
      { name: 'Full SRS Documentation (IEEE 830 Standard, 32 Pages)', ready: true },
      { name: 'Step-by-Step Installation & Setup Video Guide', ready: true },
      { name: 'Presentation Slides (18 PowerPoint Slides for Viva)', ready: true }
    ],
    systemRequirements: [
      'Visual Studio 2022 / 2019 Community Edition',
      'MySQL Server 8.0 or XAMPP / WampServer',
      '.NET Framework 4.8 or .NET Core 6.0',
      'Windows 10 or 11 (64-bit)'
    ],
    installationSummary: '1. Import hospital_db.sql into MySQL. 2. Open HospitalSystem.sln in Visual Studio. 3. Update connection string in App.config. 4. Press F5 to build and launch.'
  },
  {
    id: 'proj-2',
    slug: 'mern-campus-event-management-portal',
    title: 'University Campus Event & Ticket Booking Web Application',
    summary: 'Full-stack MERN portal featuring JWT authentication, role-based dashboards (Student, Society Head, Admin), and QR code verification.',
    detailedDescription: `Production-ready Web Engineering semester project built using MongoDB, Express.js, React 18, and Node.js. 

Allows student societies to publish academic competitions, hackathons, and sports events. Students can reserve tickets, receive downloadable QR-coded digital passes, and society executives can scan attendees using webcam QR reader modules.`,
    degree: 'BSSE',
    semester: 5,
    subject: 'Web Engineering',
    category: 'Web Engineering & Full Stack',
    pricePKR: 3500,
    rating: 4.85,
    reviewsCount: 29,
    difficulty: 'Advanced',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    seller: {
      id: 'seller-102',
      name: 'Ayesha Tariq',
      university: 'FAST-NUCES Islamabad',
      rating: 4.88,
      salesCount: 31,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    ],
    packageIncludes: [
      { name: 'Full MERN Stack Source Code (Clean Controllers & Routes)', ready: true },
      { name: 'MongoDB Database Seed Script (.json / mongo-dump)', ready: true },
      { name: 'Postman Collection with 24 Documented REST Endpoints', ready: true },
      { name: 'Architecture Diagram & Sequence Diagrams (UML)', ready: true },
      { name: 'Software Requirements Specification (SRS - 28 Pages)', ready: true },
      { name: 'Environment Variables (.env.example) and Setup Readme', ready: true },
      { name: 'Viva Defense Q&A Preparation Cheat Sheet', ready: true }
    ],
    systemRequirements: [
      'Node.js v16.x or v18.x',
      'MongoDB Community Server or MongoDB Atlas Account',
      'Modern Browser (Chrome, Edge, Firefox)',
      'Git CLI (Optional)'
    ],
    installationSummary: '1. Run "npm install" in backend and frontend. 2. Configure .env with your Mongo URI. 3. Run "npm run dev" to launch concurrently.'
  },
  {
    id: 'proj-3',
    slug: 'ai-skin-lesion-classification-cnn-pytorch',
    title: 'Skin Lesion Classification & Disease Detection using CNNs',
    summary: 'Deep Learning BS-AI Capstone project trained on HAM10000 dataset utilizing Transfer Learning (ResNet-50 & EfficientNet) with Grad-CAM.',
    detailedDescription: `A high-performing Artificial Intelligence / Machine Learning semester project or FYP component. Achieves 92.4% validation accuracy on 7 diagnostic classes of dermatological lesions.

Includes exploratory data analysis (EDA) Jupyter notebooks, data augmentation pipelines, ROC-AUC curves, confusion matrices, and an interactive Streamlit & FastAPI web application allowing users to upload skin images and inspect heatmap visualizations.`,
    degree: 'BSAI',
    semester: 6,
    subject: 'Deep Learning',
    category: 'Artificial Intelligence & ML',
    pricePKR: 4800,
    rating: 5.0,
    reviewsCount: 19,
    difficulty: 'Advanced',
    technologies: ['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'Streamlit', 'ResNet-50'],
    seller: {
      id: 'seller-103',
      name: 'Hamza Khan',
      university: 'NUST Islamabad',
      rating: 5.0,
      salesCount: 19,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800'
    ],
    packageIncludes: [
      { name: 'Jupyter Training Notebooks (.ipynb with step-by comments)', ready: true },
      { name: 'Pre-Trained Weights Checkpoint File (.pth / 85MB)', ready: true },
      { name: 'FastAPI REST Service & Streamlit Web UI Source Code', ready: true },
      { name: 'Complete Research Project Report (IEEE Conference Format)', ready: true },
      { name: 'Dataset Download Script & Pre-processing Pipeline', ready: true },
      { name: 'Viva Defense Slides with Confusion Matrix Explanations', ready: true }
    ],
    systemRequirements: [
      'Python 3.9+ or Anaconda Environment',
      'PyTorch 2.x (CUDA support optional but recommended)',
      '4GB+ RAM (8GB+ recommended)',
      'Jupyter Lab / VS Code'
    ],
    installationSummary: '1. Create virtual environment: python -m venv venv. 2. pip install -r requirements.txt. 3. streamlit run app.py.'
  },
  {
    id: 'proj-4',
    slug: 'cpp-oop-bank-management-system-console',
    title: 'Object-Oriented Banking Transaction & Account Vault in C++',
    summary: 'Mastery project for OOP in C++: Operator overloading, virtual inheritance, polymorphic account types, binary file encryption.',
    detailedDescription: `The benchmark 2nd/3rd semester Object-Oriented Programming (OOP) project for BSCS and BSIT students across Pakistan. 

Implements pure object-oriented principles: abstract base classes, runtime polymorphism, friend functions, template classes, exception handling, and persistent binary file streams with XOR encryption to protect student account balances.`,
    degree: 'BSCS',
    semester: 2,
    subject: 'Object Oriented Programming',
    category: 'Object Oriented Programming',
    pricePKR: 1500,
    rating: 4.92,
    reviewsCount: 46,
    difficulty: 'Beginner',
    technologies: ['C++', 'OOP', 'File Handling', 'Data Structures', 'GCC/Clang'],
    seller: {
      id: 'seller-104',
      name: 'Bilal Ahmed',
      university: 'COMSATS Lahore',
      rating: 4.85,
      salesCount: 52,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
    ],
    packageIncludes: [
      { name: 'Modular C++ Source Code (.cpp and .h headers separated)', ready: true },
      { name: 'Class Hierarchy & UML Class Diagram in StarUML / PDF', ready: true },
      { name: 'Binary File Storage Engine with sample test records', ready: true },
      { name: 'Detailed Project Report with OOP concepts mapping (20 pages)', ready: true },
      { name: 'Compilation Instructions for Dev-C++, Code::Blocks, & VS Code', ready: true },
      { name: '100 Common OOP Viva Questions with Answers', ready: true }
    ],
    systemRequirements: [
      'Any C++17 Compiler (MinGW, GCC, Clang, or MSVC)',
      'Code::Blocks, Dev-C++, VS Code, or CLion',
      'Compatible with Windows, Linux, and macOS'
    ],
    installationSummary: 'Compile with "g++ -std=c++17 main.cpp BankAccount.cpp Transaction.cpp -o BankApp" and run ./BankApp.'
  },
  {
    id: 'proj-5',
    slug: 'dsa-graph-algorithm-visualizer-react',
    title: 'Interactive Graph & Pathfinding Algorithm Visualizer',
    summary: 'BSCS 3rd Semester DSA project visualizing Dijkstra, A*, BFS, DFS, and Maze Generation with speed controls and node weights.',
    detailedDescription: `Engineered specifically for Data Structures and Algorithms curriculum viva defense. Visually illustrates time and space complexity metrics, path cost computation, visited set tracking, and heuristic comparisons in real time.`,
    degree: 'BSCS',
    semester: 3,
    subject: 'Data Structures and Algorithms',
    category: 'Data Structures & Algorithms',
    pricePKR: 2200,
    rating: 4.88,
    reviewsCount: 31,
    difficulty: 'Intermediate',
    technologies: ['React.js', 'JavaScript', 'Algorithms', 'Tailwind CSS', 'HTML5 Canvas'],
    seller: {
      id: 'seller-102',
      name: 'Ayesha Tariq',
      university: 'FAST-NUCES Islamabad',
      rating: 4.88,
      salesCount: 31,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    ],
    packageIncludes: [
      { name: 'React Source Code with documented algorithm implementations', ready: true },
      { name: 'Pseudocode comparison sheet for Dijkstra vs A* vs Bellman-Ford', ready: true },
      { name: 'Complete Algorithm Analysis Report (Big-O proofs & charts)', ready: true },
      { name: 'README with live local setup instructions', ready: true }
    ],
    systemRequirements: [
      'Node.js 16+',
      'Modern web browser',
      'Basic knowledge of Graph Theory'
    ],
    installationSummary: 'cd visualizer && npm install && npm run dev'
  },
  {
    id: 'proj-6',
    slug: 'flutter-cross-platform-student-lms-app',
    title: 'Student Academic Portal & Attendance Tracker Mobile App',
    summary: 'Cross-platform Flutter application with Firebase backend, timetable alerts, grade calculation, and offline caching.',
    detailedDescription: `Full-featured Mobile Application Development semester project. Designed for universities operating on relative grading systems. Supports GPA prediction, assignment deadline reminders, push notifications, and lecture slide caching.`,
    degree: 'BSSE',
    semester: 6,
    subject: 'Mobile App Development',
    category: 'Mobile App Development',
    pricePKR: 3800,
    rating: 4.96,
    reviewsCount: 22,
    difficulty: 'Advanced',
    technologies: ['Flutter', 'Dart', 'Firebase', 'Provider State', 'SQLite'],
    seller: {
      id: 'seller-101',
      name: 'Muhammad Usman',
      university: 'PUCIT Lahore',
      rating: 4.95,
      salesCount: 42,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800'
    ],
    packageIncludes: [
      { name: 'Clean Architecture Flutter Source Code (Android & iOS)', ready: true },
      { name: 'Firebase Security Rules Configuration File', ready: true },
      { name: 'Figma UI Design Kit & Mobile Wireframe Flow (.fig)', ready: true },
      { name: 'Complete SRS Document with Use Case Diagrams', ready: true },
      { name: 'Ready-to-Test Release APK File included', ready: true }
    ],
    systemRequirements: [
      'Flutter SDK 3.10+',
      'Android Studio or VS Code with Flutter Extension',
      'Android 8.0+ device or emulator'
    ],
    installationSummary: 'flutter pub get && flutter run'
  }
];

export const MOCK_CUSTOM_REQUESTS = [
  {
    id: 'cr-101',
    title: 'Online Examination Portal with WebCam Anti-Cheat System',
    buyer: { name: 'Zainab Bibi', university: 'UET Lahore' },
    degree: 'BSIT',
    semester: 6,
    subject: 'Web Engineering',
    budgetPKR: 6500,
    deadline: '2026-12-05',
    proposalsCount: 4,
    status: 'open_for_bidding',
    description: 'Looking for a React + Node.js portal where instructors can upload MCQs with time limits. Must include face-detection alert if student looks away from screen during quiz.',
    technologies: ['React.js', 'Node.js', 'TensorFlow.js', 'MongoDB']
  },
  {
    id: 'cr-102',
    title: 'Multi-Threaded Server-Client Chat Room in Java with Encryption',
    buyer: { name: 'Abdullah Tariq', university: 'FAST Islamabad' },
    degree: 'BSCS',
    semester: 5,
    subject: 'Computer Networks',
    budgetPKR: 4500,
    deadline: '2026-11-30',
    proposalsCount: 6,
    status: 'open_for_bidding',
    description: 'Requires Java Socket Programming with thread pool, RSA key exchange for encryption, and file transfer capability between clients.',
    technologies: ['Java', 'Socket Programming', 'Cryptography', 'Swing GUI']
  },
  {
    id: 'cr-103',
    title: 'Real Estate Price Prediction Model using Random Forest & XGBoost',
    buyer: { name: 'Bilal Raza', university: 'COMSATS Islamabad' },
    degree: 'BSDS',
    semester: 5,
    subject: 'Machine Learning for Data Science',
    budgetPKR: 5000,
    deadline: '2026-12-02',
    proposalsCount: 2,
    status: 'open_for_bidding',
    description: 'Need regression pipeline trained on Zameen.com dataset with outlier removal, hyperparameter tuning, and model evaluation metrics (RMSE, R2 score).',
    technologies: ['Python', 'Scikit-Learn', 'XGBoost', 'Pandas', 'Flask']
  }
];
