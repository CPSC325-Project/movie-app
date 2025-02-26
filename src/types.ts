export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface MovieRating {
  userId: string;
  movieId: string;
  rating: number;
  hasWatched: boolean;
}