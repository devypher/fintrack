import { Router } from 'express';
import {
  getUserByEmail,
  createUser,
  getUserAuthToken,
  getMatchingUsers,
  doesUsernameExists,
} from '../../controllers/users/users.js';
import serverLogger from '../../logger/server.js';
import { AUTH_COOKIE } from '../../configs/login.js';
import {
  allowAuthenticatedOnly,
  returnIfAuthenticated,
} from '../middleware/common.js';
import checksRouter from './checks.js';
import friendsRouter from './friends/friends.js';

const usersRouter = Router({ mergeParams: true });

usersRouter.post('/', returnIfAuthenticated, async (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;

  const { user } = await getUserByEmail(email);

  if (user) {
    res.status(409).json({
      code: 1,
      reason: 'Email already in use',
    });
    return;
  }

  const userNameExists = await doesUsernameExists(username);

  if (userNameExists) {
    res.status(409).json({
      code: 2,
      reason: 'Username already in use',
    });
    return;
  }

  const { error, user: newUser } = await createUser(
    email,
    password,
    firstName,
    lastName,
    username
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
      firstName: user.dataValues.first_name,
      lastName: user.dataValues.last_name,
      profilePic: user.dataValues.profile_pic,
      username: user.dataValues.username,
      match: user.dataValues.match,
    })),
  });
});

usersRouter.use('/checks', checksRouter);
usersRouter.use('/:username/friends', allowAuthenticatedOnly, friendsRouter);

export default usersRouter;
