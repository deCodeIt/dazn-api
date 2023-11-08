export default class JwtSecretNotFoundError extends Error {
  constructor( msg: string ) {
    super( msg );
    this.name = 'JwtSecretNotFoundError';
  }
}