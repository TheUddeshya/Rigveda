import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
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
import ErrorState from '../components/explore/ErrorState';
import MandalaGrid from '../components/explore/MandalaGrid';
import SuktaGrid from '../components/explore/SuktaGrid';
import VerseList from '../components/explore/VerseList';
import VerseSkeleton from '../components/loading/VerseSkeleton';
import FilterSkeleton from '../components/loading/FilterSkeleton';

type ViewMode = 'mandalas' | 'suktas' | 'verses';

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
  const [viewMode, setViewMode] = useState<ViewMode>('mandalas');
  const [selectedMandala, setSelectedMandala] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  // Load a single mandala when selected
  useEffect(() => {
    const m = selectedMandala || currentFilters.mandala;
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
  }, [selectedMandala, currentFilters.mandala]);

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

  const handleMandalaSelect = useCallback((mandalaId: number) => {
    setSelectedMandala(mandalaId);
    setViewMode('suktas');
  }, []);

  const handleSuktaSelect = useCallback((suktaNumber: number) => {
    setCurrentFilters(prev => ({
      ...prev,
      mandala: selectedMandala || undefined,
      sukta: suktaNumber
    }));
    setViewMode('verses');
  }, [selectedMandala]);

  const handleBackToMandalas = useCallback(() => {
    setSelectedMandala(null);
    setViewMode('mandalas');
    setCurrentFilters({});
  }, []);

  const handleBackToSuktas = useCallback(() => {
    setViewMode('suktas');
    setCurrentFilters(prev => {
      const { sukta, ...rest } = prev;
      return rest;
    });
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

  return (
    <PageLayout>
      <KeyboardShortcutsDialog isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <div className="min-h-screen bg-gradient-to-b from-vedic-ui via-vedic-bg to-vedic-ui py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search bar with integrated filter toggle - Always visible */}
          <div className="mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                className={cn(
                  "w-full pl-10 pr-28 py-2.5 rounded-lg min-h-[44px]",
                  "bg-vedic-ui/30 text-foreground border border-vedic-accent/20",
                  "placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent",
                  "transition-all duration-200"
                )}
                value={currentFilters.search || ''}
                onChange={e => setCurrentFilters({ ...currentFilters, search: e.target.value })}
                placeholder="Search verses, deities, keywords..."
              />
              {/* Filter toggle button - visible on all pages */}
              <button
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2",
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium",
                  "bg-vedic-sage/20 text-foreground border border-vedic-accent/20",
                  "hover:bg-vedic-sage/30",
                  "transition-all duration-200"
                )}
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-label={showFilters ? "Hide filters" : "Show filters"}
              >
                <Filter size={16} className="text-accent" />
                <span>Filters</span>
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Compact filters panel below search bar - visible on all pages when toggled */}
            {showFilters && (
              <div className="mt-3 p-4 rounded-lg bg-card/50 border border-vedic-accent/20">
                {loading && !currentFilters.mandala ? (
                  <FilterSkeleton />
                ) : (
                  <FilterPanel allVerses={sourceAllVerses} currentFilters={currentFilters} onFilterChange={setCurrentFilters} />
                )}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-reading mb-6 md:mb-8 font-bold text-vedic-text">Explore the Verses</h1>

          {/* Search history only in verses view */}
          {viewMode === 'verses' && (
            <SearchHistory
              history={history}
              onHistoryClick={handleSearchHistoryClick}
              onClearHistory={clearHistory}
            />
          )}

          {( (loading && viewMode === 'mandalas') || (selectedMandala && loadingMandala === selectedMandala) ) && (
            <VerseSkeleton count={3} />
          )}

          {error && <ErrorState error={error} />}

          {/* Mandala Grid View */}
          {viewMode === 'mandalas' && !loading && !error && (
            <MandalaGrid onMandalaSelect={handleMandalaSelect} />
          )}

          {/* Sukta Grid View */}
          {viewMode === 'suktas' && selectedMandala && !loadingMandala && !error && (
            <SuktaGrid
              verses={mandalaVerses.length > 0 ? mandalaVerses : verses}
              mandalaId={selectedMandala}
              onSuktaSelect={handleSuktaSelect}
              onBack={handleBackToMandalas}
            />
          )}

          {/* Verse List View */}
          {viewMode === 'verses' && !((loading && !currentFilters.mandala) || (currentFilters.mandala && loadingMandala === currentFilters.mandala)) && !error && (
            <>
              <div className="mb-4">
                <button
                  onClick={handleBackToSuktas}
                  className="text-accent hover:text-accent/80 font-medium flex items-center gap-2"
                  aria-label="Back to Suktas"
                >
                  ← Back to Suktas
                </button>
              </div>
              <VerseList
                verses={filteredVerses}
                sourceVerseCount={sourceAllVerses.length}
                verseRefs={verseRefs}
                onFocusVerse={setFocusedVerseIndex}
                onClearFilters={() => {
                  setCurrentFilters({});
                  handleBackToSuktas();
                }}
              />
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Explore;