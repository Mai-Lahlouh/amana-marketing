"use client";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  formatValue?: (value: number) => string;
}

export function LineChart({ title, data, xKey, yKey, formatValue }: LineChartProps) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ReLineChart data={data}>
          <CartesianGrid stroke="#444" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip formatter={(value: any) => formatValue ? formatValue(value) : value} />
          <Line type="monotone" dataKey={yKey} stroke="#10B981" strokeWidth={2} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
