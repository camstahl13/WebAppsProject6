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


//get plans

const getPlans = `select plan_id, planname, catalog_year, default_ as "default" from ljc_plan where username=?;`

router.get('/plans', checkSession, async (req, res) => {
  console.log("API request: Get plans");

  const db = makeDB();
  try {
    // Get the planned years and courses from the database
    const plans = await db.query(getPlans, [req.session.username]);
    res.status(200).send(plans);
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

router.get('/requirements', async (req, res) => {
  console.log("API REQUEST -> heading, username - " + req.session.username);

  try{
    res.status(400).send({"categories":{"Core":{"courses":["CS-1210","CS-1220","CS-2210","CS-3210","CS-3220","CS-3310","CS-3410","CS-3510","CS-3610","CS-4810","CS-4820","CY-1000","CY-3420","EGCP-1010","EGCP-3210","EGCP-4310","EGGN-3110","EGGN-4010","MATH-2520"]},"Electives":{"courses":["CY-3320","CY-4310","CY-4330","CS-4430","CS-4710","CS-4730","EGCP-3010","EGCP-4210","MATH-3610"]},"Cognates":{"courses":["CHEM-1050","MATH-1710","MATH-1720","PHYS-2110","PHYS-2120"]},"GenEds":{"courses":["BTGE-1725","BTGE-2730","BTGE-2740","BTGE-3755","BTGE-3765"]}}});
  }
  catch(err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;