const {Schema, model} = require("mongoose");

const ChampionshipSchema = new Schema({
  place:  {
    type: String,
    required: true
  },
  date: {
    type: Schema.Types.Date,
    required: true
  },  
  numberOfTeams: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  teams: {
      type: [Schema.Types.ObjectId]
  },
  prize: {
      type: [Object]
  },
  status: {
      type: String
  }
},{
  timestamps: true
})

const Championship = new model("Championship", ChampionshipSchema)
module.exports = Championship