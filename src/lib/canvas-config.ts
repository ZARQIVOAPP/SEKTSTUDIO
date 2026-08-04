// ─────────────────────────────────────────────
// Canvas Configuration — Node Graph Layout
// ─────────────────────────────────────────────

export interface NodeConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  focusZoom: number;
  sectionIndex: string;
  // Mobile layout overrides
  mobileX: number;
  mobileY: number;
  mobileWidth: number;
  mobileHeight: number;
}

export interface ConnectionConfig {
  id: string;
  from: string;
  to: string;
}

// Node positions in canvas-space (px)
// Mobile: 360×680 portrait nodes in a compact staggered 2-column grid
export const NODES: NodeConfig[] = [
  {
    id: 'hero',
    label: 'SEKT STUDIO',
    x: 0, y: 0, width: 1920, height: 1080, focusZoom: 0.52,
    sectionIndex: '000',
    mobileX: 0, mobileY: 0, mobileWidth: 360, mobileHeight: 680,
  },
  {
    id: 'about',
    label: 'About',
    x: 2800, y: -600, width: 1400, height: 900, focusZoom: 0.65,
    sectionIndex: '001',
    mobileX: 440, mobileY: -60, mobileWidth: 360, mobileHeight: 680,
  },
  {
    id: 'works',
    label: 'Works',
    x: 3200, y: 600, width: 2000, height: 1400, focusZoom: 0.48,
    sectionIndex: '002',
    mobileX: 60, mobileY: 780, mobileWidth: 360, mobileHeight: 680,
  },
  {
    id: 'services',
    label: 'Services',
    x: 5800, y: -300, width: 1200, height: 1000, focusZoom: 0.7,
    sectionIndex: '003',
    mobileX: 440, mobileY: 840, mobileWidth: 360, mobileHeight: 680,
  },
  {
    id: 'process',
    label: 'Process',
    x: 4200, y: 2400, width: 2800, height: 700, focusZoom: 0.45,
    sectionIndex: '004',
    mobileX: 0, mobileY: 1620, mobileWidth: 360, mobileHeight: 680,
  },
  {
    id: 'journal',
    label: 'Journal',
    x: 2400, y: 3200, width: 1600, height: 1100, focusZoom: 0.55,
    sectionIndex: '005',
    mobileX: 440, mobileY: 1560, mobileWidth: 360, mobileHeight: 680,
  },
  {
    id: 'contact',
    label: 'Contact',
    x: 5600, y: 3600, width: 1200, height: 900, focusZoom: 0.7,
    sectionIndex: '006',
    mobileX: 220, mobileY: 2400, mobileWidth: 360, mobileHeight: 680,
  },
];

// Connections
export const CONNECTIONS: ConnectionConfig[] = [
  { id: 'hero-about', from: 'hero', to: 'about' },
  { id: 'hero-works', from: 'hero', to: 'works' },
  { id: 'about-services', from: 'about', to: 'services' },
  { id: 'works-process', from: 'works', to: 'process' },
  { id: 'works-services', from: 'works', to: 'services' },
  { id: 'process-journal', from: 'process', to: 'journal' },
  { id: 'process-contact', from: 'process', to: 'contact' },
  { id: 'journal-contact', from: 'journal', to: 'contact' },
];

export const CAMERA_DEFAULTS = {
  initialZoom: 0.08,
  minZoom: 0.08,
  maxZoom: 0.8,
  zoomIn: 1.04,
  zoomOut: 0.96,
  friction: 0.92,
  velocityThreshold: 0.5,
  panEase: 'power4.inOut' as const,
  panDuration: 1.6,
};

// ─── Helpers ───

export function getNodeById(id: string): NodeConfig | undefined {
  return NODES.find((n) => n.id === id);
}

/** Get effective x, y, width, height for a node based on screen */
export function getNodeLayout(node: NodeConfig, isMobile: boolean) {
  if (isMobile) {
    return { x: node.mobileX, y: node.mobileY, width: node.mobileWidth, height: node.mobileHeight };
  }
  return { x: node.x, y: node.y, width: node.width, height: node.height };
}

/** Get center point of a node */
export function getNodeCenter(node: NodeConfig, isMobile = false): { x: number; y: number } {
  const l = getNodeLayout(node, isMobile);
  return { x: l.x + l.width / 2, y: l.y + l.height / 2 };
}

/** Compute the bounding box of all nodes */
export function getCanvasBounds(isMobile = false) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const node of NODES) {
    const l = getNodeLayout(node, isMobile);
    minX = Math.min(minX, l.x);
    minY = Math.min(minY, l.y);
    maxX = Math.max(maxX, l.x + l.width);
    maxY = Math.max(maxY, l.y + l.height);
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}
