import { AUTH_COOKIE } from '../../configs/login.js';
import SERVER_LOGGER from '../../logger/server.js';
import User from '../../models/postgres/User.js';

export async function authenticateRequest(req, res, next) {
  const isAuthenticated = function () {
    return !!this.userId;
  };

  req.isAuthenticated = isAuthenticated;

  if (!req.cookies?.[AUTH_COOKIE]) {
    req.userId = null;
    next();
    return;
  }
  try {
    const user = await User.getUserFromToken(req.cookies[AUTH_COOKIE]);
    req.userId = user?.id;
  } catch (error) {
    SERVER_LOGGER.debug(
      `Unable to find user with token ${req.cookies[AUTH_COOKIE]}`
    );
    SERVER_LOGGER.debug(error);
  }

  if (!req.userId) {
    res.clearCookie(AUTH_COOKIE);
  }

  next();
}

export function allowAuthenticatedOnly(req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(401).end();
    return;
  }

  next();
}

export function returnIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.status(204).end();
    return;
  }

  next();
}
