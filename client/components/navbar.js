import React from 'react'
import {Link} from 'react-router-dom'

const logo = `../images/logo.png`

const Navbar = () => (
  <div id="nav-container">
    <nav>
      <div id="logo-div">
        <span title="Logo">
          <Link to="/">
            <img className="logo-img" src={logo} />
          </Link>
        </span>
      </div>
      <div id="our-story">
        <Link to="/ourstory">Our Story</Link>
      </div>
    </nav>
  </div>
)

export default Navbar
