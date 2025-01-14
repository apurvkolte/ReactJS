const crypto = require('crypto');

var hash = crypto.createHash('md5').update(password).digest('hex');





//OR

//or use this is good one & secure than hash
//mostaly use for password
import bcrypt from 'bcrypt';
//store password
const hashedPassword = await bcrypt.hash(password, 10);

//check password 
const isMatch = await bcrypt.compare(password, storedHashedPassword);