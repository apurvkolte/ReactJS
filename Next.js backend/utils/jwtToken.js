const getJwtToken = require('./getJwtToken');

// Create and send token and save in the cookie.
const sendToken = (user, statusCode, res, userID) => {

    // Create Jwt token
    const token = getJwtToken.getJWTToken(userID);

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    console.log("user", user);

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })

}

module.exports = sendToken;