const bcrypt = require('bcrypt');

const comparePassword = async(password, hash) => {
    if(!password || !hash) {
        throw new Error('Password and hash are required');
    }
    return await bcrypt.compare(password, hash);
}

module.exports = { comparePassword };