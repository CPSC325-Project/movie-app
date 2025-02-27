// src/pages/HowToUse.tsx
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Film } from 'lucide-react';

export function HowToUse() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center mb-8">
            <Film size={32} className="text-yellow-500" />
            <h1 className="text-4xl font-bold ml-2 text-purple-900">FlickPredict</h1>
        </div>
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">How to Use:</h1>
        </div>
        
        <p className="text-lg text-gray-700 mb-6">
          FlickPredict is designed to help you discover new movies based on your preferences. Follow these simple steps to get started:
        </p>

        <ol className="list-decimal list-inside text-gray-700 space-y-4 mb-6">
          <li>
            <strong>Create an Account:</strong> Sign up using your email and set up your profile.
          </li>
          <li>
            <strong>Rate Movies:</strong> Start by rating at least five movies to help us understand your taste.
          </li>
          <li>
            <strong>Get Personalized Recommendations:</strong> Based on your ratings, FlickPredict will suggest movies you might love.
          </li>
          <li>
            <strong>Save Your Favorites:</strong> Bookmark movies you enjoy and build your personal watchlist.
          </li>
          <li>
            <strong>Explore & Enjoy:</strong> Discover new films, see trending movies, and refine your recommendations by rating more movies.
          </li>
        </ol>

        <div className="text-center">
          <Link to="/">
            <Button variant="primary">
              Go Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
