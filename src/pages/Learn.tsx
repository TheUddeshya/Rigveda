import PageLayout from '../components/layout/PageLayout';
import { Book, Compass, ScrollText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const Learn = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-vedic-charcoal via-vedic-slate to-vedic-charcoal py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-vedic-cream">Learn About the Rig Veda</h1>

          {/* Introduction */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream">What is the Rig Veda?</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Rig Veda is the oldest of the four Vedas and one of the oldest sacred texts in the world. Composed in Vedic Sanskrit between approximately 1500-1200 BCE, it consists of 1,028 hymns (suktas) arranged in 10 books (mandalas) containing 10,552 verses.
              </p>
              <p>
                These hymns are primarily addressed to various deities and natural forces, expressing profound philosophical insights, cosmological concepts, and ritual practices of ancient Vedic civilization.
              </p>
            </div>
          </section>

          {/* Structure */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <Book size={24} />
              Structure & Organization
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h3 className="font-bold mb-2 text-foreground">10 Mandalas (Books)</h3>
                  <p className="text-sm text-muted-foreground">
                    Books 2-7 are the oldest (Family Books), each attributed to a specific rishi family. Books 1, 8, 9, and 10 were compiled later.
                  </p>
                </div>
                <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h3 className="font-bold mb-2 text-foreground">1,028 Hymns (Suktas)</h3>
                  <p className="text-sm text-muted-foreground">
                    Each hymn is dedicated to a specific deity or concept, composed by ancient seers (rishis).
                  </p>
                </div>
                <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h3 className="font-bold mb-2 text-foreground">10,552 Verses</h3>
                  <p className="text-sm text-muted-foreground">
                    Composed in various poetic meters, primarily Gayatri, Trishtubh, and Jagati.
                  </p>
                </div>
                <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                  <h3 className="font-bold mb-2 text-foreground">Multiple Deities</h3>
                  <p className="text-sm text-muted-foreground">
                    Major deities include Agni (fire), Indra (warrior god), Soma (sacred plant), and Ushas (dawn).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Deities */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <Users size={24} />
              Principal Deities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-vedic-agni pl-4">
                <h3 className="font-bold text-lg mb-1 text-foreground">Agni (Fire)</h3>
                <p className="text-sm text-muted-foreground">
                  Mediator between humans and gods, messenger who carries offerings to the divine realm. Most frequently mentioned deity.
                </p>
              </div>
              <div className="border-l-4 border-vedic-gold pl-4">
                <h3 className="font-bold text-lg mb-1 text-foreground">Indra (Thunder & War)</h3>
                <p className="text-sm text-muted-foreground">
                  King of the gods, warrior deity who battles demons and brings rain. Second most mentioned deity.
                </p>
              </div>
              <div className="border-l-4 border-vedic-soma pl-4">
                <h3 className="font-bold text-lg mb-1 text-foreground">Soma (Sacred Plant)</h3>
                <p className="text-sm text-muted-foreground">
                  Deity of the sacred plant and its intoxicating juice used in rituals. Entire Mandala 9 is dedicated to Soma.
                </p>
              </div>
              <div className="border-l-4 border-vedic-ushas pl-4">
                <h3 className="font-bold text-lg mb-1 text-foreground">Ushas (Dawn)</h3>
                <p className="text-sm text-muted-foreground">
                  Goddess of dawn, symbol of renewal and consciousness. Associated with beauty and awakening.
                </p>
              </div>
            </div>
          </section>

          {/* Reading Guide */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <Compass size={24} />
              How to Approach the Text
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="text-accent font-bold">1.</div>
                <div>
                  <h3 className="font-bold mb-1 text-foreground">Start with Famous Hymns</h3>
                  <p className="text-sm text-muted-foreground">
                    Begin with well-known hymns like the Nasadiya Sukta (10.129 - Creation Hymn) or the Purusha Sukta (10.90).
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-accent font-bold">2.</div>
                <div>
                  <h3 className="font-bold mb-1 text-foreground">Read Multiple Translations</h3>
                  <p className="text-sm text-muted-foreground">
                    Compare different scholarly translations to understand varying interpretations and nuances.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-accent font-bold">3.</div>
                <div>
                  <h3 className="font-bold mb-1 text-foreground">Understand the Context</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about Vedic rituals, society, and cosmology to better appreciate the hymns' meanings.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-accent font-bold">4.</div>
                <div>
                  <h3 className="font-bold mb-1 text-foreground">Look for Layers of Meaning</h3>
                  <p className="text-sm text-muted-foreground">
                    Vedic hymns often have multiple levels: literal (ritual), symbolic (psychological), and philosophical (metaphysical).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Curated Collections */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <ScrollText size={24} />
              Curated Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/explore">
                <div className={cn(
                  "bg-gradient-to-br from-accent/30 to-vedic-gold/20 p-6 rounded-lg",
                  "border border-vedic-sage/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300 cursor-pointer"
                )}>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Essential Hymns</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    10 foundational hymns every reader should know
                  </p>
                  <span className="text-accent font-semibold text-sm">Start Reading →</span>
                </div>
              </Link>
              <Link to="/explore">
                <div className={cn(
                  "bg-gradient-to-br from-vedic-soma/30 to-vedic-ushas/20 p-6 rounded-lg",
                  "border border-vedic-sage/20",
                  "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
                  "transition-all duration-300 cursor-pointer"
                )}>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Cosmic Hymns</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Creation, cosmology, and philosophical wisdom
                  </p>
                  <span className="text-accent font-semibold text-sm">Explore →</span>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Learn;
