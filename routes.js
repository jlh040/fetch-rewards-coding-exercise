const express = require('express');
const moment = require('moment');
const ExpressError = require('./expressError');
const router = new express.Router();

// fake partners table
const partners = [
  {payer: 'DANNON', points: 0},
  {payer: 'UNILEVER', points: 0},
  {payer: 'MILLER COORS', points: 0}
];

// fake transactions table
const transactions = [];

router.post('/transaction', (req, res, next) => {
  try {
    const timestamp = moment.utc(req.body.timestamp).format();

    if (timestamp === 'Invalid date') {
      throw new ExpressError('Please enter a valid date', 400);
    }

    const { payer, points } = req.body;
    transactions.push({payer, points, timestamp});
    transactions.sort((a, b) => moment(a.timestamp) - moment(b.timestamp));

    return res.status(201).json(transactions);
  } catch(err) {
    return next(err);
  }
});

router.get('/points', (req, res, next) => {
  try {
    return res.json(partners);
  } catch(err) {
    return next(err)
  }
})



module.exports = router;