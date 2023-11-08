import app from '../src/app';
import request from 'supertest';
import movieRepository from '../src/repository/movie';
import type { Movie } from '../src/model/movie.type';
import { generateToken } from '../src/util/jwt';
import { UserRoleEnum } from '../src/model/user.type';

describe( 'Movie Lobby API Test', () => {

  beforeAll( async () => {
    await movieRepository.populateDummyData();
  } );

  it( 'GET /movies', async () => {
    const resp = await request( app ).get( '/movies' );
    expect( resp.statusCode ).toBe( 200 );
    expect( resp.body ).toHaveLength( 4 );
  } );

  it( 'GET /search?q={query}', async () => {
    const resp = await request( app ).get( '/search?q=harry' );
    expect( resp.statusCode ).toBe( 200 );
    expect( resp.body ).toHaveLength( 1 );
    expect( resp.body[ 0 ] ).toMatchObject( {
      title: 'Harry Potter and the Goblet of Fire',
    } );
  } );

  it( 'POST /movies', async () => {
    const movie: Omit<Movie, 'id'> = {
      title: 'Spiderman',
      genre: 'ADVENTURE',
      rating: 9.2,
      streamingLink: 'https://www.abcd.com/24',
    };
    let resp = await request( app ).post( '/movies' ).send( movie );
    expect( resp.statusCode ).toBe( 401 );

    resp = await request( app ).post( '/movies' ).set( 'Authorization', `Bearer ${generateToken( 'user1', UserRoleEnum.ADMIN )}` ).send( movie );
    expect( resp.statusCode ).toBe( 201 );
    expect( resp.body ).toMatchObject( movie );
  } );

  it( 'PUT /movies/:id', async () => {
    const movie: Partial<Movie> = {
      rating: 9.9,
    };
    const resp = await request( app ).put( '/movies/1' ).set( 'Authorization', `Bearer ${generateToken( 'user1', UserRoleEnum.ADMIN )}` ).send( movie );
    expect( resp.statusCode ).toBe( 204 );
    expect( resp.body ).toEqual( {} );
  } );

  it( 'DELETE /movies/:id', async () => {
    const resp = await request( app ).delete( '/movies/2' ).set( 'Authorization', `Bearer ${generateToken( 'user1', UserRoleEnum.ADMIN )}` );
    expect( resp.statusCode ).toBe( 204 );
    expect( resp.body ).toEqual( {} );
  } );
} );