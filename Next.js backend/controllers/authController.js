const util = require('util');
const { queryDatabase, executeTransaction } = require('./query');
var validator = require("email-validator");
const getResetPasswordToken = require('../utils/getResetPasswordToken');
const getEmailToken = require('../utils/getEmailToken');
const ErrorHandler = require('../utils/errorHandler');
const { trim } = require('../utils/trim');
const { offer } = require('../utils/offer');
const { otp } = require('../utils/otp');
const { resetPassword } = require('../utils/resetPassword');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const { generateFullQuery } = require('../utils/generateFullQuery');
const sendGmail = require('../utils/sendGmail');
const crypto = require('crypto')
const fs = require("fs");
const path = require("path");
var unirest = require('unirest');
const winston = require('../winston/config');


//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    try {
        let filePath = req.file ? (req.file.path).replace(/\\/g, "\\\\") : ""
        let fileName = req.file ? req.file.filename : '/images/default_avatar.jpg'

        const { name, email, password, confirm_password, mobile } = req.body;

        if (password !== confirm_password) {
            return res.status(400).send({ message: "Passwords do not match" });
        }
        var hash = crypto.createHash('md5').update(password).digest('hex');

        const user = { name, email, hash, mobile, imageName: fileName, path: filePath }
        const insertUserSQL = ` INSERT INTO users (id, name, email, mobile, password, role, date, imageName, path, resetPasswordToken, resetPasswordExpire) VALUES (NULL, ?, ?, ?, ?, 'user', NULL, ?, ?, NULL, 0) `;

        const userData = [user.name, user.email, user.mobile, user.hash, user.imageName, user.path];
        const rows = await queryDatabase(insertUserSQL, userData);
        // const userID = rows.insertId;

        // sendToken(user, 200, res, userID);

        res.status(200).json({
            success: true
        });
    } catch (error) {
        winston.info("User registration failed:", error.message);
        return res.status(400).send({ message: "User registration could not be completed" });
    }
});



//Register a user => /api/v1/register
exports.emailVerification = catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email;
    const mobile = req.body.mobile;
    const { getEmailCode } = getEmailToken.getEmailToken();
    const message = otp(getEmailCode);

    try {
        // const mailOptions = {
        //     from: `${process.env.GMAIL_FROM_EMAIL}`,
        //     to: `${email}`,
        //     subject: 'SGSRO Verification Code',
        //     html: message
        // }

        // sendGmail.sendMail(mailOptions, function (err, info) {
        //     if (err) {
        //         console.log(err);
        //         return res.status(500).send({ message: "Verification email could not be sent" });
        //     } else {
        //         res.status(200).json({
        //             success: true,
        //             data: getEmailCode
        //         });
        //     }
        // });


        //mobile
        const userCheck = `SELECT * FROM users WHERE email = ? or mobile =?`;
        const rows1 = await queryDatabase(userCheck, [email, mobile]);
        if (rows1.length) {
            return res.status(400).send("An account is already registered with your email address or mobile number");
        }

        var request = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
        request.headers({
            "authorization": process.env.SMS_API_KEY
        });

        request.form({
            "message": `Your verification code for SGSRO is: ${getEmailCode}. Please enter this code to complete the verification process.`,
            "language": "english",
            "route": "q",
            "numbers": `${mobile}`,
        });

        request.end(function (response) {
            if (response.error) {
                winston.error('Mobile OTP verfication', response.error);
                console.log("response.error", response.error);
            } else {
                res.status(200).json({
                    success: true,
                    data: getEmailCode
                });
            }

            // console.log(response.body);
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "Verification email could not be completed" });
    }
});



//Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    const hash = crypto.createHash('md5').update(password).digest('hex');

    // Check if password length is valid
    if (password.length < 6) {
        return res.status(400).send({ message: "Invalid password" });
    }

    // Check if email is valid
    if (!validator.validate(email)) {
        return res.status(400).send({ message: "Invalid email" });
    }

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).send({ message: 'Please enter email & password' });
    }

    // Construct user object
    const user = {
        email,
        hash,
        isAdmin: false,
        name: '' // Default value
    };

    // SQL query to fetch user from database
    const selectUserSQL = 'SELECT * FROM users WHERE email = ? AND password = ?';
    const userData = [email, hash];

    let userID;
    let isAdmin;
    let name;
    let result = async function () {
        try {
            const rows = await queryDatabase(selectUserSQL, userData);

            // Check if user exists and set user details
            if (rows.length > 0) {
                user.isAdmin = rows[0].role;
                user.name = rows[0].name;
                userID = rows[0].id;
            } else {
                // If user does not exist, return error
                return res.status(401).send({ message: 'Invalid Email or Password' });
            }


        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Please enter correct email & password" });
        }
    };

    // Execute result function
    result()
        .then(value => {
            // Send token upon successful login
            sendToken(user, 200, res, userID, user.isAdmin);
        }).catch(error => {
            console.log("Please enter correct email & password", error.message);
            return res.status(400).send({ message: "Invalid email & password" });
        });
});


//Forget Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = { email: req.body.email };
    const { resetPasswordToken, resetPasswordExpire } = getResetPasswordToken.getResetPasswordToken();

    // Validate email format
    if (!validator.validate(user.email)) {
        return res.status(400).send({ message: "Invalid email" });
    }

    // SQL query to check if user exists with the provided email
    const selectUserSQL = 'SELECT email FROM users WHERE email = ?';
    const selectUserData = [user.email];

    // SQL query to update user's reset password token and expiry
    const updatePasswordSQL = 'UPDATE users SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE email = ?';
    const updatePasswordData = [resetPasswordToken, resetPasswordExpire, user.email];

    let result = async function () {
        try {
            // Check if user with the provided email exists
            const rows = await queryDatabase(selectUserSQL, selectUserData);
            if (rows.length <= 0) {
                return res.status(400).send({ message: 'User not found with this email' });
            } else {
                // Generate reset password URL
                const resetUrl = `${req.protocol}://sgsro.com/reset/${resetPasswordToken}`;
                // Prepare email message
                const message = resetPassword(resetUrl);

                // Send password recovery email
                try {
                    const mailOptions = {
                        from: `${process.env.GMAIL_FROM_EMAIL}`,
                        to: `${user.email}`,
                        subject: 'SGSRO  Password Recovery',
                        html: message
                    };

                    sendGmail.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(info);
                        }
                    });
                } catch (error) {
                    return res.status(500).send({ message: "Wrong Email! Operation could not be completed" });
                }

                if (rows.length > 0) {
                    await queryDatabase(updatePasswordSQL, updatePasswordData);
                }
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Wrong Email! Operation could not be completed" });
        }
    };

    // Execute the result function
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                message: `Email sent to: ${user.email}`
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Operation could not be completed" });
        });
});


//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({ message: 'Passwords do not match' });
    }

    // Hash the new password
    const hash = crypto.createHash('md5').update(req.body.password).digest('hex');
    const token = req.query.id;

    // SQL query to fetch user data based on the reset password token
    const selectUserSQL = 'SELECT id, email, resetPasswordExpire FROM users WHERE resetPasswordToken = ?';
    const selectUserData = [token];

    // SQL query to update the password and reset the token
    const updatePasswordSQL = 'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpire = 0 WHERE resetPasswordToken = ?';
    const updatePasswordData = [hash, token];

    let userEmail;
    let result = async function () {
        try {
            // Fetch user data based on the reset password token
            const rows = await queryDatabase(selectUserSQL, selectUserData);
            if (!rows.length) {
                return res.status(400).send({ message: 'Invalid reset password token' });
            }

            // Check if the token is still valid
            if (parseInt(rows[0].resetPasswordExpire) >= parseInt(Date.now())) {
                // Update the password and reset the token
                if (rows.length > 0) {
                    const rowsUpdate = await queryDatabase(updatePasswordSQL, updatePasswordData);
                    // Handle the result of the update query if needed
                }
                userEmail = rows[0].email;
            } else {
                return res.status(400).send({ message: 'Password reset token has expired' });
            }


        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Password reset token is invalid or expired" });
        }
    };

    // Execute the result function
    result()
        .then(async value => {
            // await sendToken(user, 200, res, userID);
            res.status(200).json({
                success: true,
                email: userEmail
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Password reset token is invalid or expired" });
        });
});


//Get currently logged in user details => /apiv1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const userID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql = `SELECT * FROM users WHERE id=?;`;

    let user;
    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [userID]);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            user = rows[0];

        } catch (err) {
            console.log(err);
            return res.status(404).send({ message: "User not found" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                user
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(404).send({ message: "User not found" });
        });
});


//Get currently logged in user details => /apiv1/me
exports.getUserProfile1 = catchAsyncErrors(async (req, res, next) => {
    const userID = req.user.id;
    const sql = `SELECT * FROM users WHERE id=?;`;

    let user;
    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [userID]);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            user = rows[0];

        } catch (err) {
            console.log(err);
            return res.status(404).send({ message: "User not found" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                user
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(404).send({ message: "User not found" });
        });
});



//Update / change password  => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.password;

    // if (!oldPassword || oldPassword.length < 7 || !newPassword || newPassword.length < 7) {
    //     return res.status(400).send({ message: "Old password or new password is incorrect" });
    // }

    const oldHash = crypto.createHash('md5').update(oldPassword).digest('hex');
    const newHash = crypto.createHash('md5').update(newPassword).digest('hex');

    const sqlCheckPassword = 'SELECT id FROM users WHERE id = ? AND password = ?';
    const checkPasswordData = [req.user.id, oldHash];
    const sqlUpdatePassword = 'UPDATE users SET password = ? WHERE id = ? AND password = ?';
    const updatePasswordData = [newHash, req.user.id, oldHash];


    let user;
    let userID;
    let result = async function () {
        try {
            const rowsCheck = await queryDatabase(sqlCheckPassword, checkPasswordData);
            if (rowsCheck.length === 0) {
                return res.status(400).send({ message: "Old password is incorrect" });
            }

            if (rowsCheck.length > 0) {
                const rowsUpdate = await queryDatabase(sqlUpdatePassword, updatePasswordData);
                // Handle the result of the update query if needed
            }
            if (!rowsUpdate.affectedRows) {
                return res.status(400).send({ message: "Failed to update password" });
            }

            // const rowsUser = await queryDatabase(`SELECT * FROM users WHERE id=?`, [req.user.id]);
            // user = rowsUser;
            // userID = rowsUser[0].id;


        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Operation could not be completed" });
        }
    };

    result()
        .then(value => {
            // sendToken(user, 200, res, userID);
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Operation could not be completed" });
        });
});


exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    };

    if (!newUserData.name || !newUserData.email) {
        return res.status(400).send({ message: 'Please enter name & email' });
    }
    if (!validator.validate(newUserData.email)) {
        return res.status(400).send({ message: 'Invalid email' });
    }

    const sql = 'UPDATE users SET name = ?, email = ?, mobile = ? WHERE id = ?';
    const userData = [newUserData.name, newUserData.email, newUserData.mobile, req.body.id];

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, userData);
            if (rows.affectedRows === 0) {
                return res.status(400).send({ message: 'User profile could not be updated' });
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: 'User profile could not be updated' });
        }
    };

    result()
        .then(value => {
            res.status(200).json({ success: true });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: 'User profile could not be updated' });
        });
});



//Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    // Clear the token cookie
    res.cookie('token', '', {
        expires: new Date(0), // Set to expire immediately
        httpOnly: true
    });

    // Send response
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});


//Admin Routes
//Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    let users;
    const sql = `SELECT * FROM users`;

    let result = async function () {
        try {
            const rows = await queryDatabase(sql);
            users = rows;

        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: "Failed to retrieve users" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                users
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(500).send({ message: "Failed to retrieve users" });
        });
});

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        role: req.body.role,
    };

    const sql = 'UPDATE users SET name=?, mobile=?, email=?, role=? WHERE id=?';

    const userData = [newUserData.name, newUserData.mobile, newUserData.email, newUserData.role, req.query.id];

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, userData);
            if (!rows.affectedRows) {
                return res.status(404).send({ status: 1, message: `User not found with id: ${req.query.id}` });
            }

        } catch (err) {
            console.log(err);
            return res.status(404).send({ status: 1, message: `User not found with id: ${req.query.id}` });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Operation could not be completed` });
        });
});


//Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    let users;
    let image_id;
    let noOfReview;
    let row6;
    const deleteUsersSQL = 'DELETE FROM users WHERE id = ?';
    const selectImageNameSQL = 'SELECT imageName FROM users WHERE id = ?';
    const deleteAddressSQL = 'DELETE FROM address WHERE user_id = ?';
    // const sql3 = `DELETE FROM orders WHERE user_id=${EID}; ALTER TABLE orders AUTO_INCREMENT=1;`;
    // const sql4 = `DELETE FROM review WHERE user_id=${EID}; ALTER TABLE orders AUTO_INCREMENT=1;`;
    // const sql5 = `SELECT product_id FROM review WHERE user_id =1`;


    let result = async function () {
        try {
            const rows = await queryDatabase(deleteUsersSQL, [EID]);
            const rows1 = await queryDatabase(selectImageNameSQL, [EID]);
            const rows2 = await queryDatabase(deleteAddressSQL, [EID]);
            // const rows3 = await queryDatabase(sql3);
            // const rows4 = await queryDatabase(sql4);

            try {
                fs.unlinkSync('./public/uploads/' + rows1[0].imageName);

            } catch (err) {
                console.error(err);
            }
            // if user delete update review
            // const product_id = await queryDatabase(sql5);
            // product_id.map(async (pid) => {
            //     noOfReview = `UPDATE products SET ratings=(SELECT AVG(rating) FROM review WHERE product_id=(${pid.product_id}),
            //     numOfReviews=(SELECT COUNT(${pid.product_id}) FROM review WHERE product_id=(${pid.product_id}) WHERE id=${pid.product_id};`;
            //     row6 = await queryDatabase(noOfReview);
            // })
            users = rows;

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: `Delete operation could not be completed` });
        }
    };
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                users
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Delete operation could not be completed` });
        });
});


//Add Multiple Address
//Get all addresses => /api/v1/me/update/address/:id
exports.allAddress = catchAsyncErrors(async (req, res, next) => {
    let address;
    const userId = req.user.id;
    const sql = 'SELECT * FROM address WHERE user_id = ?';

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [userId]);
            address = rows;

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: `Address could not be identified with this ID: ${req.user.id}` });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                address
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Address could not be identified with this ID" });
        });
});


// Get address details   =>   /api/v1//me/update/myaddress/:id
exports.getAddressDetails = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    let address;
    const sql = `SELECT * FROM address WHERE id=?`;

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, EID);
            address = rows[0];
            if (rows.length <= 0) {
                res.status(404).send({ status: 1, message: `Address could not be identified with id: ${EID}` });
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: `Address could not be identified with ID: ${EID}` })
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                address
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Address could not be identified with ID` });
        });
});


// Update address   =>   /api/v1//me/update/myaddress/:id
exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');

    const name = req.body.name ? trim(req.body.name) : "";
    const mobile = req.body.mobile ? trim(req.body.mobile) : "";
    const flat = req.body.flat ? trim(req.body.flat) : "";
    const area = req.body.area ? trim(req.body.area) : "";
    const landmark = req.body.landmark ? trim(req.body.landmark) : "";
    const city = req.body.city ? trim(req.body.city) : "";
    const state = req.body.state ? trim(req.body.state) : "";
    const country = req.body.country ? trim(req.body.country) : "";
    const postalCode = req.body.postalCode ? trim(req.body.postalCode) : "";

    const sql = `UPDATE address SET name=?, mobile=?, flat=?, area=?, landmark=?, city=?, state=?, country=?, postalCode=? WHERE id=?`;
    const data = [name, mobile, flat, area, landmark, city, state, country, postalCode, EID];

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, data);
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: `Address could not be identified with ID: ${EID}` });
            }

        } catch (err) {
            console.log(err);
            res.status(404).send({ status: 1, message: `Address could not be identified with ID: ${EID}` });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Address could not be identified with ID` });
        });
});


//Delete address => /me/update/myaddress/:id
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql = `DELETE FROM address WHERE id=?;`;

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [EID]);

        } catch (err) {
            console.log(err);
            return res.status(404).send({ status: 1, message: `Address could not be identified with id: ${EID}` });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Address could not be identified with ID` });
        });
});


//Add address => /me/update/address/new
exports.addAddress = catchAsyncErrors(async (req, res, next) => {
    let address;
    const name = req.body.name ? trim(req.body.name) : "";
    const mobile = req.body.mobile ? trim(req.body.mobile) : "";
    const gstn = req.body.gstn ? trim(req.body.gstn) : "";
    const flat = req.body.flat ? trim(req.body.flat) : "";
    const area = req.body.area ? trim(req.body.area) : "";
    const landmark = req.body.landmark ? trim(req.body.landmark) : "";
    const city = req.body.city ? trim(req.body.city) : "";
    const state = req.body.state ? trim(req.body.state) : "";
    const country = req.body.country ? trim(req.body.country) : "";
    const postalCode = req.body.postalCode ? req.body.postalCode : "";

    const sql = `INSERT INTO address(user_id, name, mobile, gstn, flat, area, landmark, city, state, country, postalCode, main)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const data = [req.user.id, name, mobile, gstn, flat, area, landmark, city, state, country, postalCode, 0];

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, data);
            address = rows[0];

        } catch (err) {
            console.log(err);
            return res.status(404).send({ status: 1, message: `Address could not be added` });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                address
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Operation could not be completed` });
        });
});


//set default address => /api/v1/me/update/myaddress/default/:id
exports.defaultAddress = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql = `UPDATE address SET main = CASE WHEN id = ? THEN 1 ELSE 0 END WHERE user_id = ?`;
    const data = [EID, req.user.id];
    let result = async function () {
        try {
            const rows = await queryDatabase(sql, data);

        } catch (err) {
            console.log(err);
            res.status(404).send({ status: 1, message: `Address could not be set as default` });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Operation could not be completed` });
        });
});

//Share Promocode => /admin/coupons/share/:id
exports.sharePromocode = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const users = req.body;

    const sql = `SELECT * FROM coupon WHERE id=?`;

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [EID]);

            if (rows.length <= 0) {
                return res.status(400).send({ message: 'Coupon not found' });
            } else {
                const url = `https://SGSRO.co.in/`;
                const message = offer(rows[0]);

                try {
                    users.map((user) => {
                        const mailOptions = {
                            from: `${process.env.GMAIL_FROM_EMAIL}`,
                            to: `${user}`,
                            subject: 'Best Offer Coupon Code - SGSRO',
                            html: message
                        };

                        sendGmail.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(info);
                            }
                        });
                    });
                } catch (error) {
                    console.log("Error sending coupon email:", error);
                }
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Wrong Email! Operation could not be completed" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Operation could not be completed" });
        });
});


//send enquiry => /enquiry
exports.sendEnquiry = catchAsyncErrors(async (req, res, next) => {
    const { name, email, mobile, message, product_id, productName, quantity, user_id, user_name } = req.body;
    let pid = product_id ? product_id : 0


    let result = async function () {
        try {
            const sql = `INSERT INTO enquiry (user_id, name, email, mobile, message, product_id, productName, quantity, created_at, user_name) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ? )`;
            const data = [user_id, name, email, mobile, message, pid, productName, quantity, user_name];
            await queryDatabase(sql, data);

            // Uncomment the below lines if you want to send an email notification for the enquiry
            // const mailOptions = {
            //     from: `${process.env.GMAIL_FROM_EMAIL}`,
            //     to: `apurvkolte10@gmail.com`,
            //     subject: `SGSRO Enquiry Form - ${name}`,
            //     html: enquiry(name, message, email, mobile)
            // };

            // sendGmail.sendMail(mailOptions, function (err, info) {
            //     if (err)
            //         console.log(err);
            // });


        } catch (err) {
            console.log(err);
            return res.status(400).json({ success: false, message: "Enquiry could not be sent" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({ success: true });
        })
        .catch(error => {
            console.log(error.message);
            return res.status(400).json({ success: false, message: "Enquiry could not be sent" });
        });
});

//Get about us page  /api/about
exports.getAbout = catchAsyncErrors(async (req, res, next) => {
    let about;
    const sql = `SELECT * FROM about_us`;
    try {
        const rows = await queryDatabase(sql);
        about = rows[0];
        res.status(200).json({ success: true, about });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "Data is not found" });
    }
});


//Update about us page  /api/about
exports.updateAbout = catchAsyncErrors(async (req, res, next) => {
    const content = req.body.content ? trim(req.body.content) : "";
    const sql = "UPDATE about_us SET about = ?";

    try {
        await queryDatabase(sql, [content]);
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "Data is not found" });
    }
});


//Get contact us page  /api/contact
exports.getContact = catchAsyncErrors(async (req, res, next) => {
    const sql = `SELECT * FROM contact_us`;

    try {
        const rows = await queryDatabase(sql);
        const contact = rows[0];
        res.status(200).json({ success: true, contact });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: "Data is not found" });
    }
});


//Update contact us page  /api/contact
exports.updateContact = catchAsyncErrors(async (req, res, next) => {
    const content = req.body.content ? trim(req.body.content) : "";
    const sql = `UPDATE contact_us SET contact = ?`;

    try {
        await queryDatabase(sql, [content]);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: "Contact update failed" });
    }
});


exports.allEnquiry = catchAsyncErrors(async (req, res, next) => {
    const sql = `SELECT * FROM enquiry WHERE product_id = 0 ORDER BY id DESC`;
    const sql1 = `SELECT * FROM enquiry WHERE product_id != 0 ORDER BY id DESC`;

    try {
        const enquiry = await queryDatabase(sql);
        const productEnquiry = await queryDatabase(sql1);

        res.status(200).json({ success: true, enquiry, productEnquiry });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: "Operation could not be completed" });
    }
});

exports.deleteEnquiry = catchAsyncErrors(async (req, res, next) => {
    const id = req.query.id;
    const sql = 'DELETE FROM enquiry WHERE id = ?';

    try {
        await queryDatabase(sql, [id]);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: "Delete operation could not be completed" });
    }
});

exports.downlaod = catchAsyncErrors(async (req, res, next) => {
    // mysqlbackup()
    res.download(path.join(__dirname, `../mysqlbackup/dump${new Date().toISOString().substring(0, 10).replace(/:/g, '-')}.sql`))
})