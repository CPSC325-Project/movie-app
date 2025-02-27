import { Film } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, XCircle } from 'lucide-react';
import { Button } from '../components/Button';

const SAMPLE_MOVIES = [
  {
    id: '1',
    title: 'Inception',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000',
    year: 2010,
  },
  {
    id: '2',
    title: 'The Shawshank Redemption',
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&q=80&w=2000',
    year: 1994,
  },
  {
    id: '3',
    title: 'Pulp Fiction',
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=2000',
    year: 1994,
  },
  {
    id: '4',
    title: 'The Matrix',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2000',
    year: 1999,
  },
  {
    id: '5',
    title: 'Forrest Gump',
    image: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=2000',
    year: 1994,
  },
  {
    id: '6',
    title: 'The Godfather',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=2000',
    year: 1972,
  },
  {
    id: '7',
    title: 'Avengers: Endgame',
    image: 'https://images.unsplash.com/photo-1560932684-5e552e2894e9?auto=format&fit=crop&q=80&w=2000',
    year: 2019,
  },
  {
    id: '8',
    title: 'The Dark Knight',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=2000',
    year: 2008,
  },
  {
    id: '9',
    title: 'Interstellar',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=2000',
    year: 2014,
  },
  {
    id: '10',
    title: 'Spirited Away',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=2000',
    year: 2001,
  },
];

export function RateMovies() {
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number | null>>({});

  const handleRate = (rating: number | null) => {
    setRatings({ ...ratings, [SAMPLE_MOVIES[currentMovie].id]: rating });

    if (currentMovie < SAMPLE_MOVIES.length - 1) {
      // Adding delay before moving to the next movie
      setTimeout(() => {
        setCurrentMovie(currentMovie + 1);
      }, 1000); // 1000 ms delay (1 second)
    }

    // If five movies have been rated, navigate to the recommendations page
    if (Object.keys(ratings).length === 4) {  // When 5 ratings are complete, the length is 5
      setTimeout(() => {
        navigate('/recommend');
      }, 250);  // Delay the navigation to allow users to see their last rating
    }
  };

  const movie = SAMPLE_MOVIES[currentMovie];
  const currentRating = ratings[movie.id];

  return (
<div className="min-h-screen bg-purple-900 flex flex-col items-center justify-start p-4">
  {/* Header with FlickPredict logo */}
  <div className="flex items-center justify-center mb-8">
    <Film size={32} className="text-yellow-500" />
    <h1 className="text-3xl font-bold ml-2 text-white">FlickPredict</h1>
  </div>

  {/* Main Content */}
  <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
    <img
      src={movie.image}
      alt={movie.title}
      className="w-full h-64 object-cover"
    />

    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
      <p className="text-gray-600 mb-6">Released: {movie.year}</p>

      <div className="space-y-4">
        <p className="text-lg font-medium">How would you rate this movie?</p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
              >
                <Star
                  size={32}
                  className={`${
                    currentRating !== null && rating <= currentRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => handleRate(null)}
            className="flex items-center"
          >
            <XCircle className="mr-2" />
            Haven't Watched
          </Button>
        </div>
      </div>
    </div>
  </div>

  {/* Rating progress */}
  <div className="mt-4 text-white">
    Rated {Object.keys(ratings).length} of 5 required movies
  </div>
</div>
  );
}