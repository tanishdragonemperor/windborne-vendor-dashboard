import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { VendorData } from '../types/vendor';

interface VendorChartsProps {
  vendors: VendorData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const VendorCharts: React.FC<VendorChartsProps> = ({ vendors }) => {

  const revenueData = vendors
    .filter(v => v.overview?.RevenueTTM)
    .map(vendor => ({
      name: vendor.symbol,
      revenue: parseFloat(vendor.overview?.RevenueTTM || '0') / 1000000000,
      marketCap: parseFloat(vendor.overview?.MarketCapitalization || '0') / 1000000000
    }));

  const profitabilityData = vendors
    .filter(v => v.overview?.ProfitMargin && v.overview?.ReturnOnEquityTTM)
    .map(vendor => ({
      name: vendor.symbol,
      profitMargin: parseFloat(vendor.overview?.ProfitMargin || '0') * 100,
      roe: parseFloat(vendor.overview?.ReturnOnEquityTTM || '0') * 100
    }));

  const sectorData = vendors
    .filter(v => v.overview?.Sector)
    .reduce((acc, vendor) => {
      const sector = vendor.overview?.Sector || 'Unknown';
      const existing = acc.find(item => item.name === sector);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: sector, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const revenueHistoryData = vendors
    .filter(v => v.income?.annualReports)
    .flatMap(vendor => 
      vendor.income?.annualReports.slice(0, 3).map(report => ({
        year: report.fiscalDateEnding,
        [vendor.symbol]: parseFloat(report.totalRevenue || '0') / 1000000000
      })) || []
    )
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.year === curr.year);
      if (existing) {
        Object.assign(existing, curr);
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => a.year.localeCompare(b.year));

  return (
    <div className="charts-container">
      <div className="chart-grid">
        <div className="chart-item">
          <h3>Revenue vs Market Cap (Billions USD)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(1)}B`, '']} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue (TTM)" />
              <Bar dataKey="marketCap" fill="#82ca9d" name="Market Cap" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Profitability Metrics (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']} />
              <Legend />
              <Bar dataKey="profitMargin" fill="#ffc658" name="Profit Margin" />
              <Bar dataKey="roe" fill="#ff7300" name="Return on Equity" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Sector Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {revenueHistoryData.length > 0 && (
          <div className="chart-item full-width">
            <h3>Revenue History (Billions USD)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value || 0).toFixed(1)}B`, '']} />
                <Legend />
                {vendors.map((vendor, index) => (
                  <Line
                    key={vendor.symbol}
                    type="monotone"
                    dataKey={vendor.symbol}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCharts;