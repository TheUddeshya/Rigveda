import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import VerseCard from '../components/verses/VerseCard';
import { useVerseStore } from '../store/verseStore';
import { useVerses } from '../hooks/useVerses';
import { useEffect } from 'react';
import { cn } from '../lib/utils';
import { Book, Compass, ScrollText, Users } from 'lucide-react';

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
            className="text-7xl sm:text-8xl md:text-9xl font-sanskrit mb-8 text-center text-vedic-text"
          >ऋग्वेदः</motion.h1>
          {/* <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl sm:text-4xl mb-4 font-reading text-center text-vedic-text"
          > Ṛgvedaḥ | Rigveda | 𑀋𑀕𑀯𑁂𑀥𑀳𑁂 </motion.h2> */}
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

        {/* Removed Mandala, Hymns, Verses cards from hero section as requested */}

        <section className="flex flex-col items-center py-12 sm:py-16 px-4 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-vedic-text">Featured Daily Verse</h3>
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

        {/* Learn About the Rig Veda */}
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center text-vedic-text">Learn About the Rig Veda</h3>

          {/* Introduction */}
          <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h4 className="text-2xl font-bold mb-4 text-vedic-text">What is the Rig Veda?</h4>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Rig Veda is the oldest of the four Vedas and one of the oldest sacred texts in the world. Composed in Vedic Sanskrit between approximately 1500-1200 BCE, it consists of 1,028 hymns (suktas) arranged in 10 books (mandalas) containing 10,552 verses.
              </p>
              <p>
                These hymns are primarily addressed to various deities and natural forces, expressing profound philosophical insights, cosmological concepts, and ritual practices of ancient Vedic civilization.
              </p>
            </div>
          </div>

          {/* Structure */}
          <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h4 className="text-2xl font-bold mb-4 text-vedic-text flex items-center gap-2">
              <Book size={24} />
              Structure & Organization
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h5 className="font-bold mb-2 text-foreground">10 Mandalas (Books)</h5>
                  <p className="text-sm text-muted-foreground">
                    Books 2-7 are the oldest (Family Books), each attributed to a specific rishi family. Books 1, 8, 9, and 10 were compiled later.
                  </p>
                </div>
                <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h5 className="font-bold mb-2 text-foreground">1,028 Hymns (Suktas)</h5>
                  <p className="text-sm text-muted-foreground">
                    Each hymn is dedicated to a specific deity or concept, composed by ancient seers (rishis).
                  </p>
                </div>
                <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h5 className="font-bold mb-2 text-foreground">10,552 Verses</h5>
                  <p className="text-sm text-muted-foreground">
                    Composed in various poetic meters, primarily Gayatri, Trishtubh, and Jagati.
                  </p>
                </div>
                <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h5 className="font-bold mb-2 text-foreground">Multiple Deities</h5>
                  <p className="text-sm text-muted-foreground">
                    Major deities include Agni (fire), Indra (warrior god), Soma (sacred plant), and Ushas (dawn).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Deities */}
          <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h4 className="text-2xl font-bold mb-4 text-vedic-text flex items-center gap-2">
              <Users size={24} />
              Principal Deities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-vedic-agni pl-4">
                <h5 className="font-bold text-lg mb-1 text-foreground">Agni (Fire)</h5>
                <p className="text-sm text-muted-foreground">
                  Mediator between humans and gods, messenger who carries offerings to the divine realm. Most frequently mentioned deity.
                </p>
              </div>
              <div className="border-l-4 border-vedic-gold pl-4">
                <h5 className="font-bold text-lg mb-1 text-foreground">Indra (Thunder & War)</h5>
                <p className="text-sm text-muted-foreground">
                  King of the gods, warrior deity who battles demons and brings rain. Second most mentioned deity.
                </p>
              </div>
              <div className="border-l-4 border-vedic-soma pl-4">
                <h5 className="font-bold text-lg mb-1 text-foreground">Soma (Sacred Plant)</h5>
                <p className="text-sm text-muted-foreground">
                  Deity of the sacred plant and its intoxicating juice used in rituals. Entire Mandala 9 is dedicated to Soma.
                </p>
              </div>
              <div className="border-l-4 border-vedic-ushas pl-4">
                <h5 className="font-bold text-lg mb-1 text-foreground">Ushas (Dawn)</h5>
                <p className="text-sm text-muted-foreground">
                  Goddess of dawn, symbol of renewal and consciousness. Associated with beauty and awakening.
                </p>
              </div>
            </div>
          </div>

          {/* Reading Guide */}
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

          {/* Curated Collections */}
          <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl">
            <h4 className="text-2xl font-bold mb-4 text-vedic-text flex items-center gap-2">
              <ScrollText size={24} />
              Curated Collections
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/explore">
                <div className={cn(
                  "bg-gradient-to-br from-accent/30 to-vedic-gold/20 p-6 rounded-lg",
                  "border border-vedic-accent/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300 cursor-pointer"
                )}>
                  <h5 className="font-bold text-lg mb-2 text-foreground">Essential Hymns</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    10 foundational hymns every reader should know
                  </p>
                  <span className="text-accent font-semibold text-sm">Start Reading →</span>
                </div>
              </Link>
              <Link to="/explore">
                <div className={cn(
                  "bg-gradient-to-br from-vedic-soma/30 to-vedic-ushas/20 p-6 rounded-lg",
                  "border border-vedic-accent/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300 cursor-pointer"
                )}>
                  <h5 className="font-bold text-lg mb-2 text-foreground">Cosmic Hymns</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Creation, cosmology, and philosophical wisdom
                  </p>
                  <span className="text-accent font-semibold text-sm">Explore →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Home;
