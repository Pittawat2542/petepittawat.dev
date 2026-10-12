import { SEARCH_OPEN_EVENT } from '@/scripts/openSearch';
import { resolveVisibleItemCount } from '@/components/ui/cards/cardOverflow';
import {
  listingOptions,
  listingHashTarget,
  listingTagCounts,
  listingUrl,
  readListingState,
  selectListing,
} from '@/lib/listing';
import type { ListingItem } from '@/lib/listing';
import {
  getStoredBlogLocalePreference,
  resolveBlogLocalePreference,
  setStoredBlogLocalePreference,
} from '@/lib/blog-locale-preference';

function requiredElement<T extends Element = HTMLElement>(parent: ParentNode, selector: string): T {
  const element = parent.querySelector<T>(selector);
  if (!element) throw new Error(`Missing listing element: ${selector}`);
  return element;
}
function requiredData(node: HTMLElement, key: string): string {
  const value = node.dataset[key];
  if (value === undefined) throw new Error(`Missing listing metadata: ${key}`);
  return value;
}
function initListing(root: HTMLElement) {
  if (root.dataset['initialized']) return;
  root.dataset['initialized'] = 'true';
  const blog = root.dataset['kind'] === 'blog';
  const initialTags: string[] = JSON.parse(root.dataset['initialTags'] ?? '[]');
  const content = requiredElement<HTMLElement>(root, '[data-listing-content]');
  const input = requiredElement<HTMLInputElement>(root, '[data-listing-query] input');
  const dialog = requiredElement<HTMLDialogElement>(root, '[data-listing-dialog]');
  let state = readListingState(new URL(window.location.href), initialTags);
  let locale: 'en' | 'th' = 'en';
  let localeRequest = 0;
  let pendingFrame = 0;
  let opener: HTMLElement | null = null;
  let previousOverflow = '';
  let dialogActive = false;
  let tagQuery = '';
  let expanded = false;
  let records: { meta: ListingItem; node: HTMLElement }[] = [];
  const fragments = new Map<string, DocumentFragment>();
  const requests = new Map<string, Promise<string>>();
  const readRecords = () => {
    records = Array.from(content.querySelectorAll<HTMLElement>('[data-listing-item]')).map(
      node => ({ node, meta: JSON.parse(requiredData(node, 'meta')) as ListingItem })
    );
  };
  readRecords();
  const menus = () => Array.from(root.querySelectorAll<HTMLElement>('[data-menu]'));
  const closeMenus = () => {
    menus().forEach(menu => {
      if (menu.matches(':popover-open')) menu.hidePopover();
    });
  };
  function positionMenu(menu: HTMLElement, trigger: HTMLElement) {
    const rect = trigger.getBoundingClientRect();
    menu.style.width = `${Math.min(Math.max(rect.width, 224), window.innerWidth - 24)}px`;
    menu.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 12))}px`;
    menu.style.top = `${Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - menu.offsetHeight - 12))}px`;
  }
  // Native popovers supply light dismissal; keyboard focus is managed below.
  for (const menu of menus())
    menu.addEventListener('toggle', () => {
      const open = menu.matches(':popover-open');
      const trigger = root.querySelector<HTMLElement>(`[data-menu-trigger="${menu.id}"]`);
      trigger?.setAttribute('aria-expanded', String(open));
      if (open && trigger) {
        positionMenu(menu, trigger);
        (
          menu.querySelector<HTMLInputElement>('input') ??
          menu.querySelector<HTMLElement>('[aria-selected="true"]') ??
          menu.querySelector<HTMLElement>('[role="option"], [role="menuitemcheckbox"]')
        )?.focus();
      }
    });
  function syncControls() {
    if (input.value !== state.q) input.value = state.q;
    const clearQuery = root.querySelector<HTMLElement>('[data-clear-query]');
    if (clearQuery) clearQuery.hidden = !state.q;
    const tags = state.tags.filter(Boolean);
    const active = [
      ...tags.map(value => ({ key: 'tag', value })),
      ...Object.entries(state.filters)
        .filter(([, v]) => v && v !== 'all')
        .map(([key, value]) => ({ key, value })),
    ];
    const summary = requiredElement<HTMLElement>(root, '[data-active-filters]');
    summary.hidden = !active.length || expanded;
    const chips = requiredElement<HTMLElement>(root, '[data-active-chips]');
    chips.replaceChildren(
      ...active.map(({ key, value }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'static-active-chip';
        button.dataset['removeKey'] = key;
        button.dataset['removeValue'] = value;
        button.textContent = `${key === 'tag' ? '' : `${key}: `}${value} ×`;
        button.setAttribute('aria-label', `Remove ${key} ${value}`);
        return button;
      })
    );
    const badge = requiredElement<HTMLElement>(root, '[data-active-count]');
    badge.hidden = !active.length;
    badge.textContent = String(active.length);
    const tagLabel = requiredElement<HTMLElement>(root, '[data-tag-label]');
    tagLabel.textContent = tags.join(', ') || 'Search tags';
    for (const select of root.querySelectorAll<HTMLElement>('[data-select]')) {
      const key = requiredData(select, 'select');
      const currentFilter = state.filters[key] ?? '';
      const value = key === 'sort' ? state.sort : currentFilter.length ? currentFilter : 'all';
      const options = Array.from(select.querySelectorAll<HTMLElement>('[data-value]'));
      for (const option of options)
        option.setAttribute('aria-selected', String(option.dataset['value'] === value));
      requiredElement<HTMLElement>(select, '[data-select-label]').textContent =
        (options.find(option => option.dataset['value'] === value) ?? options[0])?.textContent ??
        '';
    }
    for (const button of root.querySelectorAll<HTMLElement>('[data-tag]')) {
      button.setAttribute('aria-checked', String(tags.includes(requiredData(button, 'tag'))));
      button.hidden = !requiredData(button, 'tag').toLowerCase().includes(tagQuery.toLowerCase());
    }
    requiredElement<HTMLElement>(root, '[data-no-tags]').hidden = Boolean(
      root.querySelector('[data-tag]:not([hidden])')
    );
    for (const button of root.querySelectorAll<HTMLElement>('[data-locale]')) {
      const selected = button.dataset['locale'] === locale;
      button.classList.toggle('language-switcher__option--active-editorial', selected);
      button.classList.toggle('language-switcher__option--available-editorial', !selected);
      if (selected) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
  }
  function feature(node: HTMLElement, featured: boolean) {
    if (node.dataset['featured'] === String(featured)) return;
    node.dataset['featured'] = String(featured);
    const card = node.querySelector<HTMLElement>('.media-card');
    card?.classList.toggle('media-card--featured', featured);
    for (const row of node.querySelectorAll<HTMLElement>('[data-adaptive-overflow]')) {
      const total = Number(row.dataset['adaptiveOverflow']);
      const count = resolveVisibleItemCount(
        total,
        featured ? 4 : 3,
        Number(row.dataset['overflowMin'])
      );
      Array.from(row.querySelectorAll<HTMLElement>('[data-card-overflow-item]')).forEach(
        (item, index) => {
          item.hidden = index >= count;
        }
      );
      const overflow = requiredElement<HTMLElement>(row, '[data-card-overflow-more]');
      overflow.hidden = total === count;
      const button = overflow.querySelector('button');
      if (button) {
        button.textContent = `+${total - count} more`;
        button.setAttribute('aria-label', `Show all tags: ${total - count} more`);
      }
      row.classList.toggle('grid-cols-[minmax(0,1fr)_auto]', total > count);
      row.classList.toggle('grid-cols-[minmax(0,1fr)]', total === count);
      row.classList.toggle('gap-2', total > count);
      row.classList.toggle('gap-0', total === count);
    }
    if (blog) {
      card?.classList.toggle('blog-card--featured-essay', featured);
      node.classList.toggle('latest-blog__featured-item', featured);
      card
        ?.querySelector('.media-card__media')
        ?.classList.toggle('blog-card__media--featured-essay', featured);
      card
        ?.querySelector('.media-card__footer')
        ?.classList.toggle('blog-card__footer--editorial-note', featured);
    }
  }
  function render(writeUrl = true) {
    const matches = selectListing(
      records.map(record => record.meta),
      state,
      blog ? 1 : 2
    );
    const byId = new Map(records.map(record => [record.meta.id, record.node]));
    const selected = new Set(matches.map(item => item.id));
    const featuredList = requiredElement<HTMLElement>(content, '[data-featured-list]');
    const gridList = requiredElement<HTMLElement>(content, '[data-grid-list]');
    for (const { meta, node } of records) {
      const hidden = !selected.has(meta.id);
      if (node.hidden !== hidden) node.hidden = hidden;
      if (hidden && node.parentElement === featuredList) gridList.append(node);
    }
    // Move only nodes whose order or featured status actually changed.
    let previous: HTMLElement | null = null;
    matches.forEach((item, i) => {
      const node = byId.get(item.id);
      if (!node) return;
      const parent = i === 0 ? featuredList : gridList;
      const reference: ChildNode | null =
        i === 0 ? parent.firstChild : previous ? previous.nextSibling : parent.firstChild;
      if (node !== reference) parent.insertBefore(node, reference);
      feature(node, i === 0);
      if (i > 0) previous = node;
    });
    featuredList.hidden = !matches.length;
    requiredElement<HTMLElement>(root, '[data-listing-empty]').hidden = Boolean(matches.length);
    requiredElement<HTMLElement>(root, '[data-results-count]').textContent =
      `${matches.length} of ${records.length} ${state.q || state.tags.filter(Boolean).length || Object.values(state.filters).some(value => value && value !== 'all') ? 'matching' : 'total'} results`;
    syncControls();
    if (writeUrl)
      window.history.replaceState(
        window.history.state,
        '',
        listingUrl(new URL(window.location.href), state, blog, initialTags)
      );
  }
  function scheduleRender() {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = 0;
      render();
    });
  }
  function rebuildOptions() {
    const items = records.map(record => record.meta);
    const keys = Array.from(root.querySelectorAll<HTMLElement>('[data-select]'))
      .map(select => requiredData(select, 'select'))
      .filter(key => key !== 'sort');
    for (const [key, values] of Object.entries(listingOptions(items, keys))) {
      const menu = requiredElement<HTMLElement>(root, `[data-filter-key="${key}"]`);
      const first = menu.firstElementChild?.cloneNode(true);
      if (!first) continue;
      menu.replaceChildren(
        first,
        ...values.map(value => {
          const button = document.createElement('button');
          button.type = 'button';
          button.role = 'option';
          button.tabIndex = -1;
          button.dataset['value'] = value;
          button.className = 'static-listing-option';
          button.textContent = value;
          return button;
        })
      );
    }
    const counts = listingTagCounts(items);
    const holder = requiredElement<HTMLElement>(root, '[data-tag-options]');
    holder.replaceChildren(
      ...Object.keys(counts)
        .sort((a, b) => a.localeCompare(b))
        .map(tag => {
          const button = document.createElement('button');
          button.type = 'button';
          button.role = 'menuitemcheckbox';
          button.tabIndex = -1;
          button.dataset['tag'] = tag;
          button.className = 'editorial-tag-menu__item static-listing-option';
          const label = document.createElement('span');
          label.className = 'editorial-tag-menu__item-label';
          label.textContent = tag;
          const count = document.createElement('span');
          count.className = 'editorial-tag-menu__item-count';
          count.textContent = String(counts[tag]);
          button.append(label, count);
          return button;
        })
    );
  }
  async function changeLocale(next: 'en' | 'th') {
    const request = ++localeRequest;
    state.locale = next;
    if (next === locale) {
      requiredElement<HTMLElement>(root, '[data-locale-status]').hidden = true;
      setStoredBlogLocalePreference(next);
      render();
      return;
    }
    const status = requiredElement<HTMLElement>(root, '[data-locale-status]');
    status.hidden = false;
    status.textContent = 'Loading language…';
    try {
      let fragment = fragments.get(next);
      if (!fragment) {
        const url = requiredData(root, 'localeUrl');
        let pending = requests.get(url);
        if (!pending) {
          pending = fetch(url).then(response => {
            if (!response.ok) throw new Error('Language unavailable');
            return response.text();
          });
          requests.set(url, pending);
          pending.catch(() => requests.delete(url));
        }
        const html = await pending;
        const template = document.createElement('template');
        template.innerHTML = html;
        fragment = template.content;
      }
      if (request !== localeRequest) return;
      closeMenus();
      const current = document.createDocumentFragment();
      current.append(...Array.from(content.childNodes));
      fragments.set(locale, current);
      content.append(fragment);
      fragments.delete(next);
      locale = next;
      state.locale = next;
      readRecords();
      rebuildOptions();
      render();
      setStoredBlogLocalePreference(next);
      status.hidden = true;
    } catch {
      if (request !== localeRequest) return;
      state.locale = locale;
      status.textContent = 'Could not load this language. ';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Retry';
      retry.addEventListener('click', () => {
        void changeLocale(next);
      });
      status.append(retry);
      syncControls();
    }
  }
  function openDetails(node: HTMLElement) {
    const template = node.querySelector<HTMLTemplateElement>('[data-details-template]');
    if (!template || dialog.open) return;
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    requiredElement(dialog, '[data-dialog-content]').replaceChildren(
      template.content.cloneNode(true)
    );
    const title = dialog.querySelector<HTMLElement>('h3');
    if (title) {
      dialog.id = title.id || 'listing-item-details';
      title.id = 'listing-dialog-title';
      dialog.setAttribute('aria-labelledby', title.id);
    }
    dialogActive = true;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    node.querySelector('[aria-haspopup="dialog"]')?.setAttribute('aria-expanded', 'true');
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-close-details]')?.focus();
  }
  function restoreDialog() {
    if (!dialogActive) return;
    dialogActive = false;
    document.documentElement.style.overflow = previousOverflow;
    root.querySelectorAll('[aria-haspopup="dialog"]').forEach(el => {
      el.setAttribute('aria-expanded', 'false');
    });
    opener?.focus();
    opener = null;
    requiredElement(dialog, '[data-dialog-content]').replaceChildren();
  }
  function closeDetails() {
    if (!dialog.open) return;
    dialog.close();
    restoreDialog();
  }
  dialog.addEventListener('close', () => {
    // A queued close event must not clear a newly opened deep-linked item.
    if (!dialog.open) restoreDialog();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog || (event.target as Element).closest('[data-close-details]'))
      closeDetails();
  });
  root.addEventListener('input', event => {
    const target = event.target as HTMLInputElement;
    if (target === input) {
      state.q = target.value;
      scheduleRender();
    }
    if (target.matches('[data-tag-query]')) {
      tagQuery = target.value;
      syncControls();
    }
  });
  root.addEventListener('click', event => {
    const target = event.target as Element;
    const button = target.closest<HTMLElement>('button');
    if (button?.dataset['menuTrigger']) {
      const menu = requiredElement<HTMLElement>(root, `#${button.dataset['menuTrigger']}`);
      menu.togglePopover();
      return;
    }
    if (button?.matches('[data-toggle-filters]')) {
      expanded = !expanded;
      requiredElement<HTMLElement>(root, '[data-filter-panel]').hidden = !expanded;
      button.setAttribute('aria-expanded', String(expanded));
      syncControls();
      return;
    }
    if (button?.matches('[data-clear-query]')) {
      state.q = '';
      render();
      input.focus();
      return;
    }
    if (button?.matches('[data-clear-all]')) {
      state.q = '';
      state.tags = [];
      state.filters = {};
      render();
      return;
    }
    if (button?.matches('[data-clear-tags]')) {
      state.tags = [];
      render();
      return;
    }
    if (button?.dataset['removeKey']) {
      const key = button.dataset['removeKey'];
      if (key === 'tag')
        state.tags = state.tags.filter(tag => tag !== button.dataset['removeValue']);
      else delete state.filters[key];
      render();
      return;
    }
    if (button?.dataset['value']) {
      const menu = button.closest<HTMLElement>('[data-filter-key]');
      if (!menu) return;
      const key = requiredData(menu, 'filterKey');
      if (key === 'sort') state.sort = button.dataset['value'];
      else state.filters[key] = button.dataset['value'];
      menu.hidePopover();
      root.querySelector<HTMLElement>(`[data-menu-trigger="${menu.id}"]`)?.focus();
      render();
      return;
    }
    if (button?.dataset['tag']) {
      const tag = button.dataset['tag'];
      state.tags = state.tags.includes(tag)
        ? state.tags.filter(t => t !== tag)
        : [...state.tags.filter(Boolean), tag];
      render();
      return;
    }
    if (button?.dataset['locale']) {
      void changeLocale(button.dataset['locale'] === 'th' ? 'th' : 'en');
      return;
    }
    const detailsTrigger = target.closest('[data-details-trigger]');
    if (detailsTrigger) {
      event.preventDefault();
      const node = detailsTrigger.closest<HTMLElement>('[data-listing-item]');
      if (node) openDetails(node);
      return;
    }
    if (target.closest('a, [data-menu], [data-listing-toolbar], dialog')) return;
    const card = target.closest<HTMLElement>('[data-listing-item]');
    if (card && (button || target.closest('[aria-haspopup="dialog"]'))) openDetails(card);
  });
  let typeahead = '';
  let typedAt = 0;
  root.addEventListener('keydown', event => {
    const target = event.target as HTMLElement;
    const menu = target.closest<HTMLElement>('[data-menu]');
    if (menu) {
      if (event.key === 'Escape') {
        event.preventDefault();
        menu.hidePopover();
        root.querySelector<HTMLElement>(`[data-menu-trigger="${menu.id}"]`)?.focus();
        return;
      }
      if (event.key === 'Tab') {
        menu.hidePopover();
        root.querySelector<HTMLElement>(`[data-menu-trigger="${menu.id}"]`)?.focus();
        return;
      }
      const options = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="option"], [role="menuitemcheckbox"]')
      ).filter(option => !option.hidden);
      const index = options.indexOf(target);
      let next: HTMLElement | undefined;
      if (event.key === 'ArrowDown') next = options[(index + 1) % options.length];
      if (event.key === 'ArrowUp')
        next =
          options[index < 0 ? options.length - 1 : (index - 1 + options.length) % options.length];
      if (event.key === 'Home' && target.tagName !== 'INPUT') next = options[0];
      if (event.key === 'End' && target.tagName !== 'INPUT') next = options[options.length - 1];
      if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        target.tagName !== 'INPUT' &&
        event.key !== ' '
      ) {
        const now = Date.now();
        typeahead = (now - typedAt > 700 ? '' : typeahead) + event.key.toLowerCase();
        typedAt = now;
        next = options.find(option =>
          option.textContent?.trim().toLowerCase().startsWith(typeahead)
        );
      }
      if (next) {
        event.preventDefault();
        next.focus();
      }
      return;
    }
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && target.dataset['menuTrigger']) {
      event.preventDefault();
      root.querySelector<HTMLElement>(`#${target.dataset['menuTrigger']}`)?.showPopover();
      return;
    }
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      target.matches('[aria-haspopup="dialog"]')
    ) {
      event.preventDefault();
      const node = target.closest<HTMLElement>('[data-listing-item]');
      if (node) openDetails(node);
    }
  });
  function revealHash() {
    let id: string;
    try {
      id = listingHashTarget(decodeURIComponent(window.location.hash.slice(1)));
    } catch {
      return;
    }
    const record = records.find(record => record.meta.id === id);
    if (!record) return;
    if (dialog.open) closeDetails();
    if (record.node.hidden) {
      state.q = '';
      state.tags = [];
      state.filters = {};
      render(false);
    }
    record.node.scrollIntoView({
      block: 'nearest',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    if (root.dataset['kind'] === 'publications') openDetails(record.node);
  }
  window.addEventListener(SEARCH_OPEN_EVENT, closeDetails);
  window.addEventListener('popstate', () => {
    state = readListingState(new URL(window.location.href), initialTags);
    if (blog && state.locale !== locale) void changeLocale(state.locale).then(revealHash);
    else {
      render(false);
      revealHash();
    }
  });
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('resize', closeMenus, { passive: true });
  window.addEventListener('scroll', closeMenus, { passive: true });
  // Avoid beforeunload listeners so browser back/forward caching remains available.
  window.addEventListener('pagehide', () => {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    if (dialog.open) closeDetails();
    closeMenus();
  });
  render(false);
  revealHash();
  if (blog) {
    const preferred = resolveBlogLocalePreference({
      searchParams: new URLSearchParams(window.location.search),
      storedLocale: getStoredBlogLocalePreference(),
    });
    if (preferred !== locale) void changeLocale(preferred);
    else setStoredBlogLocalePreference(locale);
  }
}
for (const root of document.querySelectorAll<HTMLElement>('[data-static-listing]'))
  initListing(root);
