const jwt = require('jsonwebtoken');
// Generate an Access Token for the given User ID
function generateAccessToken(userId) {
    
    const expiresIn = '1 hour';
    const audience = 'aud';
    const issuer = 'iss';
    const secret = 'secret';

    const token = jwt.sign({}, secret, {
        expiresIn: expiresIn,
        audience: audience,
        issuer: issuer,
        subject: userId.toString()
    });
    return token;
}

module.exports = {
    generateAccessToken: generateAccessToken
}
