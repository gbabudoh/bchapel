import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public/icons');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

for (const size of sizes) {
  await sharp(inputPath)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
  console.log(`Generated icon-${size}x${size}.png`);
}

// Maskable icon (with padding so logo isn't clipped by safe zone)
await sharp(inputPath)
  .resize(400, 400, { fit: 'contain', background: { r: 101, g: 163, b: 13, alpha: 1 } })
  .extend({ top: 56, bottom: 56, left: 56, right: 56, background: { r: 101, g: 163, b: 13, alpha: 1 } })
  .resize(512, 512)
  .png()
  .toFile(path.join(outputDir, 'icon-512x512-maskable.png'));
console.log('Generated icon-512x512-maskable.png');

await sharp(inputPath)
  .resize(154, 154, { fit: 'contain', background: { r: 101, g: 163, b: 13, alpha: 1 } })
  .extend({ top: 19, bottom: 19, left: 19, right: 19, background: { r: 101, g: 163, b: 13, alpha: 1 } })
  .resize(192, 192)
  .png()
  .toFile(path.join(outputDir, 'icon-192x192-maskable.png'));
console.log('Generated icon-192x192-maskable.png');

console.log('\nAll icons generated successfully in public/icons/');
