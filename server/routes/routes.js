const router = require('express').Router();
const passport = require('passport');

const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const tasksRouter = require('./tasks.router');

// If you want check user auth uncoment
const passportCheck = passport.authenticate('jwt', {
  session: false
});

router
  .use('/auth', authRouter)
  .use('/user', userRouter)
  .use('/tasks', passportCheck, tasksRouter);

module.exports = router;
