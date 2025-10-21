"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, WeeklyPerformance } from "../../src/types/marketing";

export default function WeeklyView() {
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

  // Prepare data for Line Charts
  const weeklyData: WeeklyPerformance[] =
    marketingData?.campaigns.flatMap((c) => c.weekly_performance) || [];

  const chartData = weeklyData.map((w) => ({
    week: `${w.week_start} - ${w.week_end}`,
    spend: w.spend,
    revenue: w.revenue,
  }));

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
                Weekly View
              </h1>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spend Line Chart */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-white text-lg font-semibold mb-2">
                Weekly Spend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "white", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "white", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      color: "white",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Line
                    type="monotone"
                    dataKey="spend"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Line Chart */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-white text-lg font-semibold mb-2">
                Weekly Revenue
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "white", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "white", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      color: "white",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
