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
const db = makeDB();

const checkFacultyAcc = (req, res, next) => {
  console.log(req.session);
  if (!req.session.is_faculty) {
    return res.status(403).send(unauthorizedMessage);
  }
  next();
}

// Middleware to check session
const checkPlanAcc = (req, res, next) => {
  if (!req.session.username)
    return res.status(403).send(unauthorizedMessage);

  //Check if user is faculty and if they are accessing a plan
  if(!req.session.is_faculty && req.params.plan_id){
    let accPlans = req.session.accessible_plans;

    if(!accPlans.includes(parseInt(req.params.plan_id)))
      return res.status(403).send(unauthorizedMessage);
  }
  next();
};

const checkUserAcc = (req, res, next) => {
  console.log(req.session);
  if (!req.session.username)
    return res.status(403).send(unauthorizedMessage);

  //Check if user is faculty and if they are accessing a plan
  if(!req.session.is_faculty && req.params.student){
    if(req.params.student !== req.session.username)
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
router.get('/user', checkPlanAcc, async (req, res) => {
  console.log("GET API REQEST -> user - RESPONSE: " + req.session.username);
  res.status(200).send({ message: req.session.username });
});

router.get('/students', checkFacultyAcc, async (req, res) => {
  console.log("GET API REQEST -> get all students - CALLER: " + req.session.username);
  try {
    const results = await db.query('SELECT username, first_name, last_name FROM ljc_user WHERE is_faculty = 0;');
    res.status(200).send(results);
  } catch(error) {
    console.log(error);
    res.status(500).send({message: "Internal Server Error"});
  }
});


//Logout URI -> /api/user/logout
router.post('/user/logout', (req, res) => {
  console.log("API REQEST ->  LOGOUT user:" + req.session.username);
  req.session.destroy();
  res.status(200).send({ message: "Logged Out" });
});

// Endpoint for login -> /api/user/login
router.post('/user/login', async (req, res) => {
  const { uname, pass } = req.body;
  console.log(`API Login attempt -> User: ${uname}`);

  if (!uname || !pass) {
    return res.status(400).send({ message: "Missing Credentials" });
  }

  try {
    const hashedPassword = sha256.sha256(pass);
    const results = await db.query('SELECT username, first_name, last_name, is_faculty FROM ljc_user WHERE username = ? AND password = ?', [uname, hashedPassword]);
    const accessible_plans = await db.query('SELECT plan_id FROM ljc_plan WHERE username = ?', [uname]);
    //If the user is found in the database, set the session username to the username
    if (results.length > 0) {
      console.log(`API Login -> User: ${uname} - SUCCESS`)
      req.session.username = uname;
      req.session.is_faculty = results[0].is_faculty;
      req.session.accessible_plans = accessible_plans.map(plan => plan.plan_id);
      
      return res.status(200).send({ username: uname, plan: -1, is_faculty: results[0].is_faculty, loggedIn: true });
    } else {
      return res.status(401).send({ message: "Invalid Username or Password" });
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
  //Clode database connection
  
});

// Define the SQL queries as constants
const getDefaultPlanQuery = `SELECT plan_id FROM ljc_plan WHERE username = ? && default_ = 1;`;

router.get('/default/:student', checkUserAcc, async (req, res) => {
  const username = req.session.username;
  const student = req.params.student;
  console.log(`API request: Get default plan for ${student}, Username - ${username}`);

  try {
    let default_plans = await db.query(getDefaultPlanQuery, [student]);
    if (default_plans.length < 1) {
      res.status(200).send({ default_plan: null });
    } else {
      res.status(200).send({ default_plan: default_plans[0].plan_id });
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

router.post('/schedule/:plan_id', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Set schedule for plan with ID ${planId}, Username - ${username}`);



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
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } 
});

const getPlannedYearsQuery = `SELECT * FROM ljc_planned_years WHERE plan_id = ?;`;
const getPlannedCoursesQuery = `SELECT course_id FROM ljc_planned_courses WHERE plan_id = ? && year = ? && term = ?;`;

router.get('/schedule/:plan_id', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get schedule for plan with ID ${planId}, Username - ${username}`);


  try {
    // Get the planned years and courses from the database
    const planned_years = await db.query(getPlannedYearsQuery, [planId]);

    let sched = planned_years.map(planned_year => {
      return {
        year: planned_year.year,
        semesters: []
      };
    });

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

    res.status(200).send({ schedule: sched });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } 
});

const getCatalogYearQuery = `SELECT catalog_year FROM ljc_plan WHERE plan_id = ?`;
const getCatalogCoursesQuery = `SELECT * FROM ljc_course, ljc_catalog where ljc_course.course_id = ljc_catalog.course_id and ljc_catalog.catalog_year = ?`;

router.get('/catalog/:plan_id', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`GET request: /catalog/${planId}, Username - ${username}`);


  try {
    let catalog_year_obj = await db.query(getCatalogYearQuery, [planId]);
    let catalog_year = catalog_year_obj[0].catalog_year;

    let catalog_courses = await db.query(getCatalogCoursesQuery, [catalog_year]);

    let catalog = {
      year: catalog_year,
      courses: {}
    }
    for (let course of catalog_courses) {
      catalog.courses[course.course_id] = {
        id: course.course_id,
        name: course.title,
        description: course.description,
        credits: course.credits
      };
    }

    res.status(200).send({ catalog: catalog });
  } catch (error) {
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

router.get('/info/:plan_id', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get general info for plan with ID ${planId}, Username - ${username}`);


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
  } catch (error) {
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

router.get('/requirements/:plan_id', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get catalog for plan with ID ${planId}, Username - ${username}`);


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

    res.status(200).send({ requirements: reqs });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } 
});

const getStudentNotesQuery = `SELECT student_notes FROM ljc_plan WHERE plan_id = ?;`;
const getFacultyNotesQuery = `SELECT faculty_notes FROM ljc_plan WHERE plan_id = ?;`;

router.get('/notes/:plan_id', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Get notes for plan with ID ${planId}, Username - ${username}`);


  try {
    let notes = {};

    const student_notes_obj = await db.query(getStudentNotesQuery, [planId]);
    notes.studentnotes = student_notes_obj[0].student_notes;

    if (req.session.is_faculty) {
      const faculty_notes_obj = await db.query(getFacultyNotesQuery, [planId]);
      notes.facultynotes = faculty_notes_obj[0].faculty_notes;
    }

    res.status(200).send(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } 
});

const setStudentNotesQuery = `UPDATE ljc_plan SET student_notes = ? WHERE plan_id = ?;`;
const setFacultyNotesQuery = `UPDATE ljc_plan SET faculty_notes = ? WHERE plan_id = ?;`;

router.post('/notes/:plan_id', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  const planId = req.params.plan_id;
  console.log(`API request: Set notes for plan with ID ${planId}, Username - ${username}`);

  try {
    if (req.body.studentnotes) {
      await db.query(setStudentNotesQuery, [req.body.studentnotes, planId]);
    }
    else if (req.body.studentnotes ==null) {
      await db.query(setStudentNotesQuery, ["", planId]);
    }
    if (req.body.facultynotes != null && req.session.is_faculty) {
      await db.query(setFacultyNotesQuery, [req.body.facultynotes, planId]);
    }
    else if (req.body.facultynotes == null && req.session.is_faculty) {
      await db.query(setFacultyNotesQuery, ["", planId]);
    }

    res.status(200).send({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } 
});

//get plans
/*
const getPlans = `select plan_id, planname, catalog_year, default_ as "default" from ljc_plan where username=?;`

router.get('/plans', checkPlanAcc, async (req, res) => {
  console.log("API request: Get plans");

  try {
    // Get the planned years and courses from the database
    const plans = await db.query(getPlans, [req.session.username]);
    res.status(200).send(plans);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
  
});*/

//get get Heading URI -> /api/heading
/*
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

router.get('/heading', checkPlanAcc, async (req, res) => {
  const username = req.session.username;
  console.log(`API request: heading, Username - ${username}`);

  try {
    const result = await db.query(getHeadingQuery, [username]);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  } 
});*/


//Get Catalog URI -> /api/catalog
//LUKE EDITED THIS FUNCTION TO DO STUFF
router.get('/Catalog', async (req, res) => {
  console.log("API REQEST -> Get Catalog, Username - " + req.session.username);

  try {
    const catalog = await db.query("select * from ljc_course");
    res.status(200).send({ catalog });
  }
  catch (err) {
    res.status(500).send({ message: err });
  }
  
});


router.get('/help', function (req, res) {
  const fs = require('fs');

  // Read JSON data from file
  const jsonData = fs.readFileSync(require('path').resolve(__dirname, '../public/docs.json'));

  // Parse JSON data
  const calls = JSON.parse(jsonData);

  // Do something with the data
  res.render('api', { calls });
  fs.close();
});


const query = "select plan_id from ljc_plan where username=? and planname=?";

router.post('/createplan/:plan_id', checkPlanAcc, async (req, res) => {
  let { name, createMajor, createMinor, catayear } = req.body;

  //name conflict check
  try {
    const uname = await db.query(`select username from ljc_plan where plan_id=${req.params.plan_id}`)
    let foruser=uname[0].username;

    let namechk = await db.query(query, [foruser, name]);
    while (namechk.length > 0) {
      name = "_" + name;
      namechk = await db.query(query, [foruser, name]);
    }

    //create plan, get relevant data chunks for the insertions in related tables
    await db.query(`insert into ljc_plan values(NULL,'${name}','${foruser}',${catayear},0,'','')`);

    const planid = await db.query(query, [foruser, name]);
    const majorid = await db.query("select major_id from ljc_major where major = ?", createMajor);
    const minorid = await db.query("select minor_id from ljc_minor where minor = ?", createMinor);

    //insert into the related tables: planned_majors and planned_minors
    await db.query(`insert into ljc_planned_majors values(${planid[0].plan_id},${majorid[0].major_id})`);
    await db.query(`insert into ljc_planned_minors values(${planid[0].plan_id},${minorid[0].minor_id})`);
    for (let yr = catayear; yr < parseInt(catayear) + 4; ++yr) {
      await db.query(`insert into ljc_planned_years values(${planid[0].plan_id},${yr})`);
    }

    res.status(200).send({ pid: planid[0].plan_id });
  }
  catch (err) {
    res.status(500).send({ message: err });
  }
  
});

router.get('/manageplan/:plan_id', checkPlanAcc, async (req, res) => {
  try {
    const uname = await db.query(`select username from ljc_plan where plan_id=${req.params.plan_id}`)
    let foruser=uname[0].username;

    let plans = await db.query("select * from ljc_plan where username=?", [foruser]);
    let displayplans = [];
    for (let m of plans) {
      let maj = ""
      let min = "";
      for (let mid of await db.query("select major_id from ljc_planned_majors where plan_id=?", m.plan_id)) {
        let currmaj = await db.query("select major from ljc_major where major_id = ?", mid.major_id);
        maj = maj + ", " + currmaj[0].major;
      }
      for (let mid of await db.query("select minor_id from ljc_planned_minors where plan_id=? && minor_id != 5", m.plan_id)) {
        let currmin = await db.query("select minor from ljc_minor where minor_id = ?", mid.minor_id);
        min = min + ", " + currmin[0].minor;
      }
      maj = maj.substring(2);
      min = min.substring(2);

      displayplans.push({plan_id: m.plan_id, planname: m.planname, majors: maj, minors: min, catalog_year: m.catalog_year, default: m.default_});
    }
    res.status(200).send({ message: displayplans });
  }
  catch (err) {
    res.status(500).send({ message: err });
  }
  
});

router.get('/majors', async (req, res) => {

  try {
    const majors = await db.query("select * from ljc_major");
    res.status(200).send({ message: majors });
  }
  catch (err) {
    res.status(500).send({ message: err });
  }
  
});

router.get('/minors', async (req, res) => {

  try {
    const minors = await db.query("select * from ljc_minor");
    res.status(200).send({ message: minors });
  }
  catch (err) {
    res.status(500).send({ message: err });
  }
  
});

router.get('/years', async (req, res) => {

  try {
    const years = await db.query("select * from ljc_catayear");
    res.status(200).send({ message: years });
  }
  catch (err) {
    res.status(500).send({ message: err });
  }
  
});

module.exports = router;