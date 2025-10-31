import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import VerseCard from '../components/verses/VerseCard';
import FilterPanel from '../components/filters/FilterPanel';
import { useVerses } from '../hooks/useVerses';
import { useSearch } from '../hooks/useSearch';
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
  const { results, setQuery, history, clearHistory } = useSearch(verses);

  // Handle search query changes
  useEffect(() => {
    if (currentFilters.search) {
      setQuery(currentFilters.search);
    } else {
      setQuery('');
    }
  }, [currentFilters.search, setQuery]);

  // Filter verses based on all criteria
  const filteredVerses = (currentFilters.search && results.length > 0 ? results : verses).filter((v: VerseData) => {
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

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-vedic-charcoal via-vedic-slate to-vedic-charcoal py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-reading mb-6 md:mb-8 font-bold text-vedic-cream">Explore the Verses</h1>
          <FilterPanel allVerses={verses} currentFilters={currentFilters} onFilterChange={setCurrentFilters} />

          {/* Search History */}
          {history.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-vedic-cream">Recent Searches</h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-muted-foreground hover:text-vedic-cream flex items-center gap-1"
                >
                  <XCircle size={16} /> Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchHistoryClick(item)}
                    className="px-4 py-2 rounded-full bg-vedic-charcoal/50 text-vedic-sage text-sm hover:bg-vedic-sage/20 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center text-xl py-8 text-vedic-cream">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="mt-4">Loading verses...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-500/30">
              Error: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredVerses.length} of {verses.length} verses
              </div>
              <div className="space-y-6">
                {filteredVerses.length > 0 ? (
                  filteredVerses.map((verse: VerseData) => (
                    <VerseCard
                      key={verse.id}
                      verse={verse}
                      viewMode="full"
                      showContext
                      showTranslation
                      enableAudio={false}
                      enableBookmark
                    />
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
