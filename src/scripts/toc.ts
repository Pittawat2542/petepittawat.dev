import { buildTocItems, getActiveHeadingId } from '@/lib/toc';

const ACTIVE_STATE = 'location';
const observerByRoot = new WeakMap<HTMLElement, IntersectionObserver>();

function getHeadingOffset() {
  return window.matchMedia('(max-width: 720px)').matches ? 108 : 144;
}

function renderTocIcon(depth: 'main' | 'sub') {
  if (depth === 'sub') {
    return `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
  }

  return `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="5"></circle>
    </svg>
  `;
}

function setActiveLink(navEl: HTMLElement, activeId: string | null) {
  const links = navEl.querySelectorAll('.toc-link');
  links.forEach(link => {
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    if (link.dataset['headingId'] === activeId) {
      link.setAttribute('aria-current', ACTIVE_STATE);
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function initToc(navEl: HTMLElement) {
  const ds = navEl.dataset;
  const rootSelector = ds['selector'] ?? 'article';
  let levels = [2, 3];

  try {
    levels = JSON.parse(ds['levels'] ?? '[2,3]') as number[];
  } catch {
    // Ignore parsing errors and default to [2, 3]
  }

  const openByDefault = ds['open'] === 'true';
  const article = document.querySelector(rootSelector) ?? document.querySelector('article');
  const details = navEl.querySelector('details');
  const list = navEl.querySelector('.toc-list');
  const count = navEl.querySelector('.toc-summary__count');

  if (!article || !list) {
    return;
  }

  if (details) {
    if (openByDefault) {
      details.setAttribute('open', '');
    } else {
      details.removeAttribute('open');
    }
  }

  const selector = levels.map(level => `h${level}`).join(',');
  const headingElements = Array.from(article.querySelectorAll(selector)).filter(
    heading => heading instanceof HTMLHeadingElement
  );
  const items = buildTocItems(
    headingElements.map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: Number(heading.tagName.slice(1)),
    }))
  );

  if (!items.length) {
    navEl.style.display = 'none';
    return;
  }

  navEl.style.removeProperty('display');
  if (count instanceof HTMLElement) {
    count.textContent = `${items.length} sections`;
  }

  list.innerHTML = '';
  const elementsById = new Map();

  items.forEach((item, index) => {
    const heading = headingElements[index];
    if (!(heading instanceof HTMLHeadingElement)) {
      return;
    }

    heading.id = item.id;
    elementsById.set(item.id, heading);

    const li = document.createElement('li');
    li.className = `toc-row${item.depth === 'sub' ? ' toc-row--sub' : ''}`;

    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.className = `toc-link${item.depth === 'sub' ? ' toc-link--sub' : ' toc-link--main'}`;
    link.dataset['headingId'] = item.id;

    const icon = document.createElement('span');
    icon.className = 'toc-icon';
    icon.innerHTML = renderTocIcon(item.depth);

    const text = document.createElement('span');
    text.className = 'toc-link__text';
    text.textContent = item.text;

    link.append(icon, text);
    li.appendChild(link);
    list.appendChild(li);
  });

  const syncActiveLink = () => {
    const activeId = getActiveHeadingId(
      items.map(item => ({
        id: item.id,
        top: elementsById.get(item.id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
      })),
      getHeadingOffset()
    );

    setActiveLink(navEl, activeId);
  };

  observerByRoot.get(navEl)?.disconnect();
  const observer = new IntersectionObserver(syncActiveLink, {
    rootMargin: '-18% 0px -70% 0px',
    threshold: [0, 1],
  });

  elementsById.forEach(element => {
    observer.observe(element);
  });

  observerByRoot.set(navEl, observer);

  details?.addEventListener('toggle', syncActiveLink);
  window.addEventListener('hashchange', syncActiveLink);
  window.addEventListener('resize', syncActiveLink);
  syncActiveLink();
}

const initAllTocs = () => {
  document.querySelectorAll('.toc-root').forEach(navEl => {
    if (navEl instanceof HTMLElement) {
      initToc(navEl);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllTocs, { once: true });
} else {
  initAllTocs();
}
