import serverLogger from '../../../logger/server.js';
import User from '../../../models/postgres/User.js';

export async function getOrAddUser(email, firstName, lastName, profilePic) {
  const userObj = {
    user: await User.getByEmail(email),
    new: false,
  };

  if (userObj.user) {
    return userObj;
  }

  try {
    const username = email; // Use email as the username while creating the account
    userObj.user = await User.addNew(
      firstName,
      lastName,
      username,
      email,
      profilePic
    );
    userObj.new = true;
  } catch (error) {
    serverLogger.error('Failed to create a new user');
    serverLogger.error(error);
    return null;
  }

  return userObj;
}
