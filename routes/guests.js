import { Router } from 'express';
const router = Router();
import Debug from 'debug';
const debug = Debug('route_guests');
import asyncHandler from 'express-async-handler';
import { db, ObjectId } from '../configs/mongodb_config';
import Guest from '../models/Guest';

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    debug('req.user: ', req.user);
    const guestDocs = await db
      .collection('guests')
      .find({})
      .sort({ declined: 1, family: 1, group: 1 })
      .toArray();
    const guests = guestDocs.map((x) => Guest(x));
    debug('returned guests: ', guests);
    res.json({
      message: 'You made it to the secure route to see the guests',
      user: req.user,
      guests,
    });
  })
);
router.get(
  '/:guest_id',
  asyncHandler(async (req, res, next) => {
    res.json(
      await db
        .collection('guests')
        .findOne({ _id: new ObjectId(req.params.guest_id) })
    );
  })
);
router.put(
  '/:guest_id',
  asyncHandler(async (req, res, next) => {
    const _id = new ObjectId(req.params.guest_id);
    const currentGuestDoc = await db.collection('guests').findOne({ _id });
    const updatedGuest = Guest({ ...currentGuestDoc, ...req.body });
    await db.collection('guests').updateOne({ _id }, { $set: updatedGuest });
    debug("devon's data: ", updatedGuest);
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
        .find({ family: family.toLowerCase(), declined: false })
        .sort({ group: 1 })
        .toArray()
    );
  })
);
router.get(
  '/count/all',
  asyncHandler(async (req, res) => {
    // add 2 for Tyler and Cutler
    res.json(
      2 + (await db.collection('guests').countDocuments({ declined: false }))
    );
  })
);
router.get(
  '/count/friday',
  asyncHandler(async (req, res) => {
    // add 2 for Tyler and Cutler
    res.json(
      2 +
        (await db
          .collection('guests')
          .countDocuments({ declined: false, fri_rsvp: true }))
    );
  })
);
router.get(
  '/count/saturday',
  asyncHandler(async (req, res) => {
    // add 2 for Tyler and Cutler
    res.json(
      2 +
        (await db
          .collection('guests')
          .countDocuments({ declined: false, sat_rsvp: true }))
    );
  })
);
router.get(
  '/count/sunday',
  asyncHandler(async (req, res) => {
    // add 2 for Tyler and Cutler
    res.json(
      2 +
        (await db
          .collection('guests')
          .countDocuments({ declined: false, sun_rsvp: true }))
    );
  })
);

export default router;
