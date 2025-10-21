import './index.css'

const CovidDataDetails = props => {
  const {covidDetails, statesList} = props
  const {stateCode, total, meta} = covidDetails
  const {confirmed, deceased, recovered} = total
  const activeCases = confirmed - (recovered + deceased)

  const state = statesList.find(eahState => stateCode === eahState.state_code)
  const stateName = state ? state.state_name : stateCode

  if (!state) {
    return null
  }

  return (
    <li className="table-item">
      <p className="table-data states">{stateName}</p>
      <p className="table-data confirmed">{confirmed}</p>
      <p className="table-data active">{activeCases}</p>
      <p className="table-data recovered">{recovered}</p>
      <p className="table-data deceased">{deceased}</p>
      <p className="table-data population">{meta.population}</p>
    </li>
  )
}

export default CovidDataDetails
