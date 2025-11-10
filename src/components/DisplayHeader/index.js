import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {IoMdClose} from 'react-icons/io'
import './index.css'

class DisplayHeader extends Component {
  render() {
    const {onCloseHeader, location} = this.props

    return (
      <ul className="nav-item-container">
        <div className="mobile-nav-items-container">
          <Link
            to="/"
            className={`linked-item ${
              location.pathname === '/' ? 'active-link' : ''
            }`}
            onClick={onCloseHeader}
          >
            <li className="mobile-nav-item">Home</li>
          </Link>
          <Link
            to="/vaccination"
            onClick={onCloseHeader}
            className={`linked-item ${
              location.pathname === '/vaccination' ? 'active-link' : ''
            }`}
          >
            <li className="mobile-nav-item">Vaccination</li>
          </Link>
          <Link
            to="/about"
            className={`linked-item ${
              location.pathname === '/about' ? 'active-link' : ''
            }`}
            onClick={onCloseHeader}
          >
            <li className="mobile-nav-item">About</li>
          </Link>
        </div>

        <IoMdClose className="closed-button" onClick={onCloseHeader} />
      </ul>
    )
  }
}

export default withRouter(DisplayHeader)
