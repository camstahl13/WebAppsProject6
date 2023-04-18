//first create a plan object and STATICALLY populate planName, catalogYear, major, sName, and currSemester
//then create course objects and insert them into the plan object
//NOW create a function that looks at plan.catalogYear and creates 4 terms with 12 years each
//AFTER this, scan through all the courses in the plan object and put them into their respective terms
//At the end, call recalc() on all terms to calculate the credits correctly
//Figure out how to display
window.onload = function () {
    let barclick;
    getCombined();

	setupKBB();
	getCreatePlanMajors();
    //The start of figuring out how to have the bottom row resize when the bar is clicked and dragged
    document.getElementById("bar").addEventListener("mousedown", () => {
        barclick=true;
    });

    document.addEventListener("mousemove", (e) => {
        if(barclick) {
            document.getElementById("main").style.gridTemplateRows = "max(170px, calc(100vh - 80px - " +  "max(210px, calc(100vh - " + e.clientY + "px)))) auto";
			let a = window.innerHeight;
			let c = $("header").height();
			let d = $("#TR").height();
			let f = $(".sec-header").height();
			let letssee = a-(c+d+f);
			$("#catalog").height(letssee - 23);
        }
    });

    document.addEventListener("mouseup", () => {
        barclick=false;
    });

    $("#toggleswitch > input").change(() => {
        if ($("#toggleswitch > input").is(":checked")) {
            $("#toggleswitch > h1").html("Uncheck box to show 'Send Advisor' form");
            $("#submitbutton").attr("hidden",true);
            $("#catalog").removeAttr('hidden');
        }
        else if (!$("#toggleswitch > input").is(":checked")) {
            $("#toggleswitch > h1").html("Check box to hide 'Send Advisor' form");
            $("#submitbutton").removeAttr('hidden');
            $("#catalog").attr("hidden",true);
        }
    });
	
	document.getElementById("create").addEventListener("click",function(e) {
		document.getElementById("createplanui").classList.remove("modalHidden");
		document.getElementById("createplanui").classList.add("modalShown");
	});
	document.getElementById("manage").addEventListener("click",function(e) {
		document.getElementById("manageplanui").classList.remove("modalHidden");
		document.getElementById("manageplanui").classList.add("modalShown");

		let plansXhr = new XMLHttpRequest();
		plansXhr.onload = function() {
			const userPlans = JSON.parse(this.response);

			let planTable = `<table><tr><th>Plan</th><th>Major</th><th>Minor</th><th>Catalog</th><th>Default</th></tr>`;
			let plans = userPlans.plans;

			for (let plan_id in plans) {
				let plan = plans[plan_id];
				planTable += `<tr class="planitem"><td>${plan.planname}</td>`;
				planTable += `<td>${plan.majors.join(", ")}</td><td>${plan.minors.join(", ")}</td>`;
				planTable += `<td>${plan.catalog_year}</td><td>${plan.default}</td></tr>`;
			}
			planTable += `</table>`;

			$("#plans").html(planTable);
			for (let item of document.getElementsByClassName("planitem")) {
				item.addEventListener("click",function(e) {
					let idclicked = e.target.parentElement.children[0].innerText;
					xhr = new XMLHttpRequest();
					xhr.onload = function() {
						location.reload();
					}
					let url = "http://judah.cedarville.edu/~lcarpen/TermProject/P4/changeplan.php?planname="+idclicked;
					xhr.open("GET",url);
					xhr.send();
				});
			}
		}
		plansXhr.open("GET", "http://judah.cedarville.edu/~lcarpen/TermProject/P4/getPlans.php");
		plansXhr.send();
	});
	document.getElementById("cancelCreatePlan").addEventListener("click",function(e) {
		document.getElementById("createplanui").classList.remove("modalShown");
		document.getElementById("createplanui").classList.add("modalHidden");
	});
	document.getElementById("cancelManagePlan").addEventListener("click",function(e) {
		document.getElementById("manageplanui").classList.remove("modalShown");
		document.getElementById("manageplanui").classList.add("modalHidden");
	});
}
