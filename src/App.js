import { Routes , Route, useNavigate, Navigate} from 'react-router-dom';
import './App.css';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Admin from './components/adminPage/AdminPage';
import Posts from './components/posts/Posts';
import Nav from './components/navbar/Nav';
import {  useEffect, useState } from 'react';
import ProtectedRoute from './ProtectedRoute';

function App() {

  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({})
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
 
  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    const existingUser = users.find(user => user.email === formData.email && user.password === formData.password);

    if (!existingUser) {
      newErrors.email = 'Email ID or password is incorrect. Please try again or register.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setUsername(existingUser.name)
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', existingUser.name);
    }
    
    if(existingUser.email === 'admin@gmail.com'){
      navigate('/admin');
    }
    else{
      navigate('/posts')
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/cards')
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    window.location.reload();
  };


  return (
    <div className="App">
      {isLoggedIn && <Nav username={username} handleLogout={handleLogout} />}
      <Routes>
          <Route path="/cards" 
                element={<Login 
                          handleLogin={handleLogin}
                          formData={formData}
                          handleOnChange={handleOnChange}
                          errors={errors}
                          users={users}
                          setUsers={setUsers}
                          />}/>
          <Route path="/register" element={<Register />} />
          <Route path='/admin' 
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Admin setIsLoggedIn={setIsLoggedIn} />
                  </ProtectedRoute>
                } />
          <Route path='/posts' 
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Posts username={username} />
                  </ProtectedRoute>
                } />
          <Route path="*" element={<Navigate to="/cards" />} />
        </Routes>
    </div>
  );
}

export default App;
