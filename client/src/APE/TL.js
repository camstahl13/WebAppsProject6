import { Accordion, AccordionItem, AccordionItemButton, AccordionItemPanel, AccordionItemHeading} 
    from 'react-accessible-accordion';
import { Component } from 'react';

class TL extends Component {
    constructor(props) {
		super(props);
	}

    isPlanned(course) {
        if (!course) {
            return false;
        }
        for (let y of this.props.schedule) {
            for (let s of y.semesters) {
                for (let c of s.courses) {
                    if (c == course.id) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    eventHandler (e, data) {
        console.log('Event Type', e.type);
        console.log({e, data});
      }

    render() {
        return (
            <div id="TL">
                <div className="sec-header">
                    <h1>Requirements</h1>
                </div>
                <Accordion allowZeroExpanded>
                    {this.props.requirements &&
                    Object.keys(this.props.requirements).map((category, i) =>
                        <AccordionItem key={i}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    {category}
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <ul className="reqcat">
                                    {this.props.requirements[category].map((course, i) =>
                                            <Course
                                                key={i}
                                                course_id={this.props.catalog && this.props.catalog.courses && this.props.catalog.courses[course] ? this.props.catalog.courses[course].id : "CS-0000"}
                                                course_name={this.props.catalog && this.props.catalog.courses && this.props.catalog.courses[course] ? this.props.catalog.courses[course].name : "Name unknown"}
                                                isPlanned={this.props.catalog && this.props.catalog.courses && this.isPlanned(this.props.catalog.courses[course])}>
                                            </Course>)}
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
            <li draggable
                className={"reqcourse " + (this.props.isPlanned ? "planned" : "unplanned")}
                onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", this.props.course_id);
                }}>{this.props.course_id} {this.props.course_name}</li>
        )
    }
}

export { TL };