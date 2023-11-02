import { Router } from 'express';
const router = Router();
import asyncHandler from 'express-async-handler';
import passport from '../configs/passport_config';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import userController from '../controllers/userController';
import 'dotenv/config';
import Debug from 'debug';
const debug = Debug('auth');

router.post('/signup', [
  body('username')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .custom(async (value) => {
      const existingUser = await userController.findOne({ username: value });
      if (existingUser) {
        throw new Error('Username is taken');
      }
    })
    .bail()
    .isAlphanumeric()
    .withMessage('Username may only contain letters and numbers'),
  body('password')
    .trim()
    .blacklist(/[<>]/)
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least 1 uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least 1 lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least 1 number')
    .matches(/[!@#$%^&*(){}[\].?-_+=`]/)
    .withMessage(
      'Password must contain 1 of the following: ! @ # $ % ^ & * ( ) { } [ ] . ? - _ + = `'
    ),
  body('confirmed_password', 'Passwords must match')
    .trim()
    .if((value, { req }) => req.body.password)
    .custom((value, { req }) => req.body.password === value),
  body('secret')
    .trim()
    .exists()
    .withMessage('Must include the secret passphrase')
    .custom((value) => value === process.env.SIGNUP_KEY)
    .withMessage('Secret passphrase is incorrect'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      passport.authenticate('signup', async (err, userResponse, info) => {
        if (err || !userResponse) {
          const error = new Error(info.message);
          error.status = 404;
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
    } else {
      res.json(errors.array());
    }
  }),
]);
router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    passport.authenticate('login', async (err, userResponse, info) => {
      if (err || !userResponse) {
        const error = new Error(info.message);
        error.status = 404;
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
