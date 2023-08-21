import { ObjectId } from 'mongodb';
import Debug from 'debug';
const debug = Debug('Group');

const _groupSchema = ({ _id, address }) => {
  return {
    _id,
    address,
  };
};

const Group = (dataObj) => {
  const normalizedGroupObj = { ...dataObj };
  debug('normalized group obj: ', normalizedGroupObj);
  if (dataObj._id && typeof dataObj._id === 'string') {
    debug('gets into conditional');
    normalizedGroupObj._id = new ObjectId(dataObj._id);
  }

  const group = _groupSchema(normalizedGroupObj);
  debug('group obj: ', group);
  return group;
};

export default Group;
