export function getCardAccentTint(intensity: number) {
  return `color-mix(in oklab, var(--card-accent) ${intensity}%, transparent)`;
}
