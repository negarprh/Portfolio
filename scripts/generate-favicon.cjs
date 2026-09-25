// Raster fallbacks share the hand-drawn, font-independent SVG master.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

(async () => {
  const app = path.join(__dirname, "..", "app");
  const source = path.join(app, "icon.svg");
  const sizes = [16, 32, 48];
  const frames = await Promise.all(
    sizes.map((size) => sharp(source, { density: 384 }).resize(size, size).png().toBuffer()),
  );
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach((frame, index) => {
    const entry = 6 + index * 16;
    header[entry] = sizes[index];
    header[entry + 1] = sizes[index];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(frame.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += frame.length;
  });
  await fs.writeFile(path.join(app, "favicon.ico"), Buffer.concat([header, ...frames]));
  await sharp(source, { density: 384 }).resize(180, 180).png().toFile(path.join(app, "apple-icon.png"));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
