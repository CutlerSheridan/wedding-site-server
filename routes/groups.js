import { Router } from 'express';
const router = Router();
import asyncHandler from 'express-async-handler';
import Debug from 'debug';
const debug = Debug('route_groups');

import groupController from '../controllers/groupController';

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.json(await groupController.find({}));
  })
);

router.get(
  '/:group_id',
  asyncHandler(async (req, res, next) => {
    res.json(await groupController.findOne(req.params.group_id));
  })
);

// router.get('/search', asyncHandler(async (req, res, next) => {
//   const name = req.query.name.replaceAll('_', ' ');
//   const group_id = await db.collection('guests').findOne({name})
// }))

export default router;
