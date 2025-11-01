import { Compass } from 'lucide-react';

const ReadingGuideCard = () => {
  return (
    <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
      <h4 className="text-2xl font-bold mb-4 text-vedic-text flex items-center gap-2">
        <Compass size={24} />
        How to Approach the Text
      </h4>
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="text-accent font-bold">1.</div>
          <div>
            <h5 className="font-bold mb-1 text-foreground">Start with Famous Hymns</h5>
            <p className="text-sm text-muted-foreground">
              Begin with well-known hymns like the Nasadiya Sukta (10.129 - Creation Hymn) or the Purusha Sukta (10.90).
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-accent font-bold">2.</div>
          <div>
            <h5 className="font-bold mb-1 text-foreground">Read Multiple Translations</h5>
            <p className="text-sm text-muted-foreground">
              Compare different scholarly translations to understand varying interpretations and nuances.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-accent font-bold">3.</div>
          <div>
            <h5 className="font-bold mb-1 text-foreground">Understand the Context</h5>
            <p className="text-sm text-muted-foreground">
              Learn about Vedic rituals, society, and cosmology to better appreciate the hymns' meanings.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-accent font-bold">4.</div>
          <div>
            <h5 className="font-bold mb-1 text-foreground">Look for Layers of Meaning</h5>
            <p className="text-sm text-muted-foreground">
              Vedic hymns often have multiple levels: literal (ritual), symbolic (psychological), and philosophical (metaphysical).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingGuideCard;
