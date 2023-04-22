let phone = document.getElementById("phone");
let email = document.getElementById("email");
let name = document.getElementById("name");
let sub = document.getElementById("submitbutton");
let cl = document.getElementById("coursesearch");

let phonenumber = "";

let phoneValid = false;
let emailValid = false;
let nameValid = false;

const rephone = /^\(\d{3}\)-\d{3}-\d{4}$/;
const reemail = /^.+@([^.]+\.)+[^.]+$/;
const rename = /^[a-zA-Z\-' ]+$/;
const reclass = /^[a-zA-Z]{2,4}-\d{4}$/;

$('input[name="placeholder"]').on("input", () => {
	currInput = $('input[name="placeholder"]')[0].value;
	let trackkid = 0;
	let $tbodytr = $("tbody > tr");
	for (let tr of $tbodytr) {
		let sofar = 0;
		let trc = tr.children;
		for (let td of trc) {
			let $currTD = $tbodytr.children('td').eq(trackkid);
			$currTD.css('color','white');
			if (td.innerText.toUpperCase().includes(currInput.toUpperCase())) {
				sofar = 1;
				if (currInput) {$currTD.css('color','red');}
				else { $currTD.css('color','white'); }
			}
			trackkid++;
		}
		tr.hidden = sofar === 1 ? false : true;
	}
});

cl.addEventListener("submit",function(e) {
	if(!reclass.test(cl.getElementsByTagName("input")[0].value)) {
		e.preventDefault();
		alert("Course query must be in the form: XX(XX)-####");
	}
});

phone.addEventListener("beforeinput", function(e) {
	if (e.inputType === "insertText") {
		if (!isNaN(e.data) && e.data !== " " && phonenumber.length < 10) {
			phonenumber += e.data;
		}
	} else if (e.inputType === "deleteContentBackward" && phonenumber.length > 0) {
		phonenumber = phonenumber.substr(0,phonenumber.length-1)
	}
	let output = "";
	if (phonenumber.length > 0) {
		output += "(" + phonenumber.substr(0,3) + ")";
	}
	if (phonenumber.length > 2) {
		output += "-";
	}
	if (phonenumber.length > 3) {
		output += phonenumber.substr(3, 3);
	}
	if (phonenumber.length > 5) {
		output += "-";
	}
	if (phonenumber.length > 6) {
		output += phonenumber.substr(6);
	}
	this.value = output;
	phoneValid = testInp(phone, rephone);
	e.preventDefault();

});

email.addEventListener("input", function(e) {
	emailValid = testInp(email, reemail);
});

name.addEventListener("input", function(e) {
	nameValid = testInp(name, rename);
});

sub.addEventListener("submit", function(e) {
	if (!emailValid) {
		pulse("email");
	}
	if (!phoneValid) {
		pulse("phone");
	}
	if (!nameValid) {
		pulse("name");
	}
	if (!emailValid || !phoneValid || !nameValid) {
		e.preventDefault();
	}
});

function pulse(elem) {
	label = document.getElementById(elem + "label")
	inp = document.getElementById(elem)
	label.classList.add("pulse");
	inp.classList.add("pulseBorder");
	setTimeout(removePulse, 2500, label, inp);
}

function removePulse(label, inp) {
	label.classList.remove("pulse");
	inp.classList.remove("pulseBorder");
}

function testInp(inp, regex) {
	inpValid = regex.test(inp.value);
	if (!inpValid) {
		inp.classList.add("formInvalid")
		inp.classList.remove("formValid")
	} else {
		inp.classList.add("formValid")
		inp.classList.remove("formInvalid")
	}
	return inpValid;
}
