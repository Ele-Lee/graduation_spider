const axios = require('axios')
const config = require('../config')

const ONE_SINGER_JSON = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg`

const SONG_NUM = config.SONG_NUM
const setSingerJsonParams = singerMid => Object.assign({}, config.commonParams, {
    page: 'list',
    order: 'listen',
    begin: 0,
    num: SONG_NUM,
    singermid: singerMid
})

const getSongDataList = singerMid => axios.get(ONE_SINGER_JSON, {
    params: setSingerJsonParams(singerMid)
})
// .then(res => {
//     let songMidList = []
//     let songDataList = res.data.data.list
//     for (let item of songDataList) {
//         let musicData = item.musicData
//         songMidList.push({
//             songmid: musicData.songmid,
//             songname: musicData.songname,
//             singer: musicData.singer[0].name,
//             albummid: musicData.albummid
//             // songurl: `ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=38`
//             // picurl: ``
//         })
//     }
//     // console.log(songMidList)
//     return songMidList
// });

// getSongDataList('0025NhlN2yWrP4').then(res => {
//     console.log(res)
// })

// let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?pcachetime=1518416522630&songmid=003OUlho2HcRHC&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0'
// axios.get(url, {
//     headers: {
//         referer: 'https://c.y.qq.com/',
//         host: 'c.y.qq.com'
//     }
// }).then(res => {
//     console.log(res.data)
// })

module.exports = getSongDataList