import DailyVerseCard from '../verses/DailyVerseCard';

interface DailyVerseSectionProps {
  loading: boolean;
}

const DailyVerseSection = ({ loading }: DailyVerseSectionProps) => {
  return (
    <section className="flex flex-col items-center py-12 sm:py-16 px-4 max-w-4xl mx-auto">
      <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-vedic-text">Daily Verse</h3>
      {loading ? (
        <div className="text-center text-muted-foreground">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-accent mb-4"></div>
          <p>Loading featured verse...</p>
        </div>
      ) : (
        <DailyVerseCard />
      )}
    </section>
  );
};

export default DailyVerseSection;
