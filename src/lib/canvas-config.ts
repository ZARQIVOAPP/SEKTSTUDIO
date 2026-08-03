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
  focusZoom: number; // zoom level when this node is in focus
  sectionIndex: string; // display index like "001"
}

export interface ConnectionConfig {
  id: string;
  from: string;
  to: string;
}

// Node positions in canvas-space (px)
export const NODES: NodeConfig[] = [
  {
    id: 'hero',
    label: 'SEKT STUDIO',
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    focusZoom: 0.52,
    sectionIndex: '000',
  },
  {
    id: 'about',
    label: 'About',
    x: 2800,
    y: -600,
    width: 1400,
    height: 900,
    focusZoom: 0.65,
    sectionIndex: '001',
  },
  {
    id: 'works',
    label: 'Works',
    x: 3200,
    y: 600,
    width: 2000,
    height: 1400,
    focusZoom: 0.48,
    sectionIndex: '002',
  },
  {
    id: 'services',
    label: 'Services',
    x: 5800,
    y: -300,
    width: 1200,
    height: 1000,
    focusZoom: 0.7,
    sectionIndex: '003',
  },
  {
    id: 'process',
    label: 'Process',
    x: 4200,
    y: 2400,
    width: 2800,
    height: 700,
    focusZoom: 0.45,
    sectionIndex: '004',
  },
  {
    id: 'journal',
    label: 'Journal',
    x: 2400,
    y: 3200,
    width: 1600,
    height: 1100,
    focusZoom: 0.55,
    sectionIndex: '005',
  },
  {
    id: 'contact',
    label: 'Contact',
    x: 5600,
    y: 3600,
    width: 1200,
    height: 900,
    focusZoom: 0.7,
    sectionIndex: '006',
  },
];

// Connections between nodes (for SVG paths)
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
  minZoom: 0.08,   // can't zoom out beyond the node space
  maxZoom: 0.8,    // can't zoom in too much
  zoomIn: 1.04,    // slower zoom steps
  zoomOut: 0.96,
  friction: 0.92,
  velocityThreshold: 0.5,
  panEase: 'power4.inOut' as const,
  panDuration: 1.6,
};

// Get node by ID
export function getNodeById(id: string): NodeConfig | undefined {
  return NODES.find((n) => n.id === id);
}

// Get center point of a node
export function getNodeCenter(node: NodeConfig): { x: number; y: number } {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

// Compute the bounding box of all nodes for overview
export function getCanvasBounds() {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const node of NODES) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}
