import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'public', 'og', 'blog');
const MANIFEST_FILE = path.join(ROOT, 'public', 'og', 'manifest.json');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true }).catch(() => {});
}

function extractFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return {};
  const fm = fmMatch[1];
  const lines = fm.split(/\r?\n/);
  const data = {};
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    data[key] = value;
  }
  return data;
}

function hasNonAscii(s) {
  return /[^\u0000-\u007F]/.test(String(s || ''));
}

function wrapText(text, max = 32) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > max) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = (current ? current + ' ' : '') + w;
    }
  }
  if (current) lines.push(current);
  if (lines.length > 5) {
    const capped = lines.slice(0, 5);
    const last = capped[4];
    capped[4] = last.replace(/.{0,2}$/, '…');
    return capped;
  }
  return lines;
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function readLogoDataUrl() {
  try {
    const logoPath = path.join(ROOT, 'src', 'assets', 'images', 'logo.png');
    const buf = await fs.readFile(logoPath);
    const b64 = buf.toString('base64');
    return `data:image/png;base64,${b64}`;
  } catch {
    return null;
  }
}

// Generate random decorative elements for each SVG
function generateRandomDecorations() {
  let decorations = '';

  // Generate 5-8 random circles with better distribution
  const circleCount = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < circleCount; i++) {
    // Ensure circles are within visible bounds (avoid clipping)
    const cx = 150 + Math.floor(Math.random() * 900);
    const cy = 150 + Math.floor(Math.random() * 330);
    const r = 20 + Math.floor(Math.random() * 100);
    const accent = Math.floor(Math.random() * 3) + 1;
    decorations += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#accent${accent})" filter="url(#glow)" opacity="${0.3 + Math.random() * 0.4}"/>\n      `;
  }

  // Generate 3-6 random paths with more organic shapes
  const pathCount = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < pathCount; i++) {
    // Ensure paths are within visible bounds
    const startX = 200 + Math.floor(Math.random() * 800);
    const startY = 200 + Math.floor(Math.random() * 230);

    // Create more complex, beautiful paths
    const segments = 2 + Math.floor(Math.random() * 3);
    let pathData = `M${startX},${startY}`;

    for (let j = 0; j < segments; j++) {
      const controlX = startX + (Math.random() * 300 - 150);
      const controlY = startY + (Math.random() * 200 - 100);
      const endX = startX + (Math.random() * 200 - 100);
      const endY = startY + (Math.random() * 150 - 75);
      pathData += ` Q${controlX},${controlY} ${endX},${endY}`;
    }

    const color = Math.floor(Math.random() * 3);
    const colors = ['rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)', 'rgba(6, 182, 212, 0.2)'];

    decorations += `<path d="${pathData}" fill="none" stroke="${colors[color]}" stroke-width="${2 + Math.random() * 4}" filter="url(#glow)" opacity="${0.4 + Math.random() * 0.3}"/>\n      `;
  }

  // Generate 2-5 random polygons with more varied shapes
  const polygonCount = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < polygonCount; i++) {
    // Ensure polygons are within visible bounds
    const centerX = 250 + Math.floor(Math.random() * 700);
    const centerY = 200 + Math.floor(Math.random() * 230);
    const points = [];
    const pointCount = 4 + Math.floor(Math.random() * 6);

    // Create more interesting polygon shapes
    for (let j = 0; j < pointCount; j++) {
      const angle = (j * 2 * Math.PI) / pointCount + Math.random() * 0.8;
      const radius = 40 + Math.floor(Math.random() * 120);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    const color = Math.floor(Math.random() * 3);
    const colors = ['rgba(245, 158, 11, 0.2)', 'rgba(239, 68, 68, 0.2)', 'rgba(16, 185, 129, 0.2)'];

    decorations += `<polygon points="${points.join(' ')}" fill="${colors[color]}" filter="url(#glow)" opacity="${0.3 + Math.random() * 0.3}"/>\n      `;
  }

  // Generate 3-7 small decorative elements for added beauty
  const smallElementCount = 3 + Math.floor(Math.random() * 5);
  for (let i = 0; i < smallElementCount; i++) {
    const x = 100 + Math.floor(Math.random() * 1000);
    const y = 100 + Math.floor(Math.random() * 430);
    const size = 5 + Math.floor(Math.random() * 25);
    const accent = Math.floor(Math.random() * 3) + 1;

    // Randomly choose between different small decorative shapes
    const shapeType = Math.floor(Math.random() * 3);
    if (shapeType === 0) {
      // Circle
      decorations += `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="url(#accent${accent})" filter="url(#glow)" opacity="${0.4 + Math.random() * 0.3}"/>\n      `;
    } else if (shapeType === 1) {
      // Square
      decorations += `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="url(#accent${accent})" filter="url(#glow)" opacity="${0.4 + Math.random() * 0.3}"/>\n      `;
    } else {
      // Star shape (5-pointed)
      let starPoints = [];
      for (let j = 0; j < 10; j++) {
        const angle = (j * Math.PI) / 5 - Math.PI / 2;
        const radius = j % 2 === 0 ? size / 2 : size / 4;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        starPoints.push(`${px},${py}`);
      }
      decorations += `<polygon points="${starPoints.join(' ')}" fill="url(#accent${accent})" filter="url(#glow)" opacity="${0.4 + Math.random() * 0.3}"/>\n      `;
    }
  }

  return decorations;
}

function svgTemplate({ title, siteTitle = 'PETEPITTAWAT.DEV', logoDataUrl, pubDate, tags }) {
  const nonAscii = hasNonAscii(title);

  // Adjust text wrapping and font size based on title length
  let maxCharsPerLine, fontSize, lineHeight, yStart;
  const titleLength = String(title || '').length;

  if (titleLength <= 30) {
    // Short titles - larger font, fewer lines
    maxCharsPerLine = nonAscii ? 18 : 24;
    fontSize = nonAscii ? 60 : 66;
    lineHeight = nonAscii ? 66 : 72;
    yStart = 240;
  } else if (titleLength <= 60) {
    // Medium titles - standard sizing
    maxCharsPerLine = nonAscii ? 20 : 26;
    fontSize = nonAscii ? 54 : 60;
    lineHeight = nonAscii ? 60 : 66;
    yStart = 230;
  } else {
    // Long titles - smaller font, more lines
    maxCharsPerLine = nonAscii ? 22 : 28;
    fontSize = nonAscii ? 48 : 54;
    lineHeight = nonAscii ? 54 : 60;
    yStart = 220;
  }

  const lines = wrapText(title, maxCharsPerLine);
  const safeLines = lines.map(escapeXml);

  // Adjust vertical positioning based on number of lines
  const lineCount = safeLines.length;
  let adjustedYStart = yStart;
  if (lineCount === 1) {
    adjustedYStart = yStart + 20; // Center single line better
  } else if (lineCount >= 4) {
    adjustedYStart = yStart - 10; // Move multi-line text up
  }

  const tspans = safeLines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : lineHeight}">${l}</tspan>`)
    .join('');
  const safeSiteTitle = escapeXml(siteTitle);

  // Format date
  let formattedDate = '';
  if (pubDate) {
    try {
      const date = new Date(pubDate);
      formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      // If date parsing fails, use the raw value
      formattedDate = pubDate;
    }
  }

  // Process tags with enhanced display
  let tagElements = '';
  if (tags && Array.isArray(tags) && tags.length > 0) {
    const maxTags = 3;
    const displayTags = tags.slice(0, maxTags);

    // Add "TAGS" label
    tagElements = `<text x="80" y="440" font-family="'Anuphan', 'Krub', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" font-size="20" font-weight="600" fill="#60a5fa">TAGS</text>`;

    // Add tag elements
    const tagItems = displayTags
      .map(
        tag =>
          `<rect x="0" y="0" width="100%" height="100%" rx="6" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="1"/>
       <text x="50%" y="50%" font-family="'Anuphan', 'Krub', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" font-size="20" font-weight="600" fill="#bfdbfe" text-anchor="middle" dominant-baseline="middle">${escapeXml(tag)}</text>`
      )
      .map(
        (tagSvg, index) =>
          `<g transform="translate(${160 + index * 200}, 440) scale(1)">${tagSvg}</g>`
      )
      .join('');

    tagElements += tagItems;
  }

  // Generate random decorative elements
  const randomDecorations = generateRandomDecorations();

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#1f2937"/>
      </linearGradient>
      <linearGradient id="accent1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.3"/>
      </linearGradient>
      <linearGradient id="accent2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#ef4444" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.3"/>
      </linearGradient>
      <linearGradient id="accent3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#ec4899" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.3"/>
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000" flood-opacity="0.35"/>
      </filter>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <mask id="fadeMask">
        <rect width="100%" height="100%" fill="white"/>
        <rect x="0" y="0" width="100%" height="80" fill="black"/>
        <rect x="0" y="550" width="100%" height="80" fill="black"/>
        <!-- Soft gradient edges to prevent harsh clipping -->
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black"/>
          <stop offset="100%" stop-color="white"/>
        </linearGradient>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white"/>
          <stop offset="100%" stop-color="black"/>
        </linearGradient>
        <rect x="0" y="80" width="100%" height="40" fill="url(#topFade)"/>
        <rect x="0" y="510" width="100%" height="40" fill="url(#bottomFade)"/>
      </mask>
      <!-- Define font faces for better typography -->
      <style>
        @font-face {
          font-family: 'Anuphan';
          src: local('Anuphan'), local('Anuphan-Regular');
        }
        @font-face {
          font-family: 'Krub';
          src: local('Krub'), local('Krub-Regular');
        }
      </style>
    </defs>
    
    <!-- Background with gradient -->
    <rect width="100%" height="100%" fill="url(#g)"/>
    
    <!-- Random abstract decoration elements -->
    <g opacity="0.4" mask="url(#fadeMask)">
      ${randomDecorations}
    </g>
    
    <!-- Main content container with refined padding -->
    <rect x="40" y="40" width="1120" height="550" rx="24" fill="#0b1220" opacity="0.6" stroke="#3B82F6" stroke-opacity="0.25"/>
    
    <!-- Logo -->
    ${logoDataUrl ? `<image href="${logoDataUrl}" x="1060" y="60" width="80" height="80"/>` : ''}
    
    <!-- Title with improved spacing -->
    <text x="80" y="${adjustedYStart}" xml:space="preserve" font-family="'Anuphan', 'Krub', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" font-size="${fontSize}" font-weight="800" fill="#f9fafb" text-rendering="optimizeLegibility" kerning="1">
      ${tspans}
    </text>
    
    <!-- Date with refined spacing -->
    ${formattedDate ? `<text x="80" y="470" font-family="'Anuphan', 'Krub', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" font-size="24" font-weight="500" fill="#9ca3af">${escapeXml(formattedDate)}</text>` : ''}
    
    <!-- Tags with refined spacing -->
    ${tagElements}
    
    <!-- Site title with refined spacing -->
    <text x="80" y="540" font-family="'Anuphan', 'Krub', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" font-size="28" font-weight="600" fill="#93c5fd" filter="url(#shadow)">${safeSiteTitle}</text>
  </svg>`;
}

// Create a hash of the blog post metadata to detect changes
function createPostHash(title, pubDate, tags) {
  const data = {
    title: title || '',
    pubDate: pubDate ? new Date(pubDate).toISOString() : '',
    tags: Array.isArray(tags) ? tags.sort() : [],
  };
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

// Load the manifest file
async function loadManifest() {
  try {
    const data = await fs.readFile(MANIFEST_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save the manifest file
async function saveManifest(manifest) {
  await ensureDir(path.dirname(MANIFEST_FILE));
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

async function generate() {
  await ensureDir(OUT_DIR);
  const files = await fs.readdir(BLOG_DIR);
  const logoDataUrl = await readLogoDataUrl();

  // Load the manifest to check what we've already generated
  const manifest = await loadManifest();
  const updatedManifest = {};
  let generatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const slug = file.replace(/\.(md|mdx)$/i, '');
    const full = path.join(BLOG_DIR, file);
    const out = path.join(OUT_DIR, `${slug}.png`);

    try {
      const content = await fs.readFile(full, 'utf8');
      const frontmatter = extractFrontmatter(content);
      const title = frontmatter.title || slug;
      const pubDate = frontmatter.pubDate;
      const tags = frontmatter.tags;

      // Create a hash of the current post metadata
      const currentHash = createPostHash(title, pubDate, tags);

      // Check if we need to regenerate
      const shouldRegenerate =
        !manifest[slug] ||
        manifest[slug].hash !== currentHash ||
        !(await fs
          .access(out)
          .then(() => true)
          .catch(() => false));

      if (shouldRegenerate) {
        const svg = svgTemplate({ title, logoDataUrl, pubDate, tags });
        const sharp = (await import('sharp')).default;
        const img = sharp(Buffer.from(svg));
        await img.png().toFile(out);
        console.log('OG generated:', out);
        generatedCount++;
      } else {
        console.log('OG skipped (no changes):', out);
        skippedCount++;
      }

      // Update the manifest
      updatedManifest[slug] = {
        hash: currentHash,
        generatedAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn('OG generation failed for', file, e?.message);
    }
  }

  // Save the updated manifest
  await saveManifest(updatedManifest);

  console.log(`OG generation complete: ${generatedCount} generated, ${skippedCount} skipped`);
}

generate();
