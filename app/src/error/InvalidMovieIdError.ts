export default class InvalidMovieIdError extends Error {
  constructor( msg: string ) {
    super( msg );
    this.name = 'InvalidMovieIdError';
  }
}