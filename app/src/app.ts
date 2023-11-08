import { config } from 'dotenv-flow';
config();
import express from 'express';
import type { Request, Response } from 'express';
import type { ParamsDictionary } from  'express-serve-static-core';
import movieRepository from './repository/movie';
import type { Movie } from './model/movie.type';
import MovieNotFoundError from './error/MovieNotFoundError';
import { isAdmin } from './auth/role';

const app = express();
app.use( express.json() );

app.get( '/movies', async ( req, res ) => {
  try {
    const movies = await movieRepository.list();
    res.json( movies );
  } catch( err ) {
    res.status( 500 ).json( { error: 'Internal server error' } );
  }
} );

app.get( '/search', async ( req: Request<unknown, unknown, unknown, { q: string }>, res ) => {
  try {
    const query = req.query.q;
    // TODO: Whether handle empty search query?
    const movies = await movieRepository.search( query );
    res.json( movies );
  } catch( err ) {
    res.status( 500 ).json( { error: 'Internal server error' } );
  }
} );

app.post( '/movies', isAdmin, async ( req: Request<unknown, unknown, Movie>, res: Response ) => {
  try {
    const movie = req.body;
    // TODO: Validation checks?
    const movies = await movieRepository.add( movie );
    res.status( 201 ).json( movies );
  } catch( err ) {
    res.status( 500 ).json( { error: 'Internal server error' } );
  }
} );

app.put( '/movies/:id', isAdmin, async ( req: Request<ParamsDictionary, unknown, Movie>, res ) => {
  try {
    const movie = req.body;
    const id = parseInt( req.params.id );
    // TODO: Validation checks?
    await movieRepository.update( id, movie );
    res.status( 204 ).json( null );
  } catch( err ) {
    if( err instanceof MovieNotFoundError ) {
      res.status( 404 ).json( { error: 'Movie does not exist' } );
    } else {
      res.status( 500 ).json( { error: 'Internal server error' } );
    }
  }
} );

app.delete( '/movies/:id', isAdmin, async ( req, res ) => {
  try {
    const id = parseInt( req.params.id );
    // TODO: Validation checks?
    await movieRepository.delete( id );
    res.status( 204 ).json( null );
  } catch( err ) {
    if( err instanceof MovieNotFoundError ) {
      res.status( 404 ).json( { error: 'Movie does not exist' } );
    } else {
      res.status( 500 ).json( { error: 'Internal server error' } );
    }
  }
} );

export default app;