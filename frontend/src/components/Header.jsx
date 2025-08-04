import { TrendingUp, Upload, Download, FileText} from 'lucide-react';

function Header() {
  return (
    <>
      <div className="bg-white shadow-lg border-b-2 border-orange-200 p-4">
        <div className='flex flex-col lg:flex-row lg:justify-between gap-2'>
          <div className='flex flex-row gap-2 place-items-center'>
            <div className='p-2 bg-orange-400 rounded-md'>
              <TrendingUp color='white' size={30}/>
            </div>
            <div id='texts'>
              <h1 className="text-2xl font-bold">Smart Media Planner</h1>
              <p className="text-sm text-gray-400">Benchmark & analyze campaigns</p>
            </div>
          </div>
          <div className='flex place-items-center flex-row gap-2'>
            <button className='px-4 py-2 bg-orange-400 border border-orange-400 rounded-lg flex flex-row place-items-center gap-2 shadow-sm'>
              <Upload color='white' size={20}/>
              <h2 className="text-base font-bold text-white">Upload Data</h2>
            </button>
            <button className='px-4 py-2 bg-white border border-gray-200 rounded-lg flex flex-row place-items-center gap-2 shadow-sm'>
              <Download color='black' size={20}/>
              <h2 className="text-base font-bold">Export CSV</h2>
            </button>
            <button className='px-4 py-2 bg-white border border-gray-200 rounded-lg flex flex-row place-items-center gap-2 shadow-sm'>
              <FileText color='black' size={20}/>
              <h2 className="text-base font-bold">Export PDF</h2>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header