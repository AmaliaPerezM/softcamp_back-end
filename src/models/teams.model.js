const { Schema, model } = require("mongoose")

const TeamSchema = new Schema({
members: {
    type: [Schema.Types.ObjectId]
},
name: {
    type: String,
    require: true,
},
points: {
    type: Number
}
},{
    timestamps: true
})

const Team = new model("Teams", TeamSchema)
module.exports = Team