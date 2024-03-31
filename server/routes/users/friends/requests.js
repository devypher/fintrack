import {
  createRequest,
  acceptRequest,
  cancelRequest,
  getReceivedRequests,
  getSentRequests,
} from '../../../controllers/users/friends/requests.js';
import { getUserByUsername } from '../../../controllers/users/users.js';

import { Router } from 'express';
import serverLogger from '../../../logger/server.js';

const requestRouter = Router({ mergeParams: true });

requestRouter.get('/sent', async (req, res) => {
  const userId = req.userId;

  let friendRequests = [];

  try {
    friendRequests = await getSentRequests(userId);
  } catch (error) {
    res.status(500).end();
    serverLogger.error(error);
    return;
  }

  res.status(200).json({ requests: friendRequests });
});

requestRouter.get('/received', async (req, res) => {
  const userId = req.userId;

  let friendRequests = [];

  try {
    friendRequests = await getReceivedRequests(userId);
  } catch (error) {
    res.status(500).end();
    return;
  }

  res.status(200).json({ requests: friendRequests });
});

requestRouter.post('/', async (req, res) => {
  const userId = req.userId;
  const { receiverUsername, greeting } = req.body;

  try {
    const { user: receiver, error } = await getUserByUsername(receiverUsername);
    if (error) {
      throw new Error(error);
    }
    await createRequest(userId, receiver.id, greeting);
  } catch (error) {
    res.status(500).end();
    serverLogger.error('Failed to create friend request');
    serverLogger.error(error);
  }

  res.status(204).end();
});

requestRouter.post('/accept', async (req, res) => {
  const userId = req.userId;
  const { requestId } = req.body;

  let accepted;
  try {
    accepted = await acceptRequest(requestId, userId);
  } catch (error) {
    res.status(500).end();
    serverLogger.error('Failed to accept a request');
    serverLogger.error(error);
    return;
  }

  if (accepted.error) {
    res.status(403).json({
      error: accepted.error,
    });
    return;
  }

  res.status(204).end();
});

requestRouter.delete('/', async (req, res) => {
  const userId = req.userId;
  const { requestId } = req.body;

  let deleted;

  try {
    deleted = await cancelRequest(requestId, userId);
  } catch (err) {
    res.status(500).end();
  }

  if (deleted?.error) {
    req.status(403).json({
      error: deleted.error,
    });
    return;
  }

  res.status(204).end();
});

export default requestRouter;
