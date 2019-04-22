const fs = require('fs')
const path = require('path')

/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */
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
        if (fs.statSync(filedir).isFile()) fileList.push(filename)
    })
    return fileList
}

//解析需要遍历的文件夹
// const filePath = path.resolve('downloadData/薛之谦/songs')

//调用文件遍历方法  
// console.log(fileDisplay(filePath))

module.exports = fileDisplay