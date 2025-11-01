import { useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useVerseStore } from '../store/verseStore';
import { useVerses } from '../hooks/useVerses';
import HeroSection from '../components/home/HeroSection';
import DailyVerseSection from '../components/home/DailyVerseSection';
import LearnSection from '../components/home/LearnSection';

const Home = () => {
  const { verses, loading } = useVerses();
  const { featuredVerse, setFeaturedVerse } = useVerseStore();

  useEffect(() => {
    if (verses.length > 0 && !featuredVerse) {
      // Simple daily selection: use date as seed
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').reduce((acc, part) => acc + parseInt(part), 0);
      const randomIndex = seed % verses.length;
      setFeaturedVerse(verses[randomIndex]);
    }
  }, [verses, featuredVerse, setFeaturedVerse]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-vedic-charcoal via-vedic-slate to-vedic-charcoal">
        <HeroSection />
        <DailyVerseSection loading={loading} />
        <LearnSection />
      </div>
    </PageLayout>
  );
};

export default Home;
