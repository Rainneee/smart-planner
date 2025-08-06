import Campaign from "./Campaign.jsx";

function CampaignList({campaigns, loading}) {

  return (
    <div className="overflow-auto min-w-full bg-white border border-neutral-200 rounded-xl dark:border-white/10">
      <table className='min-w-full table-fixed text-center text-sm font-light text-surface dark:text-white divide-y divide-gray-200 dark:divide-neutral-700'>
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-4 px-6 font-bold text-slate-700">Campaign</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">Client</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">Platform</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">Buy Type</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">Objective</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">CPU</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">Est. KPI</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">Cost</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">Start Date</th>
            <th className="text-left py-4 px-6 font-bold text-slate-700">End Date</th>
          </tr>
        </thead>
        <tbody>
          {!loading && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <Campaign key={campaign.id} campaign={campaign} />
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