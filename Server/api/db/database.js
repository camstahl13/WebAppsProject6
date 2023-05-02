var mysql = require('mysql');
var util = require('util');

function makeDB(){
    const connection = mysql.createConnection({
        host: "james.cedarville.edu",
        user: "cs3220_sp23",
        database: "cs3220_sp23",
        password: "E57y6Z1FwAlraEmA"
    });

    connection.connect(function(err) {
        if (err) throw err;
    });

    return{
        query(sql, args){
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close(){
            return util.promisify(connection.end).call(connection);
        }
    };
}

module.exports = makeDB;
    