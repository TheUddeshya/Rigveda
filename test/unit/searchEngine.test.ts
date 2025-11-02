import { describe, it, expect } from 'vitest';
import { createSearchEngine, search } from '../../src/utils/searchEngine';
import type { VerseData } from '../../src/store/verseStore';

// Mock verse data for testing
const mockVerses: VerseData[] = [
  {
    id: 'RV.1.1.1',
    mandala: 1,
    sukta: 1,
    verse: 1,
    text: {
      sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्',
      iast: 'agnim īḷe purohitaṃ yajñasya devam ṛtvijam',
      translations: [
        {
          language: 'en',
          text: 'I praise Agni, the chosen Priest, God, minister of sacrifice',
          translator: 'Ralph T.H. Griffith',
        },
      ],
    },
    metadata: {
      deity: {
        primary: 'Agni',
        secondary: [],
      },
      rishi: {
        name: 'Madhucchandas Vaishvamitra',
        gotra: 'Vaishvamitra',
      },
      meter: 'Gayatri',
    },
    themes: ['fire', 'ritual', 'worship'],
    keywords: {
      sanskrit: ['अग्नि', 'यज्ञ'],
      english: ['fire', 'sacrifice'],
    },
    context: {
      significance: 'Opening verse of the Rigveda',
    },
  },
  {
    id: 'RV.1.32.1',
    mandala: 1,
    sukta: 32,
    verse: 1,
    text: {
      sanskrit: 'इन्द्रस्य नु वीर्याणि प्र वोचं यानि चकार प्रथमानि वज्री',
      iast: 'indrasya nu vīryāṇi pra vocaṃ yāni cakāra prathamāni vajrī',
      translations: [
        {
          language: 'en',
          text: 'I will declare the manly deeds of Indra, the first that he performed, the Thunder-wielder',
          translator: 'Ralph T.H. Griffith',
        },
      ],
    },
    metadata: {
      deity: {
        primary: 'Indra',
        secondary: [],
      },
      rishi: {
        name: 'Hiranyastupa Angirasa',
        gotra: 'Angirasa',
      },
      meter: 'Tristubh',
    },
    themes: ['heroism', 'victory', 'thunder'],
    keywords: {
      sanskrit: ['इन्द्र', 'वज्र'],
      english: ['thunder', 'victory'],
    },
    context: {
      significance: 'Praise of Indra\'s heroic deeds',
    },
  },
  {
    id: 'RV.10.129.1',
    mandala: 10,
    sukta: 129,
    verse: 1,
    text: {
      sanskrit: 'नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत्',
      iast: 'nāsad āsīn no sad āsīt tadānīṃ nāsīd rajo no vyomā paro yat',
      translations: [
        {
          language: 'en',
          text: 'Then was not non-existent nor existent: there was no realm of air, no sky beyond it',
          translator: 'Ralph T.H. Griffith',
        },
      ],
    },
    metadata: {
      deity: {
        primary: 'Creation',
        secondary: [],
      },
      rishi: {
        name: 'Prajapati Parameshthin',
        gotra: 'Unknown',
      },
      meter: 'Tristubh',
    },
    themes: ['creation', 'cosmology', 'philosophy'],
    keywords: {
      sanskrit: ['सत्', 'असत्'],
      english: ['existence', 'non-existence'],
    },
    context: {
      significance: 'Nasadiya Sukta - Hymn of Creation',
    },
  },
];

describe('searchEngine', () => {
  describe('createSearchEngine', () => {
    it('creates a Fuse instance with correct configuration', () => {
      const fuse = createSearchEngine(mockVerses);

      expect(fuse).toBeDefined();
      expect(typeof fuse.search).toBe('function');
    });

    it('works with empty verse array', () => {
      const fuse = createSearchEngine([]);
      const results = fuse.search('Agni');

      expect(results).toEqual([]);
    });
  });

  describe('search', () => {
    const fuse = createSearchEngine(mockVerses);

    it('returns empty array for empty query', () => {
      const results = search(fuse, '');

      expect(results).toEqual([]);
    });

    it('returns empty array for whitespace-only query', () => {
      const results = search(fuse, '   ');

      expect(results).toEqual([]);
    });

    it('finds verses by deity name', () => {
      const results = search(fuse, 'Agni');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].metadata?.deity?.primary).toBe('Agni');
    });

    it('finds verses by Sanskrit text', () => {
      const results = search(fuse, 'अग्नि');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].text.sanskrit).toContain('अग्नि');
    });

    it('finds verses by IAST transliteration', () => {
      const results = search(fuse, 'agnim');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].text.iast).toContain('agnim');
    });

    it('finds verses by English translation', () => {
      const results = search(fuse, 'sacrifice');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].text.translations[0].text.toLowerCase()).toContain('sacrifice');
    });

    it('finds verses by rishi name', () => {
      const results = search(fuse, 'Madhucchandas');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].metadata?.rishi?.name).toContain('Madhucchandas');
    });

    it('finds verses by meter', () => {
      const results = search(fuse, 'Gayatri');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].metadata?.meter).toBe('Gayatri');
    });

    it('finds verses by theme', () => {
      const results = search(fuse, 'creation');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].themes).toContain('creation');
    });

    it('finds verses by keywords', () => {
      const results = search(fuse, 'fire');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].keywords?.english).toContain('fire');
    });

    it('finds verses by context significance', () => {
      const results = search(fuse, 'Opening verse');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].context?.significance).toContain('Opening verse');
    });

    it('handles fuzzy matching for misspellings', () => {
      // "Agmi" should still match "Agni" due to fuzzy search
      const results = search(fuse, 'Agmi');

      expect(results.length).toBeGreaterThan(0);
    });

    it('returns results in relevance order', () => {
      // Exact match should rank higher than partial match
      const results = search(fuse, 'Indra');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].metadata?.deity?.primary).toBe('Indra');
    });

    it('handles multi-word queries', () => {
      const results = search(fuse, 'Hymn of Creation');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].context?.significance).toContain('Creation');
    });

    it('searches across multiple fields', () => {
      // "thunder" appears in both themes and keywords
      const results = search(fuse, 'thunder');

      expect(results.length).toBeGreaterThan(0);
      const hasThunder = results.some(v =>
        v.themes?.includes('thunder') ||
        v.keywords?.english?.includes('thunder')
      );
      expect(hasThunder).toBe(true);
    });

    it('handles case-insensitive search', () => {
      const resultsLower = search(fuse, 'agni');
      const resultsUpper = search(fuse, 'AGNI');
      const resultsMixed = search(fuse, 'AgNi');

      expect(resultsLower.length).toBeGreaterThan(0);
      expect(resultsUpper.length).toBeGreaterThan(0);
      expect(resultsMixed.length).toBeGreaterThan(0);
    });

    it('returns unique verses (no duplicates)', () => {
      const results = search(fuse, 'Agni');
      const ids = results.map(v => v.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it('handles special characters in query', () => {
      const results = search(fuse, 'nāsad');

      expect(results.length).toBeGreaterThan(0);
    });

    it('handles queries with no matches', () => {
      const results = search(fuse, 'xyzabc123nonexistent');

      expect(results).toEqual([]);
    });
  });

  describe('integration', () => {
    it('creates search engine and performs search in one flow', () => {
      const fuse = createSearchEngine(mockVerses);
      const results = search(fuse, 'Indra');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('text');
      expect(results[0]).toHaveProperty('metadata');
    });

    it('handles searching through large dataset efficiently', () => {
      // Create a larger dataset
      const largeDataset = Array(100).fill(null).map((_, i) => ({
        ...mockVerses[0],
        id: `RV.1.1.${i}`,
      }));

      const fuse = createSearchEngine(largeDataset);
      const startTime = performance.now();
      const results = search(fuse, 'Agni');
      const endTime = performance.now();

      expect(results.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
