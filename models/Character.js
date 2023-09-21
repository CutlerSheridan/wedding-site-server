import { ObjectId } from 'mongodb';

const _characterSchema = ({
  _id,
  name,
  survives,
  optional,
  role,
  backstory,
  secrets,
  notes,
}) => {
  return {
    _id,
    name,
    survives,
    optional,
    role,
    backstory,
    secrets,
    notes,
  };
};

const Character = (dataObj) => {
  let normalizedCharacterObj = { ...dataObj };
  if (dataObj._id && typeof dataObj._id === 'string') {
    normalizedCharacterObj._id = new ObjectId(dataObj._id);
  }

  const character = _characterSchema(normalizedCharacterObj);

  return character;
};

export default Character;
