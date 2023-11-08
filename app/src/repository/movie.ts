import MovieNotFoundError from '../error/MovieNotFoundError';
import type { Movie } from '../model/movie.type';
import dummyMovies from './movie.dummy';

class MovieRepository {
  movieMap: { [ id: number ]: Movie };
  latestId: number;

  constructor() {
    this.movieMap = {};
    this.latestId = 1;
  }

  private generateNextId(): number {
    return this.latestId++;
  }

  async populateDummyData(): Promise<void> {
    for( const movie of dummyMovies ) {
      await this.add( movie );
    }
  }

  async list(): Promise<Movie[]> {
    // Simulating promises because actual db calls are async whereas in memory db call is sync.
    return new Promise( resolve => {
      resolve( Object.values( this.movieMap  ) );
    } );
  }

  async search( query: string ): Promise<Movie[]> {
    return new Promise( resolve => {
      query = query.toLowerCase();
      const movies = Object.values( this.movieMap );
      const filteredMovies = movies.filter( m => m.title.toLowerCase().includes( query ) || m.genre.toLowerCase().includes( query ) );
      resolve( filteredMovies );
    } );
  }

  async add( movie: Omit<Movie, 'id'> ) : Promise<Movie> {
    return new Promise( resolve => {
      const movieObj: Movie = {
        id: this.generateNextId(),
        ...movie,
      };
      this.movieMap[ movieObj.id ] = movieObj;
      resolve( movieObj );
    } );
  }

  async update( id: number, movie: Partial<Movie> ) : Promise<Movie> {
    return new Promise( resolve => {
      if( !( id in this.movieMap ) ) {
        throw new MovieNotFoundError( 'Movie does not exist' );
      }

      const existingMovie = this.movieMap[ id ];

      const movieObj: Movie = {
        ...existingMovie,
        ...movie,
        id,
      };

      this.movieMap[ id ] = movieObj;
      resolve( movieObj );
    } );
  }

  async delete( id: number ): Promise<boolean> {
    return new Promise( resolve => {
      if( !( id in this.movieMap ) ) {
        throw new MovieNotFoundError( 'Movie does not exist' );
      }
      delete this.movieMap[ id ];
      resolve( true );
    } );
  }

}

const movieRepositoryInstance = new MovieRepository();
export default movieRepositoryInstance;