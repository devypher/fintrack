import { Router } from 'express';
import oauthRouter from './oauth/oauth.js';
import { returnIfAuthenticated } from '../middleware/common.js';
const loginRouter = Router({ mergeParams: true });

loginRouter.use(returnIfAuthenticated);

loginRouter.use('/auth', oauthRouter);

export default loginRouter;
