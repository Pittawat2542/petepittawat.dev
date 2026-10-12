import { createHash } from 'node:crypto';
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Hash the rendered HTML, including image URLs and markup, before deployment. */
export async function finalizeListingAssets(directory) {
  const root = fileURLToPath(directory);
  const source = join(root, 'listing-assets/blog/th');
  const html = await readFile(join(source, 'index.html'));
  const hash = createHash('sha256').update(html).digest('hex').slice(0, 16);
  const name = `th-${hash}`;
  await rename(source, join(root, 'listing-assets/blog', name));
  async function rewrite(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await rewrite(path);
      else if (entry.name.endsWith('.html')) {
        const text = await readFile(path, 'utf8');
        if (text.includes('/listing-assets/blog/th/'))
          await writeFile(
            path,
            text.replaceAll('/listing-assets/blog/th/', `/listing-assets/blog/${name}/`)
          );
      }
    }
  }
  await rewrite(root);
}
