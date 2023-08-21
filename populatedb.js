import { db } from './configs/mongodb_config';
import Guest from './models/Guest';
import Group from './models/Group';
import Debug from 'debug';
const debug = Debug('populatedb');
import asyncHandler from 'express-async-handler';

const main = async () => {
  await createGuests(guestGroups);
};

const guestCreate = asyncHandler(async (guestObj) => {
  const guest = Guest({
    ...guestObj,
    fri_rsvp: guestObj.rsvps[0],
    sat_rsvp: guestObj.rsvps[1],
    sun_rsvp: guestObj.rsvps[2],
    sent_savedate: guestObj.std,
  });
  await db.collection('guests').insertOne(guest);
  debug('guest created: ', guest);
});
const groupCreate = asyncHandler(async (groupArray) => {
  const group = Group({});
  await db.collection('groups').insertOne(group);
  debug('group created: ', group);
  await groupArray.forEach(async (guest) => {
    guestCreate({ ...guest, group: group._id });
  });
});

const createGuests = async (groupsArray) => {
  const promises = groupsArray.map(groupCreate);
  await Promise.all(promises);
  debug('finished creating');
};
// const createGuests = async (guestArray) => {
//   const promises = guestArray.map(guestCreate);
//   await Promise.all(promises);
// THIS WAS TO FETCH DOCS FROM DB AND USE OTHER ARRAY AS SORT KEY
//   const guestDocs = await db
//     .collection('guests')
//     .aggregate([
//       {
//         $addFields: {
//           __order: {
//             $indexOfArray: [
//               {
//                 $map: {
//                   input: guestArray,
//                   in: { $eq: ['$$this.name', '$name'] },
//                 },
//               },
//               true,
//             ],
//           },
//         },
//       },
//       { $sort: { __order: 1 } },
//       { $project: { __order: 0 } },
//     ])
//     .toArray();
//   // debug('guestDocs: ', guestDocs);
//   guestDocs.forEach((guest, index) => {
//     guests.push(Guest(guest));
//     guests[index].group = guestArray[index].group;
//   });
// };

// const createGroups = async (groupArray) => {
//   const promises = [];
//   for (let i = 0; i < groupArray.length; i++) {
//     promises.push();
//   }
// };

const guestGroups = [
  // {
  //   name: 'Cutler Sheridan',
  //   rsvps: [true, true, true],
  //   std: true,
  //   group: 0,
  // },
  // {
  //   name: 'Tyler Reeves',
  //   rsvps: [true, true, true],
  //   std: true,
  //   group: 0,
  // },
  [
    {
      name: 'Devon Zawko',
      rsvps: [],
      std: true,
    },
  ],
  [
    {
      name: 'Linda Ritter',
      rsvps: [],
      declined: true,
      family: 'tyler',
      std: true,
    },
    {
      name: 'Terry Ritter',
      rsvps: [],
      declined: true,
      family: 'tyler',
      std: true,
    },
  ],
  [
    {
      name: 'Lydia Fletcher',
      rsvps: [, true],
      std: true,
    },
    {
      name: 'Dave Gushie',
      rsvps: [],
      std: true,
    },
  ],
  [
    {
      name: 'Cari Hudson',
      rsvps: [],
      group: 3,
    },
    {
      name: 'Amir something',
      rsvps: [],
      group: 3,
    },
  ],
  [
    {
      name: 'Katie Wang',
      rsvps: [],
      std: true,
      group: 4,
    },
  ],
  [
    {
      name: 'Kenna Totty',
      rsvps: [true, true, true],
      std: true,
      group: 5,
    },
  ],
  [
    {
      name: 'Larry Sheridan',
      rsvps: [true, true, true],
      std: true,
      family: 'cutler',
    },
    {
      name: 'Debra Sheridan',
      rsvps: [true, true, true],
      std: true,
      family: 'cutler',
    },
  ],
  [
    {
      name: 'Shireen something',
      rsvps: [],
      next_round: true,
    },
  ],
];

export const deleteGuestsAndGroups = async () => {
  await Promise.all([
    db.collection('groups').deleteMany({}),
    db.collection('guests').deleteMany({}),
  ]);
  debug('Cleared!');
};

export default main;
