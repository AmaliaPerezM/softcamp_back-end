const router = require("express").Router()
const isAuthFor = require("../middlewares/authorization")
const playersService = require("../services/players.service")

const root = router.route("/")
root.post( isAuthFor(["admin", "external"]), playersService.createPlayer )

module.exports = router