import { Router } from 'express';
import loginRouter from './login/login.js';
import logoutRouter from './logout/logout.js';
import usersRouter from './users/users.js';
const router = Router({ mergeParams: true });

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/users', usersRouter);

export default router;
