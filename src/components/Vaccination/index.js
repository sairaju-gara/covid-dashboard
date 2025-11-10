import {Component} from 'react'
import {FaHome} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Footer from '../Footer'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import './index.css'

const tabsList = [
  {
    id: 1,
    displayText: 'By Doses',
  },
  {
    id: 2,
    displayText: 'By Age',
  },
]

class Vaccination extends Component {
  state = {
    statesData: [],
    districtData: [],
    selectedStateId: '',
    selectedDistrictId: '',
    vaccinationDetails: null,
    isLoading: false,
    activeTabId: tabsList[0].id,
  }

  componentDidMount() {
    this.getStatesData()
  }

  stateFormatedData = data => ({
    stateId: data.state_id,
    stateName: data.state_name,
  })

  districtFormatedData = data => ({
    districtId: data.district_id,
    districtName: data.district_name,
  })

  getStatesData = async () => {
    const statesapiUrl = 'https://apis.ccbp.in/covid19-state-ids'
    const response = await fetch(statesapiUrl)
    const data = await response.json()
    const formattedStates = data.states.map(this.stateFormatedData)
    this.setState({statesData: formattedStates})
  }

  getDistrictData = async stateId => {
    if (!stateId) return
    const districtapiUrl = `https://apis.ccbp.in/covid19-districts-data/${stateId}`
    const response = await fetch(districtapiUrl)
    const data = await response.json()
    const formattedDistricts = data.districts.map(this.districtFormatedData)
    this.setState({districtData: formattedDistricts})
  }

  getVaccinationDetails = async () => {
    const {selectedStateId, selectedDistrictId} = this.state
    if (!selectedStateId || !selectedDistrictId) return
    this.setState({isLoading: true})
    const vaccinationApiUrl = `https://apis.ccbp.in/covid19-vaccination-data?state_id=${selectedStateId}&district_id=${selectedDistrictId}`
    try {
      const response = await fetch(vaccinationApiUrl)
      const data = await response.json()
      this.setState({vaccinationDetails: data, isLoading: false})
    } catch (error) {
      console.error(error)
      this.setState({isLoading: false})
    }
  }

  handleStateChange = event => {
    const selectedStateId = event.target.value
    this.setState(
      {
        selectedStateId,
        districtData: [],
        selectedDistrictId: '',
        vaccinationDetails: null,
        isLoading: '',
      },
      () => {
        this.getDistrictData(selectedStateId)
      },
    )
  }

  handleDistrictChange = event => {
    const selectedDistrictId = event.target.value
    this.setState(
      {selectedDistrictId, vaccinationDetails: null, isLoading: true},
      () => {
        this.getVaccinationDetails()
      },
    )
  }

  renderLoaderView = () => (
    <div testid="vaccinationRouteLoader" className="loader-container">
      <Loader type="Oval" color="#007BFF" height={50} />
    </div>
  )

  renderDropDownView = () => {
    const {districtData, selectedDistrictId, statesData, selectedStateId} =
      this.state

    return (
      <div className="drop-downs-container">
        <select
          className="drop-down-list"
          value={selectedStateId}
          onChange={this.handleStateChange}
        >
          <option value="" disabled>
            Select State
          </option>
          {statesData.map(state => (
            <option value={state.stateId} key={state.stateId}>
              {state.stateName}
            </option>
          ))}
        </select>
        <select
          className="drop-down-list"
          value={selectedDistrictId}
          onChange={this.handleDistrictChange}
        >
          <option value="" disabled>
            Select District
          </option>
          {districtData.map(district => (
            <option value={district.districtId} key={district.districtId}>
              {district.districtName}
            </option>
          ))}
        </select>
      </div>
    )
  }

  renderVaccinationSummaryCardsView = () => {
    const {vaccinationDetails} = this.state
    const sessionSiteData = vaccinationDetails?.sessionSiteData || {}
    const topBlock = vaccinationDetails?.topBlock || {}

    return (
      <div className="vaccination-cards-container">
        <div className="vaccine-card">
          <img
            src="https://res.cloudinary.com/dmsmw5iq9/image/upload/v1761822027/Group_7476_izdynu.png"
            alt="icon"
            className="vaccine-card-icon"
          />
          <div>
            <div>
              <h1 className="vaccine-card-title">
                Site Conducting Vaccination
              </h1>
              <p className="vaccine-card-total">
                {sessionSiteData?.total_sites || 0}
              </p>
            </div>
            <div className="vaccine-card-details">
              <div className="vaccine-card-detail">
                <p className="vaccine-card-detail-label">Government</p>
                <p className="vaccine-card-detail-value">
                  {sessionSiteData?.govt_sites || 0}
                </p>
              </div>
              <div className="vaccine-card-detail">
                <p className="vaccine-card-detail-label">Private</p>
                <p className="vaccine-card-detail-value">
                  {sessionSiteData?.pvt_sites || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="vaccine-card">
          <img
            src="https://res.cloudinary.com/dmsmw5iq9/image/upload/v1761822058/Group_7475_c1kbu1.png"
            alt="icon"
            className="vaccine-card-icon"
          />
          <div>
            <div>
              <h1 className="vaccine-card-title">Total Vaccination Doses </h1>
              <p className="vaccine-card-total">
                {topBlock?.vaccination?.total_doses || 0}
              </p>
            </div>
            <div className="vaccine-card-details">
              <div className="vaccine-card-detail">
                <p className="vaccine-card-detail-label">Dose 1</p>
                <p className="vaccine-card-detail-value">
                  {topBlock?.vaccination?.tot_dose_1 || 0}
                </p>
              </div>
              <div className="vaccine-card-detail">
                <p className="vaccine-card-detail-label">Dose 2</p>
                <p className="vaccine-card-detail-value">
                  {topBlock?.vaccination?.tot_dose_2 || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onChangeTabItem = id => this.setState({activeTabId: id})

  renderVaccinationTrendsView = () => {
    const {vaccinationDetails, activeTabId} = this.state
    const vaccinationByAgeList = Object.entries(
      vaccinationDetails?.vaccinationByAge || {},
    )
      .filter(eachItem => eachItem[0] !== 'total')
      .map(eachItem => ({
        ageGroup: eachItem[0],
        vaccinated: eachItem[1],
      }))

    const TabItem = props => {
      const {tabDetails, isActive, onChangeTabItem} = props
      const {id, displayText} = tabDetails
      const activeTabItem = isActive ? 'active-tab-btn' : ''
      return (
        <button className="tab-item-btn" onClick={() => onChangeTabItem(id)}>
          <li className={`tab-item ${activeTabItem}`}>{displayText}</li>
        </button>
      )
    }

    const dataFormatter = number => {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M'
      } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k'
      } else {
        return number
      }
    }

    return (
      <div className="vaccination-trends-graph-container">
        <h1 className="vaccination-trends-header">Vaccination Trends</h1>
        <ul className="tabs-container">
          {tabsList.map(eachTab => (
            <TabItem
              key={eachTab.id}
              tabDetails={eachTab}
              isActive={activeTabId === eachTab.id}
              onChangeTabItem={this.onChangeTabItem}
            />
          ))}
        </ul>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={vaccinationByAgeList}>
            <XAxis dataKey="ageGroup" stroke="#6C757D" />
            <YAxis stroke="#6C757D" tickFormatter={dataFormatter} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="vaccinated"
              stroke="#82ca9d"
              fill="#82ca9d33"
              name="Vaccinated"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderVaccinationDetailsGraphsView = () => {
    const {vaccinationDetails} = this.state

    const vaccinationCategoryData = Object.entries(
      vaccinationDetails?.topBlock?.vaccination || {},
    )

    const vaccinationDataByGender = vaccinationCategoryData
      .filter(
        eachItem =>
          eachItem[0] === 'male' ||
          eachItem[0] === 'female' ||
          eachItem[0] === 'others',
      )
      .map(eachItem => ({gender: eachItem[0], count: eachItem[1]}))

    const vaccinationDataByVaccine = vaccinationCategoryData
      .filter(
        eachItem =>
          eachItem[0] === 'covishield' ||
          eachItem[0] === 'covaxin' ||
          eachItem[0] === 'sputnik',
      )
      .map(eachItem => ({vaccine: eachItem[0], count: eachItem[1]}))

    const vaccinationByAgeForAdults = Object.entries(
      vaccinationDetails?.vaccinationByAge || {},
    )
      .filter(
        eachItem =>
          eachItem[0] === 'vac_18_45' ||
          eachItem[0] === 'vac_45_60' ||
          eachItem[0] === 'above_60',
      )
      .map(eachItem => ({
        ageGroup: eachItem[0],
        vaccinated: eachItem[1],
      }))

    return (
      <div className="vaccination-details-graphs-container">
        <div className="vaccination-category-container">
          <h1 className="vaccination-category-header">Vaccination Category</h1>
          <div className="vaccination-category-graphs-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="85%"
                  data={vaccinationDataByGender}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="count"
                  minAngle={3}
                >
                  <Cell name="Male" fill="#86198F" />
                  <Cell name="Female" fill="#5A8DEE" />
                  <Cell name="Others" fill="#FF9800" />
                </Pie>

                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="85%"
                  data={vaccinationDataByVaccine}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="count"
                  minAngle={3}
                >
                  <Cell name="Covishield" fill="#007CC3" />
                  <Cell name="Covaxin" fill="#7AC142" />
                  <Cell name="Sputnik V" fill="#FF9800" />
                </Pie>
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="vaccination-age-container">
          <h1 className="vaccination-category-header">Vaccination by Age</h1>
          <ResponsiveContainer width="100%" height={420}>
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={vaccinationByAgeForAdults}
                startAngle={0}
                endAngle={360}
                outerRadius={120}
                dataKey="vaccinated"
              >
                <Cell name="18-44" fill="#A3DF9F" />
                <Cell name="45-60" fill="#64C2A6" />
                <Cell name="Above 60" fill="#2D87BB" />
              </Pie>

              <Legend
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  render() {
    const {statesData, selectedStateId, vaccinationDetails, isLoading} =
      this.state

    const activeStateName = statesData.find(
      eachState => eachState.stateId == selectedStateId,
    )

    return (
      <div className="vaccination-container">
        {activeStateName ? (
          <h1 className="state-header">
            <FaHome /> {`INDIA/${activeStateName.stateName}`}
          </h1>
        ) : (
          <h1 className="state-header">
            <FaHome /> INDIA
          </h1>
        )}

        {this.renderDropDownView()}
        {isLoading ? (
          this.renderLoaderView()
        ) : vaccinationDetails ? (
          <>
            {this.renderVaccinationSummaryCardsView()}
            {this.renderVaccinationTrendsView()}
            {this.renderVaccinationDetailsGraphsView()}
          </>
        ) : (
          <p className="no-data-message">
            Choose a state and district above to see the latest vaccination
            stats.
          </p>
        )}
        <Footer />
      </div>
    )
  }
}

export default Vaccination
