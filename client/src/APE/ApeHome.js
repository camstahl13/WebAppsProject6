import { Component } from 'react';
import { BL, BR } from './ape.js';
import { TR } from './TR.js';
import { TL } from './TL.js';
import { APE_Header } from './ape.js';

class ApeHome extends Component {
    constructor(props) {
		super(props);
		this.state = { 
            requirements: {}, 
            catalog: {},
            plan_id: null,
            plan_name: null,
            student: null,
            majors: [],
            minors: [],
            current_year: null,
            current_semester: null,
            catalog_year: null,
            schedule: []
        };
	}

    async componentDidMount() {
        // THIS SHOULD NOT BE HARDCODED
        const STUDENT = "campbell";

        await this.getDefaultPlan(STUDENT);
        await this.getCatalog();
        await this.getRequirements();
        await this.getSchedule();
        await this.getInfo();  
    }

    async getDefaultPlan(student) {
        await fetch(`http://localhost:3001/api/default/${student}`, 
                {method: 'GET', credentials: "include"})
            .then(res => res.json())
            .then(res => this.setState({ plan_id: res.default_plan }));
    }

    async getRequirements() {
        await fetch(`http://localhost:3001/api/requirements/${this.state.plan_id}`, 
                {method: 'GET', credentials: "include"})
            .then(res => res.json())
            .then(res => this.setState({ requirements: res.requirements }));
    }

    async getCatalog() {
        await fetch(`http://localhost:3001/api/catalog/${this.state.plan_id}`, 
                {method: 'GET', credentials: "include"})
            .then(res => res.json())
            .then(res => this.setState({ catalog: res.catalog }));
    }

    async getSchedule() {
        await fetch(`http://localhost:3001/api/schedule/${this.state.plan_id}`, 
                {method: 'GET', credentials: "include"})
            .then(res => res.json())
            .then(res => this.setState({ schedule: res.schedule }));
    }

    async getInfo() {
        await fetch(`http://localhost:3001/api/info/${this.state.plan_id}`, 
                {method: 'GET', credentials: "include"})
            .then(res => res.json())
            .then(res => this.setState({ student: res.student, catalog_year: res.catalog_year, majors: res.majors, minors: res.minors }));
    }

    async get(obj) {
        await fetch(`http://localhost:3001/api/${obj}/${this.props.plan_id}`, 
                {method: 'GET', credentials: "include"})
            .then(res => res.json())
            .then(res => this.setState({ [obj]: res }));
    }

    render() {
        return (
            <>
                <APE_Header student={this.state.student}
                            catalog_year={this.state.catalog_year}
                            majors={this.state.majors}
                            minors={this.state.minors}/>
                <main id="main">
                    <TL requirements={this.state.requirements}
                        schedule={this.state.schedule}
                        catalog={this.state.catalog} />
                    <TR schedule={this.state.schedule} 
                        setSchedule={(sched) => {
                            this.setState({ schedule: sched });
                            let res = { schedule: sched };

                            fetch(`http://localhost:3001/api/schedule/${this.state.plan_id}`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {'Content-Type':'application/json'},
                                body: JSON.stringify(res)
                            });
                        }}
                        current_year={this.state.current_year}
                        curent_semester={this.state.current_semester}
                        catalog_year={this.state.catalog_year}
                        catalog={this.state.catalog}
                        plan_id={this.state.plan_id} />
                    <BL />
                    <BR catalog={this.state.catalog}/>
                </main>
            </>
        )
    };
}

export {ApeHome};