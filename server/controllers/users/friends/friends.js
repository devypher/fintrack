import Friend from '../../../models/postgres/Friend.js';
import { getUserByUsername } from '../users.js';
import db from '../../../setup/postgres.js';

export async function getAllFriends(username, requestingUser) {
  const { user, error } = await getUserByUsername(username);

  if (error) {
    return { error };
  }

  let areFirends = true;
  if (requestingUser.username != username) {
    areFirends = await Friend.areFriends(user, requestingUser);

    if (!areFirends) {
      return {
        error: 'Insufficient permissions',
      };
    }
  }

  const friends = await db.runRawQuery(
    'SELECT u.username AS "username", u.first_name as "firstName", u.last_name as "lastName", u.profile_pic as "profilePic' +
      ' FROM users u' +
      ' JOIN' +
      ` friends f ON (u.id = f.user_1 AND f.user_2 = '${user.id}') OR (u.id = f.user_2 AND f.user_1 = '${user.id}');`,
    true
  );

  return { list: friends };
}
