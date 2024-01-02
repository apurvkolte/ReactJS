const mysqldump = require('mysqldump');

// dump the result straight to a file
const mysqlbackup = () => {
    try {
        mysqldump({
            connection: {
                host: "localhost",
                user: "root",
                password: "root",
                database: "durasign",
            },
            dumpToFile: `./mysqlbackup/dump${new Date().toISOString().replace(/:/g, '-')}.sql`,
            //     compressFile: true,
        });

    } catch (err) { }

}

module.exports = mysqlbackup;