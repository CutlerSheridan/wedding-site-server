import { Router } from 'express';
const router = Router();
import populate, { deleteGuestsAndCharacters, migrateDb } from '../populatedb';
import asyncHandler from 'express-async-handler';
import Debug from 'debug';
const debug = Debug('populatedb_route');

router.post(
  '/populate-with-sample',
  asyncHandler(async (req, res) => {
    await populate();
    res.json('Done!\n');
  })
);
router.post(
  '/delete/:target_db', // 'production' or 'testing'
  asyncHandler(async (req, res) => {
    await deleteGuestsAndCharacters(req.params.target_db);
    res.json('Cleared!\n');
  })
);
router.post(
  '/migrate-db/:copy_direction', // 'to-production' or 'to-testing'
  asyncHandler(async (req, res) => {
    await migrateDb(req.params.copy_direction);
    res.json('DB successfully migrated');
  })
);

export default router;
