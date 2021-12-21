const {Schema, model} = require("mongoose")
const PlayerSchema = new Schema({
    nationalID : {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const Player = new model("Players", PlayerSchema)

module.exports = Player