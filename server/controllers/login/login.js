import { authenticateUser, getUserAuthToken } from '../users/users.js';

export async function getUserCookie(email, password) {
  const returnObj = {
    cookie: null,
    error: null,
    user: null,
  };
  const { user, error } = await authenticateUser(email, password);

  if (error) {
    returnObj.error = error;
    return returnObj;
  }

  returnObj.user = user;
  returnObj.cookie = getUserAuthToken(user);

  return returnObj;
}
