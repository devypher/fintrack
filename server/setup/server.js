import express from 'express';
import cors from 'cors';
import { SERVER_CONFIG } from '../configs/server.js';
import { ALLOWED_ORIGINS } from '../configs/domain.js';
import serverLogger from '../logger/server.js';
import cookieParser from 'cookie-parser';
const { port: PORT } = SERVER_CONFIG;

const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const server = {
  instance: app,
  start: function (callback) {
    this.instance.listen(PORT, async () => {
      await callback();
      serverLogger.info(`Started the server on port ${PORT}`);
    });
  },
  useRouter: function (route, router) {
    this.instance.use(route, router);
  },

  useMiddleware: function (middleware) {
    this.instance.use(middleware);
  },
  log: (message, level = 'info') => {
    serverLogger.log(level, message);
  },
};

export default server;
