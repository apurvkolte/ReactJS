const util = require('util');
const connection = require('../config/connection');
var validator = require("email-validator");
const getResetPasswordToken = require('../utils/getResetPasswordToken');
const getEmailToken = require('../utils/getEmailToken');
const ErrorHandler = require('../utils/errorHandler');
const { trim } = require('../utils/trim');
const { offer } = require('../utils/offer');
const { otp } = require('../utils/otp');
const { resetPassword } = require('../utils/resetPassword');
const { enquiry } = require('../utils/enquiry');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendGmail = require('../utils/sendGmail');
const crypto = require('crypto')
const fs = require("fs");
const path = require("path");

//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    var filePath;
    var fileName;
    if (req.file) {
        filePath = (req.file.path).replace(/\\/g, "\\\\");
        fileName = req.file.filename;
    } else {
        fileName = '/images/default_avatar.jpg';
    }

    console.log("req.body", req.body);
    const { name, email, password, confirmPassword, mobile } = req.body;
    if (!password || password.length < 6) {
        return res.status(400).send({ message: "Your password must be longer than 6 characters" });
    }
    if (password === confirmPassword) {
        return res.status(400).send({ message: "Your passwords could not match" });
    }
    if (!name || name.length > 30) {
        return res.status(400).send({ message: "Please enter the valid name (cannot exceed 30 characters)" });
    }
    if (!email || !validator.validate(email)) {
        return res.status(400).send({ message: "Please enter the valid email" });
    }
    var hash = crypto.createHash('md5').update(password).digest('hex');

    const user = {
        name,
        email,
        hash,
        mobile,
        imageName: fileName,
        path: filePath
    }

    const sql = `insert into users(id, name, email, mobile, password, role, date, imageName, path,resetPasswordToken,
    resetPasswordExpire) values(NULL,'${user.name}', '${user.email}', ${user.mobile}, '${user.hash}', 'user', 
    Null,'${user.imageName}', '${user.path}', NULL,0);`;
    const query = util.promisify(connection.query).bind(connection);

    let userID;
    // console.dir(req.headers['content-type']);

    let result = async function () {
        try {
            const rows = await query(sql);
            userID = rows.insertId;
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "User registeration could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            sendToken(user, 200, res, userID)
        }).catch(error => {
            console.log("User registeration fail  :-", error.message);
            return res.status(400).send({ message: "User registeration could not be completed" });
        });
})


//Register a user => /api/v1/register
exports.emailVarification = catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email;
    const { getEmailCode } = getEmailToken.getEmailToken();
    const message = otp(getEmailCode);

    let result = async function () {
        try {
            const mailOptions = {
                from: `${process.env.GMAIL_FROM_EMAIL}`,
                to: `${email}`,
                subject: 'SGSRO  Verification Code',
                html: message
            }

            sendGmail.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
            })
        } catch (error) {
            return res.status(500).send({ message: "Verification of E-mail could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                data: getEmailCode
            })
        }).catch(error => {
            console.log(error.message)
            return res.status(500).send({ message: "Verification of E-mail could not be completed" });
        });
})


//Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    var hash = crypto.createHash('md5').update(password).digest('hex');
    if (password.length < 6) {
        return res.status(400).send({ message: "Invalid password" });
    }
    if (!validator.validate(email)) {
        return res.status(400).send({ message: "Invalid email" });
    }

    //Check if null email  and password is entered by user
    if (!email || !password) {
        return res.status(400).send({ message: 'Please enter email & password' });
    }

    const user = {
        email,
        hash,
        isAdmin,
        name
    }
    //Finding user in databases
    const sql = `select * from users where email='${email}' and password='${hash}';`;
    const query = util.promisify(connection.query).bind(connection);

    let userID;
    var isAdmin;
    var name;
    let result = async function () {
        try {
            const rows = await query(sql);
            user.isAdmin = rows[0].role;
            user.name = rows[0].name
            if (rows.length <= 0) {
                return res.status(401).send({ message: 'Invalid Email or Password' });
            }
            if (!rows) {
                return res.status(401).send({ message: 'Invalid Email or Password' });
            }
            userID = rows[0].id;
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Please enter correct email & password" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            sendToken(user, 200, res, userID, isAdmin)
        }).catch(error => {
            console.log("Please enter correct email & password", error.message);
            return res.status(400).send({ message: "Invalid email & password" });
        });
})

//Forget Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = { email: req.body.email }
    const { resetToken, resetPasswordToken, resetPasswordExpire } = getResetPasswordToken.getResetPasswordToken();
    if (!validator.validate(user.email)) {
        return res.status(400).send({ message: "Invalid email" });
    }

    const sql = `select email from users where email='${user.email}';`;
    const query = util.promisify(connection.query).bind(connection);

    const sql1 = ` update users set resetPasswordToken='${resetPasswordToken}',
                resetPasswordExpire='${resetPasswordExpire}' where email='${user.email}';`;

    let result = async function () {
        try {
            const rows = await query(sql);
            if (rows.length <= 0) {
                return res.status(400).send({ message: 'User not found with this email' });
            } else {
                // const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
                const resetUrl = `${req.protocol}://SGSRO .co.in/#/password/reset/${resetPasswordToken}`;
                // console.log("resetUrl", resetUrl);
                const message = resetPassword(resetUrl);

                try {
                    const mailOptions = {
                        from: `${process.env.GMAIL_FROM_EMAIL}`,
                        to: `${user.email}`,
                        subject: 'SGSRO  Password Recovery',
                        html: message
                    }

                    sendGmail.sendMail(mailOptions, function (err, info) {
                        if (err)
                            console.log(err)
                        else
                            console.log(info);
                    })
                } catch (error) {
                    return res.status(500).send({ message: "Wrong Email! Operation could not be completed" });;
                }
                const rows1 = await query(sql1);
            }
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Wrong Email! Operation could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                message: `Email send to:${user.email}`
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Operation could not be completed" });
        });
})

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //Hash URL token
    // const resetPasswordToken2 = crypto.createHash('sha256').update(req.query.token).digest('hex');
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({ message: 'Password could not match' });
    }

    var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
    let token = req.query.token;
    var user;

    const sql = `select id,password,resetPasswordToken,resetPasswordExpire from users where 
    resetPasswordToken='${token}';`;

    // console.log("sql", sql);

    const query = util.promisify(connection.query).bind(connection);

    const sql1 = `update users set password='${hash}', resetPasswordToken=NULL, resetPasswordExpire=0
    where resetPasswordToken='${token}';`;
    let userID;
    let result = async function () {
        try {
            const rows = await query(sql);
            // console.log("rows", rows);
            // console.log("rows",  parseInt(rows[0].resetPasswordExpire);
            // console.log("rows123",  parseInt(Date.now());
            // console.log("rows", typeof Date.now();

            if (parseInt(rows[0].resetPasswordExpire) >= parseInt(Date.now())) {
                if (!rows.length) {
                    return res.status(401).send({ message: 'Password could not reset' });
                }
                const rows1 = await query(sql1);
                // console.log("rows1", row1);
                userID = rows.id;
            } else {
                return res.status(400).send({ message: 'Password reset token has been invalid or expired ' });
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Password reset token has been invalid or expired" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(async value => {
            await sendToken(user, 200, res, userID)
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Password reset token has been invalid or expired" });
        });
})

//Get currently logged in user details => /apiv1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql = `select * from users where id=${EID};`;
    const query = util.promisify(connection.query).bind(connection);

    var user;
    let result = async function () {
        try {
            const rows = await query(sql);
            user = rows[0];

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "User is not found" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                user
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "User is not found" });
        });
})

//Get currently logged in user details => /apiv1/me
exports.getUserProfile1 = catchAsyncErrors(async (req, res, next) => {
    const sql = `select * from users where id=${req.user.id};`;
    const query = util.promisify(connection.query).bind(connection);

    var user;
    let result = async function () {
        try {
            const rows = await query(sql);
            user = rows[0];

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "User is not found" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                user
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "User is not found" });
        });
})


//Update / change password  => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;

    if (!oldPassword || oldPassword.length < 7 || !password || password.length < 7) {
        return res.status(400).send({ message: "Old password is incorrect" });
    }

    var hash = crypto.createHash('md5').update(oldPassword).digest('hex');
    var newHash = crypto.createHash('md5').update(password).digest('hex');
    console.log("c", hex);
    console.log("req.user.id", req.user.id);
    const sql2 = `select * from users where id=${req.user.id}`;
    const sql = `update users set password='${newHash}' where id=${req.user.id} and password='${hash}';`;

    console.log("req.body", sql2);
    console.log("req.body", sql);

    const query = util.promisify(connection.query).bind(connection);

    var user;
    let userID;
    let result = async function () {
        try {
            const rows = await query(sql);
            const rows2 = await query(sql2);
            if (!rows.affectedRows) {
                return res.status(400).send({ message: "Old password is incorrect" });
            }
            user = rows2;
            userID = rows2[0].id

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Operation could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            sendToken(user, 200, res, userID)
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Operation could not be completed" });
        });
})

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    console.log("newUserData", req.body);

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    }

    if (!newUserData) {
        return res.status(400).send({ message: 'Please enter name & email' });
    }
    if (!validator.validate(newUserData.email)) {
        return res.status(400).send({ message: 'Invalid email' });
    }


    const sql = `update users set name='${newUserData.name}', email='${newUserData.email}',
        mobile='${newUserData.mobile}' where id=${req.body.id};`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {

            const rows = await query(sql);

            if (rows.length === 0) {
                return res.status(400).send({ message: 'User profile could not updated' });
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: 'User profile could not updated' });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
            connection.getConnection(function (err, conn) {
                conn.end();
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: 'User profile could not updated' });
        });
})


//Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true

    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

//Admin Routes
//Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    let users;
    const sql = `select * from users`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            users = rows;
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Logout could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                users
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Logout could not be completed" });
        });
})

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    console.log(req.file);
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        role: req.body.role,
    }

    const sql = `update users set name='${newUserData.name}', mobile='${newUserData.mobile}', email='${newUserData.email}', role='${newUserData.role}' where id=${req.query.id};`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: `User could not found with id: ${req.query.id}` });
            }

        } catch (err) {
            console.log(err);
            res.status(404).send({ status: 1, message: `User could not found with id: ${req.query.id}` });
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Operation could not be completed` })
        });
})

//Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    let users;
    let image_id;
    var noOfReview
    var row6
    const sql = `delete from users where id=${EID};`;
    const sql1 = `select imageName from users where id = ${EID}`;
    const sql2 = `delete from address where user_id=${EID}; ALTER TABLE address AUTO_INCREMENT=1; `;
    // const sql3 = `delete from orders where user_id=${EID}; ALTER TABLE orders AUTO_INCREMENT=1; `;
    // const sql4 = `delete from review where user_id=${EID}; ALTER TABLE orders AUTO_INCREMENT=1; `;
    // const sql5 = ` select product_id from review where user_id =1`;

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            const rows2 = await query(sql2);
            // const rows3 = await query(sql3);
            // const rows4 = await query(sql4);

            try {
                fs.unlinkSync('uploads/' + rows1[0].imageName);
            } catch (err) {
                console.error(err);
            }
            // if user delete update review
            // const product_id = await query(sql5);
            // product_id.map(async (pid) => {
            //     noOfReview = `update products set ratings=(select avg(rating) from review where product_id=(${pid.product_id}),
            //     numOfReviews=(SELECT COUNT(${pid.product_id}) FROM review where product_id=(${pid.product_id}) where id=${pid.product_id};`;
            //     row6 = await query(noOfReview);
            // })
            users = rows;
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: `Delete operation could not be completed` })
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                users
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Delete operation could not be completed` })
        });
})

//Add Multiple Address
//Get all addresses => /api/v1/me/update/address/:id
exports.allAddress = catchAsyncErrors(async (req, res, next) => {
    let address;
    const sql = `select * from address where user_id=${req.user.id}`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            address = rows;
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: `Address could not be identified with this ID: ${req.user.id}` });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                address
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Address could not be identified with this ID" });
        });
})

// Get address details   =>   /api/v1//me/update/myaddress/:id
exports.getAddressDetails = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    let address;
    const sql = `select * from address where id=${EID}`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            address = rows[0];
            if (rows.length <= 0) {
                res.status(404).send({ status: 1, message: `Address could not be identified with id: ${EID}` });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: `Address could not be identified with ID: ${EID}` })
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                address
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Address could not be identified with ID` });
        });
})


// Update address   =>   /api/v1//me/update/myaddress/:id
exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    // const newUserData = {
    //     address: req.body.address,
    //     city: req.body.city,
    //     country: req.body.country,
    //     mobile: req.body.mobile,
    //     postalCode: req.body.postalCode
    // }

    const name = req.body.name ? trim(req.body.name) : "";
    const mobile = req.body.mobile ? trim(req.body.mobile) : "";
    const flat = req.body.flat ? trim(req.body.flat) : "";
    const area = req.body.area ? trim(req.body.area) : "";
    const landmark = req.body.landmark ? trim(req.body.landmark) : "";
    const city = req.body.city ? trim(req.body.city) : "";
    const state = req.body.state ? trim(req.body.state) : "";
    const country = req.body.country ? trim(req.body.country) : "";
    const postalCode = req.body.postalCode ? trim(req.body.postalCode) : "";

    const sql = `update address set name="${name}", mobile="${mobile}", flat="${flat}", area="${area}", 
    landmark="${landmark}", city="${city}", state="${state}", country="${country}", postalCode="${postalCode}"
    where id=${EID};`;
    const query = util.promisify(connection.query).bind(connection);


    let result = async function () {
        try {
            const rows = await query(sql);
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: `Address could not be identified with ID: ${EID}` });
            }
        } catch (err) {
            console.log(err);
            res.status(404).send({ status: 1, message: `Address could not be identified with ID: ${EID}` });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Address could not be identified with ID` });
        });
})

//Delete address => /me/update/myaddress/:id
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql = `delete from address where id=${EID}; ALTER TABLE address AUTO_INCREMENT=1; `;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
        } catch (err) {
            console.log(err);
            res.status(404).send({ status: 1, message: `Address could not be identified with id: ${EID}` });
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Address could not be identified with ID` })
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


    const sql = `insert into address(id, user_id,name,mobile,gstn,flat,area,landmark,city,state,country,postalCode, main)
     values(NULL,${req.user.id}, "${name}","${mobile}","${gstn}","${flat}","${area}","${landmark}","${city}", "${state}", 
     "${country}","${postalCode}", 0);`;

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {

            const rows = await query(sql);
            address = rows[0]
        } catch (err) {
            console.log(err);
            res.status(404).send({ status: 1, message: `Address could not be added ` });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                address
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: `Operation could not be completed` });
        });
})


//set default address => /api/v1/me/update/myaddress/default/:id
exports.defaultAddress = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql = `update address set main = 0 where user_id =${req.user.id};
    update address set main = 1 where id =${EID};`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
        } catch (err) {
            console.log(err);
            res.status(404).send({ status: 1, message: `Address could not set as default` });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        }).catch(error => {
            console.log(error.message)
            return res.status(400).send({ message: `Operation could not be completed` });
        });
})


//Share Promocode => /admin/coupons/share/:id
exports.sharePromocode = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const eid = req.body;
    // eid.map((id) => {
    //     console.log("sed", id);
    // })
    const sql = `select * from coupon where id=${EID}`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);

            if (rows.length <= 0) {
                return res.status(400).send({ message: 'Coupon not found' });
            } else {
                const url = `https://SGSRO .co.in/`;
                const message = offer(rows[0]);

                try {
                    eid.map((user) => {
                        const mailOptions = {
                            from: `${process.env.GMAIL_FROM_EMAIL}`,
                            to: `${user}`,
                            subject: 'Best Offer Coupon Code - SGSRO ',
                            html: message
                        }

                        sendGmail.sendMail(mailOptions, function (err, info) {
                            if (err)
                                console.log(err)
                            else
                                console.log(info);
                        })
                    })

                } catch (error) {
                    console.log("err coupon email send")
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: "Wrong Email! Operation could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Operation could not be completed" });
        });
})

//send enquiry => /enquiry
exports.sendEnquiry = catchAsyncErrors(async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const message = req.body.message;
    // const pName = req.body.pName ? req.body.pName : "-";
    // const quantity = req.body.quantity ? req.body.quantity : "-";

    let result = async function () {
        try {
            const mailOptions = {
                from: `${process.env.GMAIL_FROM_EMAIL}`,
                to: `apurvkolte10@gmail.com`,
                subject: `SGSRO  Enquiry Form-${name}`,
                html: enquiry(name, message, email, mobile)
            }

            sendGmail.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
            })

        } catch (err) {
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
        });
})


//Get about us page  /api/about
exports.getAbout = catchAsyncErrors(async (req, res, next) => {
    var about;
    const sql = `select * from about_us`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            about = rows[0];

        } catch (err) {
            console.log(err);
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                about
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Data is not found" });
        });
})

//Update about us page  /api/about
exports.updateAbout = catchAsyncErrors(async (req, res, next) => {
    const sql = `update about_us set about = "${trim(req.body.content)}";`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);

        } catch (err) {
            console.log(err);
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Data is not found" });
        });
})

//Get contact us page  /api/contact
exports.getContact = catchAsyncErrors(async (req, res, next) => {
    var contact;
    const sql = `select * from contact_us`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            contact = rows[0];

        } catch (err) {
            console.log(err);
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                contact
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Data is not found" });
        });
})

//Update contact us page  /api/contact
exports.updateContact = catchAsyncErrors(async (req, res, next) => {
    const sql = `update contact_us set contact = "${trim(req.body.content)}";`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);

        } catch (err) {
            console.log(err);
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(400).send({ message: "Contact is not found" });
        });
})



exports.downlaod = catchAsyncErrors(async (req, res, next) => {
    // mysqlbackup()
    res.download(path.join(__dirname, `../mysqlbackup/dump${new Date().toISOString().substring(0, 10).replace(/:/g, '-')}.sql`))
})