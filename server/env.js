import { config } from 'dotenv';

const ENV_PATH = process.env.NODE_ENV !== 'PROD' ? '.env' : '.env.production';

/**
 * Configures the environments variables
 * based on the node environment.
 *
 * This file needs to be imported before anything else
 * when the server is run.
 */
config({ path: ENV_PATH });
