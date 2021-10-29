const express = require('express');
const morgan = require('morgan');
const ExpressError = require('./expressError');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  const notFoundError = new ExpressError('Not found', 404);
  return next(notFoundError);
})

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