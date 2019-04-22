const fs = require('fs')
const path = require("path")

const checkPath = (p) => {
    try {
        fs.accessSync(path.join(__dirname, p), fs.F_OK);
    } catch (e) {
        return false
    }
    return true
}

module.exports = checkPath;