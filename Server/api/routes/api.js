const sha256 = require('../src/sha256');
const Unothorized_Message = { message: "Unauthorized", error: { status: 403, stack: "" } };

var express = require('express');
var router = express.Router();


var db = require('../db/database')

/* GET home page. */
router.get('/user', function (req, res, next) {
  console.log("GET API REQEST -> user - RESPONSE: " + req.session.username);

  if (req.session.username) 
    res.status(200).send({ message: req.session.username});
  else
    res.status(403).send(Unothorized_Message);

});

//Logout URI -> /api/user/logout
router.post('/user/logout', (req, res) => {
  console.log("API REQEST -> " + req.params.username);
  req.session.destroy();
  res.render('api', { title: 'API working properly', loggedin: "Logged Out" })
});

//Login URI -> /api/user/login
router.post('/user/login', (req, res) => {
  const { uname, pass } = req.body;
  console.log("API Login -> User:" + uname + ", Password:" + pass);

  if (uname && pass) {
    db.query('SELECT * FROM ljc_user WHERE username = ? AND password = ?', [uname, sha256.sha256(pass)], (error, results, fields) => {
      if (error) throw error;

      if (results.length > 0) {
        console.log(req.session);
        req.session.username = uname;
        res.status(200).send({ message: "Login Successful", username: uname });
      } else {
        res.status(403).send({ message: "Login Unsuccessful"});
      }
      res.end();
    });
  }

});

//TEST URI -> /api/test
router.get('/test', function (req, res, next) {
  res.send("API working properly");
});

//get get plans URI -> /api/plan
router.get('/plan', function (req, res, next) {
  console.log("API REQEST -> plan, Username - " + req.session.username);
  console.log(req.session);
  if (req.session.username) {
    db.query("SELECT * FROM ljc_plan where username= ?", [req.session.username], function (err, result, fields) {
      if (err) throw err;

      res.status(200).send(result);
    });
  }
  else {
    res.status(403).send(Unothorized_Message);
  }
});

module.exports = router;