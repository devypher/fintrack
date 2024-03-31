import { Sequelize } from 'sequelize';
import postgresLogger from '../logger/postgres.js';
import { POSTGRES_DB } from '../configs/database.js';

const DB_CONN = {
  sequelize: new Sequelize(
    POSTGRES_DB.name,
    POSTGRES_DB.user,
    POSTGRES_DB.password,
    {
      host: POSTGRES_DB.host,
      port: POSTGRES_DB.port,
      dialect: 'postgres',
      logging: (msg) => {
        postgresLogger.debug(msg);
      },
    }
  ),

  authenticate: async function () {
    try {
      await this.sequelize.authenticate();
      postgresLogger.info('Connection with postgreSQL successful');
    } catch (error) {
      postgresLogger.error('Error authenticating with the database');
      postgresLogger.error(error);
      throw error;
    }
  },

  close: async function () {
    postgresLogger.info('Closing the database connection');

    try {
      await this.sequelize.close();
    } catch (error) {
      postgresLogger.error('Unable to close database connection');
      postgresLogger.error(error);
    }
  },

  runRawQuery: async function runRawQuery(
    query,
    selectQuery = true,
    options = null
  ) {
    const defaultQueryOptions = selectQuery
      ? { type: Sequelize.QueryTypes.SELECT }
      : {};
    return this.sequelize.query(query, {
      ...defaultQueryOptions,
      ...(options || {}),
    });
  },
};

export default DB_CONN;
