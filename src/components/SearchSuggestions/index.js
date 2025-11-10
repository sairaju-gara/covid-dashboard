import {BiChevronRightSquare} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import './index.css'

const SearchSuggestions = props => {
  const {suggestionDetails} = props
  const {state_code, state_name} = suggestionDetails
  return (
    <Link to={`/state/${state_code}`} className="linked-item">
      <li className="suggestion-item">
        <p className="state-name">{state_name}</p>
        <button className="navigate-btn" type="button">
          <p className="state-code">{state_code}</p>
          <BiChevronRightSquare className="navigate-icon" />
        </button>
      </li>
    </Link>
  )
}

export default SearchSuggestions
