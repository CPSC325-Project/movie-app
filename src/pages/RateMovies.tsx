import { Film, Star, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import noImage from '../components/noImage.jpeg';

interface Movie {
  id: string;
  title: string;
  image: string;
  year: number;
  genres: string;
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900">
      <div className="w-16 h-16 border-4 border-white border-t-yellow-500 rounded-full animate-spin mb-4"></div>
    </div>
  );
}

export function RateMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      //const response = await fetch('http://54.177.14.82:8000/movies/sample');
      //const response = await fetch('/api/movies/sample');
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/movies/sample`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatGenres = (genreString: string) => {
    return genreString.split('|').join(', ');
  };

  const handleRate = (movieId: string, rating: number) => {
    const newRatings = { ...ratings, [movieId]: rating };
    setRatings(newRatings);
    
    // Check if we've rated 5 movies
    if (Object.keys(newRatings).length === 5) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  const handleHaventWatched = async (movieId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://54.177.14.82:8000/movies/sample');
      if (!response.ok) {
        throw new Error('Failed to fetch new movie');
      }
      const [newMovie] = await response.json();
      setMovies(prev => prev.map(movie =>
        movie.id === movieId ? newMovie : movie
      ));
      // Clear rating for the new movie
      const { [movieId]: _, ...restRatings } = ratings;
      setRatings(restRatings);
      setError(null);
    } catch (error) {
      console.error('Error fetching new movie:', error);
      setError('Failed to fetch new movie. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 flex flex-col items-center p-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <Film size={32} className="text-yellow-500" />
        <h1 className="text-3xl font-bold ml-2 text-white">FlickPredict</h1>
      </div>

      {/* Movies Grid */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              {/* Movie Poster */}
              <div className="relative pt-[150%]"> {/* 2:3 aspect ratio */}
                <img
                  src={!movie.image || movie.image === 'https://images.unsplash.com/photo-1500004973?auto=format&fit=crop&q=80&w=2000' ? noImage : movie.image}
                  alt={movie.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = noImage;
                  }}
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div>
                  <h3 className="font-bold text-lg mb-2 break-words" title={movie.title}>
                    {movie.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{movie.year}</p>
                  <p className="text-sm text-gray-600 break-words flex-grow">
                    <span className="inline-block">{formatGenres(movie.genres)}</span> • <span>{movie.year}</span>
                  </p>
                </div>

                <div className="mt-auto">
                  {/* Star Rating */}
                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(movie.id, star)}
                        onMouseEnter={() => setHoverRating((prev) => ({ ...prev, [movie.id]: star }))}
                        onMouseLeave={() => setHoverRating((prev) => ({ ...prev, [movie.id]: 0 }))}
                        className="p-1"
                      >
                        <Star
                          size={20}
                          className={`${
                            (hoverRating[movie.id] && star <= hoverRating[movie.id]) || 
                            (ratings[movie.id] && star <= ratings[movie.id])
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Haven't Watched Button */}
                  <button
                    onClick={() => handleHaventWatched(movie.id)}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm border-2 border-purple-600 text-purple-600 rounded-lg hover:text-white hover:bg-purple-600 transition-colors"
                  >
                    <XCircle size={16} className="mr-2" />
                    Haven't Watched
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 text-center text-purple-900/70 text-sm mt-8 flex-shrink-0 fixed bottom-0 left-0 w-full z-50">
        © 2025 FlickPredict. All rights reserved.
      </div>
    </div>
  );
}