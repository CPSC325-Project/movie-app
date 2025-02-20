import React, { useState } from 'react';
import './App.css';
import backgroundImage from './app.jpg'; // Replace with your actual image path
import MovieRating from './MovieRating';

function App() {
  const [rating, setRating] = useState(3);

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
          <form className="question-form">
            <label>
              First Name:
              <input type="text" name="first_name" />
            </label>
            <label>
              Last Name:
              <input type="text" name="last_name" />
            </label>
            <MovieRating title="Mad Max: Fury Road (2015)" />
            <MovieRating title="Superbad (2007)" />
            <MovieRating title="Hereditary (2018)" />
            <MovieRating title="Blade Runner 2049 (2017)" />
            <MovieRating title="The Pursuit of Happyness (2006)" />


            <button type="submit">Submit</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
