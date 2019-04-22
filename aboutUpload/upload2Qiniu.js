const qiniu = require('qiniu')
const myConfig = require('../config')

//配置钥匙
const mac = new qiniu.auth.digest.Mac(myConfig.ACCESS_KEY, myConfig.SECRET_KEY)

const config = new qiniu.conf.Config()
//设置机房，华南
switch (myConfig.Zone) {
    case '华东':
        config.zone = qiniu.zone.Zone_z0
        break
    case '华北':
        config.zone = qiniu.zone.Zone_z1
        break
    case '华南':
        config.zone = qiniu.zone.Zone_z2
        break
    case '北美':
        config.zone = qiniu.zone.Zone_na0
        break
    default:
        break
}

const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

// 文件上传
const upload2Qiniu = (remoteFile, filePath, scope, type, callback) => {
    //配置bucket
    let options = {
        scope: scope,
        mimeLimit: type
    }
    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(mac)
    formUploader.putFile(uploadToken, remoteFile, filePath, putExtra,
        (respErr, respBody, respInfo) => {
            if (respErr) {
                console.log(`${remoteFile}上传出错`)
                throw respErr
            }
            if (respInfo.statusCode == 200) {
                console.log(`${remoteFile}上传完毕`)
                callback()
            } else {
                console.log(`非respErr，也非200`)
                console.log(respInfo.statusCode)
                console.log(respBody)
            }
        })
}

// upload2Qiniu('演员2.m4a', 'downloadData/薛之谦/songs/演员.m4a', myConfig.scope.songScope)

module.exports = upload2Qiniu