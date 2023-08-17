import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import {
  Strategy as JWTstrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';
import User from '../models/User';
import 'dotenv/config';
import userController from '../controllers/userController';

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
      const user = await userController.findOne({ username }, { username });
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
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
