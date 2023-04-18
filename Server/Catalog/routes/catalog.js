var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/catalog', function(req, res, next) {
  res.render('catalog', { title: 'Express' });
});

module.exports = router;