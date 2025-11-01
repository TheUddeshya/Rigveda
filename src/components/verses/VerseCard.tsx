import { useState, useRef, useEffect } from 'react';
import { useBookmarks } from '../../hooks/useBookmarks';
import { cn } from '../../lib/utils';
import { loadMandala } from '../../utils/verseLoader';

// TODO: Export Verse type to central types file later
interface Translation {
  language: string;
  translator: string;
  text: string;
  year?: number;
}

interface VerseData {
  id: string;
  mandala: number;
  sukta: number;
  verse: number;
  text: {
    sanskrit: string;
    iast: string;
    translations: Translation[];
  };
  metadata: {
    deity: { primary: string; secondary?: string | null };
    rishi: { name: string; gotra?: string; family?: string };
    meter: string;
    category?: string;
  };
  themes: string[];
  context?: {
    significance?: string;
    note?: string;
  };
}

type VerseCardProps = {
  verse: VerseData;
  viewMode?: 'full' | 'compact' | 'minimal';
  showContext?: boolean;
  showTranslation?: boolean;
  enableAudio?: boolean;
  enableBookmark?: boolean;
  onVerseClick?: (id: string) => void;
  isDailyVerse?: boolean; // New prop for distinguishing daily verse card
};

const VerseCard = ({
  verse,
  viewMode = 'full',
  showContext = true,
  showTranslation = true,
  enableAudio = true,
  enableBookmark = true,
  onVerseClick,
  isDailyVerse = false,
}: VerseCardProps) => {
  // Local copy of verse that we may enrich by lazy-loading its mandala if
  // incoming `verse` lacks metadata or translations.
  const [localVerse, setLocalVerse] = useState<VerseData>(verse);

  const [tab, setTab] = useState<'sanskrit' | 'iast' | 'translation'>('sanskrit');
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    verse.text.translations && verse.text.translations.length > 0 ? [verse.text.translations[0].translator] : []
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allTranslators = (localVerse.text?.translations || []).map(t => t.translator);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const audioFilePath = `/assets/audio/${localVerse.mandala}-${localVerse.sukta}-${localVerse.verse}.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        console.error(`Error loading audio for ${audioFilePath}`);
        setIsPlaying(false);
      };
    }
  }, [audioFilePath]);

  // If incoming verse is missing key metadata (deity or translations), try
  // to lazy-load the mandala and enrich localVerse with the detailed entry.
  useEffect(() => {
    let mounted = true;
    // Basic detection of missing metadata
    const needsLoad = !verse.metadata || !verse.metadata.deity || !verse.text || !verse.text.translations || verse.text.translations.length === 0;
    if (!needsLoad) {
      setLocalVerse(verse);
      return;
    }

    (async () => {
      try {
        const mandalaData = await loadMandala(verse.mandala);
        if (!mounted) return;
        const found = mandalaData.find(v => String(v.id) === String(verse.id));
        if (found) {
          // Merge shallowly: prefer found fields but keep existing where present
          const merged = { ...verse, ...found } as VerseData;
          setLocalVerse(merged);
          if (merged.text?.translations && merged.text.translations.length > 0) {
            setSelectedTranslations([merged.text.translations[0].translator]);
          }
        } else {
          // No detailed entry found; keep provided verse
          setLocalVerse(verse);
        }
      } catch (err) {
        console.warn('Failed to lazy-load mandala for verse card', err);
        setLocalVerse(verse);
      }
    })();

    return () => { mounted = false; };
  }, [verse]);

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTranslationToggle = (translator: string) => {
    setSelectedTranslations(prev =>
      prev.includes(translator)
        ? prev.filter(t => t !== translator)
        : [...prev, translator]
    );
  };

  const getSelectedTranslationObjects = () => {
    return (localVerse.text?.translations || []).filter(t => selectedTranslations.includes(t.translator));
  };

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => onVerseClick?.(verse.id)}
      onKeyDown={e => e.key === 'Enter' && onVerseClick?.(verse.id)}
      className={cn(
        "group relative mb-6 md:mb-8 overflow-hidden cursor-pointer",
        isDailyVerse
          ? "bg-gradient-to-br from-vedic-cream/20 to-vedic-sage/20 border-2 border-vedic-accent shadow-2xl shadow-vedic-accent/30"
          : "bg-card border border-vedic-accent",
        "text-card-foreground rounded-xl",
        "transition-all duration-300 ease-out",
        "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "px-4 py-4 sm:px-6 md:px-8 md:py-6"
      )}
      aria-label={`Verse ${localVerse.id}`}
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-vedic-sage to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header: Mandala, Sukta, Verse, Bookmark, Audio */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-vedic-ui/50 border border-vedic-accent/20 bg-vedic-sage/10">
              <span className="text-vedic-text font-semibold text-sm md:text-base font-ui">
              {localVerse.mandala}.{localVerse.sukta}.{localVerse.verse}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
              {enableBookmark && (
            <button
                  aria-label={isBookmarked(localVerse.id) ? 'Remove Bookmark' : 'Add Bookmark'}
              title={isBookmarked(verse.id) ? 'Bookmarked' : 'Add bookmark'}
              className={cn(
                "min-w-[44px] min-h-[44px] flex items-center justify-center",
                "rounded-lg transition-all duration-200",
                "hover:bg-vedic-sage/20",
                isBookmarked(verse.id)
                  ? 'text-vedic-gold'
                  : 'text-muted-foreground hover:text-vedic-gold'
              )}
              tabIndex={0}
              onClick={e => {e.stopPropagation(); toggleBookmark(verse.id);}}
              onKeyDown={e => {if (e.key === 'Enter') {e.stopPropagation(); toggleBookmark(verse.id);}}}
            >
              <span className="text-2xl">{isBookmarked(verse.id) ? '★' : '☆'}</span>
              <span className="sr-only">{isBookmarked(verse.id) ? 'Bookmarked' : 'Not Bookmarked'}</span>
            </button>
          )}
              {enableAudio && (
            <button
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              className={cn(
                "min-w-[44px] min-h-[44px] flex items-center justify-center",
                "rounded-lg transition-all duration-200",
                "text-muted-foreground hover:text-vedic-text hover:bg-vedic-sage/20",
                "hover:scale-110",
                isPlaying && "text-accent"
              )}
              onClick={handleAudioToggle}
            >
              <span className="text-xl">{isPlaying ? '⏸️' : '🔊'}</span>
            </button>
          )}
        {enableAudio && <audio ref={audioRef} src={audioFilePath} preload="none" />}
        </div>
      </div>

      {/* Tabs for Sanskrit/IAST/Translation */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200",
            "border border-vedic-accent/20",
            tab === 'sanskrit'
              ? 'bg-accent text-accent-foreground shadow-md'
              : 'bg-vedic-ui/30 text-muted-foreground hover:bg-vedic-sage/20 hover:text-foreground',
            "font-sanskrit"
          )}
          onClick={e => { e.stopPropagation(); setTab('sanskrit'); }}
        >
          Sanskrit
        </button>
        <button
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200",
            "border border-vedic-accent/20",
            tab === 'iast'
              ? 'bg-accent text-accent-foreground shadow-md'
              : 'bg-vedic-ui/30 text-muted-foreground hover:bg-vedic-sage/20 hover:text-foreground',
            "font-transliteration"
          )}
          onClick={e => { e.stopPropagation(); setTab('iast'); }}
        >
          IAST
        </button>
        {showTranslation && (
          <button
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200",
              "border border-vedic-accent/20",
              tab === 'translation'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-vedic-ui/30 text-muted-foreground hover:bg-vedic-sage/20 hover:text-foreground',
            "font-reading"
            )}
            onClick={e => { e.stopPropagation(); setTab('translation'); }}
          >
            Translation
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="mb-6 min-h-[3em]">
            {tab === 'sanskrit' && (
          <div className="text-2xl sm:text-3xl md:text-4xl font-sanskrit leading-relaxed text-foreground animate-fade-in" lang="sa">
            {localVerse.text?.sanskrit}
          </div>
        )}
        {tab === 'iast' && (
          <div className="text-lg sm:text-xl md:text-2xl font-transliteration leading-relaxed text-foreground animate-fade-in" lang="sa-Latn">
            {localVerse.text?.iast}
          </div>
        )}
        {tab === 'translation' && (
          <div className="animate-fade-in">
            <div className="mb-3 text-sm flex items-center gap-2 text-muted-foreground">
              <span className="italic">Select Translations:</span>
              <div className="flex flex-wrap gap-2">
                {allTranslators.map(tr => (
                  <button
                    key={tr}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      selectedTranslations.includes(tr)
                        ? "bg-accent text-accent-foreground"
                        : "bg-vedic-ui/30 text-muted-foreground hover:bg-vedic-sage/20"
                    )}
                    onClick={e => { e.stopPropagation(); handleTranslationToggle(tr); }}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </div>
            {getSelectedTranslationObjects().map((t, index) => (
              <div key={t.translator} className={cn("mb-4", index > 0 && "mt-4 pt-4 border-t border-vedic-accent/20")}>
                <p className="text-sm font-semibold text-vedic-text mb-2">{t.translator} ({t.language})</p>
                <p className="text-lg leading-relaxed text-foreground">{t.text}</p>
              </div>
            ))}
            {selectedTranslations.length === 0 && (
              <p className="text-muted-foreground">Please select at least one translation to view.</p>
            )}
          </div>
        )}
      </div>

      {/* Metadata and Context */}
      {viewMode === 'full' && (
        <div className="mt-6 pt-6 border-t border-vedic-accent/20">
          <h3 className="text-lg font-bold mb-4 text-vedic-text">Verse Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold text-vedic-sage">Deity:</span> {localVerse.metadata?.deity?.primary ?? '—'}</p>
              <p><span className="font-semibold text-vedic-sage">Rishi:</span> {localVerse.metadata?.rishi?.name ?? '—'}</p>
              <p><span className="font-semibold text-vedic-sage">Meter:</span> {localVerse.metadata?.meter ?? '—'}</p>
            </div>
            <div>
              <p><span className="font-semibold text-vedic-sage">Themes:</span> {(localVerse.themes || []).join(', ')}</p>
              {localVerse.metadata?.category && <p><span className="font-semibold text-vedic-sage">Category:</span> {localVerse.metadata?.category}</p>}
            </div>
          </div>
          {showContext && localVerse.context && (
            <div className="mt-4 p-4 bg-vedic-ui/50 border border-vedic-accent/20 rounded-lg">
              <h4 className="font-semibold text-vedic-sage mb-2">Contextual Notes:</h4>
              {localVerse.context?.significance && <p className="text-sm mb-1">{localVerse.context.significance}</p>}
              {localVerse.context?.note && <p className="text-sm italic text-muted-foreground">{localVerse.context.note}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerseCard;
