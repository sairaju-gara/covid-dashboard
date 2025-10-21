import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="notfound-container">
    <img
      src="https://res.cloudinary.com/dmsmw5iq9/image/upload/v1760865949/Group_7484_ilgaxl.png"
      alt="not-found-pic"
      className="notfound-img"
    />
    <h1 className="notfound-header">PAGE NOT FOUND</h1>
    <p className="notfound-description">
      we are sorry, the page you requested could not be found
      <br />
      Please go back to the homepage
    </p>
    <Link to="/" className="linked-item">
      <button type="button" className="home-btn">
        Home
      </button>
    </Link>
  </div>
)

export default NotFound
