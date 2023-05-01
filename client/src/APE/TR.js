import { Component } from 'react';

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

    addCourse(year, semester, course) {
        if (this.props.catalog.courses[course]) {
            for (let y of this.props.schedule) {
                if (y.year == year) {
                    for (let s of y.semesters) {
                        if (s.semester == semester) {
                            s.courses.push(course);
                            this.props.setSchedule(this.props.schedule);
                            return;
                        }
                    }
                }
            }
        }
    }

    removeCourse(year, semester, course) {
        for (let y of this.props.schedule) {
            if (y.year == year) {
                for (let s of y.semesters) {
                    if (s.semester == semester) {
                        let i = s.courses.indexOf(course);
                        if (i >= 0) {
                            s.courses.splice(i, 1);
                            this.props.setSchedule(this.props.schedule);
                            return;
                        }
                    }
                }
            }
        }
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
                                            <li key={i}
                                                className={this.isScheduled(year_schedule.year, 
                                                                            semester_schedule.semester, 
                                                                            this.props.current_year,
                                                                            this.props.current_semester)}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                }}
                                                onDrop={(e) => {
                                                    console.log(e.dataTransfer.getData("text/plain"));
                                                    this.addCourse(year_schedule.year, semester_schedule.semester, e.dataTransfer.getData("text/plain"))
                                                }}>
                                                <p className="sem">{semester_schedule.semester + " " + year_schedule.year}</p>
                                                <p className="hours text-secondary">{this.sumCredits(semester_schedule.courses)}</p>
                                                <div className="sem-courses">
                                                    <ul className="course-list">
                                                        {semester_schedule.courses.map((course, i) => {
                                                            return (
                                                                <li key={i} draggable="true">
                                                                    {this.props.catalog.courses[course] ? this.props.catalog.courses[course].id : "XX-0000"} {this.props.catalog.courses[course] ? this.props.catalog.courses[course].name : "Unknown name"}
                                                                    <span class="remcourse" onClick={(e) => {
                                                                        this.removeCourse(year_schedule.year, semester_schedule.semester, course)
                                                                    }}>&#10006;</span>
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

export { TR };