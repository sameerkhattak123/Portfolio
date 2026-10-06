// Single source of truth for the portfolio. Content mirrors "Sameer Rehman CV (v1)".
// Update this file (and public/Sameer-Rehman-CV-v1.pdf) when the CV changes.

export const profile = {
  name: "Sameer Rehman",
  role: "Software Engineer",
  tagline:
    "Full-stack developer building web apps with React, Laravel & Node.js",
  location: "Lahore, Pakistan",
  email: "sameerkhattak12345@gmail.com",
  phone: "+92 309 4863152",
  cv: "/Sameer-Rehman-CV-v1.pdf",
  careerStart: "2024-06-01",
  photo: "/img/sameer.webp",
  socials: {
    github: "https://github.com/sameerkhattak123",
    linkedin: "https://www.linkedin.com/in/sameer-rehmank/",
  },
  about: [
    "I'm a software engineer who enjoys building scalable, efficient and user-friendly applications. My day-to-day spans the full stack: interactive front-ends in React, back-ends and REST APIs in Laravel and Node.js, and the relational databases underneath them.",
    "Recently I've been working on system integrations, writing AWS Lambda functions for two-way data sync between surgical-care platforms, and exploring LLM tooling such as prompt engineering, vector search and LangGraph.",
  ],
};

export const experience = [
  {
    company: "Code District",
    role: "Associate Software Engineer",
    period: "Jun 2024 — Present",
    location: "Lahore, Pakistan",
    points: [
      "Build interactive, user-friendly front-end applications with React.js.",
      "Develop Laravel back-ends, designing and optimizing relational databases for data integrity and scalability.",
      "Implemented AWS Lambda functions (JavaScript) for two-way data synchronization between QSM/QSC and external systems.",
      "Work in cross-functional teams using Jira for planning and tracking to deliver maintainable solutions on schedule.",
    ],
    stack: ["React", "Laravel", "MySQL", "AWS Lambda", "Jira"],
  },
  {
    company: "Systems Limited",
    role: "CRM / Power Platform Intern",
    period: "Apr 2024 — Jun 2024",
    location: "Lahore, Pakistan",
    points: [
      "Developed custom Power Apps solutions to streamline business processes.",
      "Automated workflows with Power Automate to improve team productivity.",
    ],
    stack: ["Power Apps", "Power Automate"],
  },
  {
    company: "ARK Techno Solutions",
    role: "Software Developer Intern (Remote)",
    period: "Aug 2022 — Feb 2024",
    location: "Remote",
    points: [
      "Delivered web projects with Node.js, Express and React.",
      "Built database projects in MySQL, Oracle APEX and Microsoft Access.",
      "Produced software documentation and UML diagrams, plus Power BI reports for query presentation.",
    ],
    stack: ["Node.js", "Express", "React", "MySQL", "Oracle APEX", "Power BI"],
  },
];

export const projects = [
  {
    title: "QSM ⇄ QSC System Integration",
    kind: "Professional",
    description:
      "Two-way data synchronization between Quality Surgical Management, Quality Surgical Care and external systems. Serverless sync functions, Laravel API integration, data mapping and validation for reliable cross-system consistency.",
    stack: ["AWS Lambda", "JavaScript", "Laravel", "REST APIs"],
    featured: true,
  },
  {
    title: "Swat Fame",
    kind: "Professional",
    description:
      "Inventory and order management platform. Dynamic React front-end wired to Laravel APIs, with an optimized MySQL schema supporting supply-chain workflows.",
    stack: ["React", "Laravel", "MySQL"],
    featured: true,
  },
  {
    title: "Quran Translation & Teaching LMS",
    kind: "Final Year Project",
    description:
      "A learning management system with quizzes, assignments, course content and student records, plus a Quran reader offering four translators side by side.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    image: "/img/qlms.webp",
    live: "https://quran-lms-umber.vercel.app/",
    repo: "https://github.com/sameerkhattak123/Quran-LMS",
    featured: true,
  },
  {
    title: "Hackathon Website",
    kind: "Academic",
    description:
      "Competition platform with team assignment and event management features.",
    stack: ["Node.js", "SQLite", "JavaScript"],
  },
  {
    title: "Quran Translation App",
    kind: "Academic",
    description:
      "Cross-platform mobile app for studying multiple Quran translations.",
    stack: ["Flutter", "Dart"],
  },
  {
    title: "Top Gun Fighter",
    kind: "Game",
    description:
      "3D fighter-jet game: destroy enemy planes before they reach the target.",
    stack: ["Unity", "C#"],
  },
  {
    title: "HR & Sports Club Management",
    kind: "Academic",
    description:
      "Relational database design with full documentation and UML system diagrams.",
    stack: ["MySQL", "SQL", "UML"],
  },
];

export const skills = [
  {
    group: "Frontend",
    items: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
    ],
  },
  { group: "Backend", items: ["Laravel", "Node.js", "Express", "REST APIs"] },
  {
    group: "Cloud & Integration",
    items: ["AWS Lambda", "API Integration", "Data Sync"],
  },
  { group: "Databases", items: ["MySQL", "MongoDB", "SQLite", "Oracle APEX"] },
  {
    group: "AI / LLM",
    items: [
      "Prompt Engineering",
      "OpenAI API",
      "Vector Databases",
      "Semantic Search",
      "LangGraph",
      "Hugging Face",
    ],
  },
  { group: "Languages", items: ["JavaScript", "PHP", "C++", "Java", "C#"] },
  {
    group: "Tools & Testing",
    items: ["Git", "Postman", "Jira", "Selenium", "Power Platform", "Power BI"],
  },
  {
    group: "Practices",
    items: [
      "OOP",
      "Data Structures",
      "SQA",
      "UML & Documentation",
      "Project Management",
    ],
  },
];

export const certifications = [
  {
    title: "Introduction to LangGraph (Python)",
    issuer: "LangChain Academy",
    link: "https://academy.langchain.com/certificates/xby0srijny",
  },
  {
    title: "ChatGPT Prompt Engineering for Developers",
    issuer: "OpenAI · Short course",
  },
  {
    title: "Building Systems with the ChatGPT API",
    issuer: "OpenAI · Short course",
  },
  { title: "Semantic Search with LLMs", issuer: "Cohere · Short course" },
  {
    title: "Building Applications with Vector Databases",
    issuer: "Pinecone · Short course",
  },
  {
    title: "Open-Source Models with Hugging Face",
    issuer: "Hugging Face · Short course",
  },
];

export const education = {
  school: "COMSATS University Islamabad, Lahore Campus",
  degree: "BS Software Engineering",
  period: "2020 — 2024",
  notes: [
    "PEEF Scholarship recipient for the full four-year degree",
    "Final Year Project: Quran Translation & Teaching LMS (MERN)",
  ],
};

export const extras = [
  {
    title: "Director of Events & Photographer",
    org: "Youthee, CUI Lahore",
    text: "Organized and marketed events and partnered with other societies on campus.",
  },
];

export const languages = ["English", "Urdu", "Punjabi", "Pashto"];
