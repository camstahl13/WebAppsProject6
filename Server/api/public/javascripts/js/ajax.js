//import {plan} from './ajax.js';

function populateCatalog(courses) {
    let $table = $("#coursefinder > tbody");
    for (let courseID in courses) {
        let course = courses[courseID];
        let courseTableEntry = "<tr>";
        for (let field of [course.name, course.id, course.description, course.credits]) {
            courseTableEntry += `<td>${field}</td>`;
        }
        courseTableEntry += "</tr>";
        $table.append(courseTableEntry);
    }
}

function termCmp(term1, term2) {
    if (term1 == term2) {
        return 0;
    } else if (term1 == "Spring") {
        return -1; // term2 is greater
    } else if (term1 == "Fall") {
        return 1; // term2 is less
    } else {
        return term2 == "Spring" ? 1 : -1; // -1 if term2 is less
    }
}

function displayPlan(years, currYear, currTerm) {
    let $planArea = $("#aca-plan");

    let sortedYears = Object.keys(years);
    sortedYears.sort((a,b) => a-b);
    for (let year of sortedYears) {
        let sortedTerms = Object.keys(years[year]);
        sortedTerms.sort(termCmp);
        for (let termName of sortedTerms) {
            let term = years[year][termName];
            let scheduled = (year < currYear) || (year == currYear && termCmp(termName, currTerm) <= 0);
            let termHtml = `<li class=${scheduled ? "scheduled" : "unscheduled"}>
                                 <p class='sem'>${termName} ${year}</p>
                                 <p class="hours text-secondary">Hours: ${term.credits}</p>
                                 <div class="sem-courses">
                                 <ul class="course-list">`;
            for (let course of term.courses) {
                termHtml += `<li draggable="true">${course.id} ${course.title}</li>`;
            }
            termHtml += "</ul></div></li>";
            $planArea.append(termHtml);
            let $thisterm = document.getElementsByClassName("sem-courses")[document.getElementsByClassName("sem-courses").length - 1].children[0];
            $thisterm.addEventListener('dragenter',dragStart);
            $thisterm.addEventListener('dragenter',dragEnter);
            $thisterm.addEventListener('dragover',dragOver);
            $thisterm.addEventListener('dragleave',dragLeave);
            $thisterm.addEventListener('drop',drop);
        }
    }
}

function populatePlan(plan, catalog) {
    let years = {};
    for (let courseID in plan.courses) {
	if (!catalog.courses[courseID]) {
		continue;
	}
        let course = plan.courses[courseID];
        if (!(course.year in years)) {
            years[course.year] = {};
        }
        years[course.year][course.term] = years[course.year][course.term] || {credits:0, courses: []};
        if (course.term == "Fall") {
            let next = course.year+1;
            years[next] = years[next] || {};
            years[next]["Spring"] = years[next]["Spring"] || {credits:0, courses: []};
            years[next]["Summer"] = years[next]["Summer"] || {credits:0, courses: []};
        } else {
            let prev = course.year-1;
            years[prev] = years[prev] || {};
            years[prev]["Fall"] = years[prev]["Fall"] || {credits:0, courses: []};
            let otherTerm = course.term == "Spring" ? "Summer" : "Spring";
            years[course.year][otherTerm] = years[course.year][otherTerm] || {credits:0, courses: []};
        }
        years[course.year][course.term].courses.push({id: course.id, title: catalog.courses[course.id].name});
        years[course.year][course.term].credits += catalog.courses[course.id].credits;
    }

    displayPlan(years, plan.currYear, plan.currTerm);
}


function parseCombined() {
    const crss = JSON.parse(this.response);
    let plan = crss.plan;
    let catalog = crss.catalog;

    $("#studentName").text(plan.student);
    $("#catalogYear").text(plan.catYear);
    $("#major").text(plan.major);
    $("#minor").text(plan.minor || "None");

    getRequirements(plan, catalog);
    populateCatalog(catalog.courses);
    populatePlan(plan, catalog);
}

function getCombined() {
    cataXhr = new XMLHttpRequest();
    cataXhr.onload = parseCombined;
    cataXhr.open("GET", "http://judah.cedarville.edu/~lcarpen/TermProject/P4/getCombined.php");
    cataXhr.send();
}

function getRequirements(plan, catalog) {
    let rrs;
    reqXhr = new XMLHttpRequest();
    reqXhr.onload = function() {
        let $acc = $("#accordion");
        const rrs = JSON.parse(reqXhr.response);
        for (let categoryName in rrs.categories) {
            let courseList = "<ul>";
            rrs.categories[categoryName].courses.forEach(function(course) {
                let planned = (course in plan.courses) ? "planned" : "unplanned";
                courseList += `<li class=${planned} draggable="true"><label></label>${course} ${catalog.courses[course].name}</li>`;
            });
            courseList += "</ul>";
            $acc.append(`<div class=group><h2>${categoryName}</h2>${courseList}</div>`);
        }
        $acc.accordion({
            header: "> div > h2",
            heightStyle: "fill",
        });
    }
    reqXhr.open("GET", "http://judah.cedarville.edu/~lcarpen/TermProject/P4/getRequirements.php");
    reqXhr.send();
    return rrs;
}
function dragStart(e) {
	//console.log(e.target);
//	console.log(e.srcElement);
}
function dragEnter(e) {
	e.preventDefault();
//	console.log("enter");
}
function dragOver(e) {
	e.preventDefault();
//	console.log("over");
}
function dragLeave(e) {
	e.preventDefault();
//	console.log("leave");
}
function drop(e) {
	e.preventDefault();
//	console.log("drop")
//	console.log(e.target);
//	console.log(e.srcElement);
}

function getCreatePlanMajors() {
	xhr = new XMLHttpRequest();
	xhr.onload = function() {
		const majmin = JSON.parse(xhr.response);
		for (let maj of majmin[0]) {
			$("#createMajor").append(`<option value="${maj}">${maj}</option>`);
		}
		for (let min of majmin[1]) {
			$("#createMinor").append(`<option value="${min}">${min}</option>`);
		}
		for (let year of majmin[2]) {
			$("#catayear").append(`<option value="${year}">${year}</option>`);
		}
	}
	xhr.open("GET","http://judah.cedarville.edu/~lcarpen/TermProject/P4/createplan.php");
	xhr.send();
}
