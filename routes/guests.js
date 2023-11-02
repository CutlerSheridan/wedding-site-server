import { Router } from 'express';
const router = Router();
import Debug from 'debug';
const debug = Debug('route_guests');
import asyncHandler from 'express-async-handler';
const { body, query } = require('express-validator');
import passport from '../configs/passport_config';

import { db, ObjectId } from '../configs/mongodb_config';
import Guest from '../models/Guest';
import guestController from '../controllers/guestController';

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res, next) => {
    const guests = await guestController.find({});
    res.json({
      message: 'You made it to the secure route to see the guests',
      user: req.user,
      guests,
    });
  })
);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res, next) => {
    const guests = req.body.map((x) => Guest(x));
    await db.collection('guests').insertMany(guests);
    res.json({
      message: 'All new guests added!',
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
    const upddatingRsvps =
      req.body.hasOwnProperty('fri_rsvp') ||
      req.body.hasOwnProperty('sat_rsvp') ||
      req.body.hasOwnProperty('sun_rsvp');
    if (
      upddatingRsvps &&
      updatedGuest.fri_rsvp === false &&
      updatedGuest.sat_rsvp === false &&
      updatedGuest.sun_rsvp === false
    ) {
      updatedGuest.declined = true;
    } else if (
      upddatingRsvps &&
      !(
        req.body?.fri_rsvp === false ||
        req.body?.sat_rsvp === false ||
        req.body?.sun_rsvp === false
      )
    ) {
      updatedGuest.declined = false;
    }
    await db.collection('guests').updateOne({ _id }, { $set: updatedGuest });
    return res.status(currentGuestDoc ? 200 : 203).json(updatedGuest);
  })
);
router.delete(
  '/:guest_id',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res, next) => {
    const _id = new ObjectId(req.params.guest_id);
    await db.collection('guests').deleteOne({ _id });
    return res.json();
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
