const download = require('./download')
const async = require('async')

const DOWNLOAD_SIZE = 3 // 同时下载的数量

const processDownload = (dataList, dir, type, success) => {
    let queue = async.queue((songData, callback) => {
        // console.log('songData-------------')
        // console.log(dataList.length)
        // console.log(songData)
        // console.log('------------------')
        if (type === 'song') {
            console.log(`开始下载第${dataList.length - queue.length()}首歌《${songData.songname}》的歌曲...`)
            songData.songurl = songData.songurl.replace('ws', 'dl');
            download.downloadSong(songData.songurl, dir, songData.songname, () => {
                console.log(`《${songData.songname}》的歌曲下载完成`)
                callback()
            })
        } else if (type === 'image') {
            console.log(`开始下载第${dataList.length - queue.length()}首歌《${songData.songname}》的图片...`)
            download.downloadImage(songData.albummid, dir, 2, `${songData.songname}.jpg`, () => {
                console.log(`《${songData.songname}》的图片下载完成`)
                callback()
            })
        } else if (type === 'lyric') {
            download.downloadLyric(songData.songmid, songData.songname, dir, () => {
                console.log(`《${songData.songname}》的歌词下载完成`)
                callback()
            })
        } else {
            throw `下载的类型有误`
        }

    }, DOWNLOAD_SIZE)
    queue.drain = () => {
        console.log(`${dataList[0].singer}该部分${type}资源下载完毕`)
        success()
    }
    queue.push(dataList)
}

module.exports = processDownload