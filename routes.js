const express = require('express');
const jsonschema = require('jsonschema');
const newTransactionSchema = require('./schemas/newTransaction.json');
const ExpressError = require('./expressError');
const Transaction = require('./classes/transactions');
const router = new express.Router();

// fake partners database table
global.partners = [
  {payer: 'DANNON', points: 0},
  {payer: 'UNILEVER', points: 0},
  {payer: 'MILLER COORS', points: 0}
];

// fake transactions database table
global.transactions = [];

router.post('/transactions', (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, newTransactionSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new ExpressError(errors, 400);
    }

    const transaction = new Transaction(req.body.payer, req.body.points, req.body.timestamp);
    transaction.create();
    return res.status(201).json(transaction);
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

router.post('/points', (req, res, next) => {
  try {
    let resp = Transaction.spend(+req.body.points);
    return res.json(resp);
  } catch(err) {
    return next(err);
  }
});



module.exports = router;