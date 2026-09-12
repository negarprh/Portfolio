const fs = require("fs");
const icons = [
  "python",
  "fastapi",
  "sqlalchemy",
  "postgresql",
  "redis",
  "java",
  "spring",
  "nodejs",
  "nestjs",
  "prisma",
  "flask",
  "typescript",
  "react",
  "nextjs",
  "tailwindcss",
  "javascript",
  "html5",
  "css3",
  "docker",
  "githubactions",
  "supabase",
  "azuredevops",
  "git",
  "github",
  "postman",
  "swagger",
  "vitest",
  "firebase",
];
(async () => {
  await Promise.all(
    icons.map(async (name) => {
      let r = await fetch(
        `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/${name}/${name}-original.svg`,
      );
      if (!r.ok)
        r = await fetch(
          `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/${name}/${name}-plain.svg`,
        );
      if (!r.ok) throw new Error(name);
      fs.writeFileSync(`public/icons/${name}.svg`, await r.text());
    }),
  );
  let r = await fetch(
    "https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/stripe.svg",
  );
  if (!r.ok) throw Error("stripe");
  fs.writeFileSync("public/icons/stripe.svg", await r.text());
})();
