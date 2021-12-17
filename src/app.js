require("dotenv").config({path: __dirname + `/config/.env.${process.env.NODE_ENV || "prod"}`})
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const Db = require("./config/db")
const championshipRouter = require("./controllers/championship.controller")
const usersRouter = require("./controllers/users.controller")

const dataBase = new Db(process.env.DB_URI || "mongodb://127.0.0.1:27017/softcamp")
dataBase.registryEventListener("open", () => console.log("connection to database stablished"))
const options = { 
    useNewUrlParser : true,
    useUnifiedTopology : true,
}
dataBase.connectDataBase(options)

const app = express()
app.use(express.json())
app.use(cors({
    exposedHeaders:['Content-Pages','Content-Total']
}))
app.use(morgan("common"))
app.use(helmet())
app.use("/championships", championshipRouter )
app.use("/users", usersRouter )

module.exports = app