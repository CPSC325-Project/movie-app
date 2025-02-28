import { useState } from 'react';
import { Film, Menu } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { FilterSidebar } from '../components/FilterSidebar';

// Movie data with additional properties for filtering
const MOVIES_DATA = [
  { 
    title: "The Matrix", 
    year: 1999, 
    image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    genres: ["Action", "Sci-Fi"],
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    directors: ["Lana & Lilly Wachowski"],
    rating: 5,
    decade: "1990s"
  },
  { 
    title: "Inception", 
    year: 2010, 
    image: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    genres: ["Action", "Sci-Fi", "Thriller"],
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    directors: ["Christopher Nolan"],
    rating: 5,
    decade: "2010s"
  },
  { 
    title: "Interstellar", 
    year: 2014, 
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    directors: ["Christopher Nolan"],
    rating: 5,
    decade: "2010s"
  },
  { 
    title: "The Prestige", 
    year: 2006, 
    image: "https://m.media-amazon.com/images/I/619c+UQZaOL._AC_UF894,1000_QL80_.jpg",
    genres: ["Drama", "Mystery", "Thriller"],
    actors: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"],
    directors: ["Christopher Nolan"],
    rating: 4,
    decade: "2000s"
  },
  { 
    title: "Blade Runner 2049", 
    year: 2017, 
    image: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    genres: ["Action", "Drama", "Sci-Fi"],
    actors: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
    directors: ["Denis Villeneuve"],
    rating: 4,
    decade: "2010s"
  },
  { 
    title: "Ghost Rider", 
    year: 2007, 
    image: "https://upload.wikimedia.org/wikipedia/en/7/71/GhostRiderBigPoster.jpg",
    genres: ["Action", "Fantasy", "Thriller"],
    actors: ["Nicolas Cage", "Eva Mendes", "Sam Elliott"],
    directors: ["Mark Steven Johnson"],
    rating: 3,
    decade: "2000s"
  }
];

const formatJustWatchTitle = (title: string) => title.split(' ').join('-'); // Convert spaces to hyphens

export function Recommend() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
  };

  const filteredMovies = MOVIES_DATA.filter(movie => {
    if (Object.values(activeFilters).every(filterArray => filterArray.length === 0)) {
      return true;
    }
    return Object.entries(activeFilters).every(([category, selectedOptions]) => {
      if (selectedOptions.length === 0) return true;
      switch (category) {
        case 'genres':
          return selectedOptions.some(genre => movie.genres.includes(genre));
        case 'actors':
          return selectedOptions.some(actor => movie.actors.includes(actor));
        case 'directors':
          return selectedOptions.some(director => movie.directors.includes(director));
        default:
          return true;
      }
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/90 to-purple-700/90 relative flex text-white">
      {/* Hamburger Menu Button (Mobile Only) */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 md:hidden bg-white text-purple-900 p-2 rounded-md shadow-lg"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>
      
      {/* Sidebar with White Background and Readable Text */}
      <FilterSidebar 
        onFilterChange={handleFilterChange} 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0 md:ml-72'}`}>
        <div className="flex flex-col items-center p-4">
          {/* FlickPredict Logo in Upper Left */}
          <Link to="/" className="absolute top-4 left-16 md:left-[19rem] flex items-center cursor-pointer">
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
                {/* Clickable Image that links to JustWatch */}
                <a 
                  href={`https://www.justwatch.com/us/movie/${encodeURIComponent(formatJustWatchTitle(movie.title))}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img 
                    src={movie.image} 
                    alt={movie.title} 
                    className="w-full h-68 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </a>

                {/* Movie Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{movie.title}</h3>
                  <p className="text-gray-600">Released: {movie.year}</p>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genres.map((genre, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2">
                      <span className="text-yellow-500">
                        {"★".repeat(movie.rating)}{"☆".repeat(5 - movie.rating)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 text-center text-purple-900/70 text-sm z-10 border-t-4 border-purple-900 mt-8">
          © 2025 FlickPredict. All rights reserved.
        </div>
      </div>
    </div>
  );
}