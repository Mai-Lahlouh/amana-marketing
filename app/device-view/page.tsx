"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BarChart } from "../../src/components/ui/bar-chart";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, DevicePerformance } from "../../src/types/marketing";
import { DollarSign, MousePointerClick, Smartphone } from "lucide-react";

export default function DeviceView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const deviceMetrics = useMemo(() => {
    const metrics: Record<string, Omit<DevicePerformance, "device">> = {
      Mobile: { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0, ctr: 0, conversion_rate: 0, percentage_of_traffic: 0 },
      Desktop: { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0, ctr: 0, conversion_rate: 0, percentage_of_traffic: 0 },
    };

    marketingData?.campaigns.forEach((campaign) => {
      campaign.device_performance.forEach((perf) => {
        if (metrics[perf.device]) {
          metrics[perf.device].impressions += perf.impressions;
          metrics[perf.device].clicks += perf.clicks;
          metrics[perf.device].conversions += perf.conversions;
          metrics[perf.device].spend += perf.spend;
          metrics[perf.device].revenue += perf.revenue;
        }
      });
    });

    return metrics;
  }, [marketingData]);

  const revenueByDevice = useMemo(() => {
    return [
      { label: "Mobile", value: deviceMetrics.Mobile.revenue, color: "#3B82F6" },
      { label: "Desktop", value: deviceMetrics.Desktop.revenue, color: "#10B981" },
    ];
  }, [deviceMetrics]);

  const spendByDevice = useMemo(() => {
    return [
      { label: "Mobile", value: deviceMetrics.Mobile.spend, color: "#3B82F6" },
      { label: "Desktop", value: deviceMetrics.Desktop.spend, color: "#10B981" },
    ];
  }, [deviceMetrics]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-red-400">
          Error: {error}
        </div>
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
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Device Performance
              </h1>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <CardMetric
              title="Mobile Revenue"
              value={`$${deviceMetrics.Mobile.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={<Smartphone />}
            />
            <CardMetric
              title="Mobile Spend"
              value={`$${deviceMetrics.Mobile.spend.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={<DollarSign />}
            />
            <CardMetric
              title="Mobile Clicks"
              value={deviceMetrics.Mobile.clicks.toLocaleString()}
              icon={<MousePointerClick />}
            />
            <CardMetric
              title="Desktop Revenue"
              value={`$${deviceMetrics.Desktop.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={<Smartphone />}
            />
            <CardMetric
              title="Desktop Spend"
              value={`$${deviceMetrics.Desktop.spend.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={<DollarSign />}
            />
            <CardMetric
              title="Desktop Clicks"
              value={deviceMetrics.Desktop.clicks.toLocaleString()}
              icon={<MousePointerClick />}
            />
          </div>

          {/* Bar Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <BarChart
              title="Revenue by Device"
              data={revenueByDevice}
              formatValue={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            />
            <BarChart
              title="Spend by Device"
              data={spendByDevice}
              formatValue={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
