const EventEmitter = require("events").EventEmitter
const User = require("../models/users.model")
const Logger = require("../utils/logger")
const bcrypt = require("bcrypt")
const usersConfig = require("../config/users")

class UserService extends EventEmitter {
    createNewUser = async (req ,res) => {
        const isGodMode = req.headers["x-god"] === process.env.GOD_MODE_KEY
        const userData = (({name, email, password, phoneNumber}) => ({name, email ,password, phoneNumber}))(req.body)
        try {
            const userType = req.user ? this.getCreateUserType(req.user.type, req.body.type) : this.getCeateUserTypeWithoutRequestUser(req.body.type, isGodMode)
            const user = await new User(userData)
            const token = await user.generateAuthToken(userType)
            await user.encryptPassword()
            user.tokens.push(token)
            user.type = userType
            this.emit("UserCreated", user)
            await user.save()
            res.status(201).json({userToken:token, id: user._id})
        } catch(err) {
            Logger.error(err)
            res.status(400).json(err.message)
        }
    }
    
    loginUser = async (req, res) => {
        const { email, password } = req.body
        try{
            const user = await User.findOne({email}) || {}
            const isValid = await bcrypt.compare(password, user.password || "" ) 
            if(Object.keys(user).length === 0 || !isValid) throw Error("the email or password is incorrect")
            const token = await user.generateAuthToken(user.type)
            await user.updateOne({tokens: [...user.tokens, token]})
            this.emit("UserLoged")
            res.status(200).json({token, ...user.getPublicData()})
        }catch(err){
            Logger.error(err)
            res.status(401).json(err.message)
        }
    }

    getCreateUserType = (requestUserType, newUserType) => {
        const userTypes = usersConfig.userTypes
        if(!newUserType) return userTypes.external
        if(requestUserType === userTypes.admin) return newUserType
        if(requestUserType === userTypes.internal) return this.validateInternalUserCreationPrivilages(newUserType) 
        if(requestUserType === userTypes.external) return this.validateExternalUserCreationPrivilages(newUserType) 
        return usersConfig.userTypes.external
    }

    getCeateUserTypeWithoutRequestUser(userType, isGodMode) {
        if(!userType) return usersConfig.userTypes.external
        if(isGodMode) return userType
        throw new Error("athorization error. Only valid users can create users with defined types")
    }

    validateInternalUserCreationPrivilages(newUserType) {
        if(newUserType === usersConfig.userTypes.external) return usersConfig.userTypes.external
        throw new Error("this user is not authorized to create a user of type " + newUserType)
    }

    validateExternalUserCreationPrivilages(newUserType) {
        if(newUserType) throw new Error("this user is not authorized to create a user of type " + newUserType)
    }
}

module.exports = new UserService()