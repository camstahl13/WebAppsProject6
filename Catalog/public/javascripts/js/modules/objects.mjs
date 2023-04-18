class course {
	designator;
	title;
	term;
	year;
	credits;
	constructor(designator,title,term,year,credits) {
		this.designator = designator;
		this.title = title;
		this.term = term;
		this.year = year;
		this.credits = credits;
	}
}

function populatePlan(plan) {
	plan.addCourse(new course("HON-1010", "Making Mod Mind: Cl An", "FA", 2020, 5));
	plan.addCourse(new course("MATH-1710", "Calculus I,", "FA", 2020, 5));
	plan.addCourse(new course("CS-1210", "C++ Programming", "FA", 2020, 3));
	plan.addCourse(new course("EGCP-1010", "Digital Logic Design", "FA", 2020, 3));
	plan.addCourse(new course("CS-1220", "Obj-Orient Design/C++", "SP", 2021, 3));
	plan.addCourse(new course("CY-1000", "Intro to Cybersecurity", "SP", 2021, 3));
	plan.addCourse(new course("HON-1020", "Making Mod Mind: Ren/R", "SP", 2021, 5));
	plan.addCourse(new course("MATH-1720", "Calculus II", "SP", 2021, 5));
	plan.addCourse(new course("PEF-1990", "Phys Act &amp; Healthy Liv", "SP", 2021, 2));
	plan.addCourse(new course("BTGE-1725", "Bible &amp; the Gospel", "SU", 2021, 3));
	plan.addCourse(new course("CS-2210", "Data Struct Using Java", "FA", 2021, 3));
	plan.addCourse(new course("CS-3210", "Programming Lang Surve", "FA", 2021, 3));
	plan.addCourse(new course("CY-3420", "Cyber Defense", "FA", 2021, 3));
	plan.addCourse(new course("PHYS-2110", "General Physics I", "FA", 2021, 4));
	plan.addCourse(new course("BTGE-2730", "Old Testament Literatu", "FA", 2021, 3));
	plan.addCourse(new course("ENG-1400", "Composition", "FA", 2022, 3));
	plan.addCourse(new course("BTGE-2740", "New Testament Literatu", "SP", 2022, 3));
	plan.addCourse(new course("CS-3310", "Operating Systems", "SP", 2022, 3));
	plan.addCourse(new course("EGCP-3210", "Computer Architecture", "SP", 2022, 3));
	plan.addCourse(new course("LIT-2340", "Western Literature", "SP", 2022, 3));
	plan.addCourse(new course("MATH-2520", "Discrete Math/Prob Pri", "SP", 2022, 3));
	plan.addCourse(new course("HON-3020", "Sem: Biblical Canon", "SP", 2022, 2));
	plan.addCourse(new course("HON-3020", "Honors Sem: Religion &amp;", "FA", 2022, 2));
	plan.addCourse(new course("ANTH-1800", "Cultural Anthropology", "FA", 2022, 3));
	plan.addCourse(new course("COM-1100", "Fundamentals of Speech", "FA", 2022, 3));
	plan.addCourse(new course("CS-3410", "Algorithms", "FA", 2022, 3));
	plan.addCourse(new course("EGCP-2120", "Microcontrollers", "FA", 2022, 3));
	plan.addCourse(new course("PHYS-2120", "General Physics II", "FA", 2022, 4));
	plan.addCourse(new course("CS-3220", "Web Applications", "SP", 2023, 3));
	plan.addCourse(new course("CS-3510", "Compiler Theory &amp; Prac", "SP", 2023, 3));
	plan.addCourse(new course("BTGE-3755", "Theology I", "SP", 2023, 3));
	plan.addCourse(new course("CS-3610", "Database Org &amp; Design", "SP", 2023, 3));
	plan.addCourse(new course("GSS-1100", "Politics &amp; American Cu", "SP", 2023, 3));
	plan.addCourse(new course("ITM-3450", "IT Security &amp; Risk Mgm", "SP", 2023, 3));
	plan.addCourse(new course("HON-4910", "Honors Senior Colloquium I", "FA", 2023, 1));
	plan.addCourse(new course("BTGE-3765", "Theology II", "FA", 2023, 3));
	plan.addCourse(new course("EGGN-4010", "Senior Seminar", "FA", 2023, 0));
	plan.addCourse(new course("CY-4810", "Secure Software Engineering I", "FA", 2023, 3));
	plan.addCourse(new course("CY-3320", "Linux Systems Programming", "FA", 2023, 3));
	plan.addCourse(new course("EGCP-4310", "Computer Networks", "FA", 2023, 3));
	plan.addCourse(new course("CY-2310", "Cyber Forensics", "FA", 2023, 3));
	plan.addCourse(new course("HON-4920", "Honors Senior Colloquium II", "SP", 2024, 1));
	plan.addCourse(new course("CY-4820", "Secure Software Engineering II", "SP", 2024, 4));
	plan.addCourse(new course("CY-4310", "Cyber Operations", "SP", 2024, 3));
	plan.addCourse(new course("CY-4330", "Software Security", "SP", 2024, 3));
	plan.addCourse(new course("EGGN-3110", "Professional Ethics", "SP", 2024, 3));
	plan.addCourse(new course("GBIO-1000", "Principles of Biology", "SP", 2024, 3.5));
	plan.addCourse(new course("Brian","Burns","SU",39,-2));
//	plan.addCourse(new course());
}

export {populatePlan};
