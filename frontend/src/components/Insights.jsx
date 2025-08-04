function Insights() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 shadow-lg shadow-emerald-100 rounded-2xl border border-emerald-300 hover:shadow-xl hover:border-emerald-400">
          <h1>Average CPU</h1>
          <h2>CPU value</h2>
          <h4>Median: median cpu value</h4>
        </div>
        <div className="col-span-1 bg-white p-4 shadow-lg shadow-blue-100 rounded-2xl border border-blue-300 hover:shadow-xl hover:border-blue-400">
          <h1>Average Cost</h1>
          <h2>Cost value</h2>
          <h4>Median: median cost value</h4>
        </div>
        <div className="col-span-1 bg-white p-4 shadow-lg shadow-orange-100 rounded-2xl border border-orange-300 hover:shadow-xl hover:border-orange-400">
          <h1>Average Est. KPI</h1>
          <h2>Est. KPI value</h2>
          <h4>Median: median Est. KPI value</h4>
        </div>
      </div>
    </>
  )
}

export default Insights