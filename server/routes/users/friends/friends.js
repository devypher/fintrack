import { Router } from 'express';
import requestRouter from './requests.js';
import { getAllFriends } from '../../../controllers/users/friends/friends.js';
import serverLogger from '../../../logger/server.js';
const friendsRouter = Router({ mergeParams: true });

friendsRouter.get('/', async (req, res) => {
  const requestByUser = req.user;
  const { username: requestedForUsername } = req.params;

  let friends;

  try {
    friends = await getAllFriends(requestedForUsername, requestByUser);
  } catch (error) {
    res.status(500).end();
    serverLogger.error(error);
    return;
  }

  if (friends.error) {
    res.status(403).json({
      error: friends.error,
    });
    return;
  }

  res.status(200).json({
    friends: friends.list,
  });
});

friendsRouter.use('/requests', requestRouter);
export default friendsRouter;
