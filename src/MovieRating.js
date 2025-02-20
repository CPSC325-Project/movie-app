import React, { useState } from 'react';
import './App.css';

function MovieRating({ title }) {
  const [rating, setRating] = useState(3);

  return (
    <label>
      Rank {title}: <span className="rating-value">{rating}</span>
      <div className="slider-container">
        <div className="slider-label-group">
          <span className="slider-label">1</span>
          <span className="slider-description">Awful</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="slider"
        />
        <div className="slider-label-group">
          <span className="slider-label">5</span>
          <span className="slider-description">Amazing</span>
        </div>
      </div>
    </label>
  );
}

export default MovieRating;
