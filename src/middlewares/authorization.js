const jwt = require("jsonwebtoken")
const { getSecretKeyForUserType } = require("../utils/secrets")
const User = require("../models/users.model")


const isAuthFor = (authorizedTypes, config = { isCreateUser: false }) => async function( req, res, next ){
    const token = req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null
    try{
        const { _id } = getUserIdByAuthorizedTypes(authorizedTypes, token) || {_id: null}
        const user = await User.findOne({_id})
        if(!user && config.isCreateUser) return next()
        if(!user) return res.status(404).json("the user asigned to this token can no longer be found. Please verify if the account still exist")
        req.user = user
        req.token = token
        next()
    }catch(err){
        if(token) {
            const user = await User.findOne({tokens:token})
            if(user) {
                const newTokens = user.tokens.filter(t => t !== token)
                await User.updateOne({_id:user._id}, {tokens:newTokens})
            }
        }
        if(err) res.status(401).json("the user is not authorized")
    }  
}

const getUserIdByAuthorizedTypes = (authorizedTypes, token) => {
    return authorizedTypes.reduce((prev, curr) => {
        if (prev) return prev
        try {
            return jwt.verify(token, getSecretKeyForUserType(curr))
        } catch (error) {               
            return undefined
        }
     }, undefined)
}


module.exports = isAuthFor