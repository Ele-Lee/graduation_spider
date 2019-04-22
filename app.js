const axios = require('axios')
const fs = require('fs')
const path = require('path')

const config = require('./config')
const existsPath = require('./existsPath')
const download = require('./aboutDownload/download')
const getSingerDataList = require('./anyGetter/getSingerDataList')
//下面函数只获取一个singermid的歌信息
const getSongDataList = require('./anyGetter/getSongDataList')
const getSongUrlList = require('./anyGetter/getSongUrlList')
// const getSongLyriclList = require('./anyGetter/getSongLyriclList')
const processDownload = require('./aboutDownload/processDownload')
const traverse = require('./aboutUpload/traverse')
const upload2Qiniu = require('./aboutUpload/upload2Qiniu')
// const insertIntoSinger = require('./writeInMySql/insertIntoSinger')
// const insertIntoSong = require('./writeInMySql/insertIntoSong')
const insertIntoTable = require('./writeInMySql/insertIntoTable')

if (!existsPath(config.startPath)) {
    fs.mkdirSync(config.startPath)
}

getSingerDataList().then(singerDataList => {
    axios.all(singerDataList.map(item => {
        item.avatar = `${config.DOMAIN_NAME_IMAGES}/${item.singer}.jpg`
        insertIntoTable.insertIntoSinger(item)
        return getSongDataList(item.Fsinger_mid)
    }))
        .then(songDataList => songDataList.map(oneSongData => {
            let songDataArray = []
            let songDataList = oneSongData.data.data.list
            let singer = oneSongData.data.data.singer_name.replace(/\s\([\S]*/g, ''), singermid = oneSongData.data.data.singer_mid
            for (let i in songDataList) {
                let musicData = songDataList[i].musicData
                let singerAndOthers
                for (let j in musicData.singer) {
                    if (!singerAndOthers) {
                        singerAndOthers = musicData.singer[j].name.replace(/\s\([\S]*/g, '')
                    }
                    singerAndOthers = `${singerAndOthers} / ${musicData.singer[j].name.replace(/\s\([\S]*/g, '')}`
                }
                let songname = musicData.songname
                const lyricUrlStart = `http://${config.DOMAIN_NAME_LYRICS}/${songname}`
                const songUrlStart = `http://${config.DOMAIN_NAME_SONGS}/${songname}`
                const imageUrlStart = `http://${config.DOMAIN_NAME_IMAGES}/${songname}`
                let oneSongData = {
                    songmid: musicData.songmid,
                    songname: songname,
                    // albummid: musicData.albummid,
                    singer: singerAndOthers,
                    // singermid: singermid,
                    lyric: `${lyricUrlStart}.json`,
                    songurl: `${songUrlStart}.m4a`,
                    picurl: `${imageUrlStart}.jpg`
                }
                insertIntoTable.insertIntoSong(oneSongData)
                songDataArray.push(oneSongData)
            }
            let singerDirPath = `${config.startPath}/${singer}`
            download.downloadImage(singermid, singerDirPath, 1, `${singer}.jpg`, () => {
                console.log(`${singer}的歌手图片下载完成`)
                // upload2Qiniu(`${singer}.jpg`, `${singerDirPath}/${singer}.jpg`, config.scope.imageScope, null)
                // console.log(`${singer}的歌手图片上传成功`)
            })
            return { songDataArray, singer }
        })).then(allSongDataArray => {
            for (let item of allSongDataArray) {
                let trueSinger = item.singer
                getSongUrlList(item.songDataArray).then(dataList => {
                    let singer = trueSinger
                    // let singer = allSongDataArray.singer
                    let singerDirPath = `${config.startPath}/${singer}`
                    let songPath = `${singerDirPath}/songs`,
                        imagePath = `${singerDirPath}/images`,
                        lyricPath = `${singerDirPath}/lyrics`
                    const loopUpload = (songPath, scope, type) => {
                        let fileList = traverse(songPath)
                        for (let fileItem of fileList) {
                            upload2Qiniu(fileItem, `./${songPath}/${fileItem}`, scope, type)
                        }
                    }
                    console.log(`开始下载歌手 ${singer} 的资源`)

                    processDownload(dataList, lyricPath, 'lyric', () => {
                        // console.log(`执行${singer}的歌词上传`)
                        // loopUpload(lyricPath, config.scope.lyricScope, 'application/json')
                    })
                    processDownload(dataList, imagePath, 'image', () => {
                        // console.log(`执行${singer}的图片上传`)
                        // loopUpload(imagePath, config.scope.imageScope, 'image/*')
                    })
                    processDownload(dataList, songPath, 'song', () => {
                        // console.log(`执行${singer}的歌曲上传`)
                        // loopUpload(songPath, config.scope.songScope, 'video/*')
                        // insertIntoTable.end()
                    })
                    return dataList
                }).then(res => {
                    console.log('done')
                })
            }
        })
}).catch(err => console.log(`catch in app.js  ${err}`))