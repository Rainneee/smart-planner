import PlatformPerformanceAnalysis from "./charts/PlatformPerformanceAnalysis.jsx"
import PlatformPerformanceBenchmark from "./charts/PlatformPerformanceBenchmark.jsx"
import CampaignObjective from "./charts/CampaignObjective.jsx"
import CostEfficiency from "./charts/CostEfficiency.jsx"
import Recommendations from "./charts/Recommendations.jsx"

function Charts() {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-2 bg-slate-300 shadow rounded-2xl">
        <PlatformPerformanceAnalysis />
        <PlatformPerformanceBenchmark />
        <CampaignObjective />
        <CostEfficiency />
        <Recommendations />
      </section>
    </>
  )
}

export default Charts