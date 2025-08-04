function Campaign({ campaign }) {
  return (
    <>
      <tr>
        <td>{campaign.campaign_name}</td>
        <td>{campaign.client}</td>
        <td>{campaign.platform}</td>
        <td>{campaign.buy_type}</td>
        <td>{campaign.objective}</td>
        <td>{campaign.placement}</td>
        <td>{campaign.cpu_value}</td>
        <td>{campaign.cpu_type}</td>
        <td>{campaign.est_kpi}</td>
        <td>{campaign.objective}</td>
        <td>{campaign.cost}</td>
        <td>{campaign.start_date}</td>
        <td>{campaign.end_date}</td>
      </tr>
    </>
  )
}


export default Campaign