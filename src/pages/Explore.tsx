import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import FilterPanel from '../components/filters/FilterPanel';
import KeyboardShortcutsDialog from '../components/ui/KeyboardShortcutsDialog';
import { useVerses } from '../hooks/useVerses';
import { loadMandala } from '../utils/verseLoader';
import { useSearch } from '../hooks/useSearch';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUIStore } from '../store/uiStore';
import type { VerseData } from '../store/verseStore';
import SearchHistory from '../components/explore/SearchHistory';
import LoadingState from '../components/explore/LoadingState';
import ErrorState from '../components/explore/ErrorState';
import MandalaGrid from '../components/explore/MandalaGrid';
import VerseList from '../components/explore/VerseList';

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

  // Memoize filtered verses calculation to avoid re-filtering on every render
  const filteredVerses = useMemo(() => {
    const versesToFilter = currentFilters.search && results.length > 0 ? results : sourceAllVerses;
    return versesToFilter.filter((v: VerseData) => {
      if (currentFilters.mandala && v.mandala !== currentFilters.mandala) return false;
      if (currentFilters.sukta && v.sukta !== currentFilters.sukta) return false;
      if (currentFilters.deity && v.metadata?.deity?.primary !== currentFilters.deity) return false;
      if (currentFilters.rishi && v.metadata?.rishi?.name !== currentFilters.rishi) return false;
      if (currentFilters.meter && v.metadata?.meter !== currentFilters.meter) return false;
      if (currentFilters.theme && !v.themes?.includes(currentFilters.theme)) return false;
      return true;
    });
  }, [currentFilters, results, sourceAllVerses]);

  // Memoize event handlers to prevent re-creating functions on every render
  const handleSearchHistoryClick = useCallback((searchItem: string) => {
    setCurrentFilters(prev => ({ ...prev, search: searchItem }));
  }, []);

  // Keyboard navigation for verses - memoized to avoid recreation
  const navigateToVerse = useCallback((direction: 'next' | 'prev') => {
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
  }, [filteredVerses.length, focusedVerseIndex]);

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

  // Check if we should show mandala cards (no search performed) - memoized
  const showMandalaCards = useMemo(
    () => !currentFilters.search && results.length === 0 && filteredVerses.length === sourceAllVerses.length,
    [currentFilters.search, results.length, filteredVerses.length, sourceAllVerses.length]
  );

  return (
    <PageLayout>
      <KeyboardShortcutsDialog isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <div className="min-h-screen bg-gradient-to-b from-vedic-ui via-vedic-bg to-vedic-ui py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-reading mb-6 md:mb-8 font-bold text-vedic-text">Explore the Verses</h1>
          <FilterPanel allVerses={sourceAllVerses} currentFilters={currentFilters} onFilterChange={setCurrentFilters} />

          <SearchHistory
            history={history}
            onHistoryClick={handleSearchHistoryClick}
            onClearHistory={clearHistory}
          />

          {( (loading && !currentFilters.mandala) || (currentFilters.mandala && loadingMandala === currentFilters.mandala) ) && (
            <LoadingState />
          )}

          {error && <ErrorState error={error} />}

          {!((loading && !currentFilters.mandala) || (currentFilters.mandala && loadingMandala === currentFilters.mandala)) && !error && (
            <>
              {showMandalaCards ? (
                <MandalaGrid />
              ) : (
                <VerseList
                  verses={filteredVerses}
                  sourceVerseCount={sourceAllVerses.length}
                  verseRefs={verseRefs}
                  onFocusVerse={setFocusedVerseIndex}
                  onClearFilters={() => setCurrentFilters({})}
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Explore;