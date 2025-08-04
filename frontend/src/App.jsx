import './css/App.css'
import CampaignList from './components/CampaignList.jsx'
import Filters from './components/Filters.jsx'
import Insights from './components/Insights.jsx'
import Chart from './components/Chart.jsx'

function App() {

  return (
    <>
      <section className='p-6 min-h-screen bg-blue-50 flex flex-col gap-6'>
        <Filters />
        <Insights />
        <Chart />
        <CampaignList />
      </section>
    </>
  )
}

export default App
