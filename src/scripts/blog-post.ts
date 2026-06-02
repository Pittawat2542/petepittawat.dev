/**
 * Blog post interactive functionality
 * Handles code block copy buttons and language detection
 */

// Add copy buttons to code blocks within the article
const READER_PANE_STORAGE_KEY = 'blog-reader-pane-open';

function getAttribute(el: Element | null, key: string) {
  return el?.getAttribute(key) ?? '';
}

function detectLanguage(preEl: Element, codeEl: HTMLElement) {
  let lang = (
    getAttribute(preEl, 'data-language') ||
    getAttribute(preEl, 'data-lang') ||
    getAttribute(codeEl, 'data-language') ||
    getAttribute(codeEl, 'data-lang') ||
    ''
  ).toLowerCase();

  if (!lang) {
    const classes = `${codeEl.className ?? ''} ${preEl.className ?? ''}`.toLowerCase();
    const match = classes.match(/(?:language|lang)-([a-z0-9+#\\-]+)/);
    if (match) {
      lang = match[1] ?? '';
    }
  }

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
  } as const;

  if (lang in alias) {
    return alias[lang as keyof typeof alias];
  }

  if (lang) {
    return lang.replace(/\b\w+/g, word => word.toUpperCase());
  }

  return 'Text';
}

const setupCopyButtons = () => {
  const article = document.querySelector('article');
  if (!article) return;
  const blocks = article.querySelectorAll('pre > code');
  blocks.forEach(code => {
    if (!(code instanceof HTMLElement)) {
      return;
    }

    const pre = code.parentElement;
    if (!pre || pre.classList.contains('has-copy')) return;
    pre.classList.add('has-copy');
    if (!pre.hasAttribute('tabindex')) {
      pre.setAttribute('tabindex', '0');
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-button';
    btn.ariaLabel = 'Copy code to clipboard';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || '');
        btn.dataset['state'] = 'copied';
        btn.textContent = 'Copied!';
        setTimeout(() => {
          delete btn.dataset['state'];
          btn.textContent = 'Copy';
        }, 1200);
      } catch (err) {
        console.warn('Failed to copy to clipboard:', err);
        btn.dataset['state'] = 'error';
        btn.textContent = 'Error';
        setTimeout(() => {
          delete btn.dataset['state'];
          btn.textContent = 'Copy';
        }, 1200);
      }
    });
    pre.appendChild(btn);

    // Add language badge
    if (!pre.classList.contains('has-lang')) {
      pre.classList.add('has-lang');
      const langLabel = detectLanguage(pre, code);
      const badge = document.createElement('span');
      badge.className = 'code-lang-badge';
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

function readReaderPaneState(storageKey: string) {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function writeReaderPaneState(storageKey: string, isOpen: boolean) {
  try {
    window.localStorage.setItem(storageKey, isOpen ? 'true' : 'false');
  } catch {
    // Storage can be unavailable in strict privacy contexts.
  }
}

const setupReaderPane = () => {
  document.querySelectorAll('[data-reader-pane]').forEach(pane => {
    if (!(pane instanceof HTMLDetailsElement)) {
      return;
    }

    const storageKey = pane.dataset['storageKey'] ?? READER_PANE_STORAGE_KEY;
    const storedState = readReaderPaneState(storageKey);

    if (storedState === 'false') {
      pane.removeAttribute('open');
    } else if (storedState === 'true') {
      pane.setAttribute('open', '');
    }

    pane.addEventListener('toggle', () => {
      writeReaderPaneState(storageKey, pane.open);
    });
  });
};

const onReady = () => {
  setupCopyButtons();
  improveImages();
  setupReaderPane();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}
