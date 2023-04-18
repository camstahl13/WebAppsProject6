let $pass = $("input[name='pass']");
$("#loginsubmit").submit((e) => {
	if ($("input[name='uname']")[0].value == ""
		|| $("input[name='pass']")[0].value == "") {
		alert("Credential fields cannot be left blank");
		e.preventDefault();
	}
});

$("#show").mousedown(() => {
	if ($("input[name='pass']")[0].value != "") {
		$("#show").attr('hidden','true');
		$("#hide").removeAttr("hidden");
		$("input[name='pass']").attr('type','text');
	}
});

$("#hide").mouseup(() => {
	$("#show").removeAttr("hidden");
	$("#hide").attr("hidden","true");
	$("input[name='pass']").attr('type','password');
});

$pass.keyup(() => {
	let op = $pass[0].value == "" ? "20%" : "100%";
	$("img").css('opacity',op);
});

window.onload = () => {
	alert("Username: semjaza\nPassword: azazel");	
}
