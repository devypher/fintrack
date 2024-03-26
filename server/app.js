import './env.js';
import { setupPostgresDB } from './setup/database.js';
import server from './setup/server.js';
import router from './routes/routes.js';
import { authenticateRequest } from './routes/middleware/common.js';

// Start the server and setup the database connection
server.start(async () => {
  await setupPostgresDB();
});

// Use authentication middleare
server.useMiddleware(authenticateRequest);

// Add api routes
server.useRouter('/api', router);
