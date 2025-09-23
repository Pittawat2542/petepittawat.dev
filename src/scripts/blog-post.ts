/**
 * Blog post interactive functionality
 * Handles code block copy buttons and language detection
 */

// Add copy buttons to code blocks within the article
const setupCopyButtons = () => {
  const article = document.querySelector('article');
  if (!article) return;
  const blocks = article.querySelectorAll('pre > code');
  blocks.forEach(code => {
    const pre = code.parentElement;
    if (!pre || pre.classList.contains('has-copy')) return;
    pre.classList.add('has-copy');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'absolute top-1.5 right-2 text-xs leading-none px-2 py-1.5 rounded-md bg-white/8 border border-white/18 text-white/92 cursor-pointer transition-all duration-150 ease-in-out hover:bg-blue-500/16 hover:border-blue-500/40 hover:text-black';
    btn.ariaLabel = 'Copy code to clipboard';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || '');
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.className =
          'absolute top-1.5 right-2 text-xs leading-none px-2 py-1.5 rounded-md bg-blue-500/26 border border-blue-500/46 text-black cursor-pointer transition-all duration-150 ease-in-out';
        setTimeout(() => {
          btn.textContent = original;
          btn.className =
            'absolute top-1.5 right-2 text-xs leading-none px-2 py-1.5 rounded-md bg-white/8 border border-white/18 text-white/92 cursor-pointer transition-all duration-150 ease-in-out hover:bg-blue-500/16 hover:border-blue-500/40 hover:text-black';
        }, 1200);
      } catch (err) {
        console.warn('Failed to copy to clipboard:', err);
      }
    });
    pre.appendChild(btn);

    // Add language badge
    if (!pre.classList.contains('has-lang')) {
      pre.classList.add('has-lang');
      const detectLang = (preEl: any, codeEl: any) => {
        const get = (el: any, k: any) => (el && el.getAttribute && el.getAttribute(k)) || '';
        let lang = (
          get(preEl, 'data-language') ||
          get(preEl, 'data-lang') ||
          get(codeEl, 'data-language') ||
          get(codeEl, 'data-lang') ||
          ''
        ).toLowerCase();
        if (!lang) {
          const classes = `${codeEl.className || ''} ${preEl.className || ''}`.toLowerCase();
          const m = classes.match(/(?:language|lang)-([a-z0-9+#\\-]+)/);
          if (m) lang = m[1];
        }
        // Normalize common aliases
        const alias = {
          js: 'JavaScript',
          jsx: 'JSX',
          ts: 'TypeScript',
          tsx: 'TSX',
          py: 'Python',
          python: 'Python',
          sh: 'Shell',
          shell: 'Shell',
          bash: 'Bash',
          zsh: 'Zsh',
          plaintext: 'Text',
          text: 'Text',
          txt: 'Text',
          json: 'JSON',
          yml: 'YAML',
          yaml: 'YAML',
          md: 'Markdown',
          markdown: 'Markdown',
          html: 'HTML',
          css: 'CSS',
          scss: 'SCSS',
          sass: 'Sass',
          c: 'C',
          'c++': 'C++',
          cpp: 'C++',
          cxx: 'C++',
          'c#': 'C#',
          csharp: 'C#',
          cs: 'C#',
          java: 'Java',
          go: 'Go',
          rust: 'Rust',
          rs: 'Rust',
          dart: 'Dart',
          kotlin: 'Kotlin',
          swift: 'Swift',
          sql: 'SQL',
          php: 'PHP',
          ruby: 'Ruby',
          rb: 'Ruby',
        };
        if (lang in alias) return alias[lang as keyof typeof alias];
        // Uppercase safe characters, keep + and #
        if (lang) return lang.replace(/\\b\\w+/g, (w: string) => w.toUpperCase());
        return 'Text';
      };
      const langLabel = detectLang(pre, code);
      const badge = document.createElement('span');
      badge.className =
        'absolute top-1.5 left-2 text-[0.7rem] leading-none tracking-wider px-1.5 py-1 rounded-md text-white/92 bg-blue-500/16 border border-blue-500/40 select-none pointer-events-none';
      badge.textContent = langLabel;
      pre.appendChild(badge);
    }
  });
};

// Improve loading behavior for article images from Markdown
const improveImages = () => {
  const imgs = document.querySelectorAll('article img');
  imgs.forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
  });
};

const onReady = () => {
  setupCopyButtons();
  improveImages();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}
