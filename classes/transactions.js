const moment = require('moment');
const ExpressError = require('../expressError');

class Transaction {
  constructor(payer, points, timestamp) {
    this.payer = payer;
    this.points = points;
    this.timestamp = timestamp;
  }

  create() {
    const idxOfPartner = partners.findIndex(partner => partner.payer === this.payer);

    partners[idxOfPartner].points += this.points;

    const transaction = {payer: this.payer, points: this.points, timestamp: this.timestamp};
    transactions.push(transaction);
    transactions.sort((a, b) => moment(a.timestamp) - moment(b.timestamp));
  }

  static getTotalBalance() {
    let points = partners.reduce((accum, next) => {
      return accum + next.points;
    }, 0);

    return points;
  }

  static spend(amount) {
    if (amount > this.getTotalBalance()) {
      throw new ExpressError(`You don't have enough points!`, 400);
    };
    
    let pointsLostByPayer = partners.map(partner => ({payer: partner.payer, points: 0}));
    let currPointsLost = 0;
    let transactionsArrCopy = transactions.slice();

    while (currPointsLost < amount) {
      let oldestTransaction = transactionsArrCopy.shift()
      let idx = pointsLostByPayer.findIndex(partner => partner.payer === oldestTransaction.payer);

      let points = -Math.min(oldestTransaction.points, amount - currPointsLost);
      pointsLostByPayer[idx].points += points;
      currPointsLost -= points;

      session.push({...oldestTransaction, points});
    };

    // update the points balance for all the partners
    for (let i = 0; i < partners.length; i++) {
      partners[i].points += pointsLostByPayer[i].points;
    }

    this.update();
    return pointsLostByPayer;
  }

  static update() {
    for (let i = 0; i < session.length; i++) {
      transactions[i].points += session[i].points;
    }

    transactions = transactions.filter(obj => {
      return obj.points !== 0;
    })

    session.length = 0;
  }
}

module.exports = Transaction;