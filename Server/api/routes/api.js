const sha256 = require('../src/sha256');
const makeDB = require('../db/database');
var express = require('express');
const { mainModule } = require('process');
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

router.use(express.json());


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
const getDefaultPlanQuery = `SELECT plan_id FROM ljc_plan WHERE username = ? && default_ = 1;`;

router.get('/default/:student'/*, checkSession*/, async(req, res) => {
  const username = req.session.username;
  const student = req.params.student;
  console.log(`API request: Get default plan for ${student}, Username - ${username}`);

  const db = makeDB();

  try {
    let default_plans = await db.query(getDefaultPlanQuery, [student]);
    if (default_plans.length < 1) {
      res.status(200).send({default_plan: null});
    } else {
      res.status(200).send({default_plan: default_plans[0].plan_id});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const delPlannedYearsQuery = `DELETE FROM ljc_planned_years WHERE plan_id = ?;`;
const delPlannedCoursesQuery = `DELETE from ljc_planned_courses WHERE plan_id = ?;`;

const insPlannedYearQuery = `INSERT INTO ljc_planned_years(plan_id, year) VALUES(?, ?);`
const insPlannedCourseQuery = `INSERT INTO ljc_planned_courses(plan_id, course_id, year, term) VALUES(?, ?, ?, ?);`

router.post('/schedule/:plan_id'/*, checkSession*/, async(req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Set schedule for plan with ID ${planId}, Username - ${username}`);

  const db = makeDB();

  try {
    await db.query(delPlannedYearsQuery, [planId]);
    await db.query(delPlannedCoursesQuery, [planId]);
    const schedule = req.body.schedule;

    for (const planned_year of schedule) {
      await db.query(insPlannedYearQuery, [planId, planned_year.year]);
      for (const planned_semester of planned_year.semesters) {
        for (const planned_course of planned_semester.courses) {
          await db.query(insPlannedCourseQuery, [planId, planned_course, planned_year.year, planned_semester.semester]);
        }
      }
    }
    res.status(200).send({message: "success"});
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const getPlannedYearsQuery = `SELECT * FROM ljc_planned_years WHERE plan_id = ?;`;
const getPlannedCoursesQuery = `SELECT course_id FROM ljc_planned_courses WHERE plan_id = ? && year = ? && term = ?;`;

router.get('/schedule/:plan_id'/*, checkSession*/, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get schedule for plan with ID ${planId}, Username - ${username}`);

  const db = makeDB();
  try {
    // Get the planned years and courses from the database
    const planned_years = await db.query(getPlannedYearsQuery, [planId]);

    let sched = planned_years.map(planned_year => {
      return {
        year: planned_year.year,
        semesters: []
      };
    });
    console.log(sched);

    for (let planned_year of sched) {
      for (let term of ["FA", "SP", "SU"]) {
        const courses = await db.query(getPlannedCoursesQuery, [planId, planned_year.year, term]);

        let semester = { semester: term, courses: [] };

        for (let course of courses) {
          semester.courses.push(course.course_id);
        }

        planned_year.semesters.push(semester);
      }
    }
    
    res.status(200).send({schedule: sched});
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const getCatalogYearQuery = `SELECT catalog_year FROM ljc_plan WHERE plan_id = ?;`;
const getCatalogCoursesQuery = `SELECT course.course_id, course.title, course.description, course.credits
                                FROM ljc_course as course
                                  JOIN ljc_catalog as cata ON course.course_id = cata.course_id
                                WHERE cata.catalog_year = ?;`;

router.get('/catalog/:plan_id'/*, checkSession*/, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get catalog for plan with ID ${planId}, Username - ${username}`);

  const db = makeDB();
  try {
    let catalog_year_obj = await db.query(getCatalogYearQuery, [planId]);
    console.log(catalog_year_obj);
    let catalog_year = catalog_year_obj[0].catalog_year;
    console.log(catalog_year);

    let catalog_courses = await db.query(getCatalogCoursesQuery, [catalog_year]);

    let catalog = {
      year: catalog_year,
      courses: {}
    }
    console.log(catalog_courses);
    for (let course of catalog_courses) {
      catalog.courses[course.course_id] = {
        id: course.course_id,
        name: course.title,
        description: course.description,
        credits: course.credits
      };
    }

    res.status(200).send({catalog: catalog});
  } catch(error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const getPlanInfo = `SELECT username, catalog_year FROM ljc_plan WHERE plan_id = ?;`;
const getPlanMajors = `SELECT major.major as major_name
                        FROM ljc_plan AS plan
                          JOIN ljc_planned_majors AS planned_major ON plan.plan_id = planned_major.plan_id
                          JOIN ljc_major AS major ON planned_major.major_id = major.major_id
                        WHERE plan.plan_id = ?;`;
const getPlanMinors = `SELECT minor.minor as minor_name
                        FROM ljc_plan AS plan
                          JOIN ljc_planned_minors AS planned_minor ON plan.plan_id = planned_minor.plan_id
                          JOIN ljc_minor AS minor ON planned_minor.minor_id = minor.minor_id
                        WHERE plan.plan_id = ? && minor.minor_id != 5;`;

router.get('/info/:plan_id'/*, checkSession*/, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get general info for plan with ID ${planId}, Username - ${username}`);

  const db = makeDB();
  try {
    let info = {
      student: null,
      catalog_year: null,
      majors: [],
      minors: []
    };

    const plan_info = await db.query(getPlanInfo, [planId]);
    info.student = plan_info[0].username;
    info.catalog_year = plan_info[0].catalog_year;

    const plan_majors = await db.query(getPlanMajors, [planId]);
    for (let major of plan_majors) {
      info.majors.push(major.major_name);
    }

    const plan_minors = await db.query(getPlanMinors, [planId]);
    for (let minor of plan_minors) {
      info.minors.push(minor.minor_name);
    }

    res.status(200).send(info);
  } catch(error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});



const getRequiredMajorCourses = `SELECT major.major AS maj, major_requirement.category AS cat, major_requirement.course_id AS course 
                                  FROM ljc_plan AS plan
                                    JOIN ljc_planned_majors AS planned_major ON plan.plan_id = planned_major.plan_id
                                    JOIN ljc_major AS major ON planned_major.major_id = major.major_id
                                    JOIN ljc_major_requirements AS major_requirement ON planned_major.major_id = major_requirement.major_id
                                  WHERE plan.plan_id = ?;`;

const getRequiredMinorCourses = `SELECT minor.minor AS min, minor_requirement.course_id AS course 
                                  FROM ljc_plan AS plan
                                    JOIN ljc_planned_minors AS planned_minor ON plan.plan_id = planned_minor.plan_id
                                    JOIN ljc_minor AS minor ON planned_minor.minor_id = minor.minor_id
                                    JOIN ljc_minor_requirements AS minor_requirement ON planned_minor.minor_id = minor_requirement.minor_id
                                  WHERE plan.plan_id = ?;`;

router.get('/requirements/:plan_id'/*, checkSession*/, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get catalog for plan with ID ${planId}, Username - ${username}`);

  const db = makeDB();
  try {
    let reqs = {};

    const requiredMajorCourses = await db.query(getRequiredMajorCourses, [planId]);
    const requiredMinorCourses = await db.query(getRequiredMinorCourses, [planId]);

    for (let requiredMajorCourse of requiredMajorCourses) {
      let category = requiredMajorCourse.maj + " " + requiredMajorCourse.cat;
      if (!reqs[category]) {
        reqs[category] = [];
      }
      reqs[category].push(requiredMajorCourse.course);
    }

    for (let requiredMinorCourse of requiredMinorCourses) {
      let category = requiredMinorCourse.min + (requiredMinorCourse.min == "Gen Eds" ? "" : " Minor");
      if (!reqs[category]) {
        reqs[category] = [];
      }
      reqs[category].push(requiredMinorCourse.course);
    }

    res.status(200).send({requirements: reqs});
  } catch(error) {
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
//LUKE EDITED THIS FUNCTION TO DO STUFF
router.get('/Catalog', async (req, res) => {
  console.log("Getting catalog...");
  const db = makeDB();
  const catalog = await db.query("select * from ljc_course");
  res.status(200).send({ catalog });
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

//ADDED BY LUKE
router.post('/createplan', async (req,res) => {
  //ADD CHECK SESSION!!! (and remove semjaza)
  const db = makeDB();
  const semjaza = "semjaza";
  let {name, createMajor, createMinor, catayear} = req.body;

  //name conflict check
  const query = "select plan_id from ljc_plan where username=? and planname=?";
  let namechk = await db.query(query, [req.session.username?req.session.username : semjaza, name]);
  while (namechk.length > 0) {
    name = "_" + name;
    namechk = await db.query(query, [req.session.username?req.session.username : semjaza, name]);
  }

  //create plan, get relevant data chunks for the insertions in related tables
  console.log(`insert into ljc_plan values(NULL,${name},${req.session.username? req.session.username : "session invalid..."},${catayear},0`);
  
  const planid = await db.query(query, [req.session.username?req.session.username : semjaza, name]);
  const majorid = await db.query("select major_id from ljc_major where major = ?", createMajor);
  const minorid = await db.query("select minor_id from ljc_minor where minor = ?", createMinor);

  //insert into the related tables: planned_majors and planned_minors
  console.log(`insert into ljc_planned_majors values(${planid},${majorid[0].major_id})`);
  console.log(`insert into ljc_planned_minors values(${planid},${minorid[0].minor_id})`);
  for (let yr = catayear; yr < parseInt(catayear) + 4; ++yr) {
    console.log(`insert into ljc_planned_years(${planid},${yr})`);
  }

  res.status(200).send({message: "req"});
});

router.get('/manageplan', async (req, res) => {
  const db = makeDB();
  let plans = await db.query("select * from ljc_plan where username=?",[req.session.username?req.session.username : "semjaza"]);
  for (let m of plans) {
    let maj = ""
    let min = "";
    for (let mid of await db.query("select major_id from ljc_planned_majors where plan_id=?",m.plan_id)) {
      let currmaj = await db.query("select major from ljc_major where major_id = ?",mid.major_id);
      maj = maj + ", " + currmaj[0].major;
    }
    for (let mid of await db.query("select minor_id from ljc_planned_minors where plan_id=?",m.plan_id)) {
      let currmin = await db.query("select minor from ljc_minor where minor_id = ?",mid.minor_id);
      min = min + ", " + currmin[0].minor;
    }
    maj = maj.substring(2);
    min = min.substring(2);
    
    m.plan_id = m.planname;
    m.planname = maj;
    m.username = min;
  }
  res.status(200).send({message: plans});
});

router.get('/majors',async (req,res) => {
  const db = makeDB();
  const majors = await db.query("select * from ljc_major");
  res.status(200).send({message: majors});
});

router.get('/minors',async (req,res) => {
  const db = makeDB();
  const minors = await db.query("select * from ljc_minor");
  res.status(200).send({message: minors});
});

router.get('/years',async (req,res) => {
  const db = makeDB();
  const years = await db.query("select * from ljc_catayear");
  res.status(200).send({message: years});
});

router.post('/schedule/:plan',async (req,res) => {
  res.status(200).send({message: req.body});
});

router.get('/notes/:plan',async (req,res) => {
  res.status(200).send({
    studentnotes: "Here are example student notes",
    facultynotes: "Here are example faculty notes"
  });
});

router.post('/notes/:plan',async (req,res) => {
  res.status(200).send({message: req.body});
});
//END ADDED BY LUKE

module.exports = router;