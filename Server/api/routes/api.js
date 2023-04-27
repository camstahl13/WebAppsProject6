const sha256 = require('../src/sha256');
const makeDB = require('../db/database');
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


//TEST URI -> /api/test
router.get('/test', function (req, res) {
  res.send("API working properly");
});

/* GET User Information if loged in */
router.get('/user', checkSession, async (req, res) => {
  console.log("GET API REQEST -> user - RESPONSE: " + req.session.username);
  res.status(200).send({ message: req.session.username });
});

//Logout URI -> /api/user/logout
router.post('/user/logout', (req, res) => {
  console.log("API REQEST -> " + req.params.username);
  req.session.destroy();
  res.render('api', { title: 'API working properly', loggedin: "Logged Out" })
});

// Endpoint for login -> /api/user/login
router.post('/user/login', async (req, res) => {
  console.log(req.body)
  const { uname, pass } = req.body;

  console.log(`API Login -> User: ${uname}, Password: ${pass}`);

  if (!uname || !pass) {
    return res.status(400).send({ message: "Missing Credentials" });
  }
  const db = makeDB();

  try {
    const hashedPassword = sha256.sha256(pass);
    const results = await db.query('SELECT * FROM ljc_user WHERE username = ? AND password = ?', [uname, hashedPassword]);

    //If the user is found in the database, set the session username to the username
    if (results.length > 0) {
      req.session.username = uname;
      return res.status(200).send({ username: uname });
    } else {
      return res.status(401).send({ message: "Invalid Username or Password" });
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
  //Clode database connection
  finally{
    db.close();
  }
});

// Define the SQL queries as constants
const getPlannedYearsQuery = `SELECT * FROM ljc_planned_years WHERE plan_id = ?;`;
const getPlannedCoursesQuery = `select pc.course_id, c.title, c.credits, year, term 
from ljc_planned_courses as pc inner join ljc_course as c on pc.course_id = c.course_id 
where plan_id = ?;`;


router.get('/plan/:plan_id', checkSession, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get plan with ID ${planId}, Username - ${username}`);

  const db = makeDB();
  try {
    // Get the planned years and courses from the database
    const years = await db.query(getPlannedYearsQuery, [planId]);
    const courses = await db.query(getPlannedCoursesQuery, [planId]);

    // Group the courses by year
    const plan = years.map(year => {
      const yearCourses = courses.filter(course => course.year === year.year);
      const terms = { FA: {}, SP: {}, SU: {} };
      yearCourses.forEach(course => {
        terms[course.term][course.course_id] = { title: course.title, credits: course.credits};
      });
      return { year: year.year, term: terms };
    });
    

    res.status(200).send(plan);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});


//get get Heading URI -> /api/heading

const getHeadingQuery = `
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
  const username = req.session.username;
  console.log(`API request: heading, Username - ${username}`);
  const db = makeDB();

  try {
    const result = await db.query(getHeadingQuery, [username]);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } finally {
    db.close();
  }
});


//Get Catalog URI -> /api/catalog
router.get('/Catalog', async (req, res) => {
  console.log("API REQEST -> heading, Username - " + req.session.username);

  try {
    res.status(418).send({ message: "METHOD NOT IMPLEMENTED" });
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get('/help', function(req, res){
  const fs = require('fs');

  // Read JSON data from file
  const jsonData = fs.readFileSync(require('path').resolve(__dirname,'../public/docs.json'));

  // Parse JSON data
  const calls = JSON.parse(jsonData);

  // Do something with the data
  res.render('api', { calls });
  fs.close();
});

module.exports = router;