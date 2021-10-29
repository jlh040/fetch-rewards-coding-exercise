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
  console.log(req.body)
  // const { payer, points, timestamp } = req.body;
  // return res.json({payer, points, timestamp});
});

router.get('/points', (req, res, next) => {
  return res.json(partners);
})



module.exports = router;