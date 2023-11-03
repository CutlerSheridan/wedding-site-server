import { Router } from 'express';
const router = Router();
import asyncHandler from 'express-async-handler';

import groupController from '../controllers/groupController.js';

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.json(await groupController.find({}));
  })
);

router.get(
  '/search',
  asyncHandler(async (req, res, next) => {
    const name = req.query.name.replaceAll('_', ' ');
    const group = await groupController.findByName(name);
    res.json(group);
  })
);

router.get(
  '/:group_id',
  asyncHandler(async (req, res, next) => {
    res.json(await groupController.findOne(req.params.group_id));
  })
);

export default router;
