const crypto = require('crypto')


exports.getEmailToken = () => {
    // Generate token
    // const getEmailCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const getEmailCode = Math.floor(1000 + Math.random() * 9000);

    return { getEmailCode }

}

