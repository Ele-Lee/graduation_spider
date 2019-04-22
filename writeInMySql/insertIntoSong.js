const pool = require('./connection')

const insertIntoSinger = (songData) => {
    pool.getConnection((err, connection) => {
        pool.query('INSERT INTO song SET ?', songData, (error, results, fields) => {
            if (error) throw error;
            // console.log(results)
            // pool.end()
            connection.release();
        })
    })
}

module.exports = insertIntoSinger