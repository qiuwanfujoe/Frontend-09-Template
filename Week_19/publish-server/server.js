let http = require('http')
let fs = require('fs')

http.createServer(function(request,res) {
    let outFile = fs.createWriteStream("./public/index.html");
    request.on('data', chunk => {
        outFile.write(chunk)
    });
    request.on('end', chunk => {
        outFile.end()
        res.end('Success')
    });
}).listen(8080);