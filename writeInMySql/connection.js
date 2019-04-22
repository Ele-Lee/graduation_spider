const mysql = require('mysql');
const config = require('../config')

const pool = mysql.createPool(config.mySqlConfig);

module.exports = pool