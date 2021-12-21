const router = require("express").Router()
const isAuthFor = require("../middlewares/authorization")
const teamsService = require("../services/teams.service")

const root = router.route("/")
root.post( isAuthFor(["admin", "external"]), teamsService.createTeam )

const withId = router.route("/:id")
withId.patch( isAuthFor(["admin", "external"]), teamsService.addPlayersToTeam )
withId.get( isAuthFor(["admin", "external"]), teamsService.getTeam )

module.exports = router