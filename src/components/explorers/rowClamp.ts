import { useLayoutEffect, type RefObject } from 'react';

export interface RowClampTarget {
  readonly top: number;
  readonly naturalLineCount: number;
}

export function resolveRowClampLineCounts(targets: readonly RowClampTarget[], tolerance = 2) {
  const resolved = new Array<number>(targets.length);
  let rowStart = 0;

  while (rowStart < targets.length) {
    const rowTop = targets[rowStart]?.top ?? 0;
    let rowEnd = rowStart + 1;

    while (
      rowEnd < targets.length &&
      Math.abs((targets[rowEnd]?.top ?? rowTop) - rowTop) <= tolerance
    ) {
      rowEnd += 1;
    }

    const shortest = Math.min(
      ...targets.slice(rowStart, rowEnd).map(item => item.naturalLineCount)
    );
    for (let index = rowStart; index < rowEnd; index += 1) {
      resolved[index] = shortest;
    }

    rowStart = rowEnd;
  }

  return resolved;
}

function getNaturalLineCount(element: HTMLElement) {
  const styles = window.getComputedStyle(element);
  const lineHeight =
    Number.parseFloat(styles.lineHeight) || Number.parseFloat(styles.fontSize || '16') * 1.5;

  return Math.max(1, Math.round(element.scrollHeight / lineHeight));
}

function resetDescriptionClamp(element: HTMLElement) {
  element.style.removeProperty('display');
  element.style.removeProperty('-webkit-box-orient');
  element.style.removeProperty('-webkit-line-clamp');
  element.style.removeProperty('overflow');
}

function applyDescriptionClamp(element: HTMLElement, lineCount: number) {
  element.style.display = '-webkit-box';
  element.style.setProperty('-webkit-box-orient', 'vertical');
  element.style.setProperty('-webkit-line-clamp', String(lineCount));
  element.style.overflow = 'hidden';
}

export function useRowDescriptionClamp(
  rootRef: RefObject<HTMLElement | null>,
  dependencyKey: string
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return undefined;

    let frame = 0;
    let cancelled = false;

    const clamp = () => {
      if (cancelled) return;
      const descriptions = Array.from(
        root.querySelectorAll<HTMLElement>('[data-card-description]')
      );

      descriptions.forEach(resetDescriptionClamp);

      const targets = descriptions.map(element => {
        const rowElement = element.closest<HTMLElement>('li') ?? element;
        return {
          top: rowElement.getBoundingClientRect().top,
          naturalLineCount: getNaturalLineCount(element),
        };
      });
      const lineCounts = resolveRowClampLineCounts(targets);

      descriptions.forEach((element, index) => {
        applyDescriptionClamp(element, lineCounts[index] ?? targets[index]?.naturalLineCount ?? 1);
      });
    };

    const scheduleClamp = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(clamp);
    };

    scheduleClamp();
    void document.fonts?.ready.then(scheduleClamp);

    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            scheduleClamp();
          });

    if (observer) observer.observe(root);
    window.addEventListener('resize', scheduleClamp);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', scheduleClamp);
    };
  }, [dependencyKey, rootRef]);
}
