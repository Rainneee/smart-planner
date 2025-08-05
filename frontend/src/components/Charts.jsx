import PlatformKPI from "./charts/PlatformKPI.jsx"
import CampaignObjective from "./charts/CampaignObjective.jsx"

function Charts( { campaigns } ) {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-2 bg-slate-300 shadow rounded-2xl">
        <PlatformKPI campaigns={campaigns}/>
        <CampaignObjective campaigns={campaigns}/>
      </section>
    </>
  )
}

export default Charts