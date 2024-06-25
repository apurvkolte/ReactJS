const pool = require('../config/connection');
const util = require('util');
const winston = require('../winston/config');

const query = util.promisify(pool.query).bind(pool);
const poolGetConnection = util.promisify(pool.getConnection).bind(pool);

const getConnection = async () => {
    return await poolGetConnection();
};

const queryDatabase = async (sql, params = []) => {
    let connection;
    try {
        connection = await getConnection();
        // const query = util.promisify(connection.query).bind(connection);
        const rows = await query(sql, params);
        // releaseConnection(connection);
        return rows;
    } catch (error) {
        if (connection) releaseConnection(connection);
        winston.info(error)
        throw error;
    } finally {
        if (connection) releaseConnection(connection);
        // if (connection) connection.end(); 
    }
};

const executeTransaction = async (transactionQueries) => {
    let connection;
    try {
        connection = await getConnection();
        await beginTransaction(connection);

        for (const { sql, params } of transactionQueries) {
            await queryDatabase(sql, params); // Assuming queryDatabase is your query execution function
        }

        await commitTransaction(connection);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        throw error;
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
};


const releaseConnection = (connection) => {
    connection.release();
};

module.exports = {
    queryDatabase,
    executeTransaction,
};
