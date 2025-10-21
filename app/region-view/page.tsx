"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { BubbleMap } from "../../src/components/ui/BubbleMap";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, Campaign, RegionalPerformance } from "../../src/types/marketing";

// Extend RegionalPerformance type to include lat/lng
interface RegionalPerformanceWithCoords extends RegionalPerformance {
  lat: number;
  lng: number;
}

export default function RegionView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [allRegions, setAllRegions] = useState<RegionalPerformanceWithCoords[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cityCoords: Record<string, { lat: number; lng: number }> = {
    "Abu Dhabi": { lat: 24.4539, lng: 54.3773 },
    "Dubai": { lat: 25.276987, lng: 55.296249 },
    "Sharjah": { lat: 25.357964, lng: 55.3913 },
    "Riyadh": { lat: 24.7136, lng: 46.6753 },
    "Doha": { lat: 25.2854, lng: 51.531 },
    "Kuwait City": { lat: 29.3759, lng: 47.9774 },
    "Manama": { lat: 26.2235, lng: 50.5876 },
    // Add more cities dynamically if needed
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);

        const regions: RegionalPerformanceWithCoords[] = data.campaigns.flatMap((c: Campaign) =>
          c.regional_performance.map((r) => ({
            ...r,
            lat: cityCoords[r.region]?.lat || 0,
            lng: cityCoords[r.region]?.lng || 0,
          }))
        );

        setAllRegions(regions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold">
                Region View
              </h1>
            </div>
          </div>
        </section>

        {/* Bubble Map */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {allRegions.length > 0 && (
            <BubbleMap data={allRegions} valueKey="revenue" labelKey="region" />
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
