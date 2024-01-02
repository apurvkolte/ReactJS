const mysql = require("mysql2");

var connection;
function handleDisconnect() {
    connection = connection = mysql.createPool({
        host: "localhost",
        user: "SGSRO ecom_SGSRO ecom",
        password: "qTI5,8%w^dcD",
        database: "SGSRO ecom_shop",
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 100
    });
    connection.getConnection(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();
module.exports = connection;