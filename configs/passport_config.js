import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import {
  Strategy as JWTstrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';
import User from '../models/User';
import 'dotenv/config';
import userController from '../controllers/userController';
import { ObjectId } from './mongodb_config';
import Debug from 'debug';
const debug = Debug('passport_config');

passport.use(
  'signup',
  new localStrategy(async (username, password, done) => {
    try {
      const user = await userController.saveToDB(User({ username, password }));
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'User already exists' });
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  'login',
  new localStrategy(async (username, password, done) => {
    try {
      const user = await userController.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      if (await userController.isValidPassword(user, password)) {
        return done(null, user, { message: 'Logged in successfully' });
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      debug('token at start: ', token);
      try {
        const user = await userController.findOne({
          _id: new ObjectId(token._id),
        });
        debug('user after findOne: ', user);
        if (user) {
          const { password, ...userMinusPassword } = user;
          return done(null, userMinusPassword);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
    // this would always authorize if there is a valid token
    // async (token, done) => {
    //   try {
    //     return done(null, new ObjectId(token._id));
    //   } catch (err) {
    //     done(err);
    //   }
    // }
  )
);

export default passport;
