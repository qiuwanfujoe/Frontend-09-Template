let http = require('http')
let fs = require('fs')

http.createServer(function(request,res) {
    let outFile = fs.createWriteStream("../server/public/index.html");
    console.log(request.headers)
    request.on('data', chunk => {
        console.log(chunk.toString())
        outFile.write(chunk)
    });
    request.on('end', chunk => {
        outFile.end()
        res.end('Success')
    });
}).listen(8082);