const { connection, connect } = require("mongoose")
const Logger = require("../utils/logger")

class DataBaseService {
    constructor(_uri) {
        this.uri = _uri
    }

    registryEventListener(event, fn) {
        connection.on(event, fn)
    }

    async connectDataBase(options) {
        connect(this.uri, options, (error) => error ? Logger.error(error) : null)
    } 
}

module.exports = DataBaseService