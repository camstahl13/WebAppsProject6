var express = require('express');
var router = express.Router();

var db = require('../db/database')

/* GET home page. */
router.get('/', function(req, res, next) {
  
  db.query("SELECT * from ljc_user", function(err, result){
    if(err) throw err;
    console.log(result);
  });
  res.send("API is working properly")

});

module.exports = router;