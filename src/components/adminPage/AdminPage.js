import React, { useEffect, useState } from 'react'
import './AdminPage.css'
import id_card from '../../assets/id_card.png'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';


const AdminPage = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        setUsers(response.data);
      })
  }, []);

  const handleDelete = (id) => {
    const userToDelete = users.find(user => user.id === id);
    axios.delete(`http://localhost:3001/users/${id}`)
      .then(response => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        alert(error);
      });
      alert(`User ${userToDelete.name} has been deleted successfully`)
  };

  return (
    <>
    <div className="admin-container">
        <div className="title">User Profiles</div>
        <div className="cards">
          {users.map(user => (
            <div className="card" key={user.id}>
              {user.id !== 'fa95' ? (
                <DeleteIcon onClick={() => handleDelete(user.id)} className='delete-btn' sx={{color: 'white'}}/>
              ): <></>}
              
              <img src={id_card} alt='ID Card' />
              <h3>ID: {user.id}</h3>
              <h2>{user.name.toUpperCase()}</h2> {/* Corrected syntax */}
              <h3>{user.email}</h3>
            </div>
          ))}
        </div>

        
    </div>
    </>
  )
}

export default AdminPage