import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;


// Create JWT token (store OTP securely)
const token = jwt.sign(
    { email, otp },
    SECRET,
    { expiresIn: "10m" } // keep consistent
);

//token send to client


// 1. Verify token
const decoded = jwt.verify(token, SECRET);
if (decoded.otp !== otp) {
    return errorResponse("Invalid OTP", 400);
}




//db password encrytion

import bcrypt from "bcryptjs";
const hashedPassword = await bcrypt.hash(password, 10);

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    throw new Error("Invalid password");
}















