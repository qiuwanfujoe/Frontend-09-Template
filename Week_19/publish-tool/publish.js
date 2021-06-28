let http = require('http')
let fs = require('fs')

let request = http.request({
    hostname:"127.0.0.1",
    port:8882,//发到虚拟机上的8882->8082(publish-server)
    method:'POST',
    headers:{
        'Content-Type':'application/actet-stream',//流式传输

    }
},response => {
    console.log(response)
})

//读流
let file = fs.createReadStream("./sample.html")
file.on('data', chunk => {
    console.log(chunk.toString())
    request.write(chunk)
});
file.on('end', chunk => {
    console.log('read finished')
    request.end(chunk)
});