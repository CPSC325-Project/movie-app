import { Film } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

const RECOMMENDED_MOVIES = [
  { title: "The Matrix", year: 1999, image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
  { title: "Inception", year: 2010, image: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg" },
  { title: "Interstellar", year: 2014, image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { title: "The Prestige", year: 2006, image: "https://m.media-amazon.com/images/I/619c+UQZaOL._AC_UF894,1000_QL80_.jpg" },
  { title: "Blade Runner 2049", year: 2017, image: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg" },
  { title: "Ghost Rider", year: 2007, image: "https://upload.wikimedia.org/wikipedia/en/7/71/GhostRiderBigPoster.jpg" }
];

const formatWikipediaTitle = (title: string) => title.split(' ').join('_'); // Convert spaces to underscores

export function Recommend() {
  return (
    <div className="min-h-screen bg-purple-900 flex flex-col items-center p-4 relative">
      {/* Clickable FlickPredict Logo in Upper Left */}
      <Link to="/" className="absolute top-4 left-4 flex items-center cursor-pointer">
        <Film size={32} className="text-yellow-500" />
        <h1 className="text-3xl font-bold ml-2 text-white">FlickPredict</h1>
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
        <Link to="#">
          <Button variant="outline" className="border-yellow-400 text-white hover:bg-white/20">
            Resources
          </Button>
        </Link>
      </nav>

      {/* Page Title */}
      <h2 className="text-2xl font-bold text-white mt-20 mb-6">FlickPredict recommended these movies for Alicia</h2>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {RECOMMENDED_MOVIES.map((movie, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Clickable Image that links to Wikipedia */}
            <a 
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(formatWikipediaTitle(movie.title))}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
              />
            </a>

            {/* Movie Details */}
            <div className="p-4">
              <h3 className="text-lg font-bold">{movie.title}</h3>
              <p className="text-gray-600">Released: {movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
