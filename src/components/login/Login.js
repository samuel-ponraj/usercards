import React, { useEffect } from 'react'
import './Login.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({formData, handleLogin, handleOnChange, errors, setUsers}) => {

  

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        setUsers(response.data);
      })
  }, []);


  return (
    <div className='login-container'>
        <div className='login'>
        <h1>LOGIN</h1>
        <form className='login-form' onSubmit={handleLogin}>
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
              {errors.email && <p className="error">{errors.email}</p>}
              {errors.password && <p className="error">{errors.password}</p>}
            <button type='submit'>Login</button>
            <p>Not Registered? <Link to="/register">Create an account</Link></p>
        </form>
        </div>
    </div>
  )
}

export default Login