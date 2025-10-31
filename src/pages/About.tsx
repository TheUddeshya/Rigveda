import PageLayout from '../components/layout/PageLayout';
import { Heart, Users, BookOpen, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

const About = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-vedic-charcoal via-vedic-slate to-vedic-charcoal py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-vedic-cream">About This Project</h1>

          {/* Mission */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <Heart size={24} />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              RigVeda Explorer aims to make the wisdom of the Rig Veda accessible to everyone through modern technology. We believe that ancient texts should be available to all seekers of knowledge, presented in a way that respects both their sacred nature and scholarly rigor.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our goal is to create the definitive digital experience for exploring Vedic scripture—combining beauty, scholarship, and intuitive interaction, matching the excellence of platforms like quran.com and bible.com.
            </p>
          </section>

          {/* Features */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <BookOpen size={24} />
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                <h3 className="font-bold mb-2 text-foreground">Multiple Translations</h3>
                <p className="text-sm text-muted-foreground">
                  Compare translations by Griffith (1896), Jamison-Brereton (2014), and Wilson (1850).
                </p>
              </div>
              <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                <h3 className="font-bold mb-2 text-foreground">Advanced Search</h3>
                <p className="text-sm text-muted-foreground">
                  Fuzzy search across Sanskrit, IAST transliteration, and English translations.
                </p>
              </div>
              <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                <h3 className="font-bold mb-2 text-foreground">Smart Filtering</h3>
                <p className="text-sm text-muted-foreground">
                  Filter by mandala, deity, rishi, meter, and themes to find exactly what you're looking for.
                </p>
              </div>
              <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                <h3 className="font-bold mb-2 text-foreground">Visualizations</h3>
                <p className="text-sm text-muted-foreground">
                  Explore data through analytics, timelines, and interactive visualizations.
                </p>
              </div>
              <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                <h3 className="font-bold mb-2 text-foreground">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Ask questions and get insights powered by Claude AI (optional feature).
                </p>
              </div>
              <div className="bg-vedic-charcoal/50 border border-vedic-sage/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
                <h3 className="font-bold mb-2 text-foreground">Bookmarks</h3>
                <p className="text-sm text-muted-foreground">
                  Save your favorite verses for easy access, stored locally on your device.
                </p>
              </div>
            </div>
          </section>

          {/* Sources & Attribution */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <Users size={24} />
              Sources & Attribution
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="font-semibold text-foreground">This project uses translations from:</p>
              <ul className="space-y-3">
                <li className="pl-4 border-l-2 border-vedic-agni">
                  <strong className="text-foreground">Ralph T.H. Griffith (1896)</strong> - Public domain translation, widely accessible and influential.
                </li>
                <li className="pl-4 border-l-2 border-vedic-gold">
                  <strong className="text-foreground">Stephanie W. Jamison & Joel P. Brereton (2014)</strong> - Modern scholarly translation with extensive annotations.
                </li>
                <li className="pl-4 border-l-2 border-vedic-soma">
                  <strong className="text-foreground">H.H. Wilson (1850)</strong> - One of the earliest English translations, historical significance.
                </li>
              </ul>
              <p className="text-sm mt-4">
                All translations are properly attributed and used for educational and scholarly purposes. We are grateful to the translators and scholars whose work makes this resource possible.
              </p>
            </div>
          </section>

          {/* Privacy & Ethics */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream flex items-center gap-2">
              <Shield size={24} />
              Privacy & Ethics
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="text-accent text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-foreground">No Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't use analytics, cookies, or any tracking technology. Your reading is completely private.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-accent text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-foreground">Local Storage Only</h3>
                  <p className="text-sm text-muted-foreground">
                    Bookmarks and preferences are stored only on your device, never on our servers.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-accent text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-foreground">Respectful Presentation</h3>
                  <p className="text-sm text-muted-foreground">
                    We treat these sacred texts with the dignity and respect they deserve.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-accent text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-foreground">Educational Purpose</h3>
                  <p className="text-sm text-muted-foreground">
                    This platform is created for educational and scholarly purposes, freely accessible to all.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="bg-card border border-vedic-sage/20 rounded-xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-vedic-cream">Technology Stack</h2>
            <p className="text-muted-foreground mb-4">
              Built with modern web technologies to ensure a fast, responsive, and accessible experience:
            </p>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Fuse.js', 'Claude AI'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-accent/20 border border-accent/30 text-accent-foreground rounded-full text-sm font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
