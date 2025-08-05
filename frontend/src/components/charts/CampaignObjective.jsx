import { Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

function CampaignObjective( { campaigns } ) {
  const objectiveCounts = useMemo(() => {
    return Object.entries(
      campaigns.reduce((acc, { objective }) => {
        acc[objective] = (acc[objective] || 0) + 1;
        return acc;
      }, {})
    ).map(([objective, count]) => ({ name: objective, value: count }));
  }, [campaigns]);

  return (
    <>
      <div className="col-span-1 min-h-100 bg-white shadow-lg rounded-2xl px-5 pb-5 pt-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={500} height={500}>
            <Tooltip />
            <Pie
              data={objectiveCounts}
              dataKey="value"
              nameKey="name"
              outerRadius={125}
              innerRadius={75}
              fill="green"
              label={({ name, value }) => `${name}: ${value}`}
            ></Pie>
            </PieChart>
        </ResponsiveContainer>  
      </div>
    </>
  )
}

export default CampaignObjective