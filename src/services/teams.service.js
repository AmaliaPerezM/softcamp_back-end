const EventEmitter = require("events").EventEmitter
const Team = require("../models/teams.model")
const Logger = require("../utils/logger")

class TeamsService extends EventEmitter {
    createTeam = async (req, res) => {
        const createTeamInput = req.body
        try {
            const newTeam = await new Team(createTeamInput)
            this.emit("TeamCreated", { newTeam, req })
            await newTeam.save()
            res.status(201).json(newTeam)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        }
    }

    addPlayersToTeam = async (req, res) => {
        const teamId = req.params.id
        const {teamName, membersIds} = req.body
        try {
            const team = teamId ? await Team.findById(teamId) : await Team.findOne({name:teamName})
            if(!team) return res.status(404).json("Team not found")
            const teamMembersStrings = team.members.map( memberObjId => memberObjId.toString())
            team.members = [...new Set([...membersIds, ...teamMembersStrings])]
            await team.save()
            this.emit("NewMemebersAddedToTeam", team )
            res.status(200).json(team)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        }
    }
    
    getTeam = async(req, res) => {
        const TeamId = req.params.id
        try {
            const team = await Team.findById(TeamId)
            if(!team) return res.status(404).json("Team not found")
            res.status(200).json(Team)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        } 
    }
    
    getTeams = async (req, res) => {
        try {
            const Teams = await Team.find()
            res.status(200).json(Teams)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        } 
    }

    updateTeam = async (req, res) => {
        try {
            const {TeamId, ...rest } = req.body
            const Team = Team.findById(TeamId)
            await Team.updateOne({...rest})
            this.emit("TeamUpdated", Team, rest)
            res.status(200).json(Team)
        } catch (error) {
            res.status(400).json(error)
        }
    }
    
    deleteTeam = async (req, res) => {
        try {
            const TeamId = req.params.id
            const response = await Team.deleteOne({_id: TeamId})
            this.emit("TeamDeleted", response)
            res.status(200).json(response)
        } catch (error) {
            Logger.error(error)
            res.status(400).json(error)
        }
    }
}

module.exports = new TeamsService()