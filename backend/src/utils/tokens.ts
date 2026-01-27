// import crypto from 'crypto';

// import jwt, { Secret } from 'jsonwebtoken';
// // import dotenv from 'dotenv';

// // dotenv.config();

// export function signAccessToken(user) {
//   return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET as Secret, {
//     expiresIn: '15m',
//   });
// }

// export function generateRefreshToken() {
//   return crypto.randomBytes(64).toString('hex');
// }

// export function hashToken(token: string) {
//   return crypto.createHash('sha256').update(token).digest('hex');
// }
