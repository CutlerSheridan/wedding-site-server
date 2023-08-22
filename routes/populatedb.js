import { Router } from 'express';
const router = Router();
import populate, { deleteGuestsAndGroups } from '../populatedb';
import asyncHandler from 'express-async-handler';
import Debug from 'debug';
const debug = Debug('populatedb_route');

router.post(
  '/',
  asyncHandler(async (req, res) => {
    await populate();
    res.json('Done!\n');
  })
);
router.post(
  '/del',
  asyncHandler(async (req, res) => {
    await deleteGuestsAndGroups();
    res.json('Cleared!\n');
  })
);

export default router;
