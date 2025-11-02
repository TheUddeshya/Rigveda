import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from '../../src/components/filters/FilterPanel';
import type { VerseData } from '../../src/store/verseStore';

// Mock verse data with varied attributes for filtering
const mockVerses: VerseData[] = [
  {
    id: 'RV.1.1.1',
    mandala: 1,
    sukta: 1,
    verse: 1,
    text: {
      sanskrit: 'अग्निमीळे पुरोहितं',
      iast: 'agnim īḷe purohitaṃ',
      translations: [
        {
          language: 'en',
          text: 'I praise Agni',
          translator: 'Griffith',
        },
      ],
    },
    metadata: {
      deity: { primary: 'Agni', secondary: null },
      rishi: { name: 'Madhucchandas', gotra: 'Vaishvamitra' },
      meter: 'Gayatri',
    },
    themes: ['fire', 'ritual'],
    keywords: { sanskrit: [], english: [] },
  },
  {
    id: 'RV.1.32.1',
    mandala: 1,
    sukta: 32,
    verse: 1,
    text: {
      sanskrit: 'इन्द्रस्य नु वीर्याणि',
      iast: 'indrasya nu vīryāṇi',
      translations: [
        {
          language: 'en',
          text: 'Deeds of Indra',
          translator: 'Griffith',
        },
      ],
    },
    metadata: {
      deity: { primary: 'Indra', secondary: null },
      rishi: { name: 'Hiranyastupa', gotra: 'Angirasa' },
      meter: 'Tristubh',
    },
    themes: ['heroism', 'victory'],
    keywords: { sanskrit: [], english: [] },
  },
  {
    id: 'RV.10.129.1',
    mandala: 10,
    sukta: 129,
    verse: 1,
    text: {
      sanskrit: 'नासदासीन्नो सदासीत्',
      iast: 'nāsad āsīn no sad āsīt',
      translations: [
        {
          language: 'en',
          text: 'Creation hymn',
          translator: 'Wendy Doniger',
        },
      ],
    },
    metadata: {
      deity: { primary: 'Creation', secondary: null },
      rishi: { name: 'Prajapati', gotra: 'Unknown' },
      meter: 'Tristubh',
    },
    themes: ['creation', 'philosophy'],
    keywords: { sanskrit: [], english: [] },
  },
];

describe('FilterPanel', () => {
  let mockOnFilterChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnFilterChange = vi.fn();
  });

  describe('Rendering', () => {
    it('renders the filter panel', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search verses, deities, keywords...');
      expect(searchInput).toBeInTheDocument();
    });

    it('renders all filter dropdowns', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByLabelText('Mandala')).toBeInTheDocument();
      expect(screen.getByLabelText('Sukta')).toBeInTheDocument();
      expect(screen.getByLabelText('Deity')).toBeInTheDocument();
      expect(screen.getByLabelText('Rishi')).toBeInTheDocument();
      expect(screen.getByLabelText('Meter')).toBeInTheDocument();
      expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    });
  });

  describe('Filter Options', () => {
    it('populates mandala options correctly', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const mandalaSelect = screen.getByLabelText('Mandala') as HTMLSelectElement;
      expect(mandalaSelect.options.length).toBe(3); // All + 2 unique mandalas (1, 10)
    });

    it('populates deity options correctly', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const deitySelect = screen.getByLabelText('Deity') as HTMLSelectElement;
      expect(deitySelect.options.length).toBe(4); // All + 3 unique deities
    });

    it('populates theme options correctly', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const themeSelect = screen.getByLabelText('Theme') as HTMLSelectElement;
      // themes: 'fire', 'ritual', 'heroism', 'victory', 'creation', 'philosophy' = 6 unique + 'All' = 7
      expect(themeSelect.options.length).toBe(7);
    });

    it('sorts options alphabetically', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const deitySelect = screen.getByLabelText('Deity') as HTMLSelectElement;
      const deityOptions = Array.from(deitySelect.options).slice(1).map(o => o.value);

      // Should be sorted: Agni, Creation, Indra
      expect(deityOptions).toEqual(['Agni', 'Creation', 'Indra']);
    });
  });

  describe('Search Functionality', () => {
    it('calls onFilterChange when search input changes', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search verses, deities, keywords...');
      await user.type(searchInput, 'test');

      // userEvent.type() fires onChange for each character, so we should have multiple calls
      expect(mockOnFilterChange).toHaveBeenCalled();
      expect(mockOnFilterChange.mock.calls.length).toBeGreaterThan(0);

      // Check that search value is passed correctly
      const calls = mockOnFilterChange.mock.calls;
      expect(calls[calls.length - 1][0].search).toBeDefined();
    });

    it('displays current search value', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ search: 'test query' }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search verses, deities, keywords...') as HTMLInputElement;
      expect(searchInput.value).toBe('test query');
    });
  });

  describe('Mandala Filter', () => {
    it('calls onFilterChange when mandala is selected', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const mandalaSelect = screen.getByLabelText('Mandala');
      await user.selectOptions(mandalaSelect, '1');

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        mandala: 1,
      });
    });

    it('displays selected mandala value', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ mandala: 10 }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const mandalaSelect = screen.getByLabelText('Mandala') as HTMLSelectElement;
      expect(mandalaSelect.value).toBe('10');
    });

    it('clears mandala when "All" is selected', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ mandala: 1 }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const mandalaSelect = screen.getByLabelText('Mandala');
      await user.selectOptions(mandalaSelect, '');

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        mandala: undefined,
      });
    });
  });

  describe('Deity Filter', () => {
    it('calls onFilterChange when deity is selected', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const deitySelect = screen.getByLabelText('Deity');
      await user.selectOptions(deitySelect, 'Agni');

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        deity: 'Agni',
      });
    });

    it('displays selected deity value', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ deity: 'Indra' }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const deitySelect = screen.getByLabelText('Deity') as HTMLSelectElement;
      expect(deitySelect.value).toBe('Indra');
    });
  });

  describe('Rishi Filter', () => {
    it('calls onFilterChange when rishi is selected', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const rishiSelect = screen.getByLabelText('Rishi');
      await user.selectOptions(rishiSelect, 'Madhucchandas');

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        rishi: 'Madhucchandas',
      });
    });
  });

  describe('Meter Filter', () => {
    it('calls onFilterChange when meter is selected', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const meterSelect = screen.getByLabelText('Meter');
      await user.selectOptions(meterSelect, 'Gayatri');

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        meter: 'Gayatri',
      });
    });
  });

  describe('Theme Filter', () => {
    it('calls onFilterChange when theme is selected', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const themeSelect = screen.getByLabelText('Theme');
      await user.selectOptions(themeSelect, 'fire');

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        theme: 'fire',
      });
    });
  });

  describe('Clear All Filters', () => {
    it('does not show clear button when no filters are active', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.queryByLabelText('Clear all filters')).not.toBeInTheDocument();
    });

    it('shows clear button when filters are active', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ mandala: 1, deity: 'Agni' }}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
    });

    it('shows clear button when search is active', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ search: 'test' }}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
    });

    it('clears all filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ mandala: 1, deity: 'Agni', search: 'test' }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const clearButton = screen.getByLabelText('Clear all filters');
      await user.click(clearButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({});
    });
  });

  describe('Multiple Filters', () => {
    it('preserves existing filters when adding a new one', async () => {
      const user = userEvent.setup();
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ mandala: 1 }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const deitySelect = screen.getByLabelText('Deity');
      await user.selectOptions(deitySelect, 'Agni');

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        mandala: 1,
        deity: 'Agni',
      });
    });

    it('handles all filters being set simultaneously', () => {
      const allFilters = {
        mandala: 1,
        sukta: 1,
        deity: 'Agni',
        rishi: 'Madhucchandas',
        meter: 'Gayatri',
        theme: 'fire',
        search: 'test',
      };

      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={allFilters}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();

      const mandalaSelect = screen.getByLabelText('Mandala') as HTMLSelectElement;
      const deitySelect = screen.getByLabelText('Deity') as HTMLSelectElement;
      const searchInput = screen.getByPlaceholderText('Search verses, deities, keywords...') as HTMLInputElement;

      expect(mandalaSelect.value).toBe('1');
      expect(deitySelect.value).toBe('Agni');
      expect(searchInput.value).toBe('test');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty verse list', () => {
      render(
        <FilterPanel
          allVerses={[]}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const mandalaSelect = screen.getByLabelText('Mandala') as HTMLSelectElement;
      expect(mandalaSelect.options.length).toBe(1); // Only "All" option
    });

    it('handles verses with missing metadata', () => {
      const incompleteVerses: VerseData[] = [
        {
          id: 'RV.1.1.1',
          mandala: 1,
          sukta: 1,
          verse: 1,
          text: {
            sanskrit: 'test',
            iast: 'test',
            translations: [],
          },
          metadata: {
            deity: { primary: '', secondary: null },
            rishi: { name: '' },
            meter: '',
          },
          themes: [],
          keywords: { sanskrit: [], english: [] },
        },
      ];

      render(
        <FilterPanel
          allVerses={incompleteVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      // Should not crash and should render basic structure
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('handles verses with null or undefined values', () => {
      const versesWithNulls: VerseData[] = [
        {
          ...mockVerses[0],
          metadata: {
            deity: { primary: '', secondary: null },
            rishi: { name: '' },
            meter: '',
          },
          themes: [],
        },
      ];

      render(
        <FilterPanel
          allVerses={versesWithNulls}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const deitySelect = screen.getByLabelText('Deity') as HTMLSelectElement;
      expect(deitySelect.options.length).toBe(1); // Only "All" option
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getByLabelText('Mandala')).toBeInTheDocument();
      expect(screen.getByLabelText('Sukta')).toBeInTheDocument();
      expect(screen.getByLabelText('Deity')).toBeInTheDocument();
      expect(screen.getByLabelText('Rishi')).toBeInTheDocument();
      expect(screen.getByLabelText('Meter')).toBeInTheDocument();
      expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    });

    it('has accessible clear all button', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{ mandala: 1 }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const clearButton = screen.getByLabelText('Clear all filters');
      expect(clearButton).toHaveAttribute('type', 'button');
    });

    it('has proper ARIA structure', () => {
      render(
        <FilterPanel
          allVerses={mockVerses}
          currentFilters={{}}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search verses, deities, keywords...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });
  });
});
