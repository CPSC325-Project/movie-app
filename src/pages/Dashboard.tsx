import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Settings, Search, Menu } from 'lucide-react';
import { Button } from '../components/Button';
import { CircularProgress } from '../components/CircularProgress';
import { FilterSidebar } from '../components/FilterSidebar';
import noImage from '../components/noImage.jpeg';
import { app } from '../firebase';
import { User as FirebaseUser, getAuth, onAuthStateChanged } from 'firebase/auth';

interface Movie {
  id: string;
  title: string;
  year: number;
  image: string;
  genres: string;
}

export function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({ genres: [], decades: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const token = await user.getIdToken();
          const response = await fetch('https://api.flickpredict.com/users/recommendations', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setMovies(data);
          setFilteredMovies(data);
        } catch (error) {
          console.error('Error fetching movies:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatGenres = (genreString: string) => genreString.split('|').join(', ');

  const applyFilters = (filters: Record<string, string[]>, query: string, sort = sortOption) => {
    let filtered = movies.filter((movie) => {
      const matchesGenre =
        filters.genres.length === 0 || filters.genres.some((genre) => movie.genres.includes(genre));

      const matchesDecade =
        filters.decades.length === 0 ||
        filters.decades.some((decade) => {
          const startYear = parseInt(decade.slice(0, 4), 10);
          return movie.year >= startYear && movie.year < startYear + 10;
        });

      const matchesSearch = query.trim() === '' || movie.title.toLowerCase().includes(query.trim().toLowerCase());

      return matchesGenre && matchesDecade && matchesSearch;
    });

    filtered.sort((a, b) => {
      switch (sort) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'year-asc':
          return a.year - b.year;
        case 'year-desc':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    applyFilters(filters, searchQuery, sortOption);
  };

  useEffect(() => {
    applyFilters(activeFilters, searchQuery, sortOption);
  }, [searchQuery, sortOption]);

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      {/* Hamburger menu (mobile only) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-900 text-white p-2 rounded-md shadow-lg"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Static Logo (Mobile) */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-3 md:hidden">
        <Film className="text-yellow-400" size={36} />
        <h1 className="text-3xl font-bold text-purple-900">FlickPredict</h1>
      </div>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 flex-col overflow-y-auto z-40 transition-transform duration-300 ${
          sidebarOpen ? 'flex' : 'hidden'
        } md:flex`}
      >
        <Link to="/" className="block">
          <div className="flex items-center gap-3 mb-10">
            <Film className="text-yellow-500" size={32} />
            <h1 className="text-2xl font-bold text-purple-900">FlickPredict</h1>
          </div>
        </Link>

        <div className="space-y-4">
          <Link to="/rate-movies" className="block">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Film size={20} />
              Rate More Movies
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Heart size={20} />
            Watchlist
          </Button>
          <Link to="/settings" className="block">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Settings size={20} />
              Settings
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-4 flex-grow overflow-y-auto">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8 flex-grow pb-20 ml-0 md:ml-64 mt-16 md:mt-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-purple-900">
              {user?.displayName ? `Welcome back, ${user.displayName.split(' ')[0]}!` : 'Welcome back!'}
            </h2>
            <p className="text-purple-600">Here are your personalized movie recommendations</p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto flex-grow">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full h-10 text-sm rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-2.5 text-purple-400" size={20} />
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-10 text-sm px-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Sort by...</option>
              <option value="title-asc">Title (A–Z)</option>
              <option value="title-desc">Title (Z–A)</option>
              <option value="year-asc">Year (Oldest → Newest)</option>
              <option value="year-desc">Year (Newest → Oldest)</option>
            </select>
          </div>
        </div>

        <section className="mb-12">
          <h3 className="text-xl font-semibold text-purple-900 mb-4">Recommended for You</h3>
          <div className="relative h-full">
            <div className="overflow-y-auto pr-2 hide-scrollbar h-full">
              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <CircularProgress />
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="text-center text-purple-700 text-lg font-semibold p-6">
                  No movies found. Try adjusting your filters or search.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                    >
                      <div className="w-full h-90 overflow-hidden relative">
                        <img
                          src={
                            !movie.image ||
                            movie.image === 'https://images.unsplash.com/photo-1500004973?auto=format&fit=crop&q=80&w=2000'
                              ? noImage
                              : movie.image
                          }
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = noImage;
                          }}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h4
                          className="font-semibold text-purple-900 whitespace-normal break-words mb-2"
                          title={movie.title}
                        >
                          {movie.title}
                        </h4>
                        <p className="text-sm text-gray-600 break-words flex-grow">
                          <span>{formatGenres(movie.genres)}</span> • <span>{movie.year}</span>
                        </p>
                        <div className="mt-auto">
                          <Button variant="primary" className="w-full">
                            Add to Watchlist
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white p-4 text-center text-purple-900/70 text-sm mt-auto">
        © 2025 FlickPredict. All rights reserved.
      </footer>
    </div>
  );
}