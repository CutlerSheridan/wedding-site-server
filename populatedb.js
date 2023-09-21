import { db, productionDb, testingDb } from './configs/mongodb_config';
import Guest from './models/Guest';
import User from './models/User';
import Character from './models/Character';
import Debug from 'debug';
const debug = Debug('populatedb');
import asyncHandler from 'express-async-handler';

const main = async () => {
  await Promise.all([createGuests(guestGroups), createCharacters(characters)]);
};

const guestCreate = asyncHandler(async (guestObj) => {
  if (!guestObj.rsvps) {
    guestObj.rsvps = [];
  } else if (
    // testing if all RSVPs have been specified as false
    guestObj.rsvps.reduce((acc, cur) => {
      if (acc && cur === false) {
        return true;
      }
      return false;
    }, true)
  ) {
    guestObj.declined = true;
  }
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
  const groupId = randomizeId();
  const familyIndex = groupArray.findIndex((x) => x.hasOwnProperty('family'));
  const family = familyIndex === -1 ? false : groupArray[familyIndex].family;
  if (family) {
    groupArray = groupArray.map((x) => {
      return { ...x, family };
    });
  }
  await groupArray.forEach((guest) => {
    guestCreate({ ...guest, group: groupId });
  });
});
const characterCreate = asyncHandler(async (charObj) => {
  const character = Character(charObj);
  await db.collection('characters').insertOne(character);
});

const createGuests = async (groupsArray) => {
  const promises = groupsArray.map(groupCreate);
  await Promise.all(promises);
  debug('finished creating guests');
};
const createCharacters = async (charsArray) => {
  await Promise.all(charsArray.map((x) => characterCreate(x)));
  debug('finished creating characters');
};
const randomizeId = () => {
  let _charOptions = 'abcdefghijklmnopqrstuvwxyz';
  _charOptions += _charOptions.toUpperCase();
  _charOptions += '0123456789';
  let randomId = '';
  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(
      (Math.random() * 100 * _charOptions.length) / 100
    );
    randomId += _charOptions.charAt(randomIndex);
  }
  return randomId;
};

const guestGroups = [
  [
    {
      name: 'Devon Zawko',
      std: true,
    },
  ],
  [
    {
      name: 'Linda Ritter',
      declined: true,
      family: 'tyler',
      std: true,
    },
    {
      name: 'Terry Ritter',
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
      address: '1245 Horsey Drive\nRoswell, NM 50505',
    },
    {
      name: 'Dave Gushie',
      rsvps: [false, false, false],
      std: true,
      address: '999 Buckingham Palace\nLondon, England 1DZ-49C',
    },
  ],
  [
    {
      name: 'Cari Hudson',
      group: 3,
      address: '353 Hollywood & Vine\nLos Angeles, CA 90020',
    },
    {
      name: 'Amir something',
      group: 3,
      address: '1000 Fancy Street\nBeverly Hills, CA 90210',
    },
  ],
  [
    {
      name: 'Katie Wang',
      rsvps: [, true, false],
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
      address: '262 South Ave. SE\nMarietta, GA 30060',
    },
  ],
  [
    {
      name: 'Shireen Heiba',
      next_round: true,
    },
  ],
  [
    {
      name: 'Alan Reeves',
      family: 'tyler',
      address: '12 Grimmauld Place\nLondon, Islington, GB',
    },
    {
      name: 'Julie Reeves',
    },
    {
      name: 'Norah Reeves',
    },
    {
      name: 'Evangeline Reeves',
    },
  ],
  [
    {
      name: 'Andrew Saidman',
      next_round: true,
    },
    {
      name: 'SaraLynn Saidman',
      next_round: true,
    },
  ],
];
const characters = [
  {
    name: 'Molly Brown',
    survives: true,
    optional: false,
    role: 'New money oil baron',
  },
  {
    name: 'Thomas Andrew',
    survives: false,
    optional: false,
    role: 'Ship engineer',
  },
];

export const deleteGuestsAndCharacters = async (prodOrTestingDb) => {
  const targetDb = prodOrTestingDb === 'production' ? productionDb : testingDb;
  await Promise.all([
    targetDb.collection('guests').deleteMany({}),
    targetDb.collection('characters').deleteMany({}),
  ]);
  debug('Cleared!');
};

export const migrateDb = async (copyDirection) => {
  let fromDb, toDb;
  if (copyDirection === 'to-production') {
    fromDb = testingDb;
    toDb = productionDb;
  } else {
    fromDb = productionDb;
    toDb = testingDb;
  }
  const [guestDocs, characterDocs, userDocs] = await Promise.all([
    fromDb.collection('guests').find({}).toArray(),
    fromDb.collection('characters').find({}).toArray(),
    fromDb.collection('users').find({}).toArray(),
  ]);

  const guests = guestDocs.map((x) => Guest(x));
  const characters = characterDocs.map((x) => Character(x));
  const users = userDocs.map((x) => User(x));

  await Promise.all([
    toDb.collection('guests').insertMany(guests),
    toDb.collection('users').insertMany(users),
    toDb.collection('characters').insertMany(characters),
  ]);
};

export default main;
