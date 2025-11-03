interface SuktaInfo {
  sukta: number;
  verseCount: number;
  deity: string;
  rishi: string;
  meter: string;
}

interface SuktaCardProps {
  suktaInfo: SuktaInfo;
  mandalaId: number;
  onSelect: (suktaNumber: number) => void;
}

const SuktaCard = ({ suktaInfo, mandalaId, onSelect }: SuktaCardProps) => (
  <article
    className="bg-vedic-ui/50 rounded-xl p-5 hover:bg-vedic-ui/70 transition-all duration-200 border border-vedic-ui/30 hover:border-accent/30 cursor-pointer"
    role="listitem"
    aria-label={`Sukta ${suktaInfo.sukta} of Mandala ${mandalaId}`}
    onClick={() => onSelect(suktaInfo.sukta)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(suktaInfo.sukta);
      }
    }}
    tabIndex={0}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-bold text-vedic-text">
        Sukta {suktaInfo.sukta}
      </h3>
      <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs" aria-label={`${suktaInfo.verseCount} verses`}>
        {suktaInfo.verseCount} verses
      </span>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex items-center text-muted-foreground">
        <span className="font-semibold text-vedic-text/80 min-w-[60px]">Deity:</span>
        <span>{suktaInfo.deity}</span>
      </div>
      <div className="flex items-center text-muted-foreground">
        <span className="font-semibold text-vedic-text/80 min-w-[60px]">Rishi:</span>
        <span>{suktaInfo.rishi}</span>
      </div>
      <div className="flex items-center text-muted-foreground">
        <span className="font-semibold text-vedic-text/80 min-w-[60px]">Meter:</span>
        <span>{suktaInfo.meter}</span>
      </div>
    </div>

    <div className="mt-3 text-right">
      <span className="text-accent hover:text-accent/80 font-medium text-sm">
        View verses →
      </span>
    </div>
  </article>
);

export default SuktaCard;
