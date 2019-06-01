let path = require('path');
let Ftp = require("ftp");
let config = require("./config");
let travel = require("./utils");
let client = new Ftp();

client.connect(config.serve);
client.on('ready', function () {
    travel( localDir, function (pathname, next) {
        let dirName = path.dirname(pathname).replace(config.localDir, config.serveDir);
        let serveFilePath = path.join(dirName, path.basename(pathname));
        client.get(dirName, function (err, list) {
            if (err) {
                client.mkdir(dirName, true, function (err) {
                    client.put(pathname, serveFilePath, function (err) {
                        if (err) {
                            console.log("本地路径", pathname)
                            console.log("服务器", serveFilePath)
                            console.log("上传失败");
                            console.log(err)
                        } else {
                            console.log("本地路径", pathname)
                            console.log("服务器", serveFilePath)
                            console.log("上传成功");
                            next()
                        }
                    })
                })
            } else {
                client.put(pathname, serveFilePath, function (err) {
                    if (err) {
                        console.log("本地路径", pathname)
                        console.log("服务器", serveFilePath)
                        console.log("上传失败");
                        console.log(err)
                    } else {
                        console.log("本地路径", pathname)
                        console.log("服务器", serveFilePath)
                        console.log("上传成功");
                        next()
                    }
                })
            }
        })
    }, function () {
        console.log("文件上传完成");
        client.end();
    })
})

client.on("error", function (err) {
    console.log("链接失败");
    console.log(err)
})

client.on('greeting', function (msg) {
    console.log(msg)
})

// client.on('close',function (hadErr) {
//     console.log(hadErr)
// })
client.on("end", function () {
    console.log('上传完成！！！！')
})