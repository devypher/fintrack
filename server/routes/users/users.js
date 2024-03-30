import { Router } from 'express';
import {
  getUserByEmail,
  createUser,
  getUserAuthToken,
  getMatchingUsers,
} from '../../controllers/users/users.js';
import serverLogger from '../../logger/server.js';
import { AUTH_COOKIE } from '../../configs/login.js';
import {
  allowAuthenticatedOnly,
  returnIfAuthenticated,
} from '../middleware/common.js';

const usersRouter = Router({ mergeParams: true });

usersRouter.post('/', returnIfAuthenticated, async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const { user } = await getUserByEmail(email);

  if (user) {
    res.status(409).json({
      code: 1,
      reason: 'Email already in use',
    });
    return;
  }

  const { error, user: newUser } = await createUser(
    email,
    password,
    firstName,
    lastName
  );

  if (error) {
    serverLogger.error('Failed to create a new account');
    serverLogger.error(error);

    res.status(500).json({
      code: 1,
      reason: 'Failed to create account',
    });
    return;
  }

  const userCookie = getUserAuthToken(newUser);
  res.cookie(AUTH_COOKIE, userCookie, { httpOnly: true });
  res.status(200).end();
});

usersRouter.get('/search', allowAuthenticatedOnly, async (req, res) => {
  let matchList;

  try {
    matchList = await getMatchingUsers(req.body);
  } catch (error) {
    serverLogger.error('Failed to create matching user query');
    serverLogger.error(error);
    res.status(500).end();
    return;
  }

  res.status(200).json({
    match: matchList.map((user) => ({
      firstName: user.first_name,
      lastName: user.last_name,
      profilePic: user.profile_pic,
    })),
  });
});

export default usersRouter;
