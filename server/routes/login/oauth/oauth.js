import { Router } from 'express';
import googleAuthRouter from './google.js';
const oauthRouter = Router({ mergeParams: true });

oauthRouter.use('/google', googleAuthRouter);

export default oauthRouter;
