import { GOOGLE_AUTH_CONFIG } from '../../../configs/login.js';
import { BACKEND_URL } from '../../../configs/domain.js';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import serverLogger from '../../../logger/server.js';
import { getOrAddUser } from './oauth.js';

const googleOAuthClient = new OAuth2Client();

async function extractTokenPayload(token) {
  let ticket;

  try {
    ticket = await googleOAuthClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_AUTH_CONFIG.clientId,
    });
  } catch (error) {
    serverLogger.error('Google login token verification failed');
    serverLogger.error(error);

    return null;
  }

  const payload = ticket.getPayload();
  return payload;
}

async function getAccessTokenFromCode(code) {
  const {
    data: { access_token: accessToken },
  } = await axios.post(
    GOOGLE_AUTH_CONFIG.apiEndpoints.token,
    {},
    {
      params: {
        client_id: GOOGLE_AUTH_CONFIG.clientId,
        client_secret: GOOGLE_AUTH_CONFIG.clientSecret,
        code,
        redirect_uri: `${BACKEND_URL}/api/login/auth/google/callback`,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return accessToken;
}

async function getUserInfo(accessToken) {
  const { data: profile } = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return profile;
}

function getAuthCookie(user) {
  if (!user) {
    return null;
  }

  return user.generateAuthToken();
}

async function getCookieFromClientToken(clientJWT) {
  const tokenPayload = await extractTokenPayload(clientJWT);

  if (!tokenPayload) {
    return null;
  }

  const {
    email,
    family_name: lastName,
    given_name: firstName,
    picture: profilePic,
  } = tokenPayload;

  let responseObject;
  try {
    const userObj = await getOrAddUser(email, firstName, lastName, profilePic);
    responseObject = {
      ...userObj,
    };
  } catch (error) {
    const errorMsg = 'Failed to get user details from client side JWT';
    serverLogger.error(errorMsg);
    serverLogger.error(error);
    throw new Error(errorMsg);
  }

  responseObject.cookie = getAuthCookie(responseObject.user);
  return responseObject;
}

async function getCookieFromAuthCode(authCode) {
  let responseObject;

  try {
    const accessToken = await getAccessTokenFromCode(authCode);
    const {
      email,
      given_name: firstName,
      family_name: lastName,
      picture: profilePic,
    } = await getUserInfo(accessToken);
    responseObject = {
      ...(await getOrAddUser(email, firstName, lastName, profilePic)),
    };
  } catch (error) {
    const errorMsg = 'Failed to get user details from google auth code';
    serverLogger.error(errorMsg);
    serverLogger.error(error);
    throw new Error(errorMsg);
  }

  responseObject.cookie = getAuthCookie(responseObject.user);

  return responseObject;
}

export function getGoogleAuthURL(redirectURIRoute) {
  const queryString = new URLSearchParams({
    client_id: GOOGLE_AUTH_CONFIG.clientId,
    redirect_uri: `${BACKEND_URL}${redirectURIRoute}`,
    response_type: 'code',
    scope: 'profile email',
  }).toString();
  return `${GOOGLE_AUTH_CONFIG.apiEndpoints.oauth}?${queryString}`;
}

export async function getUserCookie(codeOrToken, mode) {
  switch (mode) {
    case 'client-token':
      return await getCookieFromClientToken(codeOrToken);
    case 'auth-code':
      return await getCookieFromAuthCode(codeOrToken);
    default:
      return null;
  }
}
