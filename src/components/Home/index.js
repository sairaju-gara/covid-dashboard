import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingDesc, FcGenericSortingAsc} from 'react-icons/fc'
import Loader from 'react-loader-spinner'

import SearchSuggestions from '../SearchSuggestions'
import CovidDataDetails from '../CovidDataDetails'
import Footer from '../Footer'
import './index.css'

import {statesList} from '../staticLists'

console.log(statesList.length)
class Home extends Component {
  state = {
    covidData: [],
    totalStatus: {},
    searchInput: '',
    isLoading: true,
  }

  componentDidMount() {
    this.getCoviddata()
  }

  formatedData = ([stateCode, stateData]) => ({
    stateCode,
    total: stateData?.total || {},
    meta: stateData?.meta || {},
  })

  getCoviddata = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(apiUrl)
    const covidData = await response.json()

    const updatedCovidData = Object.entries(covidData).map(entry =>
      this.formatedData(entry),
    )

    let totalConfirmed = 0
    let totalRecovered = 0
    let totalDeceased = 0

    Object.values(covidData).forEach(stateData => {
      totalConfirmed += stateData.total?.confirmed || 0
      totalRecovered += stateData.total?.recovered || 0
      totalDeceased += stateData.total?.deceased || 0
    })

    const totalActive = totalConfirmed - totalRecovered - totalDeceased

    this.setState({
      covidData: updatedCovidData,
      totalStatus: {
        confirmed: totalConfirmed,
        active: totalActive,
        recovered: totalRecovered,
        deceased: totalDeceased,
      },
      isLoading: false,
    })
  }

  renderSummaryDetailsView = () => {
    const {totalStatus} = this.state

    return (
      <div className="covid-summary-container">
        <div
          className="covid-summary-item confirmed-container"
          data-testid="countryWideConfirmedCases"
        >
          <p className="summary-label">Confirmed</p>
          <img
            className="summary-image"
            src="https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700307/check-mark_1_x8ozyn.png"
            alt="country wide confirmed cases pic"
          />
          <p className="summary-count">{totalStatus.confirmed}</p>
        </div>
        <div
          className="covid-summary-item active-container"
          data-testid="countryWideActiveCases"
        >
          <p className="summary-label">Active</p>
          <img
            className="summary-image"
            src="https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700351/Group_yzjl5m.png"
            alt="country wide active cases pic"
          />
          <p className="summary-count">{totalStatus.active}</p>
        </div>
        <div
          className="covid-summary-item recovered-container"
          data-testid="countryWideRecoveredCases"
        >
          <p className="summary-label">Recovered</p>
          <img
            className="summary-image"
            src="https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700395/Vector_1_zktyrv.png"
            alt="country wide recovered cases pic"
          />
          <p className="summary-count">{totalStatus.recovered}</p>
        </div>
        <div
          className="covid-summary-item deceased-container"
          data-testid="countryWideDeceasedCases"
        >
          <p className="summary-label">Deceased</p>
          <img
            className="summary-image"
            src="https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760700437/Corona_Virus_Symptoms_Shortness_of_breath_au62xw.png"
            alt="country wide deceased cases pic"
          />
          <p className="summary-count">{totalStatus.deceased}</p>
        </div>
      </div>
    )
  }

  onGetAscData = () => {
    const {covidData} = this.state

    const ascCovidData = [...covidData].sort((a, b) =>
      a.stateCode.localeCompare(b.stateCode),
    )
    this.setState({covidData: ascCovidData})
  }

  onGetDescData = () => {
    const {covidData} = this.state

    const descCovidData = [...covidData].sort((a, b) =>
      b.stateCode.localeCompare(a.stateCode),
    )
    this.setState({covidData: descCovidData})
  }

  renderCovidTableView = () => {
    const {covidData} = this.state

    return (
      <div
        className="covid-table-container"
        data-testid="stateWiseCovidDataTable"
      >
        <div className="covid-table-header-container">
          <p className="table-header states-header">
            States/UT
            <button
              type="button"
              className="sorting-btn"
              data-testid="ascendingSort"
              onClick={this.onGetAscData}
            >
              <FcGenericSortingAsc className="sorting-icon" />
            </button>
            <button
              type="button"
              className="sorting-btn"
              data-testid="descendingSort"
              onClick={this.onGetDescData}
            >
              <FcGenericSortingDesc className="sorting-icon" />
            </button>
          </p>
          <p className="table-header">Confirmed</p>
          <p className="table-header">Active</p>
          <p className="table-header">Recovered</p>
          <p className="table-header">Deceased</p>
          <p className="table-header">Population</p>
        </div>
        <hr className="seperator" />
        <ul className="covid-table-rows-container">
          {covidData.map(eachData => (
            <CovidDataDetails
              statesList={statesList}
              key={eachData.stateCode}
              covidDetails={eachData}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="homeRouteLoader" className="loader-container">
      <Loader type="Oval" color="#007BFF" height={50} />
    </div>
  )

  onChangeSearchInput = event =>
    this.setState({searchInput: event.target.value})

  render() {
    const {searchInput, isLoading} = this.state

    const searchResults = statesList.filter(eachState =>
      eachState.stateName.toLowerCase().includes(searchInput.toLowerCase()),
    )

    return (
      <div className="app-home-container">
        <div className="search-container">
          <BsSearch className="search-icon" />
          <input
            type="search"
            className="search-bar"
            placeholder="Enter the State"
            value={searchInput}
            onChange={this.onChangeSearchInput}
          />
        </div>
        {searchInput.length > 0 ? (
          <ul
            data-testid="searchResultsUnorderedList"
            className="search-suggestions-container"
          >
            {searchResults.map(eachSuggestion => (
              <SearchSuggestions
                suggestionDetails={eachSuggestion}
                key={eachSuggestion.state_code}
              />
            ))}
          </ul>
        ) : (
          <>
            {isLoading ? (
              this.renderLoaderView()
            ) : (
              <>
                {this.renderSummaryDetailsView()}
                {this.renderCovidTableView()}
              </>
            )}
          </>
        )}
        <Footer />
      </div>
    )
  }
}

export default Home
