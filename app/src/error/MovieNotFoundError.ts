export default class MovieNotFoundError extends Error {
  constructor( msg: string ) {
    super( msg );
    this.name = 'MovieNotFoundError';
  }
}