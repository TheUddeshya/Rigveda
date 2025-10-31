import type { VerseData } from '../store/verseStore';

// Attempt to load a single mandala file. We support multiple filename
// variants to be tolerant of how files are named in `/public/data/rigveda`.
const mandalaCache = new Map<number, VerseData[]>();

export async function loadMandala(mandala: number): Promise<VerseData[]> {
  if (mandalaCache.has(mandala)) return mandalaCache.get(mandala)!;

  // Check sessionStorage cache (persist for the browser session)
  try {
    const key = `mandala_${mandala}`;
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as VerseData[];
      if (Array.isArray(parsed)) {
        mandalaCache.set(mandala, parsed);
        return parsed;
      }
    }
  } catch {
    // sessionStorage may be unavailable in some environments (e.g., SSR); ignore
  }

  const pad2 = String(mandala).padStart(2, '0');
  const candidates = [
    `/data/rigveda/Mandala_${mandala}.json`, // requested new style
    `/data/rigveda/Mandala_${pad2}.json`,
    `/data/rigveda/mandala_${pad2}.json`, // existing files
    `/data/rigveda/mandala_${mandala}.json`,
  ];

  for (const path of candidates) {
    try {
      const res = await fetch(path);
      if (!res.ok) {
        // Try next candidate
        continue;
      }
      const json = await res.json();
      let out: VerseData[] = [];
      if (Array.isArray(json)) out = json as VerseData[];
      else if (Array.isArray(json.verses)) out = json.verses as VerseData[];
      else if (Array.isArray(json.data)) out = json.data as VerseData[];
      else {
        console.warn(`Unrecognized structure in ${path}`, json);
        out = [];
      }
      mandalaCache.set(mandala, out);
      try {
        const key = `mandala_${mandala}`;
        sessionStorage.setItem(key, JSON.stringify(out));
      } catch {
        // ignore sessionStorage errors
      }
      return out;
    } catch (err) {
      console.warn(`Error fetching ${path}:`, err);
      // continue to next candidate
    }
  }

  // If none found, return empty array
  mandalaCache.set(mandala, []);
  try {
    sessionStorage.setItem(`mandala_${mandala}`, JSON.stringify([]));
  } catch {
    // ignore
  }
  return [];
}

// Load verses from per-mandala JSON files if available, otherwise fall back
// to the legacy `/data/verses.json` file. This function still returns the
// full merged verses array for callers that expect that behavior.
export const loadVerses = async (): Promise<VerseData[]> => {
  try {
    const loads = await Promise.allSettled(
      Array.from({ length: 10 }, (_, i) => loadMandala(i + 1))
    );

    const merged: VerseData[] = [];
    loads.forEach((r, idx) => {
      if (r.status === 'fulfilled' && Array.isArray(r.value) && r.value.length > 0) {
        merged.push(...r.value);
      } else if (r.status === 'rejected') {
        console.warn(`Mandala ${idx + 1} load failed:`, r.reason);
      }
    });

    if (merged.length > 0) return merged;

    // Fallback: try legacy file
    const fallbackResp = await fetch('/data/verses.json');
    if (!fallbackResp.ok) throw new Error('Failed to load fallback verses.json');
    const fallbackData = await fallbackResp.json();
    if (Array.isArray(fallbackData)) return fallbackData;
    if (Array.isArray(fallbackData.verses)) return fallbackData.verses;
    return [];
  } catch (error) {
    console.error('Error loading verses:', error);
    return [];
  }
};
