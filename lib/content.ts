export const chapters = [
  ["introduction", "Introduction"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["work", "Projects"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;
export const profile = {
  github: "https://github.com/negarprh",
  linkedin: "https://www.linkedin.com/in/negar-pirasteh/",
  email: "negarpr@hotmail.com",
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
    dates: "Dec 8, 2025 - Mar 31, 2026",
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
    dates: "Feb - May 2025",
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
    id: "canadian-tech-internships",
    name: "Canadian Tech Internships",
    category: "Open source · Canadian careers",
    paragraphs: [
      "I created and maintain this open-source resource to help students and new grads find tech opportunities across Canada. What started as a small project grew into a resource used by thousands of job seekers.",
      "I’ve maintained and expanded it across two recruiting cycles, with automated workflows helping process submissions, check application links, and keep listings current.",
    ],
    stack: "Python · JavaScript · GitHub Actions",
    github: "https://github.com/negarprh/Canadian-Tech-Internships-2027",
    live: null,
    image: {
      src: "/images/internships-2027.png",
      width: 1440,
      height: 1000,
      alt: "Canadian Tech Internships GitHub repository with the 2027 README and link to 2026 listings",
      caption: "Canadian Tech Internships · Repository",
    },
    visual: "community",
  },
  {
    id: "evenly",
    name: "Evenly",
    category: "Full-stack · Shared expenses",
    paragraphs: [
      "I built a full-stack expense-sharing app for groups to track shared costs, balances, and settlements, with equal or custom splits.",
      "Socket.IO keeps group expenses and balances synchronized in real time. Authentication, protected APIs, and group-level authorization keep access tied to membership.",
    ],
    stack: "React · Node.js · Express · MongoDB · Socket.IO",
    github: "https://github.com/negarprh/Evenly",
    live: "https://evenly-client.onrender.com/",
    image: {
      src: "/images/evenly-dashboard.png",
      width: 1440,
      height: 1040,
      alt: "Evenly dashboard showing group expenses, balances, and recent activity with sample data",
      caption: "Evenly · Dashboard with sample data",
    },
    visual: "application",
  },
  {
    id: "airsense",
    name: "AirSense",
    category: "NASA Space Apps 2025 · Air quality",
    paragraphs: [
      "I built AirSense for the NASA Space Apps Challenge 2025 to make city air-quality conditions and four-day forecasts easier to explore.",
      "A React interface brings together OpenWeather data through a Spring Boot API. Caffeine caches current city readings to reduce repeat API calls, with deployment on AWS and Docker for local development.",
    ],
    stack: "Java · Spring Boot · React · Caffeine · AWS · Docker",
    github: "https://github.com/negarprh/AirSense",
    live: "https://airsenseapp.org/",
    image: {
      src: "/images/airsense.png",
      width: 1914,
      height: 897,
      alt: "AirSense city search screen with suggested cities",
      caption: "AirSense · City search",
    },
    visual: "application",
  },
];
export const skills = [
  {
    label: "Backend",
    items: [
      ["TypeScript", "typescript"],
      ["Node.js", "nodejs"],
      ["NestJS", "nestjs"],
      ["Express.js", "express"],
      ["Python", "python"],
      ["FastAPI", "fastapi"],
      ["Flask", "flask"],
      ["Java", "java"],
      ["Spring Boot", "spring"],
    ],
  },
  {
    label: "Data",
    items: [
      ["PostgreSQL", "postgresql"],
      ["MongoDB", "mongodb"],
      ["Prisma", "prisma"],
      ["SQLAlchemy", "sqlalchemy"],
    ],
  },
  {
    label: "Frontend",
    items: [
      ["React", "react"],
      ["Next.js", "nextjs"],
      ["Angular", "angular"],
      ["JavaScript", "javascript"],
      ["Tailwind CSS", "tailwindcss"],
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
    label: "Tools & Testing",
    items: [
      ["Git", "git"],
      ["GitHub", "github"],
      ["Postman", "postman"],
      ["Swagger", "swagger"],
      ["Vitest", "vitest"],
      ["Pytest", "pytest"],
      ["Zod", "zod"],
    ],
  },
];
