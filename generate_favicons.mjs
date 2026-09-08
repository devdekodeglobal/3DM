import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const source = '/Users/vanosski/.gemini/antigravity-ide/brain/8a55a27b-2188-4dbb-8e47-1ac37885f9e6/.user_uploaded/media_1788869035943.png';

async function generate() {
  // Trim the logo
  const trimmed = await sharp(source)
    .trim()
    .toBuffer();

  const { width, height } = await sharp(trimmed).metadata();
  const maxDim = Math.max(width, height);

  const sizes = [
    { name: 'favicon.png', size: 32 },
    { name: 'krafcfavicon.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'logo192.png', size: 192 },
    { name: 'logo512.png', size: 512 }
  ];

  for (const { name, size } of sizes) {
    // 60% of the circle diameter
    const logoSize = Math.round(size * 0.6);
    
    const resizedLogo = await sharp(trimmed)
      .resize(logoSize, logoSize, { fit: 'inside' })
      .toBuffer();

    // Create white circle
    const circleSvg = `<svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white" />
    </svg>`;

    await sharp(Buffer.from(circleSvg))
      .composite([
        {
          input: resizedLogo,
          gravity: 'center'
        }
      ])
      .png()
      .toFile(path.join('public', name));
    
    console.log(`Generated ${name}`);
  }
}

generate().catch(console.error);
