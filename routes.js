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


router.get('/points', (req, res, next) => {
  return res.json(partners);
})



module.exports = router;