const fs = require("fs");
(async () => {
  for (const [name, url] of Object.entries({
    "dm-serif-display-OFL.txt":
      "https://raw.githubusercontent.com/google/fonts/main/ofl/dmserifdisplay/OFL.txt",
    "manrope-OFL.txt":
      "https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt",
    "devicon-LICENSE.txt":
      "https://raw.githubusercontent.com/devicons/devicon/v2.17.0/LICENSE",
    "simple-icons-LICENSE.txt":
      "https://raw.githubusercontent.com/simple-icons/simple-icons/15.0.0/LICENSE.md",
  })) {
    const r = await fetch(url);
    if (!r.ok) throw Error(name + ": " + r.status);
    fs.writeFileSync("public/licenses/" + name, await r.text());
  }
})();
