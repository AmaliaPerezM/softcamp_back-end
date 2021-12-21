const {Schema, model} = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { emailValidators, passwordValidators } = require("../utils/validators") 
const { getSecretKeyForUserType } = require("../utils/secrets")

const UserModel = new Schema({
    name:{
        type: String,
        trim: true,
        uppercase: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        validate: emailValidators()
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidators.bind(this)
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 13,
        trim: true
    },
    passwordIsEncrypted:{
        type: Boolean,
        default: false
    },
    tokens : [
        {
        type: String,
        }
    ],
    type: {
        type: String,
    }
}, {
    timestamps: true
})

UserModel.methods.generateAuthToken = async function (userType) {
    const secretKey = getSecretKeyForUserType(userType)
    return jwt.sign({_id: this._id.toString()}, secretKey, {expiresIn: "1 days"})
}

UserModel.methods.encryptPassword = async function () {
    this.password = await bcrypt.hash(this.password, 8)
    return this.password
}

UserModel.methods.getPublicData = function () {
    return (({name, email, phoneNumber, type}) => ({name, email, phoneNumber, type}))(this) 
}

const User = new model("Users", UserModel)
module.exports = User
