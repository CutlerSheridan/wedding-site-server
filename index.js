import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import createError from 'http-errors';

import routes from './routes';
import passport from './configs/passport_config';
import './configs/passport_config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', routes.auth);
app.use('/api/populatedb', routes.populatedb);
// secure all routes below here
// app.use(passport.authenticate('jwt', { session: false }));
app.use('/api/guests', routes.guests);
app.use('/api/groups', routes.groups);
app.use('/api/users', routes.users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(`error ${err.status}: ${err.message}`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
