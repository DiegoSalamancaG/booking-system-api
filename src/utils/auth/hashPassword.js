const bcrypt = require('bcrypt');

const saltRounds = 10;
const hashPassword = async(pass) => {
    if(!pass || typeof pass !== 'string') {
        throw new Error('Password must be a non-empty string');
    }
    try {
        return await bcrypt.hash(pass,saltRounds)
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
};

module.exports = {
    hashPassword
};