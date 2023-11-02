import Guest from '../models/Guest';
import { db, ObjectId } from '../configs/mongodb_config';
import Debug from 'debug';
const debug = Debug('guest_controller');

const _sortDefaults = { declined: 1, next_round: 1, family: 1, group: 1 };

const find = async (searchFields = {}, sortFields = _sortDefaults) => {
  const guestDocs = await db
    .collection('guests')
    .find(searchFields)
    .sort(sortFields)
    .toArray();
  const guests = guestDocs.map((x) => Guest(x));
  return guests;
};
const findOne = async (searchFields = {}) => {
  if (searchFields._id && typeof searchFields._id === 'string') {
    searchFields._id = new ObjectId(searchFields._id);
  }

  const guestDoc = await db.collection('guests').findOne(searchFields);
  if (!guestDoc) {
    return null;
  }
  return Guest(guestDoc);
};
const findByName = async (name) => {
  const regexArg = RegExp(`^${name}$`, 'i');
  const userDoc = await db
    .collection('guests')
    .findOne({ name: { $regex: regexArg } });
  if (userDoc) {
    return Guest(userDoc);
  }
  return null;
};

export default {
  find,
  findOne,
  findByName,
};
