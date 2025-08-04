// CampaignList.js
import { useState, useEffect } from 'react'
import Campaign from "./Campaign.jsx";
import AxiosInstance from './Axios.jsx';

function CampaignList() {
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
  },[])

  return (
    <div className="overflow-auto min-w-full bg-white border border-neutral-200 rounded-xl dark:border-white/10">
      <table className='min-w-full table-fixed text-center text-sm font-light text-surface dark:text-white divide-y divide-gray-200 dark:divide-neutral-700'>
        <thead>
          <tr className="bg-gray-50">
            <th>Campaign</th>
            <th>Client</th>
            <th>Platform</th>
            <th>Buy Type</th>
            <th>Objective</th>
            <th>Placement</th>
            <th colSpan={2}>CPU</th>
            <th colSpan={2}>Est. KPI</th>
            <th>Cost</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {!loading && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <Campaign campaign={campaign} />
            ))
          ) : (
            <tr>
              <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                {loading ? <p>Loading...</p> : <p>No campaigns found</p>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignList;