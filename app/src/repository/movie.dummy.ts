import type { Movie } from '../model/movie.type';

const movies: Omit<Movie, 'id'>[] = [
  {
    title: 'Avengers Infinity War',
    genre: 'ACTION',
    rating: 8.7,
    streamingLink: 'https://www.abcd.com/1',
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    genre: 'ADVENTURE',
    rating: 8.2,
    streamingLink: 'https://www.abcd.com/2',
  },
  {
    title: 'Pirates of the Carribean',
    genre: 'ADVENTURE',
    rating: 8.5,
    streamingLink: 'https://www.abcd.com/3',
  },
  {
    title: 'Dhamaal',
    genre: 'COMEDY',
    rating: 7.6,
    streamingLink: 'https://www.abcd.com/4',
  },
];

export default movies;