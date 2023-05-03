import { Component } from 'react';

class TR extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shownotes: false,
            studentnotes: null,
            facultynotes: null
        }
    }

    async getNotes() {
        await fetch(`http://localhost:3001/api/notes/${this.props.plan_id}`,
            { method: 'GET', credentials: "include" })
            .then(res => res.json())
            .then(res => {
                if (res.studentnotes != null) {
                    this.setState({ studentnotes: res.studentnotes });
                }
                if (res.facultynotes != null) {
                    this.setState({ facultynotes: res.facultynotes });
                }
            });
    }

    isScheduled(year, semester, current_year, current_semester) {
        return (current_year > year
            || (current_year == year
                && (semester == "FA"
                    || (semester == "SP"
                        && current_semester != "FA")
                    || (semester == "SU"
                        && current_semester == "SU")))) ? "scheduled" : "unscheduled";
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

    addYear() {
        let sched = this.props.schedule;
        let nextYear;
        if (sched.length == 0) {
            nextYear = this.props.catalog_year;
        } else {
            nextYear = sched[sched.length - 1].year + 1;
        }
        sched.push({
            year: nextYear,
            semesters: [
                { semester: "FA", courses: [] },
                { semester: "SP", courses: [] },
                { semester: "SU", courses: [] },
            ]
        });
        this.props.setSchedule(sched);
    }

    removeYear() {
        let sched = this.props.schedule;
        if (sched.length > 0) {
            sched.pop();
            this.props.setSchedule(sched);
        }
    }

    saveNotes() {
        let res = {};
        if (this.state.studentnotes) {
            res.studentnotes = this.state.studentnotes;
        }
        if (this.state.facultynotes) {
            res.facultynotes = this.state.facultynotes;
        }
        fetch(`http://localhost:3001/api/notes/${this.props.plan_id}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(res)
        });
    }

    render() {
        /*
        if (this.state.studentnotes == null){
            this.getNotes();
        }
        */

        return (
            <div id="TR" className="aca-panel">
                <div className="sec-header">
                    <h1>Academic Plan {this.sumAllCredits()} creds</h1>
                </div>
                <ul id="aca-plan">
                    {this.props.schedule.map((year_schedule, i) => {
                        return (
                            <li key={i} className="year">
                                <ul className="semesters">
                                    {year_schedule.semesters.map((semester_schedule, i) => {
                                        let iss = this.isScheduled(year_schedule.year, semester_schedule.semester, this.props.current_year, this.props.current_semester);
                                        return (
                                            <li key={i}
                                                className={iss}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                }}
                                                onDrop={(e) => {
                                                    if (iss == "unscheduled") {
                                                        this.addCourse(year_schedule.year, semester_schedule.semester, e.dataTransfer.getData("text/plain"));
                                                    }
                                                }}>
                                                <p className="sem">{semester_schedule.semester + " " + (year_schedule.year + (semester_schedule.semester == "FA" ? 0 : 1))}</p>
                                                <p className="hours text-secondary">{this.sumCredits(semester_schedule.courses)}</p>
                                                <div className="sem-courses">
                                                    <ul className="course-list">
                                                        {semester_schedule.courses.map((course, i) => {
                                                            return (
                                                                <li key={i}>
                                                                    {this.props.catalog.courses[course] ? this.props.catalog.courses[course].id : "XX-0000"} {this.props.catalog.courses[course] ? this.props.catalog.courses[course].name : "Unknown name"}
                                                                    {iss == "unscheduled" ?
                                                                        <span className="remcourse" onClick={(e) => {
                                                                            this.removeCourse(year_schedule.year, semester_schedule.semester, course)
                                                                        }}>&#10006;</span> : null}
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
                    <div id="acabuttonpanel">
                        <button onClick={(e) => { this.addYear() }} className="acabutton">Add Year</button>
                        <button onClick={(e) => { this.getNotes(); this.setState({ shownotes: true }) }} className="acabutton">Open Notes</button>
                        <button onClick={(e) => { this.removeYear() }} className="acabutton">Remove Year</button>
                    </div>
                    {this.state.shownotes ?
                        <div className="notes">
                            <div className="notes-content">
                                <div className="notes-header">
                                    <h3>Edit Plan Notes</h3>
                                </div>
                                <div className="notes-body">
                                    {this.state.studentnotes != null &&
                                        <>
                                            <label className="notes-label">Student Notes</label>
                                            <textarea id="studentnotes" rows="15" cols="75"
                                                onChange={(e) => { this.setState({ studentnotes: e.target.value }) }}
                                                defaultValue={this.state.studentnotes}>
                                            </textarea>
                                        </>
                                    }
                                    {this.state.facultynotes != null &&
                                        <>
                                            <label className="notes-label">Faculty Notes</label>
                                            <textarea id="facultynotes" rows="15" cols="75"
                                                onChange={(e) => { this.setState({ facultynotes: e.target.value }) }}
                                                defaultValue={this.state.facultynotes}>
                                            </textarea>
                                        </>
                                    }
                                </div>
                                <div className="notes-footer">
                                    <button className="notes-close" onClick={(e) => { this.setState({ shownotes: false }); this.saveNotes(); }}>Save and Close</button>
                                </div>
                            </div>
                        </div> : null}
                </ul>
            </div>
        )
    };
}

export { TR };