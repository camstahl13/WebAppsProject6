let $uname = $("input[name='uname']");
let $pass = $("input[name='pass']");
let $vpass = $("input[name='vpass']");
let $fname = $("input[name='fname']");
let $lname = $("input[name='lname']");
let $show = $("#show");
let $hide = $("#hide");
let $vshow = $("#vshow");
let $vhide = $("#vhide");

$("#reg").submit((e) => {
	if ($uname[0].value == "" || $pass[0].value == "" || $vpass[0].value == "" || $fname[0].value == "" || $lname[0].value == "") {
		e.preventDefault();
		alert("All fields must be filled out");
	}
	else if ($pass[0].value != $vpass[0].value) {
		e.preventDefault();
		alert("Passwords must match");
	}
});

function xxshow(xpass, xshow, xhide) {
	if (xpass[0].value != "") {
		xshow.attr('hidden','true');
		xhide.removeAttr("hidden");
		xpass.attr('type','text');
	}
}

function xxhide(xpass, xshow, xhide) {
	xshow.removeAttr("hidden");
	xhide.attr("hidden","true");
	xpass.attr('type','password');
}

function xxkeyup(xpass, xshow) {
	let op = xpass[0].value == "" ? "20%" : "100%";
	xshow.css('opacity',op);
}

$vshow.mousedown(() => xxshow($vpass, $vshow, $vhide));
$vhide.mouseup(() => xxhide($vpass, $vshow, $vhide));
$vpass.keyup(() => xxkeyup($vpass, $vshow));

$show.mousedown(() => xxshow($pass, $show, $hide));
$hide.mouseup(() => xxhide($pass, $show, $hide));
$pass.keyup(() => xxkeyup($pass, $show));

function getMajs() {
        xhr = new XMLHttpRequest();
        xhr.onload = function() {
                const majs = JSON.parse(xhr.response);
                for (let maj of majs[0]) {
	                $("#major").append(`<option value="${maj}">${maj}</option>`);
	        }
		for (let min of majs[1]) {
			$("#minor").append(`<option value="${min}">${min}</option>`);
		}
		for (let year of majs[2]) {
			$("#catayear").append(`<option value="${year}">${year}</option>`);
		}
	}
	xhr.open("GET","http://judah.cedarville.edu/~lcarpen/TermProject/P4/registerMaj.php");
	xhr.send();
}
window.onload = function() {
	getMajs();
}
