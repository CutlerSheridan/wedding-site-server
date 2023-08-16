import { Router } from 'express';
const router = Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  return res.send('GET users');
});

export default router;
