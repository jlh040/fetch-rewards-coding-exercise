const express = require('express');
const morgan = require('morgan');
const router = require('./routes');
const ExpressError = require('./expressError');

const app = express();

// only use the 'morgan' logging middleware if we are not in a test environment
process.env.NODE_ENV === 'test' ? null : app.use(morgan('dev'));

// parse the incoming request body for JSON and use external routes
app.use(express.json());
app.use(router);

// 404 error handler
app.use((req, res, next) => {
  const notFoundError = new ExpressError('Not found', 404);
  return next(notFoundError);
})

// global error handler
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: {
      message,
      status
    }
  });
});

module.exports = app;