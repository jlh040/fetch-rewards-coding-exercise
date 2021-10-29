const express = require('express');
const Transaction = require('./classes/transactions');
const router = new express.Router();

// fake partners table
global.partners = [
  {payer: 'DANNON', points: 0},
  {payer: 'UNILEVER', points: 0},
  {payer: 'MILLER COORS', points: 0}
];

// fake transactions table
global.transactions = [];

router.post('/transaction', (req, res, next) => {
  try {
    let transaction = new Transaction(req.body.payer, req.body.points, req.body.timestamp);
    transaction.create();
    return res.status(201).json({transactions, partners});
  } catch(err) {
    return next(err);
  }
});

router.get('/points', (req, res, next) => {
  try {
    let partnerObj = {};
    partners.forEach(partner => partnerObj[partner.payer] = partner.points);

    return res.json(partnerObj);
  } catch(err) {
    return next(err)
  }
});



module.exports = router;