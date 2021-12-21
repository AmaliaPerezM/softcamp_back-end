const router = require("express").Router()
const isAuthFor = require("../middlewares/authorization")
const championshipService = require("../services/championship.service")

const root = router.route("/")
root.post( isAuthFor(["internal","admin"]), championshipService.createChampionship  )
root.patch( isAuthFor(["internal","admin", "external"]), championshipService.updateChampionship )
root.get( isAuthFor(["internal","admin"]), championshipService.getChampionships )

const withId = router.route("/:id")
withId.get( isAuthFor(["internal","admin", "external"]), championshipService.getChampionship )
withId.delete( isAuthFor(["internal","admin"]), championshipService.deleteChampionship )

module.exports = router
