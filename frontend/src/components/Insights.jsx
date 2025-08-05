import Metric from "./Metric";
import { Users, DollarSign, Target } from 'lucide-react';

function Insights({ benchmarks }) {
  const metrics = [
    {
      title: "Average CPU",
      value: benchmarks.cpu.average,
      median: benchmarks.cpu.median,
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-300',
      hover: 'hover:border-green-400'
    },
    {
      title: 'Average Cost',
      value: benchmarks.cost.average,
      median: benchmarks.cost.average,
      icon: DollarSign,
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-300',
      hover: 'hover:border-blue-400'
    }
    ,
    {
      title: 'Average KPI',
      value: benchmarks.kpi.average,
      median: benchmarks.kpi.average,
      icon: Target,
      gradient: 'from-orange-500 to-orange-600',
      border: 'border-orange-300',
      hover: 'hover:border-orange-400'
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