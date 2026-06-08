import fs from "fs";

const src = fs.readFileSync("public/brand/logo-icon.svg", "utf8");
const match = src.match(/xlink:href="(data:image\/png;base64,[^"]+)"/);
if (!match) {
  console.error("Could not find embedded PNG in logo-icon.svg");
  process.exit(1);
}

const dataUrl = match[1];
const primary = "#FF4D00";

function makeSvg(size, padding) {
  const inner = size - padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <mask id="mark" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">
      <image x="${padding}" y="${padding}" width="${inner}" height="${inner}" preserveAspectRatio="xMidYMid meet" href="${dataUrl}"/>
    </mask>
  </defs>
  <rect width="${size}" height="${size}" fill="${primary}" mask="url(#mark)"/>
</svg>`;
}

const favicon = makeSvg(32, 4);
const apple = makeSvg(180, 24);

fs.writeFileSync("public/brand/favicon.svg", favicon);
fs.writeFileSync("public/brand/apple-icon.svg", apple);
fs.writeFileSync("src/app/icon.svg", favicon);
fs.writeFileSync("src/app/apple-icon.svg", apple);

console.log("Generated orange favicon assets");
