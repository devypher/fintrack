import { Router } from 'express';
import loginRouter from './login/login.js';
import logoutRouter from './logout/logout.js';
const router = Router({ mergeParams: true });

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

export default router;
