import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import backgroundImage from './app.jpg';

function CreateAccount() {
  const navigate = useNavigate(); // Hook for navigation

  // State to store form values
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  // State to store error message
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match!');
      return;
    }

    // Proceed if passwords match
    setError(''); // Clear error message
    navigate('/movie-selection'); // Navigate to MovieSelection.js
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Left Section - Full Height Image */}
        <div className="left-section">
          <img src={backgroundImage} alt="Background" className="full-height-image" />
        </div>

        {/* Right Section - Purple Background with Form */}
        <div className="right-section">
          <p className="App-title">Create an Account</p>
          <form className="question-form" onSubmit={handleSubmit}>
            <label>
              First Name:
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </label>

            <label>
              Last Name:
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </label>

            <label>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>

            <label>
              Password:
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
            </label>

            <label>
              Confirm Password:
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
            </label>

            {/* Display error message if passwords don't match */}
            {error && <p className="error-message">{error}</p>}

            <button type="submit">Next</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default CreateAccount;
