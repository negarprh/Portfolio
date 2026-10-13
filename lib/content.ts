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
      "At Tail’ed, I built a Python job aggregation pipeline that processes listings from 3,680 company sources across nine different applicant tracking systems.",
      "The biggest challenge was making it fast enough to handle that scale. I introduced multithreaded concurrency, cutting the median runtime by 62%, from 4.7 hours to 1.8 hours.",
      "The pipeline helped grow job coverage by 4.4×, reaching over 11,700 active listings. I also integrated the data into Tail’ed’s website, connecting the backend work to the actual user experience.",
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
    dates: "Dec 2025 - Mar 2026",
    lines: [
      "At Lienzo, I worked on the backend of a healthcare coordination platform, building features across database models, business logic, and APIs using NestJS and PostgreSQL.",
      "One of the more complex features I implemented was recurring task management, supporting different schedules and allowing users to update a single occurrence or an entire series.",
      "I also focused on backend reliability, expanding automated test coverage from 24% to 72% across CQRS commands and queries, while maintaining and improving 20+ existing commands, queries, and APIs.",
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
      "At Ozex, I developed backend features for a mental health platform using TypeScript, Express, PostgreSQL, and Prisma.",
      "A key part of my work was improving API performance. I optimized database queries and high-traffic endpoints, reducing response times by 35%.",
      "I also implemented authentication and authorization using Supabase and JWT, and worked on validation, error handling, and API documentation to make the backend more secure and reliable.",
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
      ["Express", "express"],
      ["Python", "python"],
      ["FastAPI", "fastapi"],
      ["Java", "java"],
      ["Spring Boot", "spring"],
    ],
  },
  {
    label: "Databases & Data",
    items: [
      ["PostgreSQL", "postgresql"],
      ["MongoDB", "mongodb"],
      ["Prisma", "prisma"],
    ],
  },
  {
    label: "Frontend",
    items: [
      ["React", "react"],
      ["Next.js", "nextjs"],
      ["JavaScript", "javascript"],
      ["Angular", "angular"],
      ["Tailwind CSS", "tailwindcss"],
    ],
  },
  {
    label: "Infrastructure & Cloud",
    items: [
      ["Docker", "docker"],
      ["AWS", "amazonwebservices"],
      ["GitHub Actions", "githubactions"],
      ["Azure DevOps", "azuredevops"],
      ["Supabase", "supabase"],
      ["Firebase", "firebase"],
    ],
  },
  {
    label: "Tools & Testing",
    items: [
      ["Git", "git"],
      ["GitHub", "github"],
      ["Vitest", "vitest"],
      ["Pytest", "pytest"],
      ["Postman", "postman"],
      ["Swagger", "swagger"],
      ["Zod", "zod"],
    ],
  },
  {
    label: "AI Development",
    items: [
      ["OpenAI Codex", "openai"],
      ["Claude Code", "claude"],
    ],
  },
];
