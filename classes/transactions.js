const moment = require('moment');
const ExpressError = require('../expressError');

class Transaction {
  constructor(payer, points, timestamp) {
    this.payer = payer;
    this.points = points;
    this.timestamp = timestamp;
  }

  
  // creates a new transaction; return value is undefined
  create() {
    // find the index of the partner object corresponding with the payer of the transaction
    const idxOfPartner = partners.findIndex(partner => partner.payer === this.payer);

    // update the balance of that partner
    partners[idxOfPartner].points += this.points;

    // push a new transaction into the global transactions array and sort this array as well
    const transaction = {payer: this.payer, points: this.points, timestamp: this.timestamp};
    transactions.push(transaction);
    transactions.sort((a, b) => moment(a.timestamp) - moment(b.timestamp));
  }

  // get the total balance for all partners
  static getTotalBalance() {
    let points = partners.reduce((accum, next) => {
      return accum + next.points;
    }, 0);

    return points;
  }

  // allows a user to spend points
  static spend(amount) {
    // if a user tries to overspend, throw an error
    if (amount > this.getTotalBalance()) {
      throw new ExpressError(`You don't have enough points!`, 400);
    };
    
    // an array of objects representing the points lost by each payer
    let pointsLostByPayer = partners.map(partner => ({payer: partner.payer, points: 0}));

    // running sum of the total current points lost
    let currPointsLost = 0;

    let transactionsArrCopy = transactions.slice();

    // while currPointsLost is less than the amount the user is trying to spend, keep adding to currPointsLost
    while (currPointsLost < amount) {
      // grab the oldest transaction
      let oldestTransaction = transactionsArrCopy.shift()
      // find the index of the object in pointsLostByPayer, which has the same payer as the oldestTransaction
      let idx = pointsLostByPayer.findIndex(partner => partner.payer === oldestTransaction.payer);

      // put the points that we will deduct from the payer into a variable
      // use Math.min to make sure we don't grab all the points from the transaction if it isn't necessary
      let points = -Math.min(oldestTransaction.points, amount - currPointsLost);

      // subtract the transaction's points from the appropriate pointsLostByPayer object
      pointsLostByPayer[idx].points += points;

      // add the deducted points to the running sum currPointsLost variable
      currPointsLost -= points;

      // push the oldest transaction into the session, but change the points to the amount of points that were deducted
      // from that transaction
      session.push({...oldestTransaction, points});
    };

    // update the point balances for all the partners
    for (let i = 0; i < partners.length; i++) {
      partners[i].points += pointsLostByPayer[i].points;
    }

    // update the global transactions array so that we can spend multiple times
    this.update();

    return pointsLostByPayer;
  }

  // update the global transactions array and get rid of transactions that we updated to have 0 points
  static update() {
    // update the global transactions array using the transactions that were modified
    for (let i = 0; i < session.length; i++) {
      transactions[i].points += session[i].points;
    }

    // get rid of any transactions that now have 0 points so that we get different 'oldest transactions'
    transactions = transactions.filter(obj => {
      return obj.points !== 0;
    })

    // clear out the session array so that when a user spends again, we don't have old modified transactions in there
    session.length = 0;
  }
}

module.exports = Transaction;