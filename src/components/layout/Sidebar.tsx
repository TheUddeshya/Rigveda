import React from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useVerses } from '../../hooks/useVerses';
import { loadMandala } from '../../utils/verseLoader';
import type { VerseData } from '../../store/verseStore';
import { X, ChevronRight, BookOpen, Scroll, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-vedic-ui/98 to-vedic-bg/98 backdrop-blur-xl border-r border-vedic-accent/30 shadow-2xl z-50 flex flex-col"
          >
            {/* Header with gradient and modern styling */}
            <div className="px-6 py-5 border-b border-vedic-accent/20 bg-gradient-to-r from-accent/5 to-vedic-sage/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-vedic-text">Rigveda</h2>
                    <p className="text-xs text-muted-foreground">Index & Navigation</p>
                  </div>
                </div>
                <button
                  aria-label="Close sidebar"
                  className={cn(
                    "p-2 rounded-lg",
                    "hover:bg-vedic-sage/20 hover:rotate-90",
                    "transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5 text-vedic-text" />
                </button>
              </div>
            </div>

          {/* Navigation content with custom scrollbar */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-vedic-accent/30 scrollbar-track-transparent">
            <nav role="tree" aria-label="Rigveda index">
              {Array.from(tree.keys()).sort((a, b) => a - b).map((mandala, idx) => {
                const sMap = tree.get(mandala)!;
                const isMandalaOpen = activeMandala === mandala;
                return (
                  <div key={mandala} className="mb-2">
                    <button
                      ref={el => { mandalaButtons.current[idx] = el }}
                      data-mandalaval={mandala}
                      role="treeitem"
                      aria-expanded={isMandalaOpen}
                      onKeyDown={e => onMandalaKeyDown(e, idx)}
                      onClick={() => toggleMandala(mandala)}
                      className={cn(
                        "w-full group flex items-center justify-between px-4 py-3 rounded-xl",
                        "transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-accent",
                        isMandalaOpen
                          ? "bg-gradient-to-r from-accent/15 to-vedic-sage/15 border border-accent/30 shadow-sm"
                          : "bg-vedic-ui/40 border border-vedic-accent/10 hover:bg-vedic-ui/60 hover:border-accent/20 hover:shadow-md"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          isMandalaOpen ? "bg-accent/20" : "bg-vedic-sage/20 group-hover:bg-accent/15"
                        )}>
                          <Scroll className={cn(
                            "w-4 h-4 transition-colors",
                            isMandalaOpen ? "text-accent" : "text-vedic-text group-hover:text-accent"
                          )} />
                        </div>
                        <span className={cn(
                          "text-sm font-semibold transition-colors",
                          isMandalaOpen ? "text-accent" : "text-vedic-text"
                        )}>
                          Mandala {mandala}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-vedic-ui/60 px-2 py-0.5 rounded-full">
                          {Array.from(sMap.keys()).length}
                        </span>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isMandalaOpen ? "rotate-90 text-accent" : "text-muted-foreground"
                        )} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isMandalaOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="mt-3 pl-3 space-y-1"
                          data-mandala={mandala}
                        >
                          {loadingMandala === mandala ? (
                            <div className="py-6 text-center">
                              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                Loading mandala…
                              </div>
                            </div>
                          ) : (
                            Array.from(sMap.keys()).sort((a, b) => a - b).map(sukta => {
                              const versesList = sMap.get(sukta)!.sort((a, b) => a.verse - b.verse);
                              const isSuktaOpen = activeSukta?.mandala === mandala && activeSukta?.sukta === sukta;
                              return (
                                <div key={sukta} className="mb-1.5">
                                  <button
                                    data-sukta={sukta}
                                    role="treeitem"
                                    aria-expanded={isSuktaOpen}
                                    onKeyDown={e => onSuktaKeyDown(e, mandala, sukta)}
                                    onClick={() => toggleSukta(mandala, sukta)}
                                    className={cn(
                                      "w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm",
                                      "transition-all duration-150",
                                      "focus:outline-none focus:ring-1 focus:ring-accent",
                                      isSuktaOpen
                                        ? "bg-vedic-sage/20 border border-vedic-sage/30 text-vedic-text"
                                        : "bg-transparent border border-transparent text-muted-foreground hover:bg-vedic-ui/30 hover:text-vedic-text hover:border-vedic-accent/10"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className={cn(
                                        "w-3.5 h-3.5 transition-colors",
                                        isSuktaOpen ? "text-accent" : "text-muted-foreground/60 group-hover:text-vedic-text"
                                      )} />
                                      <span className="font-medium">Sukta {sukta}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className={cn(
                                        "text-xs px-1.5 py-0.5 rounded",
                                        isSuktaOpen ? "bg-accent/15 text-accent font-medium" : "text-muted-foreground/80"
                                      )}>
                                        {versesList.length}
                                      </span>
                                      <ChevronRight className={cn(
                                        "w-3.5 h-3.5 transition-transform duration-150",
                                        isSuktaOpen ? "rotate-90" : ""
                                      )} />
                                    </div>
                                  </button>

                                  <AnimatePresence>
                                    {isSuktaOpen && (
                                      <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="pl-4 mt-2 space-y-1"
                                        role="group"
                                      >
                                        {versesList.map((v: VerseData) => (
                                          <li key={v.id}>
                                            <Link
                                              id={`sidebar-verse-${v.id}`}
                                              to={`/explore#verse-${v.id}`}
                                              onKeyDown={onVerseKeyDown}
                                              onClick={() => setSidebarOpen(false)}
                                              className={cn(
                                                "flex items-center gap-2 px-3 py-2 rounded-md text-xs",
                                                "transition-all duration-150",
                                                "text-muted-foreground hover:text-vedic-text",
                                                "hover:bg-vedic-ui/20 hover:pl-4",
                                                "focus:outline-none focus:ring-1 focus:ring-accent focus:bg-vedic-ui/30",
                                                "border-l-2 border-transparent hover:border-accent/50"
                                              )}
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                              <span className="flex-1 truncate">
                                                <span className="font-mono text-[11px] text-muted-foreground/60">{v.id}</span>
                                                {' — '}
                                                <span className="font-medium">{v.metadata?.deity?.primary || 'Unknown'}</span>
                                              </span>
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
        </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

