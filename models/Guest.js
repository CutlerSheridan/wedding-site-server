import { ObjectId } from 'mongodb';

const _guestSchema = ({
  _id,
  name,
  group,
  family = false,
  address,
  fri_rsvp,
  sat_rsvp,
  sun_rsvp,
  declined = false,
  sent_savedate = false,
  sent_invite = false,
  next_round = false,
  character,
  ready_to_send = false,
  sent_character = false,
  role,
  survives,
  backstory,
  secrets,
  notes,
}) => {
  return {
    _id,
    name,
    group,
    family,
    address,
    fri_rsvp,
    sat_rsvp,
    sun_rsvp,
    declined,
    sent_savedate,
    sent_invite,
    next_round,
    character,
    ready_to_send,
    sent_character,
    role,
    survives,
    backstory,
    secrets,
    notes,
  };
};

const Guest = (dataObj) => {
  let normalizedGuestObj = { ...dataObj };
  if (dataObj._id && typeof dataObj._id === 'string') {
    normalizedGuestObj._id = new ObjectId(dataObj._id);
  }

  const guest = _guestSchema(normalizedGuestObj);

  return guest;
};

export default Guest;

('');
