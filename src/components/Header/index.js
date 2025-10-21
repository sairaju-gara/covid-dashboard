import {Link, useLocation} from 'react-router-dom'
import './index.css'

const Header = () => {
  const location = useLocation()
  return (
    <nav className="app-navbar">
      <Link to="/">
        <p className="app-logo">
          COVID19<span className="india-span-ele">INDIA</span>
        </p>
      </Link>
      <ul className="nav-item-container">
        <Link
          to="/"
          className={`linked-item ${
            location.pathname === '/' ? 'active-link' : ''
          }`}
        >
          <li className="nav-item">Home</li>
        </Link>
        <Link
          to="/about"
          className={`linked-item ${
            location.pathname === '/about' ? 'active-link' : ''
          }`}
        >
          <li className="nav-item">about</li>
        </Link>
      </ul>
    </nav>
  )
}
export default Header
