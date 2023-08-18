import { Router } from 'express';
const router = Router();
import Debug from 'debug';
const debug = Debug('route_guests');

router.get('/', (req, res, next) => {
  debug('req.user: ', req.user);
  res.json({
    message: 'You made it to the secure route to see the guests',
    user: req.user,
  });
});

export default router;
