var mysql = require('mysql');

var db = mysql.createConnection({
    host: "james.cedarville.edu",
    user: "cs3220_sp23",
    database: "cs3220_sp23",
    password: "E57y6Z1FwAlraEmA"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


module.exports = db;
    