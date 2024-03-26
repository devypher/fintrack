import postgressDB from './postgres.js';
import postgresModels from '../models/postgres/models.js';
import postgresLogger from '../logger/postgres.js';

async function syncModelsWithPostgresDB() {
  postgresLogger.info('Syncing sequelize models with the database');

  for (const [name, model] of Object.entries(postgresModels)) {
    postgresLogger.info(`Syncing ${name}....`);
    model.sync({ alter: true });
  }
}

export async function setupPostgresDB() {
  // Authenticate postgres database connection
  await postgressDB.authenticate();

  // Sync database with object models
  await syncModelsWithPostgresDB();
}
