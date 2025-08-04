import CampaignList from './components/CampaignList.jsx'
import Filters from './components/Filters.jsx'
import Insights from './components/Insights.jsx'
import Charts from './components/Charts.jsx'
import AxiosInstance from './components/Axios.jsx';
import { useState, useEffect, useMemo } from 'react'

function App() {
  const [campaigns, setData] = useState()
  const [loading, setLoading] = useState(true)

  const GetData = () => {
    AxiosInstance.get('campaigns/').then((res) => {
      setData(res.data)
      setLoading(false)
    })
    .catch((err) => {
      console.error('Error:', err);
      setLoading(false);
    });
  }

  useEffect(() => {
    GetData();
  }, [])
  
  const benchmarks = useMemo(() => {
    // Wait until loading is complete and campaigns exist
    if (loading || !campaigns || campaigns.length === 0) return null;

    const cpus = campaigns.map(c => c.cpu_value);
    const costs = campaigns.map(c => c.cost);
    const kpis = campaigns.map(c => c.est_kpi);

    const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const median = (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };
    console.log(median(cpus))

    return {
      cpu: { average: average(cpus), median: median(cpus) },
      cost: { average: average(costs), median: median(costs) },
      kpi: { average: average(kpis), median: median(kpis) }
    };
  }, [campaigns, loading]);

  return (
    <>
      {!loading ? (
        <section className='p-6 min-h-screen bg-blue-50 flex flex-col gap-6'>
          <Filters />
          {benchmarks && (
            <Insights benchmarks={benchmarks} loading={loading} />
          )}
          <Charts />
          <CampaignList campaigns={campaigns} loading={loading} />
        </section>
      ) : (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 text-lg">Loading dashboard...</span>
        </div>
      )}
    </>
  )
}

export default App
