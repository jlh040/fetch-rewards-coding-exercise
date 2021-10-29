const express = require('express');
const router = new express.Router();

router.get('/dog', (req, res, next) => {
  return res.json({
    'name': 'WOOFY'
  });
})



module.exports = router;