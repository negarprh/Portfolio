export const chapters = [
  ["introduction", "Introduction"],
  ["experience", "Experience"],
  ["work", "Selected Work"],
  ["building", "Currently Building"],
  ["education", "Education"],
  ["skills", "Skills"],
  ["about", "About"],
  ["contact", "Contact"],
] as const;
export const profile = {
  github: "https://github.com/negarprh",
  linkedin: "https://www.linkedin.com/in/negar-pirasteh/",
  // Set these to verified, public contact information before publishing.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  resume: process.env.NEXT_PUBLIC_RESUME_URL || "",
};
export const experience = [
  {
    company: "Tail’ed",
    title: "Software Developer Intern",
    dates: "Summer 2026",
    lines: [
      "Brought Workday processing from about 6 hours down to roughly 1 hour 45 minutes by improving concurrency and the pipeline.",
      "Wrote Python automation to collect internship and new-grad listings from Workday, Lever, and Greenhouse.",
      "Cleaned up duplicates, locations, filters, and archived listings for the jobs pipeline connected to the React website.",
    ],
    stack: "Python / GitHub Actions / React / Firebase",
  },
  {
    company: "Lienzo",
    title: "Backend Developer",
    dates: "Dec 8, 2025 — Mar 31, 2026",
    lines: [
      "Built end-to-end backend features in TypeScript and NestJS for a healthcare coordination platform.",
      "Worked on application logic, database interactions, and tests in a CQRS codebase using Prisma, PostgreSQL, and Vitest.",
    ],
    stack: "TypeScript / Node.js / NestJS / Prisma / PostgreSQL / Vitest",
  },
  {
    company: "Ozex",
    title: "Software Developer Intern",
    dates: "Feb — May 2025",
    lines: [
      "Built TypeScript REST APIs and React components for a mental health platform.",
      "Added authentication with Supabase and worked on database queries with PostgreSQL and Prisma.",
    ],
    stack: "TypeScript / React / Express / PostgreSQL / Docker / Supabase",
  },
];
export const projects = [
  {
    name: "AirSense",
    category: "02 / ENVIRONMENTAL DATA",
    image: "airsense.png",
    width: 1914,
    height: 897,
    alt: "AirSense air quality dashboard with city search and forecast data",
    description:
      "I built AirSense for the NASA Space Apps Challenge 2025. It combines external air-quality APIs with a Spring Boot backend and caching to show four-day forecasts.",
    stack: "Java / Spring Boot / React / Caffeine / AWS / Docker",
    repo: "AirSense",
  },
  {
    name: "WealthWise",
    category: "03 / PERSONAL FINANCE",
    image: "wealthwise.png",
    width: 1900,
    height: 866,
    alt: "WealthWise finance dashboard showing accounts and financial tracking",
    description:
      "A personal finance tracker I built with Flask. It brings income, expenses, and investments together, with market data and charts to track portfolio performance.",
    stack: "Python / Flask / SQLite / Pandas / Matplotlib",
    repo: "Financial-Tracker",
  },
  {
    name: "InvestGuard",
    category: "04 / RISK ANALYSIS",
    image: "investguard.png",
    width: 1895,
    height: 905,
    alt: "InvestGuard stock risk analysis application",
    description:
      "A Spring Boot application that calculates portfolio risk from stock inputs. I built the financial calculations and the interface for entering and reviewing them.",
    stack: "Java 17 / Spring Boot / Maven / H2 / JavaScript",
    repo: "InvestGuard",
  },
];
export const skills = [
  {
    label: "Backend & Data",
    items: [
      ["TypeScript", "typescript"],
      ["Python", "python"],
      ["FastAPI", "fastapi"],
      ["SQLAlchemy", "sqlalchemy"],
      ["PostgreSQL", "postgresql"],
      ["Redis", "redis"],
      ["Java", "java"],
      ["Spring Boot", "spring"],
      ["Node.js", "nodejs"],
      ["NestJS", "nestjs"],
      ["Prisma", "prisma"],
      ["Flask", "flask"],
    ],
  },
  {
    label: "Frontend",
    items: [
      ["React", "react"],
      ["Next.js", "nextjs"],
      ["Tailwind CSS", "tailwindcss"],
      ["JavaScript", "javascript"],
      ["HTML", "html5"],
      ["CSS", "css3"],
    ],
  },
  {
    label: "Infra & Cloud",
    items: [
      ["Docker", "docker"],
      ["AWS", "amazonwebservices"],
      ["GitHub Actions", "githubactions"],
      ["Supabase", "supabase"],
      ["Firebase", "firebase"],
      ["Azure DevOps", "azuredevops"],
    ],
  },
  {
    label: "Tools",
    items: [
      ["Git", "git"],
      ["GitHub", "github"],
      ["Postman", "postman"],
      ["Swagger", "swagger"],
      ["Stripe", "stripe"],
      ["Vitest", "vitest"],
    ],
  },
];
