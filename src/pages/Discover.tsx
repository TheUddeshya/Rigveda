import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useVerses } from '../hooks/useVerses';
import TabNavigation from '../components/discover/TabNavigation';
import AnalyticsTab from '../components/discover/tabs/AnalyticsTab';
import GeographyTab from '../components/discover/tabs/GeographyTab';
import ConnectionsTab from '../components/discover/tabs/ConnectionsTab';
import TimelineTab from '../components/discover/tabs/TimelineTab';
import type { Region, Deity } from '../types';

const Discover = () => {
  const { verses, loading } = useVerses();
  const [activeTab, setActiveTab] = useState<'analytics' | 'geography' | 'connections' | 'timeline'>('analytics');
  const [regionsData, setRegionsData] = useState<Region[]>([]);
  const [deitiesData, setDeitiesData] = useState<Deity[]>([]);

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
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-vedic-text">Discover Insights</h1>

          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {loading ? (
            <div className="text-center py-12 text-vedic-text">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="mt-4">Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'analytics' && (
                <AnalyticsTab topDeities={topDeities} topThemes={topThemes} topMeters={topMeters} />
              )}

              {activeTab === 'geography' && (
                <GeographyTab regionsData={regionsData} />
              )}

              {activeTab === 'connections' && (
                <ConnectionsTab deitiesData={deitiesData} />
              )}

              {activeTab === 'timeline' && (
                <TimelineTab />
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Discover;
