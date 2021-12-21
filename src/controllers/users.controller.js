const router = require("express").Router()
const isAuthFor = require("../middlewares/authorization")
const userService = require("../services/users.service")

const root = router.route("/")
root.post( isAuthFor(["admin", "internal", "external"], {isCreateUser: true}), userService.createNewUser )

router.route("/login").post(userService.loginUser)

module.exports = router