import jwt from 'jsonwebtoken';
import type { UserJwtToken, UserRoleEnum } from '../model/user.type';
import JwtSecretNotFoundError from '../error/JwtSecretNotFoundError';

export const generateToken = ( userId: string, role: UserRoleEnum ): string => {
  const payload: UserJwtToken = {
    userId,
    role,
  };

  if( !process.env.JWT_SECRET ) {
    throw new JwtSecretNotFoundError( 'Secret key missing from config' );
  }

  return jwt.sign( payload, process.env.JWT_SECRET );
};