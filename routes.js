const express = require('express');
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
  const { payer, points, timestamp } = req.body;
  transactions.push({payer, points, timestamp});
  return res.status(201).json(transactions);
});

router.get('/points', (req, res, next) => {
  try {
    return res.json(partners);
  } catch(err) {
    return next(err)
  }
})



module.exports = router;