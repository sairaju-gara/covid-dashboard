import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BarChart, Bar, XAxis, YAxis} from 'recharts'

import SummaryCardItem from '../SummaryCardItem'
import DistrictAndCases from '../DistrictAndCases'
import Footer from '../Footer'
import LineChartItem from '../LineChartItem'
import './index.css'

const covidSummaryList = [
  {
    id: 1,
    labelName: 'Confirmed',
    labelImage:
      'https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700307/check-mark_1_x8ozyn.png',
  },
  {
    id: 2,
    labelName: 'Active',
    labelImage:
      'https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700351/Group_yzjl5m.png',
  },
  {
    id: 3,
    labelName: 'Recovered',
    labelImage:
      'https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700395/Vector_1_zktyrv.png',
  },
  {
    id: 4,
    labelName: 'Deceased',
    labelImage:
      'https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700437/Corona_Virus_Symptoms_Shortness_of_breath_au62xw.png',
  },
  {
    id: 5,
  },
]

const intialStatesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

class StateSpecificPage extends Component {
  state = {
    stateData: {},
    districtsData: [],
    totalStatus: {},
    activeSummaryId: covidSummaryList[0].id,
    isTimelineLoading: true,
    isStateDataLoading: true,
    activeStateName: null,
    timelineGraphsData: [],
  }

  componentDidMount() {
    this.getCoviddata()
  }

  formatedData = ([stateCode, stateData]) => ({
    stateCode,
    total: stateData.total,
    meta: stateData.meta,
    districts: Object.entries(stateData.districts),
  })

  getCoviddata = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params

    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const timelineUrl = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`

    const response = await fetch(apiUrl)
    const covidData = await response.json()

    const state = Object.entries(covidData).find(
      entry => entry[0] === stateCode,
    )

    const updatedStateData = this.formatedData(state)

    const districtsData = Object.entries(state[1].districts)

    districtsData.sort(
      (a, b) => (b[1]?.total?.tested || 0) - (a[1]?.total?.tested || 0),
    )

    const testedCases = updatedStateData?.total?.confirmed || 0

    const timelineResponse = await fetch(timelineUrl)
    const timelineData = await timelineResponse.json()
    const stateTimeline = timelineData[stateCode]?.dates || {}

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

    console.log(state)
    console.log(covidData)

    const activeStateName = intialStatesList.find(
      eachState => eachState.state_code === stateCode,
    ).state_name

    const totalData = covidData?.TT?.total || {}
    // const totalData = state[1]?.total || {}
    const {confirmed, recovered, deceased} = totalData
    const active = confirmed - (recovered + deceased)
    this.setState({
      stateData: updatedStateData,
      activeStateName,
      totalStatus: {
        confirmed,
        active,
        recovered,
        deceased,
      },
      districtsData,
      testedCases,
      confirmedTimelineData: lastTenDaysConfirmedData,
      activeTimelineData: lastTenDaysActiveData,
      recoveredTimelineData: lastTenDaysRecovereddData,
      deceasedTimelineData: lastTenDaysDeceasedData,
      timelineGraphsData: {
        dailyConfirmedData,
        dailyDeceasedData,
        dailyTestedData,
        dailyRecoveredData,
        dailyActiveData,
      },
      isTimelineLoading: false,
      isStateDataLoading: false,
    })
  }

  onChnageSummaryId = id => this.setState({activeSummaryId: id})

  renderStateDetailsLoader = () => (
    <div data-testid="stateDetailsLoader" className="loader-container">
      <Loader type="Oval" color="#007BFF" height={50} />
    </div>
  )

  renderTimelinesDataLoader = () => (
    <div testid="timelinesDataLoader" className="loader-container">
      <Loader type="Oval" color="#007BFF" height={50} />
    </div>
  )

  onGetSpecificSummaryGraph = () => {
    let renderedData
    let dataKey
    let fillColor

    const {
      activeSummaryId,
      confirmedTimelineData,
      recoveredTimelineData,
      deceasedTimelineData,
      activeTimelineData,
    } = this.state

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
      renderedData = confirmedTimelineData
      fillColor = '#9A0E31'
    } else if (activeSummaryId === 2) {
      dataKey = 'active'
      renderedData = activeTimelineData
      fillColor = '#0A4FA0'
    } else if (activeSummaryId === 3) {
      dataKey = 'recovered'
      renderedData = recoveredTimelineData
      fillColor = '#216837'
    } else {
      dataKey = 'deceased'
      renderedData = deceasedTimelineData
      fillColor = '#474C57'
    }

    return (
      <BarChart
        data={renderedData}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}
        width={900}
        height={300}
        className="bar-chart-container"
      >
        <XAxis
          dataKey="date"
          tick={{stroke: fillColor, strokeWidth: 1}}
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

  renderLineChartsView = () => {
    const {timelineGraphsData} = this.state

    return (
      <div className="line-charts-container">
        <h1 className="daily-spread-trends">Daily Spread Trends</h1>
        <ul testid="lineChartsContainer">
          {covidSummaryList.map(eachData => (
            <LineChartItem
              key={eachData.id}
              summaryDetails={eachData}
              timelineGraphsData={timelineGraphsData}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderSummaryDetailsView = () => {
    const {totalStatus, activeSummaryId} = this.state
    return (
      <div className="covid-summary-container">
        <ul className="summary-details-container">
          {covidSummaryList.slice(0, 4).map(eachDetail => (
            <SummaryCardItem
              key={eachDetail.id}
              summaryDetails={eachDetail}
              totalStatus={totalStatus}
              onChnageSummaryId={this.onChnageSummaryId}
              isActive={activeSummaryId === eachDetail.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {
      stateData,
      districtsData,
      testedCases,
      isTimelineLoading,
      isStateDataLoading,
      activeStateName,
      activeSummaryId,
    } = this.state

    const formatDate = inputDate => {
      const date = new Date(inputDate)

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      const day = date.getDate()
      const year = date.getFullYear()

      function getOrdinalSuffix(days) {
        if (days > 3 && days < 21) return 'th'
        switch (day % 10) {
          case 1:
            return 'st'
          case 2:
            return 'nd'
          case 3:
            return 'rd'
          default:
            return 'th'
        }
      }

      return `${months[date.getMonth()]} ${day}${getOrdinalSuffix(day)} ${year}`
    }

    return (
      <div className="specific-state-container">
        <div className="state-and-testedcases-container">
          <div className="state-container">
            <h1 className="state-name">{activeStateName}</h1>
          </div>
          <div className="state-summary-container">
            <p className="state-tested">Tested</p>
            <p className="state-tests-count">{testedCases}</p>
          </div>
        </div>

        {isStateDataLoading ? (
          this.renderStateDetailsLoader()
        ) : (
          <>
            {stateData?.meta?.last_updated && (
              <p className="last-updated-date">
                {`Last update on ${formatDate(stateData?.meta?.last_updated)}`}
              </p>
            )}
            {this.renderSummaryDetailsView()}
            <h1 className="top-districts">Top Districts</h1>
            <ul
              className="district-summary-container"
              testid="topDistrictsUnorderedList"
            >
              {districtsData.map(eachDistrict => (
                <DistrictAndCases
                  activeSummaryId={activeSummaryId}
                  key={eachDistrict[0]}
                  districtDetails={eachDistrict}
                />
              ))}
            </ul>
            {this.onGetSpecificSummaryGraph()}
          </>
        )}

        {isTimelineLoading
          ? this.renderTimelinesDataLoader()
          : this.renderLineChartsView()}

        <Footer />
      </div>
    )
  }
}

export default StateSpecificPage
