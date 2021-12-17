const fs = require("fs/promises")

class Logger {
    static async log(data) {
        const registry = (new Date().toUTCString) + ` - ${data}\n`
        try {
            await fs.appendFile(`${__dirname}/logs/system`, registry)
        } catch (error) {
            console.error(data)
        }
    }

    static async error(error) {
        const registry = "ERROR:" + new Date().toUTCString() + ` - ${error}\n`
        try {
            await fs.appendFile(`${__dirname}/../../logs/system`, registry)
        } catch (error) {
            console.error(error.message)
        }
    }
}

module.exports = Logger