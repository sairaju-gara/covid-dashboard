import './index.css'

const SummaryCardItem = props => {
  const {summaryDetails, totalStatus, onChnageSummaryId, isActive} = props
  const {id, labelName, labelImage} = summaryDetails

  let summaryItemClassname
  let testid
  let altText
  let summaryStatusCount
  let summaryCardBgClassname

  if (id === 1) {
    summaryItemClassname = 'confirmed-container'
    testid = 'stateSpecificConfirmedCasesContainer'
    altText = 'state specific confirmed cases pic'
    summaryStatusCount = totalStatus.confirmed
    summaryCardBgClassname = isActive ? 'confirmed-data' : ''
  }
  if (id === 2) {
    summaryItemClassname = 'active-container'
    testid = 'stateSpecificActiveCasesContainer'
    altText = 'state specific active cases pic'
    summaryStatusCount = totalStatus.active
    summaryCardBgClassname = isActive ? 'active-data' : ''
  }
  if (id === 3) {
    summaryItemClassname = 'recovered-container'
    testid = 'stateSpecificRecoveredCasesContainer'
    altText = 'state specific recovered cases pic'
    summaryStatusCount = totalStatus.recovered
    summaryCardBgClassname = isActive ? 'recovered-data' : ''
  }
  if (id === 4) {
    summaryItemClassname = 'deceased-container'
    testid = 'stateSpecificDeceasedCasesContainer'
    altText = 'state specific deceased cases pic'
    summaryStatusCount = totalStatus.deceased
    summaryCardBgClassname = isActive ? 'deceased-data' : ''
  }

  return (
    <li
      className={`covid-summary-item ${summaryItemClassname} ${summaryCardBgClassname}`}
      data-testid={`${testid}`}
      onClick={() => onChnageSummaryId(id)}
    >
      <p className="summary-label">{labelName}</p>
      <img className="summary-image" src={labelImage} alt={`${altText}`} />
      <p className="summary-count">{summaryStatusCount}</p>
    </li>
  )
}

export default SummaryCardItem
