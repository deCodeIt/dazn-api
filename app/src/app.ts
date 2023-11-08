import { config } from 'dotenv-flow';
config();
import express from 'express';
import type { Request, Response } from 'express';
import type { ParamsDictionary } from  'express-serve-static-core';
import movieRepository from './repository/movie';
import type { Movie } from './model/movie.type';
import MovieNotFoundError from './error/MovieNotFoundError';
import { isAdmin } from './auth/role';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Lobby API',
      description: 'Api to manage movie lobby for OTT',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [ './app/src/app.ts' ],
};

const swaggerSpec = swaggerJSDoc( swaggerOptions );

const app = express();
app.use( express.json() );
app.use( '/docs', swaggerUi.serve, swaggerUi.setup( swaggerSpec ) );

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - genre
 *         - rating
 *         - streamingLink
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto generated movie id
 *         title:
 *           type: string
 *           description: The title of the movie
 *         genre:
 *           type: string
 *           description: The genre of the movie
 *         rating:
 *           type: integer
 *           description: The rating of the movie
 *         streamingLink:
 *           type: string
 *           description: The streaming link of the movie
 *       example:
 *         id: 1
 *         title: Harry Potter
 *         genre: ADVENTURE
 *         rating: 8.2
 *         streamingLink: https://www.abcd.com/123
 *     MovieInput:
 *       type: object
 *       required:
 *         - title
 *         - genre
 *         - rating
 *         - streamingLink
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto generated movie id
 *         title:
 *           type: string
 *           description: The title of the movie
 *         genre:
 *           type: string
 *           description: The genre of the movie
 *         rating:
 *           type: integer
 *           description: The rating of the movie
 *         streamingLink:
 *           type: string
 *           description: The streaming link of the movie
 *       example:
 *         title: Harry Potter
 *         genre: ADVENTURE
 *         rating: 8.2
 *         streamingLink: https://www.abcd.com/123
 * tags:
 *   name: Movie
 *   description: The movie lobby managing api
 *
 * /movies:
 *   get:
 *     summary: List all the movies
 *     tags: [Movie]
 *     description: List all the movies within lobby
 *     responses:
 *       200:
 *         description: Successfully fetched all the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Add a movie
 *     tags: [Movie]
 *     description: Add a movie to the lobby
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *     responses:
 *       200:
 *         description: Successfully added the movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error
 *
 */
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