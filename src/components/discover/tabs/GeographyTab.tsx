import type { Region } from '../../../types';

interface GeographyTabProps {
  regionsData: Region[];
}

const GeographyTab = ({ regionsData }: GeographyTabProps) => {
  return (
    <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 shadow-xl text-vedic-text">
      <h3 className="text-xl font-bold mb-4">Geographic Explorer</h3>
      <p className="mb-6">Explore the geographical references within the Rig Veda.</p>
      <div className="space-y-4">
        {regionsData.length > 0 ? (
          regionsData.map((region, index) => (
            <div key={index} className="border-b border-vedic-accent/20 pb-4 last:border-b-0">
              <h4 className="text-lg font-semibold text-accent">{region.name} ({region.name_sanskrit})</h4>
              <p className="text-sm text-muted-foreground">Modern Location: {region.modern_location}</p>
              <p className="text-sm text-muted-foreground">Significance: {region.significance}</p>
              {region.references && region.references.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">References: {region.references.join(', ')}</p>
              )}
              {region.notes && (
                <p className="text-xs text-muted-foreground mt-1">Notes: {region.notes}</p>
              )}
            </div>
          ))
        ) : (
          <p>No geographic data available.</p>
        )}
      </div>
    </div>
  );
};

export default GeographyTab;
