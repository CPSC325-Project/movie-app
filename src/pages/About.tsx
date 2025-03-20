// src/pages/About.tsx
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Film } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
        {/* Header with FlickPredict logo */}
        <div className="flex items-center justify-center mb-8">
            <Film size={32} className="text-yellow-500" />
            <h1 className="text-4xl font-bold ml-2 text-purple-900">FlickPredict</h1>
        </div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">About</h1>
        </div>
        
        <p className="text-lg text-gray-700 mb-6">
          FlickPredict is a movie recommendation platform, created by&nbsp; 
          <a 
            href="https://www.linkedin.com/in/alicia-domingo-715394298/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-purple-700 font-semibold hover:underline"
          >
            Alicia Domingo
          </a>,&nbsp;  
          <a 
            href="https://www.linkedin.com/in/lauren-nguyen-352263254/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-purple-700 font-semibold hover:underline"
          >
            Lauren Nguyen
          </a>, and&nbsp;
          <a 
            href="https://www.linkedin.com/in/jphan10/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-purple-700 font-semibold hover:underline"
          >
            Jaden Phan
          </a>,  
          that uses advanced algorithms to predict your next favorite movie based on your preferences.  
          With an intuitive interface and a variety of genres, FlickPredict helps you find movies you'll love in no time.
        </p>

        <p className="text-lg text-gray-700 mb-6">
          Join our community of movie lovers and get personalized suggestions that fit your tastes!
        </p>

        <div className="text-center">
          <Link to="/">
            <Button variant="primary">
              Go Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 text-center text-purple-900/70 text-sm z-10 border-t-4 border-purple-900">
        © 2025 FlickPredict. All rights reserved.
      </div>
    </div>
  );
}
