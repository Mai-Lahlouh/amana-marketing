"use client";
import { Navbar } from "../../src/components/ui/navbar";
import { CardMetric } from "../../src/components/ui/card-metric";
import { Footer } from "../../src/components/ui/footer";
import { Users, TrendingUp, DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Campaign } from "@/src/types/marketing";
import { fetchMarketingData } from "@/src/lib/api";
import { BarChart } from "@/src/components/ui/bar-chart";
import { Table } from "@/src/components/ui/table";

export default function DemographicView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setCampaigns(data.campaigns || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const maleMetrics = useMemo(() => {
    let clicks = 0,
      spend = 0,
      revenue = 0;
    campaigns.forEach((c) => {
      c.demographic_breakdown
        .filter((d) => d.gender === "Male")
        .forEach((d) => {
          clicks += d.performance.clicks;
          revenue += d.performance.conversions * c.average_order_value;
          spend += d.performance.conversions * c.cpa;
        });
    });
    return { clicks, spend, revenue };
  }, [campaigns]);

  const femaleMetrics = useMemo(() => {
    let clicks = 0,
      spend = 0,
      revenue = 0;
    campaigns.forEach((c) => {
      c.demographic_breakdown
        .filter((d) => d.gender === "Female")
        .forEach((d) => {
          clicks += d.performance.clicks;
          revenue += d.performance.conversions * c.average_order_value;
          spend += d.performance.conversions * c.cpa;
        });
    });
    return { clicks, spend, revenue };
  }, [campaigns]);

  const spendByAgeGroup = useMemo(() => {
    const ageGroups: Record<string, number> = {};
    campaigns.forEach((c) => {
      c.demographic_breakdown.forEach((d) => {
        if (!ageGroups[d.age_group]) ageGroups[d.age_group] = 0;
        ageGroups[d.age_group] += d.performance.conversions * c.cpa;
      });
    });
    return Object.entries(ageGroups).map(([label, value]) => ({
      label,
      value,
      color: "#3B82F6",
    }));
  }, [campaigns]);

  const revenueByAgeGroup = useMemo(() => {
    const ageGroups: Record<string, number> = {};
    campaigns.forEach((c) => {
      c.demographic_breakdown.forEach((d) => {
        if (!ageGroups[d.age_group]) ageGroups[d.age_group] = 0;
        ageGroups[d.age_group] +=
          d.performance.conversions * c.average_order_value;
      });
    });
    return Object.entries(ageGroups).map(([label, value]) => ({
      label,
      value,
      color: "#10B981",
    }));
  }, [campaigns]);

  const tableDataByGender = (gender: "Male" | "Female") => {
    const data: any[] = [];
    campaigns.forEach((c) => {
      c.demographic_breakdown
        .filter((d) => d.gender === gender)
        .forEach((d) => {
          data.push({
            campaignName: c.name,
            age_group: d.age_group,
            impressions: d.performance.impressions,
            clicks: d.performance.clicks,
            conversions: d.performance.conversions,
            ctr: d.performance.ctr,
            conversion_rate: d.performance.conversion_rate,
          });
        });
    });
    return data;
  };

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
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-6 sm:py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {error ? (
                <div className="bg-red-900 border border-red-700 text-red-200 px-3 py-2 rounded">
                  Error loading data: {error}
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                  Demographic View
                </h1>
              )}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-full">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <CardMetric
              title="Total Clicks by Males"
              value={maleMetrics.clicks}
              icon={<Users />}
            />
            <CardMetric
              title="Total Spend by Males"
              value={`$${maleMetrics.spend.toFixed(2)}`}
              icon={<DollarSign />}
            />
            <CardMetric
              title="Total Revenue by Males"
              value={`$${maleMetrics.revenue.toFixed(2)}`}
              icon={<TrendingUp />}
            />

            <CardMetric
              title="Total Clicks by Females"
              value={femaleMetrics.clicks}
              icon={<Users />}
            />
            <CardMetric
              title="Total Spend by Females"
              value={`$${femaleMetrics.spend.toFixed(2)}`}
              icon={<DollarSign />}
            />
            <CardMetric
              title="Total Revenue by Females"
              value={`$${femaleMetrics.revenue.toFixed(2)}`}
              icon={<TrendingUp />}
            />
          </div>
          {/* Bar Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <BarChart
              title="Total Spend by Age Group"
              data={spendByAgeGroup}
              formatValue={(v) => `$${v.toFixed(2)}`}
            />
            <BarChart
              title="Total Revenue by Age Group"
              data={revenueByAgeGroup}
              formatValue={(v) => `$${v.toFixed(2)}`}
            />
          </div>
          {/* Tables */}
          <div className="mb-6 overflow-x-auto">
            <Table
              title="Campaign Performance by Male Age Groups"
              columns={[
                { key: "campaignName", header: "Campaign", sortable: true },
                { key: "age_group", header: "Age Group" },
                { key: "impressions", header: "Impressions" },
                { key: "clicks", header: "Clicks" },
                { key: "conversions", header: "Conversions" },
                { key: "ctr", header: "CTR (%)", render: (v) => v.toFixed(2) },
                {
                  key: "conversion_rate",
                  header: "Conversion Rate (%)",
                  render: (v) => v.toFixed(2),
                },
              ]}
              data={tableDataByGender("Male")}
            />
          </div>

          <div className="mb-6 mb-6 overflow-x-auto">
            <Table
              title="Campaign Performance by Female Age Groups"
              columns={[
                { key: "campaignName", header: "Campaign", sortable: true },
                { key: "age_group", header: "Age Group" },
                { key: "impressions", header: "Impressions" },
                { key: "clicks", header: "Clicks" },
                { key: "conversions", header: "Conversions" },
                { key: "ctr", header: "CTR (%)", render: (v) => v.toFixed(2) },
                {
                  key: "conversion_rate",
                  header: "Conversion Rate (%)",
                  render: (v) => v.toFixed(2),
                },
              ]}
              data={tableDataByGender("Female")}
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
