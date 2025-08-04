import Metric from "./Metric";
import { Users, DollarSign, Target } from 'lucide-react';

function Insights({benchmarks}) {
  const metrics = [
    {
      title: "Average CPU",
      value: benchmarks.cpu.average,
      median: benchmarks.cpu.median,
      icon: Users
    },
    {
      title: 'Average Cost',
      value: benchmarks.cost.average,
      median: benchmarks.cost.average,
      icon: DollarSign
    }
    ,
    {
      title: 'Average KPI',
      value: benchmarks.kpi.average,
      median: benchmarks.kpi.average,
      icon: Target
    }
  ];
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Metric key={index} metric={metric} />
        ))}
      </div>
    </>
  )
}

export default Insights