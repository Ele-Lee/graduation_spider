const pool = require('./connection')

exports.insertIntoSinger = (singerData) => {
    pool.getConnection((err, connection) => {
        pool.query('INSERT INTO singer SET ?', singerData, (error, results, fields) => {
            if (error) throw error;
            // console.log(results)
            // pool.end()
            connection.release();
        })
    })
}

exports.insertIntoSong = (songData) => {
    pool.getConnection((err, connection) => {
        pool.query('INSERT INTO song SET ?', songData, (error, results, fields) => {
            if (error) throw error;
            // console.log(results)
            // pool.end()
            connection.release();
        })
    })
}

exports.end = () => pool.end()
// const post = {
//     singer: '周杰伦',
//     Findex: 'Z',
//     Fsinger_mid: '0025NhlN2yWrP4',
//     Fother_name: 'Jay Chou',
//     avatar: 'fafawf'
// }

// insertIntoSinger(post)

// module.exports = {
//     insertIntoSinger,
//     insertIntoSinger
// }