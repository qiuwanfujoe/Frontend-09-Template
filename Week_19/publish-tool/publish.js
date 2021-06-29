let http = require('http')
let fs = require('fs')

let archiver = require('archiver');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

//pipe方式
// fs.stat("./sample.html", (err,stats) => {
    let request = http.request({
        hostname:"127.0.0.1",
        port:8882,//发到虚拟机上的8882->8082(publish-server)
        // port:8082,//发到本机上的8082(publish-server)
    
        method:'POST',
        headers:{
            'Content-Type':'application/actet-stream',//流式传输
            // 'Content-Length':stats.size
        }
    },response => {
        console.log('success')
        console.log(response)
    })
    
    // //读流
    // let file = fs.createReadStream("./sample.html")
    // file.pipe(request);
    // file.on('end', () => {
    //     request.end()
    // });

    archive.directory("./sample/",false);
    archive.pipe(request)
    archive.finalize()
// })

// let request = http.request({
//     hostname:"127.0.0.1",
//     port:8882,//发到虚拟机上的8882->8082(publish-server)
//     // port:8082,//发到本机上的8082(publish-server)

//     method:'POST',
//     headers:{
//         'Content-Type':'application/actet-stream',//流式传输
//     }
// },response => {
//     console.log(response)
// })

// file.on('data', chunk => {
//     console.log(chunk.toString())
//     request.write(chunk)
// });
// file.on('end', chunk => {
//     console.log('read finished')
//     request.end(chunk)
// });