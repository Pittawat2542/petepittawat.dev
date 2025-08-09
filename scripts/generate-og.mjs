import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'public', 'og', 'blog');

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

function svgTemplate({ title, siteTitle = 'PETEPITTAWAT.DEV', logoDataUrl }) {
  const nonAscii = hasNonAscii(title);
  const lines = wrapText(title, nonAscii ? 22 : 28);
  const yStart = 250;
  const lineHeight = nonAscii ? 60 : 64;
  const fontSize = nonAscii ? 54 : 60;
  const tspans = lines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : lineHeight}">${l}</tspan>`) 
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#1f2937"/>
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="40" y="40" width="1120" height="550" rx="24" fill="#0b1220" opacity="0.6" stroke="#3B82F6" stroke-opacity="0.25"/>
    ${logoDataUrl ? `<image href="${logoDataUrl}" x="1040" y="56" width="80" height="80"/>` : ''}
    <text x="80" y="${yStart}" xml:space="preserve" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,'Noto Sans','Noto Sans Thai',sans-serif,Apple Color Emoji,Segoe UI Emoji" font-size="${fontSize}" font-weight="800" fill="#f9fafb">
      ${tspans}
    </text>
    <text x="80" y="560" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,'Noto Sans',sans-serif" font-size="28" font-weight="600" fill="#93c5fd" filter="url(#shadow)">${siteTitle}</text>
  </svg>`;
}

async function generate() {
  await ensureDir(OUT_DIR);
  const files = await fs.readdir(BLOG_DIR);
  const logoDataUrl = await readLogoDataUrl();
  for (const file of files) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const slug = file.replace(/\.(md|mdx)$/i, '');
    const full = path.join(BLOG_DIR, file);
    const out = path.join(OUT_DIR, `${slug}.png`);
    try {
      const content = await fs.readFile(full, 'utf8');
      const { title } = extractFrontmatter(content);
      const svg = svgTemplate({ title: title || slug, logoDataUrl });
      const sharp = (await import('sharp')).default;
      const img = sharp(Buffer.from(svg));
      await img.png().toFile(out);
      console.log('OG generated:', out);
    } catch (e) {
      console.warn('OG generation failed for', file, e?.message);
    }
  }
}

generate();
