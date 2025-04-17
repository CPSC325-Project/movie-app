import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/90 to-purple-700/90 relative flex flex-col items-center justify-center text-white p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2940)',
          backgroundBlendMode: 'multiply'
        }}
      />

      {/* Navigation */}
      <nav className="absolute top-0 right-0 p-6 z-10 flex gap-4">
        <Link to="/about">
          <Button variant="outline" className="border-yellow-400 text-white hover:bg-white/20">
            About
          </Button>
        </Link>
        <Link to="/how-to-use">
          <Button variant="outline" className="border-yellow-400 text-white hover:bg-white/20">
            How to Use
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl text-center z-10">
        <div className="flex items-center justify-center mb-8">
          <Film size={48} className="text-yellow-400" />
          <h1 className="text-5xl font-bold ml-4">FlickPredict</h1>
        </div>
        
        {/* Vintage Film Illustration */}
        <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
          <div className="relative w-64 h-64 mx-auto">
            <img 
              // src="https://thumbs.dreamstime.com/b/vintage-film-camera-three-lenses-tripod-pencil-drawing-strokes-beige-background-vintage-film-camera-157690607.jpg" 
              src="/images/vintage_camera.jpg" // Local image for better performance
              alt="Vintage Film Illustration" 
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.3))'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
          </div>
        </div>
        
        <h2 className="text-2xl mb-6">Discover Your Next Favorite Movie</h2>
        <p className="text-lg mb-8 text-purple-100">
          Using advanced algorithms and your personal preferences, we predict movies
          that you'll love. Join our community and start your personalized movie journey today.
        </p>
        
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="primary" className='hover:bg-purple-800'>
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">
              Create Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 text-center text-purple-900/70 text-sm z-10">
        © 2025 FlickPredict. All rights reserved.
      </div>
    </div>
  );
}