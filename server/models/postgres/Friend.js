import { DataTypes, Model, Op } from 'sequelize';
import database from '../../setup/postgres.js';
import sequelize from 'sequelize';
class Friend extends Model {
  static async areFriends(user1, user2) {
    if (!user1 || !user2) {
      throw new Error('Invalid argument. Expected instance or id of User');
    }

    const friendship = await Friend.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { user_1: user1.id || user1 },
              { user_2: user2.id || user2 },
            ],
          },
          {
            [Op.and]: [
              { user_1: user1.id || user1 },
              { user_2: user2.id || user2 },
            ],
          },
        ],
      },
    });

    return !!friendship;
  }
}

Friend.init(
  {
    // Model attributes are defined here
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_1: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    user_2: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize: database.sequelize,
    tableName: 'friends',
    modelName: 'Friend',
  }
);

export default Friend;
