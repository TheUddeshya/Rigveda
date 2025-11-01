import React from 'react';
import { useVerseStore } from '../../store/verseStore';
import { useVerses } from '../../hooks/useVerses';
import { cn } from '../../lib/utils';

const DailyVerseCard = () => {
  const { verses, loading } = useVerses();
  const { featuredVerse, setFeaturedVerse } = useVerseStore();

  React.useEffect(() => {
    if (verses.length > 0 && !featuredVerse) {
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').reduce((acc, part) => acc + parseInt(part), 0);
      const randomIndex = seed % verses.length;
      setFeaturedVerse(verses[randomIndex]);
    }
  }, [verses, featuredVerse, setFeaturedVerse]);

  if (loading) {
    return (
      <div className="text-center text-muted-foreground">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-accent mb-4"></div>
        <p>Loading daily verse...</p>
      </div>
    );
  }

  if (!featuredVerse) {
    return <div className="text-muted-foreground">No daily verse available</div>;
  }

  return (
    <div className={cn(
      "relative mb-6 md:mb-8 overflow-hidden",
      "bg-gradient-to-br from-vedic-cream/20 to-vedic-sage/20 border-2 border-vedic-accent shadow-2xl shadow-vedic-accent/30",
      "text-card-foreground rounded-xl",
      "p-6 md:p-8",
      "flex flex-col items-center justify-center text-center"
    )}>
      <h4 className="text-3xl font-sanskrit mb-4 text-vedic-text">{featuredVerse.text.sanskrit}</h4>
      <p className="text-lg font-transliteration mb-6 text-vedic-text">{featuredVerse.text.iast}</p>
      <p className="text-md font-reading text-muted-foreground">{featuredVerse.text.translations[0]?.text}</p>
      <p className="text-sm text-vedic-text mt-4">— {featuredVerse.mandala}.{featuredVerse.sukta}.{featuredVerse.verse}</p>
    </div>
  );
};

export default DailyVerseCard;