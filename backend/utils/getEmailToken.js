const crypto = require('crypto')


exports.getEmailToken = () =>{
    // Generate token
    const getEmailCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    return {getEmailCode}

}

