import {Component} from 'react'
import Loader from 'react-loader-spinner'

import SummaryCardItem from '../SummaryCardItem'
import DistrictAndCases from '../DistrictAndCases'
import Footer from '../Footer'
import TimeLineData from '../TimeLineData'
import {covidSummaryList, statesList} from '../staticLists'
import './index.css'

class StateSpecificPage extends Component {
  state = {
    stateData: {},
    districtsData: [],
    totalStatus: {},
    activeSummaryId: covidSummaryList[0].id,
    isStateDataLoading: true,
    activeStateName: null,
    lastTenDaysData: {},
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

    const response = await fetch(apiUrl)

    const covidData = await response.json()
    const state = Object.entries(covidData).find(
      entry => entry[0] === stateCode,
    )

    const updatedStateData = this.formatedData(state)

    const districtsData = Object.entries(state[1].districts)

    const testedCases = updatedStateData?.total?.tested || 0

    const activeStateName = statesList.find(
      eachState => eachState.state_code === stateCode,
    ).state_name

    const totalData = state[1]?.total || {}
    const {confirmed, recovered, deceased} = totalData
    const active = confirmed - (recovered + deceased)

    this.setState({
      stateCode,
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
      isStateDataLoading: false,
    })
  }

  getSortedDistricts = () => {
    const {districtsData, activeSummaryId} = this.state

    const sortedDistricts = [...districtsData].sort((a, b) => {
      const key =
        activeSummaryId === 1
          ? 'confirmed'
          : activeSummaryId === 2
          ? 'active'
          : activeSummaryId === 3
          ? 'recovered'
          : 'deceased'

      const totalA = a[1]?.total || {}
      const totalB = b[1]?.total || {}

      let valueA = 0
      let valueB = 0

      if (key === 'active') {
        valueA =
          (totalA.confirmed || 0) -
          ((totalA.recovered || 0) + (totalA.deceased || 0))
        valueB =
          (totalB.confirmed || 0) -
          ((totalB.recovered || 0) + (totalB.deceased || 0))
      } else {
        valueA = totalA[key] || 0
        valueB = totalB[key] || 0
      }

      return valueB - valueA
    })

    return sortedDistricts
  }

  onChnageSummaryId = id => this.setState({activeSummaryId: id})

  renderStateDetailsLoader = () => (
    <div testid="stateDetailsLoader" className="loader-container">
      <Loader type="Oval" color="#007BFF" height={50} />
    </div>
  )

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

  renderSuccessView = () => {
    const {
      stateData,
      testedCases,
      isStateDataLoading,
      activeStateName,
      stateCode,
      activeSummaryId,
    } = this.state

    const sortedDistricts = this.getSortedDistricts()

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
        {isStateDataLoading ? (
          this.renderStateDetailsLoader()
        ) : (
          <>
            <div className="state-and-testedcases-container">
              <div className="state-container">
                <h1 className="state-name">{activeStateName}</h1>
              </div>
              <div className="state-summary-container">
                <p className="state-tested">Tested</p>
                <p className="state-tests-count">{testedCases}</p>
              </div>
            </div>
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
              {sortedDistricts.map(eachDistrict => (
                <DistrictAndCases
                  activeSummaryId={activeSummaryId}
                  key={eachDistrict[0]}
                  districtDetails={eachDistrict}
                />
              ))}
            </ul>
            {stateCode && (
              <TimeLineData
                stateCode={stateCode}
                activeSummaryId={activeSummaryId}
              />
            )}
          </>
        )}

        <Footer />
      </div>
    )
  }

  render() {
    return <div>{this.renderSuccessView()}</div>
  }
}

export default StateSpecificPage
