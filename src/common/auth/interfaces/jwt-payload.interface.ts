export interface JwtPayload {
  sub: number;
  exp: number;
  iat: number;
  refreshAfter: number;
}
