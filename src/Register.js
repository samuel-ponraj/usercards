import React, { useEffect, useState } from 'react'
import './Register.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

  const [formData,setFormData] = useState(
    {
      name: "",
      email: "",
      password: ""
    }
  )
  const [errors, setErrors] = useState({})
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

   useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        // console.log('Fetched users:', response.data);
        setUsers(response.data);
      })
  }, []);


  const handleOnChange = (e) => {
    const {name, value} = e.target;
    setFormData(
      {
        ...formData,
        [name]: value
      }
    )
  }

  const handleRegister = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    const isValidEmail = /\S+@\S+\.\S+/.test(formData.email);
    const existingUser = users.find(user => user.name === formData.name)
    const existingEmail = users.find(user => user.email === formData.email)
  
    if (existingUser) {
      newErrors.name = 'Username already exists';
    }
    
    if (existingEmail) {
      newErrors.email = 'Email already exists';
    }

    if (!isValidEmail) {
      newErrors.email = 'Email is invalid';
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      axios.post("http://localhost:3001/users", formData)
        .then(res => {
          console.log(res);
          navigate('/cards');
        })
      }
  };


  return (
    <div className='reg-container'>
        <div className='reg'>
        <h1>REGISTER</h1>
        <form className='reg-form' onSubmit={handleRegister}>
            <input 
              type='text' 
              placeholder='Username'
              name='name'
              value={formData.name}
              onChange={handleOnChange}
              required/>
            <input 
              type='text' 
              placeholder='Email ID' 
              name='email'
              value={formData.email}
              onChange={handleOnChange}
              required/>
            <input 
              type='password' 
              placeholder='Password' 
              name='password'
              value={formData.password}
              onChange={handleOnChange}
              required/>
              {errors.name && <p className="error">{errors.name}</p>}
              {errors.email && <p className="error">{errors.email}</p>}
            <button type='submit'>Register</button>
        </form>
        </div>
    </div>
  )
}

export default Register