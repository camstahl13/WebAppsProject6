import { Component } from 'react';
import { TL, TR, BL, BR } from './ape.js';

class ApeHome extends Component {
    constructor(props) {
		super(props);
		this.state = { selected_plan: null, requirements: {}, catalog: {}, plan: { schedule: [] } };
	}

    componentDidMount() {
        /*
        this.get('requirements');
        this.get('catalog');
        this.get('plan');
        */

        const reqs = {
            "Core": ["CS-1210","CS-1220","CS-2210","CS-3210","CS-3220","CS-3310","CS-3410","CS-3510","CS-3610","CS-4810","CS-4820","CY-1000","CY-3420","EGCP-1010","EGCP-3210","EGCP-4310","EGGN-3110","EGGN-4010","MATH-2520"],
            "Electives": ["CY-3320","CY-4310","CY-4330","CS-4430","CS-4710","CS-4730","EGCP-3010","EGCP-4210","MATH-3610"],
            "Cognates": ["CHEM-1050","MATH-1710","MATH-1720","PHYS-2110","PHYS-2120"],
            "GenEds": ["BTGE-1725","BTGE-2730","BTGE-2740","BTGE-3755","BTGE-3765"]
        };
        const plan = {
            id: 12345,
            name: "A Great Plan",
            student: "Campbell Stahlman",
            majors: ["Computer Science", "English"],
            minors: ["Honors", "Literature"],
            current_year: 2022,
            current_semester: "SP",
            catalog_year: 2020,
            schedule: [
                {
                    year: 2020,
                    semesters: [
                        {
                            semester: "FA",
                            courses: ["CS-1210","CS-1220",]
                        },
                        {
                            semester: "SP",
                            courses: ["CS-3320"]
                        },
                        {
                            semester: "SU",
                            courses: []
                        }
                    ]
                },
                {
                    year: 2021,
                    semesters: [
                        {
                            semester: "FA",
                            courses: []
                        },
                        {
                            semester: "SP",
                            courses: []
                        },
                        {
                            semester: "SU",
                            courses: []
                        }
                    ]
                },
                {
                    year: 2022,
                    semesters: [
                        {
                            semester: "FA",
                            courses: []
                        },
                        {
                            semester: "SP",
                            courses: []
                        },
                        {
                            semester: "SU",
                            courses: ["BTGE-1725"]
                        }
                    ]
                }
            ]
        };
        const cat = {
            year: 2021,
            courses: {
                "CS-1210": {
                    id: "CS-1210",
                    name: "C++ Programming",
                    description: "Feeble effort to teach programming",
                    credits: 2
                },
                "CS-1220": {
                    id: "CS-1220",
                    name: "Object-Oriented Programming w/ C++",
                    description: "OOP there goes gravity",
                    credits: 3.5
                },
                "CS-3320": {
                    id: "CS-3320",
                    name: "Databases",
                    description: "May not actually be Databases, idk",
                    credits: 4
                },
                "BTGE-1725": {
                    id: "BTGE-1725",
                    name: "Old Testament",
                    description: "Once you go Dr. Miller, there's no going back",
                    credits: 3
                }
            }
        };
        
        this.setState({
            plan: plan,
            requirements: reqs,
            catalog: cat
        });
    }

    async get(obj) {
        await fetch(`http://localhost:3001/api/${obj}/${this.state.selected_plan}`, 
                {method: 'GET', credentials: "include"})
            .then(res => res.json())
            .then(res => this.setState({ [obj]: res }));
    }

    setSchedule(sched) {
        this.setState(prevState => ({
            ...prevState,
            plan: {
                ...prevState.plan,
                schedule: sched
            }
        }));

        fetch('http://localhost:3001/api/schedule/${plan.id}', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type':'application/json'},
            body: {
             "schedule": this.state.plan.schedule
            }
        });
    }

    render() {
        return (
            <>
                <TL requirements={this.state.requirements}
                    schedule={this.state.plan.schedule}
                    catalog={this.state.catalog} />
                <TR schedule={this.state.plan.schedule} 
                    setSchedule={this.setSchedule}
                    current_year={this.state.plan.current_year}
                    curent_semester={this.state.current_semester}
                    catalog_year={this.state.plan.catalog_year}
                    catalog={this.state.catalog} />
                <BL />
                <BR catalog={this.state.catalog}/>
            </>
        )
    };
}

export {ApeHome};