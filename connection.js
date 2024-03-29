
const mysql = require("mysql2");
const mysqlbackup = require('./mysqldump');

var connection;
function handleDisconnect() {
    connection = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "shop",
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 100,
    });
    connection.getConnection(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
            mysqlbackup()
        }
    });
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
            mysqlbackup()
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;





