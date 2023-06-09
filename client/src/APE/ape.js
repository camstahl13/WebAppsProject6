import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthService';
import CreatePlan from './create.js';
import ManagePlan from './manage.js';
import Catalog from './catalog.js';

function Signout() {
    let nav = useNavigate();
    let { signout } = useAuth();

    let AuthSignout = async (e) => {
        e.preventDefault();
        await signout();
        nav('/login');
    }

    return (
        <form onSubmit={(e) => AuthSignout(e)} method="post">
            <button className="btt-primary" type="submit">Log Out</button>
        </form>
    );
}
const apiGetWithCred = {method: 'GET', credentials: "include"}
class APE_Header extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "", heading: {}, majors: {}, minors: {}, catayears: {}, plans: {} };
    }

    //LUKE ADDED
    async getMajors() {
        await fetch("http://localhost:3001/api/majors", { method: 'GET'})
            .then(res => res.json())
            .then(res => this.setState({majors: res}));
    }

    async getMinors() {
        await fetch("http://localhost:3001/api/minors", { method: 'GET'})
            .then(res => res.json())
            .then(res => this.setState({minors: res}));
    }

    async getYears() {
        await fetch("http://localhost:3001/api/years", { method: 'GET'})
            .then(res => res.json())
            .then(res => this.setState({catayears: res}));
    }

    async getPlans() {
        return fetch(`http://localhost:3001/api/manageplan/${this.props.plan_id}`, apiGetWithCred)
            .then(res => res.json())
            .then(res => this.setState({plans: res}));
    }
    //END LUKE ADDED

    componentDidMount() {
        this.getMajors();
        this.getMinors();
        this.getYears();
        //this.getPlans();
    }

    render() {
        const { student, catalog_year, majors, minors } = this.props;
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
                            <p id="studentName">{student || "Loading..."}</p>
                            <p id="studentName">{catalog_year || "Loading..."}</p>
                        </li>
                        <li>
                            <b>Majors:</b>
                            <b>Minors:</b>
                        </li>
                        <li>
                            <p id="major">{majors ? majors.join(", ") : "Loading..."}</p>
                            <p id="minor">{minors ? minors.join(", ") : "Loading..."}</p>
                        </li>
                    </ul>
                    <div id="actions">
                        <Signout />
                        <div className="dropdown btt-primary">
                            <span>Options</span>
                            <div className="dropdown-content shadow">
                                <CreatePlan getPlans={() => {this.getPlans()}} plan_id={this.props.plan_id} majors={this.state.majors} minors={this.state.minors} years={this.state.catayears} setPlanId={this.props.setPlanId}/>
                                <ManagePlan plans={this.state.plans} setPlanId={this.props.setPlanId} getPlans={() => { return this.getPlans()}}/>
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

//TODO - FINISH THIS, right now it just bare bones on how to get data from api and use it


class BL extends Component {
    render() {
        return (
            <div id="BL">
                <div className="sec-header">
                    <h1>Validation Status</h1>
                </div>
                <p>Yo zafo</p>
            </div>
        )
    };

}

class BR extends Component {
    constructor(props) {
        super(props);
        this.state = { catalog: [], visible: false };
    }

    async getCatalog() {
        await fetch("http://localhost:3001/api/Catalog", apiGetWithCred)
            .then(res => res.json())
            .then(res => this.setState({ catalog: res }));
    }

    componentDidMount() {
        this.getCatalog();
        document.getElementById("bar").addEventListener("drag", (e)=>{
            if (e.clientY != 0) document.getElementById("main").style.gridTemplateRows = "max(170px, calc(100vh - 80px - " +  "max(210px, calc(100vh - " + e.clientY + "px)))) auto"
            let a = window.innerHeight;
			let c = document.getElementsByTagName("header")[0].offsetHeight;
			let d = document.getElementById("TR").offsetHeight;
			let f = document.getElementsByClassName("sec-header")[0].offsetHeight;
			let letssee = a-(c+d+f);
			document.getElementById("catalog").setAttribute("style", `height: ${letssee - 23}px`);
        });
    }

    render() {
        return (
            <div id="BR">
                <span id="bar" draggable></span>
                <div className="sec-header to-col">
                    <h1>Course Finder</h1>
                    <div id="toggleswitch">
                        <input type="checkbox" onClick={(e) => {
                            this.setState({visible: !this.state.visible});
                        }}/>
                        <h1>{this.state.visible? "Uncheck box to show Send Advisor form" : "Check box to hide the Catalog"}</h1>
                    </div>
                </div>
                <form action="http://judah.cedarville.edu/echo.php" target="_blank" className={this.state.visible? "advisorform" : "dropdown-content"} id="submitbutton" display="none">
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
                <div id="catalog" hidden={this.state.visible? true : false}>
                    <Catalog courses={this.state.catalog.length == 0 ? "Loading courses..." : this.state.catalog} />
                </div>
            </div>
        )
    };
}

export { APE_Header, BL, BR };