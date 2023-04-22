function setupKBB() {
	let year = document.getElementById("year");
	let make = document.getElementById("make");
	let model = document.getElementById("model");
	make.setAttribute("disabled", "");
	model.setAttribute("disabled", "");

	let makeID = {};
	let modelID = {};

	let blankOption = `<option value="" hidden="true"></option>`;

	let xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function() {
		let xml = this.responseXML;
		year.innerHTML = `<option value="" hidden="true"></option>`;
		xml.querySelectorAll("year").forEach((el) => {
			let y = el.textContent;
			year.innerHTML += `<option value=${y}>${y}</option>`;
		});
	});
	xhr.open("GET", "/~gallaghd/ymm/ymmdb.php?fmt=xml");
	xhr.responseType = "document";
	xhr.send();

	year.addEventListener("change", (e) => {
		let xhrMake = new XMLHttpRequest();
		xhrMake.addEventListener("load", function() {
			makeID = {};
			let xml = this.responseXML;
			make.innerHTML = blankOption;
			model.innerHTML = blankOption;
			xml.querySelectorAll("make").forEach((el) => {
				let m = el.querySelector("name").textContent;
				makeID[m] = el.querySelector("id").textContent;
				make.innerHTML += `<option value=${m}>${m}</option>`;
			});
			make.removeAttribute("disabled");
			model.setAttribute("disabled", "");
		});
		xhrMake.open("GET", `/~gallaghd/ymm/ymmdb.php?fmt=xml&year=${year.value}`);
		xhrMake.responseType = "document";
		xhrMake.send();
	});

	make.addEventListener("change", (e) => {
		let xhrMake = new XMLHttpRequest();
		xhrMake.addEventListener("load", function() {
			modelID = {};
			let xml = this.responseXML;
			model.innerHTML = blankOption;
			xml.querySelectorAll("model").forEach((el) => {
				let m = el.querySelector("name").textContent;
				modelID[m] = el.querySelector("id").textContent;
				model.innerHTML += `<option value=${m}>${m}</option>`;
			});
			model.removeAttribute("disabled");
		});
		xhrMake.open("GET", `/~gallaghd/ymm/ymmdb.php?fmt=xml&year=${year.value}&make=${makeID[make.value]}`);
		xhrMake.responseType = "document";
		xhrMake.send();
	});
}
