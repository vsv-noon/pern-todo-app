import 'dotenv/config';
import { SignOptions } from 'jsonwebtoken';

// interface Env {
//   PORT: string;
//   DATABASE_URL: string;
//   JWT_SECRET: string;
//   JWT_EXPIRES_IN: string;
// }

export const env = {
  PORT: process.env.PORT ?? '5000',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'change-me-in-prod',
  JWT_ACTiVATION_SECRET: process.env.JWT_ACTIVATION_SECRET ?? 'change-me-in-prod',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],
};
