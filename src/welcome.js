import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import backgroundImage from './app.jpg'; // Replace with your actual image path
import CreateAccount from './create-account'; // Import Create Account page
import MovieSelection from './movie-selection';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Handle login logic here
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="left-section">
          <img src={backgroundImage} alt="Background" className="full-height-image" />
        </div>

        <div className="right-section">
          <p className="App-title">Login</p>
          <form className="question-form" onSubmit={handleSubmit}>
            <label>
              Email:
              <input type="email" name="email" value={email} onChange={handleEmailChange} />
            </label>
            <label>
              Password:
              <input type="password" name="password" value={password} onChange={handlePasswordChange} />
            </label>

            <button type="submit">Login</button>
            <button type="create-account" onClick={() => navigate('/create-account')}>
              Create An Account
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/movie-selection" element={<MovieSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
