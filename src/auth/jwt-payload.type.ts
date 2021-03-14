import { Users } from '../users/entities/users.entity';

export type JwtPayload = Users & {
  username: string;
  sub: number;
  iat: number;
  exp: number;
};
