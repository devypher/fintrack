import { DataTypes, Model } from 'sequelize';
import database from '../../setup/postgres.js';
import User from './User.js';
class FriendRequest extends Model {
  static findById(requestId) {
    return FriendRequest.findByPk(requestId);
  }

  static deleteById(requestId) {
    return FriendRequest.destroy({
      where: {
        id: requestId,
      },
    });
  }

  static getSentRequests(userId) {
    return FriendRequest.findAll({
      where: {
        sender: userId,
      },
    });
  }

  static getReceivedRequests(userId) {
    return FriendRequest.findAll({
      where: {
        receiver: userId,
      },
    });
  }
}

FriendRequest.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    receiver: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    greeting: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: database.sequelize,
    tableName: 'friend_requests',
    modelName: 'FriendRequest',
  }
);

FriendRequest.belongsTo(User, {
  foreignKey: 'sender',
  onDelete: 'CASCADE',
  onUpdate: 'NO ACTION',
});
FriendRequest.belongsTo(User, {
  foreignKey: 'receiver',
  onDelete: 'CASCADE',
  onUpdate: 'NO ACTION',
});
export default FriendRequest;
