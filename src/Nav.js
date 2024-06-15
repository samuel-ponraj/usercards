import { Link } from 'react-router-dom'
import './Nav.css'

const Nav = ({ username , handleLogout }) => {


  return (

    <nav>
      <div className="welcome">
          <p>Welcome {username.toUpperCase()}!</p>
      </div>
      <div className="options">
          <p><Link className='view-btn' to="/Posts">View Posts</Link></p>
          <p className='logout-btn' onClick={handleLogout}>Logout</p>
      </div>
    </nav>
  )
}

export default Nav