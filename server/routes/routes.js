import { Router } from 'express';
import loginRouter from './login/login.js';
const router = Router({ mergeParams: true });

router.use('/login', loginRouter);

export default router;
