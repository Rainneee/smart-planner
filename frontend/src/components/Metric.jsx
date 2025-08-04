import { NumericFormat } from 'react-number-format';

function Metric({metric}) {
  const { icon: Icon, title, value, median, gradient, border, hover } = metric;
  
  const CPUFormat = () => (
    <NumericFormat
      value={value}
      thousandSeparator=","
      prefix={title !== "Average KPI" ? "₱" : undefined}
      className="text-xl font-bold"
      displayType="text"
    />
  );

  const MedianFormat = () => (
    <NumericFormat
      value={median}
      thousandSeparator=","
      prefix={title !== "Average KPI" ? "₱" : undefined}
      className="text-base"
      displayType="text"
    />
  );

  return (
    <>
      <div className={`col-span-1 bg-white p-8 shadow-lg rounded-2xl border-2 ${border} hover:shadow-xl ${hover}`}>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className={`p-2 bg-gradient-to-r ${gradient} rounded-xl shadown-sm`}>
            <Icon color='white' size={30}/>
          </div>
        </div>
        {CPUFormat()}
        <h4 className="text-base">Median: {MedianFormat()}</h4>
      </div>
    </>
  )
}

export default Metric