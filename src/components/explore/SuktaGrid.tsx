import { useMemo } from 'react';
import SuktaCard from './SuktaCard';
import type { VerseData } from '../../store/verseStore';

interface SuktaGridProps {
  verses: VerseData[];
  mandalaId: number;
  onSuktaSelect: (suktaNumber: number) => void;
  onBack: () => void;
}

const SuktaGrid = ({ verses, mandalaId, onSuktaSelect, onBack }: SuktaGridProps) => {
  // Group verses by sukta and calculate sukta info
  const suktaList = useMemo(() => {
    const suktaMap = new Map<number, {
      sukta: number;
      verseCount: number;
      deity: string;
      rishi: string;
      meter: string;
    }>();

    verses.forEach(verse => {
      if (verse.mandala === mandalaId) {
        const existing = suktaMap.get(verse.sukta);
        if (existing) {
          existing.verseCount++;
        } else {
          suktaMap.set(verse.sukta, {
            sukta: verse.sukta,
            verseCount: 1,
            deity: verse.metadata?.deity?.primary || 'Unknown',
            rishi: verse.metadata?.rishi?.name || 'Unknown',
            meter: verse.metadata?.meter || 'Unknown',
          });
        }
      }
    });

    return Array.from(suktaMap.values()).sort((a, b) => a.sukta - b.sukta);
  }, [verses, mandalaId]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-accent hover:text-accent/80 font-medium flex items-center gap-2"
          aria-label="Back to Mandalas"
        >
          ← Back to Mandalas
        </button>
        <h2 className="text-2xl font-bold text-vedic-text">
          Mandala {mandalaId} - Suktas
        </h2>
      </div>

      {suktaList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No suktas found for this mandala.</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          role="list"
          aria-label={`Suktas of Mandala ${mandalaId}`}
        >
          {suktaList.map(suktaInfo => (
            <SuktaCard
              key={suktaInfo.sukta}
              suktaInfo={suktaInfo}
              mandalaId={mandalaId}
              onSelect={onSuktaSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SuktaGrid;
