interface FramesFile {
  frames: string[];
  frame_count?: number;
  lines_per_frame?: number;
  max_width?: number;
}

const SPAN_OPEN = '<span class="b">';
const SPAN_CLOSE = '</span>';

export interface MarkupSegment {
  text: string;
  brand: boolean;
}

/**
 * Parse a frame line with <span class="b">...</span> markup into segments.
 */
export function parseFrameLine(line: string): MarkupSegment[] {
  const segments: MarkupSegment[] = [];
  let i = 0;

  while (i < line.length) {
    const openIdx = line.indexOf(SPAN_OPEN, i);
    if (openIdx === -1) {
      if (i < line.length) segments.push({ text: line.slice(i), brand: false });
      break;
    }
    if (openIdx > i) {
      segments.push({ text: line.slice(i, openIdx), brand: false });
    }
    const contentStart = openIdx + SPAN_OPEN.length;
    const closeIdx = line.indexOf(SPAN_CLOSE, contentStart);
    if (closeIdx === -1) {
      segments.push({ text: line.slice(contentStart), brand: true });
      break;
    }
    segments.push({ text: line.slice(contentStart, closeIdx), brand: true });
    i = closeIdx + SPAN_CLOSE.length;
  }

  return segments;
}

let cache: string[] | null = null;

/**
 * Load Ghostty animation frames from public JSON.
 * Caches result to avoid re-fetching.
 */
export async function loadGhosttyFrames(): Promise<string[]> {
  if (cache) return cache;

  const res = await fetch('/ghostty-frames.json');
  if (!res.ok) {
    throw new Error(`Failed to load ghostty frames: ${res.status}`);
  }

  const data = (await res.json()) as FramesFile;
  if (!data.frames || !Array.isArray(data.frames)) {
    throw new Error('Invalid ghostty frames format');
  }

  cache = data.frames;
  return cache;
}
