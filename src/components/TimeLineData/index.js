import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BarChart, Bar, XAxis, YAxis} from 'recharts'
import LineChartItem from '../LineChartItem'
import './index.css'
import {covidSummaryList} from '../staticLists'

class TimeLineData extends Component {
  state = {
    lastTenDaysData: {},
    timelineGraphsData: {},
    isTimelineLoading: true,
    activeDistrictName: '',
    ditrictData: [],
    districtTimelineData: {},
    activedistrictData: [],
  }

  componentDidMount() {
    this.getTimelineData()
  }

  componentDidUpdate(prevProps, prevState) {
    const {activeDistrictName} = this.state
    if (prevState.activeDistrictName !== activeDistrictName) {
      this.getTimelineData()
    }
  }

  getTimelineData = async () => {
    const {stateCode} = this.props
    const {activeDistrictName} = this.state

    const timelineUrl = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`
    const timelineResponse = await fetch(timelineUrl)
    const timelineData = await timelineResponse.json()
    const stateTimeline = timelineData[stateCode]?.dates || {}

    const ditrictData = Object.entries(timelineData[stateCode]?.districts || {})

    const districtWiseData = ditrictData.map(([district, data]) => ({
      district,
      dates: Object.entries(data?.dates || {}),
    }))

    const activedistrictData = districtWiseData.find(
      d =>
        d.district.toLowerCase().trim() ===
        activeDistrictName.toLowerCase().trim(),
    )

    const districtConfirmedData =
      activedistrictData?.dates.map(([date, data]) => ({
        date,
        confirmed: data?.total?.confirmed || 0,
      })) || []

    const districtRecovereddData =
      activedistrictData?.dates.map(([date, data]) => ({
        date,
        recovered: data?.total?.recovered || 0,
      })) || []

    const districtDeceasedData =
      activedistrictData?.dates.map(([date, data]) => ({
        date,
        deceased: data?.total?.deceased || 0,
      })) || []

    const districtTetsedData =
      activedistrictData?.dates.map(([date, data]) => ({
        date,
        tested: data?.total?.tested || 0,
      })) || []

    const districtActiveData =
      activedistrictData?.dates.map(([date, data]) => {
        const confirmed = data?.total?.confirmed || 0
        const recovered = data?.total?.recovered || 0
        const deceased = data?.total?.deceased || 0
        return {
          date,
          active: confirmed - (recovered + deceased),
        }
      }) || []

    const lastTenDaysConfirmedData = Object.entries(stateTimeline)
      .slice(-10)
      .map(([date, data]) => ({
        date,
        confirmed: data.total?.confirmed || 0,
      }))

    const lastTenDaysRecovereddData = Object.entries(stateTimeline)
      .slice(-10)
      .map(([date, data]) => ({
        date,
        recovered: data.total?.recovered || 0,
      }))

    const lastTenDaysDeceasedData = Object.entries(stateTimeline)
      .slice(-10)
      .map(([date, data]) => ({
        date,
        deceased: data.total?.deceased || 0,
      }))

    const lastTenDaysActiveData = Object.entries(stateTimeline)
      .slice(-10)
      .map(([date, data]) => {
        const confirmed = data?.total?.confirmed || 0
        const recovered = data?.total?.recovered || 0
        const deceased = data?.total?.deceased || 0
        return {
          date,
          active: confirmed - (recovered + deceased),
        }
      })

    const dailyConfirmedData = Object.entries(stateTimeline).map(
      ([date, data]) => ({
        date,
        confirmed: data.total?.confirmed || 0,
      }),
    )

    const dailyRecoveredData = Object.entries(stateTimeline).map(
      ([date, data]) => ({
        date,
        recovered: data.total?.recovered || 0,
      }),
    )

    const dailyDeceasedData = Object.entries(stateTimeline).map(
      ([date, data]) => ({
        date,
        deceased: data.total?.deceased || 0,
      }),
    )

    const dailyTestedData = Object.entries(stateTimeline).map(
      ([date, data]) => ({
        date,
        tested: data.total?.tested || 0,
      }),
    )

    const dailyActiveData = Object.entries(stateTimeline).map(
      ([date, data]) => {
        const confirmed = data?.total?.confirmed || 0
        const recovered = data?.total?.recovered || 0
        const deceased = data?.total?.deceased || 0
        return {
          date,
          active: confirmed - (recovered + deceased),
        }
      },
    )
    console.log(timelineData)
    console.log(stateTimeline)
    console.log(ditrictData)

    this.setState({
      timelineGraphsData: {
        dailyConfirmedData,
        dailyDeceasedData,
        dailyTestedData,
        dailyRecoveredData,
        dailyActiveData,
      },
      lastTenDaysData: {
        lastTenDaysConfirmedData,
        lastTenDaysActiveData,
        lastTenDaysRecovereddData,
        lastTenDaysDeceasedData,
      },
      districtTimelineData: {
        districtActiveData,
        districtTetsedData,
        districtConfirmedData,
        districtDeceasedData,
        districtRecovereddData,
      },
      isTimelineLoading: false,
      ditrictData,
    })
  }

  onChangeDistrict = event =>
    this.setState(
      {activeDistrictName: event.target.value},
      this.getTimelineData,
    )

  renderTimelinesDataLoader = () => (
    <div testid="timelinesDataLoader" className="loader-container">
      <Loader type="Oval" color="#007BFF" height={50} />
    </div>
  )

  renderLineChartsView = () => {
    const {
      timelineGraphsData,
      activeDistrictName,
      ditrictData,
      districtTimelineData,
    } = this.state

    return (
      <div className="line-charts-container">
        <h1 className="daily-spread-trends">Daily Spread Trends</h1>
        <select
          className="district-drop-down-list"
          value={activeDistrictName}
          onChange={this.onChangeDistrict}
        >
          <option value="" disabled>
            Select District
          </option>
          {ditrictData.map(district => (
            <option value={district[0]} key={district[0]}>
              {district[0]}
            </option>
          ))}
        </select>
        <ul testid="lineChartsContainer" className="line-charts-list-container">
          {covidSummaryList.map(eachData => (
            <LineChartItem
              districtTimelineData={districtTimelineData}
              activeDistrictName={activeDistrictName}
              key={eachData.id}
              summaryDetails={eachData}
              timelineGraphsData={timelineGraphsData}
            />
          ))}
        </ul>
      </div>
    )
  }

  onGetSpecificSummaryGraph = () => {
    let renderedData
    let dataKey
    let fillColor

    const {lastTenDaysData} = this.state
    const {activeSummaryId} = this.props

    const {
      lastTenDaysActiveData,
      lastTenDaysConfirmedData,
      lastTenDaysDeceasedData,
      lastTenDaysRecovereddData,
    } = lastTenDaysData

    const DataFormatter = number => {
      if (number >= 100000) {
        return `${(number / 100000).toFixed(1)}L`
      }
      if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}k`
      }
      return number.toString()
    }
    if (activeSummaryId === 1) {
      dataKey = 'confirmed'
      renderedData = lastTenDaysConfirmedData
      fillColor = '#9A0E31'
    } else if (activeSummaryId === 2) {
      dataKey = 'active'
      renderedData = lastTenDaysActiveData
      fillColor = '#0A4FA0'
    } else if (activeSummaryId === 3) {
      dataKey = 'recovered'
      renderedData = lastTenDaysRecovereddData
      fillColor = '#216837'
    } else {
      dataKey = 'deceased'
      renderedData = lastTenDaysDeceasedData
      fillColor = '#474C57'
    }

    return (
      <BarChart
        data={renderedData}
        margin={{top: 5, right: 20, left: 20, bottom: 5}}
        width={900}
        height={300}
      >
        <XAxis
          dataKey="date"
          tick={{stroke: fillColor, strokeWidth: 1}}
          padding={{left: 10, right: 10}}
          axisLine={false}
          tickLine={false}
          tickFormatter={date => {
            const options = {day: '2-digit', month: 'short'}
            return new Date(date)
              .toLocaleDateString('en-US', options)
              .toUpperCase()
          }}
        />
        <YAxis
          tickFormatter={DataFormatter}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <Bar
          dataKey={dataKey}
          fill={fillColor}
          barSize={50}
          name="Confirmed Cases"
          radius={[8, 8, 0, 0]}
          label={{
            position: 'top',
            formatter: DataFormatter,
            fill: fillColor,
            fontSize: 12,
            fontWeight: 'bold',
          }}
        />
      </BarChart>
    )
  }

  render() {
    const {isTimelineLoading} = this.state

    return (
      <div className="state-time-line-container">
        {isTimelineLoading ? (
          this.renderTimelinesDataLoader()
        ) : (
          <>
            <div className="bar-graph-wrapper">
              {this.onGetSpecificSummaryGraph()}
            </div>
            {this.renderLineChartsView()}
          </>
        )}
      </div>
    )
  }
}

export default TimeLineData
