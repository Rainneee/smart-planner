import Header from './components/Header.jsx'
import CampaignList from './components/CampaignList.jsx'
import Filters from './components/Filters.jsx'
import Insights from './components/Insights.jsx'
import Charts from './components/Charts.jsx'
import AxiosInstance from './components/Axios.jsx';
import { useState, useEffect, useMemo } from 'react'
import { BarChart3 } from 'lucide-react'

function App() {
  const [campaigns, setCampaigns] = useState()
  const [loading, setLoading] = useState(true)
  const [uploadError, setUploadError] = useState(null);
  const [filters, setFilters] = useState({
    platform: '',
    objective: '',
    buy_type: '',
    client: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const GetData = () => {
    AxiosInstance.get('campaigns/').then((res) => {
      setCampaigns(res.data)
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

  const filteredCampaigns = useMemo(() => {
    if (loading || !campaigns || campaigns.length === 0) return null;
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            campaign.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = !filters.platform || campaign.platform === filters.platform;
      const matchesObjective = !filters.objective || campaign.objective === filters.objective;
      const matchesBuyType = !filters.buy_type || campaign.buy_type === filters.buy_type;
      const matchesClient = !filters.client || campaign.client === filters.client;
      
      return matchesSearch && matchesPlatform && matchesObjective && matchesBuyType && matchesClient;
    });
  }, [campaigns, filters, searchTerm]);
  
  const benchmarks = useMemo(() => {
    if (loading || !filteredCampaigns || filteredCampaigns.length === 0) return null;

    const cpus = filteredCampaigns.map(c => parseFloat(c.cpu_value) || 0);
    const costs = filteredCampaigns.map(c => parseFloat(c.cost) || 0);
    const kpis = filteredCampaigns.map(c => parseFloat(c.est_kpi) || 0);

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
  }, [filteredCampaigns, loading]);

  const handleFileUpload = (mappedData) => {
    const campaignsArray = Array.isArray(mappedData) ? mappedData : [];
    setCampaigns(prevCampaigns => [...prevCampaigns, ...campaignsArray]);
    setUploadError(null);
  };

  return (
    <>
      <Header 
        onFileUpload={handleFileUpload}
        uploadError={uploadError}
        setUploadError={setUploadError}
      />
      {!loading ? (
        <section className='p-6 min-h-screen bg-blue-50 flex flex-col gap-6'>
          <Filters 
            filters={filters}
            setFilters={setFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            campaigns={campaigns}
            filteredCount={filteredCampaigns?.length || 0}
          />
          {!filteredCampaigns || filteredCampaigns.length === 0 ? (
            <div className="h-80 bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center">
              <BarChart3 className="w-16 h-16 text-orange-400 mb-4" />
              <h4 className="text-xl font-bold text-slate-600 mb-2">No campaigns found</h4>
              <p className="text-sm font-medium text-slate-500">Upload campaign data or adjust your filters</p>
            </div>
          ) : (
            <div id='report' className='flex flex-col gap-6'>
              {benchmarks && (
              <Insights benchmarks={benchmarks} loading={loading} />
              )}
              <Charts campaigns={filteredCampaigns}/>
              <CampaignList campaigns={filteredCampaigns} loading={loading} />
            </div>
          )}
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