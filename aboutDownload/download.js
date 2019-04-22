const fs = require('fs')
const request = require('request')

const downloadSong = (downloadLink, dir, fileName, success) =>
    request.get(`http://${downloadLink}`)
    .on('error', err => console.log(`downloadSong ${err}`))
    .pipe(fs.createWriteStream(`./${dir}/${fileName}.m4a`))
    .on('finish', success)


//type是图片类型，1是歌手图片，2是专辑图片
const downloadImage = (mid, dir, type, fileName, success) => {
    if (type !== 1 && type !== 2) throw `下载图片的类型有误`
    const imgUrl = `https://y.gtimg.cn/music/photo_new/T00${type}R300x300M000${mid}.jpg`
    request.get(imgUrl)
        .on('error', err => console.log(`downloadImage ${err}`))
        .pipe(fs.createWriteStream(`./${dir}/${fileName}`))
        .on('finish', success)
}

const downloadLyric = (songmid, songname, dir, success) => {
    const ONE_SONG_LYRIC = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=${songmid}`
    const REQUEST_HEADERS = {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
    }
    const options = {
        method: 'GET',
        url: ONE_SONG_LYRIC,
        headers: REQUEST_HEADERS
    }
    request(options, (error, response, body) => {
        if (error || response.statusCode !== 200) return console.log(`${songname}歌词下载出错`)
        let lyricJson = response.body
        if (typeof lyricJson === 'string') {
            let reg = /^\w+\(({[^()]+})\)$/
            let matches = lyricJson.match(reg)
            if (matches) {
                // lyricJson = JSON.parse(matches[1])
                lyricJson = matches[1]
            }
        }
        // console.log(lyricJson)
        let writable = fs.createWriteStream(`./${dir}/${songname}.json`)
        writable.write(lyricJson)
        writable.end(success)

    })
}

module.exports = {
    downloadSong,
    downloadImage,
    downloadLyric
}