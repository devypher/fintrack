import { Router } from 'express';
import { AUTH_COOKIE } from '../../configs/login.js';
const logoutRouter = Router();

logoutRouter.post('/', (req, res) => {
  res.clearCookie(AUTH_COOKIE);
  res.status(204);
  res.end();
});

export default logoutRouter;
