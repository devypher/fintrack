export const AUTH_COOKIE = 'local_session_cookie';

export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const GOOGLE_AUTH_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  apiEndpoints: {
    oauth: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
};
