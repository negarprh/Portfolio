export const chapters = [
  ["introduction", "Introduction"],
  ["experience", "Experience"],
  ["work", "Selected Work"],
  ["building", "Currently Building"],
  ["education", "Education"],
  ["skills", "Skills"],
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
      "I built the Python job aggregation pipeline behind Tail’ed’s internship and new-grad listings, creating automated ingestion across 3,680 company sources and nine applicant tracking systems, including Workday, Greenhouse, and Lever.",
      "I developed workflows for job discovery, classification, normalization, deduplication, and archival, supporting 11,700+ active listings across 1,300+ companies and expanding active job coverage to 4.4× its previous level.",
      "I introduced multithreaded concurrency to the pipeline, reducing median GitHub Actions runtime by 62%, from 4.7 hours to 1.8 hours. I also integrated the aggregated data into Tail’ed’s website, making the jobs available through its search and filtering experience.",
    ],
    technologies: [
      ["Python", "python"],
      ["Express", "express"],
      ["GitHub Actions", "githubactions"],
      ["React", "react"],
      ["Firebase", "firebase"],
    ],
  },
  {
    company: "Lienzo",
    title: "Backend Developer",
    dates: "Dec 8, 2025 — Mar 31, 2026",
    lines: [
      "I built backend features for a healthcare coordination platform using TypeScript, NestJS, PostgreSQL, and Prisma, working across data models, APIs, business logic, and automated testing.",
      "I implemented recurring task functionality with daily, weekly, biweekly, and monthly schedules, including logic for updating individual occurrences or an entire recurring series.",
      "I expanded automated testing across CQRS commands and queries, increasing backend test coverage from 24% to 72%. I also maintained and improved 20+ NestJS services and APIs involving authentication, role-based access control, soft deletes, and other core backend functionality.",
    ],
    technologies: [
      ["TypeScript", "typescript"],
      ["Node.js", "nodejs"],
      ["NestJS", "nestjs"],
      ["Prisma", "prisma"],
      ["PostgreSQL", "postgresql"],
      ["Angular", "angular"],
      ["Vitest", "vitest"],
    ],
  },
  {
    company: "Ozex",
    title: "Software Developer Intern",
    dates: "Feb — May 2025",
    lines: [
      "I developed backend functionality for a mental health platform using TypeScript, Express, PostgreSQL, and Prisma, building REST APIs and the application logic behind them.",
      "I optimized database queries and high-traffic endpoints, reducing API response times by 35%. I also implemented authentication and authorization with Supabase and JWT to protect endpoints and enforce access to backend resources.",
      "I worked across database operations, validation, error handling, and API integration, while maintaining Swagger documentation to keep the backend clear and easy to integrate with.",
    ],
    technologies: [
      ["TypeScript", "typescript"],
      ["Express", "express"],
      ["PostgreSQL", "postgresql"],
      ["Prisma", "prisma"],
      ["Supabase", "supabase"],
      ["Swagger", "swagger"],
    ],
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
