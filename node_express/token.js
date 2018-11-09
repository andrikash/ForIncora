const jwt = require('jsonwebtoken');
const secretWorld = require('./constants/constants').secret;
const refreshSecret = require('./constants/constants').refreshSecret;
const resetPassWord = require('./constants/constants').resetPassWord;


module.exports.accessAndRefresh = (id, name) => {
    const accessToken = jwt.sign({id: id}, secretWorld, {expiresIn: 99999999});
    const refreshToken = jwt.sign({id: id, name: name}, refreshSecret, {expiresIn: 999999999999});
    const tokens = {
        accessToken,
        refreshToken
    };
    if (!tokens) throw new Error('TOKEN WAS NOT CREATED');
    return tokens;
};

module.exports.resetPassword = (id, userMail) => {
    const resetToken = jwt.sign({id, userMail}, resetPassWord, {expiresIn: 9999});
    if (!resetToken) throw new Error(`Token was not created`);
    return resetToken;
};