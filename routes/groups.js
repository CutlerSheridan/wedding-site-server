import { Router } from 'express';
const router = Router();
import asyncHandler from 'express-async-handler';
import { db, ObjectId } from '../configs/mongodb_config';
import Debug from 'debug';
import Group from '../models/Group';
import Guest from '../models/Guest';
const debug = Debug('route_groups');

/* GET users listing. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    if (req.query) {
      next();
    }

    const groupDocs = await db
      .collection('groups')
      .aggregate([
        {
          $lookup: {
            from: 'guests',
            localField: '_id',
            foreignField: 'group',
            as: 'guests_in_group',
          },
        },
      ])
      .sort({ 'guests_in_group.declined': 1, 'guests_in_group.family': 1 })
      .project({
        address: 1,
        'guests_in_group.name': 1,
        'guests_in_group.family': 1,
      })
      .toArray();
    debug(
      'guests_in_group: ',
      groupDocs.map((x) => x.guests_in_group)
    );
    const groups = groupDocs.map((x) => {
      const group = Group(x);
      group.guests_in_group = x.guests_in_group.map((guest) => Guest(guest));
      return group;
    });

    return res.json(groupDocs);
  })
);

router.get(
  '/:group_id',
  asyncHandler(async (req, res, next) => {
    const _id = new ObjectId(req.params.group_id);

    const groupDoc = await db
      .collection('groups')
      .aggregate([
        {
          $match: { _id },
        },
        {
          $lookup: {
            from: 'guests',
            localField: '_id',
            foreignField: 'group',
            as: 'guests_in_group',
          },
        },
      ])
      .sort({ 'guests_in_group.declined': 1, 'guests_in_group.family': 1 })
      .toArray();
    const group = Group(groupDoc[0]);
    group.guests_in_group = groupDoc[0].guests_in_group.map((guest) =>
      Guest(guest)
    );

    res.json(group);
  })
);

export default router;
