const sha256 = require('../src/sha256');
var express = require('express');
var router = express.Router();

const unauthorizedMessage = {
  message: "Unauthorized",
  error: {
    status: 403
  }
};

// Middleware to check session
const checkSession = (req, res, next) => {
  if (!req.session.username) {
    return res.status(403).send(unauthorizedMessage);
  }
  next();
};


var db = require('../db/database')

/* GET User Information if loged in */
router.get('/user', checkSession, async (req, res) => {
  console.log("GET API REQEST -> user - RESPONSE: " + req.session.username);

  if (req.session.username)
    res.status(200).send({ message: req.session.username });
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
    db.query('SELECT * FROM ljc_user WHERE username = ? AND password = ?', [uname, sha256.sha256(pass)], (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        console.log(req.session);
        req.session.username = uname;
        res.status(200).send({ message: "Login Successful", username: uname });
      } else {
        res.status(401).send({ message: "Login Unsuccessful" });
      }
      res.end();
    });
  }

});

//TEST URI -> /api/test
router.get('/test', function (req, res) {
  res.send("API working properly");
});

//get get plans URI -> /api/plannedCourses

const getPlannedCQuary = `select * from ljc_planned_courses where plan_id= ?;`;

router.get('/plannedCourses/:plan_id', checkSession, async (req, res) => {
  console.log("API REQEST -> plan, Username - " + req.session.username);
  try{
    db.query(getPlannedCQuary, [req.params.plan_id], function (err, result) {
      if (err) { res.status(500); console.log(err); return; }

      res.status(200).send(result);
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//get get Heading URI -> /api/heading

const getHeadingQuary = `
SELECT
  p.plan_id, username, catalog_year, major, minor
from
    ljc_plan as p
    join ljc_planned_majors as pm on p.plan_id = pm.plan_id
    join ljc_major as major on major.major_id = pm.major_id
    join ljc_planned_minors as pmin on p.plan_id = pmin.plan_id
    join ljc_minor as minor on minor.minor_id = pmin.minor_id
where
  username = ? and minor != 'Gen Eds';`;

router.get('/heading', checkSession, async (req, res) => {
  console.log("API REQEST -> heading, Username - " + req.session.username);
  
  try{
    db.query(getHeadingQuary, [req.session.username], (err, result) => {
      if (err) { res.status(500); console.log(err); return; }

      res.status(200).send(result);
    });
  }
  catch(err) {
    console.error(err);
    res.status(500).send(err);
  }

});

//Get Catalog URI -> /api/catalog
router.get('/Catalog', async (req, res) => {
  console.log("API REQEST -> heading, Username - " + req.session.username);

  try{
    res.status(418).send({ message: "METHOD NOT IMPLEMENTED" });
  }
  catch(err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;