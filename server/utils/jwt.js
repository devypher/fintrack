import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../configs/login.js';

export function generateAuthToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, JWT_PRIVATE_KEY, {
    expiresIn,
  });
}

export function getPayloadFromToken(token) {
  return jwt.verify(token, JWT_PRIVATE_KEY);
}
