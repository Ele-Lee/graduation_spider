const axios = require('axios')
const config = require('../config')
const fs = require('fs')
const path = require('path')
const existsPath = require('../existsPath')

const SINGER_LIST_JSON = `https://c.y.qq.com/v8/fcg-bin/v8.fcg?`
const SINGER_LIST_JSON__PARAMS = Object.assign({}, config.commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1
})

const singerNum = config.SINGER_NUM
const singerDataList = []

getSingerDataList = () => axios.get(SINGER_LIST_JSON, {
    params: SINGER_LIST_JSON__PARAMS
}).then(res => {
    if (res.status !== 200 && res.data.code !== 0) return console.log('请求歌手list出错')
    console.log(`开始爬${singerNum}个歌手的歌信息`)
    let n = 0
    for (let item of res.data.data.list) {
        let singer = item.Fsinger_name.replace(/\s\([\S]*/g, '')
        singerDataList.push({
            singer: item.Fsinger_name,
            Findex: item.Findex,
            Fsinger_mid: item.Fsinger_mid,
            Fother_name: item.Fother_name
        })
        let dirPath = `${config.startPath}/${singer}`
        if (!existsPath(dirPath)) {
            fs.mkdirSync(path.join(process.cwd(), dirPath))
            fs.mkdirSync(path.join(process.cwd(), `${dirPath}/songs`))
            fs.mkdirSync(path.join(process.cwd(), `${dirPath}/images`))
            fs.mkdirSync(path.join(process.cwd(), `${dirPath}/lyrics`))
        }
        n++
        if (n === singerNum) break
    }
    return singerDataList
}).catch(err => {
    console.log('爬歌手list出错')
    console.log('---------------')
    console.log(err)
    console.log('---------------')
})

module.exports = getSingerDataList