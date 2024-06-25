exports.generateFullQuery = (sql, params) => {
    if (Array.isArray(params)) {
        let index = 0;
        const fullQuery = sql.replace(/\?/g, () => {
            const value = params[index++];
            return typeof value === 'string' ? `'${value}'` : value;
        });
        console.log("Full query: ", fullQuery);
        return fullQuery;
    }
    return sql;
};

// const { generateFullQuery } = require('../utils/generateFullQuery');
// generateFullQuery(sql2, [EID]);