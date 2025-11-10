import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {FaBars} from 'react-icons/fa'
import DisplayHeader from '../DisplayHeader'
import './index.css'

class Header extends Component {
  state = {
    showMobileMenu: false,
  }

  onToggleHeader = () => {
    this.setState(prevState => ({showMobileMenu: !prevState.showMobileMenu}))
  }

  onCloseHeader = () => {
    this.setState({showMobileMenu: false})
  }

  render() {
    const {location} = this.props
    const {showMobileMenu} = this.state

    return (
      <>
        <nav className="app-navbar">
          <Link to="/" className="linked-item">
            <p className="app-logo">
              COVID19<span className="india-span-ele">INDIA</span>
            </p>
          </Link>
          <div>
            <ul className="main-nav-item-container desktop-nav">
              <Link
                to="/"
                className={`linked-item ${
                  location.pathname === '/' ? 'active-link' : ''
                }`}
              >
                <li className="header-nav-item">Home</li>
              </Link>
              <Link
                to="/vaccination"
                className={`linked-item ${
                  location.pathname === '/vaccination' ? 'active-link' : ''
                }`}
              >
                <li className="header-nav-item">Vaccination</li>
              </Link>
              <Link
                to="/about"
                className={`linked-item ${
                  location.pathname === '/about' ? 'active-link' : ''
                }`}
              >
                <li className="header-nav-item">About</li>
              </Link>
            </ul>
          </div>
          <FaBars className="hamburger-icon" onClick={this.onToggleHeader} />
        </nav>
        {showMobileMenu && <DisplayHeader onCloseHeader={this.onCloseHeader} />}
      </>
    )
  }
}

export default withRouter(Header)
