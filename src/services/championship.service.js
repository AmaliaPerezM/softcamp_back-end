const EventEmitter = require("events").EventEmitter
const Championship = require("../models/championship.model")
const Logger = require("../utils/logger")

class ChampionshipService extends EventEmitter {
    createChampionship = async (req, res) => {
        const createChampionshipInput = req.body
        try {
            const newChampionship = await new Championship(createChampionshipInput)
            this.emit("championshipCreated", { newChampionship, req })
            await newChampionship.save()
            res.status(201).json(newChampionship)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        }
    }
    
    getChampionship = async(req, res) => {
        const championshipId = req.params.id
        try {
            const championship = await Championship.findById(championshipId)
            if(!championship) return res.status(404).json("championship not found")
            res.status(200).json(championship)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        } 
    }

    getChampionships = async (req, res) => {
        try {
            const championships = await Championship.find()
            res.status(200).json(championships)
        } catch (error) {
            res.status(400).json(error)
        } 
    }

    updateChampionship = async (req, res) => {
        try {
            const {championshipId, ...rest } = req.body
            const championship = Championship.findById(championshipId)
            await championship.updateOne({...rest})
            this.emit("championshipUpdated", championship, rest)
            res.status(200).json(championship)
        } catch (error) {
            res.status(400).json(error)
        }
    }
    
    deleteChampionship = async (req, res) => {
        try {
            const championshipId = req.params.id
            const response = await Championship.deleteOne({_id: championshipId})
            this.emit("championshipDeleted", response)
            res.status(200).json(response)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        }
    }
}

module.exports = new ChampionshipService()