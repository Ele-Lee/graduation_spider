const fs = require('fs')
const path = require('path')
const async = require('async')
const upload2Qiniu = require('./aboutUpload/upload2Qiniu')
const config = require('./config')

const SIZE = 1
/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */
const fileList1 = [];
const fileDisplay = (filePath) => {
    //根据文件路径读取文件，返回文件列表  
    // fs.readdir(filePath, function (err, files) {
    //     if (err) return console.warn(err)
    //     //遍历读取到的文件列表  
    //     const fileList = []
    //     files.forEach((filename) => {
    //         //获取当前文件的绝对路径  
    //         let filedir = path.join(filePath, filename)
    //         //根据文件路径获取文件信息，返回一个fs.Stats对象  
    //         if (fs.statSync(filedir).isFile()) fileList.push(filename)
    //     })
    //     return fileList
    // })
    const fileList = []
    let files = fs.readdirSync(filePath)
    files.forEach((filename) => {
        //获取当前文件的绝对路径  
        let filedir = path.join(filePath, filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象  
        // console.log(filedir)
        if (fs.statSync(filedir).isFile()) {
            let dirStar = filename.substring(filename.indexOf('.') + 1);
            //application/json image/* video/*
            let type = (d) => d == 'jpg' ? 'image/*' : d == 'm4a' ? 'video/*' : 'application/json'
            fileList1.push({
                filedir: filedir,
                filename: dirStar + '/' + filename,
                type: type(dirStar)
            })
            // fileList.push(filename)
        }
        else fileDisplay(filedir)
    })
    // console.log(fileList)
    return fileList
}

const filePath = path.resolve('downloadData')

//调用文件遍历方法  
// console.log(fileDisplay(filePath))
fileDisplay(filePath)
// console.log(fileList1)

const processUpLoad = (fileList1) => {
    let queue = async.queue((oneFile, callback) => {
        // loopUpload(songPath, config.scope.songScope, 'video/*')
        setTimeout(() => {
            upload2Qiniu(oneFile.filename, oneFile.filedir, config.scope.imageScope, oneFile.type, callback)

            // callback()
        }, 5000);
    }, SIZE)
    queue.drain = () => {
        // console.log(`${dataList[0].singer}该部分${type}资源下载完毕`)
        // success()
        console.log('done')
    }
    queue.push(fileList1)
}

processUpLoad(fileList1)