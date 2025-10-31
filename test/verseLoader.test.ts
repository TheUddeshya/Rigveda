import { describe, it, expect, beforeEach, vi } from 'vitest';

// We'll import dynamically inside tests so module state (in-memory cache)
// is reset by calling `vi.resetModules()` between tests.

const sampleMandalaResponse = {
  verses: [
    {
      id: '01.001.01',
      mandala: 1,
      sukta: 1,
      verse: 1,
      text: { sanskrit: '...', iast: '...', translations: [{ language: 'en', translator: 'Test', text: 'Hello' }] },
      metadata: { deity: { primary: 'Agni' }, rishi: { name: 'Rishi' }, meter: 'X' },
      themes: [],
    },
  ],
};

describe('verseLoader', () => {
  beforeEach(() => {
    vi.resetModules();
    global.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('loadMandala should fetch and return verses, and cache to sessionStorage', async () => {
    // mock fetch to return the sample response for Mandala_1.json
    const fetchMock = vi.fn((input: RequestInfo) => {
      if (String(input).includes('Mandala_1.json') || String(input).includes('mandala_01.json')) {
        return Promise.resolve(new Response(JSON.stringify(sampleMandalaResponse), { status: 200 }));
      }
      return Promise.resolve(new Response(null, { status: 404 }));
    });
    vi.stubGlobal('fetch', fetchMock);

    const { loadMandala } = await import('../src/utils/verseLoader');
    const data = await loadMandala(1);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    // sessionStorage should have the cached entry
    const raw = sessionStorage.getItem('mandala_1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].id).toBe('01.001.01');
  });

  it('loadMandala should return [] when files are missing', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: 404 })));
    vi.stubGlobal('fetch', fetchMock);

    const { loadMandala } = await import('../src/utils/verseLoader');
    const data = await loadMandala(99); // nonexistent mandala
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
    const raw = sessionStorage.getItem('mandala_99');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(0);
  });
});
