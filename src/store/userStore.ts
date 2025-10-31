import { create } from 'zustand';

export type ScriptOption = 'devanagari' | 'iast' | 'both';
export type ThemeOption = 'light' | 'dark' | 'auto';
export type TranslationOption = 'Griffith' | 'Jamison-Brereton' | 'Wilson';

export interface UserPrefs {
  defaultScript: ScriptOption;
  translation: TranslationOption;
  fontSize: number;
  lineSpacing: number;
  readingMode: 'scroll' | 'card' | 'parallel';
  theme: ThemeOption;
  colorScheme: string;
  animationSpeed: number;
  reducedMotion: boolean;
  audioAutoPlay: boolean;
  audioSpeed: number;
  audioVolume: number;
  setPref: <T extends keyof Omit<UserPrefs, 'setPref' | 'setMulti'>>(key: T, value: UserPrefs[T]) => void;
  setMulti: (prefs: Partial<Omit<UserPrefs, 'setPref' | 'setMulti'>>) => void;
}

const LOCAL_KEY = 'rv-user-prefs';

const initialPrefs: Omit<UserPrefs, 'setPref' | 'setMulti'> = {
  defaultScript: 'devanagari',
  translation: 'Griffith',
  fontSize: 20,
  lineSpacing: 1.5,
  readingMode: 'scroll',
  theme: 'auto',
  colorScheme: 'vedic',
  animationSpeed: 200,
  reducedMotion: false,
  audioAutoPlay: false,
  audioSpeed: 1,
  audioVolume: 1,
};

function getInitialPrefs() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...initialPrefs, ...JSON.parse(raw) };
  } catch {  /* ignore */ }
  return initialPrefs;
}

export const useUserStore = create<UserPrefs>((set) => ({
  ...getInitialPrefs(),
  setPref: (key, value) => set((state) => {
    const updated = { ...state, [key]: value };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated;
  }),
  setMulti: (prefs) => set((state) => {
    const updated = { ...state, ...prefs };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated;
  })
}));