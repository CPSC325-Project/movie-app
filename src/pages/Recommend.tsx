import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { FilterSidebar } from '../components/FilterSidebar';
import { CircularProgress } from '../components/CircularProgress';

type Movie = {
  id: string;
  title: string;
  year: number;
  image: string;
  genres: string;
  directors?: string[]; // Assuming directors might be included in the future
  rating?: number; // Assuming rating might be added in the future
};

export function Recommend() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    genres: [],
    directors: [],
  });

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
  };

  // Filtering logic for the movies based on active filters
  const filteredMovies = movies.filter(movie => {
    if (Object.values(activeFilters).every(filterArray => filterArray.length === 0)) {
      return true;
    }
    return Object.entries(activeFilters).every(([category, selectedOptions]) => {
      if (selectedOptions.length === 0) return true;
      switch (category) {
        case 'genres':
          return selectedOptions.some(genre => movie.genres.includes(genre));
        case 'directors':
          return selectedOptions.some(director => movie.directors?.includes(director) ?? false);
        default:
          return true;
      }
    });
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        //const response = await fetch('/api/movies/sample'); // use for when committing
        const response = await fetch('http://54.177.14.82:8000/movies/sample'); // use when testing locally
        if (!response.ok) throw new Error('Failed to fetch movies');
        
        const data: Movie[] = await response.json();
        setMovies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900/90 to-purple-700/90 relative text-white">
      {/* Sidebar with White Background and Readable Text */}
      <FilterSidebar 
        onFilterChange={handleFilterChange} 
        isOpen={true} // Keep sidebar open for desktop
        onToggle={() => {}} // No need for toggle function on desktop
      />
  
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ml-72"> {/* Always show sidebar in desktop layout */}
        <div className="flex flex-col items-center p-4">
          {/* FlickPredict Logo in Upper Left */}
          <Link to="/" className="absolute top-4 left-16 flex items-center cursor-pointer">
            <Film size={32} className="text-yellow-500" />
            <h1 className="text-3xl font-bold ml-2 text-white">
              FlickPredict
            </h1>
          </Link>
  
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
  
          {/* Page Title */}
          <h2 className="text-2xl font-bold text-white mt-20 mb-6">
            FlickPredict recommended these movies for Alicia
          </h2>
  
          {/* Active Filters Display */}
          {Object.entries(activeFilters).some(([_, values]) => values.length > 0) && (
            <div className="w-full max-w-6xl mb-6 p-4 bg-purple-800/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([category, values]) => 
                  values.map(value => (
                    <span key={`${category}-${value}`} className="bg-yellow-500 text-purple-900 px-3 py-1 rounded-full text-sm font-medium">
                      {value}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
  
          {/* No Results Message */}
          {filteredMovies.length === 0 && (
            <div className="w-full max-w-6xl p-8 bg-purple-800/50 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">No movies match your filters</h3>
              <p>Try adjusting your filter criteria to see more results.</p>
            </div>
          )}
  
          {/* Movie Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl">
            {filteredMovies.map((movie, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-full h-68 object-cover transition-transform duration-300 hover:scale-105"
                />
  
                {/* Movie Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{movie.title}</h3>
                  <p className="text-gray-600">Released: {movie.year}</p>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genres.split('|').map((genre, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2">
                      <span className="text-yellow-500">
                        {"★".repeat(movie.rating ?? 0)}{"☆".repeat(5 - (movie.rating ?? 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  
      {/* Footer */}
      <div className="bg-white p-4 text-center text-purple-900/70 text-sm z-10 border-t-4 border-purple-900 mt-8 flex-shrink-0">
        © 2025 FlickPredict. All rights reserved.
      </div>
    </div>
  );
}  
