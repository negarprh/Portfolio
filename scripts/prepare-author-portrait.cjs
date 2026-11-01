// Deterministic extraction only: the source face is never generated or retouched.
const sharp = require("sharp");
const fs = require("node:fs/promises");

(async () => {
  const source = "Portrait/Portrait.png";
  const work = ".context-local/portrait-refinement";
  await fs.mkdir(work, { recursive: true });
  const { data, info } = await sharp(source)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.width !== 1448 || info.height !== 1086)
    throw new Error(
      "Portrait dimensions changed; review the extraction contour.",
    );
  // Follow the original hair and sketched shoulder silhouette. All internal
  // face/neck pixels are opaque; only the surrounding paper and outer edge fade.
  const mask =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086">
    <defs>
      <filter id="hair"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="shoulders"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <path fill="white" filter="url(#shoulders)" d="M570 661
      C516 702 418 719 326 777 C252 818 206 863 192 916
      C219 978 318 1031 455 1051 C629 1068 889 1067 1027 1048
      C1155 1032 1247 982 1268 928 C1251 871 1206 829 1132 787
      C1047 737 963 713 905 677 L870 617H605Z"/>
    <path fill="white" filter="url(#hair)" d="M557 709
      L564 631 C531 590 507 543 501 501 L486 469
      C479 427 465 391 453 358 C427 323 411 280 414 235
      C411 194 445 158 490 140 C521 124 548 117 576 116
      C609 78 669 49 724 33 C774 18 825 22 868 33
      C923 46 964 87 986 137 C1002 165 1013 196 1010 222
      C1034 270 1024 320 994 362 L983 452
      C976 510 955 543 929 577 L904 638 L909 710
      C810 752 659 757 557 709Z"/>
  </svg>`);
  const outline = await sharp(mask)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer();
  const faceMask =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086">
    <defs><filter id="soft"><feGaussianBlur stdDeviation="4"/></filter></defs>
    <g fill="white" filter="url(#soft)">
      <path d="M535 370 C550 280 620 230 725 210
        C812 203 896 243 935 331 C955 395 970 470 942 548
        C918 623 874 698 808 730 C750 760 684 748 627 715
        C577 683 545 627 524 555 C505 476 505 421 535 370Z"/>
      <path d="M566 645H906L912 719 C909 785 880 823 784 849
        C710 851 632 830 563 758Z"/>
    </g></svg>`);
  const face = await sharp(faceMask)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer();
  const alpha = Buffer.alloc(info.width * info.height);
  const rgb = Buffer.from(data);
  const paper = [249, 239, 220];
  for (let i = 0; i < alpha.length; i++) {
    const ink = Math.max(
      0,
      1 - Math.min(...paper.map((b, c) => data[i * 3 + c] / b)),
    );
    const t = Math.max(0, Math.min(1, (ink - 0.08) / 0.08));
    const pencilAlpha = ink * t * t * (3 - 2 * t);
    const a = Math.max(face[i] / 255, (pencilAlpha * outline[i]) / 255);
    alpha[i] = Math.round(a * 255);
    // Unmatte only translucent pencil edges from the old cream paper. At full
    // opacity this is the original RGB, including every protected facial pixel.
    if (alpha[i] > 0 && alpha[i] < 255) {
      const opacity = alpha[i] / 255;
      for (let c = 0; c < 3; c++)
        rgb[i * 3 + c] = Math.max(
          0,
          Math.min(
            255,
            Math.round((data[i * 3 + c] - (1 - opacity) * paper[c]) / opacity),
          ),
        );
    }
  }
  // The face is retained verbatim in the full-size master. This guards against
  // accidental masks cutting into facial features when the contour is edited.
  let facePixels = 0;
  for (let y = 280; y < 650; y++) {
    for (let x = 600; x < 880; x++) {
      const i = y * info.width + x;
      if (
        alpha[i] !== 255 ||
        [0, 1, 2].some((c) => rgb[i * 3 + c] !== data[i * 3 + c])
      )
        throw new Error(`Mask crosses the protected face at ${x},${y}`);
      facePixels++;
    }
  }
  const master = await sharp(rgb, { raw: info })
    .joinChannel(alpha, {
      raw: { width: info.width, height: info.height, channels: 1 },
    })
    .png()
    .toBuffer();
  await fs.writeFile(`${work}/portrait-transparent-master.png`, master);
  await sharp(master)
    .resize({ width: 768 })
    .webp({ lossless: true, effort: 6 })
    .toFile("public/images/author-portrait.webp");
  const output = await sharp("public/images/author-portrait.webp").metadata();
  await fs.writeFile(
    `${work}/extraction.json`,
    JSON.stringify(
      {
        source,
        method:
          "Deterministic pencil alpha extraction, opaque original face, unmatted edges",
        protectedOpaqueFacePixels: facePixels,
        faceRetouching: false,
        output: {
          width: output.width,
          height: output.height,
          hasAlpha: output.hasAlpha,
          bytes: (await fs.stat("public/images/author-portrait.webp")).size,
        },
      },
      null,
      2,
    ),
  );
  console.log("Exported transparent portrait; original face RGB retained.");
})();
