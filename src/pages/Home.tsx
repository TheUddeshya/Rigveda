import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import VerseCard from '../components/verses/VerseCard';
import { useVerseStore } from '../store/verseStore';
import { useVerses } from '../hooks/useVerses';
import { useEffect } from 'react';
import { cn } from '../lib/utils';

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
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center py-16 md:py-24 px-4"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-sanskrit mb-8 text-center text-vedic-cream"
          >ॐ भूर्भुवः स्वः</motion.h1>
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl sm:text-4xl mb-4 font-reading text-center text-vedic-cream"
          >Explore the Rig Veda</motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-10 text-lg text-center font-reading text-vedic-sage"
          >The oldest scripture of humanity</motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link to="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "rounded-full px-10 py-4 sm:px-14 sm:py-5 text-lg font-semibold",
                  "bg-accent text-accent-foreground",
                  "hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/20",
                  "transition-all duration-300",
                  "border-2 border-accent/50 hover:border-accent",
                  "min-h-[44px] min-w-[44px]"
                )}
              >Begin Your Journey →</motion.button>
            </Link>
          </motion.div>
        </motion.section>

        <section className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 py-8 sm:py-12 px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className={cn(
              "rounded-xl px-8 py-6 text-center",
              "bg-card border border-vedic-sage/20 shadow-xl",
              "hover:border-accent hover:shadow-2xl hover:shadow-accent/10",
              "transition-all duration-300"
            )}
          >
            <div className="text-4xl font-bold text-vedic-cream">10</div>
            <div className="text-sm text-muted-foreground mt-2">Mandalas</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={cn(
              "rounded-xl px-8 py-6 text-center",
              "bg-card border border-vedic-sage/20 shadow-xl",
              "hover:border-accent hover:shadow-2xl hover:shadow-accent/10",
              "transition-all duration-300"
            )}
          >
            <div className="text-4xl font-bold text-vedic-cream">1,028</div>
            <div className="text-sm text-muted-foreground mt-2">Hymns</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className={cn(
              "rounded-xl px-8 py-6 text-center",
              "bg-card border border-vedic-sage/20 shadow-xl",
              "hover:border-accent hover:shadow-2xl hover:shadow-accent/10",
              "transition-all duration-300"
            )}
          >
            <div className="text-4xl font-bold text-vedic-cream">10,552</div>
            <div className="text-sm text-muted-foreground mt-2">Verses</div>
          </motion.div>
        </section>

        <section className="flex flex-col items-center py-12 sm:py-16 px-4 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-vedic-cream">Featured Daily Verse</h3>
          {loading ? (
            <div className="text-center text-muted-foreground">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-accent mb-4"></div>
              <p>Loading featured verse...</p>
            </div>
          ) : featuredVerse ? (
            <VerseCard
              verse={featuredVerse}
              viewMode="full"
              showContext={true}
              showTranslation={true}
              enableAudio={false}
              enableBookmark={true}
            />
          ) : (
            <div className="text-muted-foreground">No featured verse available</div>
          )}
        </section>

        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-vedic-cream">What You Can Explore</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/explore">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "rounded-xl p-8 text-center cursor-pointer",
                  "bg-card border border-vedic-sage/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300"
                )}
              >
                <div className="text-5xl mb-4">📖</div>
                <h4 className="text-xl font-semibold mb-3 text-vedic-cream">Read</h4>
                <p className="text-sm text-muted-foreground">Explore verses with translations and context</p>
              </motion.div>
            </Link>
            <Link to="/discover">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "rounded-xl p-8 text-center cursor-pointer",
                  "bg-card border border-vedic-sage/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300"
                )}
              >
                <div className="text-5xl mb-4">📊</div>
                <h4 className="text-xl font-semibold mb-3 text-vedic-cream">Visualize</h4>
                <p className="text-sm text-muted-foreground">Interactive visualizations and insights</p>
              </motion.div>
            </Link>
            <Link to="/learn">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "rounded-xl p-8 text-center cursor-pointer",
                  "bg-card border border-vedic-sage/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300"
                )}
              >
                <div className="text-5xl mb-4">🎓</div>
                <h4 className="text-xl font-semibold mb-3 text-vedic-cream">Learn</h4>
                <p className="text-sm text-muted-foreground">Educational content and reading guides</p>
              </motion.div>
            </Link>
            <Link to="/discover">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "rounded-xl p-8 text-center cursor-pointer",
                  "bg-card border border-vedic-sage/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300"
                )}
              >
                <div className="text-5xl mb-4">🔍</div>
                <h4 className="text-xl font-semibold mb-3 text-vedic-cream">Discover</h4>
                <p className="text-sm text-muted-foreground">Find connections and patterns</p>
              </motion.div>
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Home;
