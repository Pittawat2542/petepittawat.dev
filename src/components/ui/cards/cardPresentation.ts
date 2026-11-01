import { resolveVisibleItemCount } from './cardOverflow';

/** Shared by build-rendered cards and their browser presentation updates. */
export const featuredClasses = {
  card: 'media-card--featured',
  blogCard: 'blog-card--featured-essay',
  blogItem: 'latest-blog__featured-item',
  blogMedia: 'blog-card__media--featured-essay',
  blogFooter: 'blog-card__footer--editorial-note',
} as const;

export function updateCardPresentation(node: HTMLElement, featured: boolean) {
  if (node.dataset['featured'] === String(featured)) return;
  node.dataset['featured'] = String(featured);
  const card = node.querySelector<HTMLElement>('.media-card');
  card?.classList.toggle(featuredClasses.card, featured);
  for (const row of node.querySelectorAll<HTMLElement>('[data-adaptive-overflow]')) {
    const total = Number(row.dataset['adaptiveOverflow']);
    const limit = Number(row.dataset[featured ? 'overflowFeaturedMax' : 'overflowMax']);
    const count = resolveVisibleItemCount(total, limit, Number(row.dataset['overflowMin']));
    Array.from(row.querySelectorAll<HTMLElement>('[data-card-overflow-item]')).forEach(
      (item, index) => {
        item.hidden = index >= count;
      }
    );
    const overflow = row.querySelector<HTMLElement>('[data-card-overflow-more]');
    if (overflow) {
      overflow.hidden = total === count;
      const button = overflow.querySelector('button');
      if (button) {
        button.textContent = `+${total - count} more`;
        button.setAttribute('aria-label', `${row.dataset['overflowLabel']}: ${total - count} more`);
      }
    }
    row.classList.toggle('grid-cols-[minmax(0,1fr)_auto]', total > count);
    row.classList.toggle('grid-cols-[minmax(0,1fr)]', total === count);
    row.classList.toggle('gap-2', total > count);
    row.classList.toggle('gap-0', total === count);
  }
  if (card?.classList.contains('blog-card')) {
    card.classList.toggle(featuredClasses.blogCard, featured);
    node.classList.toggle(featuredClasses.blogItem, featured);
    card.querySelector('.media-card__media')?.classList.toggle(featuredClasses.blogMedia, featured);
    card
      .querySelector('.media-card__footer')
      ?.classList.toggle(featuredClasses.blogFooter, featured);
  }
}
