const axios = require('axios')
const config = require('../config')

const ONE_SONG_JSON = `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg`

const setOneSongJsonParams = songmid => Object.assign({}, config.commonParams, {
    tpl: 'yqq_song_detail',
    songmid: songmid
})

const getOneSongJson = songmid => axios.get(ONE_SONG_JSON, {
    params: setOneSongJsonParams(songmid)
})

const getSongUrlList = songDataList => axios.all(songDataList.map(item => getOneSongJson(item.songmid)))
    .then(resList => resList.map(res => {
        let dataLen = res.data.length
        let jsonObj = JSON.parse(res.data.substring(1, dataLen - 1))
        let songid = jsonObj.data[0].id
        let songmid = jsonObj.data[0].mid
        let singer
        for (let item of jsonObj.data[0].singer) {
            if (!singer) {
                singer = item.name.replace(/\s\([\S]*/g, '')
            } else {
                singer = `${singer} / ${item.name.replace(/\s\([\S]*/g, '')}`
            }
        }
        // let singer = jsonObj.data[0].singer[0].name
        let songurl = jsonObj.url[songid]
        let songname = jsonObj.data[0].name
        let albummid = jsonObj.data[0].album.mid
        return {
            singer,
            songmid,
            songurl,
            songname,
            albummid
        }
    }))

let arr = [{
    songmid: '000sxzol11raSd',
    songname: '不该 (with aMEI)',
    singer: '周杰伦',
    albummid: '003RMaRI1iFoYd'
}
// {
//     songmid: '003uEbEr0jcW7c',
//     songname: '东风破',
//     singer: '周杰伦',
//     albummid: '000MkMni19ClKG'
// }
]
// getSongUrlList(arr).then(res => console.log(res))

module.exports = getSongUrlList