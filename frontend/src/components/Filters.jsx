import { Search } from 'lucide-react';

function Filters({ filters, setFilters, searchTerm, setSearchTerm, campaigns, filteredCount }) {
  const getUniqueValues = (key) => [...new Set(campaigns?.map(c => c[key]))];
  console.log(campaigns)
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-slate-50 focus:bg-white"
              />
            </div>
            
            <select
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-slate-50 focus:bg-white font-medium"
            >
              <option value="">All Platforms</option>
              {getUniqueValues('platform').map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            
            <select
              value={filters.objective}
              onChange={(e) => setFilters({ ...filters, objective: e.target.value })}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-slate-50 focus:bg-white font-medium"
            >
              <option value="">All Objectives</option>
              {getUniqueValues('objective').map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            
            <select
              value={filters.buy_type}
              onChange={(e) => setFilters({ ...filters, buy_type: e.target.value })}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-slate-50 focus:bg-white font-medium"
            >
              <option value="">All Buy Types</option>
              {getUniqueValues('buy_type').map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl">
              <span className="font-bold text-lg">{filteredCount}</span>
              <span className="ml-2 font-medium">campaigns</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Filters