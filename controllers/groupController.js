import { db, ObjectId } from '../configs/mongodb_config';
import Guest from '../models/Guest';
import guestController from './guestController';

const _sortDefaults = { group: 1, declined: 1, family: 1 };

const find = async (searchFields = {}, sortFields = _sortDefaults) => {
  const guestDocs = await db
    .collection('guests')
    .find(searchFields)
    .sort(sortFields)
    .toArray();
  const guestsArray = guestDocs.map((x) => Guest(x));
  let groupId;
  const groupedGuests = guestsArray.reduce((prev, cur) => {
    if (groupId !== cur.group) {
      prev.push([]);
      groupId = cur.group;
    }
    prev[prev.length - 1].push(Guest(cur));
    return prev;
  }, []);
  return groupedGuests;
};
const findOne = async (group_id) => {
  const guestDocs = await db
    .collection('guests')
    .find({ group: group_id })
    .sort({ name: 1 })
    .toArray();
  const group = guestDocs.map((x) => Guest(x));
  return group;
};

const findByName = async (name) => {
  const user = await guestController.findByName(name);
  const groupGuestDocs = await db
    .collection('guests')
    .find({ group: user.group })
    .toArray();
  const groupGuests = groupGuestDocs.map((x) => Guest(x));
  return groupGuests;
};

export default {
  find,
  findOne,
  findByName,
};
