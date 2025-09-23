import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');

/**
 * Read file as UTF-8 text.
 */
async function readFile(file) {
  return fs.readFile(file, 'utf8');
}

/**
 * Write text to file, ensuring parent dir exists.
 */
async function writeFile(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true }).catch(() => {});
  await fs.writeFile(file, content, 'utf8');
}

/**
 * Get list of blog content files (.md or .mdx) at top level of blog dir.
 */
async function listBlogFiles() {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  return entries
    .filter(e => e.isFile() && /\.(md|mdx)$/i.test(e.name))
    .map(e => path.join(BLOG_DIR, e.name));
}

/**
 * Extract frontmatter block and body.
 */
function splitFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\s*\n?/);
  if (!fmMatch) return { frontmatter: null, body: content, raw: content };
  const fm = fmMatch[0];
  const body = content.slice(fm.length);
  return { frontmatter: fm, body, raw: content };
}

/**
 * Ensure an import exists after frontmatter. Inserts after frontmatter block.
 */
function ensureImport(raw, importLine) {
  if (raw.includes(importLine)) return raw; // already present
  const { frontmatter, body } = splitFrontmatter(raw);
  if (!frontmatter) {
    // No frontmatter: prepend import at top with double newline
    return `${importLine}\n\n${raw}`;
  }
  // If there are already imports immediately after frontmatter, maintain spacing
  const trimmedBody = body.startsWith('\n') ? body : `\n${body}`;
  return `${frontmatter}${importLine}\n${trimmedBody}`;
}

/**
 * Replace the recurring "Hope you enjoy reading" segment with an MDX Callout.
 * Handles variations with extra asterisks and optional surrounding horizontal rules.
 */
function transformHopeCallout(body) {
  const hopeLinePattern =
    /^(?:\s*---\s*\n)?(?:\s*\n)?^##\s*\**\s*📚\s*Hope you enjoy reading!\s*📚\s*\**\s*$\n(?:\s*\n)?(?:\s*---\s*\n)?/m;
  if (!hopeLinePattern.test(body)) return { body, changed: false };
  const replacement = `\n<Callout type="tip" title="Thanks for reading">\n  📚 Hope you enjoy reading!\n</Callout>\n\n`;
  const newBody = body.replace(hopeLinePattern, replacement);
  return { body: newBody, changed: true };
}

/**
 * Perform codemod on a single file: replace hope section, add imports, and rename to .mdx if needed.
 */
async function codemodFile(file) {
  const original = await readFile(file);
  const { frontmatter, body } = splitFrontmatter(original);
  let workingBody = body;
  let importsToAdd = [];
  let changed = false;

  // Transform Hope section into MDX Callout
  const hopeRes = transformHopeCallout(workingBody);
  if (hopeRes.changed) {
    workingBody = hopeRes.body;
    importsToAdd.push(`import Callout from '../../components/Callout.astro'`);
    changed = true;
  }

  // Convert Markdown images to <Figure /> for consistent styling
  const imgRes = transformMarkdownImagesToFigure(workingBody);
  if (imgRes.changed) {
    workingBody = imgRes.body;
    importsToAdd.push(`import Figure from '../../components/mdx/Figure.astro'`);
    changed = true;
  }

  // Convert local Figure src strings to static imports for asset correctness
  const figImportRes = transformFigureSrcToImports(workingBody);
  if (figImportRes.changed) {
    workingBody = figImportRes.body;
    importsToAdd.push(...figImportRes.imports);
    // ensure Figure import present if we created tags earlier in pipeline
    importsToAdd.push(`import Figure from '../../components/mdx/Figure.astro'`);
    changed = true;
  }

  // If no changes, return early
  if (!changed) return { file, changed: false };

  // Reassemble content
  let next = (frontmatter ?? '') + workingBody;
  for (const imp of importsToAdd) {
    next = ensureImport(next, imp);
  }

  // If file is .md, rename to .mdx
  const ext = path.extname(file).toLowerCase();
  let outPath = file;
  if (ext === '.md') {
    outPath = file.slice(0, -3) + '.mdx';
    // Write to new path then remove old file to keep atomic-ish behavior
    await writeFile(outPath, next);
    await fs.unlink(file);
  } else {
    await writeFile(outPath, next);
  }

  return { file, outPath, changed: true };
}

/**
 * Transform Markdown images ![alt](src "title") into <Figure alt src caption />
 * Attempts to skip fenced code blocks.
 */
function transformMarkdownImagesToFigure(body) {
  const lines = body.split(/\r?\n/);
  let inFence = false;
  let changed = false;
  const out = [];
  const imgRe = /!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)/g;
  for (let line of lines) {
    const fenceStart = line.match(/^\s*```|^\s*~~~/);
    if (fenceStart) inFence = !inFence; // toggle on encounter; good-enough heuristic
    if (!inFence && line.includes('![')) {
      const before = line;
      line = line.replace(imgRe, (_m, alt, src, title) => {
        const attrs = [`src=\"${src}\"`, `alt=\"${alt.replace(/\"/g, '&quot;')}\"`];
        if (title && title.trim()) {
          attrs.push(`caption=\"${title.replace(/\"/g, '&quot;')}\"`);
        }
        return `<Figure ${attrs.join(' ')} />`;
      });
      if (line !== before) changed = true;
    }
    out.push(line);
  }
  return { body: out.join('\n'), changed };
}

/**
 * Replace <Figure src="./local.png" .../> with src={importedVar} and add import.
 */
function transformFigureSrcToImports(body) {
  let changed = false;
  const importSet = new Set();
  const existingImports = new Set((body.match(/^import\s+[^;]+;?$/gm) || []).map(l => l.trim()));

  function makeVarName(p) {
    const base = path.basename(p).replace(/\.[^.]+$/, '');
    let name = base.replace(/[^a-zA-Z0-9_$]/g, '_');
    if (/^[0-9]/.test(name)) name = '_' + name;
    let candidate = name;
    let i = 1;
    while (
      [...importSet, ...existingImports].some(
        imp =>
          imp.includes(` ${candidate} `) ||
          imp.includes(` ${candidate},`) ||
          imp.includes(` ${candidate} from`)
      )
    ) {
      candidate = `${name}_${i++}`;
    }
    return candidate;
  }

  const figureSrcStringRe = /<Figure\b([^>]*?)\bsrc\s*=\s*"([^"]+)"([^>]*)>/g;
  let result = '';
  let lastIndex = 0;
  let match;
  const newImports = [];
  while ((match = figureSrcStringRe.exec(body)) !== null) {
    const [, preAttrs, srcVal, postAttrs] = match;
    const start = match.index;
    const end = figureSrcStringRe.lastIndex;
    // external URLs stay as is
    if (/^(?:[a-z]+:)?\/\//i.test(srcVal) || srcVal.startsWith('/')) {
      continue;
    }
    // Resolve path relative to MDX file directory (keep author-written relative specifier)
    const spec = srcVal; // keep as written, Vite will resolve relative to this file
    const varName = makeVarName(spec);
    const importLine = `import ${varName} from '${spec}'`;
    if (!existingImports.has(importLine) && !importSet.has(importLine)) {
      importSet.add(importLine);
      newImports.push(importLine);
    }
    // Replace src="..." with src={varName}
    result += body.slice(lastIndex, start);
    result += `<Figure${preAttrs}src={${varName}}${postAttrs}>`;
    lastIndex = end;
    changed = true;
  }
  result += body.slice(lastIndex);
  return { body: result, changed, imports: newImports };
}

async function run() {
  const files = await listBlogFiles();
  const results = [];
  for (const f of files) {
    const res = await codemodFile(f).catch(e => ({ file: f, error: e?.message }));
    results.push(res);
  }

  const changed = results.filter(r => r && r.changed);
  const errors = results.filter(r => r && r.error);
  console.log(
    `Processed ${results.length} files. Updated ${changed.length}. Errors ${errors.length}.`
  );
  for (const r of changed) {
    console.log(`Updated: ${path.relative(ROOT, r.outPath || r.file)}`);
  }
  for (const r of errors) {
    console.warn(`Error: ${path.relative(ROOT, r.file)} -> ${r.error}`);
  }
}

run();
