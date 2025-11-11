import {BiChevronRightSquare} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import './index.css'

const SearchSuggestions = props => {
  const {suggestionDetails} = props
  const {stateCode, stateName} = suggestionDetails
  return (
    <Link to={`/state/${stateCode}`} className="linked-item">
      <li className="suggestion-item">
        <p className="state-name">{stateName}</p>
        <button className="navigate-btn" type="button">
          <p className="state-code">{stateCode}</p>
          <BiChevronRightSquare className="navigate-icon" />
        </button>
      </li>
    </Link>
  )
}

export default SearchSuggestions
