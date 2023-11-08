import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRoleEnum } from '../model/user.type';

export const isAdmin = ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if( !process.env.JWT_SECRET ) {
      return res.status( 500 ).json( { error: 'Internal Server Error. Missing jwt key' } );
    }

    const auth = req.header( 'Authorization' );
    if( !auth ) {
      return res.status( 401 ).json( { error: 'Missing auth credentials' } );
    }

    // Auth with be like `Bearer abcasldkasjdqjwpijawld.....`
    const token = auth.split( ' ' )[ 1 ];
    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    if( typeof decoded === 'string' ) {
      return res.status( 400 ).json( { error: 'Malformed credentials' } );
    }

    if( decoded[ 'role' ] !== UserRoleEnum.ADMIN ) {
      return res.status( 403 ).json( { error: 'Forbidden' } );
    }

    // Verified that the logged in user is an admin.
    next();
  } catch( err ) {
    console.error( 'isAdmin', err );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  }
};