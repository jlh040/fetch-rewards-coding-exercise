const express = require('express');
const app = require('./server');
const router = new express.Router();

app.get('/dog', (req, res, next) => {
  return res.json({
    'name': 'WOOFY'
  });
})



module.exports = router;