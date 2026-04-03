import 'dotenv/config';
import { SignOptions } from 'jsonwebtoken';

// const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
// const VERIFY_ENDPOINT = process.env.TURNSTILE_VERIFY_ENDPOINT;

if (!process.env.TURNSTILE_VERIFY_ENDPOINT) {
  throw new Error('Missing VERIFY_ENDPOINT in environment variables');
}

export const ENV = {
  PORT: process.env.PORT ?? '5000',
  DATABASE_URL: process.env.DATABASE_URL ?? '',

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'change-me-in-prod',
  JWT_ACTiVATION_SECRET: process.env.JWT_ACTIVATION_SECRET ?? 'change-me-in-prod',
  JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET ?? 'change-me-in-prod',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],

  TURNSTILE_VERIFY_ENDPOINT: process.env.TURNSTILE_VERIFY_ENDPOINT,
  TURNSTILE_SECRET: process.env.TURNSTILE_SECRET_KEY || 'default_secret',
};
