import React from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useVerses } from '../../hooks/useVerses';
import { loadMandala } from '../../utils/verseLoader';
import type { VerseData } from '../../store/verseStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { verses } = useVerses();

  // simple in-memory ref cache so loads don't trigger rerenders on every fetch
  const mandalaDataRef = React.useRef<Record<number, VerseData[]>>({});

  // Tree is either built from the globally-loaded `verses` or from per-mandala
  // data loaded lazily. When verses exist (app loaded full dataset), prefer
  // building the tree from that. Otherwise we'll fill `mandalaData` on demand.
  const tree = React.useMemo(() => {
    const m = new Map<number, Map<number, VerseData[]>>();
    if (verses && verses.length > 0) {
      verses.forEach((v: VerseData) => {
        const mandala = v.mandala || 0;
        const sukta = v.sukta || 0;
        if (!m.has(mandala)) m.set(mandala, new Map());
        const sMap = m.get(mandala)!;
        if (!sMap.has(sukta)) sMap.set(sukta, []);
        sMap.get(sukta)!.push(v);
      });
    } else {
      // Ensure mandalas 1..10 exist even when verses array not loaded
      for (let mi = 1; mi <= 10; mi++) {
        if (!m.has(mi)) m.set(mi, new Map());
        const sMap = m.get(mi)!;
        // if we have mandalaData for this mandala, populate suktas
        const loaded = mandalaDataRef.current[mi];
        if (loaded) {
          loaded.forEach((v: VerseData) => {
            const sukta = v.sukta || 0;
            if (!sMap.has(sukta)) sMap.set(sukta, []);
            sMap.get(sukta)!.push(v);
          });
        }
      }
    }
    return m;
  }, [verses]);

  const [activeMandala, setActiveMandala] = React.useState<number | null>(null);
  const [activeSukta, setActiveSukta] = React.useState<{ mandala: number; sukta: number } | null>(null);
  const [loadingMandala, setLoadingMandala] = React.useState<number | null>(null);

  // refs for keyboard navigation
  const mandalaButtons = React.useRef<Array<HTMLButtonElement | null>>([]);

  const toggleMandala = (m: number) => {
    setActiveSukta(null);
    const willOpen = activeMandala !== m;
    setActiveMandala(prev => (prev === m ? null : m));

    // If opening and we don't have data yet, fetch it lazily
    if (willOpen && (!mandalaDataRef.current[m] || mandalaDataRef.current[m].length === 0)) {
      setLoadingMandala(m);
      loadMandala(m).then(data => {
        mandalaDataRef.current[m] = data;
        setLoadingMandala(null);
        // trigger a re-render by updating activeMandala (no-op) or using state
        setActiveMandala(x => x);
      }).catch(err => {
        console.warn(`Failed to load mandala ${m}:`, err);
        setLoadingMandala(null);
      });
    }
  };

  const toggleSukta = (mandala: number, sukta: number) => {
    setActiveSukta(prev => (prev && prev.mandala === mandala && prev.sukta === sukta ? null : { mandala, sukta }));
  };

  // Sukta keyboard handling: ArrowRight -> open and focus first verse, ArrowLeft -> focus parent mandala
  const onSuktaKeyDown = (e: React.KeyboardEvent, mandala: number, sukta: number) => {
    const target = e.target as HTMLElement;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // Open the sukta if closed, then focus first verse
      if (!activeSukta || activeSukta.mandala !== mandala || activeSukta.sukta !== sukta) {
        toggleSukta(mandala, sukta);
        setTimeout(() => {
          const firstLink = target.nextElementSibling?.querySelector('a') as HTMLElement | null;
          if (firstLink) firstLink.focus();
        }, 100);
      } else {
        // If already open, just focus first verse
        const firstLink = target.nextElementSibling?.querySelector('a') as HTMLElement | null;
        if (firstLink) firstLink.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // move focus back to the mandala button for this mandala
      const mandalaBtn = mandalaButtons.current.find(b => b?.dataset.mandalaval === String(mandala));
      if (mandalaBtn) mandalaBtn.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Find next sukta button in same mandala
      const allSuktas = Array.from(document.querySelectorAll(`[data-mandala="${mandala}"] button[role="treeitem"]`)) as HTMLElement[];
      const idx = allSuktas.indexOf(target);
      const next = allSuktas[idx + 1] ?? allSuktas[0];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Find previous sukta button in same mandala
      const allSuktas = Array.from(document.querySelectorAll(`[data-mandala="${mandala}"] button[role="treeitem"]`)) as HTMLElement[];
      const idx = allSuktas.indexOf(target);
      const prev = allSuktas[idx - 1] ?? allSuktas[allSuktas.length - 1];
      prev?.focus();
    }
  };

  // Verse keyboard handling: navigate up/down, left focus parent sukta, right activate, Home/End within group
  const onVerseKeyDown = (e: React.KeyboardEvent) => {
    const el = e.target as HTMLElement;
    if (!el) return;

    const all = Array.from(document.querySelectorAll('[id^="sidebar-verse-"]')) as HTMLElement[];
    const idx = all.indexOf(el);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = all[idx + 1] ?? all[0];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = all[idx - 1] ?? all[all.length - 1];
      prev?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // focus parent sukta button
      const group = el.closest('ul')?.previousElementSibling as HTMLElement | null;
      group?.focus();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      // activate the link (navigate)
      (el as HTMLElement).click?.();
    } else if (e.key === 'Home') {
      e.preventDefault();
      const parent = el.closest('ul');
      const first = parent?.querySelector('[id^="sidebar-verse-"]') as HTMLElement | null;
      first?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const parent = el.closest('ul');
      const items = parent ? Array.from(parent.querySelectorAll('[id^="sidebar-verse-"]')) as HTMLElement[] : [];
      const last = items[items.length - 1] ?? null;
      last?.focus();
    }
  };

  // Auto-expand if URL has #verse-<id> or when hash changes
  React.useEffect(() => {
    const openFromHash = () => {
      const h = window.location.hash;
      if (!h) return;
      const m = h.match(/^#verse-(.+)$/);
      if (!m) return;
      const id = m[1];
      const v = verses.find(x => String(x.id) === id || x.id === id);
      if (v) {
        setActiveMandala(v.mandala || null);
        setActiveSukta({ mandala: v.mandala || 0, sukta: v.sukta || 0 });
        // scroll the corresponding link into view in the sidebar after a tick
        setTimeout(() => {
          const el = document.getElementById(`sidebar-verse-${v.id}`);
          if (el && 'scrollIntoView' in el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 120);
      }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [verses]);

  // Keyboard navigation for mandala buttons
  const onMandalaKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const max = mandalaButtons.current.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = idx >= max ? 0 : idx + 1;
      mandalaButtons.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = idx <= 0 ? max : idx - 1;
      mandalaButtons.current[prev]?.focus();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const val = Number(mandalaButtons.current[idx]?.dataset.mandalaval);
      if (!Number.isNaN(val)) {
        toggleMandala(val);
        // Focus first sukta after expansion
        setTimeout(() => {
          const firstSukta = document.querySelector(`[data-mandala="${val}"] button[role="treeitem"]`) as HTMLElement | null;
          firstSukta?.focus();
        }, 100);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      mandalaButtons.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      mandalaButtons.current[max]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const val = Number(mandalaButtons.current[idx]?.dataset.mandalaval);
      if (!Number.isNaN(val)) toggleMandala(val);
    }
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 w-80 bg-vedic-ui/95 border-r border-vedic-accent/20 z-50 p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-vedic-text">Rigveda Index</h2>
            <button
              aria-label="Close sidebar"
              className="p-2 rounded-lg hover:bg-vedic-sage/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="text-vedic-text" />
            </button>
          </div>

          {/* nav wrapper centers content vertically when short, but allows scrolling when long */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full" style={{ maxHeight: 'calc(100vh - 140px)', overflow: 'auto' }}>
              <nav role="tree" aria-label="Rigveda index">
                {Array.from(tree.keys()).sort((a, b) => a - b).map((mandala, idx) => {
                  const sMap = tree.get(mandala)!;
                  const isMandalaOpen = activeMandala === mandala;
                  return (
                    <div key={mandala} className="mb-3">
                      <button
                        ref={el => { mandalaButtons.current[idx] = el }}
                        data-mandalaval={mandala}
                        role="treeitem"
                        aria-expanded={isMandalaOpen}
                        onKeyDown={e => onMandalaKeyDown(e, idx)}
                        onClick={() => toggleMandala(mandala)}
                        className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-vedic-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <span className="text-sm font-semibold text-vedic-text">Mandala {mandala}</span>
                        <span className="text-xs text-muted-foreground">{Array.from(sMap.keys()).length} suktas</span>
                      </button>

                      <AnimatePresence>
                        {isMandalaOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 pl-4"
                            data-mandala={mandala}
                          >
                              {loadingMandala === mandala ? (
                                <div className="py-4 text-center text-muted-foreground">Loading mandala…</div>
                              ) : (
                                Array.from(sMap.keys()).sort((a, b) => a - b).map(sukta => {
                                  const versesList = sMap.get(sukta)!.sort((a, b) => a.verse - b.verse);
                                  const isSuktaOpen = activeSukta?.mandala === mandala && activeSukta?.sukta === sukta;
                                  return (
                                    <div key={sukta} className="mb-2">
                                  <button
                                    data-sukta={sukta}
                                    role="treeitem"
                                    aria-expanded={isSuktaOpen}
                                    onKeyDown={e => onSuktaKeyDown(e, mandala, sukta)}
                                    onClick={() => toggleSukta(mandala, sukta)}
                                    className="w-full flex items-center justify-between text-sm text-muted-foreground px-2 py-1 rounded hover:bg-vedic-ui/10 focus:outline-none focus:ring-1 focus:ring-accent"
                                  >
                                    <span>Sukta {sukta}</span>
                                    <span className="text-xs">{versesList.length} shlokas</span>
                                  </button>

                                  <AnimatePresence>
                                    {isSuktaOpen && (
                                      <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className="pl-4 mt-2"
                                        role="group"
                                      >
                                        {versesList.map((v: VerseData) => (
                                          <li key={v.id} className="mb-1">
                                            <Link
                                              id={`sidebar-verse-${v.id}`}
                                              to={`/explore#verse-${v.id}`}
                                              onKeyDown={onVerseKeyDown}
                                              onClick={() => setSidebarOpen(false)}
                                              className="text-sm text-vedic-text hover:text-vedic-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                            >
                                              {v.id} — {v.metadata?.deity?.primary || ''}
                                            </Link>
                                          </li>
                                        ))}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                                })
                              )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

