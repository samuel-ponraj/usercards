import { Routes , Route, useNavigate} from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Posts from './Posts';
import Nav from './Nav';
import {  useEffect, useState } from 'react';

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
      console.log(existingUser.name)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', existingUser.name);
    }
    
    if(existingUser.email === 'admin@gmail.com'){
      navigate('/Home');
    }
    else{
      navigate('/Posts')
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
        <Route path="/Register"  element={<Register/>} />
        <Route path='/Home'  element={<Home 
                                      setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/Posts" element={<Posts/>} />
      </Routes>
    </div>
  );
}

export default App;
