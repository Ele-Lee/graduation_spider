//默认外链域名
const DOMAIN_NAME_IMAGES = 'p5q31y6zv.bkt.clouddn.com'
const DOMAIN_NAME_LYRICS = 'p4cgrco32.bkt.clouddn.com'
const DOMAIN_NAME_SONGS = 'p4cgl73f4.bkt.clouddn.com'


//数据库链接配置
const mySqlConfig = {
    host: '39.108.180.108',
    user: 'root',
    password: 'root',
    database: 'music',
    port: 3306
}

//装下载东西的文件夹名
const startPath = 'downloadData'

//爬取当前页的几个歌手几首歌
const SINGER_NUM = 5
const SONG_NUM = 5

//七牛云的钥匙
const ACCESS_KEY = 'RxfnknOnkHVWrXgf4cjXzzZQi7mSFfGA_J3YcLkZ'
const SECRET_KEY = 'L2Bw2bi6skJdg8ImesrI2BGMp_XPgSpOoKQlldxJ'
const Zone = '华南'
const scope = {
    songScope: 'musicwebapp-songs',
    imageScope: 'musicwebapp-songs',
    lyricScope: 'musicwebapp-songs'
}
// const scope = {
//     songScope: 'musicwebapp-songs',
//     imageScope: 'musicwebapp-images',
//     lyricScope: 'musicwebapp-lyrics'
// }

//请求参数
const commonParams = {
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
}

module.exports = {
    DOMAIN_NAME_IMAGES,
    DOMAIN_NAME_LYRICS,
    DOMAIN_NAME_SONGS,
    mySqlConfig,
    startPath,
    SINGER_NUM,
    SONG_NUM,
    commonParams,
    ACCESS_KEY,
    SECRET_KEY,
    Zone,
    scope
}