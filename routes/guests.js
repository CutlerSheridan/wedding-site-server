import { Router } from 'express';
const router = Router();
import Debug from 'debug';
const debug = Debug('route_guests');
import asyncHandler from 'express-async-handler';
const { query } = require('express-validator');

import { db, ObjectId } from '../configs/mongodb_config';
import Guest from '../models/Guest';
import guestController from '../controllers/guestController';

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    debug('req.user: ', req.user);
    const guests = await guestController.find({});
    debug('returned guests: ', guests);
    res.json({
      message: 'You made it to the secure route to see the guests',
      user: req.user,
      guests,
    });
  })
);
router.get('/count', [
  query('*').if(query('*').isBoolean()).toBoolean(),
  asyncHandler(async (req, res) => {
    const { include_grooms: includeGrooms = true, ...countFields } = req.query;
    if (!countFields.declined) {
      countFields.declined = false;
    }
    debug('includeGrooms: ', includeGrooms, 'countFields: ', countFields);
    const groomCount = includeGrooms ? 2 : 0;
    res.json(
      groomCount +
        (await db.collection('guests').countDocuments(countFields ?? {}))
    );
  }),
]);
router.get(
  '/:guest_id',
  asyncHandler(async (req, res, next) => {
    res.json(await guestController.findOne({ _id: req.params.guest_id }));
  })
);
router.put(
  '/:guest_id',
  asyncHandler(async (req, res, next) => {
    const _id = new ObjectId(req.params.guest_id);

    const currentGuestDoc = await db.collection('guests').findOne({ _id });
    const updatedGuest = Guest({ ...currentGuestDoc, ...req.body });
    if (
      updatedGuest.fri_rsvp === false &&
      updatedGuest.sat_rsvp === false &&
      updatedGuest.sun_rsvp === false
    ) {
      updatedGuest.declined = true;
    } else {
      updatedGuest.declined = false;
    }
    await db.collection('guests').updateOne({ _id }, { $set: updatedGuest });

    return res.status(currentGuestDoc ? 200 : 203).json(updatedGuest);
  })
);

router.get(
  '/family/:whose_family',
  asyncHandler(async (req, res) => {
    const { whose_family: family } = req.params;
    res.json(
      await db
        .collection('guests')
        .find({ family, declined: false })
        .sort({ group: 1 })
        .toArray()
    );
  })
);

export default router;
