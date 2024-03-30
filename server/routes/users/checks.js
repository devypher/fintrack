import { Router } from 'express';
import { doesUsernameExists } from '../../controllers/users/users.js';

const checksRouter = Router();

checksRouter.post('/username', async (req, res) => {
  const usernameExists = await doesUsernameExists(req.body.username);

  if (usernameExists) {
    res.status(409).end();
    return;
  }

  res.status(204).end();
});

export default checksRouter;
