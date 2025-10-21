import './index.css'

const DistrictAndCases = props => {
  const {districtDetails, activeSummaryId} = props
  const districtName = districtDetails[0]
  const totalsCount = districtDetails[1]?.total

  let casesCount
  if (activeSummaryId === 1) {
    casesCount = totalsCount?.confirmed || 0
  } else if (activeSummaryId === 2) {
    const confirmed = totalsCount?.confirmed || 0
    const recovered = totalsCount?.recovered || 0
    const deceased = totalsCount?.deceased || 0
    casesCount = confirmed - (recovered + deceased) || 0
  } else if (activeSummaryId === 3) {
    casesCount = totalsCount?.recovered || 0
  } else {
    casesCount = totalsCount?.deceased || 0
  }

  return (
    <li className="district-summary-item">
      <p className="cases-count">{casesCount}</p>
      <p className="district-name">{districtName}</p>
    </li>
  )
}

export default DistrictAndCases
