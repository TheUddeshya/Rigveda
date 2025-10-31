import { useState, useEffect, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import VerseCard from '../components/verses/VerseCard';
import FilterPanel from '../components/filters/FilterPanel';
import KeyboardShortcutsDialog from '../components/ui/KeyboardShortcutsDialog';
import { useVerses } from '../hooks/useVerses';
import { loadMandala } from '../utils/verseLoader';
import { useSearch } from '../hooks/useSearch';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUIStore } from '../store/uiStore';
import type { VerseData } from '../store/verseStore';
import { XCircle } from 'lucide-react';

interface Filters {
  mandala?: number;
  sukta?: number;
  deity?: string;
  rishi?: string;
  meter?: string;
  theme?: string;
  search?: string;
}

const Explore = () => {
  const { verses, loading, error } = useVerses();
  const [currentFilters, setCurrentFilters] = useState<Filters>({});

  // When a single mandala is selected, we may lazily load just that mandala
  // to avoid requiring the entire dataset up-front.
  const [mandalaVerses, setMandalaVerses] = useState<VerseData[]>([]);
  const [loadingMandala, setLoadingMandala] = useState<number | null>(null);

  // Source verses for searching and filtering: if a mandala filter is set and
  // we've loaded that mandala, prefer those verses. Otherwise fall back to the
  // global `verses` array (which may be empty until full load completes).
  const sourceAllVerses = currentFilters.mandala
    ? (mandalaVerses.length > 0 ? mandalaVerses : verses)
    : verses;

  const { results, setQuery, history, clearHistory } = useSearch(sourceAllVerses);
  const { sidebarOpen, setSidebarOpen, filtersOpen, setFiltersOpen } = useUIStore();
  const [focusedVerseIndex, setFocusedVerseIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const verseRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Handle search query changes
  useEffect(() => {
    if (currentFilters.search) {
      setQuery(currentFilters.search);
    } else {
      setQuery('');
    }
  }, [currentFilters.search, setQuery]);

  // Load a single mandala when the mandala filter changes
  useEffect(() => {
    const m = currentFilters.mandala;
    if (!m) {
      setMandalaVerses([]);
      setLoadingMandala(null);
      return;
    }
    let mounted = true;
    setLoadingMandala(m);
    loadMandala(m).then(data => {
      if (!mounted) return;
      setMandalaVerses(data || []);
      setLoadingMandala(null);
    }).catch(err => {
      console.warn(`Failed to load mandala ${m}:`, err);
      if (mounted) setLoadingMandala(null);
    });
    return () => { mounted = false; };
  }, [currentFilters.mandala]);

  // Filter verses based on all criteria
  const filteredVerses = (currentFilters.search && results.length > 0 ? results : sourceAllVerses).filter((v: VerseData) => {
    if (currentFilters.mandala && v.mandala !== currentFilters.mandala) return false;
    if (currentFilters.sukta && v.sukta !== currentFilters.sukta) return false;
    if (currentFilters.deity && v.metadata?.deity?.primary !== currentFilters.deity) return false;
    if (currentFilters.rishi && v.metadata?.rishi?.name !== currentFilters.rishi) return false;
    if (currentFilters.meter && v.metadata?.meter !== currentFilters.meter) return false;
    if (currentFilters.theme && !v.themes?.includes(currentFilters.theme)) return false;
    return true;
  });

  const handleSearchHistoryClick = (searchItem: string) => {
    setCurrentFilters(prev => ({ ...prev, search: searchItem }));
  };

  // Keyboard navigation for verses
  const navigateToVerse = (direction: 'next' | 'prev') => {
    if (filteredVerses.length === 0) return;

    let newIndex = focusedVerseIndex;
    if (direction === 'next') {
      newIndex = (focusedVerseIndex + 1) % filteredVerses.length;
    } else {
      newIndex = focusedVerseIndex === 0 ? filteredVerses.length - 1 : focusedVerseIndex - 1;
    }

    setFocusedVerseIndex(newIndex);
    verseRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    verseRefs.current[newIndex]?.focus();
  };

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '?',
      shiftKey: true,
      description: 'Show keyboard shortcuts',
      handler: () => setShowShortcuts(true),
    },
    {
      key: 's',
      ctrlKey: true,
      description: 'Toggle sidebar',
      handler: () => setSidebarOpen(!sidebarOpen),
    },
    {
      key: 'f',
      ctrlKey: true,
      description: 'Toggle filters',
      handler: () => setFiltersOpen(!filtersOpen),
    },
    {
      key: '/',
      description: 'Focus search',
      handler: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
    },
    {
      key: 'c',
      altKey: true,
      description: 'Clear all filters',
      handler: () => setCurrentFilters({}),
    },
    {
      key: 'Escape',
      description: 'Close panels',
      handler: () => {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (filtersOpen) {
          setFiltersOpen(false);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      },
    },
    {
      key: 'j',
      description: 'Next verse',
      handler: () => navigateToVerse('next'),
    },
    {
      key: 'k',
      description: 'Previous verse',
      handler: () => navigateToVerse('prev'),
    },
  ]);

  return (
    <PageLayout>
      <KeyboardShortcutsDialog isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <div className="min-h-screen bg-gradient-to-b from-vedic-ui via-vedic-bg to-vedic-ui py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-reading mb-6 md:mb-8 font-bold text-vedic-text">Explore the Verses</h1>
          <FilterPanel allVerses={sourceAllVerses} currentFilters={currentFilters} onFilterChange={setCurrentFilters} />

          {/* Search History */}
          {history.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-vedic-text">Recent Searches</h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-muted-foreground hover:text-vedic-text flex items-center gap-1"
                >
                  <XCircle size={16} /> Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchHistoryClick(item)}
                    className="px-4 py-2 rounded-full bg-vedic-ui/50 text-vedic-sage text-sm hover:bg-vedic-sage/20 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {( (loading && !currentFilters.mandala) || (currentFilters.mandala && loadingMandala === currentFilters.mandala) ) && (
            <div className="text-center text-xl py-8 text-vedic-text">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="mt-4">Loading verses...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-500/30">
              Error: {error}
            </div>
          )}

          {!((loading && !currentFilters.mandala) || (currentFilters.mandala && loadingMandala === currentFilters.mandala)) && !error && (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredVerses.length} of {sourceAllVerses.length} verses
              </div>
              <div className="space-y-6">
                {filteredVerses.length > 0 ? (
                  filteredVerses.map((verse: VerseData, index: number) => (
                    <div
                      key={verse.id}
                      ref={(el) => { verseRefs.current[index] = el }}
                      tabIndex={0}
                      onFocus={() => setFocusedVerseIndex(index)}
                    >
                      <VerseCard
                        verse={verse}
                        viewMode="full"
                        showContext
                        showTranslation
                        enableAudio={false}
                        enableBookmark
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-6">No verses match your filters</p>
                    <button
                      onClick={() => setCurrentFilters({})}
                      className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Explore;
