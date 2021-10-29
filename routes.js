const express = require('express');
const router = new express.Router();

const partners = [
  {payer: 'DANNON', points: 0},
  {payer: 'UNILEVER', points: 0},
  {payer: 'MILLER COORS', points: 0}
];

router.get('/points', (req, res, next) => {
  return res.json(partners);
})



module.exports = router;