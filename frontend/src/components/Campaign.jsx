function Campaign({ campaign }) {
  return (
    <>
      <tr className="border-b border-slate-100">
        <td className="py-4 px-6 text-left">
          <p className="font-bold text-slate-800">{campaign.campaign_name}</p>
          <p className="text-sm font-medium text-slate-500">{campaign.placement}</p>
        </td>
        <td className="py-4 px-6 text-left font-medium">{campaign.client}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.platform}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.buy_type}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.objective}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.cpu_value} {campaign.cpu_type}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.est_kpi} / {campaign.objective}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.cost}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.start_date}</td>
        <td className="py-4 px-6 text-left font-medium">{campaign.end_date}</td>
      </tr>
    </>
  )
}


export default Campaign