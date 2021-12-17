const userConfig = require("../config/users")

const getSecretKeyForUserType = (userType) => {
    if( userType === userConfig.userTypes.admin ) return process.env.ADMIN_SECRET_KEY
    if( userType === userConfig.userTypes.internal ) return process.env.INTERNAL_SECRET_KEY
    if( userType === userConfig.userTypes.external ) return process.env.EXTERNAL_SECRET_KEY
}

module.exports = {
    getSecretKeyForUserType
}