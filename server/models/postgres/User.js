import { DataTypes, Model } from 'sequelize';
import database from '../../setup/postgres.js';
import { generateAuthToken, getPayloadFromToken } from '../../utils/jwt.js';
import serverLogger from '../../logger/server.js';
import bcrypt from 'bcrypt';
class User extends Model {
  static addNew(
    firstName,
    lastName,
    username,
    email,
    profilePic,
    password = null,
    isDirectSignUp = false
  ) {
    const userData = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      profile_pic: profilePic,
    };

    if (isDirectSignUp) {
      //store password cryptically
      userData.password = password;
    }

    return User.create(userData);
  }

  static getById(id) {
    return User.findByPk(id);
  }

  static getByEmail(email) {
    return User.findOne({
      where: {
        email,
      },
    });
  }

  static getByUsername(username) {
    return User.findOne({
      where: { username },
    });
  }

  static deleteById(id) {
    return User.destroy({
      where: {
        id,
      },
    });
  }

  static deleteByEmail(email) {
    return User.destroy({
      where: {
        email,
      },
    });
  }

  static deleteByUsername(username) {
    return User.destroy({
      where: { username },
    });
  }

  static async getUserFromToken(token) {
    let userId = null;

    try {
      userId = getPayloadFromToken(token)?.userId;
    } catch (err) {
      serverLogger.debug('Failed to parse JWT');
      serverLogger.debug(err);
      return null;
    }
    return await User.getById(userId);
  }

  getFullname() {
    return [this.first_name, this.last_name].join(' ');
  }

  getEmail() {
    return this.email;
  }

  generateAuthToken(expiresIn = '24h') {
    return generateAuthToken({ userId: this.id }, expiresIn);
  }
}

User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },

    first_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.TEXT,
    },

    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },

    profile_pic: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
    },

    password: {
      type: DataTypes.TEXT,
    },

    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize: database.sequelize,
    tableName: 'users',
    modelName: 'User',
  }
);

// Add hooks here

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 5);
  }
});
export default User;
