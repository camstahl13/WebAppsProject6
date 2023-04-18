<!DOCTYPE html>
<html lang="en">

<head>
    <title>REPENT AND BE BAPTIST</title>
    <!-- Meta -->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">

    <!-- Style Sheets -->
    <link rel="shortcut icon" type="image/x-icon" href="../spbills.jpg">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">

    <!--JS-->
    <script type="module" src="./js/planobject.js"></script>
    <script src="./js/formvalidate.js" defer></script>
    <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.13.1/jquery-ui.min.js" integrity="sha256-eTyxS0rkjpLEo16uXTS0uVCS4815lc40K2iVpWDvdSY=" crossorigin="anonymous"></script>
    <script src="./js/ajax.js"></script>
    <script src="./js/kbb.js"></script>

</head>

<body>
<?php
	session_start();
	if ($_SERVER["REQUEST_METHOD"] == "GET") {
		if (!isset($_SESSION["username"])) {
			header("Location: login.php");
		}
	}
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		session_destroy();
		header("Location: ./login.php");
	}
	/*Maybe a wonky way to do this is to just the cookie to get a bunch of things from the database,
	 * generate a bunch of files, and then use the files in the JS to populate the page.
	 * I'm sure there's a better way.........*/
?>

	<div id="createplanui" class="modal modalHidden">
        	<div class="modalBody" id="createPlanBody">
                        <form id="createplan" method="post" action="./createplan.php">
				<p><label for="name">Plan Name:<input class="modalInput" type="text" name="name"></label></p>
				<p><label for="major">Major:<select class="modalInput" name="createMajor" id="createMajor"></select></label></p>
				<p><label for="minor">Minor:<select class="modalInput" name="createMinor" id="createMinor"></select></label></p>
				<p><label for="catayear">Catalog Year:<select class="modalInput" name="catayear" id="catayear"></select></label></p>
				<p class="modalButtons">
					<input class="modalButton" type="submit" id="submitCreatePlan" value="Create Plan">
					<input class="modalButton" type="button" id="cancelCreatePlan" value="Cancel">
				</p>
                        </form>
		</div>
	</div>
	<div id="manageplanui" class="modal modalHidden">
		<div class="modalBody" id="managePlanBody">
			<div id="plans"></div>
			<p class="modalButtons">
				<input class="modalButton" type="button" id="cancelManagePlan" value="Cancel">
			</p>
		</div>
	</div>

    <header class="bg-dark sticky-top" style="line-height: 5px">
        <nav class="main-nav shadow">
            <div id="header-logo" style="position: relative;"><b>ACADEMIC</b>-PLANNING</div>
            <div id="version" class="text-secondary"><span>Version 0.0.1</span></div>
            <ul id="stu-info" class="text-secondary row">
                <li>
		    <b>Student:</b>
                    <b>Catalog:</b>
                </li>
                <li>
                    <p id="studentName"></p>
                    <p id="catalogYear"></p>
                </li>
                <li>
                    <b>Majors:</b>
                    <b>Minors:</b>
                </li>
                <li>
		    <p id="major"></p>
                    <p id="minor"></p>
                </li>
            </ul>
	    <div id="actions">
		<form action="project4.php" method="post">
			<button class="btt-primary" type="submit">Log Out</button>
		</form>
                <div class="dropdown btt-primary">
                    <span>Options</span>
                    <div class="dropdown-content shadow">
			<p id="create">Create Plan</p>
                        <p id="manage">Manage Plan</p>
                        <p>Print</p>
                        <p>Show Grades</p>
                        <p>Wavers</p>
                        <p>About</p>
                        <p>Help</p>
                    </div>
                </div>
                <button class="disabled btt-primary">Save</button>
            </div>
        </nav>
    </header>
    <main id="main">
        <div id="TL">
            <div class="sec-header">
                <h1>Requirements</h1>
            </div>
	    <div id="accordion"></div>
        </div>

        <div id="TR" class="aca-panel">
            <div class="sec-header">
                <h1>Academic Plan</h1>
            </div>
            <ul id="aca-plan">
            </ul>
        </div>

        <div id="BL">
            <div class="sec-header">
                <h1>Validation Status</h1>
            </div>
	    <form id="kbb">
		<div>
			<label for="year">Year:</label>
			<select name="year" id="year"></select>
		</div>
		<div>
			<label for="make">Make:</label>
			<select name="make" id="make"></select>
		</div>
		<div>
			<label for="model">Model:</label>
			<select name="model" id="model"></select>
		</div>
	    </form>
            <div class="badge-link">
                <a href="../../cs3220.html">Luke's Home</a>
                <a href="../../../~jcarpen/cs3220.html">Josiah's Home</a>
                <a href="../../../~stahlma/cs3220.html">Campbell's Home</a>
                <a href="../../../index.php">Course Home</a>
            </div>
        </div>

        <div id="BR">
            <span id="bar"></span>
            <div class="sec-header to-col">
                <h1>Course Finder</h1>
		<div id="toggleswitch">
			<input type="checkbox">
			<h1>Check box to hide Send Advisor form</h1>
		</div>
                <form action="http://judah.cedarville.edu/echo.php" target="_blank" id="coursesearch">
                    <label for="placeholder">Enter Course: </label>
                    <input type="text" name="placeholder">
                </form>
            </div>
            <form action="http://judah.cedarville.edu/echo.php" target="_blank" class="advisorform" id="submitbutton">
                <p>
                    <label for="email" id="emaillabel">Email: </label>
                    <input type="text" name="email" id="email" size=30>
                    <label for="email"></label>
                </p>
                <p>
                    <label for="phone" id="phonelabel">Phone: </label>
                    <input type="text" name="phone" id="phone" size=14>
                    <label for="phone"></label>
                </p>
                <p>
                    <label for="title">Title: </label>
                    <select name="title" id="title">
                        <option value="prof">Prof.</option>
                        <option value="dr">Dr.</option>
                    </select>
                </p>
                <p>
                    <label for="name" id="namelabel">Name: </label>
                    <input type="text" name="name" id="name" size=20>
                    <label for="name"></label>
                </p>
                <p>
                    <input type="submit" value="Send this plan to my advisor">
                </p>
            </form>
	    <div id="catalog" hidden="true">
		    <table id="coursefinder">
			    <thead>
				    <tr>
					    <th>Name</th>
					    <th>ID</th>
					    <th>Description</th>
					    <th>Credits</th>
				    </tr>
			    </thead>
			    <tbody>
				    
			    </tbody>
		    </table>
	    </div>
        </div>

    </main>
</body>

</html>
