import {XAxis, YAxis, Line, LineChart, CartesianGrid, Tooltip} from 'recharts'
import './index.css'

const LineChartItem = props => {
  const {summaryDetails, timelineGraphsData} = props
  const {id} = summaryDetails
  const {
    dailyConfirmedData,
    dailyDeceasedData,
    dailyTestedData,
    dailyRecoveredData,
    dailyActiveData,
  } = timelineGraphsData

  let data
  let chartClassName
  let fillColor
  let dataKey

  if (id === 1) {
    data = dailyConfirmedData
    chartClassName = 'confirmed-data'
    fillColor = '#ff3366'
    dataKey = 'confirmed'
  } else if (id === 2) {
    data = dailyActiveData
    chartClassName = 'active-data'
    fillColor = '#007BFF'
    dataKey = 'active'
  } else if (id === 3) {
    data = dailyRecoveredData
    chartClassName = 'recovered-data'
    fillColor = '#27A243'
    dataKey = 'recovered'
  } else if (id === 4) {
    data = dailyDeceasedData
    chartClassName = 'deceased-data'
    fillColor = '#6C757D'
    dataKey = 'deceased'
  } else if (id === 5) {
    data = dailyTestedData
    chartClassName = 'tested-data'
    fillColor = '#9673B9'
    dataKey = 'tested'
  }

  const DataFormatter = number => {
    if (number >= 100000) {
      return `${(number / 100000).toFixed(1)}L`
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k`
    }
    return number.toString()
  }

  const tickStyle = {
    fill: fillColor,
    fontSize: 12,
  }

  return (
    <li>
      <LineChart
        data={data}
        className={chartClassName}
        width={900}
        height={300}
      >
        <CartesianGrid stroke="none" />
        <XAxis dataKey="date" stroke={fillColor} tick={tickStyle} />
        <YAxis
          stroke={fillColor}
          tick={tickStyle}
          tickFormatter={DataFormatter}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#2b0b25',
            border: `1px solid ${fillColor}`,
            color: '#fff',
          }}
          labelStyle={{color: fillColor}}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={fillColor}
          strokeWidth={3}
          dot={{r: 3, stroke: fillColor, fill: fillColor}}
          activeDot={{r: 6}}
        />
      </LineChart>
    </li>
  )
}

export default LineChartItem
