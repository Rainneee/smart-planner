import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

function PlatformKPI( { campaigns } ) {
  const averageKpiPerPlatform = useMemo(() => {
    if (!Array.isArray(campaigns)) return [];

    const totals = campaigns.reduce((acc, { platform, est_kpi }) => {
      if (!acc[platform]) {
        acc[platform] = { total: 0, count: 0 };
      }
      acc[platform].total += Number(est_kpi);
      acc[platform].count += 1;
      return acc;
    }, {});

    return Object.entries(totals).map(([platform, { total, count }]) => ({
      platform,
      est_kpi: +(total / count).toFixed(2),
    }));
  }, [campaigns]);

  return (
    <div className="col-span-1 min-h-80 bg-white shadow-lg rounded-2xl px-5 pb-5 pt-8">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={averageKpiPerPlatform}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="est_kpi" fill="#3b82f6" name="Avg KPI" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlatformKPI;
