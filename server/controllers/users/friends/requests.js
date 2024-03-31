import FriendRequest from '../../../models/postgres/FriendRequest.js';
import Friend from '../../../models/postgres/Friend.js';
import db from '../../../setup/postgres.js';

export async function createRequest(senderId, receiverId, greeting = null) {
  const alreadyFriends = await Friend.areFriends(senderId, receiverId);

  if (alreadyFriends) {
    return {
      success: 1,
      error: 'exists',
    };
  }

  const newRequest = await FriendRequest.create({
    sender: senderId,
    receiver: receiverId,
    greeting,
  });

  return {
    sucess: 1,
    request: newRequest,
  };
}

async function getRequestInstance(request) {
  if (
    !request ||
    !(request instanceof FriendRequest || typeof request === 'number')
  ) {
    throw new Error(
      'Inavlid argument. Expected instance or id of FriendRequest'
    );
  }

  const requestInstance =
    request instanceof FriendRequest
      ? request
      : await FriendRequest.findById(request);

  if (!requestInstance) {
    throw new Error(`Request with id ${request.id || request} not found.`);
  }

  return requestInstance;
}

export async function acceptRequest(request, userId) {
  const requestInstance = await getRequestInstance(request);

  if (requestInstance.receiver !== userId) {
    return {
      error: 'Invalid request',
    };
  }

  const alreadyFriends = await Friend.areFriends(
    requestInstance.sender,
    requestInstance.receiver
  );

  if (!alreadyFriends) {
    await Friend.create({
      user_1: requestInstance.sender,
      user_2: requestInstance.receiver,
    });
  }

  await FriendRequest.deleteById(requestInstance.id);
  return { success: 1 };
}

export async function getReceivedRequests(userId) {
  const requests = await db.runRawQuery(
    'SELECT fr.id as id, u1.username AS "sender.username", u1.first_name as "sender.firstName", u1.last_name as "sender.lastName", u1.profile_pic as "sender.profilePic"' +
      ' FROM users u1' +
      ' JOIN' +
      ' friend_requests fr ON u1.id = fr.sender' +
      ' JOIN' +
      ' users u2 ON u2.id = fr.receiver' +
      ` WHERE u2.id = '${userId}';`,
    true,
    { nest: true }
  );

  return requests;
}

export async function getSentRequests(userId) {
  const requests = await db.runRawQuery(
    'SELECT fr.id AS id, u2.username AS "receiver.username", u2.first_name AS "receiver.firstName", u2.last_name AS "receiver.lastName", u2.profile_pic as "receiver.profilePic"' +
      ' FROM users u1' +
      ' JOIN' +
      ' friend_requests fr ON u1.id = fr.sender' +
      ' JOIN' +
      ' users u2 ON u2.id = fr.receiver' +
      ` WHERE u1.id = '${userId}';`,
    true,
    { nest: true }
  );

  return requests;
}

export async function cancelRequest(request, userId) {
  const requestInstance = getRequestInstance(request);

  if (
    requestInstance.sender !== userId ||
    requestInstance.receiver !== userId
  ) {
    return {
      error: 'Invalid request',
    };
  }

  await FriendRequest.deleteById(requestInstance.id);
  return { success: 1 };
}
