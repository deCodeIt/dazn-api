export enum UserRoleEnum {
  USER,
  ADMIN,
}

export interface User {
  userId: string;
  password: string;
  role: UserRoleEnum;
}

export interface UserJwtToken {
  userId: string;
  role: UserRoleEnum;
}