const LABEL_GAP = 14;
const VIEWPORT_MARGIN = 16;

declare global {
  interface Window {
    __homeHeroAspectLabelsInitialized?: boolean;
  }
}

function chooseLabelSide(starRect: DOMRect, labelRect: DOMRect) {
  const starCenterX = starRect.left + starRect.width / 2;
  const starCenterY = starRect.top + starRect.height / 2;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const hasRoomRight = starCenterX + LABEL_GAP + labelRect.width <= viewportWidth - VIEWPORT_MARGIN;
  const hasRoomLeft = starCenterX - LABEL_GAP - labelRect.width >= VIEWPORT_MARGIN;
  const hasRoomBelow =
    starCenterY + LABEL_GAP + labelRect.height <= viewportHeight - VIEWPORT_MARGIN;
  const hasRoomAbove = starCenterY - LABEL_GAP - labelRect.height >= VIEWPORT_MARGIN;

  const inline =
    hasRoomRight && (!hasRoomLeft || starCenterX < viewportWidth / 2)
      ? 'right'
      : hasRoomLeft
        ? 'left'
        : 'right';
  const block =
    hasRoomBelow && (!hasRoomAbove || starCenterY < viewportHeight / 2)
      ? 'bottom'
      : hasRoomAbove
        ? 'top'
        : 'bottom';

  return { inline, block };
}

function placeAspectLabel(star: HTMLElement) {
  const label = star.querySelector<HTMLElement>('.hero-aspect-star__label');

  if (!label) {
    return;
  }

  const starRect = star.getBoundingClientRect();
  const labelRect = label.getBoundingClientRect();
  const { inline, block } = chooseLabelSide(starRect, labelRect);

  star.dataset['labelInline'] = inline;
  star.dataset['labelBlock'] = block;
  star.style.setProperty(
    '--label-shift-x',
    inline === 'right' ? `${LABEL_GAP}px` : `calc(-100% - ${LABEL_GAP}px)`
  );
  star.style.setProperty(
    '--label-shift-y',
    block === 'bottom' ? `${LABEL_GAP}px` : `calc(-100% - ${LABEL_GAP}px)`
  );
  star.style.setProperty('--label-origin-x', inline === 'right' ? '0%' : '100%');
  star.style.setProperty('--label-origin-y', block === 'bottom' ? '0%' : '100%');
}

function initAspectLabelPlacement() {
  if (window.__homeHeroAspectLabelsInitialized) {
    return;
  }

  window.__homeHeroAspectLabelsInitialized = true;

  document.querySelectorAll<HTMLElement>('.hero-aspect-star').forEach(star => {
    star.addEventListener('pointerenter', () => {
      placeAspectLabel(star);
    });
    star.addEventListener('focusin', () => {
      placeAspectLabel(star);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAspectLabelPlacement, { once: true });
} else {
  initAspectLabelPlacement();
}

export {};
