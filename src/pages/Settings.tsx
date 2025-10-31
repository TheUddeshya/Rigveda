import PageLayout from '../components/layout/PageLayout';
import { useUserStore } from '../store/userStore';
import type { ScriptOption, ThemeOption, TranslationOption } from '../store/userStore';
import { Settings as SettingsIcon, Volume2, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';

const Settings = () => {
  const prefs = useUserStore();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-vedic-charcoal via-vedic-slate to-vedic-charcoal py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-vedic-cream flex items-center gap-3">
            <SettingsIcon size={32} />
            Settings
          </h1>

          {/* Reading Preferences */}
          <section className="mb-6 p-6 bg-card border border-vedic-sage/20 rounded-xl shadow-xl">
            <h2 className="font-bold text-xl mb-4 text-vedic-cream flex items-center gap-2">
              <SettingsIcon size={20} />
              Reading Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Script</span>
                <select
                  value={prefs.defaultScript}
                  onChange={e => prefs.setPref('defaultScript', e.target.value as ScriptOption)}
                  className={cn(
                    "px-3 py-2 rounded-lg min-h-[44px]",
                    "bg-vedic-charcoal/30 text-foreground border border-vedic-sage/20",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent",
                    "transition-all duration-200"
                  )}
                >
                  <option value="devanagari">Devanagari</option>
                  <option value="iast">IAST</option>
                  <option value="both">Both</option>
                </select>
              </label>
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Translation</span>
                <select
                  value={prefs.translation}
                  onChange={e => prefs.setPref('translation', e.target.value as TranslationOption)}
                  className={cn(
                    "px-3 py-2 rounded-lg min-h-[44px]",
                    "bg-vedic-charcoal/30 text-foreground border border-vedic-sage/20",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent",
                    "transition-all duration-200"
                  )}
                >
                  <option value="Griffith">Griffith</option>
                  <option value="Jamison-Brereton">Jamison-Brereton</option>
                  <option value="Wilson">Wilson</option>
                </select>
              </label>
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Font Size ({prefs.fontSize}px)</span>
                <input
                  type="range"
                  min="14"
                  max="32"
                  step="1"
                  value={prefs.fontSize}
                  onChange={e => prefs.setPref('fontSize', Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </label>
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Line Spacing ({prefs.lineSpacing})</span>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={prefs.lineSpacing}
                  onChange={e => prefs.setPref('lineSpacing', Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </label>
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Reading Mode</span>
                <select
                  value={prefs.readingMode}
                  onChange={e => prefs.setPref('readingMode', e.target.value as 'scroll' | 'card' | 'parallel')}
                  className={cn(
                    "px-3 py-2 rounded-lg min-h-[44px]",
                    "bg-vedic-charcoal/30 text-foreground border border-vedic-sage/20",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent",
                    "transition-all duration-200"
                  )}
                >
                  <option value="scroll">Continuous Scroll</option>
                  <option value="card">Card Mode</option>
                  <option value="parallel">Parallel View</option>
                </select>
              </label>
            </div>
          </section>

          {/* Display Preferences */}
          <section className="mb-6 p-6 bg-card border border-vedic-sage/20 rounded-xl shadow-xl">
            <h2 className="font-bold text-xl mb-4 text-vedic-cream flex items-center gap-2">
              <Monitor size={20} />
              Display Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Theme</span>
                <select
                  value={prefs.theme}
                  onChange={e => prefs.setPref('theme', e.target.value as ThemeOption)}
                  className={cn(
                    "px-3 py-2 rounded-lg min-h-[44px]",
                    "bg-vedic-charcoal/30 text-foreground border border-vedic-sage/20",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent",
                    "transition-all duration-200"
                  )}
                >
                  <option value="auto">Auto</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <label className="flex flex-row items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.reducedMotion}
                  onChange={e => prefs.setPref('reducedMotion', e.target.checked)}
                  className="w-5 h-5 min-w-[44px] min-h-[44px] accent-accent"
                />
                <span className="font-semibold text-sm text-foreground">Reduced Motion</span>
              </label>
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Animation Speed ({prefs.animationSpeed}ms)</span>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={prefs.animationSpeed}
                  onChange={e => prefs.setPref('animationSpeed', Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </label>
            </div>
          </section>

          {/* Audio Preferences */}
          <section className="mb-6 p-6 bg-card border border-vedic-sage/20 rounded-xl shadow-xl">
            <h2 className="font-bold text-xl mb-4 text-vedic-cream flex items-center gap-2">
              <Volume2 size={20} />
              Audio Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-row items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.audioAutoPlay}
                  onChange={e => prefs.setPref('audioAutoPlay', e.target.checked)}
                  className="w-5 h-5 min-w-[44px] min-h-[44px] accent-accent"
                />
                <span className="font-semibold text-sm text-foreground">Autoplay Audio</span>
              </label>
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Playback Speed ({prefs.audioSpeed}x)</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={prefs.audioSpeed}
                  onChange={e => prefs.setPref('audioSpeed', Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </label>
              <label className="flex flex-col">
                <span className="mb-2 font-semibold text-sm text-foreground">Volume ({Math.round(prefs.audioVolume * 100)}%)</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={prefs.audioVolume}
                  onChange={e => prefs.setPref('audioVolume', Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </label>
            </div>
          </section>

          <div className="text-sm text-muted-foreground p-4 bg-vedic-charcoal/50 border border-vedic-sage/20 rounded-lg text-center">
            ℹ️ Preferences are stored only on your device. No data is sent or stored externally.
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
