//ResetPasswordtoken
import crypto from "crypto";
// Generate reset token
const resetToken = crypto.randomBytes(20).toString('hex');
const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
const resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes





const [result] = await conn.query(
    "UPDATE users SET reset_password_token=?, reset_password_expire=? WHERE email=?",
    [resetPasswordToken, resetPasswordExpire, email]
);
const [result1] = await conn.query(
    "UPDATE users SET password=?, reset_password_token=NULL, reset_password_expire=NULL WHERE reset_password_token=?",
    [hashedPassword, token]
);
