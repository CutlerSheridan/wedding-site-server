import { ObjectId } from 'mongodb';

const _groupSchema = ({ _id, address }) => {
  return {
    _id,
    address,
  };
};

const Group = (dataObj) => {
  const normalizedGroupObj = { ...dataObj };
  if (dataObj._id && typeof dataObj._id === 'string') {
    normalizedGroupObj._id = new ObjectId(dataObj._id);
  }

  const group = _groupSchema(normalizedGroupObj);

  return group;
};

export default Group;
