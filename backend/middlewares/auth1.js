const util = require('util');
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const connection = require('../config/connection');

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies
    let result = async function () {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // console.log("decoded",decoded);

            const sql = `select * from users where id=${decoded.id};`;
            const query = util.promisify(connection.query).bind(connection);
            const rows = await query(sql);
            req.user = rows[0];
        } catch (err) {
        }
        if (!token) {
            return next(new ErrorHandler('Login first to access this resource.', 401))
        }
    }
    result()
        .then(value => {
            next()

        }).catch(error => {
            console.log(error.message)
        });
})

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}