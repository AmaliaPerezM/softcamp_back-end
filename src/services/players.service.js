const EventEmitter = require("events").EventEmitter
const Players = require("../models/Player.model")
const Logger = require("../utils/logger")

class PlayersService extends EventEmitter {
    createPlayer = async (req, res) => {
        try {
            const playerData = (({nationalID, firstName, lastName}) => ({nationalID, firstName, lastName}))(req.body)
            const newPlayer = await new Players(playerData)
            this.emit("PlayerCreated", newPlayer)
            await newPlayer.save()
            res.status(201).json(newPlayer)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        }
    }
} 

module.exports = new PlayersService()