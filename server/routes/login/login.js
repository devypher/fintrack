import { Router } from 'express';
import oauthRouter from './oauth/oauth.js';
import { returnIfAuthenticated } from '../middleware/common.js';
import { getUserCookie } from '../../controllers/login/login.js';
import { AUTH_COOKIE } from '../../configs/login.js';
const loginRouter = Router({ mergeParams: true });

loginRouter.use(returnIfAuthenticated);

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const userCookie = await getUserCookie(email, password);

  if (userCookie.error) {
    res.status(403).json({
      error: userCookie.error,
    });
    return;
  }

  res.cookie(AUTH_COOKIE, userCookie.cookie, { httpOnly: true });
  res.status(200).end();
});

loginRouter.use('/auth', oauthRouter);

export default loginRouter;
