import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blogDir = path.join(__dirname, '../src/content/blog');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

function determineLanguage(content) {
  // Remove frontmatter
  let text = content.replace(/^---[\s\S]*?---/, '');

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`.*?`/g, '');

  // Count Thai characters vs English characters
  const thaiMatch = text.match(/[\u0E00-\u0E7F]/g);
  const engMatch = text.match(/[a-zA-Z]/g);

  const thaiCount = thaiMatch ? thaiMatch.length : 0;
  const engCount = engMatch ? engMatch.length : 0;

  // If a significant portion is Thai, consider it Thai
  return thaiCount > engCount * 0.2 || thaiCount > 100 ? 'th' : 'en';
}

function processFiles() {
  const files = getFiles(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let updatedCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    // Check if it already has lang defined
    if (content.match(/^lang:/m) && content.match(/^translationId:/m)) {
      continue;
    }

    const lang = determineLanguage(content);

    // Extract slug from filename or frontmatter
    let slugMatch = content.match(/^slug:\s*['"]?([^'"\n\r]+)['"]?/m);
    let slug = slugMatch ? slugMatch[1] : path.parse(file).name;

    // If slug ends with -en or -th, strip it for translationId
    let translationId = slug.replace(/-(en|th)$/, '');

    // Inject into frontmatter
    const frontmatterRegex = /^(---[\s\S]*?)(---)/;
    if (frontmatterRegex.test(content)) {
      const newContent = content.replace(frontmatterRegex, (match, p1, p2) => {
        let injected = p1;
        if (!injected.match(/^lang:/m)) {
          injected += `lang: '${lang}'\n`;
        }
        if (!injected.match(/^translationId:/m)) {
          injected += `translationId: '${translationId}'\n`;
        }
        return injected + p2;
      });

      fs.writeFileSync(file, newContent);
      updatedCount++;
      console.log(
        `Updated ${path.basename(file)} -> lang: ${lang}, translationId: ${translationId}`
      );
    } else {
      console.warn(`Could not find frontmatter in ${file}`);
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} files.`);
}

processFiles();
