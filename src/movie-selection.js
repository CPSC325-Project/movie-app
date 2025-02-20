import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import backgroundImage from './app.jpg';
import MovieRating from './MovieRating';

function CreateAccount() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="App">
      <header className="App-header">
        {/* Left Section - Full Height Image */}
        <div className="left-section">
          <img src={backgroundImage} alt="Background" className="full-height-image" />
        </div>

        {/* Right Section - Purple Background with Form */}
        <div className="right-section">
          <p className="App-title">Rank Movies</p>
          <form className="question-form">
            <MovieRating title="Mad Max: Fury Road (2015)" />
            <MovieRating title="Superbad (2007)" />
            <MovieRating title="Hereditary (2018)" />
            <MovieRating title="Blade Runner 2049 (2017)" />
            <MovieRating title="The Pursuit of Happyness (2006)" />

            <button type="submit">Next</button>
            {/* Back button navigates to Welcome.js */}
            <button type="button" onClick={() => navigate('/create-account')}>Back</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default CreateAccount;
