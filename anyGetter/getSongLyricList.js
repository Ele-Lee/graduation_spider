const axios = require('axios')
const config = require('../config')
const fs = require('fs')
const request = require('request')
const download = require('../aboutDownload/download')

const ONE_SONG_LYRIC = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg`
const REQUEST_HEADERS = {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
}

const setOneSongJsonParams = songmid => Object.assign({}, config.commonParams, {
    pcachetime: +new Date(),
    g_tk: 67232076,
    // callback: 'lyric_json',
    songmid: songmid
})

const getOneLyric = songmid => axios.get(ONE_SONG_LYRIC, {
    params: setOneSongJsonParams(songmid),
    headers: REQUEST_HEADERS
})

const getSongLyric = songDataList => axios.all(songDataList.map(item => getOneLyric(item.albummid)))
    .then(resList => resList.map(res => {
        download.downloadLyric(res.data)
    }))

getOneLyric('002ejEdb4KTwBw').then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
        var reg = /^\w+\(({[^()]+})\)$/
        var matches = ret.match(reg)
        if (matches) {
            ret = JSON.parse(matches[1])
        }
    }
    console.log(matches[0])
    return ret
}).then(res => console.log())

module.exports = getOneLyric