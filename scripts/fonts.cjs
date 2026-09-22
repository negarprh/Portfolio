const fs = require("fs");
(async () => {
  const families = {
    orbitron: "Orbitron:wght@400",
    editorial: "DM+Serif+Display",
    "editorial-italic": "DM+Serif+Display:ital@1",
    body: "Manrope:wght@400",
  };
  for (const [name, family] of Object.entries(families)) {
    const response = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}&display=swap`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        },
      },
    );
    if (!response.ok) throw new Error(`Font stylesheet: ${name}`);
    const matches = [
      ...(await response.text()).matchAll(/url\((https[^)]+)\)/g),
    ];
    const font = await fetch(matches.at(-1)[1]);
    if (!font.ok) throw new Error(`Font download: ${name}`);
    const bytes = Buffer.from(await font.arrayBuffer());
    if (bytes.subarray(0, 4).toString() !== "wOF2")
      throw new Error(`Expected WOFF2 for ${name}`);
    fs.writeFileSync(`public/fonts/${name}.woff2`, bytes);
  }
})();
