export function resolveVisibleItemCount(total: number, maxVisible?: number, minVisible = 1) {
  const maxCount = Math.min(total, maxVisible ?? total);
  const floorCount = Math.min(maxCount, Math.max(0, Math.min(minVisible, total)));

  return total > maxCount ? Math.max(floorCount, maxCount - 1) : maxCount;
}
