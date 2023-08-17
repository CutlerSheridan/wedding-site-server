import User from '../models/User';
import { db } from '../configs/mongodb_config';
import bcrypt from 'bcryptjs';

const saveToDB = async (user) => {
  try {
    const userExists = await db
      .collection('users')
      .findOne({ username: user.username });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await db.collection('users').insertOne(user);
      return user;
    }
    return null;
  } catch (err) {
    throw new Error('saveToDB err: ' + err);
  }
};
const isValidPassword = async (user, inputPassword) => {
  const passwordIsValid = await bcrypt.compare(inputPassword, user.password);
  return passwordIsValid;
};
const findOne = async (searchFields) => {
  try {
    const userDoc = await db.collection('users').findOne(searchFields);
    if (!userDoc) {
      return null;
    }
    return User(userDoc);
  } catch (err) {
    throw new Error('findOne err: ' + err);
  }
};

export default {
  saveToDB,
  isValidPassword,
  findOne,
};
