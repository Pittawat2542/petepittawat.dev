import type { BlogCoverMotif, BlogCoverViewport } from './index.ts';

export type BlogCoverDecorationFamily = 'ambient' | 'scatter' | 'motif';
export type BlogCoverDecorationKind = 'circle' | 'ellipse' | 'line' | 'path' | 'rect';
export type BlogCoverDecorationTone =
  | 'accent'
  | 'accentSoft'
  | 'accentStrong'
  | 'accentContrast'
  | 'chipBorder'
  | 'gridColor'
  | 'spotPrimary'
  | 'spotSecondary'
  | 'white';

export interface BlogCoverDecorationBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface BlogCoverDecorationArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BlogCoverDecorationBaseLayer {
  id: string;
  family: BlogCoverDecorationFamily;
  kind: BlogCoverDecorationKind;
  bounds: BlogCoverDecorationBounds;
  fillTone?: BlogCoverDecorationTone | undefined;
  fillOpacity?: number | undefined;
  strokeTone?: BlogCoverDecorationTone | undefined;
  strokeOpacity?: number | undefined;
  strokeWidth?: number | undefined;
  blur?: number | undefined;
  rotation?: number | undefined;
}

export interface BlogCoverDecorationCircleLayer extends BlogCoverDecorationBaseLayer {
  kind: 'circle';
  cx: number;
  cy: number;
  r: number;
}

export interface BlogCoverDecorationEllipseLayer extends BlogCoverDecorationBaseLayer {
  kind: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface BlogCoverDecorationRectLayer extends BlogCoverDecorationBaseLayer {
  kind: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export interface BlogCoverDecorationLineLayer extends BlogCoverDecorationBaseLayer {
  kind: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface BlogCoverDecorationPathLayer extends BlogCoverDecorationBaseLayer {
  kind: 'path';
  d: string;
}

export type BlogCoverDecorationLayer =
  | BlogCoverDecorationCircleLayer
  | BlogCoverDecorationEllipseLayer
  | BlogCoverDecorationLineLayer
  | BlogCoverDecorationPathLayer
  | BlogCoverDecorationRectLayer;

export interface BlogCoverDecorationSpec {
  motif: BlogCoverMotif;
  patternId: string;
  viewport: BlogCoverViewport;
  safeArea: BlogCoverDecorationArea;
  focusArea: BlogCoverDecorationArea;
  layers: readonly BlogCoverDecorationLayer[];
}

interface DecorationParams {
  seed: number;
  motif: BlogCoverMotif;
  density: number;
  viewport: BlogCoverViewport;
}

type Rng = () => number;

interface DecorationBuildContext {
  density: number;
  focusArea: BlogCoverDecorationArea;
  patternId: string;
  random: Rng;
  scale: number;
  seed: number;
  viewport: BlogCoverViewport;
}

const motifPatterns: Record<BlogCoverMotif, readonly string[]> = {
  orbit: ['rings', 'arc-cluster', 'satellite-field'],
  grid: ['window', 'offset-lattice', 'matrix'],
  beam: ['fan', 'crossfade', 'pulse-column'],
  stack: ['plates', 'steps', 'anchor'],
  wave: ['echo', 'ribbon', 'swell'],
  halo: ['core', 'split', 'satellite'],
};

export function getBlogCoverDecorationSpec(params: DecorationParams): BlogCoverDecorationSpec {
  const viewport = params.viewport;
  const safeArea = getSafeArea(viewport);
  const focusArea = getFocusArea(viewport, safeArea);
  const scale = getVariantScale(viewport.variant);
  const random = createPrng(params.seed ^ hashToUint32(`${params.motif}:${viewport.variant}`));
  const patterns = motifPatterns[params.motif];
  const patternId = patterns[Math.floor(random() * patterns.length)] ?? patterns[0] ?? 'default';
  const context: DecorationBuildContext = {
    density: clamp(params.density, 0.5, 1),
    focusArea,
    patternId,
    random,
    scale,
    seed: params.seed,
    viewport,
  };

  const layers = [
    ...buildAmbientLayers(context),
    ...buildScatterLayers(context),
    ...buildMotifLayers(params.motif, context),
  ].map(layer => clampLayerBounds(layer, viewport));

  return {
    motif: params.motif,
    patternId,
    viewport,
    safeArea,
    focusArea,
    layers,
  };
}

function getSafeArea(viewport: BlogCoverViewport): BlogCoverDecorationArea {
  const xRatio = viewport.variant === 'hero' ? 0.56 : viewport.variant === 'card' ? 0.54 : 0.57;
  return {
    x: viewport.width * xRatio,
    y: viewport.height * 0.08,
    width: viewport.width * (1 - xRatio) - viewport.width * 0.04,
    height: viewport.height * 0.78,
  };
}

function getFocusArea(
  viewport: BlogCoverViewport,
  safeArea: BlogCoverDecorationArea
): BlogCoverDecorationArea {
  const insetX = viewport.width * 0.035;
  return {
    x: safeArea.x + insetX,
    y: viewport.height * 0.1,
    width: viewport.width - safeArea.x - insetX - viewport.width * 0.045,
    height: viewport.height * 0.72,
  };
}

function getVariantScale(variant: BlogCoverViewport['variant']) {
  switch (variant) {
    case 'card':
      return 0.78;
    case 'og':
      return 0.94;
    case 'hero':
    default:
      return 1;
  }
}

function buildAmbientLayers(context: DecorationBuildContext) {
  const { random, scale, viewport } = context;

  return [
    ellipseLayer({
      id: 'ambient-left-glow',
      family: 'ambient',
      cx: viewport.width * (0.12 + random() * 0.05),
      cy: viewport.height * (0.14 + random() * 0.05),
      rx: viewport.width * 0.12 * scale,
      ry: viewport.height * 0.18 * scale,
      fillTone: 'spotPrimary',
      fillOpacity: 0.28,
      blur: 52 * scale,
    }),
    ellipseLayer({
      id: 'ambient-lower-glow',
      family: 'ambient',
      cx: viewport.width * (0.82 + random() * 0.06),
      cy: viewport.height * (0.78 - random() * 0.08),
      rx: viewport.width * 0.14 * scale,
      ry: viewport.height * 0.2 * scale,
      fillTone: random() > 0.5 ? 'accentSoft' : 'spotSecondary',
      fillOpacity: 0.2,
      blur: 44 * scale,
    }),
  ] satisfies readonly BlogCoverDecorationLayer[];
}

function buildScatterLayers(context: DecorationBuildContext) {
  const { density, focusArea, random, scale, viewport } = context;
  const count = Math.max(4, Math.min(9, Math.round(4 + density * 4)));
  const layers: BlogCoverDecorationLayer[] = [];

  for (let index = 0; index < count; index += 1) {
    const size = viewport.width * range(random, 0.007, 0.017) * scale;
    const x = range(random, focusArea.x + size, focusArea.x + focusArea.width - size);
    const y = range(random, focusArea.y + size, focusArea.y + focusArea.height - size);
    const isOrb = random() > 0.35;
    const tone = index % 2 === 0 ? 'accentSoft' : 'spotPrimary';

    if (isOrb) {
      layers.push(
        circleLayer({
          id: `scatter-orb-${index}`,
          family: 'scatter',
          cx: x,
          cy: y,
          r: size,
          fillTone: tone,
          fillOpacity: range(random, 0.14, 0.28),
          blur: range(random, 10, 22) * scale,
        })
      );
    } else {
      layers.push(
        rectLayer({
          id: `scatter-plate-${index}`,
          family: 'scatter',
          x: x - size,
          y: y - size * range(random, 0.7, 1.15),
          width: size * range(random, 1.6, 2.4),
          height: size * range(random, 1.2, 1.9),
          radius: size * 0.72,
          rotation: range(random, -22, 22),
          fillTone: tone,
          fillOpacity: range(random, 0.08, 0.18),
          strokeTone: 'chipBorder',
          strokeOpacity: range(random, 0.14, 0.3),
          strokeWidth: 1,
          blur: range(random, 6, 18) * scale,
        })
      );
    }
  }

  return layers;
}

function buildMotifLayers(motif: BlogCoverMotif, context: DecorationBuildContext) {
  switch (motif) {
    case 'grid':
      return buildGridMotifLayers(context);
    case 'beam':
      return buildBeamMotifLayers(context);
    case 'stack':
      return buildStackMotifLayers(context);
    case 'wave':
      return buildWaveMotifLayers(context);
    case 'halo':
      return buildHaloMotifLayers(context);
    case 'orbit':
    default:
      return buildOrbitMotifLayers(context);
  }
}

function buildOrbitMotifLayers(context: DecorationBuildContext) {
  const { focusArea, patternId, random, scale, viewport } = context;
  const cx = focusArea.x + focusArea.width * range(random, 0.58, 0.72);
  const cy = focusArea.y + focusArea.height * range(random, 0.36, 0.54);

  if (patternId === 'arc-cluster') {
    return [
      arcLayer({
        id: 'orbit-arc-a',
        family: 'motif',
        cx,
        cy,
        rx: viewport.width * 0.13 * scale,
        ry: viewport.height * 0.16 * scale,
        startAngle: 0.28,
        endAngle: 2.7,
        strokeTone: 'chipBorder',
        strokeOpacity: 0.56,
        strokeWidth: 1.8,
      }),
      arcLayer({
        id: 'orbit-arc-b',
        family: 'motif',
        cx,
        cy,
        rx: viewport.width * 0.17 * scale,
        ry: viewport.height * 0.22 * scale,
        startAngle: 3.4,
        endAngle: 5.85,
        strokeTone: 'accentSoft',
        strokeOpacity: 0.42,
        strokeWidth: 2,
      }),
      ellipseLayer({
        id: 'orbit-core',
        family: 'motif',
        cx: cx - viewport.width * 0.015,
        cy: cy + viewport.height * 0.02,
        rx: viewport.width * 0.045 * scale,
        ry: viewport.height * 0.07 * scale,
        fillTone: 'spotPrimary',
        fillOpacity: 0.22,
        blur: 24 * scale,
      }),
      ...buildSatelliteNodes(context, cx, cy, 6, 0.09, 0.16),
    ];
  }

  if (patternId === 'satellite-field') {
    return [
      ellipseLayer({
        id: 'orbit-ring-a',
        family: 'motif',
        cx,
        cy,
        rx: viewport.width * 0.16 * scale,
        ry: viewport.height * 0.2 * scale,
        strokeTone: 'chipBorder',
        strokeOpacity: 0.42,
        strokeWidth: 1.4,
      }),
      ellipseLayer({
        id: 'orbit-ring-b',
        family: 'motif',
        cx: cx + viewport.width * 0.02,
        cy,
        rx: viewport.width * 0.23 * scale,
        ry: viewport.height * 0.27 * scale,
        strokeTone: 'gridColor',
        strokeOpacity: 0.24,
        strokeWidth: 1.2,
      }),
      ellipseLayer({
        id: 'orbit-field-glow',
        family: 'motif',
        cx: cx + viewport.width * 0.05,
        cy: cy + viewport.height * 0.03,
        rx: viewport.width * 0.08 * scale,
        ry: viewport.height * 0.12 * scale,
        fillTone: 'accent',
        fillOpacity: 0.16,
        blur: 32 * scale,
      }),
      ...buildSatelliteNodes(context, cx, cy, 8, 0.1, 0.21),
    ];
  }

  return [
    ellipseLayer({
      id: 'orbit-rings-a',
      family: 'motif',
      cx,
      cy,
      rx: viewport.width * 0.12 * scale,
      ry: viewport.height * 0.15 * scale,
      strokeTone: 'accentSoft',
      strokeOpacity: 0.4,
      strokeWidth: 1.6,
    }),
    ellipseLayer({
      id: 'orbit-rings-b',
      family: 'motif',
      cx,
      cy,
      rx: viewport.width * 0.17 * scale,
      ry: viewport.height * 0.2 * scale,
      strokeTone: 'chipBorder',
      strokeOpacity: 0.34,
      strokeWidth: 1.4,
    }),
    ellipseLayer({
      id: 'orbit-rings-c',
      family: 'motif',
      cx,
      cy,
      rx: viewport.width * 0.22 * scale,
      ry: viewport.height * 0.25 * scale,
      strokeTone: 'gridColor',
      strokeOpacity: 0.2,
      strokeWidth: 1.2,
    }),
    ...buildSatelliteNodes(context, cx, cy, 5, 0.08, 0.18),
  ];
}

function buildGridMotifLayers(context: DecorationBuildContext) {
  const { focusArea, patternId, random, scale, viewport } = context;
  const baseX = focusArea.x + focusArea.width * 0.06;
  const baseY = focusArea.y + focusArea.height * 0.08;
  const gridWidth = focusArea.width * 0.86;
  const gridHeight = focusArea.height * 0.72;

  if (patternId === 'matrix') {
    const dots: BlogCoverDecorationLayer[] = [];
    const columns = 5;
    const rows = 4;
    for (let col = 0; col < columns; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const cx = baseX + (gridWidth / (columns - 1)) * col;
        const cy = baseY + (gridHeight / (rows - 1)) * row;
        dots.push(
          circleLayer({
            id: `grid-dot-${col}-${row}`,
            family: 'motif',
            cx,
            cy,
            r: viewport.width * range(random, 0.005, 0.01) * scale,
            fillTone: (col + row) % 3 === 0 ? 'accentSoft' : 'chipBorder',
            fillOpacity: (col + row) % 3 === 0 ? 0.58 : 0.34,
            blur: (col + row) % 3 === 0 ? 6 * scale : undefined,
          })
        );
      }
    }

    return [
      rectLayer({
        id: 'grid-matrix-frame',
        family: 'motif',
        x: baseX - viewport.width * 0.02,
        y: baseY - viewport.height * 0.03,
        width: gridWidth * 0.74,
        height: gridHeight * 0.78,
        radius: 18 * scale,
        strokeTone: 'chipBorder',
        strokeOpacity: 0.34,
        strokeWidth: 1.2,
        fillTone: 'spotPrimary',
        fillOpacity: 0.12,
      }),
      ...dots,
    ];
  }

  if (patternId === 'offset-lattice') {
    const layers: BlogCoverDecorationLayer[] = [];
    const columns = 4;
    const rows = 4;
    for (let col = 0; col <= columns; col += 1) {
      const x = baseX + (gridWidth / columns) * col + (col % 2 === 0 ? 0 : viewport.width * 0.012);
      layers.push(
        lineLayer({
          id: `grid-vertical-${col}`,
          family: 'motif',
          x1: x,
          y1: baseY,
          x2: x,
          y2: baseY + gridHeight,
          strokeTone: 'gridColor',
          strokeOpacity: 0.6,
          strokeWidth: 1,
        })
      );
    }
    for (let row = 0; row <= rows; row += 1) {
      const y = baseY + (gridHeight / rows) * row;
      layers.push(
        lineLayer({
          id: `grid-horizontal-${row}`,
          family: 'motif',
          x1: baseX,
          y1: y,
          x2: baseX + gridWidth,
          y2: y,
          strokeTone: row % 2 === 0 ? 'chipBorder' : 'gridColor',
          strokeOpacity: 0.34,
          strokeWidth: row % 2 === 0 ? 1.1 : 0.9,
        })
      );
    }
    layers.push(
      rectLayer({
        id: 'grid-highlight-pane',
        family: 'motif',
        x: baseX + gridWidth * 0.18,
        y: baseY + gridHeight * 0.18,
        width: gridWidth * 0.34,
        height: gridHeight * 0.28,
        radius: 16 * scale,
        fillTone: 'spotPrimary',
        fillOpacity: 0.18,
        strokeTone: 'accentSoft',
        strokeOpacity: 0.36,
        strokeWidth: 1.1,
      })
    );
    return layers;
  }

  return [
    rectLayer({
      id: 'grid-window-outer',
      family: 'motif',
      x: baseX,
      y: baseY,
      width: gridWidth * 0.76,
      height: gridHeight * 0.72,
      radius: 22 * scale,
      strokeTone: 'chipBorder',
      strokeOpacity: 0.36,
      strokeWidth: 1.2,
      fillTone: 'spotPrimary',
      fillOpacity: 0.12,
    }),
    rectLayer({
      id: 'grid-window-inner-a',
      family: 'motif',
      x: baseX + gridWidth * 0.08,
      y: baseY + gridHeight * 0.1,
      width: gridWidth * 0.28,
      height: gridHeight * 0.2,
      radius: 16 * scale,
      fillTone: 'accentSoft',
      fillOpacity: 0.16,
    }),
    rectLayer({
      id: 'grid-window-inner-b',
      family: 'motif',
      x: baseX + gridWidth * 0.42,
      y: baseY + gridHeight * 0.37,
      width: gridWidth * 0.22,
      height: gridHeight * 0.16,
      radius: 14 * scale,
      fillTone: 'spotSecondary',
      fillOpacity: 0.18,
    }),
  ];
}

function buildBeamMotifLayers(context: DecorationBuildContext) {
  const { focusArea, patternId, random, scale, viewport } = context;
  const startX = focusArea.x + focusArea.width * 0.14;
  const topY = focusArea.y - viewport.height * 0.02;
  const beamHeight = focusArea.height * 1.02;

  if (patternId === 'crossfade') {
    return Array.from({ length: 4 }, (_, index) =>
      rectLayer({
        id: `beam-crossfade-${index}`,
        family: 'motif',
        x: startX + viewport.width * 0.045 * index,
        y: topY + viewport.height * 0.02 * index,
        width: viewport.width * range(random, 0.024, 0.048) * scale,
        height: beamHeight - viewport.height * 0.04 * index,
        radius: 999,
        rotation: 10 + index * 5,
        fillTone: index % 2 === 0 ? 'accent' : 'accentSoft',
        fillOpacity: 0.18 + index * 0.05,
        blur: 22 * scale,
      })
    );
  }

  if (patternId === 'pulse-column') {
    return [
      ...Array.from({ length: 3 }, (_, index) =>
        rectLayer({
          id: `beam-pulse-${index}`,
          family: 'motif',
          x: startX + viewport.width * 0.055 * index,
          y: topY,
          width: viewport.width * 0.032 * scale,
          height: beamHeight,
          radius: 999,
          rotation: 8 + index * 4,
          fillTone: index === 1 ? 'accentSoft' : 'accent',
          fillOpacity: 0.18 + index * 0.06,
          blur: 18 * scale,
        })
      ),
      ...Array.from({ length: 5 }, (_, index) =>
        circleLayer({
          id: `beam-node-${index}`,
          family: 'motif',
          cx: startX + viewport.width * (0.03 + index * 0.04),
          cy: focusArea.y + focusArea.height * (0.18 + index * 0.12),
          r: viewport.width * (0.007 + (index % 2) * 0.004) * scale,
          fillTone: 'accentContrast',
          fillOpacity: 0.5 - index * 0.05,
        })
      ),
    ];
  }

  return Array.from({ length: 5 }, (_, index) =>
    rectLayer({
      id: `beam-fan-${index}`,
      family: 'motif',
      x: startX + viewport.width * 0.042 * index,
      y: topY + viewport.height * 0.01 * index,
      width: viewport.width * range(random, 0.024, 0.042) * scale,
      height: beamHeight - viewport.height * 0.03 * index,
      radius: 999,
      rotation: 7 + index * 4,
      fillTone: index % 2 === 0 ? 'accent' : 'accentSoft',
      fillOpacity: 0.16 + index * 0.05,
      blur: 18 * scale,
    })
  );
}

function buildStackMotifLayers(context: DecorationBuildContext) {
  const { focusArea, patternId, scale, viewport } = context;
  const baseX = focusArea.x + focusArea.width * 0.12;
  const baseY = focusArea.y + focusArea.height * 0.18;

  if (patternId === 'steps') {
    return Array.from({ length: 5 }, (_, index) =>
      rectLayer({
        id: `stack-step-${index}`,
        family: 'motif',
        x: baseX + viewport.width * 0.015 * index,
        y: baseY + viewport.height * 0.055 * index,
        width: viewport.width * (0.12 + index * 0.012) * scale,
        height: viewport.height * 0.085 * scale,
        radius: 18 * scale,
        fillTone: index % 2 === 0 ? 'spotPrimary' : 'spotSecondary',
        fillOpacity: 0.18 + index * 0.02,
        strokeTone: 'chipBorder',
        strokeOpacity: 0.22 + index * 0.03,
        strokeWidth: 1.1,
      })
    );
  }

  if (patternId === 'anchor') {
    return [
      ...Array.from({ length: 4 }, (_, index) =>
        rectLayer({
          id: `stack-anchor-${index}`,
          family: 'motif',
          x: baseX + viewport.width * 0.018 * index,
          y: baseY + viewport.height * 0.066 * index,
          width: viewport.width * (0.14 - index * 0.01) * scale,
          height: viewport.height * 0.08 * scale,
          radius: 18 * scale,
          fillTone: index % 2 === 0 ? 'accentSoft' : 'spotPrimary',
          fillOpacity: 0.16 + index * 0.025,
          strokeTone: 'chipBorder',
          strokeOpacity: 0.26,
          strokeWidth: 1,
        })
      ),
      circleLayer({
        id: 'stack-anchor-core',
        family: 'motif',
        cx: baseX + viewport.width * 0.18,
        cy: baseY + viewport.height * 0.08,
        r: viewport.width * 0.018 * scale,
        fillTone: 'accent',
        fillOpacity: 0.48,
        blur: 10 * scale,
      }),
    ];
  }

  return Array.from({ length: 5 }, (_, index) =>
    rectLayer({
      id: `stack-plate-${index}`,
      family: 'motif',
      x: baseX + viewport.width * 0.012 * index,
      y: baseY + viewport.height * 0.064 * index,
      width: viewport.width * (0.135 - index * 0.006) * scale,
      height: viewport.height * (0.09 - index * 0.004) * scale,
      radius: 18 * scale,
      fillTone: index % 2 === 0 ? 'spotPrimary' : 'accentSoft',
      fillOpacity: 0.15 + index * 0.025,
      strokeTone: 'chipBorder',
      strokeOpacity: 0.24,
      strokeWidth: 1,
    })
  );
}

function buildWaveMotifLayers(context: DecorationBuildContext) {
  const { focusArea, patternId, random, scale, viewport } = context;
  const startX = focusArea.x;
  const endX = focusArea.x + focusArea.width;

  if (patternId === 'ribbon') {
    return Array.from({ length: 3 }, (_, index) =>
      cubicPathLayer({
        id: `wave-ribbon-${index}`,
        family: 'motif',
        points: [
          [startX, focusArea.y + focusArea.height * (0.22 + index * 0.15)],
          [startX + viewport.width * 0.1, focusArea.y + focusArea.height * (0.02 + index * 0.1)],
          [endX - viewport.width * 0.15, focusArea.y + focusArea.height * (0.3 + index * 0.16)],
          [endX, focusArea.y + focusArea.height * (0.18 + index * 0.14)],
        ],
        strokeTone: index % 2 === 0 ? 'accent' : 'accentSoft',
        strokeOpacity: 0.26 + index * 0.08,
        strokeWidth: (8 + index * 2) * scale,
        blur: 6 * scale,
      })
    );
  }

  if (patternId === 'swell') {
    return [
      ...Array.from({ length: 4 }, (_, index) =>
        cubicPathLayer({
          id: `wave-swell-${index}`,
          family: 'motif',
          points: [
            [startX, focusArea.y + focusArea.height * (0.2 + index * 0.16)],
            [
              startX + viewport.width * 0.12,
              focusArea.y + focusArea.height * (0.06 + index * 0.12),
            ],
            [endX - viewport.width * 0.14, focusArea.y + focusArea.height * (0.34 + index * 0.12)],
            [endX, focusArea.y + focusArea.height * (0.24 + index * 0.12)],
          ],
          strokeTone: index % 2 === 0 ? 'accentSoft' : 'chipBorder',
          strokeOpacity: 0.18 + index * 0.08,
          strokeWidth: (4 + index) * scale,
        })
      ),
      ellipseLayer({
        id: 'wave-swell-glow',
        family: 'motif',
        cx: endX - viewport.width * 0.08,
        cy: focusArea.y + focusArea.height * 0.6,
        rx: viewport.width * 0.06 * scale,
        ry: viewport.height * 0.11 * scale,
        fillTone: 'accent',
        fillOpacity: 0.14,
        blur: 26 * scale,
      }),
    ];
  }

  return Array.from({ length: 4 }, (_, index) =>
    cubicPathLayer({
      id: `wave-echo-${index}`,
      family: 'motif',
      points: [
        [startX, focusArea.y + focusArea.height * (0.24 + index * 0.14)],
        [
          startX + viewport.width * range(random, 0.08, 0.14),
          focusArea.y + focusArea.height * (0.08 + index * 0.1),
        ],
        [endX - viewport.width * 0.16, focusArea.y + focusArea.height * (0.32 + index * 0.14)],
        [endX, focusArea.y + focusArea.height * (0.22 + index * 0.16)],
      ],
      strokeTone: index % 2 === 0 ? 'accent' : 'accentSoft',
      strokeOpacity: 0.2 + index * 0.1,
      strokeWidth: (4 + index) * scale,
      blur: index === 0 ? 4 * scale : undefined,
    })
  );
}

function buildHaloMotifLayers(context: DecorationBuildContext) {
  const { focusArea, patternId, scale, viewport } = context;
  const cx = focusArea.x + focusArea.width * 0.66;
  const cy = focusArea.y + focusArea.height * 0.42;

  if (patternId === 'split') {
    return [
      arcLayer({
        id: 'halo-split-a',
        family: 'motif',
        cx,
        cy,
        rx: viewport.width * 0.11 * scale,
        ry: viewport.height * 0.16 * scale,
        startAngle: 0.4,
        endAngle: 2.5,
        strokeTone: 'accentSoft',
        strokeOpacity: 0.4,
        strokeWidth: 2,
      }),
      arcLayer({
        id: 'halo-split-b',
        family: 'motif',
        cx,
        cy,
        rx: viewport.width * 0.16 * scale,
        ry: viewport.height * 0.22 * scale,
        startAngle: 3.4,
        endAngle: 5.9,
        strokeTone: 'chipBorder',
        strokeOpacity: 0.34,
        strokeWidth: 1.6,
      }),
      circleLayer({
        id: 'halo-split-core',
        family: 'motif',
        cx,
        cy,
        r: viewport.width * 0.028 * scale,
        fillTone: 'spotPrimary',
        fillOpacity: 0.32,
        blur: 12 * scale,
      }),
    ];
  }

  if (patternId === 'satellite') {
    return [
      circleLayer({
        id: 'halo-satellite-core',
        family: 'motif',
        cx,
        cy,
        r: viewport.width * 0.034 * scale,
        fillTone: 'spotPrimary',
        fillOpacity: 0.34,
        blur: 14 * scale,
      }),
      ellipseLayer({
        id: 'halo-satellite-ring',
        family: 'motif',
        cx,
        cy,
        rx: viewport.width * 0.14 * scale,
        ry: viewport.height * 0.19 * scale,
        strokeTone: 'chipBorder',
        strokeOpacity: 0.36,
        strokeWidth: 1.4,
      }),
      ...buildSatelliteNodes(context, cx, cy, 6, 0.08, 0.18),
    ];
  }

  return [
    circleLayer({
      id: 'halo-core-glow',
      family: 'motif',
      cx,
      cy,
      r: viewport.width * 0.038 * scale,
      fillTone: 'spotPrimary',
      fillOpacity: 0.3,
      blur: 14 * scale,
    }),
    ellipseLayer({
      id: 'halo-ring-a',
      family: 'motif',
      cx,
      cy,
      rx: viewport.width * 0.1 * scale,
      ry: viewport.height * 0.14 * scale,
      strokeTone: 'accentSoft',
      strokeOpacity: 0.42,
      strokeWidth: 1.8,
    }),
    ellipseLayer({
      id: 'halo-ring-b',
      family: 'motif',
      cx,
      cy,
      rx: viewport.width * 0.15 * scale,
      ry: viewport.height * 0.21 * scale,
      strokeTone: 'chipBorder',
      strokeOpacity: 0.28,
      strokeWidth: 1.4,
    }),
  ];
}

function buildSatelliteNodes(
  context: DecorationBuildContext,
  cx: number,
  cy: number,
  count: number,
  minRadiusRatio: number,
  maxRadiusRatio: number
) {
  const { random, scale, viewport } = context;
  return Array.from({ length: count }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const radius = viewport.width * range(random, minRadiusRatio, maxRadiusRatio) * scale;
    return circleLayer({
      id: `satellite-node-${index}`,
      family: 'motif',
      cx: cx + Math.cos(angle) * radius,
      cy: cy + Math.sin(angle) * radius * 0.8,
      r: viewport.width * range(random, 0.006, 0.014) * scale,
      fillTone: index % 2 === 0 ? 'accentSoft' : 'accent',
      fillOpacity: 0.34 + (count - index) * 0.03,
      blur: index % 3 === 0 ? 6 * scale : undefined,
    });
  });
}

function clampLayerBounds(
  layer: BlogCoverDecorationLayer,
  viewport: BlogCoverViewport
): BlogCoverDecorationLayer {
  return {
    ...layer,
    bounds: {
      minX: clamp(layer.bounds.minX, 0, viewport.width),
      maxX: clamp(layer.bounds.maxX, 0, viewport.width),
      minY: clamp(layer.bounds.minY, 0, viewport.height),
      maxY: clamp(layer.bounds.maxY, 0, viewport.height),
    },
  };
}

function circleLayer(
  params: Omit<BlogCoverDecorationCircleLayer, 'bounds' | 'kind'>
): BlogCoverDecorationCircleLayer {
  return {
    kind: 'circle',
    ...params,
    bounds: boundsFromRect(params.cx - params.r, params.cy - params.r, params.r * 2, params.r * 2),
  };
}

function ellipseLayer(
  params: Omit<BlogCoverDecorationEllipseLayer, 'bounds' | 'kind'>
): BlogCoverDecorationEllipseLayer {
  return {
    kind: 'ellipse',
    ...params,
    bounds: boundsFromRect(
      params.cx - params.rx,
      params.cy - params.ry,
      params.rx * 2,
      params.ry * 2
    ),
  };
}

function rectLayer(
  params: Omit<BlogCoverDecorationRectLayer, 'bounds' | 'kind'>
): BlogCoverDecorationRectLayer {
  return {
    kind: 'rect',
    ...params,
    bounds: rotatedBounds(params.x, params.y, params.width, params.height, params.rotation),
  };
}

function lineLayer(
  params: Omit<BlogCoverDecorationLineLayer, 'bounds' | 'kind'>
): BlogCoverDecorationLineLayer {
  const halfStroke = (params.strokeWidth ?? 1) / 2;
  return {
    kind: 'line',
    ...params,
    bounds: {
      minX: Math.min(params.x1, params.x2) - halfStroke,
      maxX: Math.max(params.x1, params.x2) + halfStroke,
      minY: Math.min(params.y1, params.y2) - halfStroke,
      maxY: Math.max(params.y1, params.y2) + halfStroke,
    },
  };
}

function cubicPathLayer(params: {
  id: string;
  family: BlogCoverDecorationFamily;
  points: readonly [[number, number], [number, number], [number, number], [number, number]];
  strokeTone: BlogCoverDecorationTone;
  strokeOpacity: number;
  strokeWidth: number;
  blur?: number | undefined;
}) {
  const [start, c1, c2, end] = params.points;
  return {
    kind: 'path',
    id: params.id,
    family: params.family,
    d: `M ${round(start[0])} ${round(start[1])} C ${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(end[0])} ${round(end[1])}`,
    strokeTone: params.strokeTone,
    strokeOpacity: params.strokeOpacity,
    strokeWidth: params.strokeWidth,
    blur: params.blur,
    bounds: boundsFromPoints(params.points, params.strokeWidth / 2),
  } satisfies BlogCoverDecorationPathLayer;
}

function arcLayer(params: {
  id: string;
  family: BlogCoverDecorationFamily;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  startAngle: number;
  endAngle: number;
  strokeTone: BlogCoverDecorationTone;
  strokeOpacity: number;
  strokeWidth: number;
}) {
  const startX = params.cx + Math.cos(params.startAngle) * params.rx;
  const startY = params.cy + Math.sin(params.startAngle) * params.ry;
  const endX = params.cx + Math.cos(params.endAngle) * params.rx;
  const endY = params.cy + Math.sin(params.endAngle) * params.ry;
  const largeArcFlag = Math.abs(params.endAngle - params.startAngle) > Math.PI ? 1 : 0;

  return {
    kind: 'path',
    id: params.id,
    family: params.family,
    d: `M ${round(startX)} ${round(startY)} A ${round(params.rx)} ${round(params.ry)} 0 ${largeArcFlag} 1 ${round(endX)} ${round(endY)}`,
    strokeTone: params.strokeTone,
    strokeOpacity: params.strokeOpacity,
    strokeWidth: params.strokeWidth,
    bounds: boundsFromRect(
      params.cx - params.rx,
      params.cy - params.ry,
      params.rx * 2,
      params.ry * 2
    ),
  } satisfies BlogCoverDecorationPathLayer;
}

function boundsFromRect(
  x: number,
  y: number,
  width: number,
  height: number
): BlogCoverDecorationBounds {
  return {
    minX: x,
    maxX: x + width,
    minY: y,
    maxY: y + height,
  };
}

function rotatedBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0
): BlogCoverDecorationBounds {
  if (!rotation) {
    return boundsFromRect(x, y, width, height);
  }

  const cx = x + width / 2;
  const cy = y + height / 2;
  const radians = (rotation * Math.PI) / 180;
  const corners = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ] as const;

  return boundsFromPoints(corners.map(([px, py]) => rotatePoint(px, py, cx, cy, radians)));
}

function boundsFromPoints(
  points: readonly [number, number][],
  padding = 0
): BlogCoverDecorationBounds {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    minX: Math.min(...xs) - padding,
    maxX: Math.max(...xs) + padding,
    minY: Math.min(...ys) - padding,
    maxY: Math.max(...ys) + padding,
  };
}

function rotatePoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  radians: number
): [number, number] {
  const dx = x - cx;
  const dy = y - cy;
  return [
    cx + dx * Math.cos(radians) - dy * Math.sin(radians),
    cy + dx * Math.sin(radians) + dy * Math.cos(radians),
  ];
}

function createPrng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function range(random: Rng, min: number, max: number) {
  return min + random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashToUint32(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
