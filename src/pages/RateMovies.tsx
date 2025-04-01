import { Film, Star, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import noImage from '../components/noImage.jpeg';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';

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
  const [ratings, setRatings] = useState<Record<string, { title: string; rating: number }>>({});
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingMovieIds, setLoadingMovieIds] = useState<Set<string>>(new Set());
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});

  useEffect(() => {
    localStorage.clear(); // Clear local storage when component mounts
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsInitialLoading(true);
      const response = await fetch('http://54.177.14.82:8000/movies/sample');
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
      setIsInitialLoading(false);
    }
  };

  const fetchNewMovie = async () => {
    try {
      const response = await fetch('http://54.177.14.82:8000/movies/sample');
      if (!response.ok) {
        throw new Error('Failed to fetch new movie');
      }
      const [newMovie] = await response.json();
      return newMovie;
    } catch (error) {
      console.error('Error fetching new movie:', error);
      throw error;
    }
  };

  const formatGenres = (genreString: string) => {
    return genreString.split('|').join(', ');
  };

  const handleRate = async (movieId: string, rating: number) => {
    try {
      const movie = movies.find(m => m.id === movieId);
      if (!movie) return;

      // Save the current movie rating to local storage
      localStorage.setItem('lastRatedMovie', JSON.stringify({
        movieId,
        title: movie.title,
        rating
      }));

      // Update ratings state immediately
      setRatings(prev => ({
        ...prev,
        [movieId]: { title: movie.title, rating }
      }));

      // Start loading new movie in background
      setLoadingMovieIds(prev => new Set(prev).add(movieId));

      // Fetch and replace the rated movie with a new one
      const newMovie = await fetchNewMovie();
      setMovies(prev => prev.map(m =>
        m.id === movieId ? newMovie : m
      ));
      
      // Remove loading state for this movie
      setLoadingMovieIds(prev => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
    } catch (error) {
      setError('Failed to fetch new movie after rating. Please try again.');
      // Remove loading state on error
      setLoadingMovieIds(prev => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
    }
  };

    const handleSubmit = async () => {
      // Log the final ratings object
      const finalRatings = {
        totalMoviesRated: Object.keys(ratings).length,
        ratings: Object.entries(ratings).map(([movieId, data]) => ({
          movieId,
          title: data.title,
          rating: data.rating
        }))
      };
      console.log('Final Ratings:', finalRatings);
      
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('User is not authenticated. Please log in again.');
        return;
      }
      const token = await currentUser.getIdToken();
    
      fetch("https://your-api.com/users/ratings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ratings: finalRatings.ratings  // Using the logged final ratings here
        })
      });
      navigate('/dashboard');
    };

  const handleHaventWatched = async (movieId: string) => {
    try {
      setLoadingMovieIds(prev => new Set(prev).add(movieId));
      const newMovie = await fetchNewMovie();
      setMovies(prev => prev.map(movie =>
        movie.id === movieId ? newMovie : movie
      ));
      
      const { [movieId]: _, ...restRatings } = ratings;
      setRatings(restRatings);
      
      // Remove the movie from local storage if it was the last rated
      const lastRated = JSON.parse(localStorage.getItem('lastRatedMovie') || '{}');
      if (lastRated.movieId === movieId) {
        localStorage.removeItem('lastRatedMovie');
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching new movie:', error);
      setError('Failed to fetch new movie. Please try again.');
    } finally {
      setLoadingMovieIds(prev => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
    }
  };

  if (isInitialLoading) return <LoadingSpinner />;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-purple-900 flex flex-col items-center p-4">
      <div className="flex items-center justify-center mb-4">
        <Film size={32} className="text-yellow-500" />
        <h1 className="text-3xl font-bold ml-2 text-white">FlickPredict</h1>
      </div>

      <div className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="relative pt-[150%]">
                <img
                  src={movie.image || noImage}
                  alt={movie.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = noImage; }}
                />
                {loadingMovieIds.has(movie.id) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-yellow-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2 break-words" title={movie.title}>{movie.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{movie.year}</p>
                <p className="text-sm text-gray-600 break-words flex-grow">{formatGenres(movie.genres)}</p>

                <div className="mt-auto">
                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(movie.id, star)}
                        onMouseEnter={() => setHoverRating((prev) => ({ ...prev, [movie.id]: star }))}
                        onMouseLeave={() => setHoverRating((prev) => ({ ...prev, [movie.id]: 0 }))}
                        className="p-1"
                        disabled={loadingMovieIds.has(movie.id)}
                      >
                        <Star
                          size={20}
                          className={`${
                            (hoverRating[movie.id] && star <= hoverRating[movie.id]) ||
                            (ratings[movie.id] && star <= ratings[movie.id]?.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleHaventWatched(movie.id)}
                    disabled={loadingMovieIds.has(movie.id)}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm border-2 border-purple-600 text-purple-600 rounded-lg hover:text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="fixed bottom-0 left-0 right-0 bg-purple-900 p-4 shadow-lg">
        <button 
          onClick={handleSubmit} 
          className="w-full max-w-md mx-auto block px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition-colors"
        >
          Submit Ratings
        </button>
      </div>
    </div>
  );
}

export default RateMovies;