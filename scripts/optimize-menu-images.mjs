import { mkdir, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const sourceDirectory = new URL('../src/assets/b1t1/', import.meta.url);
const outputDirectory = new URL('../src/assets/b1t1/optimized/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });
const sources = (await readdir(sourceDirectory)).filter((name) => name.endsWith('.png')).sort();
if (sources.length !== 37) throw new Error('Expected 36 menu images and the official logo.');

let originalBytes = 0;
let compactBytes = 0;
let largeBytes = 0;
for (const name of sources) {
  const source = fileURLToPath(new URL(name, sourceDirectory));
  originalBytes += (await stat(source)).size;
  const stem = name.slice(0, -4);
  if (stem === 'brand-logo') {
    const output = await sharp(source).resize({ width: 640, withoutEnlargement: true })
      .webp({ lossless: true, effort: 6 })
      .toFile(fileURLToPath(new URL(`${stem}.webp`, outputDirectory)));
    compactBytes += output.size;
    largeBytes += output.size;
  } else {
    for (const width of [400, 800]) {
      const output = await sharp(source).resize({ width, withoutEnlargement: true })
        .webp({ quality: 84, alphaQuality: 100, effort: 6 })
        .toFile(fileURLToPath(new URL(`${stem}-${width}.webp`, outputDirectory)));
      if (width === 400) compactBytes += output.size;
      else largeBytes += output.size;
    }
  }
}
console.log(JSON.stringify({ originals: sources.length, originalBytes, compactBytes, largeBytes,
  compactReductionPercent: Number(((1 - compactBytes / originalBytes) * 100).toFixed(1)),
  largeReductionPercent: Number(((1 - largeBytes / originalBytes) * 100).toFixed(1)),
}));
