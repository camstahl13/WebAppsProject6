import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthService';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemPanel, AccordionItemHeading} 
    from 'react-accessible-accordion';
import Draggable, {DraggableCore} from 'react-draggable';

function Singout() {
    let nav = useNavigate();
    let auth = useAuth();

    let AuthSignout = async (e) => {
        e.preventDefault();
        await auth.signout();
        nav('/login');
    }

    return (
        <form onSubmit={(e) => AuthSignout(e)} method="post">
            <button className="btt-primary" type="submit">Log Out</button>
        </form>
    );
}

class APE_Header extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "", heading: {} };
    }

    async callAPI() {
        //Get Heading Infomation
        await fetch("http://localhost:3001/api/heading", { method: 'GET', credentials: "include" })
            .then(res => res.json())
            .then(res => this.setState({ heading: res[0] }));
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        const { heading } = this.state;
        return (
            <header className="bg-dark sticky-top" style={{ lineheight: '5px' }}>
                <nav className="main-nav shadow">
                    <div id="header-logo" style={{ position: 'relative' }}><b>ACADEMIC</b>-PLANNING</div>
                    <div id="version" className="text-secondary"><span>Version 0.0.1</span></div>
                    <ul id="stu-info" className="text-secondary row">
                        <li>
                            <b>Student:</b>
                            <b>Catalog:</b>
                        </li>
                        <li>
                            <p id="studentName">{heading ? heading.username : "Loading..."}</p>
                            <p id="studentName">{heading ? heading.catalog_year : "Loading..."}</p>
                        </li>
                        <li>
                            <b>Majors:</b>
                            <b>Minors:</b>
                        </li>
                        <li>
                            <p id="major">{heading ? heading.major : "Loading..."}</p>
                            <p id="minor">{heading ? heading.minor : "Loading..."}</p>
                        </li>
                    </ul>
                    <div id="actions">
                        <Singout />
                        <div className="dropdown btt-primary">
                            <span>Options</span>
                            <div className="dropdown-content shadow">
                                <p id="create">Create Plan</p>
                                <p id="manage">Manage Plan</p>
                                <p>Print</p>
                                <p>Show Grades</p>
                                <p>Wavers</p>
                                <p>About</p>
                                <p>Help</p>
                            </div>
                        </div>
                        <button className="disabled btt-primary">Save</button>
                    </div>
                </nav>
            </header>
        )
    };
}

class TL extends Component {
    constructor(props) {
		super(props);
	}

    eventHandler (e, data) {
        console.log('Event Type', e.type);
        console.log({e, data});
      }

    render() {
        console.log(this.props.catalog);
        return (
            <div id="TL">
                <div className="sec-header">
                    <h1>Requirements</h1>
                </div>
                <Accordion allowZeroExpanded>
                    {this.props.requirements &&
                    Object.keys(this.props.requirements).map(category =>
                        <AccordionItem>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    {category}
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <ul className="reqcat">
                                    {this.props.requirements[category].map((course, i) =>
                                            <Course idx={i}
                                                course_id={this.props.catalog.courses[course] ? this.props.catalog.courses[course].id : "CS-0000"}
                                                course_name={this.props.catalog.courses[course] ? this.props.catalog.courses[course].name : "Name unknown"}></Course>)}
                                </ul>
                            </AccordionItemPanel>
                        </AccordionItem>)}
                </Accordion>
            </div>
        )
    };
}

class Course extends Component {
    constructor(props) {
		super(props);
	}

    render() {
        return (
            <li draggable key={this.props.course_id} className="reqcourse">{this.props.course_id} {this.props.course_name}</li>
        )
    }
}
//TODO - FINISH THIS, right now it just bare bones on how to get data from api and use it


class TR extends Component {

    constructor(props) {
        super(props);
    }

    isScheduled(year, semester, current_year, current_semester) {
        return (current_year > year
                    || (current_year == year
                            && (current_semester == "FA"
                                    || (current_semester == "SU"
                                            && semester != "FA")
                                    || (current_semester == "SP"
                                            && semester == "SP")))) ? "scheduled" : "unscheduled";
    }

    sumCredits(courses) {
        let credits = 0;
        for (let course of courses) {
            if (this.props.catalog.courses[course]) {
                credits += this.props.catalog.courses[course].credits;
            }
        }
        return credits;
    }

    sumAllCredits() {
        let credits = 0;
        for (let year of this.props.schedule) {
            for (let semester of year.semesters) {
                for (let course of semester.courses) {
                    if (this.props.catalog.courses[course]) {
                        credits += this.props.catalog.courses[course].credits;
                    }
                }
            }
        }
        return credits;
    }

    render() {
        console.log(this.props);
        return (
            <div id="TR" className="aca-panel">
                <div className="sec-header">
                    <h1>Academic Plan {this.sumAllCredits()} creds</h1>
                </div>
                <ul id="aca-plan">
                    {this.props.schedule.map((year_schedule, i) => {
                        {console.log("in map", i)}
                        return (
                            <li key={i} className="year">
                                <ul className="semesters">
                                    {year_schedule.semesters.map((semester_schedule, i) => {
                                        return (
                                            <li key={i} className={this.isScheduled(year_schedule.year, semester_schedule.semester, this.props.current_year, this.props.current_semester)}>
                                                <p className="sem">{semester_schedule.semester + " " + year_schedule.year}</p>
                                                <p className="hours text-secondary">{this.sumCredits(semester_schedule.courses)}</p>
                                                <div className="sem-courses">
                                                    <ul className="course-list">
                                                        {semester_schedule.courses.map((course, i) => {
                                                            return (
                                                                <li key={i} draggable="true">
                                                                    {this.props.catalog.courses[course] ? this.props.catalog.courses[course].id : "XX-0000"} {this.props.catalog.courses[course] ? this.props.catalog.courses[course].name : "Unknown name"}
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    };
}

class BL extends Component {
    render() {
        return (
            <div id="BL">
                <div className="sec-header">
                    <h1>Validation Status</h1>
                </div>
                <form id="kbb">
                    <div>
                        <label htmlFor="year">Year:</label>
                        <select name="year" id="year"></select>
                    </div>
                    <div>
                        <label htmlFor="make">Make:</label>
                        <select name="make" id="make"></select>
                    </div>
                    <div>
                        <label htmlFor="model">Model:</label>
                        <select name="model" id="model"></select>
                    </div>
                </form>
                <div className="badge-link">
                    <a href="../../cs3220.html">Luke's Home</a>
                    <a href="../../../~jcarpen/cs3220.html">Josiah's Home</a>
                    <a href="../../../~stahlma/cs3220.html">Campbell's Home</a>
                    <a href="../../../index.php">Course Home</a>
                </div>
            </div>
        )
    };

}

class BR extends Component {
    render() {
        return (
            <div id="BR">
                <span id="bar"></span>
                <div className="sec-header to-col">
                    <h1>Course Finder</h1>
                    <div id="toggleswitch">
                        <input type="checkbox" />
                        <h1>Check box to hide Send Advisor form</h1>
                    </div>
                    <form action="http://judah.cedarville.edu/echo.php" target="_blank" id="coursesearch">
                        <label htmlFor="placeholder">Enter Course: </label>
                        <input type="text" name="placeholder" />
                    </form>
                </div>
                <form action="http://judah.cedarville.edu/echo.php" target="_blank" className="advisorform" id="submitbutton">
                    <p>
                        <label htmlFor="email" id="emaillabel">Email: </label>
                        <input type="text" name="email" id="email" size='30' />
                        <label htmlFor="email"></label>
                    </p>
                    <p>
                        <label htmlFor="phone" id="phonelabel">Phone: </label>
                        <input type="text" name="phone" id="phone" size='14' />
                        <label htmlFor="phone"></label>
                    </p>
                    <p>
                        <label htmlFor="title">Title: </label>
                        <select name="title" id="title">
                            <option value="prof">Prof.</option>
                            <option value="dr">Dr.</option>
                        </select>
                    </p>
                    <p>
                        <label htmlFor="name" id="namelabel">Name: </label>
                        <input type="text" name="name" id="name" size='20' />
                        <label htmlFor="name"></label>
                    </p>
                    <p>
                        <input type="submit" value="Send this plan to my advisor" />
                    </p>
                </form>
                <div id="catalog" hidden={true}>
                    <table id="coursefinder">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Credits</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        )
    };
}

export { APE_Header, TL, TR, BL, BR };