import { Film, Heart, Settings, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CircularProgress } from '../components/CircularProgress';
import { FilterSidebar } from '../components/FilterSidebar';
import noImage from '../components/noImage.jpeg';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';

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
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [___ ,setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const auth = getAuth(app);
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    setError('User is not authenticated. Please log in again.');
                    return;
                }
                const token = await currentUser.getIdToken()
            
                const response = await fetch("/api/users/recommendations", {
                    method: "GET",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                },})
                const data = await response.json();
                setMovies(data);
                setFilteredMovies(data); // Initialize filteredMovies with all movies
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const formatGenres = (genreString: string) => {
        return genreString.split('|').join(', ');
    };

    const handleFilterChange = (filters: Record<string, string[]>) => {
        console.log("Selected Filters:", filters);
        
        // Filter movies without modifying the original state
        const filtered = movies.filter(movie => 
          filters.genres.length === 0 || filters.genres.some(genre => movie.genres.includes(genre))
        );
      
        setFilteredMovies(filtered);
      };

    return (
        <div className="flex flex-col min-h-screen bg-purple-50">
            <nav className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 flex flex-col overflow-y-auto">
                <Link to ="/" className="block">
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

            <main className="ml-64 p-8 flex-grow pb-20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-purple-900">Welcome back!</h2>
                        <p className="text-purple-600">Here are your personalized movie recommendations</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-purple-400" size={20} />
                        </div>
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
                                // Display this message when no movies match the filter
                                <div className="text-center text-purple-700 text-lg font-semibold p-6">
                                    No movies found for the selected filters. Try selecting different genres.
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-6">
                                    {filteredMovies.map((movie) => (
                                        <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                                            <div className="w-full h-90 overflow-hidden relative">
                                                <img
                                                src={!movie.image || movie.image === 'https://images.unsplash.com/photo-1500004973?auto=format&fit=crop&q=80&w=2000' ? noImage : movie.image}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = noImage; // Use the locally imported PNG when the image fails to load
                                                }}
                                                />
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-purple-900 whitespace-normal break-words" title={movie.title}>
                                                        {movie.title}
                                                    </h4>
                                                    
                                                    {/* <div className="flex items-center">
                                                        <Star className="text-yellow-400" size={16} />
                                                        <span className="ml-1 text-sm text-gray-600">4.5</span>
                                                    </div> */}
                                                    
                                                </div>
                                                <p className="text-sm text-gray-600 break-words flex-grow">
                                                    <span className="inline-block">{formatGenres(movie.genres)}</span> • <span>{movie.year}</span>
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

            <div className="p-4 text-center text-purple-900/70 text-sm mt-8 flex-shrink-0 fixed bottom-0 left-0 w-full z-50">
                © 2025 FlickPredict. All rights reserved.
            </div>
        </div>
    );
}
