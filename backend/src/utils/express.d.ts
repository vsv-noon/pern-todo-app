import type { JwtPayload } from './jwt.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload | null;
  }
}

export {};
