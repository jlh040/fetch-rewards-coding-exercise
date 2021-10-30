const express = require('express');
const jsonschema = require('jsonschema');
const newTransactionSchema = require('./schemas/newTransaction.json');
const spendPointsSchema = require('./schemas/spendPoints.json');
const ExpressError = require('./expressError');
const Transaction = require('./classes/transactions');
const router = new express.Router();

// a fake database table to hold all the partners
global.partners = [
  {payer: 'DANNON', points: 0},
  {payer: 'UNILEVER', points: 0},
  {payer: 'MILLER COORS', points: 0}
];

// a fake database table to hold all of the transactions
global.transactions = [];

// holds all modified transactions
global.session = [];

/** POST /transactions  { payer, points, timestamp } => { payer, points, timestamp }
 *
 * Creates a new transaction.
 *
 * This returns the newly created transaction.
 *
 **/

router.post('/transactions', (req, res, next) => {
  try {
    // compare the request body with the specified JSON schema
    const validator = jsonschema.validate(req.body, newTransactionSchema);
    // if invalid, throw errors
    if (!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new ExpressError(errors, 400);
    }

    // make a new transaction and return that transaction
    const transaction = new Transaction(req.body.payer, req.body.points, req.body.timestamp);
    transaction.create();
    return res.status(201).json(transaction);
  } catch(err) {
    return next(err);
  }
});

/** GET /points  => { payer1Name: points, payer2Name: points, ... }
 *
 * Gets the current point balance for the payers
 *
 * This returns an object where the keys are the name of the payers 
 * and the values are the points
 *
 **/

router.get('/points', (req, res, next) => {
  try {
    let partnerObj = {};

    // fill up the partnerObj
    partners.forEach(partner => partnerObj[partner.payer] = partner.points);

    // respond with the partnerObj
    return res.json(partnerObj);
  } catch(err) {
    return next(err)
  }
});

/** POST /points  { points } => [{ payer1Name: deductedPoints }, { payer2Name: deductedPoints }, ...]
 *
 * Allows a user to spend their points.
 *
 * Returns an array containing each payer, and the amount of points that have been
 * deducted from their balance
 *
 **/

router.post('/points', (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, spendPointsSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new ExpressError(errors, 400);
    }

    // pass in the amount of points that the user is spending
    const resp = Transaction.spend(+req.body.points);

    // respond with an array containing the distribution of deducted points
    return res.json(resp);
  } catch(err) {
    return next(err);
  }
});

module.exports = router;