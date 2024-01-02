const crypto = require('crypto');

var hash = crypto.createHash('md5').update(password).digest('hex');