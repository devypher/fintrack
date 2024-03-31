import User from '../../models/postgres/User.js';
import bcrypt from 'bcrypt';
import sequelize, { Op } from 'sequelize';

export async function getUserByEmail(email) {
  if (!email) {
    return {
      error: 'Invalid input',
    };
  }

  let user;
  try {
    user = await User.getByEmail(email);
  } catch (error) {
    return { error };
  }

  if (!user) {
    return {
      error: 'Account does not exist',
    };
  }

  return { user };
}

export async function getUserByUsername(username) {
  if (!username) {
    return {
      error: 'Invalid input',
    };
  }

  let user;
  try {
    user = await User.getByUsername(username);
  } catch (error) {
    return { error };
  }

  if (!user) {
    return {
      error: 'Account does not exist',
    };
  }

  return { user };
}

export async function doesUsernameExists(username) {
  if (!username) {
    return true;
  }

  const user = await User.getByUsername(username);

  if (user) {
    return true;
  }

  return false;
}

export async function createUser(
  email,
  password,
  firstName,
  lastName,
  username,
  profilePic = null
) {
  if (!email || !password || !firstName) {
    return { error: 'Missing mandatory inputs' };
  }
  let user;
  try {
    user = await User.addNew(
      firstName,
      lastName,
      username,
      email,
      profilePic,
      password,
      true
    );
  } catch (error) {
    return { error };
  }

  return { user };
}

export async function authenticateUser(email, password) {
  if (!email || !password) {
    return {
      error: 'Invalid input',
    };
  }

  const { user } = await getUserByEmail(email);

  if (!user) {
    return {
      error: 'Account not found',
    };
  }

  const doesPassMatch = await bcrypt.compare(password, user.password);

  if (!doesPassMatch) {
    return {
      error: 'Incorrect password',
    };
  }

  return {
    user,
  };
}

export function getUserAuthToken(user) {
  if (!user) {
    return null;
  }

  return user.generateAuthToken();
}

export async function getMatchingUsers({ query, offset, limit }) {
  const selectorQuery = {
    attributes: ['username', 'first_name', 'last_name', 'profile_pic'],
  };

  if (limit && limit > 0) {
    selectorQuery.limit = limit;
  }

  if (offset && offset > 5) {
    selectorQuery.offset = offset;
  }

  selectorQuery.attributes.push([
    sequelize.fn('similarity', sequelize.col('username'), query),
    'match',
  ]);
  selectorQuery.where = sequelize.where(
    sequelize.fn('similarity', sequelize.col('username'), query),
    { [Op.gt]: 0.3 }
  );

  selectorQuery.order = [['match', 'DESC']];

  return await User.findAll(selectorQuery);
}
