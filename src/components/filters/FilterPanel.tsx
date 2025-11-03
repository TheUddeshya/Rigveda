import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

import type { VerseData } from '../../store/verseStore';

interface FilterPanelProps {
  allVerses: VerseData[];
  currentFilters: {
    mandala?: number;
    sukta?: number;
    deity?: string;
    rishi?: string;
    meter?: string;
    theme?: string;
    search?: string;
  };
  onFilterChange: (filters: FilterPanelProps['currentFilters']) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ allVerses, currentFilters, onFilterChange }) => {
  // Extract unique values for filters
  const mandalas = Array.from(new Set(allVerses.map(v => v.mandala))).sort((a, b) => a - b);
  const suktas = Array.from(new Set(allVerses.map(v => v.sukta))).sort((a, b) => a - b);
  const deities = Array.from(new Set(allVerses.map(v => v.metadata?.deity?.primary).filter(Boolean))).sort();
  const rishis = Array.from(new Set(allVerses.map(v => v.metadata?.rishi?.name).filter(Boolean))).sort();
  const meters = Array.from(new Set(allVerses.map(v => v.metadata?.meter).filter(Boolean))).sort();
  const themes = Array.from(new Set(allVerses.flatMap(v => v.themes || []))).sort();

  const hasActiveFilters = Object.values(currentFilters).some(v => v !== undefined && v !== '');

  const selectClassName = cn(
    "px-3 py-2 rounded-lg min-h-[44px]",
    "bg-vedic-ui/30 text-foreground border border-vedic-accent/20",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent",
    "transition-all duration-200",
    "hover:bg-vedic-sage/10"
  );

  return (
    <div>
      {/* Filter Grid - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {/* Mandala filter */}
        <label className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground mb-2">Mandala</span>
          <select
            className={selectClassName}
            value={currentFilters.mandala || ''}
            onChange={e => onFilterChange({ ...currentFilters, mandala: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">All</option>
            {mandalas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        {/* Sukta filter */}
        <label className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground mb-2">Sukta</span>
          <select
            className={selectClassName}
            value={currentFilters.sukta || ''}
            onChange={e => onFilterChange({ ...currentFilters, sukta: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">All</option>
            {suktas.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        {/* Deity filter */}
        <label className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground mb-2">Deity</span>
          <select
            className={selectClassName}
            value={currentFilters.deity || ''}
            onChange={e => onFilterChange({ ...currentFilters, deity: e.target.value || undefined })}
          >
            <option value="">All</option>
            {deities.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>

        {/* Rishi filter */}
        <label className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground mb-2">Rishi</span>
          <select
            className={selectClassName}
            value={currentFilters.rishi || ''}
            onChange={e => onFilterChange({ ...currentFilters, rishi: e.target.value || undefined })}
          >
            <option value="">All</option>
            {rishis.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        {/* Meter filter */}
        <label className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground mb-2">Meter</span>
          <select
            className={selectClassName}
            value={currentFilters.meter || ''}
            onChange={e => onFilterChange({ ...currentFilters, meter: e.target.value || undefined })}
          >
            <option value="">All</option>
            {meters.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        {/* Theme filter */}
        <label className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground mb-2">Theme</span>
          <select
            className={selectClassName}
            value={currentFilters.theme || ''}
            onChange={e => onFilterChange({ ...currentFilters, theme: e.target.value || undefined })}
          >
            <option value="">All</option>
            {themes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>

      {/* Clear all button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
              "bg-accent/20 text-accent border border-accent/30",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-all duration-200"
            )}
            type="button"
            onClick={() => onFilterChange({})}
            aria-label="Clear all filters"
          >
            <X size={16} />
            <span>Clear all</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
