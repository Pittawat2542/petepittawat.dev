import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface ResponsiveCover {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}
const cache = new Map<string, Promise<ResponsiveCover>>();
/** Reuse transforms across tag pages, discovery cards, and article heroes. */
export function responsiveCover(image: ImageMetadata): Promise<ResponsiveCover> {
  let pending = cache.get(image.src);
  if (!pending) {
    pending = (async () => {
      const widths = [...new Set([400, 800, 1200].map(width => Math.min(width, image.width)))];
      const variants = await Promise.all(
        widths.map(width => getImage({ src: image, width, format: 'webp', quality: 80 }))
      );
      const largest = variants[variants.length - 1];
      if (!largest) throw new Error('Cover transform produced no variants');
      return {
        src: largest.src,
        srcSet: variants.map((variant, i) => `${variant.src} ${widths[i]}w`).join(', '),
        width: Number(largest.attributes['width']),
        height: Number(largest.attributes['height']),
      };
    })();
    cache.set(image.src, pending);
  }
  return pending;
}
