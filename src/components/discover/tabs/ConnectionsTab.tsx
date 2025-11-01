import type { Deity } from '../../../types';

interface ConnectionsTabProps {
  deitiesData: Deity[];
}

const ConnectionsTab = ({ deitiesData }: ConnectionsTabProps) => {
  return (
    <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 shadow-xl text-vedic-text">
      <h3 className="text-xl font-bold mb-4">Deity Network Graph</h3>
      <p className="mb-6">Explore the intricate relationships and connections between different deities.</p>
      <div className="space-y-4">
        {deitiesData.length > 0 ? (
          deitiesData.map((deity, index) => (
            <div key={index} className="border-b border-vedic-accent/20 pb-4 last:border-b-0">
              <h4 className="text-lg font-semibold text-accent">{deity.name} ({deity.name_sanskrit})</h4>
              <p className="text-sm text-muted-foreground">Role: {deity.role}</p>
              {deity.related_deities && deity.related_deities.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">Related Deities: {deity.related_deities.join(', ')}</p>
              )}
              {deity.attributes && deity.attributes.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">Attributes: {deity.attributes.join(', ')}</p>
              )}
            </div>
          ))
        ) : (
          <p>No deity data available.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionsTab;
