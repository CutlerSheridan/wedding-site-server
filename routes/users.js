import { Router } from 'express';
const router = Router();
import passport from '../configs/passport_config';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import 'dotenv/config';

/* GET users listing. */
router.get('/', (req, res, next) => {
  return res.send('GET users');
});

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user,
    });
  }
);
router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    passport.authenticate('login', async (err, userResponse, info) => {
      if (err || !userResponse) {
        const error = new Error(info.message);
        return next(error);
      }
      req.login(userResponse, { session: false }, async (error) => {
        if (error) return next(error);
        const tokenBody = {
          _id: userResponse._id,
          username: userResponse.username,
        };
        const token = jwt.sign(tokenBody, process.env.JWT_KEY);
        return res.json({ token });
      });
    })(req, res, next);
  })
);

export default router;
