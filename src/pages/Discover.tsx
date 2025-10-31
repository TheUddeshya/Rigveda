import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useVerses } from '../hooks/useVerses';
import { BarChart2, Globe, Network, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const Discover = () => {
  const { verses, loading } = useVerses();
  const [activeTab, setActiveTab] = useState<'analytics' | 'geography' | 'connections' | 'timeline'>('analytics');
  const [regionsData, setRegionsData] = useState<any[]>([]);
  const [deitiesData, setDeitiesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('/data/regions.json');
        const data = await response.json();
        setRegionsData(data.regions);
      } catch (error) {
        console.error('Error fetching regions data:', error);
      }
    };

    const fetchDeities = async () => {
      try {
        const response = await fetch('/data/deities.json');
        const data = await response.json();
        setDeitiesData(data.deities);
      } catch (error) {
        console.error('Error fetching deities data:', error);
      }
    };

    fetchRegions();
    fetchDeities();
  }, []);

  // Calculate statistics
  const deityCount = new Map<string, number>();
  const meterCount = new Map<string, number>();
  const themeCount = new Map<string, number>();

  verses.forEach((verse) => {
    const deity = verse.metadata?.deity?.primary;
    if (deity) {
      deityCount.set(deity, (deityCount.get(deity) || 0) + 1);
    }

    const meter = verse.metadata?.meter;
    if (meter) {
      meterCount.set(meter, (meterCount.get(meter) || 0) + 1);
    }

    verse.themes?.forEach((theme) => {
      themeCount.set(theme, (themeCount.get(theme) || 0) + 1);
    });
  });

  const topDeities = Array.from(deityCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topMeters = Array.from(meterCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topThemes = Array.from(themeCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-vedic-charcoal via-vedic-slate to-vedic-charcoal py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-vedic-cream">Discover Insights</h1>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-vedic-sage/20">
            <button
              onClick={() => setActiveTab('analytics')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200",
                activeTab === 'analytics'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-vedic-cream'
              )}
            >
              <BarChart2 size={20} />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('geography')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200",
                activeTab === 'geography'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-vedic-cream'
              )}
            >
              <Globe size={20} />
              Geography
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200",
                activeTab === 'connections'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-vedic-cream'
              )}
            >
              <Network size={20} />
              Connections
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200",
                activeTab === 'timeline'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-vedic-cream'
              )}
            >
              <Clock size={20} />
              Timeline
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-vedic-cream">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="mt-4">Loading data...</p>
            </div>
          ) : (
            <>
              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Top Deities */}
                    <div className="bg-card border border-vedic-sage/20 rounded-xl p-6 shadow-xl">
                      <h3 className="text-xl font-bold mb-4 text-vedic-cream">Top Deities</h3>
                      <div className="space-y-3">
                        {topDeities.map(([deity, count]) => {
                          const maxCount = topDeities[0][1];
                          const percentage = (count / maxCount) * 100;
                          return (
                            <div key={deity}>
                              <div className="flex justify-between mb-1">
                                <span className="font-semibold text-foreground">{deity}</span>
                                <span className="text-sm text-muted-foreground">{count} verses</span>
                              </div>
                              <div className="w-full bg-vedic-charcoal rounded-full h-2">
                                <div
                                  className="bg-accent h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top Themes */}
                    <div className="bg-card border border-vedic-sage/20 rounded-xl p-6 shadow-xl">
                      <h3 className="text-xl font-bold mb-4 text-vedic-cream">Common Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {topThemes.map(([theme, count]) => (
                          <span
                            key={theme}
                            className="px-3 py-1.5 bg-accent/20 text-accent-foreground border border-accent/30 rounded-full text-sm font-medium"
                            title={`${count} verses`}
                          >
                            {theme} <span className="text-xs opacity-75">({count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Meters */}
                  <div className="bg-card border border-vedic-sage/20 rounded-xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-vedic-cream">Top Meters</h3>
                    <div className="space-y-3">
                      {topMeters.map(([meter, count]) => {
                        const maxCount = topMeters[0][1];
                        const percentage = (count / maxCount) * 100;
                        return (
                          <div key={meter}>
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold text-foreground">{meter}</span>
                              <span className="text-sm text-muted-foreground">{count} verses</span>
                            </div>
                            <div className="w-full bg-vedic-charcoal rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Geography Tab */}
              {activeTab === 'geography' && (
                <div className="bg-card border border-vedic-sage/20 rounded-xl p-6 shadow-xl text-vedic-cream">
                  <h3 className="text-xl font-bold mb-4">Geographic Explorer</h3>
                  <p className="mb-6">Explore the geographical references within the Rig Veda.</p>
                  <div className="space-y-4">
                    {regionsData.length > 0 ? (
                      regionsData.map((region, index) => (
                        <div key={index} className="border-b border-vedic-sage/20 pb-4 last:border-b-0">
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
              )}

              {/* Connections Tab */}
              {activeTab === 'connections' && (
                <div className="bg-card border border-vedic-sage/20 rounded-xl p-6 shadow-xl text-vedic-cream">
                  <h3 className="text-xl font-bold mb-4">Deity Network Graph</h3>
                  <p className="mb-6">Explore the intricate relationships and connections between different deities.</p>
                  <div className="space-y-4">
                    {deitiesData.length > 0 ? (
                      deitiesData.map((deity, index) => (
                        <div key={index} className="border-b border-vedic-sage/20 pb-4 last:border-b-0">
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
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="bg-card border border-vedic-sage/20 rounded-xl p-6 shadow-xl text-vedic-cream">
                  <h3 className="text-xl font-bold mb-4">Timeline Journey (Coming Soon)</h3>
                  <p>Journey through the chronological development and evolution of Vedic thought.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Discover;
