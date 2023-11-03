import { ObjectId } from '../configs/mongodb_config.js';

const _userSchema = ({ _id, username, password }) => {
  return {
    _id,
    username,
    password,
  };
};

const User = (userObj) => {
  let normalizedUserObj;
  if (userObj._id && typeof userObj._id === 'string') {
    normalizedUserObj = { ...userObj, _id: new ObjectId(userObj._id) };
  } else {
    normalizedUserObj = { ...userObj };
  }

  const user = _userSchema(normalizedUserObj);

  return user;
};

export default User;
