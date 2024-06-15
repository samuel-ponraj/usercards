import React, { useEffect, useState } from 'react'
import './Home.css'
import id_card from './assets/id_card.png'
import axios from 'axios'


const Home = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      })
  }, []);

  return (
    <>
    <div className="home-container">
    
        <div className="cards">
        {users.map(user => (
            <div className="card" key={user.id}>
              <img src={id_card} alt='ID Card' />
              <h3>ID: {user.id}</h3>
              <h2>{user.name}</h2>
              <h3>{user.email}</h3>
            </div>
          ))}
        </div>

        
    </div>
    </>
  )
}

export default Home