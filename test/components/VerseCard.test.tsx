import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerseCard from '../../src/components/verses/VerseCard';

// Mock the hooks and utilities
vi.mock('../../src/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    isBookmarked: vi.fn(() => false),
    toggleBookmark: vi.fn(),
  }),
}));

vi.mock('../../src/utils/verseLoader', () => ({
  loadMandala: vi.fn(() => Promise.resolve([])),
}));

// Mock verse data
const mockVerse = {
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
        year: 1896,
      },
      {
        language: 'en',
        text: 'I invoke Agni, the purohita of the sacrifice',
        translator: 'Wendy Doniger',
        year: 1981,
      },
    ],
  },
  metadata: {
    deity: {
      primary: 'Agni',
      secondary: null,
    },
    rishi: {
      name: 'Madhucchandas Vaishvamitra',
      gotra: 'Vaishvamitra',
    },
    meter: 'Gayatri',
    category: 'Praise',
  },
  themes: ['fire', 'ritual', 'worship'],
  context: {
    significance: 'Opening verse of the Rigveda',
    note: 'Sets the tone for the entire collection',
  },
};

describe('VerseCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders verse with all basic information', () => {
      render(<VerseCard verse={mockVerse} />);

      expect(screen.getByText('1.1.1')).toBeInTheDocument();
      expect(screen.getByText(mockVerse.text.sanskrit)).toBeInTheDocument();
    });

    it('renders with correct ARIA label', () => {
      render(<VerseCard verse={mockVerse} />);

      const card = screen.getByLabelText('Verse RV.1.1.1');
      expect(card).toBeInTheDocument();
    });

    it('has correct role and tabindex for keyboard navigation', () => {
      render(<VerseCard verse={mockVerse} />);

      const card = screen.getByLabelText('Verse RV.1.1.1');
      expect(card).toHaveAttribute('tabindex', '0');
      expect(card).toHaveAttribute('role', 'button');
    });
  });

  describe('Tab Switching', () => {
    it('shows Sanskrit tab by default', () => {
      render(<VerseCard verse={mockVerse} />);

      expect(screen.getByText(mockVerse.text.sanskrit)).toBeInTheDocument();
    });

    it('switches to IAST tab when clicked', async () => {
      const user = userEvent.setup();
      render(<VerseCard verse={mockVerse} />);

      const iastButton = screen.getByText('IAST');
      await user.click(iastButton);

      await waitFor(() => {
        expect(screen.getByText(mockVerse.text.iast)).toBeInTheDocument();
      });
    });

    it('switches to Translation tab when clicked', async () => {
      const user = userEvent.setup();
      render(<VerseCard verse={mockVerse} />);

      const translationButton = screen.getByRole('button', { name: 'Translation' });
      await user.click(translationButton);

      await waitFor(() => {
        expect(screen.getByText(/I praise Agni/)).toBeInTheDocument();
      });
    });
  });

  describe('Translation Selection', () => {
    it('displays first translation by default', async () => {
      const user = userEvent.setup();
      render(<VerseCard verse={mockVerse} />);

      const translationButton = screen.getByRole('button', { name: 'Translation' });
      await user.click(translationButton);

      await waitFor(() => {
        expect(screen.getByText(/I praise Agni/)).toBeInTheDocument();
      });
    });

    it('allows toggling between multiple translators', async () => {
      const user = userEvent.setup();
      render(<VerseCard verse={mockVerse} />);

      const translationButton = screen.getByRole('button', { name: 'Translation' });
      await user.click(translationButton);

      // Click on second translator
      const donigerButton = screen.getByRole('button', { name: 'Wendy Doniger' });
      await user.click(donigerButton);

      await waitFor(() => {
        // Both translations should be visible
        expect(screen.getByText(/I praise Agni/)).toBeInTheDocument();
        expect(screen.getByText(/I invoke Agni/)).toBeInTheDocument();
      });
    });

    it('shows message when no translations are selected', async () => {
      const user = userEvent.setup();
      render(<VerseCard verse={mockVerse} />);

      const translationButton = screen.getByRole('button', { name: 'Translation' });
      await user.click(translationButton);

      // Deselect the default translator
      const griffithButton = screen.getByRole('button', { name: 'Ralph T.H. Griffith' });
      await user.click(griffithButton);

      await waitFor(() => {
        expect(screen.getByText('Please select at least one translation to view.')).toBeInTheDocument();
      });
    });
  });

  describe('View Modes', () => {
    it('shows full metadata in full mode', () => {
      render(<VerseCard verse={mockVerse} viewMode="full" />);

      expect(screen.getByText('Verse Details')).toBeInTheDocument();
      expect(screen.getByText('Agni')).toBeInTheDocument();
      expect(screen.getByText('Madhucchandas Vaishvamitra')).toBeInTheDocument();
      expect(screen.getByText('Gayatri')).toBeInTheDocument();
    });

    it('hides metadata in compact mode', () => {
      render(<VerseCard verse={mockVerse} viewMode="compact" />);

      expect(screen.queryByText('Verse Details')).not.toBeInTheDocument();
    });

    it('hides metadata in minimal mode', () => {
      render(<VerseCard verse={mockVerse} viewMode="minimal" />);

      expect(screen.queryByText('Verse Details')).not.toBeInTheDocument();
    });
  });

  describe('Context Display', () => {
    it('shows context when showContext is true', () => {
      render(<VerseCard verse={mockVerse} showContext={true} viewMode="full" />);

      expect(screen.getByText('Contextual Notes:')).toBeInTheDocument();
      expect(screen.getByText('Opening verse of the Rigveda')).toBeInTheDocument();
      expect(screen.getByText('Sets the tone for the entire collection')).toBeInTheDocument();
    });

    it('hides context when showContext is false', () => {
      render(<VerseCard verse={mockVerse} showContext={false} viewMode="full" />);

      expect(screen.queryByText('Contextual Notes:')).not.toBeInTheDocument();
    });
  });

  describe('Bookmark Functionality', () => {
    it('shows bookmark button when enableBookmark is true', () => {
      render(<VerseCard verse={mockVerse} enableBookmark={true} />);

      const bookmarkButton = screen.getByLabelText('Add Bookmark');
      expect(bookmarkButton).toBeInTheDocument();
    });

    it('hides bookmark button when enableBookmark is false', () => {
      render(<VerseCard verse={mockVerse} enableBookmark={false} />);

      expect(screen.queryByLabelText('Add Bookmark')).not.toBeInTheDocument();
    });

    it('has proper accessibility for bookmark button', () => {
      render(<VerseCard verse={mockVerse} enableBookmark={true} />);

      const bookmarkButton = screen.getByLabelText('Add Bookmark');
      expect(bookmarkButton).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Audio Functionality', () => {
    it('shows audio button when enableAudio is true', () => {
      render(<VerseCard verse={mockVerse} enableAudio={true} />);

      const audioButton = screen.getByLabelText('Play audio');
      expect(audioButton).toBeInTheDocument();
    });

    it('hides audio button when enableAudio is false', () => {
      render(<VerseCard verse={mockVerse} enableAudio={false} />);

      expect(screen.queryByLabelText('Play audio')).not.toBeInTheDocument();
    });

    it('has proper accessibility for audio button', () => {
      render(<VerseCard verse={mockVerse} enableAudio={true} />);

      const audioButton = screen.getByLabelText('Play audio');
      expect(audioButton).toBeInTheDocument();
    });
  });

  describe('Click Handlers', () => {
    it('calls onVerseClick when card is clicked', async () => {
      const user = userEvent.setup();
      const onVerseClick = vi.fn();

      render(<VerseCard verse={mockVerse} onVerseClick={onVerseClick} />);

      const card = screen.getByLabelText('Verse RV.1.1.1');
      await user.click(card);

      expect(onVerseClick).toHaveBeenCalledWith('RV.1.1.1');
    });

    it('calls onVerseClick when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const onVerseClick = vi.fn();

      render(<VerseCard verse={mockVerse} onVerseClick={onVerseClick} />);

      const card = screen.getByLabelText('Verse RV.1.1.1');
      card.focus();
      await user.keyboard('{Enter}');

      expect(onVerseClick).toHaveBeenCalledWith('RV.1.1.1');
    });
  });

  describe('Daily Verse Styling', () => {
    it('applies special styling when isDailyVerse is true', () => {
      const { container } = render(<VerseCard verse={mockVerse} isDailyVerse={true} />);

      const card = container.querySelector('.from-vedic-cream\\/20');
      expect(card).toBeInTheDocument();
    });

    it('uses normal styling when isDailyVerse is false', () => {
      const { container } = render(<VerseCard verse={mockVerse} isDailyVerse={false} />);

      const card = container.querySelector('.bg-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles verse without translations', () => {
      const verseWithoutTranslations = {
        ...mockVerse,
        text: {
          ...mockVerse.text,
          translations: [],
        },
      };

      render(<VerseCard verse={verseWithoutTranslations} />);

      // Should still render without crashing
      expect(screen.getByText('1.1.1')).toBeInTheDocument();
    });

    it('handles verse without context', () => {
      const verseWithoutContext = {
        ...mockVerse,
        context: undefined,
      };

      render(<VerseCard verse={verseWithoutContext} viewMode="full" />);

      // Should not show context section
      expect(screen.queryByText('Contextual Notes:')).not.toBeInTheDocument();
    });

    it('handles verse without themes', () => {
      const verseWithoutThemes = {
        ...mockVerse,
        themes: [],
      };

      render(<VerseCard verse={verseWithoutThemes} viewMode="full" />);

      // Should still render without crashing
      expect(screen.getByText('Verse Details')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper focus management', () => {
      render(<VerseCard verse={mockVerse} />);

      const card = screen.getByLabelText('Verse RV.1.1.1');
      card.focus();

      expect(document.activeElement).toBe(card);
    });

    it('has screen reader text for bookmark status', () => {
      render(<VerseCard verse={mockVerse} enableBookmark={true} />);

      expect(screen.getByText('Not Bookmarked')).toBeInTheDocument();
    });

    it('uses semantic HTML with proper lang attributes', () => {
      render(<VerseCard verse={mockVerse} />);

      const sanskritText = screen.getByText(mockVerse.text.sanskrit);
      expect(sanskritText.closest('div')).toHaveAttribute('lang', 'sa');
    });
  });
});
