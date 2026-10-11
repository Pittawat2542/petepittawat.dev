import crypto from 'node:crypto';

import sharp from 'sharp';

export const CONTENT_IMAGE_VERSION = 'content-image-v2';
export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 630;

// Hash the actual artwork as well as metadata: changing a PNG or the renderer
// must invalidate an existing derivative, even when the title stays the same.
export function createContentImageHash(source: Buffer, metadata: string) {
  return crypto
    .createHash('sha256')
    .update(CONTENT_IMAGE_VERSION)
    .update(metadata)
    .update(source)
    .digest('hex');
}

// Track artwork changes independently of export settings so an encoder upgrade
// can apply to future items without forcing a refresh of the entire archive.
export function createContentImageInputHash(source: Buffer, metadata: string) {
  return crypto.createHash('sha256').update(metadata).update(source).digest('hex');
}

export function prepareCoverImage(source: Buffer, vector = false) {
  // Render vectors at 2x before downsampling for smoother fine lines and glows.
  return sharp(source, vector ? { density: 144 } : {})
    .autoOrient()
    .resize(COVER_WIDTH, COVER_HEIGHT, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    })
    .toColourspace('srgb');
}

export async function renderCoverWebp(source: Buffer, vector = false) {
  return prepareCoverImage(source, vector)
    .webp({ quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toBuffer();
}

export async function renderCoverPng(source: Buffer) {
  return prepareCoverImage(source).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
}

export async function renderCoverJpeg(source: Buffer) {
  return prepareCoverImage(source)
    .flatten({ background: '#070b16' })
    .jpeg({ quality: 94, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toBuffer();
}
