import { Router } from 'express';
import { AUTH_COOKIE } from '../../../configs/login.js';
import { FRONTEND_URL } from '../../../configs/domain.js';
import {
  getGoogleAuthURL,
  getUserCookie,
} from '../../../controllers/login/oauth/google.js';

const googleAuthRouter = Router({ mergeParams: true });

/**
 * To redirect to Google sign-in page
 * with a callback URI
 */
googleAuthRouter.get('/', (req, res) => {
  const googleAuthUrl = getGoogleAuthURL(`${req.originalUrl}/callback`);

  // 302 redirect fails with CORS error
  // because google oauth URL does not
  // allow preflight checks
  res.json({
    redirectUrl: googleAuthUrl,
  });
});

/**
 * Callback for google oAuth sign-in
 */
googleAuthRouter.get('/callback', async (req, res) => {
  // get the code from the google auth server
  const { code } = req.query;
  let userCookie;

  try {
    userCookie = await getUserCookie(code, 'auth-code');
  } catch (error) {
    res.status(401).json({ error });
  }

  if (!userCookie) {
    res
      .status(500)
      .json({ error: 'Failed to login user. Internal server error' });
  }

  res.cookie(AUTH_COOKIE, userCookie.cookie, { httpOnly: true });
  res.redirect(302, `${FRONTEND_URL}/home`);
});

/**
 * Route to handle login with client side JWT
 * Triggered by Sign-in with Google button on the UI
 *
 * The request should contain a token in the body
 */
googleAuthRouter.get('/token', async (req, res) => {
  const { token } = req.query;
  let userCookie;

  try {
    userCookie = await getUserCookie(token, 'client-token');
  } catch (error) {
    res.status(401).json({ error });
    return;
  }

  if (!userCookie) {
    res
      .status(500)
      .json({ error: 'Failed to login user. Internal server error' });
    return;
  }

  res.cookie(AUTH_COOKIE, userCookie.cookie, { httpOnly: true });
  res.status(204);
  res.end();
});

googleAuthRouter.post('/showcookies', (req, res) => {
  res.json({
    rec: req.cookies,
  });
});

export default googleAuthRouter;
