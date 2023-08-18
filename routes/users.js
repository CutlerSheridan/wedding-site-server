import { Router } from 'express';
const router = Router();
import asyncHandler from 'express-async-handler';

/* GET users listing. */
router.get('/', (req, res, next) => {
  return res.send('GET users');
});

export default router;
